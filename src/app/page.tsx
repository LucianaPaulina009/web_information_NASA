"use client";

import dynamic from "next/dynamic";
import { ArrowDown, ArrowRight, ArrowUp, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import "./marsa.css";

const SpaceJourney = dynamic(() => import("./space-journey"), {
  ssr: false,
  loading: () => <div className="space-loader" aria-hidden="true" />,
});

const SCENES = [
  { id: "universo", nav: "Inicio", destination: "VIAJAR A MARTE" },
  { id: "marte", nav: "Marte", destination: "VIAJAR A LA TIERRA" },
  { id: "tierra", nav: "Tierra", destination: "VER LA CONEXIÓN" },
  { id: "metodo", nav: "Método", destination: "CONTINUAR A LA LUNA" },
  { id: "luna", nav: "Luna", destination: "ABRIR EL ANEXO" },
  { id: "anexo", nav: "Anexo", destination: "VOLVER AL INICIO" },
] as const;

const REGIONS = [
  { name: "Jezero Crater", number: "01", type: "ANTIGUO LAGO", statement: "Sedimentos y arcillas conservan señales de un pasado acuoso.", focus: "GEOLOGÍA SEDIMENTARIA" },
  { name: "Olympus Mons", number: "02", type: "VOLCÁN EN ESCUDO", statement: "Basalto y coladas de lava definen un terreno volcánico monumental.", focus: "TERRENOS VOLCÁNICOS" },
  { name: "Valles Marineris", number: "03", type: "SISTEMA DE CAÑONES", statement: "Fracturas y pendientes exponen la historia de la corteza marciana.", focus: "GEOMORFOLOGÍA Y RIESGO" },
] as const;

function SceneContent({ scene, activeRegion, onRegionChange }: { scene: number; activeRegion: number; onRegionChange: (index: number) => void }) {
  const region = REGIONS[activeRegion];
  if (scene === 0) return (
    <section className="content-panel hero-panel" aria-labelledby="scene-title">
      <p className="eyebrow">EARTH & MARS ANALOG EXPLORER</p>
      <h1 id="scene-title">El espacio es<br />nuestro punto de partida.</h1>
      <p className="lead">MARSA conecta mundos para preparar la exploración del futuro.</p>
    </section>
  );
  if (scene === 1) return (
    <section className="content-panel world-panel world-panel-left" aria-labelledby="scene-title">
      <p className="eyebrow mars-accent">PRIMER DESTINO · MARTE</p>
      <h1 id="scene-title">Un planeta.<br /><span>Muchas preguntas.</span></h1>
      <p className="lead">Tres regiones marcianas marcan el inicio de la búsqueda.</p>
      <div className="fact-row"><span>SEDIMENTOS</span><span>VOLCANISMO</span><span>RELIEVE EXTREMO</span></div>
    </section>
  );
  if (scene === 2) return (
    <section className="content-panel world-panel world-panel-right" aria-labelledby="scene-title">
      <p className="eyebrow earth-accent">EL LABORATORIO · TIERRA</p>
      <h1 id="scene-title">El lugar donde<br /><span>podemos probar.</span></h1>
      <p className="lead">Desiertos, volcanes y lagos permiten estudiar condiciones relevantes de otros mundos.</p>
      <div className="fact-row"><span>DATOS ABIERTOS</span><span>ACCESO REAL</span><span>PRUEBAS DE CAMPO</span></div>
    </section>
  );
  if (scene === 3) return (
    <section className="content-panel method-panel" aria-labelledby="scene-title">
      <p className="eyebrow">EL MÉTODO · DE UN MUNDO AL OTRO</p>
      <h1 id="scene-title">Comparar para <span>descubrir.</span></h1>
      <div className="comparison-line" aria-label="Flujo de análisis de Marte a la Tierra">
        <strong>MARTE</strong><i /><span>EXPLORAR</span><span>CARACTERIZAR</span><span>COMPARAR</span><span>PROPONER</span><i /><strong>TIERRA</strong>
      </div>
      <p className="method-statement">Datos geológicos, topográficos y ambientales convertidos en una búsqueda visual de candidatos.</p>
    </section>
  );
  if (scene === 4) return (
    <section className="content-panel world-panel world-panel-left moon-panel" aria-labelledby="scene-title">
      <p className="eyebrow moon-accent">PRÓXIMA EXPANSIÓN</p>
      <h1 id="scene-title">La Luna es<br /><span>el siguiente horizonte.</span></h1>
      <p className="lead">La metodología podrá extenderse a la búsqueda de análogos para futuras bases lunares.</p>
      <strong className="coming-soon">PRÓXIMAMENTE</strong>
    </section>
  );
  return (
    <section className="content-panel annex-panel" aria-labelledby="scene-title">
      <div className="annex-title"><div><p className="eyebrow mars-accent">ANEXO · TRES PUNTOS DE PARTIDA</p><h1 id="scene-title">Paisajes de Marte.</h1></div><p>Selecciona una región para explorar su enfoque.</p></div>
      <div className="region-deck">
        <div className="region-tabs" aria-label="Regiones de Marte">
          {REGIONS.map((item, index) => <button key={item.name} aria-pressed={activeRegion === index} onClick={() => onRegionChange(index)}><span>{item.number}</span><strong>{item.name}</strong><ArrowRight size={16} /></button>)}
        </div>
        <div className="region-detail" aria-live="polite"><p className="region-type">{region.type}</p><h2>{region.name}</h2><p>{region.statement}</p><strong>{region.focus}</strong></div>
      </div>
      <p className="disclaimer">Herramienta de apoyo. Todo candidato requiere datos, metodología y validación científica.</p>
    </section>
  );
}

export default function Home() {
  const [targetScene, setTargetScene] = useState(0);
  const [visibleScene, setVisibleScene] = useState(0);
  const [travelling, setTravelling] = useState(false);
  const [activeRegion, setActiveRegion] = useState(0);

  const navigateTo = useCallback((nextScene: number) => {
    if (travelling || nextScene === targetScene || nextScene < 0 || nextScene >= SCENES.length) return;
    setTravelling(true);
    setTargetScene(nextScene);
  }, [targetScene, travelling]);

  const handleArrive = useCallback((scene: number) => {
    setVisibleScene(scene);
    setTravelling(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown") { event.preventDefault(); navigateTo(Math.min(SCENES.length - 1, targetScene + 1)); }
      if (event.key === "ArrowUp") { event.preventDefault(); navigateTo(Math.max(0, targetScene - 1)); }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigateTo, targetScene]);

  const nextScene = targetScene === SCENES.length - 1 ? 0 : targetScene + 1;

  return (
    <main className={`marsa journey scene-${visibleScene} ${travelling ? "is-travelling" : "is-arrived"}`}>
      <SpaceJourney scene={targetScene} travelling={travelling} onArrive={handleArrive} />
      <div className="cinematic-vignette" aria-hidden="true" />
      <div className="warp-lines" aria-hidden="true" />

      <header className="journey-nav">
        <button className="brand" onClick={() => navigateTo(0)} aria-label="Volver al inicio"><span>✳</span> MARSA<b>.</b></button>
        <nav aria-label="Escenas de la presentación">{SCENES.slice(0, 5).map((scene, index) => <button key={scene.id} className={visibleScene === index ? "active" : ""} onClick={() => navigateTo(index)}>{scene.nav}</button>)}</nav>
        <span className="edition">SPACE APPS · 2026</span>
      </header>

      <div className="content-layer" key={visibleScene} aria-live="polite">
        <SceneContent scene={visibleScene} activeRegion={activeRegion} onRegionChange={setActiveRegion} />
      </div>

      <div className="journey-status" aria-hidden={!travelling}><span /><p>{travelling ? "VIAJANDO" : SCENES[visibleScene].nav.toUpperCase()}</p><span /></div>

      <div className="journey-controls">
        <button className="direction-button previous" onClick={() => navigateTo(targetScene - 1)} aria-disabled={travelling || targetScene === 0} aria-label="Escena anterior"><ArrowUp size={18} /></button>
        <div className="progress-dots" aria-label={`Escena ${visibleScene + 1} de ${SCENES.length}`}>{SCENES.map((scene, index) => <button key={scene.id} className={visibleScene === index ? "active" : ""} onClick={() => navigateTo(index)} aria-disabled={travelling} aria-label={`Ir a ${scene.nav}`} />)}</div>
        <button className="direction-button next" onClick={() => navigateTo(nextScene)} aria-disabled={travelling} aria-label={SCENES[targetScene].destination}>{targetScene === SCENES.length - 1 ? <RotateCcw size={18} /> : <ArrowDown size={18} />}<span>{SCENES[targetScene].destination}</span></button>
      </div>

      <div className="scene-number"><strong>0{visibleScene + 1}</strong><span>/ 06</span></div>
    </main>
  );
}
