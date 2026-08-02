import { Window } from "./ProjectMockups";

/**
 * Case-study visuals for IntelliRoute, drawn in the site's schematic
 * product-true language: violet line-work, dark panels, mint = verified.
 */

/** Preference-to-ranking product moment: what using IntelliRoute feels like. */
export function PreferenceMockup() {
  return (
    <Window title="intelliroute.app — preferences" height={300}>
      {/* free-text preference input */}
      <rect x="24" y="64" width="452" height="38" rx="12" fill="#131022" stroke="#8b5cf6" strokeWidth="1.5" />
      <text x="40" y="88" fill="#f1eef9" fontSize="13" fontFamily="var(--font-mono)">
        scenic and safe, but avoid tolls
      </text>
      {/* suggestion chips */}
      {[
        { x: 24, w: 96, label: "no highways" },
        { x: 128, w: 76, label: "fastest" },
        { x: 212, w: 96, label: "low-traffic" },
      ].map((c) => (
        <g key={c.label}>
          <rect x={c.x} y="114" width={c.w} height="24" rx="12" fill="#131022" stroke="#2a2342" />
          <text x={c.x + c.w / 2} y="130" textAnchor="middle" fill="#a49dbd" fontSize="10.5" fontFamily="var(--font-mono)">
            {c.label}
          </text>
        </g>
      ))}
      {/* parsed preference tags */}
      <text x="24" y="170" fill="#837da6" fontSize="10.5" fontFamily="var(--font-mono)">
        parsed →
      </text>
      {["scenic +", "safety +", "tolls −"].map((t, i) => (
        <g key={t}>
          <rect x={92 + i * 92} y="154" width="82" height="24" rx="12" fill="#1c1533" stroke="#8b5cf6" strokeOpacity="0.5" />
          <text x={133 + i * 92} y="170" textAnchor="middle" fill="#a78bfa" fontSize="10.5" fontFamily="var(--font-mono)">
            {t}
          </text>
        </g>
      ))}
      {/* explanation line */}
      <rect x="24" y="196" width="452" height="76" rx="12" fill="#0e0b1a" stroke="#221d33" />
      <circle cx="48" cy="222" r="10" fill="#8b5cf6" />
      <text x="48" y="226.5" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700">1</text>
      <text x="66" y="220" fill="#f1eef9" fontSize="12" fontWeight="600" fontFamily="var(--font-body)">
        Scenic riverside route — no toll roads
      </text>
      <text x="66" y="240" fill="#a49dbd" fontSize="11" fontFamily="var(--font-body)">
        &ldquo;Prioritized scenic score and safety; excluded 2 toll segments.&rdquo;
      </text>
      <text x="66" y="260" fill="#837da6" fontSize="10.5" fontFamily="var(--font-mono)">
        confidence 0.92 · deterministic ranker v1
      </text>
    </Window>
  );
}

