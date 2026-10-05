import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { MiniS3Mockup } from "@/components/ProjectMockups";
import {
  MiniS3ArchitectureDiagram,
  SequenceDiagram,
  failurePath,
  readPath,
  returnPath,
  writePath,
} from "@/components/MiniS3Visuals";
import RequestPathTabs from "@/components/RequestPathTabs";
import MiniS3Simulator from "@/components/MiniS3Simulator";
import HashRingExplorer from "@/components/HashRingExplorer";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Mini-S3 — Case Study",
  description:
    "A self-healing distributed object store in Java 21 and Spring Boot: 3× replication placed by consistent hashing, quorum writes, checksum-verified reads, heartbeat failure detection, and automatic repair — with an interactive cluster simulator.",
};

const project = projects.find((p) => p.slug === "mini-s3")!;

const pathPanels = [
  {
    id: "write",
    label: "Write",
    title: "Upload: quorum write",
    diagram: <SequenceDiagram {...writePath} />,
    points: [
      {
        title: "Metadata before bytes",
        body: "The object row goes in as PENDING before any byte reaches a storage node. If the API crashes mid-upload, the garbage is visible to the worker — never an invisible orphan.",
      },
      {
        title: "Return at W = 2",
        body: "Latency tracks the second-fastest node, not the slowest, and one failure never blocks a write. If the third copy never lands, the repair worker makes it.",
      },
      {
        title: "Last writer wins, safely",
        body: "Every upload gets a fresh UUID, so concurrent writers never share a file. A per-key advisory lock serializes commits; a partial unique index allows one live version.",
      },
    ],
  },
  {
    id: "read",
    label: "Read",
    title: "Download: verified read + read repair",
    diagram: <SequenceDiagram {...readPath} />,
    points: [
      {
        title: "One verified copy is enough",
        body: "Objects are immutable and the stored SHA-256 is authoritative, so one matching copy is provably correct. No need to read two and compare (R = 1).",
      },
      {
        title: "Reads find damage",
        body: "A missing or corrupt copy is dropped from the replicas table. The object is now under-replicated, so the worker rebuilds it on its next pass.",
      },
      {
        title: "Load spreads by default",
        body: "Live replicas are shuffled per request, so reads fan out across holders instead of hammering the first one in the list.",
      },
    ],
  },
  {
    id: "failure",
    label: "Node dies",
    title: "Failure: detect, then heal",
    diagram: <SequenceDiagram {...failurePath} />,
    points: [
      {
        title: "Dead or slow? Pick a timeout",
        body: "In an asynchronous network the two look identical. Six seconds (three missed heartbeats) keeps the demo fast; production systems wait minutes to avoid re-replication storms.",
      },
      {
        title: "Level-triggered repair",
        body: "The worker compares desired state (3 live copies) with actual state and closes the gap — so it heals any cause: a dead node, a corrupt copy, a failed third write, a crashed repair.",
      },
      {
        title: "A table as a work queue",
        body: "FOR UPDATE SKIP LOCKED lets any number of workers claim different rows with zero coordination code.",
      },
    ],
  },
  {
    id: "return",
    label: "Node returns",
    title: "Recovery: trim the surplus",
    diagram: <SequenceDiagram {...returnPath} />,
    points: [
      {
        title: "Surplus, not conflict",
        body: "The returning node's copies are never stale, because objects never change — so they simply rejoin, and the temporary repair copies become the surplus.",
      },
      {
        title: "The ring decides who stays",
        body: "The garbage collector keeps the three holders the ring prefers — the original placement — so the cluster converges back to where new writes would go.",
      },
      {
        title: "Metadata first, then bytes",
        body: "The replica row is removed before the file, so no in-flight read can be routed to a copy that is about to disappear.",
      },
    ],
  },
];

const tables = [
  {
    name: "nodes",
    purpose: "Registered by the first heartbeat.",
    cols: [
      ["id", "text · pk"],
      ["url", "text"],
      ["status", "UP | DOWN"],
      ["last_heartbeat", "timestamptz"],
    ],
  },
  {
    name: "objects",
    purpose: "One row per uploaded version.",
    cols: [
      ["id", "uuid · pk"],
      ["bucket, object_key", "text"],
      ["size_bytes", "bigint"],
      ["content_type", "text"],
      ["sha256", "text"],
      ["status", "PENDING | COMMITTED | DELETED"],
      ["created_at", "timestamptz"],
    ],
  },
  {
    name: "replicas",
    purpose: "Where each copy physically lives.",
    cols: [
      ["object_id", "uuid → objects"],
      ["node_id", "text → nodes"],
      ["created_at", "timestamptz"],
      ["", "pk (object_id, node_id)"],
    ],
  },
];

