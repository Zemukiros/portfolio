"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import Keep2DOnError from "./Keep2DOnError";
import { canUse3D } from "@/lib/webgl";

const Fishbowl3D = dynamic(() => import("./Fishbowl3D"), { ssr: false });

/**
 * Must match FieldArtwork in EditorialHero: viewBox 1440×900, preserveAspectRatio "xMidYMid slice",
 * sun circle at (1080, 300) r = 120.
 */
const VB = { w: 1440, h: 900 };
const SUN = { x: 1080, y: 300, r: 120 };
/** Canvas half-extent per bowl radius at the camera in Fishbowl3D (z 3.2, fov 38°). */
const CANVAS_PER_RADIUS = 3.2 * Math.tan((19 * Math.PI) / 180);

/** Decorative fishbowl living inside the hero's sun circle (DESIGN.md → Signature objects). */
export default function HeroFishbowl() {
  const boxRef = useRef<HTMLDivElement>(null);
  const [geom, setGeom] = useState<{ cx: number; cy: number; r: number } | null>(null);
  const [want3D, setWant3D] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const measure = () => {
      const { width: w, height: h } = box.getBoundingClientRect();
      const s = Math.max(w / VB.w, h / VB.h); // "slice" scale
      setGeom({ cx: w / 2 + (SUN.x - VB.w / 2) * s, cy: h / 2 + (SUN.y - VB.h / 2) * s, r: SUN.r * s });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(box);
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting));
    io.observe(box);
    const id = requestAnimationFrame(() => setWant3D(canUse3D()));
    return () => {
      ro.disconnect();
      io.disconnect();
      cancelAnimationFrame(id);
    };
  }, []);

  const side = geom ? geom.r * 2 * CANVAS_PER_RADIUS : 0;

  return (
    <div ref={boxRef} className="pointer-events-none absolute inset-0" aria-hidden="true">
      {geom && (
        <>
          {/* flat fallback fish, drawn inside the sun circle */}
          <svg
            className={`absolute transition-opacity duration-700 ${ready ? "opacity-0" : "opacity-100"}`}
            style={{ left: geom.cx - geom.r, top: geom.cy - geom.r, width: geom.r * 2, height: geom.r * 2 }}
            viewBox="-100 -100 200 200"
          >
            <path d="M-62 74c4-22 2-40-6-58M-48 76c-2-16 2-28 8-40" stroke="#2f6a3b" strokeWidth="4" strokeLinecap="round" fill="none" />
            <g transform="translate(6 -4)">
              <path d="M-38 0l-22-16c4 10 4 22 0 32z" fill="#1f4a29" />
              <ellipse cx="0" cy="0" rx="40" ry="22" fill="#2f6a3b" />
              <ellipse cx="2" cy="7" rx="30" ry="10" fill="#8fb184" />
              <path d="M-8-20c6-12 18-12 24-4z" fill="#1f4a29" />
              <circle cx="24" cy="-5" r="3.5" fill="#18211a" />
            </g>
            <g fill="#f4f2ea">
              <circle cx="40" cy="-40" r="4" />
              <circle cx="48" cy="-58" r="3" />
              <circle cx="42" cy="-72" r="2.2" />
            </g>
          </svg>

          {want3D && (
            <div
              className={`absolute transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
              style={{ left: geom.cx - side / 2, top: geom.cy - side / 2, width: side, height: side }}
            >
              <Keep2DOnError
                onFail={() => {
                  setReady(false);
                  setWant3D(false);
                }}
              >
                <Fishbowl3D active={onScreen} onReady={() => setReady(true)} />
              </Keep2DOnError>
            </div>
          )}
        </>
      )}
    </div>
  );
}
