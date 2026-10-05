import Link from "next/link";
import { profile } from "@/data/profile";

/** Quiet top bar that sits over the first section of every page (not fixed). */
export default function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <Link
          href="/"
          className="font-display text-xl leading-none text-ink transition-colors hover:text-accent-strong"
        >
          {profile.shortName.split(" ")[0]}
          <span className="text-accent">.</span>
        </Link>
        <a
          href={profile.github}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-ink/15 bg-bg/60 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-dim backdrop-blur-sm transition-colors hover:border-accent hover:text-accent-strong"
        >
          GitHub ↗
        </a>
      </div>
    </header>
  );
}
