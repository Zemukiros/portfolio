import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { IntelliRouteMockup } from "@/components/ProjectMockups";
import {
  PreferenceMockup,
  ArchitectureDiagram,
  FallbackDiagram,
} from "@/components/CaseStudyVisuals";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "IntelliRoute — Case Study",
  description:
    "Flagship case study: a route intelligence platform live in production across three services — Dijkstra + Yen's K-shortest paths in Java/Spring Boot, a deterministic FastAPI preference ranker, and a Next.js comparison UI, with 125 automated tests, CI-recorded benchmarks, and engineered fallback behavior.",
};

const project = projects.find((p) => p.slug === "intelliroute")!;

const GRADIENT = "linear-gradient(135deg, #37167f 0%, #6d28d9 55%, #8b5cf6 115%)";

const benchmarks = [
  { workload: "Dijkstra shortest path", n100: "88 µs", n1k: "754 µs", n5k: "4.05 ms" },
  { workload: "Yen's K-shortest (K=3)", n100: "1.11 ms", n1k: "7.68 ms", n5k: "68.1 ms" },
];

const decisions = [
  {
    title: "Two services over one codebase",
    tradeoff: "isolation over convenience",
    body: "Preference interpretation evolves on a different axis than pathfinding, so the ranker lives behind an HTTP contract — swappable (deterministic today, LLM-assisted next) without touching the routing engine. The price was real cross-service failure handling; that price became the fallback design.",
    wide: true,
  },
  {
    title: "JVM for the routing core",
    tradeoff: "predictability over novelty",
    body: "Graph algorithms are the heart of the system. Java + Spring Boot give predictable performance and a mature testing story for correctness — including closed roads and excluded edges in Yen's algorithm.",
    wide: false,
  },
  {
    title: "Rules before LLMs",
    tradeoff: "explainability over hype",
    body: "The v1 ranker is rule-based: testable, free, and explainable, with 54 tests pinning its behavior and a human-readable reason on every recommendation. It also establishes the contract any future LLM mode inherits.",
    wide: false,
  },
  {
    title: "CI + Docker from day one",
    tradeoff: "proof over promises",
    body: "Every merge runs four GitHub Actions jobs: Java tests with a live end-to-end fallback drill, Python tests plus benchmarks, frontend lint/test/build, and a Docker Compose build with a smoke test.",
    wide: true,
  },
];

const testSuites = [
  { label: "Java · JUnit", count: 62, pct: 100, detail: "Algorithm correctness, road-metadata domain, API contracts, fallback client" },
  { label: "Python · pytest", count: 54, pct: 87, detail: "Preference parsing, synonyms, combined preferences, confidence, explanations" },
  { label: "Frontend · components", count: 9, pct: 15, detail: "Comparison UI states, offline and degraded-service rendering" },
];

const roadmap = [
  { when: "Shipped", what: "Deployed to production: Next.js frontend on Vercel, Spring Boot API and FastAPI ranker on Render, wired across the open internet with CORS locked to the production domain — running at $0/month." },
  { when: "Next", what: "LLM-assisted ranking mode behind the same HTTP contract and fallback path as the deterministic ranker." },
  { when: "Then", what: "PostgreSQL persistence and real map-data import tooling to replace generated graphs." },
  { when: "Later", what: "A* with comparison benchmarks, authentication, and load testing." },
];

