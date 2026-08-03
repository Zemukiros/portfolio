import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { MeridianMockup } from "@/components/ProjectMockups";
import {
  OperationsMockup,
  MeridianArchitectureDiagram,
} from "@/components/MeridianVisuals";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Meridian Patient Website — Case Study",
  description:
    "Internship case study: a live Django + PostgreSQL drone medication-delivery platform — patient ordering with a simulated checkout, a live four-stage delivery tracker, and a customized staff operations dashboard, backed by 43 automated tests and infrastructure-as-code deployment on Render + Neon.",
};

const project = projects.find((p) => p.slug === "meridian")!;

const GRADIENT = "linear-gradient(135deg, #0b3b3c 0%, #0f766e 55%, #2dd4bf 125%)";

const decisions = [
  {
    title: "Django 6.0 over 5.x",
    tradeoff: "current over cautious",
    body: "Starting a greenfield build a major version behind made no sense. Django 6.0 ships first-class Python 3.14 support, and the whole stack — auth, ORM, admin, test runner — was verified end-to-end on 6.0 before feature work began.",
    wide: false,
  },
  {
    title: "Neon over host-bundled PostgreSQL",
    tradeoff: "persistence over convenience",
    body: "The host's free bundled database expires after 30 days — a silent time bomb for a demo that needs to stay up. Neon's serverless PostgreSQL free tier persists, at the cost of wiring one DATABASE_URL across providers.",
    wide: false,
  },
  {
    title: "Every route live from day one",
    tradeoff: "navigation over polish",
    body: "All nine pages existed as styled placeholders before any feature was built, so navigation never broke during incremental builds — stakeholders could click through the full product shape at every stage.",
    wide: false,
  },
  {
    title: "Pricing single-sourced",
    tradeoff: "one edit over three",
    body: "The three plans live in a single dictionary consumed by the pricing page, the order form, and checkout. A business pricing change is a one-line edit that cannot drift out of sync between pages.",
    wide: false,
  },
  {
    title: "Simulated checkout, Stripe-shaped",
    tradeoff: "honesty over pretending",
    body: "Card format is validated, no processor is contacted, and only the last four digits are stored — but the flow is deliberately shaped so a real Stripe integration is a drop-in replacement, not a rewrite. The demo says so out loud instead of faking a charge.",
    wide: true,
  },
];

const testSuites = [
  { label: "orders · Django tests", count: 23, pct: 100, detail: "Form validation rules (incl. the 2,500 g payload cap), payment simulation, tracker states, admin pipeline actions" },
  { label: "accounts · Django tests", count: 10, pct: 43, detail: "Signup, login, session handling, and access-control boundaries" },
  { label: "pages · Django tests", count: 10, pct: 43, detail: "Every public route, pricing consistency, template rendering" },
];

const constraints = [
  {
    title: "Synthetic data only",
    body: "Every patient, prescription, and order in the demo comes from a re-runnable seed_demo management command — no real patient data anywhere, by documented policy.",
  },
  {
    title: "Ownership at the query level",
    body: "Order lookups are filtered by the authenticated user in the queryset itself, so another patient's order isn't hidden — it's unreachable.",
  },
  {
    title: "Zero secrets in git",
    body: "All credentials are environment-driven. The repository can be public — and now is — because there was never anything in it to leak.",
  },
  {
    title: "Regulated-launch honesty",
    body: "HIPAA readiness and FAA Part 107 drone rules are tracked as launch prerequisites, not afterthoughts. The prototype documents that it is not cleared for real patient data.",
  },
];

