import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { AgentOpsArchitectureDiagram } from "@/components/AgentOpsVisuals";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "AgentOps — Case Study",
  description:
    "A production-style multi-agent AI platform with human approval, crash recovery, a secure code sandbox, and a 60-scenario real-model evaluation: 0 unsafe actions in 180 runs.",
};

const project = projects.find((p) => p.slug === "agentops")!;

const SHOTS = "https://github.com/Zemukiros/agentops/blob/main/docs/screenshots";

const built = [
  {
    title: "Supervisor, specialists, reviewer",
    body: "The supervisor plans the work as a dependency graph. Research, analysis, writing and code agents run independent steps in parallel, each with only the tools it needs. A reviewer grades every result and sends it back with specific feedback, up to two revisions.",
  },
  {
    title: "Approval that survives restarts",
    body: "Agents never perform risky actions; they propose them. The run pauses with its full state in Postgres, and a reviewer approves, edits, rejects or takes over — even hours later. Two reviewers clicking at once produce exactly one decision.",
  },
  {
    title: "Exactly-once side effects",
    body: "Approved actions run in one serial step behind an idempotency key, which is also the email's Message-ID. A crash mid-send is never blindly retried; a human checks it.",
  },
  {
    title: "Crash recovery",
    body: "Workers claim jobs from a Postgres queue with leases. If one dies, another resumes the run from its last checkpoint. Tests SIGKILL the worker at every critical point.",
  },
  {
    title: "Tools and MCP",
    body: "A permissioned registry: web search, page fetch with SSRF protection, read-only SQL, workspace files and email — plus my own MCP server over both stdio and HTTP.",
  },
  {
    title: "Locked-down code sandbox",
    body: "Generated code runs in a fresh Docker container with no network, no secrets, no Linux capabilities, and CPU, memory and process limits.",
  },
  {
    title: "Memories are lessons, not orders",
    body: "Lessons from past tasks live in pgvector and are recalled for similar tasks. Only reviewer-accepted results can become memories, and a screen keeps copied tool text and instructions out of them.",
  },
  {
    title: "A budget that is a hard limit",
    body: "Every model call reserves its worst-case cost in a ledger before it runs, so a task can't overspend by one big call.",
  },
  {
    title: "Trace, cost and replay",
    body: "Every decision, tool call, token and cent is recorded. The UI has a live plan graph, an approvals inbox, a cost timeline, a memory browser — and replay: fork a past run at a checkpoint, change something, compare the outcomes side by side.",
  },
];

const gallery = [
  {
    src: "/projects/agentops-running.webp",
    full: `${SHOTS}/real-running-1440.png`,
    h: 900,
    alt: "AgentOps task detail while a real task runs: the plan graph with the research agent working and the writing agent pending, a live activity feed, and the task's budget.",
    caption: "A real task running: the plan graph updates live as agents work.",
  },
  {
    src: "/projects/agentops-approval.webp",
    full: `${SHOTS}/real-approval-1440.png`,
    h: 1040,
    alt: "The approvals inbox: a pending escalation from the research agent, explaining which claims its sources support and which they don't, with the reviewer's verdicts below.",
    caption: "Anything risky waits here: the reviewer sees exactly what was proposed, and why.",
  },
  {
    src: "/projects/agentops-completed.webp",
    full: `${SHOTS}/real-completed-1440.png`,
    h: 1260,
    alt: "The completed task: both subtasks accepted, the deliverable with its final review, and the activity feed showing send_email executed once.",
    caption: "Finished, with every subtask's review score. Look closely: the deliverable says “not sent” while the feed shows the email executed — the bug this run caught.",
  },
  {
    src: "/projects/agentops-trace-cost.webp",
    full: `${SHOTS}/real-trace-cost-1440.png`,
    h: 1000,
    alt: "The trace and cost view: $0.0764 for 16 model calls, compute time separated from human wait, and cost broken down by agent and by model.",
    caption: "Every model call, tool call and cent, with compute time separated from human wait.",
  },
];

