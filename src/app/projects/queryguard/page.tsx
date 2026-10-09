import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { QueryGuardPipelineDiagram } from "@/components/QueryGuardVisuals";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "QueryGuard — Case Study",
  description:
    "Text-to-SQL with two independent safety layers, three hallucination detectors and a calibrated confidence score. On the frozen eval set it flags 99.0% of known-wrong queries with 7.6% false flags.",
};

const project = projects.find((p) => p.slug === "queryguard")!;

const layers = [
  {
    title: "① The guardrail",
    body: "Works on sqlparse tokens, never raw substrings: exactly one SELECT, no DML anywhere in the statement, and a LIMIT added when there is none. Anything else is blocked with the rule named. 81 tests, no database or network needed.",
  },
  {
    title: "② The database itself",
    body: "Queries run as queryguard_ro, a role with SELECT and nothing else — including on tables created later — inside a READ ONLY transaction that is always rolled back, under a statement timeout. scripts/verify_db.py proves its writes fail.",
  },
];

const detectors = [
  {
    title: "Blind back-translation",
    stat: "65%",
    body: "A model turns the SQL back into a question without ever seeing the original — shown both, it reads the query charitably. A separate judge compares the two questions.",
  },
  {
    title: "Second-query agreement",
    stat: "91%",
    body: "An independent second query answers the same question and the result sets are compared. The strongest single detector, and the one fan-out joins can't get past (28/28).",
  },
  {
    title: "Sanity checks",
    stat: "17%",
    body: "The result's shape is checked against a profile of the schema, plus a revenue_status rule: a revenue total that doesn't exclude pending and cancelled orders is flagged.",
  },
];

const results = [
  { what: "Execution accuracy · answerable questions", value: "39/40" },
  { what: "Ambiguous or unanswerable, correctly declined", value: "10/10" },
  { what: "Wrong answers flagged (confidence < 0.5)", value: "99.0% (103/104)" },
  { what: "False flags on correct answers", value: "7.6% (6/79)" },
  { what: "Brier score · hand-set → calibrated", value: "0.051 → 0.038" },
  { what: "ECE (10 bins) · hand-set → calibrated", value: "0.109 → 0.072" },
  { what: "Cost per question · median", value: "$0.0135 · ≤ 4 calls" },
  { what: "Latency per question · median / p90", value: "10.2 s / 14.1 s" },
];

const glossaryFix = [
  "A metric glossary: gross revenue counts only paid, shipped, delivered and refunded orders. It lives in the schema comments and the generator's prompt.",
  "A revenue_status sanity check that flags a revenue total summing every order status.",
  "The glossary in the alignment judge — scoped to questions that actually use a glossary term, after the unscoped version read “revenue” into “total order amount”.",
];

