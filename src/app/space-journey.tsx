"use client";

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Suspense, useCallback, useEffect, useMemo, useRef, type ReactNode, type RefObject } from "react";
import { AdditiveBlending, Color, DoubleSide, MathUtils, TextureLoader, Vector3, type Group, type Mesh, type PerspectiveCamera, type WebGLRendererParameters } from "three";

type Point = [number, number, number];

const OVERVIEW_POSITION: Point = [0.2, 8.7, 20.5];
const OVERVIEW_FOCUS: Point = [1.2, 0, 0];
const CAMERA_OPTIONS = { position: OVERVIEW_POSITION, fov: 45, near: 0.03, far: 150 };
const EARTH_FALLBACK: Point = [7, 0, 0];
const MARS_FALLBACK: Point = [11, 0.1, 0];
const MOON_FALLBACK: Point = [7.88, 0.08, 0.12];

type BodyRefs = {
  earth: RefObject<Group | null>;
  mars: RefObject<Group | null>;
  moon: RefObject<Group | null>;
};

function seededRandom(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

function createStarField(count: number, radius: number) {
  const positions = new Float32Array(count * 3);
  for (let index = 0; index < count; index += 1) {
    const distance = radius * (0.35 + seededRandom(index + 1) * 0.65);
    const theta = seededRandom(index + 101) * Math.PI * 2;
    const phi = Math.acos(2 * seededRandom(index + 301) - 1);
    positions[index * 3] = distance * Math.sin(phi) * Math.cos(theta);
    positions[index * 3 + 1] = distance * Math.cos(phi);
    positions[index * 3 + 2] = distance * Math.sin(phi) * Math.sin(theta);
  }
  return positions;
}

function createGalaxy(count: number) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const core = new Color("#fff5d8");
  const edge = new Color("#7396d8");
  for (let index = 0; index < count; index += 1) {
    const arm = index % 4;
    const radius = Math.pow(seededRandom(index + 701), 0.72) * 24;
    const spin = radius * 0.34 + (arm / 4) * Math.PI * 2;
    const scatter = (seededRandom(index + 901) - 0.5) * (1.3 + radius * 0.07);
    positions[index * 3] = Math.cos(spin) * radius + scatter;
    positions[index * 3 + 1] = (seededRandom(index + 1101) - 0.5) * (0.6 + radius * 0.035);
    positions[index * 3 + 2] = Math.sin(spin) * radius + scatter;
    const color = core.clone().lerp(edge, Math.min(1, radius / 24));
    colors[index * 3] = color.r;
    colors[index * 3 + 1] = color.g;
    colors[index * 3 + 2] = color.b;
  }
  return { positions, colors };
}

const STAR_POSITIONS = createStarField(520, 70);
const GALAXY = createGalaxy(980);
const GL_OPTIONS: WebGLRendererParameters = { antialias: false, alpha: false, powerPreference: "high-performance" };

function Stars({ travelling }: { travelling: boolean }) {
  const stars = useRef<Group>(null);
  useFrame((_, delta) => {
    if (!stars.current) return;
    stars.current.rotation.y += delta * (travelling ? 0.055 : 0.003);
    stars.current.rotation.z += delta * (travelling ? 0.012 : 0.0004);
  });
  return (
    <group ref={stars}>
      <points>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[STAR_POSITIONS, 3]} /></bufferGeometry>
        <pointsMaterial color="#dce9ff" size={0.065} sizeAttenuation />
      </points>
      <points rotation={[0.3, 0.15, -0.38]}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[GALAXY.positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[GALAXY.colors, 3]} />
        </bufferGeometry>
        <pointsMaterial vertexColors size={0.045} />
      </points>
    </group>
  );
}

function Orbit({ radius }: { radius: number }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.008, radius + 0.008, 96]} />
      <meshBasicMaterial color="#87a1c2" transparent opacity={0.15} side={DoubleSide} />
    </mesh>
  );
}

