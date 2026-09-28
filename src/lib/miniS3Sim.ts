/**
 * In-browser model of the Mini-S3 cluster, used by the case-study simulator.
 *
 * It mirrors the real system's rules rather than approximating them:
 *  - placement uses the TypeScript port of HashRing (200 virtual nodes,
 *    bit-identical preference lists), rebuilt from UP nodes per call;
 *  - writes fan out to 3 targets and commit at W = 2 acks; a 3rd ack lands
 *    in the background; quorum failure tombstones the object (503);
 *  - reads shuffle live replicas, verify the checksum, and drop missing or
 *    corrupt copies (read repair);
 *  - storage nodes heartbeat every 2 s; the worker marks a node DOWN after
 *    6 s of silence, repairs under-replicated objects every 3 s, and
 *    garbage-collects tombstones and surplus copies every 5 s.
 *
 * Network latencies are visual (tens to hundreds of ms); the heartbeat,
 * timeout, repair, and GC intervals match the repo's configuration.
 */
import { HashRing, sha256Words } from "./hashRing";

export const SIM = {
  replication: 3,
  writeQuorum: 2,
  virtualNodes: 200,
  heartbeatMs: 2000,
  heartbeatTimeoutMs: 6000,
  failureCheckMs: 2000,
  repairMs: 3000,
  gcMs: 5000,
} as const;

export const NODE_IDS = ["node-1", "node-2", "node-3", "node-4"] as const;
export const BUCKET = "demo";

export type Endpoint = "client" | "api" | "pg" | "worker" | string;
export type PacketKind =
  | "write"
  | "ack"
  | "read"
  | "data"
  | "repair"
  | "heartbeat"
  | "meta"
  | "gc"
  | "response"
  | "fail";
export type Packet = {
  id: number;
  from: Endpoint;
  to: Endpoint;
  start: number;
  end: number;
  kind: PacketKind;
  /** Fails on arrival: drawn as a packet that stops short of the target. */
  broken?: boolean;
};
export type LogSource = "client" | "api" | "worker" | "chaos" | "drill";
export type LogLevel = "info" | "warn" | "error" | "ok";
export type LogEntry = { id: number; t: number; source: LogSource; level: LogLevel; text: string };

export type NodeState = {
  id: string;
  /** Status as recorded in Postgres (what the API and worker believe). */
  status: "UP" | "DOWN";
  /** Whether the container is actually running. */
  running: boolean;
  lastHeartbeat: number;
  lastBeatSent: number;
  gen: number;
  /** Files on the node's disk, keyed by object id. */
  blobs: Map<string, { corrupt: boolean; at: number }>;
};

export type ObjStatus = "PENDING" | "COMMITTED" | "DELETED";
export type SimObject = {
  id: string;
  key: string;
  size: number;
  sha: string;
  status: ObjStatus;
  createdAt: number;
};

export type DrillStep = { label: string; detail?: string; state: "todo" | "active" | "done" | "failed" };
export type DrillState = { active: boolean; finished: boolean; steps: DrillStep[]; summary?: string };

export type GetResult = { status: number; servedBy?: string };

type Timer = { at: number; seq: number; fn: () => void };

const SEED_FILES: [string, number][] = [
  ["photos/cat.png", 482_113],
  ["reports/q3-results.pdf", 1_204_880],
  ["logs/api-2026-09-28.log", 88_402],
  ["backups/metadata.dump", 3_901_224],
  ["demo.bin", 5_242_880],
  ["videos/intro.mp4", 2_630_117],
];

const UPLOAD_POOL: [string, number][] = [
  ["docs/design.md", 21_540],
  ["photos/dog.jpg", 734_902],
  ["exports/orders.csv", 412_775],
  ["models/ranker.onnx", 2_118_004],
  ["audio/podcast-ep1.mp3", 4_402_110],
  ["photos/2026/beach.png", 1_880_455],
  ["configs/prod.yaml", 3_210],
  ["archives/sept.tar.gz", 3_377_812],
];

export function shortId(id: string) {
  return id.slice(0, 8);
}

