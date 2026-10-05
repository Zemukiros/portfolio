/**
 * A small, deterministic "meadow" graph and a textbook Dijkstra over it, for the
 * home page's Shortest-path-through-the-field demo. Framework-free and seeded, so
 * server and client renders match.
 */
export type FieldNode = { id: number; x: number; y: number };
export type FieldEdge = { a: number; b: number; w: number };

export const FIELD_W = 1000;
export const FIELD_H = 400;
const COLS = 8;
const ROWS = 4;

/** mulberry32: tiny seeded PRNG. */
function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function build() {
  const rand = rng(20261005);
  const nodes: FieldNode[] = [];
  const cellW = FIELD_W / COLS;
  const cellH = FIELD_H / ROWS;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      nodes.push({
        id: r * COLS + c,
        x: Math.round(cellW * (c + 0.5) + (rand() - 0.5) * cellW * 0.6),
        y: Math.round(cellH * (r + 0.5) + (rand() - 0.5) * cellH * 0.55),
      });
    }
  }
  const dist = (a: number, b: number) => Math.hypot(nodes[a].x - nodes[b].x, nodes[a].y - nodes[b].y);
  const seen = new Set<string>();
  const edges: FieldEdge[] = [];
  const add = (a: number, b: number) => {
    const key = a < b ? `${a}-${b}` : `${b}-${a}`;
    if (seen.has(key)) return;
    seen.add(key);
    edges.push({ a, b, w: Math.round(dist(a, b)) });
  };
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const i = r * COLS + c;
      if (c + 1 < COLS) add(i, i + 1); // grid edges keep the graph connected
      if (r + 1 < ROWS && rand() < 0.75) add(i, i + COLS);
      if (r + 1 < ROWS && c + 1 < COLS && rand() < 0.35) add(i, i + COLS + 1);
      if (r + 1 < ROWS && c > 0 && rand() < 0.25) add(i, i + COLS - 1);
    }
  }
  return { nodes, edges };
}

export const field = build();
/** Start: the left-most node in the second row, where the hero's route enters. */
export const FIELD_START = COLS;

const adjacency: { to: number; w: number }[][] = field.nodes.map(() => []);
for (const e of field.edges) {
  adjacency[e.a].push({ to: e.b, w: e.w });
  adjacency[e.b].push({ to: e.a, w: e.w });
}

export type RouteResult = {
  /** Nodes in the order Dijkstra settled them, up to and including the target. */
  explored: number[];
  /** Start → target, inclusive. */
  path: number[];
  cost: number;
};

/** Dijkstra with early exit at the target (array-scan priority queue; n is tiny). */
export function shortestPath(start: number, target: number): RouteResult {
  const n = field.nodes.length;
  const best = new Array<number>(n).fill(Infinity);
  const prev = new Array<number>(n).fill(-1);
  const done = new Array<boolean>(n).fill(false);
  const explored: number[] = [];
  best[start] = 0;
  for (;;) {
    let u = -1;
    for (let i = 0; i < n; i++) if (!done[i] && best[i] < Infinity && (u < 0 || best[i] < best[u])) u = i;
    if (u < 0) break;
    done[u] = true;
    explored.push(u);
    if (u === target) break;
    for (const { to, w } of adjacency[u]) {
      if (best[u] + w < best[to]) {
        best[to] = best[u] + w;
        prev[to] = u;
      }
    }
  }
  const path: number[] = [];
  for (let v = target; v !== -1; v = prev[v]) path.unshift(v);
  return { explored, path: path[0] === start ? path : [], cost: best[target] };
}
