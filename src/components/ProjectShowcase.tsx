import Link from "next/link";
import { projects, projectFootnote } from "@/data/projects";
import StatusBadge from "./StatusBadge";

/** Stylized product illustration for the featured IntelliRoute card. */
function IntelliRouteVisual() {
  return (
    <svg
      viewBox="0 0 460 340"
      role="img"
      aria-label="Stylized illustration of the IntelliRoute app: a route graph beside ranked route results"
      className="h-auto w-full"
    >
      {/* window frame */}
      <rect x="4" y="4" width="452" height="332" rx="14" fill="#0d0b16" stroke="#322a4a" />
      <circle cx="26" cy="26" r="4.5" fill="#f472b6" />
      <circle cx="44" cy="26" r="4.5" fill="#e8b45a" />
      <circle cx="62" cy="26" r="4.5" fill="#34d399" />
      <text x="230" y="30" textAnchor="middle" fill="#6d6588" fontSize="11" fontFamily="var(--font-mono)">
        intelliroute — route comparison
      </text>
      <line x1="4" y1="44" x2="456" y2="44" stroke="#221d33" />

      {/* left: mini graph */}
      <g>
        {[
          [40, 300, 110, 220],
          [110, 220, 90, 130],
          [90, 130, 190, 90],
          [110, 220, 210, 180],
          [190, 90, 210, 180],
          [210, 180, 250, 280],
          [40, 300, 250, 280],
        ].map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#322a4a" strokeWidth="1.5" />
        ))}
        <path
          d="M40 300 L110 220 L210 180 L250 280"
          fill="none"
          stroke="#8b5cf6"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {[
          [40, 300, true],
          [110, 220, false],
          [90, 130, false],
          [190, 90, false],
          [210, 180, false],
          [250, 280, true],
        ].map(([x, y, big], i) => (
          <circle key={i} cx={x as number} cy={y as number} r={big ? 6.5 : 4.5} fill={big ? "#a78bfa" : "#584b85"} />
        ))}
      </g>

      {/* right: ranked results */}
      {[
        { y: 70, rank: "1", title: "Scenic · no tolls", meta: "18.2 min · conf 0.92", hot: true },
        { y: 156, rank: "2", title: "Fastest overall", meta: "15.9 min · conf 0.81", hot: false },
        { y: 242, rank: "3", title: "Shortest distance", meta: "19.4 min · conf 0.74", hot: false },
      ].map((r) => (
        <g key={r.rank}>
          <rect
            x="272"
            y={r.y}
            width="168"
            height="70"
            rx="10"
            fill={r.hot ? "#1c1533" : "#131022"}
            stroke={r.hot ? "#8b5cf6" : "#322a4a"}
            strokeWidth={r.hot ? 1.6 : 1}
          />
          <circle cx="294" cy={r.y + 24} r="9" fill={r.hot ? "#8b5cf6" : "#322a4a"} />
          <text x="294" y={r.y + 28} textAnchor="middle" fill={r.hot ? "#ffffff" : "#a49dbd"} fontSize="11" fontWeight="700">
            {r.rank}
          </text>
          <text x="310" y={r.y + 28} fill="#f1eef9" fontSize="12" fontWeight="600" fontFamily="var(--font-body)">
            {r.title}
          </text>
          <text x="310" y={r.y + 48} fill="#837da6" fontSize="10" fontFamily="var(--font-mono)">
            {r.meta}
          </text>
        </g>
      ))}
    </svg>
  );
}

function RhythmiqVisual() {
  const rows = [
    { title: 118, meta: "3:42", hot: true },
    { title: 96, meta: "4:05", hot: false },
    { title: 132, meta: "2:58", hot: false },
  ];
  return (
    <svg viewBox="0 0 300 96" aria-hidden="true" className="h-auto w-full">
      {rows.map((r, i) => (
        <g key={i}>
          <rect x="8" y={8 + i * 26} width="284" height="20" rx="6" fill={r.hot ? "#1c1533" : "#131022"} stroke={r.hot ? "#8b5cf6" : "#221d33"} />
          <circle cx="22" cy={18 + i * 26} r="5" fill={r.hot ? "#8b5cf6" : "#3d3358"} />
          <rect x="36" y={14 + i * 26} width={r.title} height="7" rx="3.5" fill={r.hot ? "#a78bfa" : "#3d3358"} />
          <text x="284" y={22 + i * 26} textAnchor="end" fill="#837da6" fontSize="9.5" fontFamily="var(--font-mono)">
            {r.meta}
          </text>
        </g>
      ))}
      <text x="8" y="94" fill="#837da6" fontSize="10" fontFamily="var(--font-mono)">
        sort: by-energy · Strategy pattern · PostgreSQL
      </text>
    </svg>
  );
}

