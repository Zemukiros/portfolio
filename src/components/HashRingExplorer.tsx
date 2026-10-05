"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { HashRing, floorModPos, ringFraction, ringHash } from "@/lib/hashRing";

const NODES = ["node-1", "node-2", "node-3", "node-4", "node-5"];
/** Violet ramp by lightness; node-5 (the newcomer) is also drawn raised off the ring. */
const NODE_COLOR = ["#1f4a29", "#1f4a29", "#285d33", "#c9d8bf", "#18211a"];
const VNODE_OPTIONS = [1, 10, 100, 200];
const KEY_COUNT = 100_000;

type Keys = { hi: Int32Array; lo: Uint32Array };

/** HashRingTest uses node-1…node-5 for its balance test and n1…n5 for its movement test. */
const TEST_MOVE_NODES = ["n1", "n2", "n3", "n4", "n5"];

const ringCache = new Map<string, HashRing>();
function ringFor(count: number, vnodes: number, names = NODES) {
  const k = `${names[0]}:${count}:${vnodes}`;
  let r = ringCache.get(k);
  if (!r) ringCache.set(k, (r = new HashRing(names.slice(0, count), vnodes)));
  return r;
}

function arcPath(r: number, a0: number, a1: number) {
  const [x0, y0] = [200 + r * Math.cos(a0), 200 + r * Math.sin(a0)];
  const [x1, y1] = [200 + r * Math.cos(a1), 200 + r * Math.sin(a1)];
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M${x0.toFixed(2)} ${y0.toFixed(2)}A${r} ${r} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
}

/** Each arc (previous point, this point] belongs to this point's node — keys walk clockwise. */
function buildArcs(ring: HashRing) {
  const pts = ring.points;
  const angle = (f: number) => f * Math.PI * 2 - Math.PI / 2;
  const arcs: { node: string; a0: number; a1: number }[] = [];
  for (let i = 0; i < pts.length; i++) {
    const prev = i === 0 ? ringFraction(pts[pts.length - 1]) - 1 : ringFraction(pts[i - 1]);
    const cur = ringFraction(pts[i]);
    const last = arcs[arcs.length - 1];
    if (last && last.node === pts[i].node) last.a1 = angle(cur);
    else arcs.push({ node: pts[i].node, a0: angle(prev), a1: angle(cur) });
  }
  return arcs;
}

function pct(x: number) {
  return `${(x * 100).toFixed(1)}%`;
}

