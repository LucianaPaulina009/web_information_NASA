"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, Compass, Layers3, Orbit, ScanLine } from "lucide-react";
import "./marsa.css";
import MarsGlobe from "./mars-globe";

const regions = [
  { name: "Jezero Crater", number: "01", type: "ANTIGUO LAGO", description: "Un antiguo lago y delta fluvial conservan pistas sobre el pasado acuoso de Marte.", tags: ["Sedimentos", "Carbonatos", "Arcillas"], detail: "Buscar terrenos con depósitos sedimentarios y minerales comparables." },
  { name: "Olympus Mons", number: "02", type: "VOLCÁN EN ESCUDO", description: "Un volcán monumental que revela la historia volcánica de la superficie marciana.", tags: ["Basalto", "Coladas de lava", "Elevación"], detail: "Explorar campos volcánicos para estudiar geología y movilidad." },
  { name: "Valles Marineris", number: "03", type: "SISTEMA DE CAÑONES", description: "Una red de cañones donde quedan expuestas capas geológicas y pendientes extremas.", tags: ["Fracturas", "Erosión", "Pendientes"], detail: "Investigar geomorfología, navegación y riesgos del terreno." },
];
const sources = [
  ["NASA PDS", "Datos de misiones planetarias", "https://pds.nasa.gov/"],
  ["NASA Mars Trek", "Mapas de la superficie marciana", "https://trek.nasa.gov/mars/"],
  ["USGS Astrogeology", "Cartografía y topografía planetaria", "https://astrogeology.usgs.gov/"],
  ["NASA Earthdata", "Observaciones satelitales terrestres", "https://www.earthdata.nasa.gov/"],
  ["NASADEM", "Elevación de la superficie terrestre", "https://www.earthdata.nasa.gov/data/instruments/nasadem"],
];

