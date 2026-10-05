"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** DESIGN.md tokens as literals (three.js can't read CSS variables). */
const INK = "#18211a";
const GREEN = "#2f6a3b";
const GREEN_DEEP = "#1f4a29";
const LEAF = "#8fb184";
const PAPER = "#f4f2ea";

const BOWL_R = 1; // world units; the canvas is sized so the bowl fills the hero's sun circle
const SWIM_R = 0.52; // keep the fish well inside the glass

/** A small original fish: ellipsoid body, forked tail that wags, dorsal and side fins. */
function Fish() {
  const root = useRef<THREE.Group>(null);
  const tail = useRef<THREE.Group>(null);
  const prev = useMemo(() => new THREE.Vector3(), []);
  const next = useMemo(() => new THREE.Vector3(), []);

  // Tail fin: a flat triangle fanning back from the body.
  const tailGeo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(-0.2, 0.12);
    shape.quadraticCurveTo(-0.16, 0, -0.2, -0.12);
    shape.lineTo(0, 0);
    return new THREE.ShapeGeometry(shape);
  }, []);
  const finGeo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0.06, 0);
    shape.quadraticCurveTo(0, 0.1, -0.08, 0.06);
    shape.lineTo(-0.06, 0);
    shape.lineTo(0.06, 0);
    return new THREE.ShapeGeometry(shape);
  }, []);

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.1);
    const t = state.clock.elapsedTime * 0.32;
    // Slow figure-of-eight loop inside the bowl (Lissajous), with a gentle bob.
    const pos = (time: number, out: THREE.Vector3) =>
      out.set(
        Math.sin(time) * SWIM_R,
        Math.sin(time * 2) * SWIM_R * 0.32 + Math.sin(time * 0.7) * 0.05,
        Math.cos(time) * SWIM_R * 0.55,
      );
    pos(t, prev);
    pos(t + 0.05, next);
    if (!root.current || !tail.current) return;
    root.current.position.copy(prev);
    // Face the direction of travel, eased so turns read as swimming, not snapping.
    const target = new THREE.Matrix4().lookAt(next, prev, THREE.Object3D.DEFAULT_UP);
    const q = new THREE.Quaternion().setFromRotationMatrix(target);
    // Model faces +X; lookAt aims -Z, so rotate the frame a quarter turn.
    q.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 2));
    root.current.quaternion.slerp(q, 1 - Math.exp(-4 * delta));
    tail.current.rotation.y = Math.sin(state.clock.elapsedTime * 7) * 0.45;
  });

  return (
    <group ref={root} scale={1.15}>
      {/* body */}
      <mesh scale={[0.26, 0.15, 0.1]}>
        <sphereGeometry args={[1, 32, 24]} />
        <meshStandardMaterial color={GREEN} roughness={0.55} />
      </mesh>
      {/* pale belly stripe */}
      <mesh position={[0.02, -0.04, 0]} scale={[0.2, 0.08, 0.085]}>
        <sphereGeometry args={[1, 24, 16]} />
        <meshStandardMaterial color={LEAF} roughness={0.6} />
      </mesh>
      {/* eyes */}
      {[0.09, -0.09].map((z) => (
        <mesh key={z} position={[0.17, 0.035, z * 0.72]}>
          <sphereGeometry args={[0.022, 12, 12]} />
          <meshStandardMaterial color={INK} roughness={0.3} />
        </mesh>
      ))}
      {/* tail, pivoting at the back of the body */}
      <group ref={tail} position={[-0.24, 0, 0]}>
        <mesh geometry={tailGeo}>
          <meshStandardMaterial color={GREEN_DEEP} roughness={0.6} side={THREE.DoubleSide} />
        </mesh>
      </group>
      {/* dorsal fin */}
      <mesh geometry={finGeo} position={[0, 0.13, 0]}>
        <meshStandardMaterial color={GREEN_DEEP} roughness={0.6} side={THREE.DoubleSide} />
      </mesh>
      {/* side fins */}
      {[0.1, -0.1].map((z) => (
        <mesh key={z} geometry={finGeo} position={[0.05, -0.05, z]} rotation={[z > 0 ? 0.9 : -0.9, 0, Math.PI]} scale={0.7}>
          <meshStandardMaterial color={LEAF} roughness={0.6} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

/** Bubbles drift up from the floor and respawn; positions are deterministic per bubble. */
function Bubbles({ count = 9 }: { count?: number }) {
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const seeds = useMemo(
    () => Array.from({ length: count }, (_, i) => ({ x: Math.sin(i * 12.9898) * 0.45, z: Math.cos(i * 4.1414) * 0.3, speed: 0.12 + (i % 4) * 0.035, phase: i / count })),
    [count],
  );
  useFrame((state) => {
    seeds.forEach((s, i) => {
      const m = refs.current[i];
      if (!m) return;
      const y = ((state.clock.elapsedTime * s.speed + s.phase) % 1) * 1.5 - 0.75;
      m.position.set(s.x + Math.sin(state.clock.elapsedTime * 1.3 + i) * 0.03, y, s.z);
      const fade = 1 - Math.abs(y) / 0.8; // shrink near floor and surface
      m.scale.setScalar(Math.max(0.2, fade));
    });
  });
  return (
    <>
      {seeds.map((_, i) => (
        <mesh key={i} ref={(m) => { refs.current[i] = m; }}>
          <sphereGeometry args={[0.022, 12, 12]} />
          <meshStandardMaterial color={PAPER} transparent opacity={0.85} roughness={0.2} />
        </mesh>
      ))}
    </>
  );
}

/** Two thin weed strands rooted at the floor, swaying. */
function Weed() {
  const a = useRef<THREE.Group>(null);
  const b = useRef<THREE.Group>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (a.current) a.current.rotation.z = Math.sin(t * 0.8) * 0.12;
    if (b.current) b.current.rotation.z = Math.sin(t * 0.8 + 1.4) * 0.14;
  });
  const strand = (h: number) => (
    <mesh position={[0, h / 2, 0]}>
      <capsuleGeometry args={[0.022, h, 4, 8]} />
      <meshStandardMaterial color={GREEN} roughness={0.8} />
    </mesh>
  );
  return (
    <>
      <group ref={a} position={[-0.32, -0.74, 0.1]}>{strand(0.42)}</group>
      <group ref={b} position={[-0.2, -0.76, -0.1]}>{strand(0.3)}</group>
    </>
  );
}

function Bowl() {
  return (
    <>
      {/* glass: faint paper body + a slightly darker rim seen from inside */}
      <mesh>
        <sphereGeometry args={[BOWL_R, 64, 48]} />
        <meshStandardMaterial color={PAPER} transparent opacity={0.12} roughness={0.1} depthWrite={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[BOWL_R * 0.995, 64, 48]} />
        <meshStandardMaterial color={LEAF} transparent opacity={0.1} side={THREE.BackSide} depthWrite={false} />
      </mesh>
      {/* sandy floor */}
      <mesh position={[0, -0.78, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.56, 48]} />
        <meshBasicMaterial color="#e8e2cc" transparent opacity={0.9} />
      </mesh>
      {/* specular highlight arc, upper-left, like light on glass */}
      <mesh position={[-0.42, 0.5, 0.62]} rotation={[0, 0, 0.7]}>
        <torusGeometry args={[0.22, 0.012, 8, 32, 1.2]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.7} />
      </mesh>
    </>
  );
}

export default function Fishbowl3D({ active, onReady }: { active: boolean; onReady: () => void }) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 2]}
      camera={{ position: [0, 0, 3.2], fov: 38 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      onCreated={() => onReady()}
    >
      <ambientLight intensity={1.15} />
      <directionalLight position={[2, 3, 3]} intensity={1.3} />
      <directionalLight position={[-2, -1, 2]} intensity={0.3} />
      <Bowl />
      <Weed />
      <Bubbles />
      <Fish />
    </Canvas>
  );
}
