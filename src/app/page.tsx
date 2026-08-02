import Link from "next/link";
import HeroGraph, { RouteStrip } from "@/components/HeroGraph";
import SocialLinks from "@/components/SocialLinks";
import ProjectShowcase from "@/components/ProjectShowcase";
import ExperienceTabs from "@/components/ExperienceTabs";
import { TechIcon, AwsMark } from "@/components/TechIcon";
import { profile } from "@/data/profile";
import { skillGroups } from "@/data/skills";
import { education, certifications } from "@/data/education";

function SectionHeading({
  title,
  accent,
  lede,
}: {
  title: string;
  accent?: string;
  lede?: string;
}) {
  return (
    <div className="max-w-2xl">
      <h2 className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
        {title}
        {accent && <span className="text-accent-strong"> {accent}</span>}
        <span className="text-accent">.</span>
      </h2>
      {lede && <p className="mt-4 text-lg leading-relaxed text-ink-dim">{lede}</p>}
    </div>
  );
}

export default function Home() {
  return (
    <>
      {/* ================= Hero ================= */}
      <section className="relative overflow-hidden">
        <div
          className="hero-glow left-[-10%] top-[-15%] h-[480px] w-[480px]"
          style={{ background: "rgba(109, 40, 217, 0.28)" }}
          aria-hidden="true"
        />
        <div
          className="hero-glow bottom-[-25%] right-[-5%] h-[420px] w-[420px]"
          style={{ background: "rgba(139, 92, 246, 0.14)" }}
          aria-hidden="true"
        />
        <svg
          className="contour right-0 top-0 hidden xl:block"
          width="360"
          height="420"
          viewBox="0 0 360 420"
          fill="none"
          aria-hidden="true"
        >
          <path d="M356 8C240 30 200 120 262 178s6 168-124 152c-96-12-120 60-70 82" stroke="#8b5cf6" strokeOpacity="0.3" strokeWidth="1.5" />
          <path d="M356 78C264 96 236 168 288 218s4 148-108 134" stroke="#8b5cf6" strokeOpacity="0.16" strokeWidth="1.5" />
        </svg>

        <div className="mx-auto grid min-h-[94svh] w-full max-w-6xl items-center gap-12 px-5 pb-16 pt-32 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6">
          <div>
            <p className="hero-rise hero-rise-1 font-mono text-sm text-accent-strong">
              Hi, I&apos;m
            </p>
            <h1 className="hero-rise hero-rise-2 mt-3 font-display text-[clamp(3rem,8vw,5.75rem)] font-extrabold leading-[0.98] tracking-[-0.03em] text-ink">
              Zemariam
              <br />
              Haftegebriel
              <span className="text-accent">.</span>
            </h1>
            <p className="hero-rise hero-rise-3 mt-6 max-w-xl text-xl leading-relaxed text-ink-dim sm:text-2xl">
              Software engineer crafting{" "}
              <span className="font-semibold text-ink">backend &amp; AI-enabled systems</span>{" "}
              that are built to be proven — tested, benchmarked, shipped.
            </p>
            <div className="hero-rise hero-rise-4 mt-8">
              <SocialLinks />
            </div>
            <div className="hero-rise hero-rise-5 mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/#work"
                className="rounded-xl bg-accent px-7 py-3.5 text-[15px] font-semibold text-white shadow-[0_8px_30px_rgba(139,92,246,0.35)] transition-all hover:bg-accent-deep hover:shadow-[0_8px_30px_rgba(139,92,246,0.5)]"
              >
                View my work
              </Link>
              <Link
                href="/#contact"
                className="rounded-xl border border-border-strong px-7 py-3.5 text-[15px] font-medium text-ink transition-colors hover:border-accent hover:text-accent-strong"
              >
                Let&apos;s talk
              </Link>
            </div>
            <p className="hero-rise hero-rise-5 mt-10 font-mono text-xs tracking-wide text-ink-faint">
              {profile.location} · AWS Certified Solutions Architect · B.S. CS, May 2027
            </p>
            <div className="hero-rise hero-rise-5 mt-10 rounded-2xl border border-border bg-bg-raised/60 p-4 lg:hidden">
              <RouteStrip />
            </div>
          </div>

          <div className="hero-rise hero-rise-3 relative hidden justify-center lg:flex">
            <HeroGraph />
          </div>
        </div>

        <p
          className="pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 rotate-90 font-display text-6xl font-extrabold tracking-tight text-ink/[0.045] xl:block"
          aria-hidden="true"
        >
          ENGINEER
        </p>
      </section>

      {/* ================= About ================= */}
      <section id="about" className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-8">
        <p className="mx-auto max-w-3xl text-center font-display text-[clamp(1.5rem,3.2vw,2.25rem)] font-semibold leading-snug tracking-tight">
          <span className="text-ink">
            I&apos;m a Computer Science student at Bowie State University building
            systems that hold up under proof
          </span>{" "}
          <span className="text-ink-faint">
            — Java and Spring Boot backends, Python services, AI-integrated
            workflows, and cloud architecture designed the AWS way.
          </span>
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {[
            "B.S. Computer Science · GPA 3.8",
            "AWS Solutions Architect – Associate",
            "2 engineering internships",
            "125 automated tests across IntelliRoute",
          ].map((f) => (
            <span
              key={f}
              className="rounded-full border border-border-strong bg-bg-raised px-5 py-2.5 text-sm font-medium text-ink-dim"
            >
              {f}
            </span>
          ))}
        </div>
      </section>

      {/* ================= Skills ================= */}
      <section id="skills" className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-8">
        <SectionHeading
          title="The"
          accent="toolkit"
          lede="The languages, frameworks, and infrastructure I build with — from JVM backends to AI service integration to AWS architecture."
        />
        <div className="mt-12 space-y-10">
          {skillGroups.map((group) => (
            <div key={group.title}>
              <h3 className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-ink-faint">
                {group.title}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-3">
                {group.items.map((tech) => (
                  <li
                    key={tech.name}
                    className="flex items-center gap-2.5 rounded-xl border border-border bg-bg-raised py-2.5 pl-3 pr-4 transition-colors hover:border-border-strong"
                  >
                    {tech.icon === "aws" ? (
                      <AwsMark size={22} />
                    ) : tech.icon ? (
                      <TechIcon slug={tech.icon} size={22} />
                    ) : (
                      <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
                    )}
                    <span className="text-sm font-medium text-ink">{tech.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ================= Projects ================= */}
      <section id="work" className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-8">
        <SectionHeading
          title="Featured"
          accent="work"
          lede="Systems with real architecture behind them — algorithms, services, tests, and pipelines you can open and run."
        />
        <div className="mt-12">
          <ProjectShowcase />
        </div>
      </section>

      {/* ================= Experience ================= */}
      <section id="experience" className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-8">
        <SectionHeading
          title="Where I've"
          accent="shipped"
          lede="Two engineering teams, from a drone medication-delivery platform to production Spring Boot services."
        />
        <div className="mt-12 rounded-3xl border border-border bg-bg-raised p-8 sm:p-10">
          <ExperienceTabs />
        </div>
      </section>

      {/* ================= Education ================= */}
      <section id="education" className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-8">
        <SectionHeading title="Education &" accent="certification" />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {education.map((e) => (
            <div key={e.school} className="rounded-3xl border border-border bg-bg-raised p-8">
              <p className="font-mono text-xs text-ink-faint">{e.dates}</p>
              <h3 className="mt-3 font-display text-xl font-bold text-ink">{e.school}</h3>
              <p className="mt-1.5 text-sm font-medium text-accent-strong">{e.degree}</p>
              {e.detail && <p className="mt-3 text-sm leading-relaxed text-ink-dim">{e.detail}</p>}
              <p className="mt-1 text-sm text-ink-faint">{e.location}</p>
            </div>
          ))}
          {certifications.map((c) => (
            <div
              key={c.name}
              className="flex flex-col justify-between rounded-3xl p-8"
              style={{
                background: "linear-gradient(140deg, #2a1758 0%, #6d28d9 70%, #8b5cf6 110%)",
              }}
            >
              <div>
                <p className="font-mono text-xs text-white/70">Certified</p>
                <h3 className="mt-3 font-display text-xl font-bold leading-snug text-white">
                  {c.name}
                </h3>
              </div>
              <p className="mt-6 text-sm font-medium text-white/85">{c.issuer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= Contact ================= */}
      <section id="contact" className="relative mx-auto w-full max-w-6xl overflow-hidden px-5 py-28 sm:px-8">
        <div
          className="hero-glow left-1/2 top-1/2 h-[380px] w-[560px] -translate-x-1/2 -translate-y-1/2"
          style={{ background: "rgba(109, 40, 217, 0.18)" }}
          aria-hidden="true"
        />
        <div className="relative text-center">
          <h2 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold tracking-tight text-ink">
            Let&apos;s build something<span className="text-accent">.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ink-dim">
            I&apos;m open to software engineering internships and new-grad roles in
            backend, AI, cloud, and full-stack teams. My inbox is the fastest route.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <a
              href={`mailto:${profile.email}`}
              className="rounded-xl bg-accent px-8 py-4 text-[15px] font-semibold text-white shadow-[0_8px_30px_rgba(139,92,246,0.35)] transition-all hover:bg-accent-deep"
            >
              {profile.email}
            </a>
          </div>
          <div className="mt-8 flex justify-center">
            <SocialLinks />
          </div>
        </div>
      </section>
    </>
  );
}