function QueryGuardVisual() {
  return (
    <svg viewBox="0 0 300 96" aria-hidden="true" className="h-auto w-full">
      <rect x="8" y="10" width="284" height="30" rx="8" fill="#131022" stroke="#322a4a" />
      <text x="22" y="30" fill="#a78bfa" fontSize="12" fontFamily="var(--font-mono)">
        &gt; top customers by returns?
      </text>
      <text x="22" y="66" fill="#a49dbd" fontSize="11" fontFamily="var(--font-mono)">
        SELECT … <tspan fill="#a78bfa">✓ read-only</tspan> <tspan fill="#a78bfa">✓ verified</tspan>
      </text>
      <text x="22" y="88" fill="#837da6" fontSize="10" fontFamily="var(--font-mono)">
        guardrails · hallucination check · confidence
      </text>
    </svg>
  );
}

export default function ProjectShowcase() {
  const [intelliroute, rhythmiq, queryguard] = projects;

  return (
    <div className="space-y-6">
      {/* Featured: IntelliRoute */}
      <article className="group grid overflow-hidden rounded-3xl border border-border-strong bg-gradient-to-br from-bg-panel via-bg-raised to-bg-raised lg:grid-cols-[1.05fr_1fr]">
        <div className="p-8 sm:p-10">
          <div className="flex flex-wrap items-center gap-4">
            <h3 className="font-display text-3xl font-bold text-ink">{intelliroute.name}</h3>
            <StatusBadge status={intelliroute.status} />
          </div>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-dim">
            {intelliroute.oneLiner}{" "}
            Dijkstra and Yen&apos;s K-shortest paths in
            Java/Spring Boot, a Python ranking service that explains its
            choices, and graceful fallback when services drop.
          </p>
          <dl className="mt-6 grid max-w-md grid-cols-3 gap-3">
            {[
              ["125", "automated tests"],
              ["4.05ms", "Dijkstra @ 5k nodes"],
              ["4/4", "CI jobs green"],
            ].map(([v, l]) => (
              <div key={l} className="rounded-xl border border-border bg-bg/60 px-3 py-3 text-center">
                <dd className="font-display text-xl font-bold text-accent-strong">{v}</dd>
                <dt className="mt-0.5 text-[10.5px] leading-tight text-ink-faint">{l}</dt>
              </div>
            ))}
          </dl>
          <div className="mt-6 flex flex-wrap gap-2">
            {intelliroute.stack.slice(0, 6).map((t) => (
              <span key={t} className="rounded-full border border-border bg-bg-panel px-3 py-1 text-xs text-ink-dim">
                {t}
              </span>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <Link
              href={intelliroute.caseStudyPath!}
              className="rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-deep"
            >
              Read the case study
            </Link>
            <a
              href={intelliroute.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-ink-dim transition-colors hover:text-ink"
            >
              GitHub ↗
            </a>
          </div>
        </div>
        <div className="relative hidden items-center p-6 lg:flex">
          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{
              background:
                "radial-gradient(ellipse 90% 80% at 80% 50%, rgba(139,92,246,0.16), transparent 70%)",
            }}
          />
          <IntelliRouteVisual />
        </div>
      </article>

      {/* Next builds */}
      <div className="grid gap-6 md:grid-cols-2">
        {[
          { p: rhythmiq, visual: <RhythmiqVisual /> },
          { p: queryguard, visual: <QueryGuardVisual /> },
        ].map(({ p, visual }) => (
          <article
            key={p.slug}
            className="flex flex-col rounded-3xl border border-border bg-bg-raised p-8 transition-colors hover:border-border-strong"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-display text-2xl font-bold text-ink">{p.name}</h3>
              <StatusBadge status={p.status} />
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-dim">{p.oneLiner}</p>
            <div className="mt-5 rounded-2xl border border-border bg-bg/50 p-4">
              {visual}
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {p.stack.slice(0, 5).map((t) => (
                <span key={t} className="rounded-full border border-border bg-bg-panel px-3 py-1 text-xs text-ink-dim">
                  {t}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>

      <p className="text-sm text-ink-faint">{projectFootnote}</p>
    </div>
  );
}
