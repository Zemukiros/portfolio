/**
 * TypeScript port of Mini-S3's placement code (dev.minis3.common.HashRing).
 *
 * Same hash (first 8 bytes of SHA-256, read as a signed big-endian long),
 * same virtual-node naming ("node-1#0" … "node-1#199"), and the same
 * clockwise walk (tailMap, then wrap to headMap) collecting distinct
 * physical nodes. Positions are compared exactly as 64-bit signed values
 * (hi word signed, lo word unsigned), so preference lists are bit-identical
 * to the Java implementation — the portfolio's demos run the real algorithm.
 */

const K = new Uint32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
]);

const W = new Uint32Array(64);
const encoder = new TextEncoder();

/** SHA-256 of a UTF-8 string, returned as eight 32-bit words. */
export function sha256Words(input: string): Uint32Array {
  const msg = encoder.encode(input);
  const bitLen = msg.length * 8;
  const blocks = Math.ceil((msg.length + 9) / 64);
  const buf = new Uint8Array(blocks * 64);
  buf.set(msg);
  buf[msg.length] = 0x80;
  const view = new DataView(buf.buffer);
  view.setUint32(buf.length - 8, Math.floor(bitLen / 0x100000000));
  view.setUint32(buf.length - 4, bitLen >>> 0);

  let h0 = 0x6a09e667, h1 = 0xbb67ae85, h2 = 0x3c6ef372, h3 = 0xa54ff53a;
  let h4 = 0x510e527f, h5 = 0x9b05688c, h6 = 0x1f83d9ab, h7 = 0x5be0cd19;

  for (let off = 0; off < buf.length; off += 64) {
    for (let i = 0; i < 16; i++) W[i] = view.getUint32(off + i * 4);
    for (let i = 16; i < 64; i++) {
      const w15 = W[i - 15], w2 = W[i - 2];
      const s0 = ((w15 >>> 7) | (w15 << 25)) ^ ((w15 >>> 18) | (w15 << 14)) ^ (w15 >>> 3);
      const s1 = ((w2 >>> 17) | (w2 << 15)) ^ ((w2 >>> 19) | (w2 << 13)) ^ (w2 >>> 10);
      W[i] = (W[i - 16] + s0 + W[i - 7] + s1) >>> 0;
    }
    let a = h0, b = h1, c = h2, d = h3, e = h4, f = h5, g = h6, h = h7;
    for (let i = 0; i < 64; i++) {
      const S1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7));
      const ch = (e & f) ^ (~e & g);
      const t1 = (h + S1 + ch + K[i] + W[i]) >>> 0;
      const S0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10));
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const t2 = (S0 + maj) >>> 0;
      h = g; g = f; f = e; e = (d + t1) >>> 0;
      d = c; c = b; b = a; a = (t1 + t2) >>> 0;
    }
    h0 = (h0 + a) >>> 0; h1 = (h1 + b) >>> 0; h2 = (h2 + c) >>> 0; h3 = (h3 + d) >>> 0;
    h4 = (h4 + e) >>> 0; h5 = (h5 + f) >>> 0; h6 = (h6 + g) >>> 0; h7 = (h7 + h) >>> 0;
  }
  return new Uint32Array([h0, h1, h2, h3, h4, h5, h6, h7]);
}

/** A ring position: Java's signed 64-bit long split into a signed hi and unsigned lo word. */
export type RingPos = { hi: number; lo: number };

/** HashRing.hash(): first 8 bytes of SHA-256 as a signed long. */
export function ringHash(s: string): RingPos {
  const w = sha256Words(s);
  return { hi: w[0] | 0, lo: w[1] };
}

export function comparePos(aHi: number, aLo: number, bHi: number, bLo: number): number {
  if (aHi !== bHi) return aHi < bHi ? -1 : 1;
  if (aLo !== bLo) return aLo < bLo ? -1 : 1;
  return 0;
}

/** Position as a fraction of the full circle, 0 at Long.MIN_VALUE — for drawing only. */
export function ringFraction(p: RingPos): number {
  return ((p.hi + 2147483648) * 4294967296 + p.lo) / 18446744073709551616;
}

/** Math.floorMod(hash, n) for the signed 64-bit hash — the naive "hash % N" placement. */
export function floorModPos(p: RingPos, n: number): number {
  const hiMod = ((p.hi % n) + n) % n;
  return (hiMod * (4294967296 % n) + (p.lo % n)) % n;
}

type Point = { hi: number; lo: number; node: string };

export class HashRing {
  private readonly hi: Int32Array;
  private readonly lo: Uint32Array;
  private readonly owner: string[];
  readonly points: Point[];

  constructor(nodeIds: Iterable<string>, readonly virtualNodes: number) {
    // TreeMap semantics: sorted by position; a later put on an equal key replaces the owner.
    const byPos = new Map<string, Point>();
    for (const id of nodeIds) {
      for (let i = 0; i < virtualNodes; i++) {
        const p = ringHash(`${id}#${i}`);
        byPos.set(`${p.hi}:${p.lo}`, { ...p, node: id });
      }
    }
    this.points = [...byPos.values()].sort((a, b) => comparePos(a.hi, a.lo, b.hi, b.lo));
    this.hi = Int32Array.from(this.points, (p) => p.hi);
    this.lo = Uint32Array.from(this.points, (p) => p.lo);
    this.owner = this.points.map((p) => p.node);
  }

  /** Index of the first point at or after the position (TreeMap.tailMap). */
  private lowerBound(hi: number, lo: number): number {
    let l = 0;
    let r = this.owner.length;
    while (l < r) {
      const m = (l + r) >>> 1;
      if (comparePos(this.hi[m], this.lo[m], hi, lo) < 0) l = m + 1;
      else r = m;
    }
    return l;
  }

  /** Owner of a precomputed position (the n = 1 case, used for bulk measurements). */
  ownerAt(hi: number, lo: number): string {
    const i = this.lowerBound(hi, lo);
    return this.owner[i === this.owner.length ? 0 : i];
  }

  /** First n distinct physical nodes clockwise from the key's position. */
  preferenceList(key: string, n: number): string[] {
    const result: string[] = [];
    const total = this.owner.length;
    if (total === 0) return result;
    const { hi, lo } = ringHash(key);
    const start = this.lowerBound(hi, lo);
    for (let k = 0; k < total; k++) {
      const node = this.owner[(start + k) % total];
      if (!result.includes(node)) {
        result.push(node);
        if (result.length === n) break;
      }
    }
    return result;
  }
}
