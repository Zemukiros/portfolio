"use client";

import { useEffect, useMemo, useState } from "react";
import { PRESETS, confidence, guard, type GuardResult, type Preset } from "@/lib/queryguardSim";

const STEP_MS = 480;
const REPO = "https://github.com/Zemukiros/queryguard";

type Mode = { kind: "preset"; preset: Preset } | { kind: "custom"; sql: string };
type StageState = "pending" | "pass" | "rewrite" | "blocked" | "skipped" | "stopped";

/** What the pipeline produces for the current input, computed up front; the UI reveals it stage by stage. */
function runPipeline(mode: Mode) {
  if (mode.kind === "preset" && mode.preset.generated.type === "clarification") {
    return { sql: null, ask: mode.preset.generated.ask, guardResult: null, outcome: "clarification" as const };
  }
  const sql = mode.kind === "preset" ? (mode.preset.generated as { sql: string }).sql : mode.sql;
  const guardResult = guard(sql);
  if (!guardResult.allowed) return { sql, ask: null, guardResult, outcome: "blocked" as const };
  return { sql, ask: null, guardResult, outcome: mode.kind === "preset" ? ("executed" as const) : ("passed" as const) };
}

export default function QueryGuardSim() {
  const [mode, setMode] = useState<Mode>({ kind: "preset", preset: PRESETS[0] });
  const [draft, setDraft] = useState("SELECT country, COUNT(*) AS customers\nFROM customers\nGROUP BY country");
  const [revealed, setRevealed] = useState(1); // number of stages shown
  const [runId, setRunId] = useState(0);

  const run = useMemo(() => runPipeline(mode), [mode]);
  const preset = mode.kind === "preset" ? mode.preset : null;
  const score = useMemo(
    () => (run.outcome === "executed" && preset?.verify ? confidence(preset.verify.score) : null),
    [run.outcome, preset],
  );

  // Reveal stages one by one (all at once under reduced motion). The counter is reset
  // in `choose`; the effect only schedules the steps.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timers = reduce
      ? [setTimeout(() => setRevealed(5), 0)]
      : [2, 3, 4, 5].map((n) => setTimeout(() => setRevealed(n), (n - 1) * STEP_MS));
    return () => timers.forEach(clearTimeout);
  }, [runId]);

  const choose = (m: Mode) => {
    setMode(m);
    setRevealed(1);
    setRunId((r) => r + 1);
  };

  const g = run.guardResult as GuardResult | null;
  const states: StageState[] = (() => {
    if (run.outcome === "clarification") return ["stopped", "skipped", "skipped", "skipped", "stopped"];
    if (run.outcome === "blocked") return ["pass", "blocked", "skipped", "skipped", "blocked"];
    const guardState: StageState = g && g.allowed && g.rewrote ? "rewrite" : "pass";
    if (run.outcome === "passed") return ["pass", guardState, "skipped", "skipped", "pass"];
    return ["pass", guardState, "pass", "pass", "pass"];
  })();

  const isCustom = mode.kind === "custom";

  return (
    <div className="overflow-hidden rounded-[20px] border border-border bg-window">
      {/* window chrome */}
      <div className="flex items-center gap-3 border-b border-border px-5 py-3">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-rose/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-mint/70" />
        </span>
        <span className="rounded-full bg-bg-panel px-3 py-0.5 font-mono text-[11px] text-ink-dim">
          queryguard · pipeline · simulated
        </span>
      </div>

      <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
        {/* ---------- input ---------- */}
        <div className="border-b border-border p-6 lg:border-b-0 lg:border-r sm:p-7">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-faint">Ask the database</p>
          <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Example requests">
            {PRESETS.map((p) => {
              const active = preset?.id === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => choose({ kind: "preset", preset: p })}
                  className={`rounded-full border px-3 py-1.5 text-[13px] transition-colors ${
                    active
                      ? "border-accent-deep bg-accent-deep text-white"
                      : "border-border-strong text-ink hover:border-accent hover:text-accent-strong"
                  }`}
                >
                  <span
                    className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full align-middle ${
                      p.kind === "attack" ? "bg-rose" : p.kind === "ambiguous" ? "bg-amber" : active ? "bg-white" : "bg-accent"
                    }`}
                    aria-hidden="true"
                  />
                  {p.label}
                </button>
              );
            })}
            <button
              type="button"
              aria-pressed={isCustom}
              onClick={() => choose({ kind: "custom", sql: draft })}
              className={`rounded-full border border-dashed px-3 py-1.5 text-[13px] transition-colors ${
                isCustom ? "border-accent-deep bg-accent-deep text-white" : "border-border-strong text-ink hover:border-accent hover:text-accent-strong"
              }`}
            >
              Write your own SQL
            </button>
          </div>

          {preset ? (
            <blockquote className="mt-7 font-display text-[clamp(1.5rem,2.4vw,2rem)] leading-tight text-ink">
              “{preset.question}”
            </blockquote>
          ) : (
            <form
              className="mt-6"
              onSubmit={(e) => {
                e.preventDefault();
                choose({ kind: "custom", sql: draft });
              }}
            >
              <label htmlFor="qg-sql" className="text-sm text-ink-dim">
                Paste any SQL — the guardrail stage runs live on it.
              </label>
              <textarea
                id="qg-sql"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={5}
                spellCheck={false}
                className="mt-2 w-full resize-y rounded-xl border border-border-strong bg-bg p-3 font-mono text-[12.5px] leading-relaxed text-ink"
              />
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <button type="submit" className="rounded-full bg-accent-deep px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent">
                  Run guardrails
                </button>
                <span className="font-mono text-[11px] text-ink-faint">try DELETE, a second statement, or pg_sleep()</span>
              </div>
            </form>
          )}

          <p className="mt-7 text-sm leading-relaxed text-ink-dim">
            QueryGuard treats model-written SQL as <span className="font-medium text-ink">untrusted code</span>: it is
            parsed and policy-checked before it can touch the database, run under a read-only role, and then checked
            again against the question it was meant to answer.
          </p>
        </div>

        {/* ---------- pipeline ---------- */}
        <ol className="relative p-6 sm:p-7" aria-live="polite">
          <Stage n={1} title="LLM generates SQL" meta="model output · untrusted" state={states[0]} shown={revealed >= 1}>
            {run.ask ? (
              <p className="text-sm text-ink-dim">
                <span className="font-medium text-ink">Asks back instead of guessing:</span> {run.ask}
              </p>
            ) : (
              <pre className="overflow-x-auto rounded-xl border border-border bg-bg px-3 py-2.5 font-mono text-[12px] leading-relaxed text-ink">
                {isCustom ? "(your SQL)\n" : ""}
                {run.sql}
              </pre>
            )}
          </Stage>

          <Stage n={2} title="Guardrails" meta="sqlparse tokens · 7 rules · SELECT-only" state={states[1]} shown={revealed >= 2}>
            {g && !g.allowed && (
              <p className="text-sm text-ink">
                <span className="font-mono text-[12px] text-rose">BLOCKED by {g.rule}:</span> {g.reason}
              </p>
            )}
            {g && g.allowed && (
              <p className="text-sm text-ink-dim">
                All rules pass.
                {g.rewrote && (
                  <>
                    {" "}
                    <span className="font-mono text-[12px] text-ink">LIMIT 1001</span> appended — a 1,000-row cap with one
                    extra row as the overflow signal.
                  </>
                )}
              </p>
            )}
          </Stage>

          <Stage
            n={3}
            title="Read-only execution"
            meta="read-only role · READ ONLY txn · 5 s timeout · 100k-row plan check"
            state={states[2]}
            shown={revealed >= 3}
          >
            {run.outcome === "executed" && preset?.result && (
              <table className="w-full max-w-sm text-left text-[12.5px]">
                <caption className="sr-only">Sample result rows</caption>
                <thead>
                  <tr className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-faint">
                    {preset.result.columns.map((c) => (
                      <th key={c} className="pb-1.5 font-medium">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preset.result.rows.map((r) => (
                    <tr key={String(r[0])} className="border-t border-border">
                      {r.map((v, i) => (
                        <td key={i} className={`py-1 ${typeof v === "number" ? "font-mono text-accent-strong" : "text-ink"}`}>
                          {v}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {run.outcome === "passed" && <p className="text-sm text-ink-dim">Would run here — this demo has no database.</p>}
            {(run.outcome === "blocked" || run.outcome === "clarification") && <p className="text-sm text-ink-faint">Never reached the database.</p>}
          </Stage>

          <Stage n={4} title="Semantic verification" meta="blind back-translation · second query · sanity checks" state={states[3]} shown={revealed >= 4}>
            {run.outcome === "executed" && preset?.verify ? (
              <div className="space-y-1.5 text-sm text-ink-dim">
                <p>
                  <span className="text-ink">Back-translated, without seeing your question:</span> “{preset.verify.backTranslation}”
                </p>
                <p className="font-mono text-[12px]">
                  alignment {preset.verify.score.alignment.toFixed(2)} · discrepancies {preset.verify.score.discrepancies} · second query{" "}
                  {preset.verify.score.agreement}
                </p>
              </div>
            ) : (
              <p className="text-sm text-ink-faint">Skipped — nothing ran.</p>
            )}
          </Stage>

          <Stage n={5} title="Decision" meta="" state={states[4]} shown={revealed >= 5} last>
            <Decision outcome={run.outcome} score={score} />
          </Stage>
        </ol>
      </div>

      {/* recorded evidence + honesty note */}
      <div className="border-t border-border bg-bg px-6 py-5 sm:px-7">
        <dl className="grid gap-4 sm:grid-cols-3">
          {[
            ["49/50", "generated answers correct"],
            ["102/105", "wrong answers flagged by detectors"],
            ["0.957", "AUC of the v0 confidence score"],
          ].map(([v, l]) => (
            <div key={l} className="flex items-baseline gap-2.5">
              <dt className="sr-only">{l}</dt>
              <dd className="font-mono text-lg font-semibold text-accent-strong">{v}</dd>
              <span className="text-[12.5px] text-ink-dim" aria-hidden="true">
                {l}
              </span>
            </div>
          ))}
        </dl>
        <p className="mt-3 font-mono text-[11px] leading-relaxed text-ink-faint">
          Recorded live eval, 2026-10-01, 194 items. In this demo the guardrail stage is a TypeScript port of the repo&apos;s
          rules and runs live on your input; generation, execution, and verification are replayed for the presets.{" "}
          <a href={REPO} target="_blank" rel="noopener noreferrer" className="text-accent-strong underline underline-offset-2">
            Source ↗
          </a>
        </p>
      </div>
    </div>
  );
}

const PILL: Record<StageState, { text: string; cls: string }> = {
  pending: { text: "…", cls: "border-border text-ink-faint" },
  pass: { text: "pass", cls: "border-accent/40 bg-accent/10 text-accent-strong" },
  rewrite: { text: "pass · rewrote", cls: "border-accent/40 bg-accent/10 text-accent-strong" },
  blocked: { text: "blocked", cls: "border-rose/40 bg-rose/10 text-rose" },
  skipped: { text: "skipped", cls: "border-border text-ink-faint" },
  stopped: { text: "stopped", cls: "border-amber/40 bg-amber/10 text-amber" },
};

function Stage({
  n,
  title,
  meta,
  state,
  shown,
  last,
  children,
}: {
  n: number;
  title: string;
  meta: string;
  state: StageState;
  shown: boolean;
  last?: boolean;
  children: React.ReactNode;
}) {
  const s = shown ? state : "pending";
  const dim = s === "skipped" || s === "pending";
  return (
    <li className={`relative pl-10 ${last ? "" : "pb-6"}`}>
      {!last && <span className="absolute left-[13px] top-7 h-[calc(100%-1.25rem)] w-px bg-border-strong" aria-hidden="true" />}
      <span
        className={`absolute left-0 top-0 flex h-7 w-7 items-center justify-center rounded-full border font-mono text-[11px] transition-colors duration-300 ${
          s === "blocked"
            ? "border-rose bg-rose text-white"
            : s === "pass" || s === "rewrite"
              ? "border-accent-deep bg-accent-deep text-white"
              : s === "stopped"
                ? "border-amber bg-amber text-white"
                : "border-border-strong bg-bg text-ink-faint"
        }`}
        aria-hidden="true"
      >
        {n}
      </span>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <h3 className={`font-display text-xl leading-tight transition-colors ${dim ? "text-ink-faint" : "text-ink"}`}>{title}</h3>
        <span className={`rounded-full border px-2 py-0.5 font-mono text-[10.5px] ${PILL[s].cls}`}>{PILL[s].text}</span>
      </div>
      {meta && <p className="mt-0.5 font-mono text-[10.5px] text-ink-faint">{meta}</p>}
      <div className={`qg-stage-body mt-2.5 ${shown ? "is-shown" : ""}`}>{shown && children}</div>
    </li>
  );
}

function Decision({
  outcome,
  score,
}: {
  outcome: "executed" | "blocked" | "clarification" | "passed";
  score: ReturnType<typeof confidence> | null;
}) {
  if (outcome === "blocked")
    return (
      <p className="text-sm text-ink-dim">
        <span className="mr-2 rounded-md bg-rose px-2 py-0.5 font-mono text-[12px] font-semibold text-white">BLOCKED</span>
        The SQL never reached the database. Confidence <span className="font-mono text-ink">0.00</span> — it did not run.
      </p>
    );
  if (outcome === "clarification")
    return (
      <p className="text-sm text-ink-dim">
        <span className="mr-2 rounded-md bg-amber px-2 py-0.5 font-mono text-[12px] font-semibold text-white">CLARIFY</span>
        No SQL is generated until the question is unambiguous.
      </p>
    );
  if (outcome === "passed")
    return (
      <p className="text-sm text-ink-dim">
        <span className="mr-2 rounded-md bg-accent-deep px-2 py-0.5 font-mono text-[12px] font-semibold text-white">ALLOWED</span>
        Your SQL passes the guardrails. In the real pipeline it would now run read-only and be verified.
      </p>
    );
  return (
    <div>
      <p className="text-sm text-ink-dim">
        <span className="mr-2 rounded-md bg-accent-deep px-2 py-0.5 font-mono text-[12px] font-semibold text-white">EXECUTED</span>
        Answer returned with a confidence score.
      </p>
      {score && (
        <div className="mt-3 max-w-sm">
          <div className="flex items-baseline justify-between font-mono text-[11px] text-ink-faint">
            <span>confidence</span>
            <span className="text-base font-semibold text-accent-strong">{score.score.toFixed(2)}</span>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-bg-panel">
            <div className="qg-bar h-full rounded-full bg-accent" style={{ width: `${score.score * 100}%` }} />
          </div>
          <details className="mt-2 font-mono text-[11px] text-ink-faint">
            <summary className="cursor-pointer hover:text-accent-strong">How the score is built (v0, hand-set, uncalibrated)</summary>
            <ul className="mt-1.5 space-y-0.5">
              {score.terms.map((t) => (
                <li key={t.label} className="flex justify-between gap-4">
                  <span>{t.label}</span>
                  <span className="text-ink">{t.value >= 0 ? "+" : ""}{t.value.toFixed(2)}</span>
                </li>
              ))}
              <li className="flex justify-between gap-4 border-t border-border pt-0.5">
                <span>sigmoid(sum)</span>
                <span className="text-accent-strong">{score.score.toFixed(3)}</span>
              </li>
            </ul>
          </details>
        </div>
      )}
    </div>
  );
}
