/**
 * Case-study visuals for AgentOps, in the site's schematic language (same as
 * QueryGuardVisuals): field-green line-work on paper panels, the human gate
 * glowing, mono labels for code and data. Every label maps to the agentops repo
 * (docs/ARCHITECTURE.md: API, Postgres job queue, LangGraph worker, tool registry,
 * sandbox).
 */

const MONO = "var(--font-mono)";
const DISPLAY = "var(--font-display)";
const BODY = "var(--font-body)";

const GREEN = "#2f6a3b";
const DIM = "#5a6258";

function Arrow({ id, color = GREEN }: { id: string; color?: string }) {
  return (
    <marker id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0 0L10 5L0 10z" fill={color} />
    </marker>
  );
}

function Box({
  x,
  y,
  w,
  h,
  title,
  lines = [],
  note,
  featured = false,
  dashed = false,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  lines?: string[];
  note?: string;
  featured?: boolean;
  dashed?: boolean;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="16"
        fill={featured ? "#e7e3d6" : "#efece2"}
        stroke={featured ? GREEN : "#c4bfae"}
        strokeWidth={featured ? 2 : 1.5}
        strokeDasharray={dashed ? "5 5" : undefined}
        filter={featured ? "url(#aoGlow)" : undefined}
      />
      <text x={x + 16} y={y + 27} fill="#18211a" fontSize="16" fontFamily={DISPLAY}>
        {title}
      </text>
      {lines.map((l, i) => (
        <text key={l} x={x + 16} y={y + 48 + i * 16} fill="#485148" fontSize="11.5" fontFamily={BODY}>
          {l}
        </text>
      ))}
      {note && (
        <text x={x + 16} y={y + h - 12} fill="#285d33" fontSize="10.5" fontWeight="600" fontFamily={MONO}>
          {note}
        </text>
      )}
    </g>
  );
}

function Flow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={GREEN} strokeWidth="2" markerEnd="url(#aoArrow)" />;
}

function Link({ points, label, lx, ly }: { points: string; label?: string; lx?: number; ly?: number }) {
  return (
    <g>
      <polyline points={points} fill="none" stroke={DIM} strokeWidth="1.5" strokeDasharray="5 6" markerEnd="url(#aoArrowDim)" />
      {label && (
        <text x={lx} y={ly} fill={DIM} fontSize="10.5" fontFamily={MONO}>
          {label}
        </text>
      )}
    </g>
  );
}

/* ------------------------------------------------------------ architecture */