export function formatSize(bytes: number) {
  if (bytes >= 1_000_000) return `${(bytes / 1_048_576).toFixed(1)} MB`;
  if (bytes >= 1_000) return `${Math.round(bytes / 1024)} KB`;
  return `${bytes} B`;
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export class MiniS3Sim {
  now = 0;
  speed = 1;
  version = 0;
  nodes = new Map<string, NodeState>();
  objects = new Map<string, SimObject>();
  replicas = new Map<string, Set<string>>();
  packets: Packet[] = [];
  log: LogEntry[] = [];
  drill: DrillState = { active: false, finished: false, steps: [] };
  workerActivity = "idle";
  apiActivity = "idle";
  /** Short, plain-language announcements for the screen-reader live region. */
  announcement = "";
  counters = { repaired: 0, trimmed: 0 };

  private rand: () => number;
  private queue: Timer[] = [];
  private seq = 0;
  private packetSeq = 0;
  private logSeq = 0;
  private uploadCursor = 0;
  private repairRunning = false;
  private gcRunning = false;
  private waiters: { pred: () => boolean; resolve: () => void }[] = [];
  private rings = new Map<string, HashRing>();

  constructor(seed = 20260928) {
    this.rand = mulberry32(seed);
    this.reset(true);
  }

  // ------------------------------------------------------------------ clock

  /** 0 pauses the simulation; 1 is real time. */
  setSpeed(speed: number) {
    this.speed = speed;
  }

  /** Advance simulated time by a real-time delta (ms). */
  advance(realDt: number) {
    const target = this.now + Math.min(realDt, 100) * this.speed;
    while (this.queue.length && this.queue[0].at <= target) {
      const ev = this.queue.shift()!;
      this.now = ev.at;
      ev.fn();
    }
    this.now = target;
    this.packets = this.packets.filter((p) => p.end > this.now - 60);
    this.checkWaiters();
  }

  private schedule(delay: number, fn: () => void) {
    const t: Timer = { at: this.now + delay, seq: this.seq++, fn };
    let i = this.queue.length;
    while (i > 0 && (this.queue[i - 1].at > t.at || (this.queue[i - 1].at === t.at && this.queue[i - 1].seq > t.seq))) i--;
    this.queue.splice(i, 0, t);
  }

  private sleep(ms: number) {
    return new Promise<void>((resolve) => this.schedule(ms, resolve));
  }

  private travel(from: Endpoint, to: Endpoint, ms: number, kind: PacketKind, broken = false) {
    this.packets.push({ id: this.packetSeq++, from, to, start: this.now, end: this.now + ms, kind, broken });
    return this.sleep(ms);
  }

  private waitFor(pred: () => boolean) {
    return new Promise<void>((resolve) => {
      if (pred()) resolve();
      else this.waiters.push({ pred, resolve });
    });
  }

  private checkWaiters() {
    if (!this.waiters.length) return;
    const pending = this.waiters;
    this.waiters = [];
    for (const w of pending) {
      if (w.pred()) w.resolve();
      else this.waiters.push(w);
    }
  }

  private jitter(min: number, max: number) {
    return min + this.rand() * (max - min);
  }

  private uuid() {
    const b = Array.from({ length: 16 }, () => Math.floor(this.rand() * 256));
    b[6] = (b[6] & 0x0f) | 0x40;
    b[8] = (b[8] & 0x3f) | 0x80;
    const h = b.map((x) => x.toString(16).padStart(2, "0")).join("");
    return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
  }

  private touch() {
    this.version++;
  }

  private write(source: LogSource, level: LogLevel, text: string) {
    this.log.push({ id: this.logSeq++, t: this.now, source, level, text });
    if (this.log.length > 200) this.log.splice(0, this.log.length - 200);
    this.touch();
  }

  private announce(text: string) {
    this.announcement = text;
    this.touch();
  }

  // ------------------------------------------------------------- metadata

  upNodes() {
    return [...this.nodes.values()].filter((n) => n.status === "UP").map((n) => n.id);
  }

  /** Placement.preferenceList(): a ring built from exactly the given nodes. */
  placement(objectId: string, nodeIds: string[], n: number) {
    const key = [...nodeIds].sort().join(",");
    let ring = this.rings.get(key);
    if (!ring) {
      ring = new HashRing(nodeIds, SIM.virtualNodes);
      this.rings.set(key, ring);
    }
    return ring.preferenceList(objectId, n);
  }

  replicaNodes(objectId: string) {
    return [...(this.replicas.get(objectId) ?? [])].sort();
  }

  /** Replica rows on nodes whose recorded status is UP. */
  liveReplicaNodes(objectId: string) {
    return this.replicaNodes(objectId).filter((n) => this.nodes.get(n)!.status === "UP");
  }

  private addReplica(objectId: string, nodeId: string) {
    let set = this.replicas.get(objectId);
    if (!set) this.replicas.set(objectId, (set = new Set()));
    set.add(nodeId);
    this.touch();
  }

  private removeReplica(objectId: string, nodeId: string) {
    this.replicas.get(objectId)?.delete(nodeId);
    this.touch();
  }

  liveObject(key: string) {
    return [...this.objects.values()].find((o) => o.key === key && o.status === "COMMITTED");
  }

  underReplicated() {
    return [...this.objects.values()].filter(
      (o) => o.status === "COMMITTED" && this.liveReplicaNodes(o.id).length < SIM.replication,
    );
  }

  overReplicated() {
    return [...this.objects.values()].filter(
      (o) => o.status === "COMMITTED" && this.liveReplicaNodes(o.id).length > SIM.replication,
    );
  }

  /** Bytes on a disk with no live metadata behind them: tombstones, dropped or orphaned copies. */
  garbageBlobCount() {
    let n = 0;
    for (const node of this.nodes.values()) {
      for (const id of node.blobs.keys()) {
        const o = this.objects.get(id);
        if (!o || o.status !== "COMMITTED" || !this.replicas.get(id)?.has(node.id)) n++;
      }
    }
    return n;
  }

  /** Committed copies recorded per node (what /admin/cluster reports). */
  copiesOn(nodeId: string) {
    let n = 0;
    for (const o of this.objects.values()) {
      if (o.status === "COMMITTED" && this.replicas.get(o.id)?.has(nodeId)) n++;
    }
    return n;
  }

  // ----------------------------------------------------------------- setup

  reset(seedObjects: boolean) {
    this.queue = [];
    this.waiters = [];
    this.packets = [];
    this.log = [];
    this.nodes.clear();
    this.objects.clear();
    this.replicas.clear();
    this.counters = { repaired: 0, trimmed: 0 };
    this.repairRunning = false;
    this.gcRunning = false;
    this.workerActivity = "idle";
    this.apiActivity = "idle";
    this.drill = { active: false, finished: false, steps: [] };
    this.uploadCursor = 0;

    NODE_IDS.forEach((id, i) => {
      this.nodes.set(id, {
        id,
        status: "UP",
        running: true,
        lastHeartbeat: this.now,
        lastBeatSent: this.now,
        gen: 0,
        blobs: new Map(),
      });
      void this.heartbeatLoop(id, 0, 350 + i * 480);
    });

    if (seedObjects) {
      for (const [key, size] of SEED_FILES) {
        const id = this.uuid();
        this.objects.set(id, { id, key, size, sha: this.sha(key, id), status: "COMMITTED", createdAt: this.now });
        for (const n of this.placement(id, [...NODE_IDS], SIM.replication)) {
          this.nodes.get(n)!.blobs.set(id, { corrupt: false, at: -1e6 });
          this.addReplica(id, n);
        }
      }
    }

    this.write("api", "info", "4 storage nodes registered via heartbeat · replication N=3, W=2");
    void this.failureLoop();
    void this.repairLoop();
    void this.gcLoop();
    this.touch();
  }

  private sha(key: string, id: string) {
    return Array.from(sha256Words(`${key}:${id}`), (w) => w.toString(16).padStart(8, "0")).join("");
  }

  // ------------------------------------------------------ background loops

  private async heartbeatLoop(id: string, gen: number, initialDelay: number) {
    await this.sleep(initialDelay);
    for (;;) {
      const node = this.nodes.get(id);
      if (!node || node.gen !== gen || !node.running) return;
      node.lastBeatSent = this.now;
      void this.travel(id, "api", 170, "heartbeat").then(() => this.receiveHeartbeat(id));
      await this.sleep(SIM.heartbeatMs);
    }
  }

  private receiveHeartbeat(id: string) {
    const node = this.nodes.get(id)!;
    node.lastHeartbeat = this.now;
    if (node.status === "DOWN") {
      node.status = "UP";
      this.write("api", "info", `Heartbeat from ${id} -> marked UP`);
      this.announce(`${id} is back up.`);
    }
  }

  private async failureLoop() {
    await this.sleep(1000);
    for (;;) {
      for (const node of this.nodes.values()) {
        if (node.status === "UP" && node.lastHeartbeat < this.now - SIM.heartbeatTimeoutMs) {
          node.status = "DOWN";
          this.write("worker", "warn", `Node ${node.id} missed heartbeats for 6s -> marked DOWN`);
          this.announce(`${node.id} missed heartbeats for 6 seconds and was marked down.`);
        }
      }
      await this.sleep(SIM.failureCheckMs);
    }
  }

  private async repairLoop() {
    await this.sleep(2500);
    for (;;) {
      await this.repairPass();
      await this.sleep(SIM.repairMs);
    }
  }

  private async gcLoop() {
    await this.sleep(4000);
    for (;;) {
      await this.gcPass();
      await this.sleep(SIM.gcMs);
    }
  }

  /** RepairWorker.repair(): bring every committed object back to N live copies. */
  private async repairPass() {
    const batch = this.underReplicated().slice(0, 50);
    if (!batch.length) return;
    this.repairRunning = true;
    this.workerActivity = `repair · ${batch.length} under-replicated`;
    await this.travel("worker", "pg", 120, "meta");
    const up = this.upNodes();
    let fixed = 0;
    for (const o of batch) {
      if (o.status !== "COMMITTED") continue;
      const holders = this.liveReplicaNodes(o.id);
      if (!holders.length) {
        this.write("worker", "error", `Object ${shortId(o.id)} (${BUCKET}/${o.key}) has NO live replicas`);
        continue;
      }
      const have = new Set(holders);
      const targets = this.placement(o.id, up, up.length)
        .filter((n) => !have.has(n))
        .slice(0, SIM.replication - holders.length);
      if (!targets.length) continue;

      const big = o.size >= 1_000_000;
      let source: string | null = null;
      for (const src of holders) {
        const node = this.nodes.get(src)!;
        if (!node.running) {
          await this.travel("worker", src, 110, "read", true);
          this.write("worker", "warn", `Fetch of ${shortId(o.id)} from ${src} failed: ConnectException`);
          continue;
        }
        await this.travel("worker", src, 110, "read");
        const blob = node.blobs.get(o.id);
        if (!blob || blob.corrupt) {
          this.write("worker", "warn", `Source copy of ${shortId(o.id)} on ${src} missing or corrupt; dropping it`);
          this.removeReplica(o.id, src);
          continue;
        }
        await this.travel(src, "worker", big ? 280 : 130, "data");
        source = src;
        break;
      }
      if (!source) continue;

      for (const t of targets) {
        const node = this.nodes.get(t)!;
        if (!node.running) {
          await this.travel("worker", t, big ? 280 : 150, "repair", true);
          this.write("worker", "warn", `Copy of ${shortId(o.id)} to ${t} failed: ConnectException`);
          continue;
        }
        await this.travel("worker", t, big ? 280 : 150, "repair");
        node.blobs.set(o.id, { corrupt: false, at: this.now });
        this.addReplica(o.id, t);
        fixed++;
        this.counters.repaired++;
        this.write("worker", "info", `Re-replicated ${shortId(o.id)} (${BUCKET}/${o.key}) -> ${t}`);
      }
    }
    this.write("worker", "info", `Repair pass: ${batch.length} under-replicated objects, ${fixed} new copies made`);
    this.announce(`Repair pass made ${fixed} new ${fixed === 1 ? "copy" : "copies"}.`);
    this.workerActivity = "idle";
    this.repairRunning = false;
    this.touch();
  }

  /** GarbageCollector.collect(): reclaim tombstones, then trim surplus copies. */
  private async gcPass() {
    const deleted = [...this.objects.values()].filter((o) => o.status === "DELETED").slice(0, 100);
    const over = this.overReplicated().slice(0, 100);
    if (!deleted.length && !over.length) return;
    this.gcRunning = true;
    this.workerActivity = "garbage collection";

    let reclaimed = 0;
    for (const o of deleted) {
      let allGone = true;
      for (const n of this.replicaNodes(o.id)) {
        const node = this.nodes.get(n)!;
        if (node.status !== "UP") {
          allGone = false; // retried once the node is back
          continue;
        }
        if (!node.running) {
          await this.travel("worker", n, 100, "gc", true);
          allGone = false;
          continue;
        }
        await this.travel("worker", n, 100, "gc");
        node.blobs.delete(o.id);
        this.removeReplica(o.id, n);
      }
      if (allGone) {
        this.objects.delete(o.id);
        this.replicas.delete(o.id);
        reclaimed++;
      }
    }
    if (reclaimed) this.write("worker", "info", `GC reclaimed ${reclaimed} deleted object${reclaimed === 1 ? "" : "s"}`);

    for (const o of over) {
      const holders = this.liveReplicaNodes(o.id);
      const keep = new Set(this.placement(o.id, holders, SIM.replication));
      for (const n of holders) {
        if (keep.has(n)) continue;
        // Metadata first, so no reader can pick this copy while the file is deleted.
        this.removeReplica(o.id, n);
        const node = this.nodes.get(n)!;
        await this.travel("worker", n, 100, "gc", !node.running);
        if (!node.running) {
          // The row is already gone, so the file stays behind as an orphan (a known gap).
          this.write("worker", "warn", `Trim of ${shortId(o.id)} on ${n} failed: ConnectException`);
          continue;
        }
        node.blobs.delete(o.id);
        this.counters.trimmed++;
        this.write("worker", "info", `Trimmed extra copy of ${shortId(o.id)} on ${n}`);
      }
    }
    this.workerActivity = "idle";
    this.gcRunning = false;
    this.touch();
  }

  // ------------------------------------------------------------ user paths

  nextUploadKey(): [string, number] {
    const i = this.uploadCursor++;
    if (i < UPLOAD_POOL.length) return UPLOAD_POOL[i];
    return [`files/file-${i - UPLOAD_POOL.length + 1}.txt`, 18 + ((i * 7) % 40)];
  }

  upload(key?: string, size?: number) {
    let k = key;
    let s = size;
    if (!k) [k, s] = this.nextUploadKey();
    void this.putFlow(k, s ?? 64_000);
    return k;
  }

  /** ObjectService.put(): stream, place, PENDING, fan out, commit at W = 2. */
  private async putFlow(key: string, size: number): Promise<boolean> {
    const big = size >= 1_000_000;
    await this.travel("client", "api", big ? 420 : 220, "write");
    const id = this.uuid();
    const targets = this.placement(id, this.upNodes(), SIM.replication);
    if (targets.length < SIM.writeQuorum) {
      this.write("api", "error", `PUT ${BUCKET}/${key} -> 503: only ${targets.length} storage nodes are up; need ${SIM.writeQuorum}`);
      this.announce(`Upload of ${key} failed: not enough storage nodes are up.`);
      await this.travel("api", "client", 200, "fail");
      return false;
    }
    const obj: SimObject = { id, key, size, sha: this.sha(key, id), status: "PENDING", createdAt: this.now };
    this.objects.set(id, obj);
    this.apiActivity = `PUT ${key} · placing on ${targets.join(", ")}`;
    this.touch();
    await this.travel("api", "pg", 130, "meta");

    let ok = 0;
    let failed = 0;
    let decided = false;
    const maxFailures = targets.length - SIM.writeQuorum;
    let settle: (reached: boolean) => void = () => {};
    const quorum = new Promise<boolean>((r) => (settle = r));

    for (const t of targets) {
      void (async () => {
        const node = this.nodes.get(t)!;
        const latency = big ? this.jitter(520, 1150) : this.jitter(200, 620);
        if (!node.running) {
          await this.travel("api", t, Math.min(latency, 260), "write", true);
          this.write("api", "warn", `Replica write of ${shortId(id)} to ${t} failed: ConnectException`);
          failed++;
          if (failed > maxFailures && !decided) {
            decided = true;
            settle(false);
          }
          return;
        }
        await this.travel("api", t, latency, "write");
        node.blobs.set(id, { corrupt: false, at: this.now });
        this.touch();
        await this.travel(t, "api", 140, "ack");
        this.addReplica(id, t);
        ok++;
        if (ok >= SIM.writeQuorum && !decided) {
          decided = true;
          settle(true);
        }
      })();
    }

    const reached = await quorum;
    if (!reached) {
      obj.status = "DELETED";
      this.apiActivity = "idle";
      this.write("api", "error", `PUT ${BUCKET}/${key} -> 503: write quorum not reached (${ok}/${SIM.writeQuorum})`);
      this.announce(`Upload of ${key} failed: write quorum not reached.`);
      await this.travel("api", "client", 200, "fail");
      return false;
    }
    await this.travel("api", "pg", 130, "meta");
    // commit(): advisory lock on (bucket, key); last writer wins.
    for (const o of this.objects.values()) {
      if (o.key === key && o.status === "COMMITTED" && o.id !== id) o.status = "DELETED";
    }
    obj.status = "COMMITTED";
    this.apiActivity = "idle";
    this.write("api", "info", `PUT ${BUCKET}/${key} -> ${shortId(id)} (${formatSize(size)}) acked by ${ok}/${targets.length} nodes`);
    this.announce(`Uploaded ${key}: committed after ${ok} of ${targets.length} copies were durable.`);
    await this.travel("api", "client", 200, "response");
    return true;
  }

  download(key: string) {
    return this.getFlow(key);
  }

  /** ObjectService.get(): shuffled replicas, checksum-verified, read repair. */
  private async getFlow(key: string): Promise<GetResult> {
    await this.travel("client", "api", 180, "read");
    const obj = this.liveObject(key);
    if (!obj) {
      this.write("client", "warn", `GET ${BUCKET}/${key} -> 404 No such key`);
      await this.travel("api", "client", 180, "fail");
      return { status: 404 };
    }
    await this.travel("api", "pg", 110, "meta");
    await this.travel("pg", "api", 110, "meta");
    const holders = this.liveReplicaNodes(obj.id);
    for (let i = holders.length - 1; i > 0; i--) {
      const j = Math.floor(this.rand() * (i + 1));
      [holders[i], holders[j]] = [holders[j], holders[i]];
    }
    this.apiActivity = `GET ${key} · trying ${holders.join(" → ") || "no replicas"}`;
    this.touch();
    const big = obj.size >= 1_000_000;
    for (const n of holders) {
      const node = this.nodes.get(n)!;
      if (!node.running) {
        await this.travel("api", n, 150, "read", true);
        this.write("api", "warn", `Read of ${shortId(obj.id)} from ${n} failed: ConnectException`);
        continue;
      }
      await this.travel("api", n, 150, "read");
      const blob = node.blobs.get(obj.id);
      if (!blob) {
        this.write("api", "warn", `Replica of ${shortId(obj.id)} missing on ${n}; dropping it`);
        this.removeReplica(obj.id, n);
        continue;
      }
      await this.travel(n, "api", big ? 420 : 170, "data");
      if (blob.corrupt) {
        this.write("api", "warn", `Replica of ${shortId(obj.id)} on ${n} is CORRUPT; dropping it`);
        this.announce(`Corrupt copy on ${n} detected and dropped; trying the next replica.`);
        this.removeReplica(obj.id, n);
        continue;
      }
      await this.travel("api", "client", big ? 420 : 170, "response");
      this.apiActivity = "idle";
      this.write("client", "ok", `GET ${BUCKET}/${key} -> 200 · X-Served-By: ${n} · SHA-256 match`);
      this.announce(`Downloaded ${key} from ${n}. Checksum matches.`);
      return { status: 200, servedBy: n };
    }
    this.apiActivity = "idle";
    this.write("api", "error", `GET ${BUCKET}/${key} -> 503 No healthy replica available`);
    this.announce(`Download of ${key} failed: no healthy replica available.`);
    await this.travel("api", "client", 180, "fail");
    return { status: 503 };
  }

  remove(key: string) {
    void (async () => {
      await this.travel("client", "api", 180, "write");
      await this.travel("api", "pg", 120, "meta");
      const obj = this.liveObject(key);
      if (!obj) {
        this.write("client", "warn", `DELETE ${BUCKET}/${key} -> 404 No such key`);
        return;
      }
      obj.status = "DELETED";
      this.write("api", "info", `DELETE ${BUCKET}/${key} -> 204 (bytes reclaimed asynchronously by GC)`);
      this.announce(`Deleted ${key}. The garbage collector will reclaim its bytes.`);
      await this.travel("api", "client", 180, "response");
    })();
  }

  /** Chaos: flip a byte in one live copy. Nothing notices until a read or repair fetch. */
  corrupt(objectId: string) {
    const obj = this.objects.get(objectId);
    if (!obj) return;
    const candidates = this.liveReplicaNodes(objectId).filter((n) => {
      const b = this.nodes.get(n)!.blobs.get(objectId);
      return b && !b.corrupt;
    });
    if (!candidates.length) return;
    const n = candidates[Math.floor(this.rand() * candidates.length)];
    this.nodes.get(n)!.blobs.get(objectId)!.corrupt = true;
    this.write("chaos", "warn", `Flipped a byte in ${shortId(objectId)} (${obj.key}) on ${n}'s disk`);
    this.announce(`Corrupted the copy of ${obj.key} on ${n}. Download it to trigger read repair.`);
  }

  kill(nodeId: string) {
    const node = this.nodes.get(nodeId);
    if (!node || !node.running) return;
    node.running = false;
    node.gen++;
    this.write("chaos", "warn", `docker compose stop storage-${nodeId.split("-")[1]}`);
    this.announce(`Stopped ${nodeId}. It will be marked down after 6 seconds without a heartbeat.`);
  }

  restart(nodeId: string) {
    const node = this.nodes.get(nodeId);
    if (!node || node.running) return;
    node.running = true;
    node.gen++;
    this.write("chaos", "info", `docker compose start storage-${nodeId.split("-")[1]}`);
    this.announce(`Restarting ${nodeId}.`);
    void this.heartbeatLoop(nodeId, node.gen, 900);
  }

  // ------------------------------------------------------------------ drill

  /** scripts/demo.sh, step for step. Resolves when the drill finishes. */
  async runDrill() {
    this.reset(false);
    const steps: DrillStep[] = [
      { label: "Upload demo.bin (5 MB) + 20 small files", state: "active" },
      { label: "Stop a storage node that holds demo.bin", state: "todo" },
      { label: "Wait for the 6 s heartbeat timeout + a repair pass", state: "todo" },
      { label: "Download demo.bin with the node still dead", state: "todo" },
      { label: "Bring the node back; GC trims the surplus", state: "todo" },
    ];
    this.drill = { active: true, finished: false, steps };
    const step = (i: number, detail?: string, state: DrillStep["state"] = "done") => {
      steps[i].state = state;
      if (detail) steps[i].detail = detail;
      if (state === "done" && steps[i + 1]) steps[i + 1].state = "active";
      this.write("drill", state === "failed" ? "error" : "ok", `${i + 1}/5 ${steps[i].label}${detail ? ` — ${detail}` : ""}`);
      this.announce(`Step ${i + 1} of 5: ${steps[i].label}${detail ? `. ${detail}` : ""}.`);
    };
    this.announce("Failure drill started.");

    await this.sleep(1200);
    const files: [string, number][] = [["demo.bin", 5_242_880]];
    for (let i = 1; i <= 20; i++) files.push([`files/file-${i}.txt`, 17 + (i >= 10 ? 1 : 0)]);
    for (const [k, s] of files) {
      void this.putFlow(k, s);
      await this.sleep(160);
    }
    await this.waitFor(
      () =>
        [...this.objects.values()].filter((o) => o.status === "COMMITTED").length === files.length &&
        [...this.objects.values()].every((o) => (this.replicas.get(o.id)?.size ?? 0) === SIM.replication),
    );
    step(0, "21 objects · 63 copies across 4 nodes");
    await this.sleep(1500);

    const demo = this.liveObject("demo.bin")!;
    const victim = this.replicaNodes(demo.id)[0];
    this.kill(victim);
    step(1, `stopped ${victim}`);
    const repairedBefore = this.counters.repaired;

    await this.waitFor(() => this.nodes.get(victim)!.status === "DOWN");
    await this.waitFor(() => this.underReplicated().length === 0 && !this.repairRunning);
    const rebuilt = this.counters.repaired - repairedBefore;
    step(2, `${victim} marked DOWN · ${rebuilt} copies rebuilt`);
    await this.sleep(1200);

    const result = await this.getFlow("demo.bin");
    if (result.status !== 200) {
      step(3, `HTTP ${result.status}`, "failed");
      this.drill.active = false;
      this.drill.finished = true;
      return;
    }
    step(3, `served by ${result.servedBy} · SHA-256 match — no data lost`);
    await this.sleep(1200);

    const trimmedBefore = this.counters.trimmed;
    this.restart(victim);
    await this.waitFor(() => this.nodes.get(victim)!.status === "UP");
    await this.waitFor(() => this.overReplicated().length === 0 && !this.gcRunning);
    const trimmed = this.counters.trimmed - trimmedBefore;
    const perNode = NODE_IDS.map((n) => this.copiesOn(n));
    const total = perNode.reduce((a, b) => a + b, 0);
    step(4, `${trimmed} surplus copies trimmed`);
    this.drill.summary = `${perNode.join(" + ")} = ${total} copies = 21 objects × 3`;
    this.drill.active = false;
    this.drill.finished = true;
    this.write("drill", "ok", `Final: ${this.drill.summary}`);
    this.announce(`Drill complete. ${this.drill.summary}.`);
  }
}
