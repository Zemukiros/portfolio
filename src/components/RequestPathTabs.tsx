"use client";

import { useState } from "react";

export type PathPanel = {
  id: string;
  label: string;
  title: string;
  diagram: React.ReactNode;
  points: { title: string; body: string }[];
};

/** Tabbed request-path explorer for case studies: one sequence diagram per tab. */
export default function RequestPathTabs({ panels }: { panels: PathPanel[] }) {
  const [active, setActive] = useState(0);

  const onKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (i + (e.key === "ArrowRight" ? 1 : panels.length - 1)) % panels.length;
    setActive(next);
    document.getElementById(`path-tab-${panels[next].id}`)?.focus();
  };

  return (
    <div>
      <div role="tablist" aria-label="Request paths" className="flex flex-wrap gap-2">
        {panels.map((p, i) => (
          <button
            key={p.id}
            type="button"
            role="tab"
            id={`path-tab-${p.id}`}
            aria-selected={i === active}
            aria-controls={`path-panel-${p.id}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => onKey(e, i)}
            className={`rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
              i === active
                ? "bg-accent text-white"
                : "border border-border-strong text-ink-dim hover:border-accent hover:text-ink"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {panels.map((p, i) => (
        <div
          key={p.id}
          role="tabpanel"
          id={`path-panel-${p.id}`}
          aria-labelledby={`path-tab-${p.id}`}
          hidden={i !== active}
          className="mt-6"
        >
          <div className="overflow-x-auto rounded-3xl border border-border bg-bg-raised p-5 sm:p-8">
            <p className="font-display text-xl text-ink">{p.title}</p>
            <div className="mt-4 min-w-[680px]">{p.diagram}</div>
          </div>
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            {p.points.map((pt) => (
              <div key={pt.title} className="rounded-2xl border border-border bg-bg-raised p-6">
                <h4 className="font-display text-base text-ink">{pt.title}</h4>
                <p className="mt-2 text-[14.5px] leading-relaxed text-ink-dim">{pt.body}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
