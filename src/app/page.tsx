import Link from "next/link";
import EditorialHero from "@/components/EditorialHero";
import SectionHeading from "@/components/SectionHeading";
import ProjectList from "@/components/ProjectList";
import ExperienceAccordion from "@/components/ExperienceAccordion";
import GithubActivity from "@/components/GithubActivity";
import HashRingFigure from "@/components/HashRingFigure";
import LocalTime from "@/components/LocalTime";
import { TechIcon, AwsMark } from "@/components/TechIcon";
import { profile } from "@/data/profile";
import { skillGroups } from "@/data/skills";
import { education, certifications } from "@/data/education";
import { capabilities } from "@/data/capabilities";
import { getGithubActivity } from "@/lib/github";

const SECTION = "mx-auto w-full max-w-6xl px-5 py-24 sm:px-8 sm:py-32";

export default async function Home() {
  const github = await getGithubActivity(profile.githubUser);

  const landmarks = [
    ...education.map((e) => ({
      title: e.degree,
      meta: [e.school, e.detail].filter(Boolean).join(" · "),
      when: e.dates,
    })),
    ...certifications.map((c) => ({ title: c.name, meta: c.issuer, when: "Certified" })),
  ];

  return (
    <>
      <EditorialHero />

      <div className="relative z-10 bg-bg">
        {/* ================= 01 About ================= */}
        <section id="about" className={SECTION}>
          <SectionHeading
            index="01"
            label="About"
            title="Systems that hold up"
            accent="under proof"
            lede="Tested, benchmarked, documented, and shipped — the evidence comes with the code."
          />

          <div className="mt-14 grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <figure className="self-start">
              <div className="rounded-[20px] border border-border bg-bg-raised p-6">
                <HashRingFigure className="mx-auto w-full max-w-[420px]" />
              </div>
              <figcaption className="mt-3 font-mono text-[11px] leading-relaxed text-ink-faint">
                Mini-S3&apos;s consistent-hash ring: a key lands on the first three nodes clockwise.
                Simplified to one virtual node per server (the repo uses 200).
              </figcaption>
            </figure>

            <div>
              <div className="space-y-5 text-[15px] leading-relaxed text-ink-dim sm:text-base">
                <p>{profile.about[0]}</p>
                <p>{profile.about[2]}</p>
              </div>

              <h3 className="mt-12 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-faint">Landmarks</h3>
              <ul className="mt-3 border-t border-border-strong">
                {landmarks.map((l) => (
                  <li key={l.title} className="grid gap-1 border-b border-border py-4 sm:grid-cols-[1fr_auto] sm:gap-6">
                    <div>
                      <p className="font-display text-xl leading-tight text-ink">{l.title}</p>
                      <p className="mt-1 text-sm text-ink-dim">{l.meta}</p>
                    </div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-faint sm:pt-1.5">{l.when}</p>
                  </li>
                ))}
              </ul>

              <dl className="mt-8 grid grid-cols-2 gap-6">
                <div>
                  <dt className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-faint">Location</dt>
                  <dd className="mt-1.5 text-sm text-ink">{profile.location}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-faint">Local time</dt>
                  <dd className="mt-1.5">
                    <LocalTime timeZone="America/New_York" label="ET" />
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* ================= 02 Work ================= */}
        <section id="work" className={SECTION}>
          <SectionHeading
            index="02"
            label="Selected work"
            title="Real architecture,"
            accent="open to inspect"
            lede="Systems with real architecture behind them — algorithms, services, tests, and pipelines you can open and run."
          />
          <div className="mt-14">
            <ProjectList />
          </div>
        </section>

        {/* ================= 03 Experience ================= */}
        <section id="experience" className={SECTION}>
          <SectionHeading
            index="03"
            label="Experience"
            title="Two teams,"
            accent="shipped work"
            lede="Two engineering teams, from a drone medication-delivery platform to production Spring Boot services."
          />
          <div className="mt-14">
            <ExperienceAccordion />
          </div>
        </section>

        {/* ================= 04 Stack ================= */}
        <section id="stack" className={SECTION}>
          <SectionHeading
            index="04"
            label="Stack"
            title="The tools"
            accent="I build with"
            lede="The languages, frameworks, and infrastructure I build with — from JVM backends to AI service integration to AWS architecture."
          />
          <div className="mt-14 grid gap-5 md:grid-cols-2">
            {skillGroups.map((group, i) => (
              <div key={group.title} className="rounded-2xl border border-border p-7">
                <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-faint">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 font-display text-2xl text-ink">{group.title}</h3>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {group.items.map((tech) => (
                    <li
                      key={tech.name}
                      className="flex items-center gap-2 rounded-lg border border-border bg-bg-raised py-1.5 pl-2 pr-3 text-[13px] text-ink"
                    >
                      {tech.icon === "aws" ? (
                        <AwsMark size={16} />
                      ) : tech.icon ? (
                        <TechIcon slug={tech.icon} size={16} noLift />
                      ) : (
                        <span className="mx-[5px] h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                      )}
                      {tech.name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ================= 05 GitHub ================= */}
        {github && (
          <section id="github" className={SECTION}>
            <SectionHeading
              index="05"
              label="GitHub"
              title="Building"
              accent="in public"
              lede="Pulled from my public GitHub profile when the site is built — no numbers typed by hand."
            />
            <div className="mt-14">
              <GithubActivity data={github} profileUrl={profile.github} />
            </div>
          </section>
        )}

        {/* ================= 06 Capabilities ================= */}
        <section id="capabilities" className={SECTION}>
          <SectionHeading
            index={github ? "06" : "05"}
            label="Capabilities"
            title="What I can"
            accent="build for your team"
            lede="Each capability points at a repository you can open, not a buzzword."
          />
          <ol className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((c, i) => (
              <li key={c.title} className="flex flex-col bg-bg p-7">
                <span className="font-mono text-[11px] text-accent-strong">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-4 font-display text-2xl leading-tight text-ink">{c.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-dim">{c.detail}</p>
                <p className="mt-auto pt-5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-faint">
                  {c.evidence}
                </p>
              </li>
            ))}
          </ol>
        </section>

        {/* ================= Contact ================= */}
        <section id="contact" className={`${SECTION} pb-36`}>
          <div className="grid gap-14 border-t border-border-strong pt-14 lg:grid-cols-[1.5fr_1fr]">
            <div>
              <h2 className="font-display text-[clamp(2.5rem,6vw,4.75rem)] leading-[0.95] tracking-[-0.025em] text-ink">
                Open to internships
                <br />
                <span className="text-accent">&amp; new-grad roles.</span>
              </h2>
              <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-ink-dim sm:text-base">
                I&apos;m open to software engineering internships and new-grad roles in backend, AI,
                cloud, and full-stack teams. My inbox is the fastest route.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href={`mailto:${profile.email}`}
                  className="rounded-full bg-accent-deep px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent"
                >
                  {profile.email}
                </a>
                <span
                  className="rounded-full border border-dashed border-border-strong px-6 py-3 text-sm text-ink-faint"
                  title="Résumé download is being updated"
                >
                  Download CV · soon
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-faint">Sitemap</p>
                <ul className="mt-4 space-y-2.5 text-sm">
                  {[
                    ["About", "/#about"],
                    ["Work", "/#work"],
                    ["Experience", "/#experience"],
                    ["Stack", "/#stack"],
                    ["Capabilities", "/#capabilities"],
                  ].map(([label, href]) => (
                    <li key={href}>
                      <Link href={href} className="text-ink-dim transition-colors hover:text-accent-strong">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-faint">Elsewhere</p>
                <ul className="mt-4 space-y-2.5 text-sm">
                  <li>
                    <a href={profile.github} target="_blank" rel="noopener noreferrer" className="text-ink-dim transition-colors hover:text-accent-strong">
                      GitHub ↗
                    </a>
                  </li>
                  <li>
                    <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-ink-dim transition-colors hover:text-accent-strong">
                      LinkedIn ↗
                    </a>
                  </li>
                  <li>
                    <a href={`mailto:${profile.email}`} className="text-ink-dim transition-colors hover:text-accent-strong">
                      Email
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
