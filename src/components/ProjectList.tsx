"use client";

import { useRef, useState } from "react";
import { projects, projectFootnote, statusStyles, type Project } from "@/data/projects";
import ProjectLinks from "./ProjectLinks";
import {
  IntelliRouteMockup,
  MeridianMockup,
  MiniS3Mockup,
  RhythmiqMockup,
  QueryGuardMockup,
} from "./ProjectMockups";

/** Display order and thumbnail per project. IntelliRoute is the featured project. */
const ROWS: { slug: string; thumb: React.ReactNode; featured?: boolean }[] = [
  { slug: "intelliroute", thumb: <IntelliRouteMockup />, featured: true },
  { slug: "mini-s3", thumb: <MiniS3Mockup /> },
  { slug: "meridian", thumb: <MeridianMockup /> },
  { slug: "queryguard", thumb: <QueryGuardMockup /> },
  { slug: "rhythmiq", thumb: <RhythmiqMockup /> },
];

function StatusBadge({ status }: { status: Project["status"] }) {
  const s = statusStyles[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 font-mono text-[11px] ${s.className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {s.label}
    </span>
  );
}

export default function ProjectList() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const open = openSlug ? projects.find((p) => p.slug === openSlug) : undefined;
  const openRow = open ? ROWS.find((r) => r.slug === open.slug) : undefined;

  const show = (slug: string) => {
    setOpenSlug(slug);
    dialogRef.current?.showModal();
  };
  const close = () => dialogRef.current?.close();

  return (
    <div>
      {/* column heads (md+) */}
      <div
        className="hidden grid-cols-[120px_1fr_220px_130px_32px] gap-6 border-b border-border-strong pb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-faint md:grid"
        aria-hidden="true"
      >
        <span>Project</span>
        <span>Details</span>
        <span>Stack</span>
        <span>Status</span>
        <span />
      </div>

      <ul>
        {ROWS.map((row) => {
          const p = projects.find((x) => x.slug === row.slug)!;
          return (
            <li key={p.slug} className="border-b border-border">
              <button
                type="button"
                onClick={() => show(p.slug)}
                aria-haspopup="dialog"
                className="group grid w-full grid-cols-[88px_1fr_24px] items-center gap-4 px-2 py-5 text-left transition-colors hover:bg-bg-raised focus-visible:bg-bg-raised md:grid-cols-[120px_1fr_220px_130px_32px] md:gap-6"
              >
                <span className="block aspect-[16/10] overflow-hidden rounded-xl border border-border bg-[#0b0916]">
                  <span className="pointer-events-none block w-[250%] origin-top-left scale-[0.4]">{row.thumb}</span>
                </span>
                <span className="min-w-0">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-2xl leading-tight text-ink transition-colors group-hover:text-accent-strong">
                      {p.name}
                    </span>
                    {row.featured && (
                      <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-accent-strong">
                        Featured
                      </span>
                    )}
                  </span>
                  <span className="mt-1 line-clamp-2 block text-sm leading-relaxed text-ink-dim">{p.oneLiner}</span>
                  <span className="mt-2 block md:hidden">
                    <StatusBadge status={p.status} />
                  </span>
                </span>
                <span className="hidden flex-wrap gap-1.5 md:flex">
                  {p.stack.slice(0, 4).map((t) => (
                    <span key={t} className="rounded-md border border-border px-2 py-0.5 font-mono text-[10.5px] text-ink-dim">
                      {t}
                    </span>
                  ))}
                </span>
                <span className="hidden md:block">
                  <StatusBadge status={p.status} />
                </span>
                <span
                  className="flex h-8 w-8 items-center justify-center justify-self-end rounded-full border border-border-strong text-ink-dim transition-[transform,color,border-color] duration-200 group-hover:-rotate-45 group-hover:border-accent group-hover:text-accent"
                  aria-hidden="true"
                >
                  →
                </span>
                <span className="sr-only">Open details for {p.name}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <p className="mt-5 text-sm text-ink-faint">{projectFootnote}</p>

      <dialog
        ref={dialogRef}
        onClose={() => setOpenSlug(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        aria-labelledby="project-dialog-title"
        className="project-dialog m-auto w-[min(760px,calc(100vw-2rem))] max-h-[calc(100svh-2rem)] overflow-y-auto rounded-[20px] border border-border bg-bg p-0 text-ink shadow-[0_12px_40px_rgba(24,33,26,0.12)]"
      >
        {open && (
          <div className="p-7 sm:p-10">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge status={open.status} />
                {openRow?.featured && (
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-strong">Featured</span>
                )}
              </div>
              <button
                type="button"
                onClick={close}
                className="rounded-full border border-border-strong px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-dim transition-colors hover:border-accent hover:text-accent-strong"
              >
                ✕ Close
              </button>
            </div>

            <h3 id="project-dialog-title" className="mt-6 font-display text-[clamp(2rem,4vw,3rem)] leading-none tracking-[-0.02em]">
              {open.name}
              <span className="text-accent">.</span>
            </h3>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink-dim">{open.oneLiner}</p>
            {open.headlineMetric && (
              <p className="mt-4 font-mono text-xs text-accent-strong">{open.headlineMetric}</p>
            )}

            <div className="mt-7">
              <ProjectLinks p={open} />
            </div>

            {openRow && (
              <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-[#0b0916]">{openRow.thumb}</div>
            )}

            <h4 className="mt-9 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-faint">
              {open.status === "Planned" ? "What it will do" : "Highlights"}
            </h4>
            <ul className="mt-4 space-y-3">
              {open.highlights.map((h) => (
                <li key={h} className="flex gap-3 text-[15px] leading-relaxed text-ink-dim">
                  <span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                  {h}
                </li>
              ))}
            </ul>

            <h4 className="mt-9 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-faint">Stack</h4>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {open.stack.map((t) => (
                <span key={t} className="rounded-md border border-border px-2 py-0.5 font-mono text-[11px] text-ink-dim">
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
