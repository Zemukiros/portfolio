"use client";

import { useEffect, useState } from "react";

/**
 * Launch intro: a rocket lifts off across a starfield, then the overlay
 * dissolves into the page. Plays once per browser session; skipped entirely
 * for reduced-motion users and on client-side navigations.
 */
export default function IntroLoader() {
  const [phase, setPhase] = useState<"show" | "fade" | "gone">("show");

  useEffect(() => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      sessionStorage.getItem("zh-intro-seen")
    ) {
      const skip = setTimeout(() => setPhase("gone"), 0);
      return () => clearTimeout(skip);
    }
    const t1 = setTimeout(() => setPhase("fade"), 1650);
    const t2 = setTimeout(() => {
      setPhase("gone");
      sessionStorage.setItem("zh-intro-seen", "1");
    }, 2250);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-bg transition-opacity duration-500 ${
        phase === "fade" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      {/* stars */}
      <div className="absolute inset-0 overflow-hidden">
        {[
          [12, 18, 2], [28, 64, 1.5], [45, 30, 2.5], [63, 74, 1.5], [78, 22, 2],
          [88, 58, 1.5], [8, 82, 2], [55, 12, 1.5], [70, 88, 2], [35, 90, 1.5],
          [92, 36, 2], [20, 44, 1.5],
        ].map(([x, y, r], i) => (
          <span
            key={i}
            className="loader-star absolute rounded-full bg-ink"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: r,
              height: r,
              animationDelay: `${(i % 5) * 0.28}s`,
            }}
          />
        ))}
      </div>

      <div className="relative flex flex-col items-center">
        <div className="loader-rocket">
          <svg width="86" height="86" viewBox="0 0 96 96" fill="none">
            <g transform="rotate(45 48 48)">
              {/* flame */}
              <g className="loader-flame" style={{ transformOrigin: "48px 74px" }}>
                <path d="M42 72c0 8 3 14 6 20 3-6 6-12 6-20z" fill="#e8b45a" />
                <path d="M45 72c0 6 1.5 9 3 13 1.5-4 3-7 3-13z" fill="#a78bfa" />
              </g>
              {/* fins */}
              <path d="M38 52c-8 4-10 12-10 18 6-2 12-6 14-10z" fill="#6d28d9" />
              <path d="M58 52c8 4 10 12 10 18-6-2-12-6-14-10z" fill="#6d28d9" />
              {/* body */}
              <path
                d="M48 8c10 8 14 22 14 34 0 12-6 22-14 30-8-8-14-18-14-30 0-12 4-26 14-34z"
                fill="#f1eef9"
              />
              {/* nose */}
              <path d="M48 8c5 4 8.5 9.6 11 16H37c2.5-6.4 6-12 11-16z" fill="#8b5cf6" />
              {/* window */}
              <circle cx="48" cy="40" r="7.5" fill="#131022" stroke="#8b5cf6" strokeWidth="2.5" />
              <circle cx="50" cy="38" r="2" fill="#a78bfa" />
            </g>
          </svg>
        </div>
        <p className="mt-6 font-mono text-xs tracking-[0.3em] text-ink-faint">LAUNCHING</p>
        <div className="mt-3 h-1 w-40 overflow-hidden rounded-full bg-bg-panel">
          <div className="loader-bar h-full rounded-full bg-accent" />
        </div>
      </div>
    </div>
  );
}
