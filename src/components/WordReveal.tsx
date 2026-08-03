"use client";

import { useEffect, useRef } from "react";

type Segment = { text: string; className?: string };

/**
 * Reveals a statement word by word as it scrolls into view — each word rises
 * and brightens in sequence. Static for reduced-motion users.
 */
export default function WordReveal({
  segments,
  className = "",
  wordDelayMs = 38,
}: {
  segments: Segment[];
  className?: string;
  wordDelayMs?: number;
}) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add("is-visible");
            observer.disconnect();
          }
        }
      },
      { threshold: 0.25, rootMargin: "0px 0px -60px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  let wordIndex = 0;
  return (
    <p ref={ref} className={`word-reveal ${className}`}>
      {segments.map((seg, si) => (
        <span key={si} className={seg.className}>
          {seg.text.split(" ").map((word, wi) => {
            const delay = wordIndex++ * wordDelayMs;
            return (
              <span
                key={wi}
                className="word-reveal-word"
                style={{ transitionDelay: `${delay}ms` }}
              >
                {word}
                {wi < seg.text.split(" ").length - 1 ? " " : ""}
              </span>
            );
          })}
          {si < segments.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}
