"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import {
  BUCKET,
  MiniS3Sim,
  NODE_IDS,
  SIM,
  formatSize,
  type Endpoint,
  type LogEntry,
  type Packet,
  type PacketKind,
} from "@/lib/miniS3Sim";

/* ------------------------------------------------------------------ layout */

const VIEW_W = 960;
const VIEW_H = 500;
const TILE = { w: 165, h: 176, y: 190 };
const TILE_X = [20, 205, 390, 575];
const API = { x: 300, y: 20, w: 240, h: 90 };
const WORKER = { x: 300, y: 404, w: 240, h: 78 };
const CLIENT = { x: 20, y: 28, w: 150, h: 74 };
const PG = { x: 770, y: 205, w: 170, h: 95 };

type Pt = [number, number];
const nodeCx = (i: number) => TILE_X[i] + TILE.w / 2;

function baseRoute(a: Endpoint, b: Endpoint): Pt[] | null {
  const pair = `${a}>${b}`;
  if (pair === "client>api") return [[170, 65], [300, 65]];
  if (pair === "api>pg") return [[540, 50], [855, 50], [855, 205]];
  if (pair === "worker>pg") return [[540, 443], [855, 443], [855, 300]];
  const i = NODE_IDS.indexOf(b as (typeof NODE_IDS)[number]);
  if (i >= 0 && a === "api") return [[420, 110], [nodeCx(i), TILE.y]];
  if (i >= 0 && a === "worker") return [[420, 404], [nodeCx(i), TILE.y + TILE.h]];
  return null;
}

function route(from: Endpoint, to: Endpoint): Pt[] {
  return baseRoute(from, to) ?? [...(baseRoute(to, from) ?? [[0, 0], [0, 0]])].reverse();
}

function pointAt(pts: Pt[], t: number): Pt {
  const lens = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
  let d = lens.reduce((a, b) => a + b, 0) * t;
  for (let i = 0; i < lens.length; i++) {
    if (d <= lens[i] || i === lens.length - 1) {
      const f = lens[i] ? Math.min(1, d / lens[i]) : 0;
      return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f];
    }
    d -= lens[i];
  }
  return pts[pts.length - 1];
}

const PACKET_STYLE: Record<PacketKind, { r: number; fill: string; stroke?: string; opacity?: number }> = {
  write: { r: 5, fill: "#2f6a3b" },
  ack: { r: 3.5, fill: "#2f855a" },
  read: { r: 4, fill: "#285d33" },
  data: { r: 5, fill: "#285d33" },
  repair: { r: 5.5, fill: "#9fbf95", stroke: "#18211a" },
  heartbeat: { r: 2.5, fill: "#5a6258", opacity: 0.8 },
  meta: { r: 3, fill: "#485148" },
  gc: { r: 3.5, fill: "#fbfaf5", stroke: "#485148" },
  response: { r: 4.5, fill: "#2f855a" },
  fail: { r: 4.5, fill: "#c2416b" },
};

const BLOB_LABEL: Record<string, string> = {
  live: "live copy",
  garbage: "bytes awaiting GC",
  corrupt: "corrupt copy (not yet detected)",
  pending: "write in progress",
};

