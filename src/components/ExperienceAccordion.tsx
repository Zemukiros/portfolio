"use client";

import { useState } from "react";
import { experience } from "@/data/experience";

/** One role open at a time; height animates via grid-template-rows (no JS measuring). */
export default function ExperienceAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <ul className="border-t border-border-strong">
      {experience.map((job, i) => {
        const isOpen = openIndex === i;
        const panelId = `experience-panel-${i}`;
        const buttonId = `experience-button-${i}`;
        return (
          <li key={job.company} className="border-b border-border">
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="group flex w-full items-start justify-between gap-6 py-6 text-left"
              >
                <span>
                  <span className="block font-display text-[clamp(1.5rem,2.6vw,2rem)] leading-tight text-ink">
                    {job.role}{" "}
                    <span className="italic text-accent">@ {job.company}</span>
                  </span>
                  <span className="mt-2 block font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">
                    {job.dates} · {job.location}
                  </span>
                </span>
                <span
                  className={`mt-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border-strong text-ink-dim transition-[transform,color,border-color] duration-200 group-hover:border-accent group-hover:text-accent ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 4.5 6 8l4-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={`grid transition-[grid-template-rows] duration-[250ms] ease-out ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden" inert={!isOpen}>
                <div className="pb-8 lg:pl-0 lg:pr-24">
                  <p className="max-w-3xl text-[15px] leading-relaxed text-ink-dim">{job.summary}</p>
                  <ul className="mt-5 max-w-3xl space-y-3">
                    {job.bullets.map((b) => (
                      <li key={b} className="flex gap-3 text-[15px] leading-relaxed text-ink-dim">
                        <span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {job.stack.map((t) => (
                      <span key={t} className="rounded-md border border-border px-2 py-0.5 font-mono text-[10.5px] text-ink-dim">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
