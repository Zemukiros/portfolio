/**
 * Product-mockup window illustrations for the showcase cards.
 * Dark app windows in the site's own visual language — stylized drawings of
 * each product's real (or planned) interface, not stock screenshots.
 */

export function Window({
  title,
  children,
  height = 330,
}: {
  title: string;
  children: React.ReactNode;
  height?: number;
}) {
  return (
    <svg viewBox={`0 0 500 ${height}`} aria-hidden="true" className="h-auto w-full">
      <rect x="2" y="2" width="496" height={height - 4} rx="16" fill="#0b0916" stroke="#3b3157" strokeWidth="1.5" />
      <circle cx="24" cy="24" r="4.5" fill="#f472b6" />
      <circle cx="42" cy="24" r="4.5" fill="#e8b45a" />
      <circle cx="60" cy="24" r="4.5" fill="#34d399" />
      <rect x="150" y="14" width="200" height="20" rx="10" fill="#161129" />
      <text x="250" y="28" textAnchor="middle" fill="#837da6" fontSize="11" fontFamily="var(--font-mono)">
        {title}
      </text>
      <line x1="2" y1="46" x2="498" y2="46" stroke="#221d33" />
      {children}
    </svg>
  );
}

export function IntelliRouteMockup() {
  return (
    <Window title="intelliroute.app/compare">
      {/* graph pane */}
      <g>
        {[
          [40, 290, 104, 216],
          [104, 216, 84, 130],
          [84, 130, 176, 92],
          [104, 216, 196, 170],
          [176, 92, 196, 170],
          [196, 170, 236, 264],
          [40, 290, 236, 264],
          [176, 92, 252, 120],
        ].map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#322a4a" strokeWidth="1.6" />
        ))}
        <path d="M40 290 L104 216 L196 170 L236 264" fill="none" stroke="#8b5cf6" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        {[
          [40, 290, 1],
          [104, 216, 0],
          [84, 130, 0],
          [176, 92, 0],
          [196, 170, 0],
          [236, 264, 1],
          [252, 120, 0],
        ].map(([x, y, big], i) => (
          <circle key={i} cx={x} cy={y} r={big ? 6.5 : 4.5} fill={big ? "#a78bfa" : "#584b85"} />
        ))}
      </g>
      {/* ranked list pane */}
      {[
        { y: 62, rank: "1", w: 120, hot: true },
        { y: 138, rank: "2", w: 96, hot: false },
        { y: 214, rank: "3", w: 108, hot: false },
      ].map((r) => (
        <g key={r.rank}>
          <rect x="288" y={r.y} width="188" height="64" rx="11" fill={r.hot ? "#1c1533" : "#131022"} stroke={r.hot ? "#8b5cf6" : "#2a2342"} strokeWidth={r.hot ? 1.8 : 1} />
          <circle cx="312" cy={r.y + 24} r="10" fill={r.hot ? "#8b5cf6" : "#322a4a"} />
          <text x="312" y={r.y + 28.5} textAnchor="middle" fill={r.hot ? "#fff" : "#a49dbd"} fontSize="12" fontWeight="700">
            {r.rank}
          </text>
          <rect x="330" y={r.y + 16} width={r.w} height="9" rx="4.5" fill={r.hot ? "#a78bfa" : "#3d3358"} />
          <rect x="330" y={r.y + 34} width={r.w - 34} height="7" rx="3.5" fill="#322a4a" />
          {r.hot && (
            <path d={`M448 ${r.y + 20}l6 7 10-13`} stroke="#34d399" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          )}
        </g>
      ))}
      {/* status bar (bottom-left: stays clear of the tilted crop) */}
      <rect x="24" y="296" width="200" height="24" rx="8" fill="#131022" stroke="#221d33" />
      <text x="124" y="312" textAnchor="middle" fill="#837da6" fontSize="10" fontFamily="var(--font-mono)">
        62✓ java · 54✓ py · 9✓ web
      </text>
    </Window>
  );
}