function fmtTime(ms: number) {
  const s = ms / 1000;
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, "0")}:${(s - m * 60).toFixed(1).padStart(4, "0")}`;
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return matches;
}

/* --------------------------------------------------------------- topology */

function Box({
  x,
  y,
  w,
  h,
  title,
  sub,
  lines = [],
  featured,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  sub: string;
  lines?: { text: string; tone?: "accent" | "dim" }[];
  featured?: boolean;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="14"
        fill={featured ? "#e7e3d6" : "#efece2"}
        stroke={featured ? "#2f6a3b" : "#c4bfae"}
        strokeWidth={featured ? 1.8 : 1.3}
      />
      <text x={x + 16} y={y + 26} fill="#18211a" fontSize="15" fontFamily="var(--font-display)">
        {title}
      </text>
      <text x={x + 16} y={y + 44} fill="#5a6258" fontSize="10.5" fontFamily="var(--font-mono)">
        {sub}
      </text>
      {lines.map((l, i) => (
        <text
          key={i}
          x={x + 16}
          y={y + 64 + i * 15}
          fill={l.tone === "accent" ? "#285d33" : "#485148"}
          fontSize="10.5"
          fontFamily="var(--font-mono)"
        >
          {l.text}
        </text>
      ))}
    </g>
  );
}

function clip(s: string, n: number) {
  return s.length > n ? `${s.slice(0, n - 1)}…` : s;
}

function Topology({
  sim,
  selectedId,
  reduced,
  locked,
  compact,
  onToggleNode,
}: {
  sim: MiniS3Sim;
  selectedId?: string;
  reduced: boolean;
  locked: boolean;
  /** Below md the HTML node buttons take over, so the SVG ones leave the tab order. */
  compact: boolean;
  onToggleNode: (id: string) => void;
}) {
  const [focused, setFocused] = useState<string | null>(null);
  const now = sim.now;
  const committed = [...sim.objects.values()].filter((o) => o.status === "COMMITTED");
  let rows = 0;
  for (const set of sim.replicas.values()) rows += set.size;

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      className="h-auto w-full"
      role="group"
      aria-label="Cluster topology: client, API server, Postgres, four storage nodes, and the background worker. Each storage node has a button to stop or start it."
    >
      <defs>
        <filter id="simGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="8" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* private network frame */}
      <rect x="10" y="10" width={VIEW_W - 20} height={VIEW_H - 20} rx="20" fill="none" stroke="#dcd8ca" strokeDasharray="4 6" />
      <text x={VIEW_W - 24} y={VIEW_H - 22} textAnchor="end" fill="#5a6258" fontSize="10.5" fontFamily="var(--font-mono)">
        docker network · only :8080 published
      </text>

      {/* static links */}
      <g stroke="#c4bfae" strokeWidth="1.4" fill="none">
        {[
          route("client", "api"),
          route("api", "pg"),
          route("worker", "pg"),
          ...NODE_IDS.map((n) => route("api", n)),
          ...NODE_IDS.map((n) => route("worker", n)),
        ].map((pts, i) => (
          <polyline key={i} points={pts.map((p) => p.join(",")).join(" ")} />
        ))}
      </g>

      <Box {...CLIENT} title="Client" sub="curl · SDK" lines={[{ text: "X-Api-Key" }]} />
      <g filter="url(#simGlow)">
        <rect x={API.x} y={API.y} width={API.w} height={API.h} rx="14" fill="none" stroke="#2f6a3b" strokeOpacity="0.35" />
      </g>
      <Box
        {...API}
        featured
        title="API server"
        sub="Spring Boot · :8080 · W=2"
        lines={[{ text: clip(sim.apiActivity === "idle" ? "idle" : sim.apiActivity, 32), tone: sim.apiActivity === "idle" ? "dim" : "accent" }]}
      />
      <Box
        {...PG}
        title="Postgres"
        sub="metadata only"
        lines={[
          { text: `objects   ${committed.length}` },
          { text: `replicas  ${rows}` },
        ]}
      />
      <Box
        {...WORKER}
        title="Worker"
        sub="detect 2s · repair 3s · GC 5s"
        lines={[{ text: clip(sim.workerActivity, 32), tone: sim.workerActivity === "idle" ? "dim" : "accent" }]}
      />

      {/* storage nodes */}
      {NODE_IDS.map((id, i) => {
        const node = sim.nodes.get(id)!;
        const x = TILE_X[i];
        const y = TILE.y;
        const silent = (now - node.lastHeartbeat) / 1000;
        const suspect = !node.running && node.status === "UP";
        const down = node.status === "DOWN";
        const status = node.running
          ? down
            ? { text: "starting…", fill: "#5a6258" }
            : { text: `heartbeat ${Math.max(0, silent).toFixed(1)}s ago`, fill: "#5a6258" }
          : suspect
            ? { text: `stopped · silent ${silent.toFixed(1)}s`, fill: "#b7791f" }
            : { text: "stopped", fill: "#c2416b" };
        const blobs = [...node.blobs.entries()]
          .map(([oid, b]) => {
            const o = sim.objects.get(oid);
            const hasRow = sim.replicas.get(oid)?.has(id) ?? false;
            const state = b.corrupt && hasRow
              ? "corrupt"
              : o?.status === "COMMITTED" && hasRow
                ? "live"
                : o?.status === "PENDING"
                  ? "pending"
                  : "garbage";
            return { oid, key: o?.key ?? "deleted object", state, order: o?.createdAt ?? 1e12, fresh: b.at };
          })
          .sort((a, b) => (a.state === "garbage" ? 1 : 0) - (b.state === "garbage" ? 1 : 0) || a.order - b.order);
        const CAP = 28;
        const shown = blobs.length > CAP ? blobs.slice(0, CAP - 1) : blobs;
        const beat = !reduced && node.running && now - node.lastBeatSent < 260;

        return (
          <g key={id}>
            <rect
              x={x}
              y={y}
              width={TILE.w}
              height={TILE.h}
              rx="16"
              fill="#efece2"
              stroke={down ? "#c2416b" : suspect ? "#b7791f" : "#c4bfae"}
              strokeOpacity={down || suspect ? 0.7 : 1}
              strokeWidth="1.4"
              strokeDasharray={down ? "6 5" : undefined}
            />
            <g opacity={down || !node.running ? 0.5 : 1}>
              <circle cx={x + 18} cy={y + 21} r={beat ? 5 : 3.5} fill={node.running ? "#2f855a" : "#9aa08f"} opacity={beat ? 1 : 0.85} />
              <text x={x + 30} y={y + 26} fill="#18211a" fontSize="15" fontFamily="var(--font-display)">
                {id}
              </text>
            </g>
            <rect x={x + TILE.w - 58} y={y + 11} width="46" height="20" rx="10" fill={down ? "#f6e3ea" : "#e2efe6"} />
            <text
              x={x + TILE.w - 35}
              y={y + 25}
              textAnchor="middle"
              fill={down ? "#c2416b" : "#2f855a"}
              fontSize="10.5"
              fontWeight="600"
              fontFamily="var(--font-mono)"
            >
              {node.status}
            </text>
            <text x={x + 14} y={y + 48} fill={status.fill} fontSize="10" fontFamily="var(--font-mono)">
              {status.text}
            </text>

            <g opacity={down || !node.running ? 0.5 : 1}>
              {shown.map((b, j) => {
                const cx = x + 14 + (j % 7) * 19;
                const cy = y + 60 + Math.floor(j / 7) * 19;
                const selected = b.oid === selectedId;
                const fill =
                  b.state === "live"
                    ? selected
                      ? "#18211a"
                      : "#2f6a3b"
                    : b.state === "pending"
                      ? "#9aa08f"
                      : b.state === "corrupt"
                        ? "#c2416b"
                        : "none";
                return (
                  <rect
                    key={b.oid}
                    className={b.fresh > 0 ? "sim-blob" : undefined}
                    x={cx}
                    y={cy}
                    width="14"
                    height="14"
                    rx="3.5"
                    fill={fill}
                    stroke={b.state === "garbage" ? "#9aa08f" : selected ? "#285d33" : "none"}
                    strokeWidth={selected ? 2 : 1.2}
                    strokeDasharray={b.state === "garbage" ? "2 2" : undefined}
                  >
                    <title>{`${b.key} — ${BLOB_LABEL[b.state]}`}</title>
                  </rect>
                );
              })}
              {blobs.length > CAP && (
                <text x={x + 14 + 6 * 19 + 7} y={y + 60 + 3 * 19 + 11} textAnchor="middle" fill="#485148" fontSize="9.5" fontFamily="var(--font-mono)">
                  +{blobs.length - CAP + 1}
                </text>
              )}
            </g>

            <text x={x + 14} y={y + 162} fill={down ? "#5a6258" : "#485148"} fontSize="10.5" fontFamily="var(--font-mono)">
              {sim.copiesOn(id)} {down ? "unreachable" : "copies"}
            </text>
            <g
              className="sim-hit"
              role="button"
              tabIndex={locked || compact ? -1 : 0}
              aria-hidden={compact || undefined}
              aria-disabled={locked}
              aria-label={node.running ? `Stop ${id}` : `Start ${id}`}
              onClick={() => !locked && onToggleNode(id)}
              onKeyDown={(e) => {
                if (!locked && (e.key === "Enter" || e.key === " ")) {
                  e.preventDefault();
                  onToggleNode(id);
                }
              }}
              onFocus={() => setFocused(id)}
              onBlur={() => setFocused(null)}
              opacity={locked ? 0.4 : 1}
            >
              {focused === id && (
                <rect x={x + TILE.w - 74} y={y + 144} width="64" height="28" rx="14" fill="none" stroke="#285d33" strokeWidth="2" />
              )}
              <rect
                x={x + TILE.w - 70}
                y={y + 148}
                width="56"
                height="20"
                rx="10"
                fill={node.running ? "#f6e3ea" : "#dfe8d8"}
                stroke={node.running ? "#c2416b" : "#2f6a3b"}
                strokeOpacity="0.7"
              />
              <text
                x={x + TILE.w - 42}
                y={y + 162}
                textAnchor="middle"
                fill={node.running ? "#c2416b" : "#285d33"}
                fontSize="10.5"
                fontWeight="600"
                fontFamily="var(--font-mono)"
              >
                {node.running ? "stop" : "start"}
              </text>
            </g>
          </g>
        );
      })}

      {/* packets in flight */}
      {!reduced &&
        sim.packets.map((p: Packet) => {
          const raw = (now - p.start) / (p.end - p.start);
          if (raw < 0 || raw > 1) return null;
          const t = p.broken ? Math.min(raw, 0.84) : raw;
          const [cx, cy] = pointAt(route(p.from, p.to), t);
          const s = p.broken && raw > 0.6 ? PACKET_STYLE.fail : PACKET_STYLE[p.kind];
          return (
            <circle
              key={p.id}
              cx={cx}
              cy={cy}
              r={s.r}
              fill={s.fill}
              stroke={s.stroke}
              strokeWidth={s.stroke ? 1.5 : undefined}
              opacity={p.broken && raw > 0.84 ? 1 - (raw - 0.84) / 0.16 : (s.opacity ?? 1)}
            />
          );
        })}
    </svg>
  );
}

/* ---------------------------------------------------------------- panels */

const ObjectsPanel = memo(function ObjectsPanel({
  sim,
  selectedKey,
  locked,
  onSelect,
  act0,
}: {
  sim: MiniS3Sim;
  version: number;
  selectedKey: string | null;
  locked: boolean;
  onSelect: (key: string) => void;
  /** Runs an action, resuming the clock first if the simulation is paused. */
  act0: <T,>(fn: () => T) => T;
}) {
  const objects = [...sim.objects.values()]
    .filter((o) => o.status !== "DELETED" || (sim.replicas.get(o.id)?.size ?? 0) > 0)
    .sort((a, b) => a.createdAt - b.createdAt || a.key.localeCompare(b.key));

  const act = "rounded-lg border border-border-strong px-2 py-1 text-[11.5px] font-medium text-ink-dim transition-colors hover:border-accent hover:text-accent-strong disabled:cursor-default disabled:opacity-40 disabled:hover:border-border-strong disabled:hover:text-ink-dim";

  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-bg-raised">
      <div className="flex items-baseline justify-between gap-3 border-b border-border px-4 py-3">
        <h3 className="font-display text-sm text-ink">Objects</h3>
        <p className="font-mono text-[11px] text-ink-faint">bucket: {BUCKET} · click a row to highlight its copies</p>
      </div>
      <ul className="max-h-[300px] flex-1 overflow-y-auto p-2">
        {objects.map((o) => {
          const live = sim.liveReplicaNodes(o.id);
          const selected = o.status === "COMMITTED" && o.key === selectedKey;
          const tomb = o.status === "DELETED";
          return (
            <li key={o.id}>
              <div
                className={`flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border px-3 py-2.5 transition-colors ${
                  selected ? "border-accent/40 bg-accent/10" : "border-transparent hover:bg-bg-panel"
                } ${tomb ? "opacity-55" : ""}`}
              >
                <button
                  type="button"
                  onClick={() => onSelect(o.key)}
                  disabled={tomb}
                  aria-pressed={selected}
                  className="min-w-[12rem] flex-1 text-left disabled:cursor-default"
                >
                  <span className="block truncate font-mono text-[12.5px] text-ink">{o.key}</span>
                  <span className="mt-0.5 block font-mono text-[10.5px] text-ink-faint">
                    {formatSize(o.size)} ·{" "}
                    {o.status === "COMMITTED" ? (
                      <span title={`live copies on ${live.join(", ") || "no UP node"}`}>
                        <span className={live.length !== SIM.replication ? "text-amber" : "text-ink-dim"}>
                          {live.length}/{SIM.replication}
                        </span>{" "}
                        · {live.join(" ") || "no live copy"}
                      </span>
                    ) : o.status === "PENDING" ? (
                      <span className="text-accent-strong">PENDING · writing</span>
                    ) : (
                      <span>tombstone · waiting for GC</span>
                    )}
                  </span>
                </button>
                {o.status === "COMMITTED" && (
                  <div className="flex flex-wrap gap-1.5">
                    <button type="button" className={act} disabled={locked} aria-label={`GET ${o.key}`} onClick={() => { onSelect(o.key); void act0(() => sim.download(o.key)); }}>
                      GET
                    </button>
                    <button type="button" className={act} disabled={locked} aria-label={`Overwrite ${o.key}`} onClick={() => { onSelect(o.key); act0(() => sim.upload(o.key, o.size)); }}>
                      Overwrite
                    </button>
                    <button type="button" className={act} disabled={locked} aria-label={`Corrupt a copy of ${o.key}`} onClick={() => { onSelect(o.key); act0(() => sim.corrupt(o.id)); }}>
                      Corrupt
                    </button>
                    <button type="button" className={act} disabled={locked} aria-label={`Delete ${o.key}`} onClick={() => act0(() => sim.remove(o.key))}>
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </li>
          );
        })}
        {!objects.length && <li className="px-3 py-6 text-center text-sm text-ink-faint">No objects yet — upload one.</li>}
      </ul>
    </div>
  );
});

const SOURCE_TONE: Record<LogEntry["source"], string> = {
  api: "text-accent-strong",
  worker: "text-ink",
  client: "text-ink-dim",
  chaos: "text-rose",
  drill: "text-amber",
};
const LEVEL_TONE: Record<LogEntry["level"], string> = {
  info: "text-ink-dim",
  warn: "text-amber",
  error: "text-rose",
  ok: "text-mint",
};

const LogPanel = memo(function LogPanel({ sim }: { sim: MiniS3Sim; version: number }) {
  const ref = useRef<HTMLOListElement>(null);
  const pinned = useRef(true);
  const entries = sim.log.slice(-80);
  const last = entries[entries.length - 1]?.id;
  useEffect(() => {
    const el = ref.current;
    if (el && pinned.current) el.scrollTop = el.scrollHeight;
  }, [last]);
  return (
    <ol
      ref={ref}
      role="log"
      aria-live="off"
      aria-label="Cluster event log"
      tabIndex={0}
      onScroll={(e) => {
        const el = e.currentTarget;
        pinned.current = el.scrollHeight - el.scrollTop - el.clientHeight < 24;
      }}
      className="max-h-[260px] min-h-[180px] flex-1 space-y-1 overflow-y-auto px-4 py-3 font-mono text-[11.5px] leading-relaxed"
    >
      {entries.map((e) => (
        <li key={e.id} className="flex gap-2.5">
          <span className="shrink-0 text-ink-faint">{fmtTime(e.t)}</span>
          <span className={`w-12 shrink-0 ${SOURCE_TONE[e.source]}`}>{e.source}</span>
          <span className={`min-w-0 break-words ${LEVEL_TONE[e.level]}`}>{e.text}</span>
        </li>
      ))}
    </ol>
  );
});

/* -------------------------------------------------------------- simulator */

export default function MiniS3Simulator() {
  const [sim] = useState(() => new MiniS3Sim());
  const [, setFrame] = useState(0);
  const [selectedKey, setSelectedKey] = useState<string | null>("demo.bin");
  const [speedChoice, setSpeed] = useState<number | null>(null);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const compact = !useMediaQuery("(min-width: 768px)");
  const rootRef = useRef<HTMLDivElement>(null);
  // Reduced motion: the console starts paused (WCAG 2.2.2) until the visitor acts.
  const speed = speedChoice ?? (reduced ? 0 : 1);

  useEffect(() => {
    sim.setSpeed(speed);
  }, [sim, speed]);

  // Any action while paused resumes the clock at 1×, so it visibly happens.
  const act0 = useCallback(
    <T,>(fn: () => T): T => {
      if (speed === 0) setSpeed(1);
      return fn();
    },
    [speed],
  );

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let lastPaint = 0;
    let lastVersion = -1;
    let visible = false;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      last = performance.now();
    });
    if (rootRef.current) io.observe(rootRef.current);
    const tick = (t: number) => {
      const dt = t - last;
      last = t;
      if (visible && !document.hidden && sim.speed > 0) {
        sim.advance(dt);
        // Repaint every frame while packets fly; otherwise ~8 fps is plenty for clocks and text.
        if (sim.packets.length || sim.version !== lastVersion || t - lastPaint > 120) {
          lastPaint = t;
          lastVersion = sim.version;
          setFrame((f) => (f + 1) % 1_000_000);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [sim]);

  const locked = sim.drill.active;
  const selectedId = selectedKey ? sim.liveObject(selectedKey)?.id : undefined;
  const up = sim.upNodes().length;
  const under = sim.underReplicated().length;
  const over = sim.overReplicated().length;
  const garbage = sim.garbageBlobCount();
  const committed = [...sim.objects.values()].filter((o) => o.status === "COMMITTED").length;

  const btnGhost =
    "rounded-xl border border-border-strong px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent-strong disabled:cursor-default disabled:opacity-40 disabled:hover:border-border-strong disabled:hover:text-ink";

  return (
    <div ref={rootRef} className="overflow-hidden rounded-3xl border border-[#c4bfae] bg-[#fbfaf5]">
      {/* window chrome */}
      <div className="flex items-center gap-4 border-b border-border px-5 py-3.5">
        <div className="flex gap-2" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-rose" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber" />
          <span className="h-2.5 w-2.5 rounded-full bg-mint" />
        </div>
        <p className="mx-auto rounded-full bg-[#e7e3d6] px-4 py-1 font-mono text-[11px] text-ink-faint">
          <span className="hidden sm:inline">mini-s3 · </span>cluster console · simulated
        </p>
        <span className="w-[52px]" aria-hidden="true" />
      </div>

      {/* toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            disabled={locked}
            onClick={() => setSelectedKey(act0(() => sim.upload()))}
            className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(47,106,59,0.25)] transition-all hover:bg-accent-deep disabled:cursor-default disabled:opacity-40 disabled:hover:bg-accent"
          >
            Upload a file
          </button>
          <button
            type="button"
            disabled={locked}
            onClick={() => {
              setSelectedKey("demo.bin");
              void act0(() => sim.runDrill());
            }}
            className={btnGhost}
          >
            Run the failure drill
          </button>
          <button
            type="button"
            onClick={() => {
              sim.reset(true);
              setSelectedKey("demo.bin");
            }}
            className={btnGhost}
          >
            {locked ? "Stop drill" : "Reset"}
          </button>
        </div>
        <div className="flex items-center gap-1 rounded-full border border-border p-1" role="group" aria-label="Simulation speed">
          {[0, 1, 3].map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={speed === s}
              onClick={() => setSpeed(s)}
              className={`rounded-full px-3.5 py-1 text-xs font-medium transition-colors ${
                speed === s ? "bg-accent text-white" : "text-ink-dim hover:text-ink"
              }`}
            >
              {s === 0 ? "Pause" : `${s}×`}
            </button>
          ))}
        </div>
      </div>

      {/* cluster stats */}
      <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-1.5 px-5 font-mono text-[11.5px]">
        {[
          ["nodes UP", `${up}/${NODE_IDS.length}`, up < NODE_IDS.length ? "text-rose" : "text-mint"],
          ["objects", String(committed), "text-ink"],
          ["under-replicated", String(under), under ? "text-amber" : "text-ink"],
          ["surplus copies", String(over), over ? "text-amber" : "text-ink"],
          ["garbage blobs", String(garbage), garbage ? "text-amber" : "text-ink"],
          ["sim clock", fmtTime(sim.now), "text-ink-dim"],
        ].map(([k, v, tone]) => (
          <div key={k} className="flex gap-1.5">
            <dt className="text-ink-faint">{k}</dt>
            <dd className={tone}>{v}</dd>
          </div>
        ))}
      </dl>

      {/* topology */}
      <div className="mt-3 overflow-x-auto px-3 sm:px-5">
        <div className="min-w-[640px]">
          <Topology
            sim={sim}
            selectedId={selectedId}
            reduced={reduced}
            locked={locked}
            compact={compact}
            onToggleNode={(id) => act0(() => (sim.nodes.get(id)!.running ? sim.kill(id) : sim.restart(id)))}
          />
        </div>
      </div>

      {/* touch-sized node controls where the diagram is scaled down */}
      <div className="flex flex-wrap gap-2 px-5 pt-3 md:hidden" role="group" aria-label="Storage node controls">
        {NODE_IDS.map((id) => {
          const running = sim.nodes.get(id)!.running;
          return (
            <button
              key={id}
              type="button"
              disabled={locked}
              onClick={() => act0(() => (running ? sim.kill(id) : sim.restart(id)))}
              className={`rounded-full border px-3.5 py-2 text-xs font-medium transition-colors disabled:opacity-40 ${
                running ? "border-rose/50 text-rose" : "border-accent/60 text-accent-strong"
              }`}
            >
              {running ? "stop" : "start"} {id}
            </button>
          );
        })}
      </div>

      {/* legend */}
      <ul className="flex flex-wrap gap-x-5 gap-y-2 px-5 pb-1 pt-2 font-mono text-[11px] text-ink-faint" aria-label="Legend">
        <li className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-[3px] bg-accent" />live copy</li>
        <li className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-[3px] bg-ink" />selected object</li>
        <li className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-[3px] border border-dashed border-[#9aa08f]" />bytes awaiting GC</li>
        <li className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-[3px] bg-rose" />corrupt copy</li>
        {!reduced && (
          <>
            <li className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-accent" />write</li>
            <li className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-mint" />ack / response</li>
            <li className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-ink-faint" />heartbeat</li>
          </>
        )}
      </ul>

      {/* objects + drill/log */}
      <div className="grid gap-4 p-5 lg:grid-cols-[1.2fr_1fr]">
        <ObjectsPanel
          sim={sim}
          version={sim.version}
          selectedKey={selectedKey}
          locked={locked}
          onSelect={setSelectedKey}
          act0={act0}
        />
        <div className="flex min-w-0 flex-col rounded-2xl border border-border bg-bg-raised">
          {sim.drill.steps.length > 0 ? (
            <ol className="space-y-2.5 border-b border-border px-4 py-4" aria-label="Failure drill steps">
              {sim.drill.steps.map((s, i) => (
                <li key={s.label} className="flex gap-3 text-[13px] leading-snug">
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-mono text-[10.5px] font-semibold ${
                      s.state === "done"
                        ? "bg-accent text-white"
                        : s.state === "active"
                          ? "border border-accent text-accent-strong"
                          : s.state === "failed"
                            ? "bg-rose text-bg"
                            : "border border-border-strong text-ink-faint"
                    }`}
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>
                  <span className={s.state === "todo" ? "text-ink-faint" : "text-ink"}>
                    {s.label}
                    {s.state === "active" && i === 2 && (() => {
                      const victim = [...sim.nodes.values()].find((n) => !n.running);
                      return victim ? (
                        <span className="block font-mono text-[11px] text-amber">
                          {victim.id} silent {((sim.now - victim.lastHeartbeat) / 1000).toFixed(1)}s · {victim.status}
                        </span>
                      ) : null;
                    })()}
                    {s.detail && <span className="block font-mono text-[11px] text-accent-strong">{s.detail}</span>}
                  </span>
                </li>
              ))}
              {sim.drill.summary && (
                <li className="rounded-xl border border-accent/25 bg-accent/5 px-3 py-2 font-mono text-[11.5px] text-ink">
                  {sim.drill.summary}
                </li>
              )}
            </ol>
          ) : (
            <p className="border-b border-border px-4 py-4 text-[13px] leading-relaxed text-ink-dim">
              <span className="font-semibold text-ink">Try it:</span> stop a node that holds{" "}
              <span className="font-mono text-accent-strong">demo.bin</span> (its copies are the dark
              squares), wait ~6 s for the worker to mark it DOWN, and watch the copies rebuild. Then
              download <span className="font-mono text-accent-strong">demo.bin</span>.
            </p>
          )}
          <LogPanel sim={sim} version={sim.version} />
        </div>
      </div>
      <p className="sr-only" aria-live="polite">
        {sim.announcement}
      </p>
    </div>
  );
}