function TexturedPlanet({ position, radius, texture, speed, tilt = 0 }: { position: Point; radius: number; texture: string; speed: number; tilt?: number }) {
  const mesh = useRef<Mesh>(null);
  const map = useLoader(TextureLoader, texture);
  useFrame((_, delta) => { if (mesh.current) mesh.current.rotation.y += delta * speed; });
  return <mesh ref={mesh} position={position} rotation={[0, 0, tilt]}><sphereGeometry args={[radius, 32, 32]} /><meshStandardMaterial map={map} roughness={0.9} /></mesh>;
}

function SolidPlanet({ position, radius, color }: { position: Point; radius: number; color: string }) {
  return <mesh position={position}><sphereGeometry args={[radius, 24, 24]} /><meshStandardMaterial color={color} roughness={0.88} metalness={0.02} /></mesh>;
}

function MoonPlanet() {
  const mesh = useRef<Mesh>(null);
  const map = useLoader(TextureLoader, "/textures/moon.jpg");
  useFrame((_, delta) => {
    if (mesh.current) mesh.current.rotation.y += Math.min(delta, 0.05) * 0.1;
  });
  return (
    <mesh ref={mesh} rotation={[0.08, 0, 0.03]}>
      <sphereGeometry args={[0.135, 64, 64]} />
      <meshStandardMaterial map={map} roughness={0.92} metalness={0.02} />
    </mesh>
  );
}

function OrbitingBody({ radius, height = 0, angle, speed, bodyRef, children }: { radius: number; height?: number; angle: number; speed: number; bodyRef?: RefObject<Group | null>; children: ReactNode }) {
  const localRef = useRef<Group>(null);
  const orbit = bodyRef ?? localRef;
  const phase = useRef(angle);
  useFrame((_, delta) => {
    phase.current += Math.min(delta, 0.05) * speed;
    orbit.current?.position.set(radius * Math.cos(phase.current), height, -radius * Math.sin(phase.current));
  });
  return <group ref={orbit} position={[radius * Math.cos(angle), height, -radius * Math.sin(angle)]}>{children}</group>;
}

function SolarSystem({ bodies }: { bodies: BodyRefs }) {
  return (
    <group position={[2.6, 0, 0]} rotation={[0.34, 0, 0]} scale={0.72}>
      {[2.2, 4.3, 7, 11, 15.4, 19.5].map((radius) => <Orbit radius={radius} key={radius} />)}
      <pointLight position={[0, 0, 0]} color="#ffd9a1" intensity={220} distance={38} decay={1.65} />
      <mesh><sphereGeometry args={[1.05, 32, 32]} /><meshBasicMaterial color="#ffdd83" toneMapped={false} /></mesh>
      <mesh><sphereGeometry args={[1.32, 32, 32]} /><meshBasicMaterial color="#ff9d36" transparent opacity={0.1} blending={AdditiveBlending} side={DoubleSide} /></mesh>
      <OrbitingBody radius={2.2} angle={0.35} speed={0.13}><SolidPlanet position={[0, 0, 0]} radius={0.14} color="#aaa39b" /></OrbitingBody>
      <OrbitingBody radius={4.3} height={0.04} angle={2.2} speed={0.082}><SolidPlanet position={[0, 0, 0]} radius={0.31} color="#d6aa70" /></OrbitingBody>
      <OrbitingBody radius={7} angle={0.12} speed={0.055} bodyRef={bodies.earth}>
        <TexturedPlanet position={[0, 0, 0]} radius={0.38} texture="/textures/earth.jpg" speed={0.1} tilt={0.2} />
        <OrbitingBody radius={0.88} height={0.08} angle={0.8} speed={0.16} bodyRef={bodies.moon}><MoonPlanet /></OrbitingBody>
      </OrbitingBody>
      <OrbitingBody radius={11} height={0.1} angle={-0.18} speed={0.043} bodyRef={bodies.mars}><TexturedPlanet position={[0, 0, 0]} radius={0.32} texture="/textures/mars.jpg" speed={0.075} tilt={0.1} /></OrbitingBody>
      <OrbitingBody radius={15.4} height={0.1} angle={1.42} speed={0.022}><SolidPlanet position={[0, 0, 0]} radius={0.82} color="#c89f79" /></OrbitingBody>
      <OrbitingBody radius={19.5} height={0.1} angle={-1.05} speed={0.016}>
        <group rotation={[0.25, 0, -0.3]}><SolidPlanet position={[0, 0, 0]} radius={0.68} color="#d6c38f" /><mesh rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.88, 1.35, 64]} /><meshStandardMaterial color="#bba779" transparent opacity={0.72} side={DoubleSide} /></mesh></group>
      </OrbitingBody>
    </group>
  );
}

