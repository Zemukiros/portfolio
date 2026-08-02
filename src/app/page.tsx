import Link from "next/link";
import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import ProjectCard from "@/components/ProjectCard";
import { profile, isLinkedInPlaceholder } from "@/data/profile";
import { skillCategories } from "@/data/skills";
import { education, certifications } from "@/data/education";
import { experience } from "@/data/experience";
import { projects, projectFootnote } from "@/data/projects";

export default function Home() {
  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="grid-backdrop relative overflow-hidden">
        <div className="mx-auto flex min-h-[92svh] w-full max-w-5xl flex-col justify-center px-5 pb-16 pt-28 sm:px-8">
          <Reveal>
            <p className="font-mono text-sm text-accent">
              {profile.location} · AWS Certified Solutions Architect – Associate
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-6xl">
              {profile.name.split(" ").slice(0, 2).join(" ")}{" "}
              <span className="text-ink-faint">builds</span> reliable backend{" "}
              <span className="text-accent">&amp;</span> AI-enabled systems.
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-dim">
              {profile.tagline}
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/#projects"
                className="rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-bg transition-colors hover:bg-accent-strong"
              >
                View projects
              </Link>
              <Link
                href="/#contact"
                className="rounded-md border border-border-strong px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent"
              >
                Get in touch
              </Link>
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-ink-dim transition-colors hover:text-ink"
              >
                GitHub ↗
              </a>
            </div>
          </Reveal>
          <Reveal delay={320}>
            <ul className="mt-14 flex flex-wrap gap-x-8 gap-y-3">
              {profile.focusAreas.map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-2 font-mono text-xs text-ink-faint"
                >
                  <span className="h-1 w-1 rounded-full bg-accent" aria-hidden="true" />
                  {f}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ---------- About ---------- */}
      <Section id="about" kicker="01 · About" title="Engineering with evidence">
        <div className="grid gap-10 md:grid-cols-[2fr_1fr]">
          <Reveal className="space-y-5">
            {profile.about.map((p) => (
              <p key={p.slice(0, 24)} className="leading-relaxed text-ink-dim">
                {p}
              </p>
            ))}
          </Reveal>
          <Reveal delay={120}>
            <div className="rounded-xl border border-border bg-bg-raised p-5 font-mono text-xs leading-6 text-ink-dim">
              <p className="text-ink-faint"># quick facts</p>
              <p>
                <span className="text-accent">degree:</span> B.S. Computer Science
              </p>
              <p>
                <span className="text-accent">school:</span> Bowie State University
              </p>
              <p>
                <span className="text-accent">grad:</span> May 2027 · GPA 3.8
              </p>
              <p>
                <span className="text-accent">cert:</span> AWS SAA
              </p>
              <p>
                <span className="text-accent">internships:</span> 2 completed/active
              </p>
              <p>
                <span className="text-accent">core:</span> Java · Python · TS · SQL
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ---------- Skills ---------- */}
      <Section id="skills" kicker="02 · Skills" title="Technical toolkit">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((cat, i) => (
            <Reveal key={cat.title} delay={(i % 3) * 80}>
              <div className="h-full rounded-xl border border-border bg-bg-raised p-5">
                <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-accent">
                  {cat.title}
                </h3>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {cat.skills.map((s) => (
                    <li
                      key={s}
                      className="rounded border border-border bg-bg-panel px-2 py-1 font-mono text-[11px] text-ink-dim"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ---------- Experience ---------- */}
      <Section id="experience" kicker="03 · Experience" title="Where I've shipped">
        <div className="space-y-6">
          {experience.map((job, i) => (
            <Reveal key={job.company} delay={i * 100}>
              <article className="rounded-xl border border-border bg-bg-raised p-6 sm:p-8">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display text-xl font-semibold text-ink">
                    {job.role}{" "}
                    <span className="text-ink-faint">·</span>{" "}
                    <span className="text-accent">{job.company}</span>
                  </h3>
                  <p className="font-mono text-xs text-ink-faint">
                    {job.dates} · {job.location}
                  </p>
                </div>
                <p className="mt-4 leading-relaxed text-ink-dim">{job.summary}</p>
                <ul className="mt-4 space-y-2.5">
                  {job.bullets.map((b) => (
                    <li key={b} className="flex gap-2.5 text-sm leading-relaxed text-ink-dim">
                      <span
                        className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-accent"
                        aria-hidden="true"
                      />
                      {b}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {job.stack.map((t) => (
                    <span
                      key={t}
                      className="rounded border border-border bg-bg-panel px-2 py-0.5 font-mono text-[11px] text-ink-dim"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ---------- Projects ---------- */}
      <Section id="projects" kicker="04 · Projects" title="Built, tested, documented">
        <Reveal>
          <p className="max-w-2xl text-sm leading-relaxed text-ink-dim">
            Every status below is honest: <span className="text-ink">completed</span>{" "}
            means the code, tests, and benchmarks exist and are verifiable on GitHub;{" "}
            <span className="text-ink">planned</span> means it&apos;s on the roadmap and
            not yet built.
          </p>
        </Reveal>
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {projects.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 2) * 100} className={i === 0 ? "lg:col-span-2" : ""}>
              <ProjectCard project={p} />
            </Reveal>
          ))}
        </div>
        <Reveal>
          <p className="mt-6 font-mono text-xs text-ink-faint">{projectFootnote}</p>
        </Reveal>
      </Section>

      {/* ---------- Education & Certifications ---------- */}
      <Section id="education" kicker="05 · Education" title="Education & certifications">
        <div className="grid gap-4 md:grid-cols-2">
          {education.map((e, i) => (
            <Reveal key={e.school} delay={i * 80}>
              <div className="h-full rounded-xl border border-border bg-bg-raised p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display text-lg font-semibold text-ink">
                    {e.school}
                  </h3>
                  <p className="font-mono text-xs text-ink-faint">{e.dates}</p>
                </div>
                <p className="mt-1 text-sm text-accent">{e.degree}</p>
                {e.detail && <p className="mt-2 text-sm text-ink-dim">{e.detail}</p>}
                <p className="mt-1 text-sm text-ink-faint">{e.location}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-4">
          {certifications.map((c) => (
            <Reveal key={c.name}>
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-accent/30 bg-accent/5 p-6">
                <div>
                  <h3 className="font-display text-lg font-semibold text-ink">
                    {c.name}
                  </h3>
                  <p className="mt-1 text-sm text-ink-dim">{c.issuer}</p>
                </div>
                {c.verifyUrl && (
                  <a
                    href={c.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-accent hover:text-accent-strong"
                  >
                    Verify ↗
                  </a>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ---------- Contact ---------- */}
      <Section id="contact" kicker="06 · Contact" title="Let's build something">
        <Reveal>
          <div className="rounded-xl border border-border bg-bg-raised p-8 sm:p-10">
            <p className="max-w-xl leading-relaxed text-ink-dim">
              I&apos;m open to software engineering internships and new-grad
              opportunities in backend, AI, cloud, and full-stack roles. The
              fastest way to reach me is email.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <a
                href={`mailto:${profile.email}`}
                className="rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-bg transition-colors hover:bg-accent-strong"
              >
                {profile.email}
              </a>
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-border-strong px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent"
              >
                GitHub ↗
              </a>
              {isLinkedInPlaceholder() ? (
                <span
                  className="rounded-md border border-border px-5 py-2.5 text-sm text-ink-faint"
                  title="LinkedIn link coming soon"
                >
                  LinkedIn — coming soon
                </span>
              ) : (
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md border border-border-strong px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent"
                >
                  LinkedIn ↗
                </a>
              )}
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