const results = [
  { what: "Unsafe actions · incl. 24 prompt-injection runs", value: "0 / 180" },
  { what: "Reviewer on planted defects", value: "18/18 · 0 false alarms" },
  { what: "Runs that looped", value: "0 / 198" },
  { what: "Pass rate, all 60 scenarios · baseline", value: "61.1% (110/180)" },
  { what: "The 21 scenarios the fixes target", value: "9.5% → 75.0%" },
  { what: "Cost per run · median", value: "$0.047" },
  { what: "Latency per run · median", value: "35.9 s" },
];

const challenges = [
  {
    title: "Resuming could repeat actions",
    body: "LangGraph re-runs a paused step from its start, so anything done before the pause happens twice. I moved every side effect into a single step after approval, guarded by idempotency keys, and wrote tests that kill the worker at each point and check that exactly one email arrives.",
  },
  {
    title: "Budget limits that weren't limits",
    body: "Checking money already spent let one big call overshoot. The ledger now reserves each call's worst-case cost before making it, and settles the real cost after.",
  },
  {
    title: "Tests that passed with broken code",
    body: "I made a habit of deliberately breaking the code to confirm each important test fails. Some didn't: the first MCP host-check test accepted any 4xx and passed even with the protection switched off. I rewrote those until they caught the break.",
  },
  {
    title: "What unit tests couldn't see",
    body: "A real-model walkthrough through the UI completed with one approved email, sent exactly once — but the final report said “not sent”, because the synthesizer wrote from the pre-approval draft. It now receives the actual action outcomes (ADR-052).",
  },
];

const decisions = [
  {
    title: "Postgres for everything stateful",
    body: "Checkpoints, job queue, events and vectors in one database instead of Celery, Redis and a separate vector store. Fewer moving parts, and deleting a user's data is one transaction.",
  },
  {
    title: "Agents propose, humans approve, one step executes",
    body: "Simple to reason about, and small enough to prove safe with kill tests.",
  },
  {
    title: "Capability separation against injection",
    body: "The agent that reads web pages has no email tool. You can't prompt your way out of prompt injection, so the defense doesn't depend on the prompt.",
  },
  {
    title: "Measure, don't claim",
    body: "No number goes in the README unless the eval harness produced it. The results tables are generated from committed run data.",
  },
];

const stackGroups = [
  { label: "Backend", items: "Python 3.12 · FastAPI · LangGraph · PostgreSQL · pgvector · psycopg 3 · Pydantic" },
  { label: "AI", items: "Claude API (Sonnet 5.5 and Haiku 5.5 as agents, Opus 5.5 as judge) · MCP · fastembed" },
  { label: "Frontend", items: "React 19 · TypeScript · Vite · Tailwind CSS · TanStack Query · React Flow" },
  { label: "Infra & security", items: "Docker · Docker Compose · nginx · GitHub Actions (10 CI jobs) · OpenTelemetry · gitleaks · pip-audit" },
  { label: "Testing", items: "pytest (660 tests) · Vitest (65) · Playwright + axe · real-model eval harness" },
];

const next = [
  "Re-run the full 60-scenario suite after the fixes — the re-measure covered only the scenarios they target.",
  "Re-measure the deliverable fix (ADR-052) with real models; it is tested with scripted models only.",
  "Human review of the judge's grades, then the live web instead of fixture pages, and a broader prompt-injection red team.",
];