export function MeridianMockup() {
  const stages = [
    { x: 60, label: "received", state: "done" },
    { x: 180, label: "verified", state: "done" },
    { x: 300, label: "in flight", state: "active" },
    { x: 420, label: "delivered", state: "todo" },
  ] as const;
  return (
    <Window title="meridian — track order">
      {/* order header */}
      <text x="24" y="76" fill="#f1eef9" fontSize="14" fontWeight="700" fontFamily="var(--font-display)">
        Order MMA-1042
      </text>
      <text x="24" y="94" fill="#837da6" fontSize="10.5" fontFamily="var(--font-mono)">
        plan: priority · window: today 2–4 pm
      </text>
      <rect x="376" y="62" width="100" height="24" rx="12" fill="#0d2b26" stroke="#2dd4bf" strokeOpacity="0.6" />
      <text x="426" y="78" textAnchor="middle" fill="#2dd4bf" fontSize="10.5" fontFamily="var(--font-mono)">
        drone in flight
      </text>
      {/* four-stage tracker */}
      <line x1="60" y1="140" x2="300" y2="140" stroke="#34d399" strokeWidth="3" strokeLinecap="round" />
      <line x1="300" y1="140" x2="420" y2="140" stroke="#322a4a" strokeWidth="3" strokeLinecap="round" strokeDasharray="1 8" />
      {stages.map((s) => (
        <g key={s.label}>
          <circle
            cx={s.x}
            cy="140"
            r={s.state === "active" ? 11 : 8}
            fill={s.state === "done" ? "#34d399" : s.state === "active" ? "#0d2b26" : "#131022"}
            stroke={s.state === "todo" ? "#322a4a" : s.state === "active" ? "#2dd4bf" : "#34d399"}
            strokeWidth={s.state === "active" ? 2.2 : 1.5}
          />
          {s.state === "done" && (
            <path d={`M${s.x - 3.5} 140l2.5 3 5-6`} stroke="#07060c" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          )}
          <text x={s.x} y="170" textAnchor="middle" fill={s.state === "todo" ? "#584b85" : "#a49dbd"} fontSize="10" fontFamily="var(--font-mono)">
            {s.label}
          </text>
        </g>
      ))}
      {/* drone above the active stage */}
      <g transform="translate(300 108)">
        <line x1="-12" y1="0" x2="12" y2="0" stroke="#2dd4bf" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="-12" cy="0" r="3.5" fill="none" stroke="#2dd4bf" strokeWidth="1.6" />
        <circle cx="12" cy="0" r="3.5" fill="none" stroke="#2dd4bf" strokeWidth="1.6" />
        <rect x="-4" y="1" width="8" height="6" rx="2" fill="#2dd4bf" />
      </g>
      {/* delivery details card */}
      <rect x="24" y="196" width="284" height="88" rx="11" fill="#131022" stroke="#2a2342" />
      <rect x="40" y="212" width="118" height="8" rx="4" fill="#3d3358" />
      <rect x="40" y="230" width="176" height="7" rx="3.5" fill="#322a4a" />
      <rect x="40" y="246" width="146" height="7" rx="3.5" fill="#322a4a" />
      <text x="40" y="272" fill="#837da6" fontSize="10" fontFamily="var(--font-mono)">
        payment ✓ card ····4242 (simulated)
      </text>
      {/* staff ops panel hint */}
      <rect x="324" y="196" width="152" height="88" rx="11" fill="#0e0b1a" stroke="#221d33" />
      <text x="340" y="218" fill="#a49dbd" fontSize="10.5" fontWeight="600" fontFamily="var(--font-mono)">
        ops · pipeline
      </text>
      {[234, 252, 270].map((y, i) => (
        <g key={y}>
          <circle cx="348" cy={y - 3} r="4" fill={["#34d399", "#2dd4bf", "#322a4a"][i]} />
          <rect x="360" y={y - 8} width={[92, 74, 84][i]} height="7" rx="3.5" fill="#322a4a" />
        </g>
      ))}
      {/* status bar */}
      <rect x="24" y="296" width="220" height="24" rx="8" fill="#131022" stroke="#221d33" />
      <text x="134" y="312" textAnchor="middle" fill="#837da6" fontSize="10" fontFamily="var(--font-mono)">
        69✓ tests · live on company domain
      </text>
    </Window>
  );
}