export default function HashRingExplorer() {
  const [vnodes, setVnodes] = useState(200);
  const [count, setCount] = useState(5);
  const [keys, setKeys] = useState<Keys | null>(null);
  const [progress, setProgress] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  // Hash the 100,000 test keys once, in small chunks, when the panel nears the viewport.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let cancelled = false;
    let timer = 0;
    const start = () => {
      const hi = new Int32Array(KEY_COUNT);
      const lo = new Uint32Array(KEY_COUNT);
      let i = 0;
      const chunk = () => {
        if (cancelled) return;
        const end = Math.min(KEY_COUNT, i + 8_000);
        for (; i < end; i++) {
          const p = ringHash(`key-${i}`);
          hi[i] = p.hi;
          lo[i] = p.lo;
        }
        setProgress(i / KEY_COUNT);
        if (i < KEY_COUNT) timer = window.setTimeout(chunk, 0);
        else setKeys({ hi, lo });
      };
      chunk();
    };
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          io.disconnect();
          start();
        }
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(el);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      io.disconnect();
    };
  }, []);

  const ring = ringFor(count, vnodes);
  const arcs = useMemo(() => buildArcs(ring), [ring]);

  const load = useMemo(() => {
    if (!keys) return null;
    const counts = new Map<string, number>(NODES.slice(0, count).map((n) => [n, 0]));
    for (let i = 0; i < KEY_COUNT; i++) {
      const o = ring.ownerAt(keys.hi[i], keys.lo[i]);
      counts.set(o, counts.get(o)! + 1);
    }
    return [...counts.entries()].map(([node, c]) => ({ node, share: c / KEY_COUNT }));
  }, [keys, ring, count]);

  const moved = useMemo(() => {
    if (!keys) return null;
    const before = ringFor(4, vnodes, TEST_MOVE_NODES);
    const after = ringFor(5, vnodes, TEST_MOVE_NODES);
    let ringMoved = 0;
    let modMoved = 0;
    for (let i = 0; i < KEY_COUNT; i++) {
      if (before.ownerAt(keys.hi[i], keys.lo[i]) !== after.ownerAt(keys.hi[i], keys.lo[i])) ringMoved++;
      const p = { hi: keys.hi[i], lo: keys.lo[i] };
      if (floorModPos(p, 4) !== floorModPos(p, 5)) modMoved++;
    }
    return { ring: ringMoved / KEY_COUNT, mod: modMoved / KEY_COUNT };
  }, [keys, vnodes]);

  const fair = 1 / count;
  const busiest = load ? load.reduce((a, b) => (b.share > a.share ? b : a)) : null;
  const scale = load ? Math.max(0.5, ...load.map((l) => l.share)) : 0.5;

  const pill = (active: boolean) =>
    `rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
      active ? "bg-accent text-white" : "text-ink-dim hover:text-ink"
    }`;

  return (
    <div ref={rootRef} className="grid gap-10 rounded-3xl border border-border bg-bg-raised p-6 sm:p-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12">
      {/* ring */}
      <div className="mx-auto w-full max-w-[420px]">
        <svg
          viewBox="0 0 400 400"
          className="h-auto w-full"
          role="img"
          aria-label={`Hash ring with ${count} nodes and ${vnodes} virtual node${vnodes === 1 ? "" : "s"} each: ${arcs.length} arcs, each owned by the node whose point ends it.`}
        >
          <circle cx="200" cy="200" r="150" fill="none" stroke="#e7e3d6" strokeWidth="30" />
          {arcs.map((a, i) => {
            const idx = NODES.indexOf(a.node);
            const newcomer = idx === 4;
            return (
              <path
                key={i}
                d={arcPath(newcomer ? 156 : 150, a.a0, a.a1)}
                fill="none"
                stroke={NODE_COLOR[idx]}
                strokeWidth={newcomer ? 34 : 26}
              />
            );
          })}
          <text x="200" y="190" textAnchor="middle" fill="#18211a" fontSize="30" fontFamily="var(--font-display)">
            {(count * vnodes).toLocaleString("en-US")}
          </text>
          <text x="200" y="214" textAnchor="middle" fill="#485148" fontSize="12" fontFamily="var(--font-mono)">
            points on the ring
          </text>
          <text x="200" y="232" textAnchor="middle" fill="#5a6258" fontSize="11" fontFamily="var(--font-mono)">
            {count} nodes × {vnodes} vnode{vnodes === 1 ? "" : "s"}
          </text>
        </svg>
        <ul className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 font-mono text-[11px] text-ink-dim">
          {NODES.slice(0, count).map((n, i) => (
            <li key={n} className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: NODE_COLOR[i] }} aria-hidden="true" />
              {n}
              {i === 4 && <span className="text-ink-faint">(new)</span>}
            </li>
          ))}
        </ul>
      </div>

      {/* controls + measurements */}
      <div className="min-w-0">
        <div className="flex flex-wrap gap-x-8 gap-y-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-faint" id="vn-label">
              Virtual nodes
            </p>
            <div className="mt-2 flex gap-1 rounded-full border border-border p-1" role="group" aria-labelledby="vn-label">
              {VNODE_OPTIONS.map((v) => (
                <button key={v} type="button" aria-pressed={vnodes === v} onClick={() => setVnodes(v)} className={pill(vnodes === v)}>
                  {v}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-faint" id="cl-label">
              Cluster
            </p>
            <div className="mt-2 flex gap-1 rounded-full border border-border p-1" role="group" aria-labelledby="cl-label">
              {[4, 5].map((c) => (
                <button key={c} type="button" aria-pressed={count === c} onClick={() => setCount(c)} className={pill(count === c)}>
                  {c} nodes
                </button>
              ))}
            </div>
          </div>
        </div>

        {!keys ? (
          <div className="mt-8" aria-live="polite">
            <p className="font-mono text-xs text-ink-dim">Hashing 100,000 keys… {Math.round(progress * 100)}%</p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-bg-panel">
              <div className="h-full rounded-full bg-accent transition-[width]" style={{ width: `${progress * 100}%` }} />
            </div>
          </div>
        ) : (
          <>
            <div className="mt-8">
              <h3 className="font-display text-lg text-ink">Load per node</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-dim" aria-live="polite">
                Busiest node holds{" "}
                <span className="font-mono font-semibold text-accent-strong">{pct(busiest!.share)}</span> of keys — fair
                share is <span className="font-mono text-ink">{pct(fair)}</span>.
              </p>
              <div className="relative mt-4 space-y-2.5">
                {load!.map((l, i) => (
                  <div key={l.node} className="flex items-center gap-3">
                    <span className="w-14 shrink-0 font-mono text-[11px] text-ink-dim">{l.node}</span>
                    <div className="relative h-3 flex-1 rounded-full bg-bg-panel">
                      <div
                        className="h-full rounded-full transition-[width] duration-500"
                        style={{ width: `${(l.share / scale) * 100}%`, background: NODE_COLOR[i] }}
                      />
                      <span
                        className="absolute -top-1 bottom-[-4px] w-px bg-ink-faint"
                        style={{ left: `${(fair / scale) * 100}%` }}
                        aria-hidden="true"
                      />
                    </div>
                    <span className="w-12 shrink-0 text-right font-mono text-[11px] text-ink">{pct(l.share)}</span>
                  </div>
                ))}
              </div>
              <p className="mt-2 font-mono text-[10.5px] text-ink-faint">thin line = fair share</p>
            </div>

            <div className="mt-8">
              <h3 className="font-display text-lg text-ink">Add a 5th node to a 4-node cluster</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-dim">Share of keys that change owner:</p>
              <div className="mt-4 space-y-3">
                {[
                  { label: "consistent hashing", v: moved!.ring, strong: true },
                  { label: "hash % N", v: moved!.mod, strong: false },
                ].map((m) => (
                  <div key={m.label}>
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="font-mono text-[11px] text-ink-dim">{m.label}</span>
                      <span className={`font-mono text-sm font-semibold ${m.strong ? "text-accent-strong" : "text-ink"}`}>{pct(m.v)}</span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-bg-panel">
                      <div
                        className={`h-full rounded-full transition-[width] duration-500 ${m.strong ? "bg-accent" : "bg-border-strong"}`}
                        style={{ width: `${m.v * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <p className="mt-8 text-xs leading-relaxed text-ink-faint">
          Computed live in your browser: the same 100,000 keys and node names as HashRingTest, run
          through a TypeScript port of HashRing.java — same SHA-256 positions, same clockwise walk,
          preference lists checked bit-identical against the Java class on 3,000 keys.
        </p>
      </div>
    </div>
  );
}