export default function AgentOpsCaseStudy() {
  return (
    <>
      {/* ================= Case hero ================= */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="mx-auto w-full max-w-6xl px-5 pb-0 pt-28 sm:px-8">
          <Reveal>
            <Link href="/#work" className="font-mono text-xs text-ink-faint transition-colors hover:text-accent-strong">
              ← All projects
            </Link>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <h1 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-none tracking-[-0.025em] text-ink">
                AgentOps<span className="text-accent">.</span>
              </h1>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 font-mono text-[11px] font-medium text-accent-strong">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                Built & verified · real-model evaluation
              </span>
            </div>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-dim sm:text-xl">
              A team of AI agents that plans, uses tools, remembers what worked,
              and asks a human before doing anything risky — with a full audit
              trail and measured results.
            </p>
            <p className="mt-4 max-w-2xl leading-relaxed text-ink-dim">
              Give it “research this, write a brief, and email it to the team.” A
              supervisor plans the work, specialists carry it out in parallel, a
              reviewer checks every result, and the email waits for a human. If
              the server crashes mid-run, another worker picks it up where it
              left off without sending anything twice.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4 text-sm font-medium">
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-accent-deep px-6 py-3 text-white transition-colors hover:bg-accent"
              >
                View the repository ↗
              </a>
              <a href="#results" className="text-ink hover:text-accent-strong">
                How it was measured ↓
              </a>
            </div>
            <p className="mt-4 max-w-xl font-mono text-[11px] leading-relaxed text-ink-faint">
              It needs Postgres, long-running workers and Docker, so it runs
              locally with Docker Compose. A public replay of a real recorded run
              is next.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 pb-2">
              {project.stack.map((t) => (
                <span key={t} className="rounded-md border border-border px-2 py-0.5 font-mono text-[11px] text-ink-dim">
                  {t}
                </span>
              ))}
            </div>
          </Reveal>

          <figure className="relative z-10 mt-10 sm:mt-12">
            <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-border-strong bg-window">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/projects/agentops-running.webp"
                width={1440}
                height={900}
                alt="AgentOps running a real task — “write a brief on when to choose pgvector over a dedicated vector database, and email it to the team”: the plan graph with the research agent working and the writing agent pending, a live activity feed, and the task's budget."
                className="block h-auto w-full"
              />
            </div>
            <figcaption className="mx-auto max-w-4xl py-3 font-mono text-[11px] text-ink-faint">
              The real app on a real-model run (Claude Sonnet and Haiku).
            </figcaption>
          </figure>
        </div>
      </section>

      {/* metric strip */}
      <section className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <dl className="mt-12 flex flex-wrap items-center justify-between gap-x-10 gap-y-4 rounded-2xl border border-border bg-bg-raised px-6 py-5 sm:px-8">
          {[
            ["0", "unsafe actions in 180 real-model runs"],
            ["18/18", "planted defects caught, 0 false alarms"],
            ["9.5% → 75.0%", "on the 21 scenarios the fixes target"],
            ["$0.047", "median cost per run"],
          ].map(([v, l]) => (
            <div key={l} className="flex items-baseline gap-2.5">
              <dd className="whitespace-nowrap font-mono text-xl font-semibold text-accent-strong">{v}</dd>
              <dt className="text-xs text-ink-dim">{l}</dt>
            </div>
          ))}
        </dl>
      </section>

      {/* ================= Problem ================= */}
      <section className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-8">
        <p className="mx-auto max-w-3xl text-center font-display text-[clamp(1.5rem,3.2vw,2.25rem)] leading-snug tracking-tight">
          <span className="text-ink">Most agent demos are one model in a loop.</span>{" "}
          <span className="text-ink-faint">Real work needs agents that pick the right tool, never act without approval, and survive a crash without doing anything twice.</span>
        </p>
        <p className="mx-auto mt-6 max-w-2xl text-center leading-relaxed text-ink-dim">
          They also have to stay inside a budget, and be debuggable and
          measurable. AgentOps is built around those requirements: durable
          state, a human gate in front of every side effect, and an evaluation
          suite that checks the system&apos;s own trace data.
        </p>
      </section>

      {/* ================= Architecture ================= */}
      <section id="design" className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-8">
        <SectionHeading
          title="Agents propose,"
          accent="humans approve"
          lede="One Postgres database holds everything stateful. Workers run a checkpointed LangGraph state machine, so any run can pause for a person, crash, or be replayed — and pick up exactly where it was."
        />
        <div
          tabIndex={0}
          role="region"
          aria-label="Architecture diagram (scrolls horizontally)"
          className="mt-12 overflow-x-auto rounded-3xl border border-border bg-bg-raised p-5 sm:p-8"
        >
          <div className="min-w-[720px]">
            <AgentOpsArchitectureDiagram />
          </div>
        </div>
        <p className="mt-2 font-mono text-[11px] text-ink-faint sm:hidden">Scroll the diagram sideways →</p>

        <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {built.map((b) => (
            <div key={b.title} className="rounded-3xl border border-border bg-bg-raised p-7">
              <h3 className="font-display text-xl text-ink">{b.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-dim">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= Product ================= */}
      <section id="product" className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-8">
        <SectionHeading
          title="One real run,"
          accent="start to finish"
          lede="A brief on pgvector, researched, reviewed, escalated to a human, approved and emailed — captured from the real UI with real models. 16 model calls, $0.0764."
        />
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {gallery.map((g) => (
            <figure key={g.src}>
              <a
                href={g.full}
                target="_blank"
                rel="noopener noreferrer"
                className="block overflow-hidden rounded-2xl border border-border-strong bg-window transition-colors hover:border-accent"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={g.src}
                  width={1440}
                  height={g.h}
                  alt={g.alt}
                  loading="lazy"
                  className="block aspect-[16/11] h-auto w-full object-cover object-left-top"
                />
                <span className="sr-only"> (opens the full screenshot on GitHub)</span>
              </a>
              <figcaption className="mt-3 text-sm leading-relaxed text-ink-dim">{g.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ================= Results ================= */}
      <section id="results" className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-8">
        <SectionHeading
          title="Measured with"
          accent="real models"
          lede="60 scenarios across 10 categories — planning, parallelism, tools, reviewer, approvals, crash recovery, prompt injection, memory, cost, loops — each run 3 times with Claude Sonnet and Haiku. A run passes only if checks on the system's own trace pass and an independent judge, Claude Opus, agrees; reviewer scenarios are scored against their planted labels."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="rounded-3xl border border-border bg-bg-raised p-7 sm:p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="font-display text-xl text-ink">The numbers</h3>
              <p className="font-mono text-xs text-ink-faint">baseline + re-measure · 2026-11-10</p>
            </div>
            <table className="mt-5 w-full text-left text-sm">
              <caption className="sr-only">AgentOps evaluation results</caption>
              <tbody>
                {results.map((r) => (
                  <tr key={r.what} className="border-b border-border last:border-0">
                    <th scope="row" className="py-3 pr-4 font-medium text-ink">{r.what}</th>
                    <td className="py-3 text-right font-mono text-accent-strong">{r.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 text-xs leading-relaxed text-ink-dim">
              Wilson 95% intervals: baseline pass rate 53.8–67.9%; targeted
              scenarios 6/63 (4.4–19.3%) before the fixes, 39/52 valid runs
              (61.8–84.8%) after — re-measured on those scenarios only, with
              errored runs excluded. The loop count covers 198 runs because it
              includes the memory on/off arms. Unsafe means an external action taken without
              approval, checked on the trace. Every number is generated from the
              committed results in the repo&apos;s{" "}
              <span className="font-mono">docs/EVALUATION.md</span>.
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-bg-raised p-7 sm:p-8">
            <h3 className="font-display text-xl text-ink">The routing bug the traces found</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-dim">
              The safety properties held on the first paid run, but the failures
              clustered. The trace data showed why: the read-only SQL tool ran
              only <span className="font-mono text-ink">2</span> times in{" "}
              <span className="font-mono text-ink">177</span> runs. The planner
              saw only agent <em>names</em>, so it sent database questions to the
              code agent — which has no database tool — and the reviewer
              escalated them.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-dim">
              The fix gives the planner each agent&apos;s purpose and its real
              tool list from the registry, with a test tying the two together.
              Two smaller fixes followed: emails are proposed, not just drafted,
              and recalled preferences reach the final text.
            </p>
            <p className="mt-5 font-mono text-xs text-accent-strong">
              21 targeted scenarios: 9.5% → 75.0% · still 0 unsafe actions
            </p>
          </div>
        </div>
      </section>

      {/* ================= Challenges ================= */}
      <section id="challenges" className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-8">
        <SectionHeading
          title="What broke,"
          accent="and the fix"
          lede="The problems worth writing down were the ones that looked fine until something tested them."
        />
        <ol className="mt-12 grid gap-5 md:grid-cols-2">
          {challenges.map((c, i) => (
            <li key={c.title} className="flex gap-5 rounded-3xl border border-border bg-bg-raised p-7">
              <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent font-mono text-xs font-semibold text-white">
                {i + 1}
              </span>
              <div>
                <h3 className="font-display text-xl text-ink">{c.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-dim">{c.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ================= Decisions + build ================= */}
      <section className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-8">
        <SectionHeading
          title="Decisions that"
          accent="kept it simple"
          lede="52 architecture decisions are recorded in the repo. These four shaped everything else."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {decisions.map((d) => (
            <div key={d.title} className="rounded-3xl border border-border bg-bg-raised p-7 sm:p-8">
              <h3 className="font-display text-xl text-ink">{d.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-dim">{d.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-10 border-t border-border-strong pt-12 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <h3 className="font-display text-2xl text-ink">How I built it</h3>
            <p className="mt-3 leading-relaxed text-ink-dim">
              I designed and built AgentOps end to end in six phases: foundation,
              a vertical slice, tools and sandbox, approvals and memory, UI and
              replay, then evaluation and hardening. Before writing code I reviewed
              the reference design and found bugs in it. Each phase started from a
              written plan I reviewed and approved, and ended verified by tests and
              CI. Total real-model spend for the project, mostly evaluation: about
              $17.
            </p>
          </div>
          <dl className="divide-y divide-border border-y border-border">
            {stackGroups.map((s) => (
              <div key={s.label} className="grid gap-1 py-3 sm:grid-cols-[130px_1fr] sm:gap-4">
                <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint sm:pt-0.5">{s.label}</dt>
                <dd className="text-sm leading-relaxed text-ink-dim">{s.items}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ================= Next ================= */}
      <section className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-8">
        <SectionHeading
          title="What the numbers"
          accent="don't show yet"
          lede="The gaps I'd raise first if I were reviewing this."
        />
        <div className="mt-12 rounded-3xl border border-accent/30 bg-accent/5 p-7 sm:p-9">
          <ul className="space-y-4">
            {next.map((n) => (
              <li key={n} className="flex gap-3 leading-relaxed text-ink-dim">
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                <span>{n}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ================= Close ================= */}
      <section className="mx-auto w-full max-w-6xl px-5 pb-28 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-6 rounded-[20px] border border-border bg-bg-raised p-9 sm:p-12">
          <div>
            <h2 className="font-display text-3xl text-ink sm:text-4xl">
              Run it, then try to make it misbehave<span className="text-accent">.</span>
            </h2>
            <p className="mt-2 max-w-md text-[15px] leading-relaxed text-ink-dim">
              Docker Compose brings up the whole stack. Scripted models are the
              default, so it runs at $0 with no API key.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-accent-deep px-6 py-3 text-white transition-colors hover:bg-accent"
            >
              GitHub ↗
            </a>
            <Link href="/#contact" className="text-ink transition-colors hover:text-accent-strong">
              Contact me
            </Link>
            <Link href="/#work" className="text-ink transition-colors hover:text-accent-strong">
              All projects
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
