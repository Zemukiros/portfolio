import Link from "next/link";
import type { Project } from "@/data/projects";

const primary =
  "inline-flex items-center rounded-full bg-accent-deep px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent";
const ghost =
  "inline-flex items-center rounded-full border border-border-strong px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent-strong";
const soon =
  "inline-flex items-center rounded-full border border-dashed border-border-strong px-4 py-2 text-sm text-ink-faint";

/**
 * The project action set. Behavior is fixed (carried over from the carousel):
 * Case study → caseStudyPath · GitHub → github · Live site / Live demo → liveUrl ·
 * Demo / View demo → demoUrl · Simulator → simulatorPath when nothing is deployed.
 * Missing links render a visible "· soon" slot instead of disappearing.
 */
export default function ProjectLinks({ p }: { p: Project }) {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {p.caseStudyPath ? (
        <Link href={p.caseStudyPath} className={primary}>
          Case study
        </Link>
      ) : (
        <span className={soon}>Case study · soon</span>
      )}
      {p.liveUrl ? (
        <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className={ghost}>
          {p.demoUrl ? "Live site ↗" : "Live demo ↗"}
        </a>
      ) : p.demoUrl ? null : p.simulatorPath ? (
        <Link href={p.simulatorPath} className={ghost}>
          Simulator →
        </Link>
      ) : (
        <span className={soon}>Live demo · soon</span>
      )}
      {p.demoUrl && (
        <a href={p.demoUrl} target="_blank" rel="noopener noreferrer" className={ghost}>
          {p.liveUrl ? "Demo ↗" : "View demo ↗"}
        </a>
      )}
      {p.github ? (
        <a href={p.github} target="_blank" rel="noopener noreferrer" className={ghost}>
          GitHub ↗
        </a>
      ) : (
        <span className={soon}>GitHub · soon</span>
      )}
    </div>
  );
}
