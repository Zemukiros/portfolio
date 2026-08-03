import { Window } from "./ProjectMockups";

/**
 * Case-study visuals for the Meridian Patient Website, drawn in the site's
 * schematic language: dark panels, violet line-work, mint = verified,
 * teal = Meridian's product accent (drone / delivery state).
 */

/** The staff side: Django admin customized into "Meridian Operations". */
export function OperationsMockup() {
  const rows = [
    { y: 150, order: "MMA-1038", state: "delivered", dot: "#34d399", hot: false },
    { y: 186, order: "MMA-1042", state: "in flight", dot: "#2dd4bf", hot: true },
    { y: 222, order: "MMA-1043", state: "verified", dot: "#a78bfa", hot: false },
    { y: 258, order: "MMA-1044", state: "received", dot: "#584b85", hot: false },
  ];
  return (
    <Window title="meridian — operations" height={330}>
      {/* filter bar */}
      {[
        { x: 24, w: 96, label: "status: all" },
        { x: 128, w: 96, label: "plan: any" },
        { x: 232, w: 118, label: "window: today" },
      ].map((f) => (
        <g key={f.label}>
          <rect x={f.x} y="62" width={f.w} height="26" rx="13" fill="#131022" stroke="#2a2342" />
          <text x={f.x + f.w / 2} y="79" textAnchor="middle" fill="#a49dbd" fontSize="10.5" fontFamily="var(--font-mono)">
            {f.label}
          </text>
        </g>
      ))}
      <rect x="362" y="62" width="114" height="26" rx="13" fill="#0e0b1a" stroke="#3b3157" />
      <text x="378" y="79" fill="#837da6" fontSize="10.5" fontFamily="var(--font-mono)">
        ⌕ rx / patient
      </text>
      {/* table header */}
      <text x="40" y="122" fill="#837da6" fontSize="10" fontFamily="var(--font-mono)">order</text>
      <text x="170" y="122" fill="#837da6" fontSize="10" fontFamily="var(--font-mono)">patient</text>
      <text x="300" y="122" fill="#837da6" fontSize="10" fontFamily="var(--font-mono)">status</text>
      <text x="412" y="122" fill="#837da6" fontSize="10" fontFamily="var(--font-mono)">action</text>
      <line x1="24" y1="132" x2="476" y2="132" stroke="#221d33" />
      {/* rows */}
      {rows.map((r) => (
        <g key={r.order}>
          <rect x="24" y={r.y - 22} width="452" height="32" rx="8" fill={r.hot ? "#101c22" : "transparent"} stroke={r.hot ? "#2dd4bf" : "transparent"} strokeOpacity="0.55" />
          <text x="40" y={r.y} fill="#f1eef9" fontSize="11" fontFamily="var(--font-mono)">{r.order}</text>
          <rect x="170" y={r.y - 8} width="86" height="8" rx="4" fill="#322a4a" />
          <circle cx="306" cy={r.y - 4} r="4.5" fill={r.dot} />
          <text x="318" y={r.y} fill="#a49dbd" fontSize="10.5" fontFamily="var(--font-mono)">{r.state}</text>
          <rect x="412" y={r.y - 12} width="52" height="18" rx="9" fill={r.hot ? "#2dd4bf" : "#131022"} stroke={r.hot ? "#2dd4bf" : "#2a2342"} />
          <text x="438" y={r.y} textAnchor="middle" fill={r.hot ? "#07060c" : "#a49dbd"} fontSize="9.5" fontWeight={r.hot ? 700 : 400} fontFamily="var(--font-mono)">
            {r.hot ? "advance" : "open"}
          </text>
        </g>
      ))}
      {/* sync note */}
      <text x="24" y="302" fill="#837da6" fontSize="10" fontFamily="var(--font-mono)">
        status change → patient tracker updates immediately
      </text>
    </Window>
  );
}

