import Link from "next/link";
import type { Project } from "@/data/projects";
import StatusBadge from "./StatusBadge";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group flex h-full flex-col rounded-xl border border-border bg-bg-raised p-6 transition-colors duration-300 hover:border-border-strong">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-display text-xl font-semibold text-ink">
          {project.name}
        </h3>
        <StatusBadge status={project.status} />
      </div>

      <p className="mt-3 text-sm leading-relaxed text-ink-dim">{project.oneLiner}</p>

      {project.headlineMetric && (
        <p className="mt-3 font-mono text-xs text-accent-strong">
          {project.headlineMetric}
        </p>
      )}

      <ul className="mt-4 space-y-2">
        {project.highlights.map((h) => (
          <li key={h} className="flex gap-2 text-sm leading-relaxed text-ink-dim">
            <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
            {h}
          </li>
        ))}
      </ul>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.stack.map((t) => (
          <span
            key={t}
            className="rounded border border-border bg-bg-panel px-2 py-0.5 font-mono text-[11px] text-ink-dim"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="mt-auto flex flex-wrap gap-4 pt-5 text-sm">
        {project.caseStudyPath && (
          <Link
            href={project.caseStudyPath}
            className="font-medium text-accent transition-colors hover:text-accent-strong"
          >
            Case study →
          </Link>
        )}
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink-dim transition-colors hover:text-ink"
          >
            GitHub ↗
          </a>
        )}
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink-dim transition-colors hover:text-ink"
          >
            Live demo ↗
          </a>
        )}
      </div>
    </article>
  );
}