export function RhythmiqMockup() {
  return (
    <Window title="rhythmiq — library">
      {/* sidebar */}
      <rect x="2" y="47" width="118" height="281" fill="#0e0b1a" />
      <circle cx="30" cy="76" r="10" fill="#8b5cf6" />
      <rect x="48" y="70" width="52" height="10" rx="5" fill="#a78bfa" />
      {[104, 128, 152, 176].map((y, i) => (
        <rect key={y} x="24" y={y} width={i === 1 ? 76 : 60} height="8" rx="4" fill={i === 1 ? "#584b85" : "#322a4a"} />
      ))}
      {/* playlist header */}
      <rect x="140" y="66" width="56" height="56" rx="10" fill="#6d28d9" />
      <path d="M158 102V80l18-5v22" stroke="#f1eef9" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="155" cy="102" r="5" fill="#f1eef9" />
      <circle cx="173" cy="97" r="5" fill="#f1eef9" />
      <rect x="210" y="72" width="130" height="13" rx="6.5" fill="#f1eef9" />
      <rect x="210" y="96" width="88" height="9" rx="4.5" fill="#584b85" />
      {/* track rows */}
      {[
        { y: 142, w: 150, hot: false },
        { y: 180, w: 118, hot: true },
        { y: 218, w: 168, hot: false },
      ].map((t, i) => (
        <g key={i}>
          <rect x="140" y={t.y} width="336" height="30" rx="8" fill={t.hot ? "#1c1533" : "transparent"} stroke={t.hot ? "#8b5cf6" : "transparent"} />
          <rect x="150" y={t.y + 6} width="18" height="18" rx="5" fill={["#7c3aed", "#d946ef", "#4f46e5"][i]} />
          <rect x="180" y={t.y + 11} width={t.w} height="8" rx="4" fill={t.hot ? "#a78bfa" : "#3d3358"} />
          <text x="462" y={t.y + 20} textAnchor="end" fill="#837da6" fontSize="10" fontFamily="var(--font-mono)">
            {["3:42", "4:05", "2:58"][i]}
          </text>
        </g>
      ))}
      {/* now playing bar */}
      <rect x="140" y="268" width="336" height="42" rx="12" fill="#131022" stroke="#2a2342" />
      <circle cx="168" cy="289" r="13" fill="#8b5cf6" />
      <path d="M164 282l12 7-12 7z" fill="#fff" />
      <rect x="194" y="284" width="70" height="7" rx="3.5" fill="#584b85" />
      <rect x="194" y="296" width="230" height="4" rx="2" fill="#221d33" />
      <rect x="194" y="296" width="120" height="4" rx="2" fill="#a78bfa" />
    </Window>
  );
}

export function QueryGuardMockup() {
  return (
    <Window title="queryguard — ask your data">
      {/* prompt */}
      <rect x="24" y="64" width="452" height="34" rx="10" fill="#131022" stroke="#3b3157" />
      <text x="40" y="86" fill="#f1eef9" fontSize="13" fontFamily="var(--font-mono)">
        &gt; revenue by region, last quarter?
      </text>
      {/* generated SQL */}
      <rect x="24" y="112" width="452" height="76" rx="10" fill="#0e0b1a" stroke="#221d33" />
      <text x="40" y="136" fill="#a78bfa" fontSize="12" fontFamily="var(--font-mono)">
        SELECT region, SUM(total) FROM orders
      </text>
      <text x="40" y="156" fill="#a78bfa" fontSize="12" fontFamily="var(--font-mono)">
        WHERE placed_at &gt;= date &apos;2026-04-01&apos;
      </text>
      <text x="40" y="176" fill="#584b85" fontSize="12" fontFamily="var(--font-mono)">
        GROUP BY region LIMIT 500;
      </text>
      {/* guardrails */}
      {["read-only", "schema-valid", "back-translation ✓"].map((g, i) => (
        <g key={g}>
          <rect x={24 + i * 156} y="202" width="146" height="26" rx="13" fill="#131022" stroke="#2a2342" />
          <circle cx={42 + i * 156} cy="215" r="6" fill="#34d399" opacity="0.9" />
          <text x={54 + i * 156} y="219" fill="#a49dbd" fontSize="10.5" fontFamily="var(--font-mono)">
            {g}
          </text>
        </g>
      ))}
      {/* confidence */}
      <text x="24" y="262" fill="#837da6" fontSize="11" fontFamily="var(--font-mono)">
        confidence
      </text>
      <rect x="110" y="252" width="300" height="10" rx="5" fill="#221d33" />
      <rect x="110" y="252" width="276" height="10" rx="5" fill="#8b5cf6" />
      <text x="424" y="262" fill="#a78bfa" fontSize="12" fontWeight="600" fontFamily="var(--font-mono)">
        0.92
      </text>
      {/* result rows */}
      {[288, 306].map((y, i) => (
        <g key={y}>
          <rect x="24" y={y} width="140" height="10" rx="5" fill="#322a4a" />
          <rect x="180" y={y} width={i === 0 ? 200 : 150} height="10" rx="5" fill="#1c1533" />
        </g>
      ))}
    </Window>
  );
}