export function AgentOpsArchitectureDiagram() {
  return (
    <svg
      viewBox="0 0 960 520"
      role="img"
      aria-label="AgentOps architecture. The React UI talks to a FastAPI API over REST and server-sent events. The API puts jobs on a Postgres job queue, and a worker claims them with a lease and runs a LangGraph state machine. Inside the worker: the supervisor plans a dependency graph; an optional plan approval; a scheduler dispatches independent subtasks in parallel to specialists (research, analysis, writing, code), each checked by a reviewer with up to two revisions; a human approves risky actions; each approved action executes once behind an idempotency key; the result is synthesized and given a final review; and reviewed lessons are saved to memory. Everything stateful lives in one Postgres database with pgvector: checkpoints, events, the job queue, the budget ledger and vector memory. Specialists use a permissioned tool registry (web search, page fetch, read-only SQL, workspace files, email and MCP), and generated code runs in a Docker sandbox with no network and no secrets."
      className="h-auto w-full"
    >
      <defs>
        <Arrow id="aoArrow" />
        <Arrow id="aoArrowDim" color={DIM} />
        <filter id="aoGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="10" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ---------- row 1: UI → API → queue ---------- */}
      <Box x={20} y={20} w={150} h={64} title="React UI" lines={["plan graph · approvals"]} />
      <Flow x1={170} y1={52} x2={226} y2={52} />
      <text x="198" y="42" textAnchor="middle" fill={DIM} fontSize="10" fontFamily={MONO}>REST+SSE</text>
      <Box x={230} y={20} w={180} h={64} title="FastAPI API" lines={["tasks · decisions · replay"]} />
      <Flow x1={410} y1={52} x2={466} y2={52} />
      <text x="438" y="42" textAnchor="middle" fill={DIM} fontSize="10" fontFamily={MONO}>jobs</text>
      <Box x={470} y={20} w={220} h={64} title="Postgres job queue" lines={["workers claim with leases"]} />

      {/* claim into the worker */}
      <Flow x1={580} y1={84} x2={580} y2={120} />
      <text x="568" y="106" textAnchor="end" fill={DIM} fontSize="10.5" fontFamily={MONO}>claim · resume on crash</text>

      {/* ---------- worker group ---------- */}
      <rect x="20" y="124" width="690" height="380" rx="20" fill="none" stroke={GREEN} strokeWidth="1.4" strokeDasharray="6 6" />
      <text x="40" y="148" fill="#285d33" fontSize="10.5" fontWeight="600" fontFamily={MONO}>
        worker · LangGraph state machine · checkpointed every step
      </text>

      {/* row A: supervisor → plan approval → scheduler */}
      <Box x={40} y={164} w={190} h={84} title="Supervisor" lines={["plans the task as a", "dependency graph"]} />
      <Flow x1={230} y1={206} x2={266} y2={206} />
      <Box x={270} y={164} w={170} h={84} dashed title="Plan approval" lines={["a human checks the plan"]} note="optional" />
      <Flow x1={440} y1={206} x2={476} y2={206} />
      <Box x={480} y={164} w={210} h={84} title="Scheduler" lines={["dispatches independent", "subtasks in waves"]} />

      {/* down to the specialists */}
      <Flow x1={585} y1={248} x2={585} y2={278} />
      <text x="597" y="268" fill={DIM} fontSize="10.5" fontFamily={MONO}>parallel</text>

      {/* row B (right → left): specialists ⇄ reviewer → human → execute */}
      <rect x="492" y="294" width="210" height="96" rx="16" fill="#efece2" stroke="#dcd8ca" strokeWidth="1.2" />
      <rect x="486" y="288" width="210" height="96" rx="16" fill="#efece2" stroke="#c4bfae" strokeWidth="1.2" />
      <Box
        x={480}
        y={282}
        w={210}
        h={96}
        title="Specialist ⇄ Reviewer"
        lines={["research · analysis ·", "writing · code"]}
        note="≤ 2 revisions"
      />
      <Flow x1={480} y1={330} x2={446} y2={330} />
      <Box
        x={250}
        y={282}
        w={192}
        h={96}
        featured
        title="Human approves"
        lines={["risky actions: approve,", "edit, reject, take over"]}
        note="pauses, state saved"
      />
      <Flow x1={250} y1={330} x2={214} y2={330} />
      <Box x={40} y={282} w={170} h={96} title="Execute once" lines={["one serial step,", "idempotency key"]} note="never blind-retried" />

      {/* down to row C */}
      <Flow x1={125} y1={378} x2={125} y2={406} />

      {/* row C: synthesize → memory */}
      <Box x={40} y={410} w={190} h={80} title="Synthesize" lines={["from real action outcomes,", "then a final review"]} />
      <Flow x1={230} y1={450} x2={266} y2={450} />
      <Box x={270} y={410} w={220} h={80} title="Save memories" lines={["only reviewer-accepted", "lessons become memories"]} />

      {/* ---------- right column: state, tools, sandbox ---------- */}
      <Box
        x={740}
        y={20}
        w={200}
        h={148}
        featured
        title="Postgres + pgvector"
        lines={["checkpoints · events", "job queue · leases", "budget ledger", "vector memory"]}
        note="one database"
      />
      <Link points="690,52 734,52" />
      <Link points="710,150 734,150" />

      <Box
        x={740}
        y={282}
        w={200}
        h={110}
        title="Tool registry"
        lines={["web search · fetch_url", "read-only SQL · files", "email · own MCP server"]}
        note="per-agent permissions"
      />
      <Link points="702,336 734,336" />

      <Box x={740} y={420} w={200} h={84} title="Docker sandbox" lines={["no network · no secrets", "no capabilities · limits"]} />
      <Link points="840,392 840,414" label="code" lx={850} ly={408} />
    </svg>
  );
}
