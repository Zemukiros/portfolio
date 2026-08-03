"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Rotating typewriter line with a blinking caret.
 * Reduced-motion users get the first phrase rendered statically.
 */
export default function Typewriter({
  phrases,
  typeMs = 55,
  deleteMs = 28,
  holdMs = 1700,
  startDelayMs = 500,
}: {
  phrases: string[];
  typeMs?: number;
  deleteMs?: number;
  holdMs?: number;
  startDelayMs?: number;
}) {
  const [text, setText] = useState("");
  const [reduced, setReduced] = useState(false);
  const state = useRef({ phrase: 0, char: 0, deleting: false });

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      timer = setTimeout(() => {
        setReduced(true);
        setText(phrases[0]);
      }, 0);
      return () => clearTimeout(timer);
    }
    const tick = () => {
      const s = state.current;
      const current = phrases[s.phrase];
      if (!s.deleting) {
        s.char++;
        setText(current.slice(0, s.char));
        if (s.char === current.length) {
          s.deleting = true;
          timer = setTimeout(tick, holdMs);
        } else {
          timer = setTimeout(tick, typeMs);
        }
      } else {
        s.char--;
        setText(current.slice(0, s.char));
        if (s.char === 0) {
          s.deleting = false;
          s.phrase = (s.phrase + 1) % phrases.length;
          timer = setTimeout(tick, 350);
        } else {
          timer = setTimeout(tick, deleteMs);
        }
      }
    };
    timer = setTimeout(tick, startDelayMs);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <span aria-label={phrases[0]}>
      <span aria-hidden="true">{text}</span>
      {!reduced && (
        <span aria-hidden="true" className="type-caret ml-1 inline-block h-[0.95em] w-[3px] translate-y-[0.12em] rounded-sm bg-accent-strong" />
      )}
    </span>
  );
}