function readWorldPosition(reference: RefObject<Group | null>, fallback: Point, result: Vector3) {
  if (reference.current) return reference.current.getWorldPosition(result);
  return result.set(...fallback);
}

function CameraJourney({ scene, onArrive, bodies }: { scene: number; onArrive: (scene: number) => void; bodies: BodyRefs }) {
  const getThreeState = useThree((state) => state.get);
  const viewportWidth = useThree((state) => state.size.width);
  const aspect = useThree((state) => state.size.width / Math.max(1, state.size.height));
  const closeup = scene === 1 || scene === 2 || scene === 4;
  // Halve the projected field for a 2× close-up, with room for the globe
  // on portrait screens (Earth is the widest of the three close-ups).
  const zoom = closeup ? MathUtils.clamp(aspect * 2.5, 1, 2) : 1;
  const startPosition = useRef(new Vector3(...OVERVIEW_POSITION));
  const startFocus = useRef(new Vector3(...OVERVIEW_FOCUS));
  const currentFocus = useRef(new Vector3(...OVERVIEW_FOCUS));
  const targetPosition = useRef(new Vector3(...OVERVIEW_POSITION));
  const targetFocus = useRef(new Vector3(...OVERVIEW_FOCUS));
  const anchor = useRef(new Vector3());
  const earthPosition = useRef(new Vector3());
  const marsPosition = useRef(new Vector3());
  const viewDirection = useRef(new Vector3());
  const cameraRight = useRef(new Vector3());
  const cameraOffset = useRef(new Vector3());
  const worldUp = useRef(new Vector3(0, 1, 0));
  const startFov = useRef(45);
  const targetFov = useRef(45);
  const progress = useRef(1);
  const arrivedScene = useRef(0);

  const resolveDestination = useCallback(() => {
    if (scene === 0) {
      targetPosition.current.set(...OVERVIEW_POSITION);
      targetFocus.current.set(...OVERVIEW_FOCUS);
      return;
    }
    if (scene === 3) {
      readWorldPosition(bodies.earth, EARTH_FALLBACK, earthPosition.current);
      readWorldPosition(bodies.mars, MARS_FALLBACK, marsPosition.current);
      anchor.current.copy(earthPosition.current).add(marsPosition.current).multiplyScalar(0.5);
      targetPosition.current.copy(anchor.current).add(cameraOffset.current.set(0, 4.1, 9.5));
      targetFocus.current.copy(anchor.current);
      return;
    }
    const isEarth = scene === 2;
    const isMoon = scene === 4;
    const reference = isEarth ? bodies.earth : isMoon ? bodies.moon : bodies.mars;
    const fallback = isEarth ? EARTH_FALLBACK : isMoon ? MOON_FALLBACK : MARS_FALLBACK;
    readWorldPosition(reference, fallback, anchor.current);
    const distance = isMoon ? 0.48 : isEarth ? 2.35 : 2.7;
    const height = isMoon ? 0.06 : 0.48;
    targetPosition.current.copy(anchor.current).add(cameraOffset.current.set(isMoon ? 0.04 : 0.08, height, distance));
    viewDirection.current.copy(anchor.current).sub(targetPosition.current).normalize();
    cameraRight.current.crossVectors(viewDirection.current, worldUp.current).normalize();
    const desktopOffset = isMoon ? 0.15 : isEarth ? 0.35 : 0.42;
    const composition = desktopOffset * (viewportWidth < 900 ? 0.48 : 1) / zoom;
    const direction = isEarth ? 1 : -1;
    targetFocus.current.copy(anchor.current).addScaledVector(cameraRight.current, composition * direction);
  }, [bodies, scene, viewportWidth, zoom]);

  useEffect(() => {
    const perspectiveCamera = getThreeState().camera as PerspectiveCamera;
    startPosition.current.copy(perspectiveCamera.position);
    startFocus.current.copy(currentFocus.current);
    startFov.current = perspectiveCamera.fov;
    targetFov.current = scene === 0 || scene === 3
      ? 45
      : MathUtils.radToDeg(2 * Math.atan(Math.tan(MathUtils.degToRad(20)) / zoom));
    resolveDestination();
    if (scene === 0 && arrivedScene.current === 0) {
      perspectiveCamera.position.set(...OVERVIEW_POSITION);
      currentFocus.current.set(...OVERVIEW_FOCUS);
      perspectiveCamera.fov = targetFov.current;
      perspectiveCamera.lookAt(currentFocus.current);
      perspectiveCamera.updateProjectionMatrix();
      progress.current = 1;
      return;
    }
    progress.current = 0;
  }, [getThreeState, resolveDestination, scene, zoom]);

  useFrame(({ camera }, frameDelta) => {
    const delta = Math.min(frameDelta, 0.05);
    const perspectiveCamera = camera as PerspectiveCamera;
    if (scene === 0 && progress.current >= 1) return;
    resolveDestination();
    if (progress.current >= 1) {
      const tracking = 1 - Math.exp(-delta * 3.2);
      perspectiveCamera.position.lerp(targetPosition.current, tracking);
      currentFocus.current.lerp(targetFocus.current, tracking);
      perspectiveCamera.lookAt(currentFocus.current);
      return;
    }
    progress.current = Math.min(1, progress.current + delta / 1.8);
    const raw = progress.current;
    const eased = raw * raw * (3 - 2 * raw);
    perspectiveCamera.position.lerpVectors(startPosition.current, targetPosition.current, eased);
    perspectiveCamera.position.y += Math.sin(raw * Math.PI) * 0.7;
    currentFocus.current.lerpVectors(startFocus.current, targetFocus.current, eased);
    perspectiveCamera.lookAt(currentFocus.current);
    perspectiveCamera.fov = MathUtils.lerp(startFov.current, targetFov.current, eased);
    perspectiveCamera.updateProjectionMatrix();
    if (raw === 1 && arrivedScene.current !== scene) {
      arrivedScene.current = scene;
      onArrive(scene);
    }
  });
  return null;
}

