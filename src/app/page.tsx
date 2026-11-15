"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { ArrowDown, ArrowRight, ArrowUp, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import "./marsa.css";

const SpaceJourney = dynamic(() => import("./space-journey"), {
  ssr: false,
  loading: () => <div className="space-loader" aria-hidden="true" />,
});

export type Language = "en" | "es";

interface RegionInfo {
  name: string;
  number: string;
  type: string;
  statement: string;
  focus: string;
}

interface SceneMeta {
  id: string;
  nav: string;
  destination: string;
}

interface ContentDictionary {
  edition: string;
  travelling: string;
  scenes: readonly SceneMeta[];
  regions: readonly RegionInfo[];
  scene0: {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    lead: string;
  };
  scene1: {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    lead: string;
    facts: readonly string[];
  };
  scene2: {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    lead: string;
    facts: readonly string[];
  };
  scene3: {
    eyebrow: string;
    titleLine1: string;
    titleHighlight: string;
    flowAria: string;
    source: string;
    target: string;
    steps: readonly string[];
    statement: string;
  };
  scene4: {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    lead: string;
    badge: string;
  };
  scene5: {
    eyebrow: string;
    title: string;
    subtitle: string;
    tabsAria: string;
    disclaimer: string;
  };
  scene6: {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    lead: string;
    qaPrompt: string;
  };
  aria: {
    brandHome: string;
    navLabel: string;
    prevScene: string;
    sceneCount: (curr: number, total: number) => string;
    goTo: (nav: string) => string;
    langGroup: string;
    switchToEn: string;
    switchToEs: string;
  };
}

