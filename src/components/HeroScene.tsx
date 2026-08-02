"use client";

import { useEffect, useRef } from "react";

/**
 * Original hero illustration: a friendly Black developer at his desk, the
 * monitor running an IntelliRoute-style route graph, playful UI cards
 * floating around him. Layered for a subtle pointer parallax (disabled for
 * touch and reduced-motion users). Authored SVG — no stock assets.
 */
export default function HeroScene() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(hover: none)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
      const py = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
      el.style.setProperty("--px", px.toFixed(3));
      el.style.setProperty("--py", py.toFixed(3));
    };
    const onLeave = () => {
      el.style.setProperty("--px", "0");
      el.style.setProperty("--py", "0");
    };
    const zone = el.closest("section") ?? el;
    zone.addEventListener("pointermove", onMove as EventListener);
    zone.addEventListener("pointerleave", onLeave);
    return () => {
      zone.removeEventListener("pointermove", onMove as EventListener);
      zone.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={ref} className="parallax-scene relative w-full max-w-[540px]">
      <svg
        viewBox="0 0 540 470"
        role="img"
        aria-label="Illustrated avatar of Zemariam at his desk — waving, with a route-planning app on his monitor and floating interface cards around him"
        className="h-auto w-full"
      >
        {/* ---------- back layer: atmosphere ---------- */}
        <g className="parallax-back">
          <ellipse cx="272" cy="250" rx="215" ry="200" fill="#8b5cf6" opacity="0.09" />
          <circle cx="272" cy="250" r="178" fill="none" stroke="#8b5cf6" strokeOpacity="0.18" strokeDasharray="2 8" />
        </g>

        {/* ---------- character + desk layer ---------- */}
        <g className="parallax-mid">
          {/* chair */}
          <rect x="216" y="238" width="110" height="94" rx="26" fill="#5b21b6" />
          <rect x="252" y="330" width="12" height="52" rx="6" fill="#3b2a63" />
          <path d="M218 400h80" stroke="#3b2a63" strokeWidth="10" strokeLinecap="round" />
          <circle cx="218" cy="404" r="7" fill="#3b2a63" />
          <circle cx="298" cy="404" r="7" fill="#3b2a63" />

          {/* crossed leg + sneaker */}
          <path d="M300 336c26 4 48 14 58 30" stroke="#4338ca" strokeWidth="22" strokeLinecap="round" fill="none" />
          <path d="M352 360l30 10c8 3 7 14-2 15l-26 3c-7 1-12-4-12-10z" fill="#a78bfa" />
          <path d="M344 380l38-4" stroke="#f1eef9" strokeWidth="4" strokeLinecap="round" />

          {/* torso / cream sweater */}
          <path
            d="M212 322c-2-52 18-84 58-84s60 32 58 84c0 8-6 12-14 12h-88c-8 0-14-4-14-12z"
            fill="#f3efe9"
          />
          {/* left arm typing on laptop */}
          <path d="M226 262c-20 16-28 38-24 58l30 8" fill="none" stroke="#f3efe9" strokeWidth="26" strokeLinecap="round" />
          <circle cx="238" cy="330" r="12" fill="#8a5a3b" />
          {/* right arm waving */}
          <path d="M312 268c22-10 34-30 38-56" fill="none" stroke="#f3efe9" strokeWidth="26" strokeLinecap="round" />
          <g>
            <circle cx="352" cy="198" r="15" fill="#8a5a3b" />
            <path d="M344 188l4-10M352 186l2-11M360 188l5-9" stroke="#8a5a3b" strokeWidth="7" strokeLinecap="round" />
          </g>

          {/* neck + head */}
          <rect x="252" y="196" width="36" height="26" rx="12" fill="#8a5a3b" />
          <circle cx="270" cy="158" r="46" fill="#96603c" />
          {/* ear */}
          <circle cx="226" cy="160" r="9" fill="#8a5a3b" />
          {/* curly hair */}
          <g fill="#1b1526">
            <circle cx="244" cy="120" r="17" />
            <circle cx="268" cy="112" r="18" />
            <circle cx="292" cy="118" r="17" />
            <circle cx="306" cy="136" r="14" />
            <circle cx="232" cy="136" r="14" />
            <path d="M224 142c0-30 20-52 46-52s46 22 46 52c-6-18-24-30-46-30s-40 12-46 30z" />
          </g>
          <g fill="#2b2140">
            <circle cx="252" cy="112" r="5" />
            <circle cx="278" cy="106" r="5" />
            <circle cx="298" cy="116" r="5" />
          </g>
          {/* face */}
          <circle cx="256" cy="158" r="4.5" fill="#181120" />
          <circle cx="288" cy="158" r="4.5" fill="#181120" />
          <circle cx="257.5" cy="156.5" r="1.5" fill="#fff" />
          <circle cx="289.5" cy="156.5" r="1.5" fill="#fff" />
          <path d="M250 146c3-4 9-4 12 0M282 146c3-4 9-4 12 0" stroke="#181120" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M262 174c5 5 12 5 17 0" stroke="#181120" strokeWidth="3" strokeLinecap="round" fill="none" />
          <circle cx="243" cy="169" r="5.5" fill="#b9714b" opacity="0.55" />
          <circle cx="299" cy="169" r="5.5" fill="#b9714b" opacity="0.55" />

          {/* desk */}
          <rect x="64" y="332" width="404" height="15" rx="7.5" fill="#6d28d9" />
          <rect x="88" y="347" width="13" height="92" rx="6" fill="#5b21b6" />
          <rect x="432" y="347" width="13" height="92" rx="6" fill="#5b21b6" />

          {/* monitor with route graph */}
          <rect x="96" y="196" width="132" height="96" rx="10" fill="#0d0b16" stroke="#322a4a" strokeWidth="1.5" />
          <circle cx="108" cy="208" r="2.5" fill="#8b5cf6" />
          <circle cx="117" cy="208" r="2.5" fill="#584b85" />
          <polyline points="110,272 134,246 162,256 190,232 214,240" fill="none" stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="134" y1="246" x2="158" y2="224" stroke="#322a4a" strokeWidth="1.5" />
          <line x1="158" y1="224" x2="190" y2="232" stroke="#322a4a" strokeWidth="1.5" />
          {[
            [110, 272],
            [134, 246],
            [162, 256],
            [190, 232],
            [214, 240],
            [158, 224],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={i === 0 || i === 4 ? 4 : 2.8} fill={i === 0 || i === 4 ? "#a78bfa" : "#584b85"} />
          ))}
          <rect x="152" y="292" width="20" height="31" fill="#221d33" />
          <rect x="132" y="323" width="60" height="10" rx="5" fill="#322a4a" />

          {/* laptop */}
          <path d="M330 276h96c5 0 9 4 9 9v43h-114v-43c0-5 4-9 9-9z" fill="#1c1533" stroke="#322a4a" strokeWidth="1.5" />
          <rect x="330" y="284" width="96" height="36" rx="4" fill="#0d0b16" />
          <polyline points="338,312 352,300 366,306 380,294" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" />
          <path d="M308 328h140l10 14c2 3 0 7-4 7H302c-4 0-6-4-4-7z" fill="#2a2140" />

          {/* plant */}
          <path d="M56 300c10-22 30-30 44-28-4 18-20 32-38 34z" fill="#34d399" opacity="0.85" />
          <path d="M66 306c-14-12-32-12-42-6 8 12 26 16 40 12z" fill="#10b981" opacity="0.85" />
          <path d="M46 308h36l-5 34c-1 5-5 8-10 8h-6c-5 0-9-3-10-8z" fill="#4c1d95" />
        </g>

        {/* ---------- floating UI cards ---------- */}
        <g className="parallax-front">
          {/* image card */}
          <g className="float-bob" style={{ animationDelay: "0s" }}>
            <rect x="52" y="34" width="92" height="112" rx="14" fill="#efeafd" />
            <rect x="64" y="46" width="68" height="52" rx="8" fill="#cdbdf7" />
            <path d="M70 92l16-20 12 13 9-9 15 16z" fill="#6d28d9" />
            <circle cx="80" cy="60" r="6" fill="#f8f7fc" />
            <rect x="64" y="106" width="68" height="8" rx="4" fill="#b9a7ef" />
            <rect x="64" y="120" width="46" height="8" rx="4" fill="#7ce3c4" />
          </g>

          {/* play card */}
          <g className="float-bob" style={{ animationDelay: "1.4s" }}>
            <rect x="158" y="16" width="84" height="100" rx="14" fill="#fbe7f5" />
            <circle cx="200" cy="52" r="22" fill="#2a2140" />
            <path d="M194 42l18 10-18 10z" fill="#f8f7fc" />
            <rect x="172" y="84" width="56" height="8" rx="4" fill="#eeb7dd" />
            <rect x="172" y="98" width="38" height="8" rx="4" fill="#eeb7dd" />
          </g>

          {/* ranking chip card */}
          <g className="float-bob" style={{ animationDelay: "0.7s" }}>
            <rect x="368" y="52" width="152" height="64" rx="14" fill="#f6f4fd" />
            <circle cx="392" cy="84" r="11" fill="#8b5cf6" />
            <text x="392" y="88.5" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="700" fontFamily="var(--font-body)">1</text>
            <rect x="410" y="70" width="94" height="9" rx="4.5" fill="#2a2140" />
            <rect x="410" y="86" width="64" height="8" rx="4" fill="#b9a7ef" />
            <path d="M488 92l5 6 9-11" stroke="#10b981" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>

          {/* palette pill + cursor */}
          <g className="float-bob" style={{ animationDelay: "2.1s" }}>
            <g transform="rotate(-14 150 400)">
              <rect x="52" y="382" width="196" height="44" rx="22" fill="#f6f4fd" />
              {["#8b5cf6", "#d946ef", "#34d399", "#e8b45a", "#60a5fa"].map((c, i) => (
                <circle key={c} cx={84 + i * 33} cy={404} r="11" fill={c} />
              ))}
            </g>
            <path d="M236 428l7 22 6-9 11 1z" fill="#f472b6" stroke="#fff" strokeWidth="2" strokeLinejoin="round" />
          </g>

          {/* sparkle ticks */}
          <g stroke="#a78bfa" strokeWidth="3.5" strokeLinecap="round" className="float-bob" style={{ animationDelay: "1s" }}>
            <path d="M330 96l6-12" />
            <path d="M342 102l10-8" />
          </g>
        </g>
      </svg>
    </div>
  );
}