function JourneyScene({ scene, travelling, onArrive }: { scene: number; travelling: boolean; onArrive: (scene: number) => void }) {
  const earth = useRef<Group>(null);
  const mars = useRef<Group>(null);
  const moon = useRef<Group>(null);
  const bodies = useMemo<BodyRefs>(() => ({ earth, mars, moon }), []);
  return (
    <>
      <color attach="background" args={["#01030a"]} />
      <fog attach="fog" args={["#01030a", 22, 82]} />
      <ambientLight intensity={0.16} />
      <directionalLight position={[6, 2, 8]} intensity={0.22} color="#b4c9e8" />
      <Stars travelling={travelling} />
      <SolarSystem bodies={bodies} />
      <CameraJourney scene={scene} onArrive={onArrive} bodies={bodies} />
    </>
  );
}

export default function SpaceJourney({ scene, travelling, onArrive }: { scene: number; travelling: boolean; onArrive: (scene: number) => void }) {
  return (
    <div className="space-canvas" aria-hidden="true">
      <Canvas camera={CAMERA_OPTIONS} dpr={1} gl={GL_OPTIONS} style={{ pointerEvents: "none" }}>
        <Suspense fallback={null}><JourneyScene scene={scene} travelling={travelling} onArrive={onArrive} /></Suspense>
      </Canvas>
    </div>
  );
}