const CONTENT: Record<Language, ContentDictionary> = {
  en: {
    edition: "SPACE APPS · 2026",
    travelling: "TRAVELLING",
    scenes: [
      { id: "universo", nav: "Home", destination: "TRAVEL TO MARS" },
      { id: "marte", nav: "Mars", destination: "TRAVEL TO EARTH" },
      { id: "tierra", nav: "Earth", destination: "SEE THE CONNECTION" },
      { id: "metodo", nav: "Method", destination: "CONTINUE TO THE MOON" },
      { id: "luna", nav: "Moon", destination: "OPEN THE ANNEX" },
      { id: "anexo", nav: "Annex", destination: "THANK YOU" },
      { id: "cierre", nav: "Closing", destination: "RETURN TO START" },
    ],
    regions: [
      {
        name: "Jezero Crater",
        number: "01",
        type: "ANCIENT LAKE",
        statement: "Sediments and clay minerals preserve signatures of a watery past.",
        focus: "SEDIMENTARY GEOLOGY",
      },
      {
        name: "Olympus Mons",
        number: "02",
        type: "SHIELD VOLCANO",
        statement: "Basalt and expansive lava flows define a monumental volcanic terrain.",
        focus: "VOLCANIC TERRAINS",
      },
      {
        name: "Valles Marineris",
        number: "03",
        type: "CANYON SYSTEM",
        statement: "Fractures and dramatic slopes expose the tectonic history of the Martian crust.",
        focus: "GEOMORPHOLOGY & RISK",
      },
    ],
    scene0: {
      eyebrow: "EARTH & MARS ANALOG EXPLORER",
      titleLine1: "Space is",
      titleLine2: "our starting point.",
      lead: "MARSA connects worlds to prepare for the future of space exploration.",
    },
    scene1: {
      eyebrow: "FIRST DESTINATION · MARS",
      titleLine1: "One planet.",
      titleLine2: "Many questions.",
      lead: "Three Martian regions mark the beginning of our quest.",
      facts: ["SEDIMENTS", "VOLCANISM", "EXTREME RELIEF"],
    },
    scene2: {
      eyebrow: "THE LABORATORY · EARTH",
      titleLine1: "The proving ground",
      titleLine2: "where we can test.",
      lead: "Deserts, volcanoes, and extreme lakes allow us to study conditions relevant to other worlds.",
      facts: ["OPEN DATA", "REAL ACCESS", "FIELD TRIALS"],
    },
    scene3: {
      eyebrow: "THE METHOD · FROM ONE WORLD TO ANOTHER",
      titleLine1: "Compare to ",
      titleHighlight: "discover.",
      flowAria: "Analysis flow from Mars to Earth",
      source: "MARS",
      target: "EARTH",
      steps: ["EXPLORE", "CHARACTERIZE", "COMPARE", "PROPOSE"],
      statement: "Geological, topographic, and environmental data converted into an intuitive visual search for candidates.",
    },
    scene4: {
      eyebrow: "NEXT EXPANSION",
      titleLine1: "The Moon is",
      titleLine2: "the next horizon.",
      lead: "The methodology will extend to analog site prospecting for future lunar bases.",
      badge: "COMING SOON",
    },
    scene5: {
      eyebrow: "ANNEX · THREE STARTING POINTS",
      title: "Landscapes of Mars.",
      subtitle: "Select a region to explore its scientific focus.",
      tabsAria: "Martian regions",
      disclaimer: "Decision support tool. Every candidate requires scientific data, methodology, and validation.",
    },
    scene6: {
      eyebrow: "NASA SPACE APPS CHALLENGE 2026 · MARSA",
      titleLine1: "Thank you.",
      titleLine2: "Questions & Discussion.",
      lead: "Advancing planetary exploration by bridging the gap between Earth and Martian analog science.",
      qaPrompt: "READY FOR QUESTIONS & ANSWERS · SPACE APPS 2026",
    },
    aria: {
      brandHome: "Return to start",
      navLabel: "Presentation scenes",
      prevScene: "Previous scene",
      sceneCount: (curr, total) => `Scene ${curr} of ${total}`,
      goTo: (nav) => `Go to ${nav}`,
      langGroup: "Language switcher",
      switchToEn: "Switch to English",
      switchToEs: "Cambiar a español",
    },
  },
  es: {
    edition: "SPACE APPS · 2026",
    travelling: "VIAJANDO",
    scenes: [
      { id: "universo", nav: "Inicio", destination: "VIAJAR A MARTE" },
      { id: "marte", nav: "Marte", destination: "VIAJAR A LA TIERRA" },
      { id: "tierra", nav: "Tierra", destination: "VER LA CONEXIÓN" },
      { id: "metodo", nav: "Método", destination: "CONTINUAR A LA LUNA" },
      { id: "luna", nav: "Luna", destination: "ABRIR EL ANEXO" },
      { id: "anexo", nav: "Anexo", destination: "AGRADECIMIENTOS" },
      { id: "cierre", nav: "Cierre", destination: "VOLVER AL INICIO" },
    ],
    regions: [
      {
        name: "Jezero Crater",
        number: "01",
        type: "ANTIGUO LAGO",
        statement: "Sedimentos y arcillas conservan señales de un pasado acuoso.",
        focus: "GEOLOGÍA SEDIMENTARIA",
      },
      {
        name: "Olympus Mons",
        number: "02",
        type: "VOLCÁN EN ESCUDO",
        statement: "Basalto y coladas de lava definen un terreno volcánico monumental.",
        focus: "TERRENOS VOLCÁNICOS",
      },
      {
        name: "Valles Marineris",
        number: "03",
        type: "SISTEMA DE CAÑONES",
        statement: "Fracturas y pendientes exponen la historia de la corteza marciana.",
        focus: "GEOMORFOLOGÍA Y RIESGO",
      },
    ],
    scene0: {
      eyebrow: "EARTH & MARS ANALOG EXPLORER",
      titleLine1: "El espacio es",
      titleLine2: "nuestro punto de partida.",
      lead: "MARSA conecta mundos para preparar la exploración del futuro.",
    },
    scene1: {
      eyebrow: "PRIMER DESTINO · MARTE",
      titleLine1: "Un planeta.",
      titleLine2: "Muchas preguntas.",
      lead: "Tres regiones marcianas marcan el inicio de la búsqueda.",
      facts: ["SEDIMENTOS", "VOLCANISMO", "RELIEVE EXTREMO"],
    },
    scene2: {
      eyebrow: "EL LABORATORIO · TIERRA",
      titleLine1: "El lugar donde",
      titleLine2: "podemos probar.",
      lead: "Desiertos, volcanes y lagos permiten estudiar condiciones relevantes de otros mundos.",
      facts: ["DATOS ABIERTOS", "ACCESO REAL", "PRUEBAS DE CAMPO"],
    },
    scene3: {
      eyebrow: "EL MÉTODO · DE UN MUNDO AL OTRO",
      titleLine1: "Comparar para ",
      titleHighlight: "descubrir.",
      flowAria: "Flujo de análisis de Marte a la Tierra",
      source: "MARTE",
      target: "TIERRA",
      steps: ["EXPLORAR", "CARACTERIZAR", "COMPARAR", "PROPONER"],
      statement: "Datos geológicos, topográficos y ambientales convertidos en una búsqueda visual de candidatos.",
    },
    scene4: {
      eyebrow: "PRÓXIMA EXPANSIÓN",
      titleLine1: "La Luna es",
      titleLine2: "el siguiente horizonte.",
      lead: "La metodología podrá extenderse a la búsqueda de análogos para futuras bases lunares.",
      badge: "PRÓXIMAMENTE",
    },
    scene5: {
      eyebrow: "ANEXO · TRES PUNTOS DE PARTIDA",
      title: "Paisajes de Marte.",
      subtitle: "Selecciona una región para explorar su enfoque.",
      tabsAria: "Regiones de Marte",
      disclaimer: "Herramienta de apoyo. Todo candidato requiere datos, metodología y validación científica.",
    },
    scene6: {
      eyebrow: "NASA SPACE APPS CHALLENGE 2026 · MARSA",
      titleLine1: "Muchas gracias.",
      titleLine2: "Preguntas y debate.",
      lead: "Impulsando la exploración planetaria al conectar la ciencia de análogos terrestres y marcianos.",
      qaPrompt: "SESIÓN DE PREGUNTAS Y RESPUESTAS · SPACE APPS 2026",
    },
    aria: {
      brandHome: "Volver al inicio",
      navLabel: "Escenas de la presentación",
      prevScene: "Escena anterior",
      sceneCount: (curr, total) => `Escena ${curr} de ${total}`,
      goTo: (nav) => `Ir a ${nav}`,
      langGroup: "Selector de idioma",
      switchToEn: "Switch to English",
      switchToEs: "Cambiar a español",
    },
  },
};

