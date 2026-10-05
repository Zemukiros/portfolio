/**
 * Case-study visuals for Mini-S3, in the site's schematic language:
 * field-green line-work on paper panels, the featured node glowing, mono labels
 * for protocols and data. Every label maps to code in the mini-s3 repo.
 */

const MONO = "var(--font-mono)";
const DISPLAY = "var(--font-display)";
const BODY = "var(--font-body)";

function Arrow({ id, color = "#2f6a3b" }: { id: string; color?: string }) {
  return (
    <marker id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0 0L10 5L0 10z" fill={color} />
    </marker>
  );
}

function ProfileChip({ x, y, label }: { x: number; y: number; label: string }) {
  const w = label.length * 6.3 + 18;
  return (
    <g>
      <rect x={x - w} y={y} width={w} height="20" rx="10" fill="#efece2" stroke="#dcd8ca" />
      <text x={x - w / 2} y={y + 13.5} textAnchor="middle" fill="#285d33" fontSize="10" fontFamily={MONO}>
        {label}
      </text>
    </g>
  );
}

/* ------------------------------------------------------------ architecture */

export function MiniS3ArchitectureDiagram() {
  const nodesX = [20, 190, 360, 530];
  return (
    <svg
      viewBox="0 0 960 530"
      role="img"
      aria-label="Mini-S3 architecture. A client calls the Spring Boot API server over REST with an API key. The API stores metadata in Postgres (tables nodes, objects, replicas) and streams bytes to four storage nodes over HTTP. Storage nodes send heartbeats to the API every two seconds. A background worker claims work from Postgres with FOR UPDATE SKIP LOCKED and talks to the storage nodes to repair lost copies and collect garbage. All three roles run from one jar, selected by Spring profile: six containers from one image, plus Postgres."
      className="h-auto w-full"
    >
      <defs>
        <Arrow id="m3Arrow" />
        <Arrow id="m3ArrowDim" color="#285d33" />
        <filter id="m3Glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="10" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* links */}
      <line x1="170" y1="71" x2="282" y2="71" stroke="#2f6a3b" strokeWidth="2" markerEnd="url(#m3Arrow)" />
      <text x="226" y="60" textAnchor="middle" fill="#5a6258" fontSize="10.5" fontFamily={MONO}>REST · API key</text>

      <polyline points="550,71 840,71 840,162" fill="none" stroke="#2f6a3b" strokeWidth="2" markerEnd="url(#m3Arrow)" />
      <text x="695" y="60" textAnchor="middle" fill="#5a6258" fontSize="10.5" fontFamily={MONO}>metadata · SQL</text>

      {nodesX.map((x) => (
        <line key={x} x1="420" y1="128" x2={x + 75} y2="202" stroke="#2f6a3b" strokeWidth="1.8" markerEnd="url(#m3Arrow)" />
      ))}
      <text x="566" y="150" fill="#285d33" fontSize="10.5" fontFamily={MONO}>bytes · PUT / GET /blobs/{"{id}"}</text>
      <text x="60" y="164" fill="#5a6258" fontSize="10.5" fontFamily={MONO}>↑ heartbeat every 2 s</text>

      {nodesX.map((x) => (
        <line key={x} x1="420" y1="386" x2={x + 75} y2="312" stroke="#285d33" strokeWidth="1.6" strokeDasharray="5 6" markerEnd="url(#m3ArrowDim)" />
      ))}
      <text x="112" y="370" fill="#5a6258" fontSize="10.5" fontFamily={MONO}>re-replicate · delete garbage</text>

      <polyline points="550,438 840,438 840,338" fill="none" stroke="#285d33" strokeWidth="1.6" strokeDasharray="5 6" markerEnd="url(#m3ArrowDim)" />
      <text x="695" y="458" textAnchor="middle" fill="#5a6258" fontSize="10.5" fontFamily={MONO}>claim work · SKIP LOCKED</text>

      {/* client */}
      <rect x="20" y="36" width="150" height="70" rx="16" fill="#efece2" stroke="#c4bfae" strokeWidth="1.5" />
      <text x="95" y="66" textAnchor="middle" fill="#18211a" fontSize="17" fontFamily={DISPLAY}>Client</text>
      <text x="95" y="86" textAnchor="middle" fill="#5a6258" fontSize="10.5" fontFamily={MONO}>curl · any HTTP SDK</text>

      {/* API (featured) */}
      <rect x="290" y="18" width="260" height="110" rx="18" fill="#e7e3d6" stroke="#2f6a3b" strokeWidth="2" filter="url(#m3Glow)" />
      <text x="310" y="50" fill="#18211a" fontSize="18" fontFamily={DISPLAY}>API server</text>
      <ProfileChip x={534} y={34} label="api" />
      <text x="310" y="76" fill="#485148" fontSize="12" fontFamily={BODY}>Hash-ring placement · 200 vnodes</text>
      <text x="310" y="95" fill="#485148" fontSize="12" fontFamily={BODY}>Quorum writes · N = 3, W = 2</text>
      <text x="310" y="114" fill="#485148" fontSize="12" fontFamily={BODY}>Checksum-verified reads</text>

      {/* storage nodes */}
      {nodesX.map((x, i) => (
        <g key={x}>
          <rect x={x} y="202" width="150" height="110" rx="16" fill="#efece2" stroke="#c4bfae" strokeWidth="1.5" />
          <text x={x + 16} y="230" fill="#18211a" fontSize="15" fontFamily={DISPLAY}>node-{i + 1}</text>
          <text x={x + 16} y="250" fill="#5a6258" fontSize="10.5" fontFamily={MONO}>blobs on local disk</text>
          {[0, 1, 2, 3, 4].map((j) => (
            <rect key={j} x={x + 16 + j * 20} y="264" width="14" height="14" rx="3.5" fill={j < 3 + (i % 2) ? "#2f6a3b" : "#c4bfae"} />
          ))}
          <text x={x + 16} y="298" fill="#5a6258" fontSize="10" fontFamily={MONO}>fsync + atomic rename</text>
        </g>
      ))}
      <ProfileChip x={100} y={322} label="storage ×4" />

      {/* postgres */}
      <rect x="740" y="162" width="200" height="176" rx="18" fill="#efece2" stroke="#c4bfae" strokeWidth="1.5" />
      <text x="760" y="192" fill="#18211a" fontSize="17" fontFamily={DISPLAY}>Postgres 16</text>
      <text x="760" y="211" fill="#5a6258" fontSize="10.5" fontFamily={MONO}>source of truth</text>
      {[
        ["nodes", "status · heartbeat"],
        ["objects", "sha256 · status"],
        ["replicas", "object → node"],
      ].map(([t, d], i) => (
        <g key={t}>
          <rect x="756" y={226 + i * 34} width="168" height="26" rx="9" fill="#e7e3d6" stroke="#dcd8ca" />
          <text x="768" y={243 + i * 34} fill="#285d33" fontSize="10.5" fontWeight="600" fontFamily={MONO}>{t}</text>
          <text x="912" y={243 + i * 34} textAnchor="end" fill="#5a6258" fontSize="9.5" fontFamily={MONO}>{d}</text>
        </g>
      ))}

      {/* worker */}
      <rect x="290" y="386" width="260" height="106" rx="18" fill="#efece2" stroke="#c4bfae" strokeWidth="1.5" />
      <text x="310" y="416" fill="#18211a" fontSize="18" fontFamily={DISPLAY}>Worker</text>
      <ProfileChip x={534} y={400} label="worker" />
      <text x="310" y="442" fill="#485148" fontSize="12" fontFamily={BODY}>Failure detector · every 2 s</text>
      <text x="310" y="461" fill="#485148" fontSize="12" fontFamily={BODY}>Level-triggered repair · every 3 s</text>
      <text x="310" y="480" fill="#485148" fontSize="12" fontFamily={BODY}>Garbage collector · every 5 s</text>

      <text x="940" y="520" textAnchor="end" fill="#5a6258" fontSize="10.5" fontFamily={MONO}>
        one image · three Spring profiles · 6 containers + Postgres · only :8080 published
      </text>
    </svg>
  );
}

