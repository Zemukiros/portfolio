"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { profile } from "@/data/profile";

const LINKS = [
  { href: "/#about", label: "About" },
  { href: "/#work", label: "Work" },
  { href: "/#experience", label: "Experience" },
  { href: "/#stack", label: "Stack" },
];

/** Bottom-center pill nav. On the home page it appears once the hero is mostly scrolled past. */
export default function FloatingNav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [pastHero, setPastHero] = useState(false);
  const [talkOpen, setTalkOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  useEffect(() => {
    if (!talkOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setTalkOpen(false);
    const onPointer = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setTalkOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [talkOpen]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  const shown = !isHome || pastHero || talkOpen;

  return (
    <div
      ref={wrapRef}
      className={`fixed inset-x-0 bottom-5 z-50 flex justify-center px-4 transition-[opacity,transform] duration-300 ${
        shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <div className="relative">
        {talkOpen && (
          <div
            id="lets-talk"
            role="dialog"
            aria-label="Contact options"
            className="pop-in absolute bottom-[calc(100%+12px)] left-1/2 w-[min(340px,calc(100vw-2rem))] -translate-x-1/2 rounded-[20px] border border-border bg-bg p-5 shadow-[0_12px_40px_rgba(24,33,26,0.12)]"
          >
            <p className="font-display text-2xl leading-none text-ink">
              Let&apos;s talk<span className="text-accent">.</span>
            </p>
            <p className="mt-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-faint">
              Internships · new-grad roles
            </p>
            <div className="mt-4 grid gap-2">
              <button
                type="button"
                onClick={copyEmail}
                className="flex items-center justify-between rounded-xl border border-border bg-bg-raised px-4 py-3 text-left text-sm text-ink transition-colors hover:border-accent"
              >
                <span>
                  <span className="block font-medium">{copied ? "Copied to clipboard" : "Copy email"}</span>
                  <span className="block font-mono text-[11px] text-ink-faint">{profile.email}</span>
                </span>
                <span aria-hidden="true" className="text-accent">
                  {copied ? "✓" : "⧉"}
                </span>
              </button>
              <div className="grid grid-cols-3 gap-2">
                <a
                  href={`mailto:${profile.email}`}
                  className="rounded-xl border border-border px-3 py-2.5 text-center text-sm text-ink transition-colors hover:border-accent hover:text-accent-strong"
                >
                  Email
                </a>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-border px-3 py-2.5 text-center text-sm text-ink transition-colors hover:border-accent hover:text-accent-strong"
                >
                  LinkedIn
                </a>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-border px-3 py-2.5 text-center text-sm text-ink transition-colors hover:border-accent hover:text-accent-strong"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        )}

        <nav
          aria-label="Sections"
          className="flex items-center gap-1 rounded-full border border-border bg-bg-raised/90 p-1.5 shadow-[0_12px_40px_rgba(24,33,26,0.12)] backdrop-blur-md"
        >
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              tabIndex={shown ? 0 : -1}
              className="hidden rounded-full px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-dim transition-colors hover:bg-bg-panel hover:text-ink sm:block"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/#work"
            tabIndex={shown ? 0 : -1}
            className="rounded-full px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-dim transition-colors hover:bg-bg-panel hover:text-ink sm:hidden"
          >
            Work
          </Link>
          <button
            type="button"
            tabIndex={shown ? 0 : -1}
            aria-expanded={talkOpen}
            aria-controls="lets-talk"
            onClick={() => setTalkOpen((o) => !o)}
            className="rounded-full bg-accent-deep px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-white transition-colors hover:bg-accent"
          >
            Let&apos;s talk
          </button>
        </nav>
      </div>
    </div>
  );
}
