"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { profile } from "@/data/profile";

/**
 * Full-viewport framed hero. On scroll the frame insets (scale + radius) while the page
 * rises over it. Progress is written to a CSS variable; reduced motion pins it at 0.
 * The artwork is an authored placeholder until a hero image is approved (DESIGN.md → Imagery).
 */
export default function EditorialHero() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const p = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.9)));
      el.style.setProperty("--hero-p", p.toFixed(3));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const [first, ...rest] = profile.shortName.split(" ");

  return (
    <section ref={ref} className="hero-frame-wrap relative h-[100svh] min-h-[560px] p-0" aria-labelledby="hero-title">
      <div className="hero-frame absolute inset-0 overflow-hidden">
        <FieldArtwork />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/10 via-bg/0 to-bg/30" aria-hidden="true" />

        <div className="relative flex h-full flex-col items-center justify-center px-5 text-center">
          <p className="hero-rise hero-rise-1 rounded-full border border-ink/15 bg-bg/60 px-4 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-dim backdrop-blur-sm">
            Backend · AI-enabled systems · Cloud
          </p>
          <h1
            id="hero-title"
            className="hero-rise hero-rise-2 mt-6 font-display text-[clamp(3rem,7vw,5.5rem)] leading-[0.95] tracking-[-0.025em] text-ink"
          >
            Hi, I&apos;m {first}
            <br />
            <span className="italic text-accent">{rest.join(" ")}.</span>
          </h1>
          <p className="hero-rise hero-rise-3 mt-6 max-w-xl text-[15px] leading-relaxed text-ink-dim sm:text-base">
            {profile.tagline}
          </p>
          <nav aria-label="Jump to" className="hero-rise hero-rise-4 mt-8 flex flex-wrap justify-center gap-2.5">
            {[
              { href: "/#about", label: "About" },
              { href: "/#work", label: "Work" },
              { href: "/#contact", label: "Contact" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-full border border-ink/15 bg-bg/70 px-5 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ink backdrop-blur-sm transition-colors hover:border-accent hover:text-accent-strong"
              >
                {l.label} <span aria-hidden="true">↓</span>
              </Link>
            ))}
          </nav>
          <p className="hero-rise hero-rise-5 absolute bottom-8 font-mono text-[11px] tracking-[0.12em] text-ink-faint">
            {profile.location} · B.S. Computer Science, May 2027
          </p>
        </div>
      </div>
    </section>
  );
}

/** Authored field: layered contour hills, a low sun, and one route threading the valley. */
function FieldArtwork() {
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <rect width="1440" height="900" fill="#ebe8dc" />
      <circle cx="1080" cy="300" r="120" fill="#e3dfcf" />
      <path d="M0 520C180 470 330 455 520 485s380 30 560-15 270-35 360-20V900H0Z" fill="#dcd9c6" />
      <path d="M0 600c210-50 420-40 620 0s420 45 600 5 170-30 220-20V900H0Z" fill="#cdd3bd" />
      <path d="M0 690c260-45 470-30 700 15s430 30 560-5 140-20 180-15V900H0Z" fill="#b5c2a3" />
      <path d="M0 780c240-35 520-20 760 20s460 25 680-15V900H0Z" fill="#9aae89" />
      <g fill="none" stroke="#18211a" strokeOpacity="0.08" strokeWidth="1">
        <path d="M0 640c230-40 440-35 660 5s430 40 780-10" />
        <path d="M0 730c250-40 490-25 720 15s450 30 720-10" />
        <path d="M0 830c260-30 520-15 760 20s470 20 680-10" />
      </g>
      <path
        className="hero-route"
        d="M-20 860C220 800 300 720 480 712s300 40 470 6 250-120 520-150"
        fill="none"
        stroke="#2f6a3b"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="1 9"
      />
      <g fill="#2f6a3b">
        <circle cx="480" cy="712" r="5" />
        <circle cx="950" cy="718" r="5" />
        <circle cx="1440" cy="568" r="5" />
      </g>
    </svg>
  );
}