export default function Home() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    }), { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
  const region = regions[active];
  return (
    <main className="marsa">
      <div className="starfield" aria-hidden="true" />
      <header className="nav">
        <a className="brand" href="#inicio" aria-label="MARSA, inicio"><span className="brand-mark">✳</span> MARSA<span className="brand-dot">.</span></a>
        <nav aria-label="Navegación principal"><a href="#mision">La misión</a><a href="#regiones">Explorar</a><a href="#metodo">El método</a></nav>
        <a className="nav-link" href="#fuentes">FUENTES <ArrowUpRight size={14}/></a>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-orbit orbit-one" aria-hidden="true"/><div className="hero-orbit orbit-two" aria-hidden="true"/>
        <div className="hero-planet planet mars-planet" aria-hidden="true"><div className="planet-texture"/></div>
        <div className="hero-copy">
          <div className="eyebrow"><span className="live-dot"/> NASA SPACE APPS CHALLENGE 2026 <span className="eyebrow-line"/> EARTH & MARS ANALOG EXPLORER</div>
          <h1>Dos mundos.<br/><em>Una búsqueda.</em></h1>
          <p>Exploramos Marte para encontrar en la Tierra lugares que nos ayuden a comprenderlo mejor.</p>
          <a className="primary-button" href="#mision">DESCUBRIR MARSA <ArrowDown size={16}/></a>
        </div>
        <div className="hero-side"><span>01 / 05</span><div/><span>EL COMIENZO</span></div>
        <div className="hero-bottom"><span>UNA NUEVA PERSPECTIVA PARA LA EXPLORACIÓN</span><span>DESLIZA PARA EXPLORAR <ArrowDown size={14}/></span><span>MARTE · TIERRA</span></div>
        <div className="planet-caption"><span className="caption-line"/> MARTE <small>EL PLANETA ROJO</small></div>
      </section>

      <section className="mission section-pad" id="mision">
        <div className="section-kicker reveal"><span>01 / LA MISIÓN</span><span className="kicker-line"/><span>EL DESAFÍO</span></div>
        <div className="mission-grid reveal"><div><p className="overline">LA EXPLORACIÓN COMIENZA AQUÍ</p><h2>Para llegar más lejos,<br/><span>miramos más cerca.</span></h2></div><div className="mission-copy"><p>Antes de explorar otros mundos, necesitamos lugares donde poner a prueba nuestras ideas.</p><p>Encontrarlos implica conectar información geológica, topográfica y ambiental de múltiples fuentes. MARSA propone hacer esa búsqueda más clara y visual.</p><a href="#metodo" className="text-link">CONOCE LA PROPUESTA <ArrowRight size={16}/></a></div></div>
        <div className="mission-bottom reveal"><div><span>01</span><p>UN PLANETA POR EXPLORAR</p></div><div><span>∞</span><p>POSIBILIDADES EN LA TIERRA</p></div><div className="mission-note">UNA HERRAMIENTA DE APOYO<br/>PARA LA INVESTIGACIÓN CIENTÍFICA</div></div>
      </section>

      <section className="regions section-pad" id="regiones">
        <div className="section-kicker reveal"><span>02 / DESTINOS</span><span className="kicker-line"/><span>MARTE</span></div>
        <div className="regions-heading reveal"><div><p className="overline">UN MUNDO DE POSIBILIDADES</p><h2>Todo comienza<br/><span>en Marte.</span></h2></div><p>Tres paisajes. Diferentes historias geológicas. Un punto de partida para encontrar sus posibles análogos terrestres.</p></div>
        <div className="region-explorer reveal">
          <div className="region-list" aria-label="Regiones de Marte">{regions.map((item, index) => <button key={item.name} aria-pressed={active === index} onClick={() => setActive(index)} className={active === index ? "active" : ""}><span>{item.number}</span><strong>{item.name}</strong><ArrowUpRight size={18}/></button>)}</div>
          <div className="region-visual"><MarsGlobe/><span className="visual-label">MARTE EN 3D<br/><b>VISUALIZACIÓN ILUSTRATIVA</b></span><span className="visual-index">{region.number} / 03</span></div>
          <div className="region-info" aria-live="polite"><p className="overline">{region.type}</p><h3>{region.name}</h3><p>{region.description}</p><div className="tag-list">{region.tags.map(tag => <span key={tag}>{tag}</span>)}</div><div className="region-detail"><span>INTERÉS DE INVESTIGACIÓN</span><p>{region.detail}</p></div></div>
        </div>
      </section>

      <section className="bridge section-pad" id="metodo">
        <div className="section-kicker reveal"><span>03 / EL MÉTODO</span><span className="kicker-line"/><span>DE MARTE A LA TIERRA</span></div>
        <div className="bridge-heading reveal"><p className="overline blue">CONECTANDO DOS MUNDOS</p><h2>La distancia es enorme.<br/><span>Las preguntas nos acercan.</span></h2><p>MARSA plantea un flujo de análisis que parte de una región marciana y busca características comparables en nuestro planeta.</p></div>
        <div className="worlds reveal"><div className="world mars-small planet mars-planet"><div className="planet-texture"/></div><div className="connection"><span>MARTE</span><div><i/></div><span>TIERRA</span></div><div className="world earth-small planet earth-planet"><div className="planet-texture"/></div></div>
        <div className="steps reveal"><article><Compass size={22}/><span>01</span><h3>Explorar</h3><p>Seleccionar una región marciana y conocer su contexto.</p></article><article><Layers3 size={22}/><span>02</span><h3>Caracterizar</h3><p>Analizar propiedades del terreno y los datos disponibles.</p></article><article><ScanLine size={22}/><span>03</span><h3>Comparar</h3><p>Buscar lugares terrestres con características relevantes.</p></article><article><Orbit size={22}/><span>04</span><h3>Investigar</h3><p>Examinar candidatos, diferencias y fuentes científicas.</p></article></div>
      </section>

      <section className="sources section-pad" id="fuentes"><div className="section-kicker reveal"><span>04 / CONOCIMIENTO ABIERTO</span><span className="kicker-line"/><span>FUENTES</span></div><div className="sources-grid reveal"><div><p className="overline">CIENCIA QUE NOS CONECTA</p><h2>Datos abiertos.<br/><span>Nuevas preguntas.</span></h2><p className="source-intro">La propuesta contempla fuentes científicas abiertas para estudiar ambos planetas. Cada conjunto de datos requiere procesamiento y evaluación antes de compararse.</p></div><div className="source-list">{sources.map(([name, description, url]) => <a href={url} target="_blank" rel="noreferrer" key={name}><div><strong>{name}</strong><span>{description}</span></div><ArrowUpRight size={18}/></a>)}</div></div></section>
      <section className="finale section-pad"><div className="final-glow"/><div className="reveal"><p className="overline">EL SIGUIENTE PASO COMIENZA AQUÍ</p><h2>La Tierra puede ayudarnos<br/><span>a entender Marte.</span></h2><p>MARSA es una propuesta en desarrollo. La identificación de candidatos y su validación requieren datos, metodología y evaluación por especialistas.</p><a className="primary-button" href="#inicio">VOLVER AL INICIO <ArrowUpRight size={16}/></a></div></section>
      <footer><a className="brand" href="#inicio"><span className="brand-mark">✳</span> MARSA<span className="brand-dot">.</span></a><span>EARTH & MARS ANALOG EXPLORER</span><span>NASA SPACE APPS CHALLENGE 2026 · TEXTURAS: <a href="https://www.solarsystemscope.com/textures/" target="_blank" rel="noreferrer">SOLAR SYSTEM SCOPE</a></span></footer>
    </main>
  );
}