export default function IntelliRouteCaseStudy() {
  return (
    <>
      {/* ================= Case hero ================= */}
      <section className="relative overflow-hidden" style={{ background: GRADIENT }}>
        <div className="mx-auto w-full max-w-6xl px-5 pb-0 pt-28 sm:px-8">
          <Reveal>
            <Link
              href="/#work"
              className="font-mono text-xs text-white/70 transition-colors hover:text-white"
            >
              ← All projects
            </Link>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <h1 className="font-display text-[clamp(3rem,7vw,5.25rem)] font-extrabold leading-none tracking-[-0.03em] text-white">
                IntelliRoute<span className="text-white/50">.</span>
              </h1>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 font-mono text-[11px] font-medium text-white backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-white/80" aria-hidden="true" />
                Live in production
              </span>
            </div>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/85 sm:text-xl">
              A route intelligence platform that doesn&apos;t just find the shortest
              path — it computes real alternatives and ranks them against what you
              asked for in plain language, with an explanation for every choice.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4 text-sm font-medium">
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-white px-6 py-3 text-accent-deep transition-colors hover:bg-white/85"
              >
                View the repository ↗
              </a>
              {project.liveUrl ? (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/90 hover:text-white"
                >
                  Open the live app ↗
                </a>
              ) : (
                <span className="rounded-xl border border-white/25 px-6 py-3 text-white/75">
                  Live app · soon
                </span>
              )}
            </div>
            <div className="mt-6 flex flex-wrap gap-2 pb-2">
              {project.stack.map((t) => (
                <span key={t} className="rounded-full bg-white/12 px-3 py-1 font-mono text-[11px] text-white/85">
                  {t}
                </span>
              ))}
            </div>
          </Reveal>

          {/* hero mockup bleeding out of the gradient */}
          <div className="relative z-10 mt-10 sm:mt-12">
            <div className="mx-auto max-w-4xl rotate-[2deg] rounded-2xl shadow-[0_30px_80px_rgba(7,6,12,0.6)]">
              <IntelliRouteMockup />
            </div>
          </div>
        </div>
        {/* fade the gradient into the page ground under the mockup */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg" aria-hidden="true" />
      </section>

      {/* metric strip */}
      <section className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <dl className="mt-12 flex flex-wrap items-center justify-between gap-x-10 gap-y-4 rounded-2xl border border-border bg-bg-raised px-6 py-5 sm:px-8">
          {[
            ["125", "automated tests"],
            ["4.05 ms", "Dijkstra @ 5k nodes"],
            ["4 / 4", "CI jobs green"],
            ["$0", "infrastructure cost"],
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
        <p className="mx-auto max-w-3xl text-center font-display text-[clamp(1.5rem,3.2vw,2.25rem)] font-semibold leading-snug tracking-tight">
          <span className="text-ink">
            The &ldquo;shortest&rdquo; route is rarely the route people actually want.
          </span>{" "}
          <span className="text-ink-faint">
            Real choices trade speed against tolls, safety, scenery, and closures —
            and most demo routing projects stop at a single Dijkstra run.
          </span>
        </p>
        <p className="mx-auto mt-6 max-w-2xl text-center leading-relaxed text-ink-dim">
          IntelliRoute answers the harder question: given several viable
          alternatives, which one best matches{" "}
          <em>&ldquo;fastest but avoid tolls&rdquo;</em> or{" "}
          <em>&ldquo;scenic and safe&rdquo;</em> — and can the system explain why?
        </p>
      </section>

      {/* ================= Product experience ================= */}
      <section className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-8">
        <SectionHeading
          title="The"
          accent="experience"
          lede="Type a preference the way you'd say it. IntelliRoute parses it, generates real alternatives, and hands back a ranked, explained comparison."
        />
        <div className="mt-12 grid items-center gap-10 lg:grid-cols-2">
          <div>
            <PreferenceMockup />
          </div>
          <div>
            <ul className="space-y-6">
              {[
                ["Free-text preferences", "Synonym-aware parsing turns “cheap and pretty” into weighted scenic / toll / safety factors — no forms, no dropdowns."],
                ["Real alternatives, not one answer", "Yen's K-shortest loopless paths on an exclusion-capable Dijkstra generate genuinely distinct candidates over rich road metadata: speeds, tolls, safety and scenic scores, closures."],
                ["Ranked and explained", "Every recommendation carries a confidence score and a human-readable reason, so the #1 route never feels like a black box."],
                ["Honest degraded states", "The comparison UI renders offline and degraded-service states explicitly — the product stays trustworthy when a dependency isn't."],
              ].map(([t, b]) => (
                <li key={t} className="flex gap-4">
                  <svg width="18" height="18" viewBox="0 0 14 14" className="mt-1.5 shrink-0" aria-hidden="true">
                    <path d="M2 7h8M7 3.5 10.5 7 7 10.5" stroke="#8b5cf6" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div>
                    <h3 className="font-display text-lg font-bold text-ink">{t}</h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-ink-dim">{b}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <p className="mt-10 rounded-2xl border border-accent/25 bg-accent/5 p-5 text-sm leading-relaxed text-ink-dim">
            <span className="font-semibold text-accent-strong">Deterministic by design:</span>{" "}
            ranking v1 is rule-based — testable, free, and explainable, with 54 tests
            pinning its behavior. An LLM-assisted mode ships next behind the same
            contract and fallback path, and gets claimed here only once it&apos;s
            built and tested.
          </p>
        </div>
      </section>

      {/* ================= Architecture ================= */}
      <section className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-8">
        <SectionHeading
          title="The"
          accent="architecture"
          lede="Three services, one contract: ranked-route responses always report which ranking path produced them."
        />
        <div className="mt-12">
          <div className="overflow-x-auto rounded-3xl border border-border bg-bg-raised p-5 sm:p-8">
            <div className="min-w-[640px]">
              <ArchitectureDiagram />
            </div>
          </div>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {decisions.map((d) => (
            <div
              key={d.title}
              className={`h-full rounded-3xl border p-7 transition-colors sm:p-8 ${
                d.wide ? "md:col-span-2" : ""
              } ${
                d.tradeoff === "isolation over convenience"
                  ? "border-accent/30 bg-accent/5"
                  : "border-border bg-bg-raised hover:border-border-strong"
              }`}
            >
              <h3
                className={`font-display font-bold text-ink ${
                  d.tradeoff === "isolation over convenience" ? "text-2xl" : "text-xl"
                }`}
              >
                {d.title}{" "}
                <span className="font-medium text-accent-strong">— {d.tradeoff}</span>
              </h3>
              <p
                className={`mt-3 max-w-3xl leading-relaxed text-ink-dim ${
                  d.tradeoff === "isolation over convenience" ? "text-base" : "text-[15px]"
                }`}
              >
                {d.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= Reliability ================= */}
      <section className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-8">
        <SectionHeading
          title="Built to"
          accent="degrade gracefully"
          lede="Cross-service failure isn't an edge case — it's a designed, tested behavior."
        />
        <div className="mt-12">
          <div className="overflow-x-auto rounded-3xl border border-border bg-bg-raised p-5 sm:p-8">
            <div className="min-w-[640px]">
              <FallbackDiagram />
            </div>
          </div>
          <p className="mt-4 font-mono text-xs leading-relaxed text-ink-faint">
            Drilled in CI on every merge — the pipeline kills the ranker and
            asserts this exact path.
          </p>
        </div>
      </section>

      {/* ================= Evidence ================= */}
      <section className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-8">
        <SectionHeading
          title="The"
          accent="evidence"
          lede="Every claim on this page maps to something you can run: a test suite, a CI job, or a recorded benchmark."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {/* test suites */}
          <div>
            <div className="h-full rounded-3xl border border-border bg-bg-raised p-7 sm:p-8">
              <h3 className="font-display text-xl font-bold text-ink">
                125 automated tests
              </h3>
              <div className="mt-6 space-y-5">
                {testSuites.map((s) => (
                  <div key={s.label}>
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="font-mono text-xs text-ink-dim">{s.label}</p>
                      <p className="font-display text-lg font-bold text-accent-strong">{s.count}</p>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-bg-panel">
                      <div className="h-full rounded-full bg-accent" style={{ width: `${s.pct}%` }} />
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-ink-dim">{s.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* CI + war story */}
          <div>
            <div className="flex h-full flex-col gap-6">
              <div className="rounded-3xl border border-border bg-bg-raised p-7 sm:p-8">
                <h3 className="font-display text-xl font-bold text-ink">
                  CI that attacks the system
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-dim">
                  The pipeline doesn&apos;t just run unit tests — it kills the
                  ranking service mid-run and asserts the API degrades to local
                  scoring with the correct degradation flag. Four jobs, green on
                  main, on every merge.
                </p>
              </div>
              <div className="flex-1 rounded-3xl border border-border bg-bg-raised p-7 sm:p-8">
                <h3 className="font-display text-xl font-bold text-ink">
                  A real failure, kept on the record
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-dim">
                  A real CI failure — a mocked ranking client clobbered by a
                  request-factory override, plus a Docker smoke test racing the
                  web container&apos;s boot — was diagnosed, fixed, and documented
                  in the changelog. The failure and the fix are both part of the
                  repo&apos;s history, on purpose.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* benchmarks */}
        <div>
          <div className="mt-6 rounded-3xl border border-border bg-bg-raised p-7 sm:p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="font-display text-xl font-bold text-ink">Recorded benchmarks</h3>
              <p className="font-mono text-xs text-ink-faint">
                CI container · 2 cores · fixed seed 42 · generated graphs
              </p>
            </div>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-sm">
                <caption className="sr-only">Algorithm benchmark timings by graph size</caption>
                <thead>
                  <tr className="border-b border-border font-mono text-xs text-ink-faint">
                    <th scope="col" className="pb-3 pr-4 font-medium">Workload</th>
                    <th scope="col" className="pb-3 pr-4 font-medium">100 nodes</th>
                    <th scope="col" className="pb-3 pr-4 font-medium">1,000 nodes</th>
                    <th scope="col" className="pb-3 font-medium">5,000 nodes</th>
                  </tr>
                </thead>
                <tbody>
                  {benchmarks.map((b) => (
                    <tr key={b.workload} className="border-b border-border last:border-0">
                      <th scope="row" className="py-3.5 pr-4 font-medium text-ink">{b.workload}</th>
                      <td className="py-3.5 pr-4 font-mono text-accent-strong">{b.n100}</td>
                      <td className="py-3.5 pr-4 font-mono text-accent-strong">{b.n1k}</td>
                      <td className="py-3.5 font-mono text-accent-strong">{b.n5k}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-xs text-ink-dim">
              Preference ranking of a candidate set completes in ~91 µs.
            </p>
          </div>
        </div>
      </section>

      {/* ================= Status & roadmap ================= */}
      <section className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-8">
        <SectionHeading
          title="Where it's"
          accent="headed"
          lede="Deployed and running in production; the roadmap keeps compounding from here."
        />
        <div className="mt-12">
          <ol className="relative space-y-8 border-l border-border pl-8">
            {roadmap.map((r, i) => (
              <li key={r.what} className="relative">
                <span
                  className={`absolute -left-[37px] top-1 h-4 w-4 rounded-full border-2 ${
                    i === 0 ? "border-accent bg-accent/30" : "border-border-strong bg-bg"
                  }`}
                  aria-hidden="true"
                />
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">{r.when}</p>
                <p className="mt-1.5 max-w-2xl leading-relaxed text-ink-dim">{r.what}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ================= Close ================= */}
      <section className="mx-auto w-full max-w-6xl px-5 pb-28 sm:px-8">
        <div>
          <div
            className="flex flex-wrap items-center justify-between gap-6 rounded-3xl p-9 sm:p-12"
            style={{ background: GRADIENT }}
          >
            <div>
              <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
                Try it, then read the code<span className="text-white/50">.</span>
              </h2>
              <p className="mt-2 max-w-md text-[15px] leading-relaxed text-white/80">
                Three services live in production, 125 tests, the CI pipeline,
                and every decision record — all public.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-white px-6 py-3 text-accent-deep transition-colors hover:bg-white/85"
                >
                  Open the live app ↗
                </a>
              )}
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/90 transition-colors hover:text-white"
              >
                GitHub ↗
              </a>
              <Link href="/#contact" className="text-white/90 transition-colors hover:text-white">
                Contact me
              </Link>
              <Link href="/#work" className="text-white/90 transition-colors hover:text-white">
                All projects
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
