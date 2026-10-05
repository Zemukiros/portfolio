import { HashRing, ringFraction, ringHash } from "./hashRing";

/**
 * The one ring the About section draws (SVG fallback and 3D object share it).
 * Four storage nodes as in the mini-s3 repo, simplified to one virtual node each for
 * legibility (the repo uses 200), and one key replicated to the first three nodes clockwise.
 */
export const RING_NODES = ["node-1", "node-2", "node-3", "node-4"];
export const RING_KEY = "photos/2026/field-notes.jpg";
export const REPLICAS = 3;

const ring = new HashRing(RING_NODES, 1);

/** Preference list: replica 1, 2, 3 in clockwise order. */
export const preference = ring.preferenceList(RING_KEY, REPLICAS);

/** Node positions as ring fractions in [0, 1), clockwise from 12 o'clock. */
export const ringNodes = ring.points.map((p) => ({
  id: p.node,
  f: ringFraction(p),
  replica: preference.indexOf(p.node), // -1 when not a replica
}));

export const keyFraction = ringFraction(ringHash(RING_KEY));

/** Clockwise sweep (as a fraction of the ring) from the key to its last replica. */
export const replicaSweep = (() => {
  const last = ringNodes.find((n) => n.id === preference[preference.length - 1])!;
  return (last.f - keyFraction + 1) % 1;
})();

export const ringDescription = `Mini-S3 hash ring: four storage nodes on a SHA-256 ring. The key ${RING_KEY} is stored on ${preference.join(", ")} — the first three nodes clockwise from its position.`;
