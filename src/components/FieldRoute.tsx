"use client";

import { useMemo, useState } from "react";
import { FIELD_H, FIELD_START, FIELD_W, field, shortestPath } from "@/lib/fieldGraph";

/** Destinations the "New destination" button cycles through (spread across the meadow). */
const TOUR = [23, 31, 7, 28, 15, 5, 30, 19];
const STEP_MS = 45; // delay between settled nodes lighting up

/**
 * Shortest path through the field: a live Dijkstra over a seeded meadow graph.
 * Click a flower (or use the button) to route to it; settled nodes light up in the
 * order Dijkstra visits them, then the route draws as the hero's dotted line.
 */
export default function FieldRoute() {
  const [target, setTarget] = useState(TOUR[0]);
  const [tourIndex, setTourIndex] = useState(0);
  const route = useMemo(() => shortestPath(FIELD_START, target), [target]);

  const exploredOrder = useMemo(() => {
    const order = new Map<number, number>();
    route.explored.forEach((id, i) => order.set(id, i));
    return order;
  }, [route]);
  const onPath = useMemo(() => new Set(route.path), [route]);
  const pathPoints = route.path.map((id) => `${field.nodes[id].x},${field.nodes[id].y}`).join(" ");
  const drawDelay = route.explored.length * STEP_MS;

  const next = () => {
    const i = (tourIndex + 1) % TOUR.length;
    setTourIndex(i);
    setTarget(TOUR[i]);
  };

  return (
    <div className="overflow-hidden rounded-[20px] border border-border">
      <div
        tabIndex={0}
        role="region"
        aria-label="Meadow graph (scrolls horizontally on small screens)"
        className="relative overflow-x-auto bg-window"
      >
        <svg
          viewBox={`0 0 ${FIELD_W} ${FIELD_H}`}
          className="block h-auto w-full min-w-[680px]"
          role="img"
          aria-label={`A meadow of ${field.nodes.length} connected points. Dijkstra's algorithm routes from the left edge to the selected point, exploring ${route.explored.length} points and finding a ${route.path.length - 1}-hop path.`}
        >
          {/* hill bands, echoing the hero field */}
          <path d="M0 250C180 215 330 210 520 232s380 20 480-8V400H0Z" fill="#e7e3d6" opacity="0.7" />
          <path d="M0 320c210-40 420-30 620 0s290 30 380 8V400H0Z" fill="#dfe8d8" opacity="0.8" />

          {/* paths between flowers */}
          <g stroke="var(--color-border-strong)" strokeWidth="1.2" aria-hidden="true">
            {field.edges.map((e) => (
              <line
                key={`${e.a}-${e.b}`}
                x1={field.nodes[e.a].x}
                y1={field.nodes[e.a].y}
                x2={field.nodes[e.b].x}
                y2={field.nodes[e.b].y}
              />
            ))}
          </g>

          {/* the route, drawn after exploration finishes (keyed so it replays) */}
          {route.path.length > 1 && (
            <polyline
              key={`route-${target}`}
              points={pathPoints}
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="field-route"
              pathLength={1}
              style={{ animationDelay: `${drawDelay}ms` }}
              aria-hidden="true"
            />
          )}

          {/* flowers */}
          <g aria-hidden="true">
            {field.nodes.map((n) => {
              const order = exploredOrder.get(n.id);
              const isStart = n.id === FIELD_START;
              const isTarget = n.id === target;
              const explored = order !== undefined;
              const r = isStart || isTarget ? 9 : onPath.has(n.id) ? 6.5 : 5;
              return (
                <g
                  key={`${n.id}-${target}`}
                  transform={`translate(${n.x} ${n.y})`}
                  onClick={() => setTarget(n.id)}
                  className="cursor-pointer"
                >
                  {/* generous invisible hit area */}
                  <circle r="18" fill="transparent" />
                  {/* petals */}
                  {[0, 72, 144, 216, 288].map((deg) => (
                    <ellipse
                      key={deg}
                      cx="0"
                      cy={-r * 0.95}
                      rx={r * 0.42}
                      ry={r * 0.7}
                      transform={`rotate(${deg})`}
                      fill={explored ? "var(--color-heat-1)" : "var(--color-bg)"}
                      stroke="var(--color-border-strong)"
                      strokeWidth="0.8"
                      className="field-petal"
                      style={explored ? { transitionDelay: `${order! * STEP_MS}ms` } : undefined}
                    />
                  ))}
                  <circle
                    r={r * 0.55}
                    fill={isStart || isTarget || onPath.has(n.id) ? "var(--color-accent)" : explored ? "var(--color-heat-3)" : "var(--color-ink-faint)"}
                  />
                  {isStart && (
                    <text y={-r - 12} textAnchor="middle" fontSize="11" className="font-mono" fill="var(--color-ink-dim)">
                      start
                    </text>
                  )}
                  {isTarget && (
                    <text y={-r - 12} textAnchor="middle" fontSize="11" className="font-mono" fill="var(--color-accent-strong)">
                      target
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border bg-bg px-5 py-4">
        <p className="font-mono text-[11.5px] text-ink-dim" aria-live="polite">
          explored <span className="text-ink">{route.explored.length}</span> of {field.nodes.length} · path{" "}
          <span className="text-accent-strong">{route.path.length - 1} hops</span> · cost {route.cost}
        </p>
        <div className="flex items-center gap-3">
          <span className="hidden font-mono text-[11px] text-ink-faint sm:inline">Click any flower</span>
          <button
            type="button"
            onClick={next}
            className="rounded-full border border-border-strong px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-ink transition-colors hover:border-accent hover:text-accent-strong"
          >
            New destination →
          </button>
        </div>
      </div>
    </div>
  );
}