const sql = [
  {
    comment: "one live version per key — enforced by the database, not the code",
    code: "CREATE UNIQUE INDEX objects_live_key ON objects (bucket, object_key)\n  WHERE status = 'COMMITTED';",
  },
  {
    comment: "commit: serialize writers per key; the last commit wins",
    code: "SELECT pg_advisory_xact_lock(hashtextextended(bucket || '/' || key, 0));",
  },
  {
    comment: "repair: the objects table becomes a work queue",
    code: "SELECT o.* FROM objects o\nWHERE o.status = 'COMMITTED' AND (/* live copies */) < 3\nORDER BY o.created_at LIMIT 50\nFOR UPDATE OF o SKIP LOCKED;",
  },
];

const decisions = [
  {
    title: "Immutable objects over in-place overwrites",
    tradeoff: "simplicity over flexibility",
    body: "Every upload gets a new UUID; an overwrite re-points the key and tombstones the old version. There are no stale copies, no version conflicts, and no vector clocks — and a node that was dead for a day comes back with every blob still valid. Most of the design's other simplifications rest on this one.",
    wide: true,
  },
  {
    title: "Postgres for metadata, disks for bytes",
    tradeoff: "each store at what it's good at",
    body: "“Which objects have fewer than 3 live copies?” is one SQL statement, and multi-gigabyte blobs never bloat backups or the buffer cache. It is the split S3, HDFS, and Haystack use. The cost: Postgres becomes the single point of failure.",
    wide: false,
  },
  {
    title: "Four nodes for three copies",
    tradeoff: "a real ring over a trivial one",
    body: "With exactly three nodes every object lives on every node, placement is meaningless, and a failure leaves nowhere to rebuild the third copy. The fourth node makes both the ring and the repair real.",
    wide: false,
  },
  {
    title: "fsync + atomic rename on every node",
    tradeoff: "crash safety over raw speed",
    body: "Nodes write to a temp file, verify the checksum sent in X-Content-SHA256, fsync, then rename into place. A crash at any point leaves the old state or a complete blob — never a half-written file that looks real.",
    wide: false,
  },
  {
    title: "JdbcTemplate over JPA",
    tradeoff: "visible SQL over convenience",
    body: "The load-bearing parts — advisory locks, SKIP LOCKED, the partial index — are SQL. Keeping every statement in one repository class means the concurrency story can be read and reviewed in one place.",
    wide: false,
  },
  {
    title: "Java 21 over the Go first draft",
    tradeoff: "depth over novelty",
    body: "The first sketch was Go servers behind Nginx. Nothing in the design depended on Go, and Java 21 virtual threads make per-replica fan-out cheap — so the effort went into durability and failure handling, not a new language. The API is stateless, so scaling it out is just more instances behind a load balancer.",
    wide: false,
  },
];

const drill = [
  { what: "Upload demo.bin (5 MB) plus 20 small files", result: "21 objects · 63 copies" },
  { what: "Stop the container holding a copy of demo.bin", result: "node-1 stopped" },
  { what: "Heartbeat timeout, then one repair pass", result: "node-1 DOWN · 13 new copies" },
  { what: "Download demo.bin with node-1 still dead", result: "served by node-4 · SHA-256 MATCH" },
  { what: "Restart node-1 and let the GC run", result: "13 surplus trimmed · 13 + 18 + 15 + 17 = 63" },
];

const ringResults = [
  { what: "Busiest node · 5 nodes × 1 vnode", value: "30.9%" },
  { what: "Busiest node · 5 nodes × 200 vnodes", value: "21.9%" },
  { what: "Keys moved adding a 5th node · hash ring", value: "18.6%" },
  { what: "Keys moved adding a 5th node · hash % N", value: "79.9%" },
];

const scale = [
  { when: "Metadata", what: "A synchronous Postgres standby first; then shard metadata by bucket, or move to a distributed SQL store." },
  { when: "Large objects", what: "Split objects into 8–64 MB chunks, each replicated and checksummed on its own — multipart uploads, resumable transfers, streaming verification." },
  { when: "Storage cost", what: "Erasure coding for cold data: Reed-Solomon 6+3 survives three lost pieces at 1.5× overhead instead of 3×." },
  { when: "Failure domains", what: "A rack- and zone-aware ring that never places two copies in the same failure domain." },
  { when: "Operations", what: "A background scrubber for bit rot, throttled repair bandwidth, and a stateless API fleet behind a load balancer." },
  { when: "Security", what: "Per-user access keys with signed requests (SigV4-style) and mTLS between services." },
];

