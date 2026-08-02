"use client";

import { useState } from "react";
import { experience } from "@/data/experience";

export default function ExperienceTabs() {
  const [active, setActive] = useState(0);
  const job = experience[active];

  return (
    <div>
      <div role="tablist" aria-label="Employers" className="flex flex-wrap gap-2">
        {experience.map((e, i) => (
          <button
            key={e.company}
            role="tab"
            id={`exp-tab-${i}`}
            aria-selected={i === active}
            aria-controls={`exp-panel-${i}`}
            onClick={() => setActive(i)}
            className={`rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
              i === active
                ? "bg-accent text-white"
                : "border border-border-strong text-ink-dim hover:border-accent hover:text-ink"
            }`}
          >
            {e.company}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`exp-panel-${active}`}
        aria-labelledby={`exp-tab-${active}`}
        className="mt-8 grid gap-8 lg:grid-cols-[1fr_260px]"
      >
        <div>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="font-display text-2xl font-bold text-ink">{job.role}</h3>
            <p className="font-mono text-xs text-ink-faint">
              {job.dates} · {job.location}
            </p>
          </div>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-dim">{job.summary}</p>
          <ul className="mt-5 space-y-3">
            {job.bullets.map((b) => (
              <li key={b} className="flex gap-3 text-[15px] leading-relaxed text-ink-dim">
                <svg width="14" height="14" viewBox="0 0 14 14" className="mt-1.5 shrink-0" aria-hidden="true">
                  <path d="M2 7h8M7 3.5 10.5 7 7 10.5" stroke="#8b5cf6" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {b}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-2">
            {job.stack.map((t) => (
              <span key={t} className="rounded-full border border-border bg-bg-panel px-3 py-1 text-xs text-ink-dim">
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="hidden flex-col justify-between rounded-2xl border border-border bg-bg-panel p-6 lg:flex">
          {active === 0 ? (
            <svg viewBox="0 0 212 190" aria-hidden="true" className="h-auto w-full">
              {/* drone */}
              <g stroke="#a78bfa" strokeWidth="2" fill="none" strokeLinecap="round">
                <circle cx="66" cy="38" r="10" />
                <circle cx="146" cy="38" r="10" />
                <path d="M76 38h60" />
                <path d="M96 38l10 12 10-12" />
                <rect x="96" y="50" width="20" height="14" rx="4" fill="#1c1533" />
              </g>
              {/* descent */}
              <path d="M106 68v46" stroke="#8b5cf6" strokeWidth="1.6" strokeDasharray="4 5" />
              {/* drop point + dispatch route */}
              <circle cx="106" cy="122" r="6" fill="#8b5cf6" />
              <circle cx="106" cy="122" r="12" fill="none" stroke="#8b5cf6" strokeOpacity="0.4" />
              <path d="M18 168 L64 140 L106 122 L156 150 L196 134" fill="none" stroke="#8b5cf6" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              {[
                [18, 168],
                [64, 140],
                [156, 150],
                [196, 134],
              ].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="3.5" fill="#584b85" />
              ))}
            </svg>
          ) : (
            <svg viewBox="0 0 212 190" aria-hidden="true" className="h-auto w-full">
              {[
                { y: 18, w: 120, label: "client workflows" },
                { y: 76, w: 150, label: "REST API layer" },
                { y: 134, w: 100, label: "backend services" },
              ].map((b, i) => (
                <g key={i}>
                  <rect x="16" y={b.y} width="180" height="38" rx="9" fill="#1c1533" stroke={i === 1 ? "#8b5cf6" : "#322a4a"} strokeWidth={i === 1 ? 1.6 : 1} />
                  <rect x="30" y={b.y + 15} width={b.w * 0.6} height="7" rx="3.5" fill={i === 1 ? "#a78bfa" : "#3d3358"} />
                  {i < 2 && <path d={`M106 ${b.y + 38}v12l-4-5m4 5 4-5`} stroke="#8b5cf6" strokeWidth="1.6" fill="none" strokeLinecap="round" />}
                </g>
              ))}
            </svg>
          )}
          <p className="mt-5 text-center font-display text-base font-bold leading-snug text-ink">
            {active === 0 ? "Drone medication delivery platform" : "Production Spring Boot services"}
          </p>
        </div>
      </div>
    </div>
  );
}