function SceneContent({
  scene,
  activeRegion,
  onRegionChange,
  lang,
}: {
  scene: number;
  activeRegion: number;
  onRegionChange: (index: number) => void;
  lang: Language;
}) {
  const t = CONTENT[lang];
  const region = t.regions[activeRegion];

  if (scene === 0) {
    return (
      <section className="content-panel hero-panel" aria-labelledby="scene-title">
        <p className="eyebrow">{t.scene0.eyebrow}</p>
        <h1 id="scene-title">
          {t.scene0.titleLine1}
          <br />
          {t.scene0.titleLine2}
        </h1>
        <p className="lead">{t.scene0.lead}</p>
      </section>
    );
  }

  if (scene === 1) {
    return (
      <section className="content-panel world-panel world-panel-left" aria-labelledby="scene-title">
        <p className="eyebrow mars-accent">{t.scene1.eyebrow}</p>
        <h1 id="scene-title">
          {t.scene1.titleLine1}
          <br />
          <span>{t.scene1.titleLine2}</span>
        </h1>
        <p className="lead">{t.scene1.lead}</p>
        <div className="fact-row">
          {t.scene1.facts.map((fact) => (
            <span key={fact}>{fact}</span>
          ))}
        </div>
      </section>
    );
  }

  if (scene === 2) {
    return (
      <section className="content-panel world-panel world-panel-right" aria-labelledby="scene-title">
        <p className="eyebrow earth-accent">{t.scene2.eyebrow}</p>
        <h1 id="scene-title">
          {t.scene2.titleLine1}
          <br />
          <span>{t.scene2.titleLine2}</span>
        </h1>
        <p className="lead">{t.scene2.lead}</p>
        <div className="fact-row">
          {t.scene2.facts.map((fact) => (
            <span key={fact}>{fact}</span>
          ))}
        </div>
      </section>
    );
  }

  if (scene === 3) {
    return (
      <section className="content-panel method-panel" aria-labelledby="scene-title">
        <p className="eyebrow">{t.scene3.eyebrow}</p>
        <h1 id="scene-title">
          {t.scene3.titleLine1}
          <span>{t.scene3.titleHighlight}</span>
        </h1>
        <div className="comparison-line" aria-label={t.scene3.flowAria}>
          <strong>{t.scene3.source}</strong>
          <i />
          {t.scene3.steps.map((step) => (
            <span key={step}>{step}</span>
          ))}
          <i />
          <strong>{t.scene3.target}</strong>
        </div>
        <p className="method-statement">{t.scene3.statement}</p>
      </section>
    );
  }

  if (scene === 4) {
    return (
      <section className="content-panel world-panel world-panel-left moon-panel" aria-labelledby="scene-title">
        <p className="eyebrow moon-accent">{t.scene4.eyebrow}</p>
        <h1 id="scene-title">
          {t.scene4.titleLine1}
          <br />
          <span>{t.scene4.titleLine2}</span>
        </h1>
        <p className="lead">{t.scene4.lead}</p>
        <strong className="coming-soon">{t.scene4.badge}</strong>
      </section>
    );
  }

  if (scene === 5) {
    return (
      <section className="content-panel annex-panel" aria-labelledby="scene-title">
        <div className="annex-title">
          <div>
            <p className="eyebrow mars-accent">{t.scene5.eyebrow}</p>
            <h1 id="scene-title">{t.scene5.title}</h1>
          </div>
          <p>{t.scene5.subtitle}</p>
        </div>
        <div className="region-deck">
          <div className="region-tabs" aria-label={t.scene5.tabsAria}>
            {t.regions.map((item, index) => (
              <button
                key={item.name}
                aria-pressed={activeRegion === index}
                onClick={() => onRegionChange(index)}
              >
                <span>{item.number}</span>
                <strong>{item.name}</strong>
                <ArrowRight size={16} />
              </button>
            ))}
          </div>
          <div className="region-detail" aria-live="polite">
            <p className="region-type">{region.type}</p>
            <h2>{region.name}</h2>
            <p>{region.statement}</p>
            <strong>{region.focus}</strong>
          </div>
        </div>
        <p className="disclaimer">{t.scene5.disclaimer}</p>
      </section>
    );
  }

  return (
    <section className="content-panel hero-panel thankyou-panel" aria-labelledby="scene-title">
      <p className="eyebrow">{t.scene6.eyebrow}</p>
      <h1 id="scene-title">
        {t.scene6.titleLine1}
        <br />
        <span>{t.scene6.titleLine2}</span>
      </h1>
      <p className="lead">{t.scene6.lead}</p>
      <div className="thankyou-footer">
        <div className="qa-callout">
          <strong>{t.scene6.qaPrompt}</strong>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [lang, setLang] = useState<Language>("en");
  const [targetScene, setTargetScene] = useState(0);
  const [visibleScene, setVisibleScene] = useState(0);
  const [travelling, setTravelling] = useState(false);
  const [activeRegion, setActiveRegion] = useState(0);

  const t = CONTENT[lang];
  const scenes = t.scenes;

  const navigateTo = useCallback(
    (nextScene: number) => {
      if (travelling || nextScene === targetScene || nextScene < 0 || nextScene >= scenes.length) return;
      setTravelling(true);
      setTargetScene(nextScene);
    },
    [scenes.length, targetScene, travelling]
  );

  const handleArrive = useCallback((scene: number) => {
    setVisibleScene(scene);
    setTravelling(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        navigateTo(Math.min(scenes.length - 1, targetScene + 1));
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        navigateTo(Math.max(0, targetScene - 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigateTo, scenes.length, targetScene]);

  const nextScene = targetScene === scenes.length - 1 ? 0 : targetScene + 1;

  return (
    <main className={`marsa journey scene-${visibleScene} ${travelling ? "is-travelling" : "is-arrived"}`}>
      <SpaceJourney scene={targetScene} travelling={travelling} onArrive={handleArrive} />
      <div className="cinematic-vignette" aria-hidden="true" />
      <div className="warp-lines" aria-hidden="true" />

      <header className="journey-nav">
        <button className="brand" onClick={() => navigateTo(0)} aria-label={t.aria.brandHome}>
          <Image
            src="/marsa.png"
            alt="MARSA"
            width={108}
            height={36}
            priority
            className="brand-logo"
          />
        </button>

        <nav aria-label={t.aria.navLabel}>
          {scenes.map((scene, index) => (
            <button
              key={scene.id}
              className={visibleScene === index ? "active" : ""}
              onClick={() => navigateTo(index)}
            >
              {scene.nav}
            </button>
          ))}
        </nav>

        <div className="nav-actions">
          <div className="lang-switch" role="group" aria-label={t.aria.langGroup}>
            <button
              type="button"
              className={`lang-btn ${lang === "en" ? "active" : ""}`}
              onClick={() => setLang("en")}
              aria-label={t.aria.switchToEn}
              aria-pressed={lang === "en"}
            >
              EN
            </button>
            <span className="lang-divider" aria-hidden="true">|</span>
            <button
              type="button"
              className={`lang-btn ${lang === "es" ? "active" : ""}`}
              onClick={() => setLang("es")}
              aria-label={t.aria.switchToEs}
              aria-pressed={lang === "es"}
            >
              ES
            </button>
          </div>

          <span className="edition">{t.edition}</span>
        </div>
      </header>

      <div className="content-layer" key={visibleScene} aria-live="polite">
        <SceneContent
          scene={visibleScene}
          activeRegion={activeRegion}
          onRegionChange={setActiveRegion}
          lang={lang}
        />
      </div>

      <div className="journey-status" aria-hidden={!travelling}>
        <span />
        <p>{travelling ? t.travelling : scenes[visibleScene].nav.toUpperCase()}</p>
        <span />
      </div>

      <div className="journey-controls">
        <button
          className="direction-button previous"
          onClick={() => navigateTo(targetScene - 1)}
          aria-disabled={travelling || targetScene === 0}
          aria-label={t.aria.prevScene}
        >
          <ArrowUp size={18} />
        </button>

        <div className="progress-dots" aria-label={t.aria.sceneCount(visibleScene + 1, scenes.length)}>
          {scenes.map((scene, index) => (
            <button
              key={scene.id}
              className={visibleScene === index ? "active" : ""}
              onClick={() => navigateTo(index)}
              aria-disabled={travelling}
              aria-label={t.aria.goTo(scene.nav)}
            />
          ))}
        </div>

        <button
          className="direction-button next"
          onClick={() => navigateTo(nextScene)}
          aria-disabled={travelling}
          aria-label={scenes[targetScene].destination}
        >
          {targetScene === scenes.length - 1 ? <RotateCcw size={18} /> : <ArrowDown size={18} />}
          <span>{scenes[targetScene].destination}</span>
        </button>
      </div>

      <div className="scene-number">
        <strong>0{visibleScene + 1}</strong>
        <span>/ 0{scenes.length}</span>
      </div>
    </main>
  );
}
