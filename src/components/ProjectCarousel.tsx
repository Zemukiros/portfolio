"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { projects, projectFootnote, statusStyles } from "@/data/projects";
import { TechIcon } from "./TechIcon";
import {
  IntelliRouteMockup,
  RhythmiqMockup,
  QueryGuardMockup,
} from "./ProjectMockups";

type CardSpec = {
  slug: string;
  gradient: string;
  floatingIcons: string[];
  mockup: React.ReactNode;
  featured?: boolean;
};

const CARDS: CardSpec[] = [
  {
    slug: "intelliroute",
    gradient: "linear-gradient(135deg, #37167f 0%, #6d28d9 55%, #8b5cf6 115%)",
    floatingIcons: ["siOpenjdk", "siSpringboot", "siFastapi"],
    mockup: <IntelliRouteMockup />,
    featured: true,
  },
  {
    slug: "rhythmiq",
    gradient: "linear-gradient(135deg, #4a1268 0%, #86198f 60%, #d946ef 130%)",
    floatingIcons: ["siSpringboot", "siPostgresql", "siNextdotjs"],
    mockup: <RhythmiqMockup />,
  },
  {
    slug: "queryguard",
    gradient: "linear-gradient(135deg, #1e1b5e 0%, #4338ca 60%, #818cf8 130%)",
    floatingIcons: ["siPython", "siFastapi", "siPostgresql"],
    mockup: <QueryGuardMockup />,
  },
];

function StatusChip({ status }: { status: (typeof projects)[number]["status"] }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 font-mono text-[11px] font-medium text-white backdrop-blur-sm">
      <span className="h-1.5 w-1.5 rounded-full bg-white/80" aria-hidden="true" />
      {statusStyles[status].label}
    </span>
  );
}

export default function ProjectCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        // At scroll saturation the last card counts as active even if a
        // nearer snap point exists (wide viewports show several cards).
        if (track.scrollLeft >= track.scrollWidth - track.clientWidth - 2) {
          setActive(track.children.length - 1);
          return;
        }
        const cards = Array.from(track.children) as HTMLElement[];
        let best = 0;
        let bestDist = Infinity;
        cards.forEach((c, i) => {
          const d = Math.abs(c.offsetLeft - track.scrollLeft - parseFloat(getComputedStyle(track).paddingLeft));
          if (d < bestDist) {
            bestDist = d;
            best = i;
          }
        });
        setActive(best);
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const scrollTo = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const i = Math.max(0, Math.min(CARDS.length - 1, index));
    const card = track.children[i] as HTMLElement | undefined;
    if (!card) return;
    track.scrollTo({
      left: card.offsetLeft - parseFloat(getComputedStyle(track).paddingLeft),
      behavior: "smooth",
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5" role="tablist" aria-label="Project position">
          {CARDS.map((c, i) => (
            <button
              key={c.slug}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Go to project ${i + 1} of ${CARDS.length}`}
              onClick={() => scrollTo(i)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                i === active ? "w-8 bg-accent" : "w-2.5 bg-border-strong hover:bg-ink-faint"
              }`}
            />
          ))}
          <span className="ml-2 font-mono text-xs text-ink-faint">
            {active + 1} / {CARDS.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {[
            { dir: -1 as const, label: "Previous project", d: "M15 6l-6 6 6 6", disabled: active === 0 },
            { dir: 1 as const, label: "Next project", d: "M9 6l6 6-6 6", disabled: active === CARDS.length - 1 },
          ].map((b) => (
            <button
              key={b.label}
              type="button"
              aria-label={b.label}
              disabled={b.disabled}
              onClick={() => scrollTo(active + b.dir)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border-strong text-ink-dim transition-colors hover:border-accent hover:text-accent-strong disabled:cursor-default disabled:opacity-35 disabled:hover:border-border-strong disabled:hover:text-ink-dim"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d={b.d} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      <div
        ref={trackRef}
        className="carousel relative -mx-5 mt-6 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-px-5 px-5 pb-4 sm:-mx-8 sm:scroll-px-8 sm:px-8"
        role="region"
        aria-label="Project showcase"
      >
        {CARDS.map((card) => {
          const p = projects.find((x) => x.slug === card.slug)!;
          return (
            <article
              key={p.slug}
              className={`group relative flex shrink-0 snap-start flex-col overflow-hidden rounded-3xl transition-transform duration-300 hover:-translate-y-1.5 ${
                card.featured
                  ? "w-[88vw] max-w-[860px]"
                  : "w-[85vw] max-w-[560px]"
              }`}
              style={{ background: card.gradient }}
            >
              {/* header row */}
              <div className="flex flex-wrap items-start justify-between gap-3 p-7 pb-2 sm:p-8 sm:pb-2">
                <div>
                  <h3 className="font-display text-3xl font-bold text-white">{p.name}</h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-white/80">
                    {p.oneLiner}
                  </p>
                  {p.headlineMetric && (
                    <p className="mt-3 font-mono text-xs text-white/70">{p.headlineMetric}</p>
                  )}
                </div>
                {card.featured && (
                  <div className="flex flex-col items-end gap-2">
                    <span className="rounded-full bg-white px-3 py-1 font-mono text-[11px] font-semibold text-accent-deep">
                      Featured
                    </span>
                    <StatusChip status={p.status} />
                  </div>
                )}
              </div>

              {/* floating tech marks */}
              <div className="pointer-events-none absolute left-6 top-1/2 hidden flex-col gap-4 opacity-90 lg:flex" aria-hidden="true">
                {card.floatingIcons.map((slug, i) => (
                  <span
                    key={slug}
                    className="float-bob flex h-11 w-11 items-center justify-center rounded-full bg-white/90 shadow-lg"
                    style={{ animationDelay: `${i * 0.9}s` }}
                  >
                    <TechIcon slug={slug} size={22} noLift />
                  </span>
                ))}
              </div>

              {/* tilted mockup */}
              <div className="mt-2 flex justify-end pl-16 pr-0 sm:pl-24">
                <div className="w-[92%] origin-bottom-left rotate-[5deg] rounded-2xl shadow-[0_24px_60px_rgba(7,6,12,0.55)] transition-transform duration-500 group-hover:rotate-[6.5deg] group-hover:scale-[1.015]">
                  {card.mockup}
                </div>
              </div>

              {/* footer bar */}
              <div className="mt-auto flex flex-wrap items-center justify-between gap-4 bg-[#07060c]/45 px-7 py-5 backdrop-blur-sm sm:px-8">
                <div className="flex flex-wrap gap-1.5">
                  {p.stack.slice(0, 5).map((t) => (
                    <span key={t} className="rounded-full bg-white/12 px-2.5 py-1 font-mono text-[10.5px] text-white/85">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                  {p.caseStudyPath ? (
                    <Link
                      href={p.caseStudyPath}
                      className="rounded-lg bg-white px-4 py-2 text-accent-deep transition-colors hover:bg-white/85"
                    >
                      Case study
                    </Link>
                  ) : (
                    <span className="rounded-lg border border-white/25 px-4 py-2 text-white/75">
                      Case study · soon
                    </span>
                  )}
                  {p.github ? (
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/90 transition-colors hover:text-white"
                    >
                      GitHub ↗
                    </a>
                  ) : (
                    <span className="text-white/75">GitHub · soon</span>
                  )}
                  {p.liveUrl ? (
                    <a
                      href={p.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/90 transition-colors hover:text-white"
                    >
                      Live demo ↗
                    </a>
                  ) : (
                    <span className="text-white/75">Live demo · soon</span>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <p className="mt-4 text-sm text-ink-faint">{projectFootnote}</p>
    </div>
  );
}