/** Three-service architecture, v3 language. */
export function ArchitectureDiagram() {
  return (
    <svg
      viewBox="0 0 960 430"
      role="img"
      aria-label="IntelliRoute architecture: a Next.js UI calls the Spring Boot routing API over REST; the API calls the FastAPI ranking service over HTTP and falls back to local scoring when the ranker is unreachable. A four-job GitHub Actions pipeline covers all three services."
      className="h-auto w-full"
    >
      <defs>
        <marker id="csArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0L10 5L0 10z" fill="#8b5cf6" />
        </marker>
        <filter id="csGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="10" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Next.js UI */}
      <rect x="30" y="110" width="240" height="160" rx="18" fill="#0d0b16" stroke="#322a4a" strokeWidth="1.5" />
      <text x="150" y="150" textAnchor="middle" fill="#f1eef9" fontSize="19" fontWeight="700" fontFamily="var(--font-display)">Next.js UI</text>
      <text x="150" y="178" textAnchor="middle" fill="#a49dbd" fontSize="12.5" fontFamily="var(--font-body)">Route comparison, preference</text>
      <text x="150" y="196" textAnchor="middle" fill="#a49dbd" fontSize="12.5" fontFamily="var(--font-body)">input, offline &amp; degraded states</text>
      <rect x="90" y="216" width="120" height="26" rx="13" fill="#131022" stroke="#2a2342" />
      <text x="150" y="233" textAnchor="middle" fill="#a78bfa" fontSize="11" fontFamily="var(--font-mono)">9 component tests</text>

      {/* Spring Boot API (featured) */}
      <rect x="352" y="82" width="256" height="216" rx="18" fill="#131022" stroke="#8b5cf6" strokeWidth="2" filter="url(#csGlow)" />
      <text x="480" y="122" textAnchor="middle" fill="#f1eef9" fontSize="19" fontWeight="700" fontFamily="var(--font-display)">Spring Boot API</text>
      <text x="480" y="150" textAnchor="middle" fill="#a49dbd" fontSize="12.5" fontFamily="var(--font-body)">Dijkstra + Yen&apos;s K-shortest paths</text>
      <text x="480" y="168" textAnchor="middle" fill="#a49dbd" fontSize="12.5" fontFamily="var(--font-body)">Road-metadata domain · closures</text>
      <text x="480" y="186" textAnchor="middle" fill="#a49dbd" fontSize="12.5" fontFamily="var(--font-body)">Local fallback scoring</text>
      <rect x="398" y="204" width="164" height="26" rx="13" fill="#0d0b16" stroke="#2a2342" />
      <text x="480" y="221" textAnchor="middle" fill="#a78bfa" fontSize="11" fontFamily="var(--font-mono)">62 JUnit tests</text>
      <text x="480" y="254" textAnchor="middle" fill="#8b5cf6" fontSize="10.5" fontFamily="var(--font-mono)">/api/routes/alternatives</text>
      <text x="480" y="272" textAnchor="middle" fill="#8b5cf6" fontSize="10.5" fontFamily="var(--font-mono)">/api/routes/recommend</text>

      {/* FastAPI ranker */}
      <rect x="690" y="110" width="240" height="160" rx="18" fill="#0d0b16" stroke="#322a4a" strokeWidth="1.5" />
      <text x="810" y="150" textAnchor="middle" fill="#f1eef9" fontSize="19" fontWeight="700" fontFamily="var(--font-display)">FastAPI ranker</text>
      <text x="810" y="178" textAnchor="middle" fill="#a49dbd" fontSize="12.5" fontFamily="var(--font-body)">Deterministic preference scoring,</text>
      <text x="810" y="196" textAnchor="middle" fill="#a49dbd" fontSize="12.5" fontFamily="var(--font-body)">confidence &amp; explanations</text>
      <rect x="750" y="216" width="120" height="26" rx="13" fill="#131022" stroke="#2a2342" />
      <text x="810" y="233" textAnchor="middle" fill="#a78bfa" fontSize="11" fontFamily="var(--font-mono)">54 pytest tests</text>

      {/* arrows */}
      <line x1="270" y1="180" x2="344" y2="180" stroke="#8b5cf6" strokeWidth="2" markerEnd="url(#csArrow)" />
      <text x="307" y="168" textAnchor="middle" fill="#837da6" fontSize="11" fontFamily="var(--font-mono)">REST</text>
      <line x1="608" y1="180" x2="682" y2="180" stroke="#8b5cf6" strokeWidth="2" markerEnd="url(#csArrow)" />
      <text x="645" y="168" textAnchor="middle" fill="#837da6" fontSize="11" fontFamily="var(--font-mono)">HTTP</text>
      {/* fallback */}
      <path d="M760 282c-60 46-160 46-224 6" fill="none" stroke="#a78bfa" strokeWidth="1.8" strokeDasharray="5 6" markerEnd="url(#csArrow)" />
      <text x="648" y="330" textAnchor="middle" fill="#a78bfa" fontSize="11.5" fontFamily="var(--font-mono)">ranker unreachable → java-local-fallback</text>

      {/* CI strip */}
      <rect x="30" y="362" width="900" height="52" rx="14" fill="#0d0b16" stroke="#221d33" />
      <text x="58" y="393" fill="#837da6" fontSize="11.5" fontFamily="var(--font-mono)">GitHub Actions</text>
      {[
        { x: 170, w: 188, label: "API + e2e fallback drill" },
        { x: 370, w: 162, label: "ranking + benchmarks" },
        { x: 544, w: 154, label: "web lint/test/build" },
        { x: 710, w: 118, label: "Docker smoke" },
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

/** Fallback behavior as a three-beat sequence. */
export function FallbackDiagram() {
  const beats = [
    {
      x: 20,
      title: "Request in",
      lines: ["POST /api/routes/recommend", "preferences: “scenic, no tolls”"],
      accent: false,
    },
    {
      x: 330,
      title: "Ranker down",
      lines: ["FastAPI unreachable —", "timeout caught, no 500s"],
      accent: false,
      dashed: true,
    },
    {
      x: 640,
      title: "Degrade, don't fail",
      lines: ["Java local scoring answers;", "response flags the degradation"],
      accent: true,
    },
  ];
  return (
    <svg
      viewBox="0 0 960 210"
      role="img"
      aria-label="Fallback sequence: a recommendation request arrives, the ranking service is unreachable, and the Java API degrades to local scoring while flagging the response as java-local-fallback"
      className="h-auto w-full"
    >
      <defs>
        <marker id="fbArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0L10 5L0 10z" fill="#8b5cf6" />
        </marker>
      </defs>
      {beats.map((b) => (
        <g key={b.title}>
          <rect
            x={b.x}
            y="24"
            width="300"
            height="120"
            rx="16"
            fill={b.accent ? "#1c1533" : "#0d0b16"}
            stroke={b.accent ? "#8b5cf6" : "#322a4a"}
            strokeWidth={b.accent ? 1.8 : 1.5}
            strokeDasharray={b.dashed ? "6 6" : undefined}
          />
          <text x={b.x + 22} y="58" fill="#f1eef9" fontSize="15" fontWeight="700" fontFamily="var(--font-display)">
            {b.title}
          </text>
          {b.lines.map((l, j) => (
            <text key={l} x={b.x + 22} y={84 + j * 20} fill="#a49dbd" fontSize="12" fontFamily="var(--font-body)">
              {l}
            </text>
          ))}
        </g>
      ))}
      <line x1="320" y1="84" x2="328" y2="84" stroke="#8b5cf6" strokeWidth="2" markerEnd="url(#fbArrow)" />
      <line x1="630" y1="84" x2="638" y2="84" stroke="#8b5cf6" strokeWidth="2" markerEnd="url(#fbArrow)" />
      <rect x="640" y="158" width="300" height="30" rx="15" fill="#131022" stroke="#2a2342" />
      <text x="790" y="177" textAnchor="middle" fill="#a78bfa" fontSize="11.5" fontFamily="var(--font-mono)">
        rankingSource: java-local-fallback
      </text>
    </svg>
  );
}