export default function QueryGuardCaseStudy() {
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
                QueryGuard<span className="text-accent">.</span>
              </h1>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 font-mono text-[11px] font-medium text-accent-strong">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                Live · real model, capped at $0.50/day
              </span>
            </div>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-dim sm:text-xl">
              Text-to-SQL that tells you when not to trust the answer. An LLM
              writes the SQL, a database role that can&apos;t write runs it, and
              three independent checks feed a calibrated probability that the
              answer is right.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4 text-sm font-medium">
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-accent-deep px-6 py-3 text-white transition-colors hover:bg-accent"
              >
                Open the live demo ↗
              </a>
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-ink hover:text-accent-strong">
                View the repository ↗
              </a>
              <Link href="/#queryguard" className="text-ink hover:text-accent-strong">
                Try the guardrail simulator →
              </Link>
            </div>
            <p className="mt-4 max-w-xl font-mono text-[11px] leading-relaxed text-ink-faint">
              The live demo runs the real model within a $0.50 daily spend
              ceiling. Past that, questions run in demo mode — the guardrail,
              read-only database and every check still run for real — and the
              header says which mode answered.
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
                src="/projects/queryguard-pipeline.webp"
                width={1600}
                height={1111}
                alt="QueryGuard answering “What was gross revenue from orders placed in 2025, before refunds?”: the pipeline timeline with every check passed, a 0.98 calibrated confidence with its per-signal breakdown, blind back-translation, an agreeing second query, and the SQL."
                className="block h-auto w-full"
              />
            </div>
            <figcaption className="mx-auto max-w-4xl py-3 font-mono text-[11px] text-ink-faint">
              The real app, captured in demo mode ($0, simulated model).
            </figcaption>
          </figure>
        </div>
      </section>

      {/* metric strip */}
      <section className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <dl className="mt-12 flex flex-wrap items-center justify-between gap-x-10 gap-y-4 rounded-2xl border border-border bg-bg-raised px-6 py-5 sm:px-8">
          {[
            ["99.0%", "of wrong answers flagged"],
            ["7.6%", "false flags on correct ones"],
            ["39/40", "answerable questions correct"],
            ["0", "writes the database will accept"],
          ].map(([v, l]) => (
            <div key={l} className="flex items-baseline gap-2.5">
              <dd className="font-mono text-xl font-semibold text-accent-strong">{v}</dd>
              <dt className="text-xs text-ink-dim">{l}</dt>
            </div>
          ))}
        </dl>
      </section>

      {/* ================= Problem ================= */}
      <section className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-8">
        <p className="mx-auto max-w-3xl text-center font-display text-[clamp(1.5rem,3.2vw,2.25rem)] leading-snug tracking-tight">
          <span className="text-ink">A wrong SQL answer looks exactly like a right one.</span>{" "}
          <span className="text-ink-faint">Same table, same confident number. Writing the query is the easy part; knowing when to doubt it is the project.</span>
        </p>
        <p className="mx-auto mt-6 max-w-2xl text-center leading-relaxed text-ink-dim">
          QueryGuard answers plain-English questions over a PostgreSQL database
          and shows its work: the SQL, every check&apos;s verdict, and a
          probability that the answer is right. It can ask which reading you
          meant, refuse what the schema can&apos;t answer — and no question,
          however it&apos;s phrased, can change the data.
        </p>
      </section>

      {/* ================= Architecture ================= */}
      <section id="design" className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-8">
        <SectionHeading
          title="Two safety layers,"
          accent="three detectors"
          lede="Safety and correctness are separate problems. The safety layers decide what may reach the database; the detectors decide how far to trust what comes back."
        />
        <div
          tabIndex={0}
          role="region"
          aria-label="Pipeline diagram (scrolls horizontally)"
          className="mt-12 overflow-x-auto rounded-3xl border border-border bg-bg-raised p-5 sm:p-8"
        >
          <div className="min-w-[680px]">
            <QueryGuardPipelineDiagram />
          </div>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {layers.map((l) => (
            <div key={l.title} className="rounded-3xl border border-border bg-bg-raised p-7 sm:p-8">
              <h3 className="font-display text-xl text-ink">{l.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-dim">{l.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-5 rounded-2xl border border-accent/25 bg-accent/5 p-5 text-sm leading-relaxed text-ink-dim">
          <span className="font-semibold text-accent-strong">Each layer holds without the other.</span>{" "}
          The executor never assumes the guardrail ran, and the API keeps its own
          state elsewhere, so it never needs a writable identity on the database
          it queries.
        </p>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {detectors.map((d) => (
            <div key={d.title} className="rounded-3xl border border-border bg-bg-raised p-7">
              <p className="font-mono text-2xl font-semibold text-accent-strong">{d.stat}</p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-faint">of mutations caught alone</p>
              <h3 className="mt-5 font-display text-xl text-ink">{d.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-dim">{d.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-5 max-w-3xl text-sm leading-relaxed text-ink-dim">
          No detector is enough on its own; together, every one of the 104
          known-wrong queries tripped at least one. A logistic model fitted on
          the eval run turns their signals into one probability, and the UI
          explains it signal by signal.
        </p>
      </section>

      {/* ================= Results ================= */}
      <section id="results" className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-8">
        <SectionHeading
          title="Measured, then"
          accent="frozen"
          lede="50 questions through the full pipeline, plus 104 known-wrong mutation queries and 40 golden queries through the validators. Final for prompt version p-02ea2fb3b358 — more tuning on the same set would overfit to it."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="rounded-3xl border border-border bg-bg-raised p-7 sm:p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="font-display text-xl text-ink">The numbers</h3>
              <p className="font-mono text-xs text-ink-faint">run final-2026-10-08</p>
            </div>
            <table className="mt-5 w-full text-left text-sm">
              <caption className="sr-only">QueryGuard evaluation results</caption>
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
              Calibrated metrics are out-of-fold: GroupKFold by golden question,
              so a question&apos;s golden SQL, its mutations and its generated
              answer always land in the same fold. Cost and latency are for the
              real model. Every number traces to recorded runs in the
              repo&apos;s <span className="font-mono">evals/results/</span>.
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-bg-raised p-7 sm:p-8">
            <h3 className="font-display text-xl text-ink">The blind spot the eval found</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-dim">
              In the first run, “gross revenue from orders placed in 2025, before
              refunds” summed unpaid pending orders too: $6,177,714.13 against
              the golden $5,791,881.33. Every detector passed it, scoring 0.96.
              All three compared the SQL with the <em>question</em>; none knew
              the <em>business rule</em>. The fix, in three steps:
            </p>
            <ol className="mt-5 space-y-4">
              {glossaryFix.map((g, i) => (
                <li key={g} className="flex gap-4">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent font-mono text-[11px] font-semibold text-white">
                    {i + 1}
                  </span>
                  <p className="text-[14.5px] leading-relaxed text-ink-dim">{g}</p>
                </li>
              ))}
            </ol>
            <p className="mt-5 font-mono text-xs text-accent-strong">
              Now: refund_04 correct at 0.98 · both mutations that slipped through caught
            </p>
          </div>
        </div>
      </section>

      {/* ================= Limitation ================= */}
      <section className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-8">
        <SectionHeading
          title="What the numbers"
          accent="don't show"
          lede="The limitation I'd raise first if I were reviewing this."
        />
        <div className="mt-12 rounded-3xl border border-accent/30 bg-accent/5 p-7 sm:p-9">
          <h3 className="font-display text-2xl text-ink">No organic errors in the calibration set</h3>
          <p className="mt-3 max-w-3xl leading-relaxed text-ink-dim">
            The model was wrong on just 1 of 40 answerable questions in the first
            run — too few to calibrate on — so all 104 wrong rows are mutations:
            fan-out joins, dropped filters, swapped columns, mechanical errors
            that are verified to change the result. Real model errors look like
            the refund case did: plausible, consistent and silent. Expect the
            probabilities to be overconfident on real traffic. Only a fresh,
            held-out question set can measure how far.
          </p>
        </div>
      </section>

      {/* ================= Close ================= */}
      <section className="mx-auto w-full max-w-6xl px-5 pb-28 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-6 rounded-[20px] border border-border bg-bg-raised p-9 sm:p-12">
          <div>
            <h2 className="font-display text-3xl text-ink sm:text-4xl">
              Ask it something, then try to break it<span className="text-accent">.</span>
            </h2>
            <p className="mt-2 max-w-md text-[15px] leading-relaxed text-ink-dim">
              The live demo has three starters: a normal question, an ambiguous
              one, and a pasted DROP TABLE.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-accent-deep px-6 py-3 text-white transition-colors hover:bg-accent"
            >
              Live demo ↗
            </a>
            <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-ink transition-colors hover:text-accent-strong">
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