/** Deployed architecture: Render web service + Neon PostgreSQL, IaC pipeline. */
export function MeridianArchitectureDiagram() {
  return (
    <svg
      viewBox="0 0 960 430"
      role="img"
      aria-label="Meridian architecture: patient and staff browsers reach a Render web service running Gunicorn, WhiteNoise, and Django 6 with three apps — accounts, orders, pages — backed by a Neon serverless PostgreSQL database. A render.yaml blueprint drives the build pipeline: install, collectstatic, migrate, bootstrap admin, on every push to main."
      className="h-auto w-full"
    >
      <defs>
        <marker id="mdArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0L10 5L0 10z" fill="#8b5cf6" />
        </marker>
        <filter id="mdGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="10" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Browsers */}
      <rect x="30" y="110" width="240" height="160" rx="18" fill="#0d0b16" stroke="#322a4a" strokeWidth="1.5" />
      <text x="150" y="150" textAnchor="middle" fill="#f1eef9" fontSize="19" fontWeight="700" fontFamily="var(--font-display)">Browsers</text>
      <text x="150" y="178" textAnchor="middle" fill="#a49dbd" fontSize="12.5" fontFamily="var(--font-body)">Patients: order, pay, track</text>
      <text x="150" y="196" textAnchor="middle" fill="#a49dbd" fontSize="12.5" fontFamily="var(--font-body)">Staff: Meridian Operations</text>
      <rect x="78" y="216" width="144" height="26" rx="13" fill="#131022" stroke="#2a2342" />
      <text x="150" y="233" textAnchor="middle" fill="#a78bfa" fontSize="11" fontFamily="var(--font-mono)">9 responsive pages</text>

      {/* Render web service (featured) */}
      <rect x="352" y="82" width="256" height="216" rx="18" fill="#131022" stroke="#8b5cf6" strokeWidth="2" filter="url(#mdGlow)" />
      <text x="480" y="122" textAnchor="middle" fill="#f1eef9" fontSize="19" fontWeight="700" fontFamily="var(--font-display)">Render web service</text>
      <text x="480" y="150" textAnchor="middle" fill="#a49dbd" fontSize="12.5" fontFamily="var(--font-body)">Gunicorn · WhiteNoise · Django 6</text>
      <text x="480" y="168" textAnchor="middle" fill="#a49dbd" fontSize="12.5" fontFamily="var(--font-body)">HTTPS redirect · HSTS · secure cookies</text>
      <text x="480" y="186" textAnchor="middle" fill="#a49dbd" fontSize="12.5" fontFamily="var(--font-body)">Query-level ownership checks</text>
      <rect x="398" y="204" width="164" height="26" rx="13" fill="#0d0b16" stroke="#2a2342" />
      <text x="480" y="221" textAnchor="middle" fill="#a78bfa" fontSize="11" fontFamily="var(--font-mono)">43 Django tests</text>
      <text x="480" y="254" textAnchor="middle" fill="#8b5cf6" fontSize="10.5" fontFamily="var(--font-mono)">apps: accounts · orders · pages</text>
      <text x="480" y="272" textAnchor="middle" fill="#8b5cf6" fontSize="10.5" fontFamily="var(--font-mono)">env-driven config · zero secrets in git</text>

      {/* Neon PostgreSQL */}
      <rect x="690" y="110" width="240" height="160" rx="18" fill="#0d0b16" stroke="#322a4a" strokeWidth="1.5" />
      <text x="810" y="150" textAnchor="middle" fill="#f1eef9" fontSize="19" fontWeight="700" fontFamily="var(--font-display)">Neon PostgreSQL</text>
      <text x="810" y="178" textAnchor="middle" fill="#a49dbd" fontSize="12.5" fontFamily="var(--font-body)">Serverless Postgres — persists</text>
      <text x="810" y="196" textAnchor="middle" fill="#a49dbd" fontSize="12.5" fontFamily="var(--font-body)">beyond the host&apos;s 30-day free DB</text>
      <rect x="738" y="216" width="144" height="26" rx="13" fill="#131022" stroke="#2a2342" />
      <text x="810" y="233" textAnchor="middle" fill="#a78bfa" fontSize="11" fontFamily="var(--font-mono)">synthetic data only</text>

      {/* arrows */}
      <line x1="270" y1="180" x2="344" y2="180" stroke="#8b5cf6" strokeWidth="2" markerEnd="url(#mdArrow)" />
      <text x="307" y="168" textAnchor="middle" fill="#837da6" fontSize="11" fontFamily="var(--font-mono)">HTTPS</text>
      <line x1="608" y1="180" x2="682" y2="180" stroke="#8b5cf6" strokeWidth="2" markerEnd="url(#mdArrow)" />
      <text x="645" y="168" textAnchor="middle" fill="#837da6" fontSize="11" fontFamily="var(--font-mono)">psycopg</text>

      {/* deploy pipeline strip */}
      <rect x="30" y="362" width="900" height="52" rx="14" fill="#0d0b16" stroke="#221d33" />
      <text x="58" y="393" fill="#837da6" fontSize="11.5" fontFamily="var(--font-mono)">push to main →</text>
      {[
        { x: 178, w: 150, label: "render.yaml blueprint" },
        { x: 340, w: 130, label: "install + build" },
        { x: 482, w: 176, label: "collectstatic (hashed)" },
        { x: 670, w: 100, label: "migrate" },
        { x: 782, w: 136, label: "bootstrap admin" },
      ].map((j) => (
        <g key={j.label}>
          <rect x={j.x} y="374" width={j.w} height="28" rx="14" fill="#131022" stroke="#2a2342" />
          <circle cx={j.x + 16} cy="388" r="5" fill="#34d399" />
          <text x={j.x + 28} y="392" fill="#a49dbd" fontSize="10.5" fontFamily="var(--font-mono)">
            {j.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
