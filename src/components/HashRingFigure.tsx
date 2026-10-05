import { HashRing, ringFraction, ringHash } from "@/lib/hashRing";

/**
 * Static, product-true Mini-S3 hash ring: four storage nodes placed by the same SHA-256
 * ring as the repo (simplified to one virtual node each for legibility; the repo uses 200),
 * and one key whose 3-replica preference list is drawn as a green arc.
 * This is the reduced-motion / no-WebGL fallback for the 3D object (Phase 3).
 */
const NODES = ["node-1", "node-2", "node-3", "node-4"];
const KEY = "photos/2026/field-notes.jpg";
const ring = new HashRing(NODES, 1);
const preference = ring.preferenceList(KEY, 3);

const C = 200;
const R = 132;
const angle = (fraction: number) => fraction * Math.PI * 2 - Math.PI / 2;
const at = (fraction: number, r = R) => [C + r * Math.cos(angle(fraction)), C + r * Math.sin(angle(fraction))] as const;

const nodes = ring.points.map((p) => ({ id: p.node, f: ringFraction(p) }));
const keyF = ringFraction(ringHash(KEY));

/** Clockwise arc from the key to the last replica in its preference list. */
const lastReplica = nodes.find((n) => n.id === preference[preference.length - 1])!;
const sweep = (lastReplica.f - keyF + 1) % 1;
const arc = (() => {
  const [x0, y0] = at(keyF);
  const [x1, y1] = at(keyF + sweep);
  return `M${x0.toFixed(2)} ${y0.toFixed(2)}A${R} ${R} 0 ${sweep > 0.5 ? 1 : 0} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
})();

export default function HashRingFigure({ className = "" }: { className?: string }) {
  const [kx, ky] = at(keyF);
  return (
    <svg
      viewBox="-40 0 480 400"
      className={className}
      role="img"
      aria-label={`Mini-S3 hash ring: four storage nodes on a SHA-256 ring. The key ${KEY} is stored on ${preference.join(", ")} — the first three nodes clockwise from its position.`}
    >
      <circle cx={C} cy={C} r={R + 34} fill="none" stroke="var(--color-border)" strokeWidth="1" />
      <circle cx={C} cy={C} r={R} fill="none" stroke="var(--color-ink)" strokeOpacity="0.85" strokeWidth="1.25" />
      <circle cx={C} cy={C} r={R - 34} fill="none" stroke="var(--color-border)" strokeWidth="1" strokeDasharray="2 6" />

      <path d={arc} fill="none" stroke="var(--color-accent)" strokeWidth="3" strokeLinecap="round" />

      {nodes.map((n) => {
        const [x, y] = at(n.f);
        const [lx, ly] = at(n.f, R + 54);
        const rank = preference.indexOf(n.id);
        const replica = rank >= 0;
        return (
          <g key={n.id}>
            <circle
              cx={x}
              cy={y}
              r={replica ? 9 : 7}
              fill={replica ? "var(--color-accent)" : "var(--color-bg)"}
              stroke={replica ? "var(--color-accent)" : "var(--color-ink)"}
              strokeWidth="1.5"
            />
            <text
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="middle"
              className="font-mono"
              fontSize="11"
              fill={replica ? "var(--color-accent-strong)" : "var(--color-ink-faint)"}
            >
              {replica ? `${n.id} · r${rank + 1}` : n.id}
            </text>
          </g>
        );
      })}

      <circle cx={kx} cy={ky} r="5" fill="var(--color-ink)" />
      <text x={C} y={C - 8} textAnchor="middle" className="font-mono" fontSize="10.5" fill="var(--color-ink-faint)">
        key
      </text>
      <text x={C} y={C + 10} textAnchor="middle" className="font-mono" fontSize="11" fill="var(--color-ink)">
        {KEY}
      </text>
    </svg>
  );
}