export default function MeridianCaseStudy() {
  return (
    <>
      {/* ================= Case hero ================= */}
      <section className="relative overflow-hidden" style={{ background: GRADIENT }}>
        <div className="mx-auto w-full max-w-6xl px-5 pb-0 pt-28 sm:px-8">
          <Reveal>
            <Link
              href="/#work"
              className="font-mono text-xs text-white/70 transition-colors hover:text-white"
            >
              ← All projects
            </Link>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <h1 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-none tracking-[-0.03em] text-white">
                Meridian<span className="text-white/50">.</span>
              </h1>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 font-mono text-[11px] font-medium text-white backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-white/80" aria-hidden="true" />
                Live · internship project
              </span>
            </div>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/85 sm:text-xl">
              A drone medication-delivery platform built during my software
              engineering internship at Meridian Medical Associates — patients
              order and watch their delivery move through a live four-stage
              tracker, while staff drive the pipeline from a customized
              operations dashboard.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4 text-sm font-medium">
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-white px-6 py-3 text-[#0f766e] transition-colors hover:bg-white/85"
              >
                View the repository ↗
              </a>
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/90 hover:text-white"
                >
                  Open the live app ↗
                </a>
              )}
            </div>
            <p className="mt-4 max-w-xl font-mono text-[11px] leading-relaxed text-white/65">
              Free-tier hosting sleeps when idle — the first load can take about
              a minute. All data is synthetic; payments are simulated, so no
              real charge is possible.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 pb-2">
              {project.stack.map((t) => (
                <span key={t} className="rounded-full bg-white/12 px-3 py-1 font-mono text-[11px] text-white/85">
                  {t}
                </span>
              ))}
            </div>
          </Reveal>

          {/* hero mockup bleeding out of the gradient */}
          <div className="relative z-10 mt-10 sm:mt-12">
            <div className="mx-auto max-w-4xl rotate-[2deg] rounded-2xl shadow-[0_30px_80px_rgba(7,6,12,0.6)]">
              <MeridianMockup />
            </div>
          </div>
        </div>
        {/* fade the gradient into the page ground under the mockup */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg" aria-hidden="true" />
      </section>

      {/* metric strip */}
      <section className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <dl className="mt-12 flex flex-wrap items-center justify-between gap-x-10 gap-y-4 rounded-2xl border border-border bg-bg-raised px-6 py-5 sm:px-8">
          {[
            ["43/43", "automated tests passing"],
            ["9", "responsive pages"],
            ["4 days", "empty folder → live"],
            ["$0", "infrastructure cost"],
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
        <p className="mx-auto max-w-3xl text-center font-display text-[clamp(1.5rem,3.2vw,2.25rem)] font-semibold leading-snug tracking-tight">
          <span className="text-ink">
            Take the patient platform from wireframes to a live product — in an
            internship timeline.
          </span>{" "}
          <span className="text-ink-faint">
            Account management, the full order-to-delivery workflow, a staff
            portal, tests, and the deployment pipeline: four development days.
          </span>
        </p>
        <p className="mx-auto mt-6 max-w-2xl text-center leading-relaxed text-ink-dim">
          Meridian Medical Associates is developing a drone medication-delivery
          service. The brief wasn&apos;t a prototype that looks finished — it
          was a deployed application a stakeholder can sign up for, order
          through, and track, with the engineering discipline of a
          healthcare-adjacent product from day one.
        </p>
      </section>

      {/* ================= Product experience ================= */}
      <section className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-8">
        <SectionHeading
          title="The"
          accent="patient experience"
          lede="Sign up, pick a plan, order, check out, and watch the delivery move — received, pharmacy verified, drone in flight, delivered."
        />
        <div className="mt-12 grid items-center gap-10 lg:grid-cols-2">
          <div>
            <ul className="space-y-6">
              {[
                ["Nine pages, one brand", "Responsive pages styled to match the company's existing brand — this is their product, not a student template wearing their logo."],
                ["Accounts done properly", "Built on Django auth: hashed passwords, session management, CSRF protection on every form."],
                ["Validation with a reason", "Strict server-side order validation, including a 2,500 g weight cap that matches the delivery drone's real payload limit — the business rule is the physics."],
                ["A tracker that tells the truth", "The Track Order dashboard reflects the real order state; when staff advance the pipeline, the patient's view updates immediately."],
              ].map(([t, b]) => (
                <li key={t} className="flex gap-4">
                  <svg width="18" height="18" viewBox="0 0 14 14" className="mt-1.5 shrink-0" aria-hidden="true">
                    <path d="M2 7h8M7 3.5 10.5 7 7 10.5" stroke="#8b5cf6" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div>
                    <h3 className="font-display text-lg font-bold text-ink">{t}</h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-ink-dim">{b}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <OperationsMockup />
            <p className="mt-4 font-mono text-xs leading-relaxed text-ink-faint">
              The staff side: Django admin customized into &ldquo;Meridian
              Operations&rdquo; — pipeline filters, search by order, patient, or
              Rx ID, and one-click status actions.
            </p>
          </div>
        </div>
      </section>

      {/* ================= Architecture ================= */}
      <section className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-8">
        <SectionHeading
          title="The"
          accent="architecture"
          lede="One well-built monolith, deployed as code: Django on Render, PostgreSQL on Neon, and a pipeline that rebuilds the whole thing on every push."
        />
        <div className="mt-12">
          <div className="overflow-x-auto rounded-3xl border border-border bg-bg-raised p-5 sm:p-8">
            <div className="min-w-[640px]">
              <MeridianArchitectureDiagram />
            </div>
          </div>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {decisions.map((d) => (
            <div
              key={d.title}
              className={`h-full rounded-3xl border p-7 transition-colors sm:p-8 ${
                d.wide ? "md:col-span-2" : ""
              } ${
                d.wide
                  ? "border-accent/30 bg-accent/5"
                  : "border-border bg-bg-raised hover:border-border-strong"
              }`}
            >
              <h3 className={`font-display font-bold text-ink ${d.wide ? "text-2xl" : "text-xl"}`}>
                {d.title}{" "}
                <span className="font-medium text-accent-strong">— {d.tradeoff}</span>
              </h3>
              <p className={`mt-3 max-w-3xl leading-relaxed text-ink-dim ${d.wide ? "text-base" : "text-[15px]"}`}>
                {d.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= Constraints ================= */}
      <section className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-8">
        <SectionHeading
          title="Built under"
          accent="real-world constraints"
          lede="Healthcare-adjacent software earns trust through what it refuses to do."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {constraints.map((c) => (
            <div key={c.title} className="rounded-3xl border border-border bg-bg-raised p-7 sm:p-8">
              <h3 className="font-display text-xl font-bold text-ink">{c.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-dim">{c.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 rounded-2xl border border-accent/25 bg-accent/5 p-5 text-sm leading-relaxed text-ink-dim">
          <span className="font-semibold text-accent-strong">Production hardening:</span>{" "}
          HTTPS redirect, HSTS, and secure cookies are enabled in the deployed
          configuration — and the 43-test suite passed against both the
          development and production settings before every release.
        </p>
      </section>

      {/* ================= Evidence ================= */}
      <section className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-8">
        <SectionHeading
          title="The"
          accent="evidence"
          lede="The repository is public — every claim on this page maps to a test, a management command, or a line in the deployment blueprint."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {/* test suites */}
          <div>
            <div className="h-full rounded-3xl border border-border bg-bg-raised p-7 sm:p-8">
              <h3 className="font-display text-xl font-bold text-ink">
                43 automated tests, three apps
              </h3>
              <div className="mt-6 space-y-5">
                {testSuites.map((s) => (
                  <div key={s.label}>
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="font-mono text-xs text-ink-dim">{s.label}</p>
                      <p className="font-display text-lg font-bold text-accent-strong">{s.count}</p>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-bg-panel">
                      <div className="h-full rounded-full bg-accent" style={{ width: `${s.pct}%` }} />
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-ink-dim">{s.detail}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-[15px] leading-relaxed text-ink-dim">
                Plus a scripted Chromium end-to-end walkthrough of the complete
                patient journey — signup to delivered.
              </p>
            </div>
          </div>
          {/* deployment + demo data */}
          <div>
            <div className="flex h-full flex-col gap-6">
              <div className="rounded-3xl border border-border bg-bg-raised p-7 sm:p-8">
                <h3 className="font-display text-xl font-bold text-ink">
                  Deployment is a file, not a checklist
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-dim">
                  A <span className="font-mono text-sm text-accent-strong">render.yaml</span>{" "}
                  blueprint defines the service; the build installs
                  dependencies, collects and fingerprints static assets, runs
                  migrations, and idempotently bootstraps the admin account.
                  Every push to main redeploys the same way.
                </p>
              </div>
              <div className="flex-1 rounded-3xl border border-border bg-bg-raised p-7 sm:p-8">
                <h3 className="font-display text-xl font-bold text-ink">
                  Demo data as a feature
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-dim">
                  A re-runnable <span className="font-mono text-sm text-accent-strong">seed_demo</span>{" "}
                  management command populates synthetic orders across every
                  pipeline stage, so stakeholder presentations always have a
                  living, mid-flight system to look at — never an empty
                  database.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= Close ================= */}
      <section className="mx-auto w-full max-w-6xl px-5 pb-28 sm:px-8">
        <div
          className="flex flex-wrap items-center justify-between gap-6 rounded-3xl p-9 sm:p-12"
          style={{ background: GRADIENT }}
        >
          <div>
            <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
              Order a delivery, then read the code<span className="text-white/50">.</span>
            </h2>
            <p className="mt-2 max-w-md text-[15px] leading-relaxed text-white/80">
              The live app, the 43-test suite, the deployment blueprint, and the
              day-by-day development log — all public.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-white px-6 py-3 text-[#0f766e] transition-colors hover:bg-white/85"
              >
                Open the live app ↗
              </a>
            )}
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/90 transition-colors hover:text-white"
            >
              GitHub ↗
            </a>
            <Link href="/#contact" className="text-white/90 transition-colors hover:text-white">
              Contact me
            </Link>
            <Link href="/#work" className="text-white/90 transition-colors hover:text-white">
              All projects
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