const gaps = [
  "A straggler write that lands after the GC removes a failed upload can orphan a file — the fix is a scrubber that deletes node files with no metadata.",
  "The repair worker holds row locks while copying; for huge objects, claim work with a short lease column instead.",
  "Downloads are fully verified before the first byte is sent; per-chunk checksums would allow streaming verification.",
  "Internal endpoints rely on network isolation rather than authentication; production would use mTLS.",
];

export default function MiniS3CaseStudy() {
  return (
    <>
      {/* ================= Case hero ================= */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="mx-auto w-full max-w-6xl px-5 pb-0 pt-28 sm:px-8">
          <Reveal>
            <Link href="/#work" className="font-mono text-xs text-ink-faint transition-colors hover:text-accent-strong">
              ← All projects
            </Link>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <h1 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-none tracking-[-0.025em] text-ink">
                Mini-S3<span className="text-accent">.</span>
              </h1>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 font-mono text-[11px] font-medium text-accent-strong">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                Built &amp; verified · runs in Docker
              </span>
            </div>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-dim sm:text-xl">
              A self-healing distributed object store. Every file is kept as
              three copies placed by consistent hashing, a write counts once two
              are durable, and when a storage node dies a background worker
              rebuilds what it held — without losing a byte.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4 text-sm font-medium">
              <a href="#simulator" className="rounded-full bg-accent-deep px-6 py-3 text-white transition-colors hover:bg-accent">
                Try the simulator ↓
              </a>
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-ink hover:text-accent-strong">
                View the repository ↗
              </a>
            </div>
            <p className="mt-4 max-w-xl font-mono text-[11px] leading-relaxed text-ink-faint">
              Mini-S3 runs as a seven-container Docker Compose cluster and is not
              hosted publicly. The simulator on this page is an in-browser model
              of the same protocol: the same hash ring, quorum, and repair rules,
              and the same heartbeat and repair timings.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 pb-2">
              {project.stack.map((t) => (
                <span key={t} className="rounded-md border border-border px-2 py-0.5 font-mono text-[11px] text-ink-dim">
                  {t}
                </span>
              ))}
            </div>
          </Reveal>

          <div className="relative z-10 mt-10 sm:mt-12">
            <div className="mx-auto max-w-4xl rounded-2xl border border-border-strong overflow-hidden">
              <MiniS3Mockup />
            </div>
          </div>
        </div>
      </section>

      {/* metric strip */}
      <section className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <dl className="mt-12 flex flex-wrap items-center justify-between gap-x-10 gap-y-4 rounded-2xl border border-border bg-bg-raised px-6 py-5 sm:px-8">
          {[
            ["N=3 · W=2", "copies · write quorum"],
            ["~19%", "keys move on growth (not 80%)"],
            ["13", "copies rebuilt in one pass"],
            ["0", "objects lost when a node died"],
          ].map(([v, l]) => (
            <div key={l} className="flex items-baseline gap-2.5">
              <dd className="font-mono text-xl font-semibold text-accent-strong">{v}</dd>
              <dt className="text-xs text-ink-dim">{l}</dt>
            </div>
          ))}
        </dl>
      </section>

      {/* ================= Problem ================= */}
      <section className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-8">
        <p className="mx-auto max-w-3xl text-center font-display text-[clamp(1.5rem,3.2vw,2.25rem)] leading-snug tracking-tight">
          <span className="text-ink">Keep every file three times, keep writing when a disk dies, and heal without a human.</span>{" "}
          <span className="text-ink-faint">The upload API is the easy part. Durability, concurrency, and failure are the project.</span>
        </p>
        <p className="mx-auto mt-6 max-w-2xl text-center leading-relaxed text-ink-dim">
          Mini-S3 is a from-scratch object store in the shape of Amazon S3 —
          buckets, keys, PUT, GET, DELETE — built to own the problems managed
          services hide: where copies live, when a write counts as durable, how
          to tell a dead node from a slow one, and how the system repairs itself.
        </p>
      </section>

      {/* ================= System design ================= */}
      <section id="design" className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-8">
        <SectionHeading
          title="The system"
          accent="design"
          lede="Metadata and bytes live in different places, on purpose. One jar runs as three roles — api, storage, or worker, chosen by Spring profile — so the API, the storage nodes, and the worker all ship from a single image."
        />
        <div className="mt-12 overflow-x-auto rounded-3xl border border-border bg-bg-raised p-5 sm:p-8">
          <div className="min-w-[680px]">
            <MiniS3ArchitectureDiagram />
          </div>
        </div>
      </section>

      {/* ================= Request paths ================= */}
      <section id="paths" className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-8">
        <SectionHeading
          title="Follow a"
          accent="request"
          lede="Four paths through the system. Each step maps to code in ObjectService, MetadataRepository, FailureDetector, RepairWorker, or GarbageCollector."
        />
        <div className="mt-12">
          <RequestPathTabs panels={pathPanels} />
        </div>
      </section>

      {/* ================= Data model ================= */}
      <section id="data" className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-8">
        <SectionHeading
          title="The data"
          accent="model"
          lede="Three tables. The hash ring decides where new copies go; replicas records where they actually are — the ring is a placement policy, not a lookup table."
        />
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {tables.map((t) => (
            <div key={t.name} className="rounded-3xl border border-border bg-bg-raised p-7">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-mono text-base font-semibold text-accent-strong">{t.name}</h3>
                <p className="text-xs text-ink-faint">{t.purpose}</p>
              </div>
              <dl className="mt-4 divide-y divide-border border-t border-border">
                {t.cols.map(([c, type]) => (
                  <div key={c + type} className="flex items-baseline justify-between gap-4 py-2">
                    <dt className="font-mono text-[12.5px] text-ink">{c}</dt>
                    <dd className="text-right font-mono text-[11.5px] text-ink-faint">{type}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
        <div className="mt-5 overflow-x-auto rounded-3xl border border-border bg-bg-raised p-7">
          <h3 className="font-display text-base text-ink">The three statements that carry the design</h3>
          <div className="mt-4 space-y-4">
            {sql.map((q) => (
              <pre key={q.comment} className="font-mono text-[12.5px] leading-relaxed">
                <span className="text-ink-faint">-- {q.comment}</span>
                {"\n"}
                <span className="text-accent-strong">{q.code}</span>
              </pre>
            ))}
          </div>
        </div>
      </section>

      {/* ================= Simulator ================= */}
      <section id="simulator" className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-8">
        <SectionHeading
          title="Break it"
          accent="yourself"
          lede="Stop a storage node, corrupt a copy, overwrite a key — then watch the cluster notice and repair itself. Or run the same failure drill as the repo's demo script."
        />
        <div className="mt-12">
          <MiniS3Simulator />
        </div>
        <p className="mt-4 max-w-3xl text-xs leading-relaxed text-ink-faint">
          An in-browser model, not the running cluster. Placement uses a
          TypeScript port of HashRing.java whose preference lists match the Java
          class bit for bit; the write, read, repair, and GC rules follow the
          repo&apos;s code; heartbeat, timeout, repair, and GC intervals match its
          configuration. Network latencies are illustrative.
        </p>
      </section>

      {/* ================= Placement ================= */}
      <section id="placement" className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-8">
        <SectionHeading
          title="Placement,"
          accent="measured live"
          lede="Why a hash ring with virtual nodes instead of hash % N — computed in your browser over 100,000 keys, not just claimed."
        />
        <div className="mt-12">
          <HashRingExplorer />
        </div>
      </section>

      {/* ================= Decisions ================= */}
      <section className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-8">
        <SectionHeading
          title="Decisions and"
          accent="trade-offs"
          lede="The choices an interviewer will push on, and what each one costs."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {decisions.map((d) => (
            <div
              key={d.title}
              className={`h-full rounded-3xl border p-7 transition-colors sm:p-8 ${d.wide ? "md:col-span-2" : ""} ${
                d.wide ? "border-accent/30 bg-accent/5" : "border-border bg-bg-raised hover:border-border-strong"
              }`}
            >
              <h3 className={`font-display text-ink ${d.wide ? "text-2xl" : "text-xl"}`}>
                {d.title} <span className="font-medium text-accent-strong">— {d.tradeoff}</span>
              </h3>
              <p className={`mt-3 max-w-3xl leading-relaxed text-ink-dim ${d.wide ? "text-base" : "text-[15px]"}`}>{d.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= Evidence ================= */}
      <section className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-8">
        <SectionHeading
          title="The"
          accent="evidence"
          lede="Recorded on the real seven-container cluster. The repo's demo script replays the drill; exact counts vary run to run with the random object IDs."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-border bg-bg-raised p-7 sm:p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="font-display text-xl text-ink">The node-kill drill</h3>
              <p className="font-mono text-xs text-ink-faint">scripts/demo.sh · recorded run</p>
            </div>
            <ol className="mt-6 space-y-4">
              {drill.map((d, i) => (
                <li key={d.what} className="flex gap-4">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent font-mono text-[11px] font-semibold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-[15px] leading-snug text-ink">{d.what}</p>
                    <p className="mt-1 font-mono text-xs text-accent-strong">{d.result}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-6 text-[14.5px] leading-relaxed text-ink-dim">
              Final state: all 21 objects back at exactly three copies (63 in
              total), and the downloaded file matched the original SHA-256 byte
              for byte.
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-bg-raised p-7 sm:p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="font-display text-xl text-ink">Placement, by the numbers</h3>
              <p className="font-mono text-xs text-ink-faint">100,000 keys · fair share 20%</p>
            </div>
            <table className="mt-5 w-full text-left text-sm">
              <caption className="sr-only">Hash ring balance and key movement measurements</caption>
              <tbody>
                {ringResults.map((r) => (
                  <tr key={r.what} className="border-b border-border last:border-0">
                    <th scope="row" className="py-3 pr-4 font-medium text-ink">{r.what}</th>
                    <td className="py-3 text-right font-mono text-accent-strong">{r.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 text-xs leading-relaxed text-ink-dim">
              Measured with the repo&apos;s HashRing over the same keys as{" "}
              <span className="font-mono">HashRingTest</span>, whose five tests
              assert balance, ~1/N movement, removal isolation, and distinct
              replicas. The explorer above reproduces the ring numbers live.
            </p>
          </div>
        </div>
        <p className="mt-6 rounded-2xl border border-accent/25 bg-accent/5 p-5 text-sm leading-relaxed text-ink-dim">
          <span className="font-semibold text-accent-strong">Verified before it ran:</span>{" "}
          every SQL statement was exercised against a real Postgres 16, and the
          virtual-node count was tuned from measurement — 100 left the busiest
          node 17% over fair share, so the default became 200. The Docker build
          compiles the code and runs the tests inside the image, so a clean clone
          needs only Docker.
        </p>
      </section>

      {/* ================= At scale ================= */}
      <section className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-8">
        <SectionHeading
          title="At"
          accent="1000× scale"
          lede="What changes when this stops being one machine — and the gaps I'd close first."
        />
        <div className="mt-12 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <ol className="relative space-y-7 border-l border-border pl-8">
            {scale.map((s, i) => (
              <li key={s.when} className="relative">
                <span
                  className={`absolute -left-[37px] top-1 h-4 w-4 rounded-full border-2 ${
                    i === 0 ? "border-accent bg-accent/30" : "border-border-strong bg-bg"
                  }`}
                  aria-hidden="true"
                />
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">{s.when}</p>
                <p className="mt-1.5 max-w-2xl leading-relaxed text-ink-dim">{s.what}</p>
              </li>
            ))}
          </ol>
          <div className="h-fit rounded-3xl border border-border bg-bg-raised p-7 sm:p-8">
            <h3 className="font-display text-xl text-ink">Known gaps, named up front</h3>
            <ul className="mt-4 space-y-3.5">
              {gaps.map((g) => (
                <li key={g} className="flex gap-3 text-[14.5px] leading-relaxed text-ink-dim">
                  <svg width="14" height="14" viewBox="0 0 14 14" className="mt-1.5 shrink-0" aria-hidden="true">
                    <path d="M2 7h8M7 3.5 10.5 7 7 10.5" stroke="#2f6a3b" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {g}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ================= Close ================= */}
      <section className="mx-auto w-full max-w-6xl px-5 pb-28 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-6 rounded-[20px] border border-border bg-bg-raised p-9 sm:p-12">
          <div>
            <h2 className="font-display text-3xl text-ink sm:text-4xl">
              Stop a node, then read the code<span className="text-accent">.</span>
            </h2>
            <p className="mt-2 max-w-md text-[15px] leading-relaxed text-ink-dim">
              The simulator runs a verified port of the placement code; the repo
              runs the real cluster with one command.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
            <a href="#simulator" className="rounded-full bg-accent-deep px-6 py-3 text-white transition-colors hover:bg-accent">
              Try the simulator
            </a>
            <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-ink transition-colors hover:text-accent-strong">
              GitHub ↗
            </a>
            <Link href="/#contact" className="text-ink transition-colors hover:text-accent-strong">
              Contact me
            </Link>
            <Link href="/#work" className="text-ink transition-colors hover:text-accent-strong">
              All projects
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
