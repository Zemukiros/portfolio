/**
 * Authored hero visual: an IntelliRoute-flavored road graph.
 * A violet route lights up across a node network — the product's real
 * mechanism (K-shortest paths + preference ranking) dramatized, not a stock
 * illustration. Pure SVG, animates once on load, honors reduced motion.
 */

const GRAY_EDGES: [number, number, number, number][] = [
  [72, 408, 178, 302], // A-B
  [178, 302, 142, 168], // B-C
  [142, 168, 296, 96], // C-D
  [296, 96, 330, 236], // D-E
  [178, 302, 330, 236], // B-E
  [330, 236, 462, 126], // E-F
  [296, 96, 462, 126], // D-F
  [462, 126, 508, 300], // F-G'
  [330, 236, 428, 330], // E-G
  [68, 452, 246, 452], // A-I
  [246, 452, 428, 330], // I-G
  [142, 168, 330, 236], // C-E
  [428, 330, 508, 300], // G-F'
];

const ROUTE = "M72 408 L178 302 L330 236 L428 330 L516 424";

const NODES: { x: number; y: number; d?: number; big?: boolean }[] = [
  { x: 72, y: 408, big: true, d: 1 },
  { x: 178, y: 302, d: 3 },
  { x: 142, y: 168, d: 4 },
  { x: 296, y: 96, d: 5 },
  { x: 330, y: 236, d: 5 },
  { x: 462, y: 126, d: 6 },
  { x: 428, y: 330, d: 7 },
  { x: 508, y: 300, d: 7 },
  { x: 246, y: 452, d: 4 },
  { x: 516, y: 424, big: true, d: 8 },
];

/** Compact static route strip for small screens — the same mechanism, no animation. */
export function RouteStrip() {
  return (
    <svg
      viewBox="0 0 360 120"
      role="img"
      aria-label="A road network with the top-ranked route highlighted, in the style of the IntelliRoute platform"
      className="h-auto w-full"
    >
      {[
        [16, 96, 92, 56],
        [92, 56, 170, 78],
        [92, 56, 150, 22],
        [150, 22, 250, 34],
        [170, 78, 250, 34],
        [250, 34, 344, 88],
        [170, 78, 262, 98],
        [262, 98, 344, 88],
      ].map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#322a4a" strokeWidth="1.3" />
      ))}
      <path
        d="M16 96 L92 56 L170 78 L262 98 L344 88"
        fill="none"
        stroke="#8b5cf6"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {[
        [16, 96, true],
        [92, 56, false],
        [150, 22, false],
        [170, 78, false],
        [250, 34, false],
        [262, 98, false],
        [344, 88, true],
      ].map(([x, y, big], i) => (
        <circle key={i} cx={x as number} cy={y as number} r={big ? 5.5 : 3.5} fill={big ? "#a78bfa" : "#584b85"} />
      ))}
    </svg>
  );
}

export default function HeroGraph() {
  return (
    <svg
      viewBox="0 0 580 520"
      role="img"
      aria-label="Illustration of a road network graph with the top-ranked route highlighted, in the style of the IntelliRoute platform"
      className="h-auto w-full max-w-[560px]"
    >
      <defs>
        <filter id="routeGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* base network */}
      {GRAY_EDGES.map(([x1, y1, x2, y2], i) => (
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#322a4a"
          strokeWidth="1.5"
          className="graph-edge"
          style={{ ["--edge-len" as string]: 300, animationDelay: `${0.4 + i * 0.05}s` }}
        />
      ))}

      {/* highlighted route */}
      <path
        d={ROUTE}
        fill="none"
        stroke="#8b5cf6"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#routeGlow)"
        className="graph-edge graph-route"
        style={{ ["--edge-len" as string]: 700, animationDelay: "1.1s" }}
      />

      {/* nodes */}
      {NODES.map((n, i) => (
        <g key={i} className="graph-node" style={{ animationDelay: `${0.5 + (n.d ?? 3) * 0.12}s` }}>
          {n.big && (
            <circle cx={n.x} cy={n.y} r="15" fill="none" stroke="#8b5cf6" strokeOpacity="0.45" strokeWidth="1.5" />
          )}
          <circle cx={n.x} cy={n.y} r={n.big ? 7.5 : 5} fill={n.big ? "#a78bfa" : "#584b85"} />
        </g>
      ))}

      {/* origin / destination labels */}
      <g className="graph-node" style={{ animationDelay: "1.5s" }}>
        <text x="60" y="380" textAnchor="middle" fill="#a49dbd" fontSize="12" fontFamily="var(--font-mono)">
          origin
        </text>
        <text x="516" y="460" textAnchor="middle" fill="#a49dbd" fontSize="12" fontFamily="var(--font-mono)">
          destination
        </text>
      </g>

      {/* ranking chip */}
      <g className="graph-node" style={{ animationDelay: "2s" }}>
        <rect x="296" y="24" rx="10" width="262" height="62" fill="#131022" stroke="#322a4a" />
        <circle cx="320" cy="55" r="9" fill="#8b5cf6" />
        <text x="320" y="59" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="700" fontFamily="var(--font-body)">
          1
        </text>
        <text x="340" y="50" fill="#f1eef9" fontSize="13" fontWeight="600" fontFamily="var(--font-body)">
          Fastest · avoids tolls
        </text>
        <text x="340" y="70" fill="#a49dbd" fontSize="11" fontFamily="var(--font-mono)">
          confidence 0.92 · 3 alts
        </text>
      </g>
    </svg>
  );
}
