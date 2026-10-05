"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { keyFraction, replicaSweep, ringNodes } from "@/lib/ringFigure";

/** Palette mirrors the DESIGN.md tokens (three.js needs literal colors, not CSS variables). */
const INK = "#18211a";
const GREEN = "#2f6a3b";
const PAPER = "#f4f2ea";
const HAIRLINE = "#c4bfae";

const R = 1.6;
const TAU = Math.PI * 2;
/** Ring fraction (clockwise from 12 o'clock) → angle in the XY plane (counter-clockwise from +X). */
const angleOf = (f: number) => Math.PI / 2 - f * TAU;
const KEY_ANGLE = angleOf(keyFraction);
const SWEEP = replicaSweep * TAU;
const MAX_TILT = THREE.MathUtils.degToRad(8);
const TRAVEL_S = 2.6;
const REST_S = 0.9;

function Ring() {
  const tilt = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const packet = useRef<THREE.Mesh>(null);
  const beads = useRef<(THREE.Mesh | null)[]>([]);

  // The key's replicas, ordered by how far clockwise the packet must travel to reach them.
  const replicaStops = useMemo(
    () =>
      ringNodes
        .map((n, i) => ({ i, at: ((n.f - keyFraction + 1) % 1) / (replicaSweep || 1) }))
        .filter((s) => ringNodes[s.i].replica >= 0),
    [],
  );

  useFrame((state, delta) => {
    if (!tilt.current || !spin.current || !packet.current) return;

    // Gentle pointer tilt, eased.
    const tx = -state.pointer.y * MAX_TILT;
    const ty = state.pointer.x * MAX_TILT;
    tilt.current.rotation.x = THREE.MathUtils.damp(tilt.current.rotation.x, -0.95 + tx, 3, delta);
    tilt.current.rotation.y = THREE.MathUtils.damp(tilt.current.rotation.y, ty, 3, delta);

    // Slow idle spin of the whole ring in its own plane.
    spin.current.rotation.z += delta * 0.08;

    // Packet travels clockwise from the key to the last replica, rests, repeats.
    const cycle = state.clock.elapsedTime % (TRAVEL_S + REST_S);
    const t = Math.min(1, cycle / TRAVEL_S);
    const eased = 1 - Math.pow(1 - t, 3);
    const a = KEY_ANGLE - SWEEP * eased;
    packet.current.position.set(R * Math.cos(a), R * Math.sin(a), 0);

    // A replica bead swells briefly as the packet reaches it.
    for (const stop of replicaStops) {
      const bead = beads.current[stop.i];
      if (!bead) continue;
      const near = Math.max(0, 1 - Math.abs(eased - stop.at) * 10);
      const s = THREE.MathUtils.damp(bead.scale.x, 1 + near * 0.45, 8, delta);
      bead.scale.setScalar(s);
    }
  });

  return (
    <group ref={tilt} rotation={[-0.95, 0, 0]}>
      <group ref={spin}>
        {/* main ring + faint guide rings */}
        <mesh>
          <torusGeometry args={[R, 0.012, 12, 256]} />
          <meshStandardMaterial color={INK} roughness={0.9} />
        </mesh>
        <mesh>
          <torusGeometry args={[R + 0.35, 0.004, 8, 256]} />
          <meshBasicMaterial color={HAIRLINE} />
        </mesh>
        <mesh>
          <torusGeometry args={[R - 0.35, 0.004, 8, 256]} />
          <meshBasicMaterial color={HAIRLINE} transparent opacity={0.6} />
        </mesh>

        {/* replica arc: clockwise from the key to its last replica */}
        <mesh rotation={[0, 0, KEY_ANGLE - SWEEP]}>
          <torusGeometry args={[R, 0.024, 12, 160, SWEEP]} />
          <meshStandardMaterial color={GREEN} roughness={0.7} />
        </mesh>

        {/* storage nodes */}
        {ringNodes.map((n, i) => {
          const a = angleOf(n.f);
          const isReplica = n.replica >= 0;
          return (
            <mesh
              key={n.id}
              ref={(m) => {
                beads.current[i] = m;
              }}
              position={[R * Math.cos(a), R * Math.sin(a), 0]}
            >
              <sphereGeometry args={[isReplica ? 0.1 : 0.08, 32, 32]} />
              <meshStandardMaterial color={isReplica ? GREEN : PAPER} roughness={0.85} />
            </mesh>
          );
        })}

        {/* the key and the packet carrying it */}
        <mesh position={[R * Math.cos(KEY_ANGLE), R * Math.sin(KEY_ANGLE), 0]}>
          <sphereGeometry args={[0.055, 24, 24]} />
          <meshStandardMaterial color={INK} roughness={0.8} />
        </mesh>
        <mesh ref={packet}>
          <sphereGeometry args={[0.06, 24, 24]} />
          <meshStandardMaterial color={GREEN} emissive={GREEN} emissiveIntensity={0.25} roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
}

export default function HashRing3D({ active, onReady }: { active: boolean; onReady: () => void }) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 2]}
      camera={{ position: [0, 0, 6.9], fov: 35 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      onCreated={() => onReady()}
    >
      <ambientLight intensity={1.1} />
      <directionalLight position={[2, 3, 4]} intensity={1.4} />
      <directionalLight position={[-3, -2, 2]} intensity={0.35} />
      <Ring />
    </Canvas>
  );
}
