"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Suspense, useRef, useState } from "react";
import { TextureLoader, type Group } from "three";

function Globe({ rotation, zoom }: { rotation: React.MutableRefObject<{ x: number; y: number; dragging: boolean }>; zoom: number }) {
  const group = useRef<Group>(null);
  const texture = useLoader(TextureLoader, "/textures/mars.jpg");
  const autoRotation = useRef(0);
  useFrame((_, delta) => {
    if (!group.current) return;
    if (!rotation.current.dragging) autoRotation.current += delta * 0.07;
    group.current.rotation.x = rotation.current.x;
    group.current.rotation.y = rotation.current.y + autoRotation.current;
  });
  return <group ref={group} scale={2.8 / zoom}><mesh><sphereGeometry args={[1, 64, 64]} /><meshStandardMaterial map={texture} roughness={1} /></mesh></group>;
}

export default function MarsGlobe() {
  const rotation = useRef({ x: 0.12, y: 0, dragging: false });
  const pointer = useRef({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(2.8);
  return <div className="globe-shell">
    <div className="globe-canvas" onPointerDown={(event) => { rotation.current.dragging = true; pointer.current = { x: event.clientX, y: event.clientY }; event.currentTarget.setPointerCapture(event.pointerId); }} onPointerMove={(event) => { if (!rotation.current.dragging) return; rotation.current.y += (event.clientX - pointer.current.x) * .008; rotation.current.x = Math.max(-1.1, Math.min(1.1, rotation.current.x + (event.clientY - pointer.current.y) * .008)); pointer.current = { x: event.clientX, y: event.clientY }; }} onPointerUp={() => { rotation.current.dragging = false; }} onPointerCancel={() => { rotation.current.dragging = false; }}>
      <Canvas camera={{ position: [0, 0, 2.8], fov: 42 }} dpr={[1, 1.5]} fallback={<div className="globe-fallback planet mars-planet"><div className="planet-texture" /></div>}><ambientLight intensity={1.1}/><directionalLight position={[-4, 2, 4]} intensity={2.3}/><Suspense fallback={null}><Globe rotation={rotation} zoom={zoom}/></Suspense></Canvas>
    </div>
    <div className="globe-controls" aria-label="Controles del globo"><button onClick={() => { rotation.current.y -= .35; }} aria-label="Girar Marte a la izquierda">←</button><button onClick={() => { rotation.current.y += .35; }} aria-label="Girar Marte a la derecha">→</button><button onClick={() => setZoom(value => Math.max(2, value - .3))} aria-label="Acercar Marte">+</button><button onClick={() => setZoom(value => Math.min(4, value + .3))} aria-label="Alejar Marte">−</button><button onClick={() => { rotation.current.x = .12; rotation.current.y = 0; setZoom(2.8); }} aria-label="Restablecer vista">↺</button></div>
    <span className="globe-hint">ARRASTRA PARA GIRAR · + / − PARA ACERCAR</span>
  </div>;
}