/* ------------------------------------------------------- sequence diagrams */

export type Lane = { id: string; label: string; featured?: boolean };
export type Msg =
  | { kind: "call" | "reply" | "fail" | "async"; from: string; to: string; label: string }
  | { kind: "fan"; from: string; to: string[]; label: string }
  | { kind: "self"; at: string; label: string; tone?: "bad" | "good" }
  | { kind: "note"; from: string; to: string; label: string }
  | { kind: "gap"; label: string };

const ROW: Record<Msg["kind"], number> = { call: 44, reply: 44, fail: 44, async: 44, fan: 70, self: 52, note: 46, gap: 44 };

export function SequenceDiagram({ lanes, messages, label }: { lanes: Lane[]; messages: Msg[]; label: string }) {
  const W = 960;
  const left = 90;
  const right = 870;
  const step = (right - left) / (lanes.length - 1);
  const X = (id: string) => left + lanes.findIndex((l) => l.id === id) * step;
  const top = 96;
  // Lay rows out up front: each message gets its y offset and step number.
  const rows: { m: Msg; rowY: number; num: number }[] = [];
  let cursor = top;
  let count = 0;
  for (const m of messages) {
    const numbered = m.kind !== "note" && m.kind !== "gap";
    if (numbered) count++;
    rows.push({ m, rowY: cursor, num: numbered ? count : 0 });
    cursor += ROW[m.kind];
  }
  const height = cursor + 20;
  const idBase = lanes.map((l) => l.id).join("").replace(/[^a-z0-9]/gi, "").slice(0, 24);
  // Labels get a halo in the panel colour so dashed lifelines never cut through text.
  const halo = { stroke: "#efece2", strokeWidth: 5, paintOrder: "stroke" as const, strokeLinejoin: "round" as const };

  const badge = (x: number, cy: number, num: number) => (
    <g>
      <circle cx={x} cy={cy} r="10" fill="#2f6a3b" />
      <text x={x} y={cy + 3.8} textAnchor="middle" fill="#fff" fontSize="10.5" fontWeight="700" fontFamily={MONO}>
        {num}
      </text>
    </g>
  );

  return (
    <svg viewBox={`0 0 ${W} ${height}`} role="img" aria-label={label} className="h-auto w-full">
      <defs>
        <Arrow id={`sq${idBase}`} />
        <Arrow id={`sq${idBase}r`} color="#5a6258" />
        <Arrow id={`sq${idBase}a`} color="#9aa08f" />
      </defs>

      {/* lanes */}
      {lanes.map((l) => {
        const x = X(l.id);
        const w = Math.max(96, l.label.length * 8.6 + 28);
        return (
          <g key={l.id}>
            <line x1={x} y1="62" x2={x} y2={height - 12} stroke="#c4bfae" strokeWidth="1.2" strokeDasharray="3 6" />
            <rect
              x={x - w / 2}
              y="20"
              width={w}
              height="38"
              rx="12"
              fill={l.featured ? "#e7e3d6" : "#efece2"}
              stroke={l.featured ? "#2f6a3b" : "#c4bfae"}
              strokeWidth={l.featured ? 1.8 : 1.3}
            />
            <text x={x} y="44" textAnchor="middle" fill="#18211a" fontSize="14" fontFamily={DISPLAY}>
              {l.label}
            </text>
          </g>
        );
      })}

      {rows.map(({ m, rowY, num }, i) => {
        if (m.kind === "gap") {
          return (
            <g key={i}>
              <rect x="40" y={rowY + 4} width={W - 80} height="28" rx="14" fill="#18211a" />
              <text x={W / 2} y={rowY + 22} textAnchor="middle" fill="#5a6258" fontSize="11" fontFamily={MONO}>
                ⋯ {m.label} ⋯
              </text>
            </g>
          );
        }
        if (m.kind === "note") {
          const a = X(m.from);
          const b = X(m.to);
          const x0 = Math.min(a, b) - 40;
          const x1 = Math.max(a, b) + 40;
          return (
            <g key={i}>
              <rect x={x0} y={rowY + 4} width={x1 - x0} height="30" rx="10" fill="#dfe8d8" stroke="#2f6a3b" strokeOpacity="0.55" />
              <text x={(x0 + x1) / 2} y={rowY + 23.5} textAnchor="middle" fill="#285d33" fontSize="11.5" fontWeight="600" fontFamily={MONO}>
                {m.label}
              </text>
            </g>
          );
        }
        if (m.kind === "self") {
          const x = X(m.at);
          const toLeft = x + 44 + m.label.length * 7 > W - 10;
          const loopX = toLeft ? x - 34 : x + 34;
          const cy = rowY + 16;
          const color = m.tone === "bad" ? "#a8325a" : m.tone === "good" ? "#237049" : "#485148";
          return (
            <g key={i}>
              <path
                d={`M${x} ${cy} H${loopX} V${cy + 18} H${x + (toLeft ? -6 : 6)}`}
                fill="none"
                stroke="#2f6a3b"
                strokeWidth="1.6"
                markerEnd={`url(#sq${idBase})`}
              />
              {badge(x, cy, num)}
              <text
                x={toLeft ? loopX - 10 : loopX + 10}
                y={cy + 13}
                textAnchor={toLeft ? "end" : "start"}
                fill={color}
                fontSize="11.5"
                fontFamily={MONO}
                {...halo}
              >
                {m.label}
              </text>
            </g>
          );
        }
        if (m.kind === "fan") {
          const x0 = X(m.from);
          return (
            <g key={i}>
              {m.to.map((t, j) => {
                const ly = rowY + 30 + j * 13;
                return (
                  <line key={t} x1={x0 + 12} y1={ly} x2={X(t) - 6} y2={ly} stroke="#2f6a3b" strokeWidth="1.6" markerEnd={`url(#sq${idBase})`} />
                );
              })}
              {badge(x0, rowY + 30, num)}
              <text x={x0 + 24} y={rowY + 14} fill="#485148" fontSize="11.5" fontFamily={MONO} {...halo}>
                {m.label}
              </text>
            </g>
          );
        }
        const a = X(m.from);
        const b = X(m.to);
        const dir = b > a ? 1 : -1;
        const ly = rowY + 26;
        const stroke = m.kind === "call" ? "#2f6a3b" : m.kind === "fail" ? "#a8325a" : m.kind === "async" ? "#9aa08f" : "#5a6258";
        const marker = m.kind === "call" ? `sq${idBase}` : m.kind === "async" ? `sq${idBase}a` : `sq${idBase}r`;
        return (
          <g key={i}>
            <line
              x1={a + dir * 12}
              y1={ly}
              x2={m.kind === "fail" ? b - dir * 30 : b - dir * 6}
              y2={ly}
              stroke={stroke}
              strokeWidth={m.kind === "call" ? 1.8 : 1.5}
              strokeDasharray={m.kind === "call" ? undefined : "5 5"}
              markerEnd={m.kind === "fail" ? undefined : `url(#${marker})`}
            />
            {m.kind === "fail" && (
              <path d={`M${b - dir * 30 - 5} ${ly - 5}l10 10m0-10l-10 10`} stroke="#a8325a" strokeWidth="2" strokeLinecap="round" />
            )}
            {badge(a, ly, num)}
            <text
              x={a + dir * 24}
              y={ly - 9}
              textAnchor={dir > 0 ? "start" : "end"}
              fill={m.kind === "async" ? "#5a6258" : m.kind === "fail" ? "#a8325a" : "#485148"}
              fontSize="11.5"
              fontFamily={MONO}
              {...halo}
            >
              {m.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ---------------------------------------------------------- the four paths */

export const writePath: { lanes: Lane[]; messages: Msg[]; label: string } = {
  label:
    "Write path. The client PUTs an object to the API, which streams it to a temp file while computing SHA-256, inserts the object as PENDING in Postgres, then writes to three storage nodes in parallel. After two nodes acknowledge, the API takes an advisory lock, marks the object COMMITTED, and returns 201 Created. The third copy lands in the background.",
  lanes: [
    { id: "client", label: "Client" },
    { id: "api", label: "API", featured: true },
    { id: "pg", label: "Postgres" },
    { id: "n2", label: "node-2" },
    { id: "n4", label: "node-4" },
    { id: "n1", label: "node-1" },
  ],
  messages: [
    { kind: "call", from: "client", to: "api", label: "PUT /buckets/demo/objects/demo.bin" },
    { kind: "self", at: "api", label: "stream to temp file · SHA-256 · size cap" },
    { kind: "call", from: "api", to: "pg", label: "INSERT object · status PENDING" },
    { kind: "fan", from: "api", to: ["n2", "n4", "n1"], label: "PUT /blobs/{id} + X-Content-SHA256 · 3 virtual threads" },
    { kind: "reply", from: "n2", to: "api", label: "201 · verified, fsynced, renamed" },
    { kind: "reply", from: "n4", to: "api", label: "201" },
    { kind: "note", from: "api", to: "pg", label: "W = 2 reached — commit now" },
    { kind: "call", from: "api", to: "pg", label: "advisory lock (bucket, key) → COMMITTED" },
    { kind: "reply", from: "api", to: "client", label: "201 Created" },
    { kind: "async", from: "n1", to: "api", label: "201 · third copy lands in the background" },
  ],
};

export const readPath: { lanes: Lane[]; messages: Msg[]; label: string } = {
  label:
    "Read path with read repair. The API looks up the live version and its replicas on UP nodes, shuffles them, and downloads from node-2. The checksum does not match, so the API deletes that replica row and tries node-4, whose copy matches. The client receives 200 with X-Served-By node-4; the worker later rebuilds the dropped copy.",
  lanes: [
    { id: "client", label: "Client" },
    { id: "api", label: "API", featured: true },
    { id: "pg", label: "Postgres" },
    { id: "n2", label: "node-2" },
    { id: "n4", label: "node-4" },
  ],
  messages: [
    { kind: "call", from: "client", to: "api", label: "GET /buckets/demo/objects/demo.bin" },
    { kind: "call", from: "api", to: "pg", label: "live version + replicas on UP nodes" },
    { kind: "self", at: "api", label: "shuffle → [node-2, node-4]" },
    { kind: "call", from: "api", to: "n2", label: "GET /blobs/{id}" },
    { kind: "reply", from: "n2", to: "api", label: "bytes" },
    { kind: "self", at: "api", label: "SHA-256 ≠ stored → corrupt copy", tone: "bad" },
    { kind: "call", from: "api", to: "pg", label: "DELETE replica row (read repair)" },
    { kind: "call", from: "api", to: "n4", label: "GET /blobs/{id}" },
    { kind: "reply", from: "n4", to: "api", label: "bytes" },
    { kind: "self", at: "api", label: "SHA-256 matches", tone: "good" },
    { kind: "reply", from: "api", to: "client", label: "200 · X-Served-By: node-4" },
  ],
};

export const failurePath: { lanes: Lane[]; messages: Msg[]; label: string } = {
  label:
    "Node failure and self-healing. node-1 stops sending heartbeats. After six seconds of silence the worker's failure detector marks it DOWN in Postgres. The repair worker claims under-replicated objects with SKIP LOCKED, fetches a checksum-verified copy from node-3, writes it to node-4 — the next UP node on the ring — and records the new replica. Reads already skip DOWN nodes.",
  lanes: [
    { id: "n1", label: "node-1" },
    { id: "api", label: "API" },
    { id: "pg", label: "Postgres" },
    { id: "worker", label: "Worker", featured: true },
    { id: "n3", label: "node-3" },
    { id: "n4", label: "node-4" },
  ],
  messages: [
    { kind: "call", from: "n1", to: "api", label: "heartbeat · every 2 s" },
    { kind: "self", at: "n1", label: "container stops", tone: "bad" },
    { kind: "gap", label: "6 s without a heartbeat" },
    { kind: "call", from: "worker", to: "pg", label: "mark silent nodes DOWN" },
    { kind: "note", from: "api", to: "pg", label: "reads already skip DOWN nodes" },
    { kind: "call", from: "worker", to: "pg", label: "claim < 3 live copies · SKIP LOCKED" },
    { kind: "call", from: "worker", to: "n3", label: "GET /blobs/{id}" },
    { kind: "reply", from: "n3", to: "worker", label: "bytes · SHA-256 verified" },
    { kind: "call", from: "worker", to: "n4", label: "PUT · next UP node on ring" },
    { kind: "call", from: "worker", to: "pg", label: "INSERT replica → 3 live copies" },
  ],
};

export const returnPath: { lanes: Lane[]; messages: Msg[]; label: string } = {
  label:
    "A dead node returns. node-1 heartbeats again and the API marks it UP. Objects it held now have four live copies: node-1's original copy plus the repair copy on node-4. The garbage collector claims over-replicated objects and keeps the three holders the ring prefers — which include node-1, the original placement — so it removes node-4's replica row first, then deletes the repair copy's file. This is safe because objects are immutable.",
  lanes: [
    { id: "n1", label: "node-1" },
    { id: "api", label: "API" },
    { id: "pg", label: "Postgres" },
    { id: "worker", label: "Worker", featured: true },
    { id: "n4", label: "node-4" },
  ],
  messages: [
    { kind: "call", from: "n1", to: "api", label: "heartbeat" },
    { kind: "call", from: "api", to: "pg", label: "UPSERT node → UP" },
    { kind: "note", from: "n1", to: "pg", label: "node-1's copies are live again → 4 copies" },
    { kind: "call", from: "worker", to: "pg", label: "claim > 3 live copies" },
    { kind: "self", at: "worker", label: "keep the ring's top 3 (incl. node-1)" },
    { kind: "call", from: "worker", to: "pg", label: "DELETE node-4 replica row first" },
    { kind: "call", from: "worker", to: "n4", label: "DELETE /blobs/{id}" },
    { kind: "note", from: "n1", to: "worker", label: "placement converges back to the ring" },
  ],
};
