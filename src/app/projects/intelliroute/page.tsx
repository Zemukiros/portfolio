import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import StatusBadge from "@/components/StatusBadge";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "IntelliRoute — Case Study",
  description:
    "Route intelligence platform: Dijkstra + Yen's K-shortest paths in Java/Spring Boot, deterministic FastAPI preference ranking, and an interactive Next.js comparison UI. 125 automated tests, recorded benchmarks, green CI.",
};

const project = projects.find((p) => p.slug === "intelliroute")!;

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-14 font-display text-2xl font-semibold tracking-tight text-ink">
      {children}
    </h2>
  );
}

function Divider() {
  return <div className="mt-3 h-px w-12 bg-accent/50" aria-hidden="true" />;
}

const benchmarks = [
  { workload: "Dijkstra shortest path", n100: "88 µs", n1k: "754 µs", n5k: "4.05 ms" },
  { workload: "Yen's K-shortest (K=3)", n100: "1.11 ms", n1k: "7.68 ms", n5k: "68.1 ms" },
];

export default function IntelliRouteCaseStudy() {
  return (
    <article className="mx-auto w-full max-w-4xl px-5 pb-24 pt-28 sm:px-8">
      <Reveal>
        <Link
          href="/#projects"
          className="font-mono text-xs text-ink-faint transition-colors hover:text-ink"
        >
          ← Back to projects
        </Link>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <h1 className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            IntelliRoute
          </h1>
          <StatusBadge status={project.status} />
        </div>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-dim">
          {project.oneLiner} Built as a three-service system — Java/Spring Boot
          routing engine, Python/FastAPI preference ranker, and a Next.js
          comparison UI — verified by 125 automated tests and recorded benchmarks.
        </p>
        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-accent px-4 py-2 font-semibold text-bg transition-colors hover:bg-accent-strong"
          >
            View repository ↗
          </a>
          <span className="rounded-md border border-border px-4 py-2 text-ink-faint">
            Public deployment: in progress
          </span>
        </div>
      </Reveal>

      {/* Fact strip */}
      <Reveal>
        <dl className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            ["125", "automated tests"],
            ["4.05 ms", "Dijkstra @ 5k nodes"],
            ["4 / 4", "CI jobs green"],
            ["$0", "infrastructure cost"],
          ].map(([value, label]) => (
            <div
              key={label}
              className="rounded-xl border border-border bg-bg-raised p-4 text-center"
            >
              <dt className="order-2 mt-1 block font-mono text-[11px] uppercase tracking-wider text-ink-faint">
                {label}
              </dt>
              <dd className="order-1 block font-display text-2xl font-semibold text-accent-strong">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>

      <Reveal>
        <H2>Problem</H2>
        <Divider />
        <p className="mt-5 leading-relaxed text-ink-dim">
          The &ldquo;shortest&rdquo; route is rarely the route people actually want.
          Real routing choices trade off speed against tolls, safety, scenery, and
          road closures — and most demo routing projects stop at a single Dijkstra
          run. IntelliRoute answers a harder question: given several viable
          alternatives, <em>which route best matches what the user asked for in
          plain language</em>{" "}
          (&ldquo;fastest but avoid tolls&rdquo;, &ldquo;scenic and
          safe&rdquo;), and can the system explain why?
        </p>
      </Reveal>

      <Reveal>
        <H2>System capabilities</H2>
        <Divider />
        <ul className="mt-5 space-y-3">
          {[
            "Computes shortest paths with Dijkstra's algorithm over an adjacency-list road graph carrying rich metadata: road-type speeds, tolls, safety and scenic scores, and closures.",
            "Generates K alternative routes with Yen's K-shortest loopless-paths algorithm built on an exclusion-capable Dijkstra.",
            "Ranks alternatives against free-text preferences via a deterministic Python/FastAPI service — synonym parsing, combined preferences, confidence scores, and human-readable explanations.",
            "Degrades gracefully: when the ranking service is unreachable, the Java API falls back to local scoring and reports the degradation in the response (java-local-fallback).",
            "Interactive comparison UI: preference input with suggestion chips, ranked route cards with badges, on-graph route highlighting, and explicit offline/error states.",
          ].map((c) => (
            <li key={c} className="flex gap-2.5 leading-relaxed text-ink-dim">
              <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
              {c}
            </li>
          ))}
        </ul>
        <p className="mt-5 rounded-lg border border-amber/30 bg-amber/5 p-4 text-sm leading-relaxed text-ink-dim">
          <span className="font-semibold text-amber">Accuracy note:</span> the
          current ranking layer is deterministic, rule-based scoring — not an LLM.
          An LLM-assisted ranking mode is on the roadmap and will only be claimed
          here once implemented and tested.
        </p>
      </Reveal>

      <Reveal>
        <H2>Architecture</H2>
        <Divider />
        <figure className="mt-6 overflow-hidden rounded-xl border border-border bg-bg-raised p-4 sm:p-6">
          <svg
            viewBox="0 0 760 300"
            role="img"
            aria-label="IntelliRoute architecture: Next.js frontend calls the Spring Boot routing API, which calls the FastAPI ranking service with a local fallback"
            className="h-auto w-full"
          >
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0 0L10 5L0 10z" fill="#4cc9b0" />
              </marker>
            </defs>

            {/* Frontend */}
            <rect x="20" y="90" width="180" height="120" rx="10" fill="#131926" stroke="#2c3648" />
            <text x="110" y="125" textAnchor="middle" fill="#e6ebf2" fontSize="15" fontWeight="600" fontFamily="monospace">Next.js UI</text>
            <text x="110" y="150" textAnchor="middle" fill="#9aa7b8" fontSize="11" fontFamily="monospace">TypeScript · React</text>
            <text x="110" y="168" textAnchor="middle" fill="#9aa7b8" fontSize="11" fontFamily="monospace">route comparison</text>
            <text x="110" y="186" textAnchor="middle" fill="#9aa7b8" fontSize="11" fontFamily="monospace">9 component tests</text>

            {/* Spring Boot */}
            <rect x="290" y="70" width="200" height="160" rx="10" fill="#131926" stroke="#4cc9b0" />
            <text x="390" y="103" textAnchor="middle" fill="#e6ebf2" fontSize="15" fontWeight="600" fontFamily="monospace">Spring Boot API</text>
            <text x="390" y="128" textAnchor="middle" fill="#9aa7b8" fontSize="11" fontFamily="monospace">Dijkstra + Yen K-shortest</text>
            <text x="390" y="146" textAnchor="middle" fill="#9aa7b8" fontSize="11" fontFamily="monospace">road metadata domain</text>
            <text x="390" y="164" textAnchor="middle" fill="#9aa7b8" fontSize="11" fontFamily="monospace">local fallback scoring</text>
            <text x="390" y="182" textAnchor="middle" fill="#9aa7b8" fontSize="11" fontFamily="monospace">62 JUnit tests</text>
            <text x="390" y="207" textAnchor="middle" fill="#4cc9b0" fontSize="10" fontFamily="monospace">/api/routes/alternatives · /recommend</text>

            {/* FastAPI */}
            <rect x="570" y="90" width="170" height="120" rx="10" fill="#131926" stroke="#2c3648" />
            <text x="655" y="125" textAnchor="middle" fill="#e6ebf2" fontSize="15" fontWeight="600" fontFamily="monospace">FastAPI ranker</text>
            <text x="655" y="150" textAnchor="middle" fill="#9aa7b8" fontSize="11" fontFamily="monospace">deterministic scoring</text>
            <text x="655" y="168" textAnchor="middle" fill="#9aa7b8" fontSize="11" fontFamily="monospace">confidence + explains</text>
            <text x="655" y="186" textAnchor="middle" fill="#9aa7b8" fontSize="11" fontFamily="monospace">54 pytest tests</text>

            {/* Arrows */}
            <line x1="200" y1="140" x2="284" y2="140" stroke="#4cc9b0" strokeWidth="1.5" markerEnd="url(#arrow)" />
            <text x="242" y="130" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="monospace">REST</text>
            <line x1="490" y1="140" x2="564" y2="140" stroke="#4cc9b0" strokeWidth="1.5" markerEnd="url(#arrow)" />
            <text x="527" y="130" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="monospace">HTTP</text>
            <line x1="620" y1="215" x2="475" y2="240" stroke="#e8b45a" strokeWidth="1.2" strokeDasharray="4 4" markerEnd="url(#arrow)" />
            <text x="560" y="245" textAnchor="middle" fill="#e8b45a" fontSize="10" fontFamily="monospace">ranker down → java-local-fallback</text>

            {/* CI strip */}
            <rect x="20" y="262" width="720" height="28" rx="6" fill="#10141c" stroke="#1f2735" />
            <text x="380" y="280" textAnchor="middle" fill="#9aa7b8" fontSize="11" fontFamily="monospace">GitHub Actions CI · API + e2e fallback drill · ranking + benchmarks · web build · Docker smoke</text>
          </svg>
          <figcaption className="mt-3 text-center font-mono text-xs text-ink-faint">
            Three services, one contract: ranked-route responses always report
            which ranking path produced them.
          </figcaption>
        </figure>
      </Reveal>

      <Reveal>
        <H2>Technology decisions</H2>
        <Divider />
        <div className="mt-5 space-y-4">
          {[
            [
              "Java + Spring Boot for the routing core",
              "The graph algorithms are the heart of the system, and the JVM gives predictable performance plus a mature testing story (JUnit) for algorithm correctness — including edge cases like closed roads and excluded edges in Yen's algorithm.",
            ],
            [
              "A separate Python/FastAPI ranking service",
              "Preference interpretation evolves on a different axis than pathfinding. Isolating it behind an HTTP contract lets the ranker be swapped (deterministic today, LLM-assisted later) without touching the routing engine — and forced a real cross-service failure-handling design.",
            ],
            [
              "Deterministic ranking before LLM ranking",
              "A rule-based ranker is testable, free, and explainable — 54 tests pin its behavior. It also establishes the fallback layer any future LLM integration will need anyway.",
            ],
            [
              "Docker Compose + GitHub Actions from day one",
              "Every merge runs four CI jobs: Java tests with a live end-to-end fallback drill, Python tests plus benchmarks, frontend lint/test/build, and a Docker Compose build with smoke test.",
            ],
          ].map(([title, body]) => (
            <div key={title} className="rounded-xl border border-border bg-bg-raised p-5">
              <h3 className="font-display font-semibold text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-dim">{body}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal>
        <H2>Testing &amp; CI evidence</H2>
        <Divider />
        <ul className="mt-5 space-y-3">
          {[
            "62 Java tests — algorithm correctness (Dijkstra, Yen's with exclusions), road-metadata domain, API contracts, and ranking-client fallback behavior.",
            "54 Python tests — preference parsing, synonym handling, combined preferences, confidence scoring, and explanation output.",
            "9 frontend component tests — comparison UI states including offline and degraded-service rendering.",
            "End-to-end fallback drill in CI: the pipeline kills the ranking service and asserts the Java API degrades to local scoring with the correct degradation flag.",
            "All four GitHub Actions jobs green on main; a real CI failure (a mocked-client test clobbered by a request-factory override, plus a Docker smoke-test race) was diagnosed and fixed — documented in the repo's changelog.",
          ].map((t) => (
            <li key={t} className="flex gap-2.5 text-sm leading-relaxed text-ink-dim">
              <span className="mt-[8px] h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
              {t}
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal>
        <H2>Benchmarks</H2>
        <Divider />
        <p className="mt-5 text-sm leading-relaxed text-ink-dim">
          Measured in CI on a 2-core container with a fixed random seed (42), on
          generated road graphs of 100 / 1,000 / 5,000 nodes. Preference ranking
          of a candidate set completes in ~91 µs.
        </p>
        <div className="mt-5 overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[480px] text-left text-sm">
            <caption className="sr-only">
              Algorithm benchmark timings by graph size
            </caption>
            <thead>
              <tr className="border-b border-border bg-bg-panel font-mono text-xs text-ink-faint">
                <th scope="col" className="px-4 py-3 font-medium">Workload</th>
                <th scope="col" className="px-4 py-3 font-medium">100 nodes</th>
                <th scope="col" className="px-4 py-3 font-medium">1,000 nodes</th>
                <th scope="col" className="px-4 py-3 font-medium">5,000 nodes</th>
              </tr>
            </thead>
            <tbody>
              {benchmarks.map((b) => (
                <tr key={b.workload} className="border-b border-border last:border-0">
                  <th scope="row" className="px-4 py-3 font-medium text-ink">
                    {b.workload}
                  </th>
                  <td className="px-4 py-3 font-mono text-accent-strong">{b.n100}</td>
                  <td className="px-4 py-3 font-mono text-accent-strong">{b.n1k}</td>
                  <td className="px-4 py-3 font-mono text-accent-strong">{b.n5k}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>

      <Reveal>
        <H2>Current limitations &amp; roadmap</H2>
        <Divider />
        <ul className="mt-5 space-y-3">
          {[
            "Not yet publicly deployed — production deployment (Vercel frontend, Java + Python services on a free-tier backend host) is the next milestone.",
            "Ranking is deterministic; an LLM-assisted ranking mode with the same fallback contract is planned.",
            "Graph data is generated/seeded; PostgreSQL persistence and real map-data import tooling are planned.",
            "Planned next: A* with comparison benchmarks, authentication, and load testing.",
          ].map((t) => (
            <li key={t} className="flex gap-2.5 text-sm leading-relaxed text-ink-dim">
              <span className="mt-[8px] h-1 w-1 shrink-0 rounded-full bg-amber" aria-hidden="true" />
              {t}
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal>
        <div className="mt-14 flex flex-wrap gap-4 border-t border-border pt-8">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-bg transition-colors hover:bg-accent-strong"
          >
            Explore the code ↗
          </a>
          <Link
            href="/#contact"
            className="rounded-md border border-border-strong px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent"
          >
            Contact me
          </Link>
        </div>
      </Reveal>
    </article>
  );
}
