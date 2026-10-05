"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import HashRingFigure from "./HashRingFigure";
import { preference, ringDescription } from "@/lib/ringFigure";

const HashRing3D = dynamic(() => import("./HashRing3D"), { ssr: false });

function canUse3D() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (window.matchMedia("(hover: none)").matches) return false; // touch / low-power: keep the SVG
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") ?? c.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * The About section's signature object (DESIGN.md → "Signature: the 3D object").
 * Server and first paint render the static SVG; capable devices then lazy-load the
 * WebGL ring, which only animates while on screen. The SVG stays as the fallback.
 */
export default function HashRingObject() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [want3D, setWant3D] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), { rootMargin: "200px" });
    io.observe(el);
    // Defer the capability check (and the bundle) until after first paint.
    const id = requestAnimationFrame(() => setWant3D(canUse3D()));
    return () => {
      io.disconnect();
      cancelAnimationFrame(id);
    };
  }, []);

  const show3D = want3D && (ready || onScreen);

  return (
    <div>
      <div ref={wrapRef} role="img" aria-label={ringDescription} className="relative mx-auto aspect-square w-full max-w-[420px]">
        <div
          aria-hidden="true"
          className={`absolute inset-0 transition-opacity duration-500 ${ready ? "opacity-0" : "opacity-100"}`}
        >
          <HashRingFigure className="h-full w-full" />
        </div>
        {show3D && (
          <div aria-hidden="true" className={`absolute inset-0 transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`}>
            <HashRing3D active={onScreen} onReady={() => setReady(true)} />
          </div>
        )}
      </div>
      <p className="mt-4 text-center font-mono text-[11px] tracking-[0.08em] text-ink-faint" aria-hidden="true">
        {preference.map((node, i) => (
          <span key={node}>
            {i > 0 && <span className="mx-2 text-border-strong">·</span>}
            <span className="text-accent-strong">r{i + 1}</span> {node}
          </span>
        ))}
      </p>
    </div>
  );
}
