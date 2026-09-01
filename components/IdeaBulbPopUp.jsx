"use client";

// components/IdeaBulbPopUp.jsx
//
// "💡 Ampolleta de Ideas": pop-up interactivo de LandingScreen.jsx que
// reemplaza a la mascota "Cerebrito ADIPA" de la iteración anterior. Una
// ampolleta/bombilla ilustrada en SVG propio (vidrio con degradado
// dorado, base metálica, brillo y destellos) se desliza sola por el pie
// de la pantalla y se detiene a mitad de camino. El dato curioso, en
// cambio, NO está pegado a la ampolleta: es un cuadro celeste
// independiente que se reposiciona en distintos puntos de TODA la
// tarjeta (esquinas y costados) cada vez que se abre, para que la
// interacción se sienta más dinámica. Si el usuario toca la ampolleta en
// cualquier momento, esta se detiene de inmediato, emite un destello y
// el cuadro muestra un dato nuevo en una nueva posición sin esperar a
// llegar al medio.
//
// Recorrido de la ampolleta: 4 puntos de referencia (izquierda → medio →
// derecha → medio → ...), en ciclo. Solo se detiene y abre el pop-up en
// el punto medio (50%); en los extremos simplemente invierte de
// dirección y sigue.
//
// Colores: el cuadro del dato usa exactamente el mismo degradado
// morado→celeste de las tarjetas de Instagram del Adipa Social Kit (ver
// StoryFrame en ShareCard.jsx: bg-gradient-to-b from-primary-purple
// to-primary-cyan), con un borde neón brillante + destellos -mismo
// estilo que la ampolleta- y texto blanco de alto contraste, para que la
// estética del pop-up quede unificada con el resto del kit.
//
// Animación: el desplazamiento horizontal de la ampolleta (con parada
// exacta a mitad de camino y reacción inmediata al click) lo maneja este
// componente vía una transición CSS sobre `left`; el balanceo vertical
// continuo (@keyframes floating-slide), el resplandor cálido de "idea
// encendida" (idea-glow-flicker), el destello al tocarla (idea-glow-pop)
// y el titileo de los destellos (sparkle-twinkle) están definidos en
// app/globals.css y usan solo transform/opacity -aceleradas por
// hardware- para mantenerse a 60fps. La aparición/desaparición del
// cuadro del dato usa una transición CSS simple de opacity + transform.

import { useEffect, useRef, useState } from "react";

const FUN_FACTS = [
  "Caminar 20 minutos en un entorno natural reduce el cortisol (hormona del estrés) en un 21%.",
  "El cerebro humano procesa imágenes y estímulos visuales hasta 60.000 veces más rápido que el texto.",
  "Practicar la gratitud de forma constante reorganiza las conexiones de la corteza prefrontal aumentando la resiliencia.",
  "Existen más de 50 áreas y enfoques de especialización dentro de la psicología moderna y la neurociencia.",
  "Escuchar música durante el estudio activa ambos hemisferios cerebrales facilitando la consolidación de la memoria.",
];

// Puntos de referencia del recorrido de la ampolleta (% desde la
// izquierda del carril): izquierda -> medio -> derecha -> medio ->
// (repite). Solo "medio" (50) dispara la parada + pop-up.
const WAYPOINTS = [8, 50, 92, 50];
const TRAVEL_MS = 3400;
const POPUP_AUTO_MS = 6000;
const CLOSE_TRANSITION_MS = 260;
const GLOW_POP_MS = 550;

// Posiciones posibles del cuadro del dato curioso, repartidas por toda
// la tarjeta (no solo cerca de la ampolleta) para que el pop-up "se
// mueva por toda la pantalla". Cada una trae su propio `style` de
// ubicación y las transformaciones oculto/visible correspondientes
// -las posiciones centrales usan solo translateY(-50%) para mantenerse
// centradas verticalmente, en vez del leve "slide up" de las demás-.
const POPUP_POSITIONS = [
  {
    key: "top-left",
    style: { top: "20px", left: "20px" },
    hidden: "translateY(10px) scale(0.96)",
    visible: "translateY(0) scale(1)",
  },
  {
    key: "top-right",
    style: { top: "20px", right: "20px" },
    hidden: "translateY(10px) scale(0.96)",
    visible: "translateY(0) scale(1)",
  },
  {
    key: "mid-left",
    style: { top: "46%", left: "14px" },
    hidden: "translateY(-50%)",
    visible: "translateY(-50%) scale(1)",
  },
  {
    key: "mid-right",
    style: { top: "46%", right: "14px" },
    hidden: "translateY(-50%)",
    visible: "translateY(-50%) scale(1)",
  },
  {
    key: "low-left",
    style: { bottom: "190px", left: "18px" },
    hidden: "translateY(10px) scale(0.96)",
    visible: "translateY(0) scale(1)",
  },
  {
    key: "low-right",
    style: { bottom: "190px", right: "18px" },
    hidden: "translateY(10px) scale(0.96)",
    visible: "translateY(0) scale(1)",
  },
];

function BulbIllustration() {
  return (
    <svg viewBox="0 0 100 100" className="relative h-full w-full" role="img" aria-label="Ampolleta de Ideas ADIPA">
      <defs>
        <radialGradient id="idea-bulb-glass" cx="38%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#FFFDF3" />
          <stop offset="45%" stopColor="#FFE9A8" />
          <stop offset="100%" stopColor="#FFB020" />
        </radialGradient>
        <linearGradient id="idea-bulb-base" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E7EEF5" />
          <stop offset="45%" stopColor="#AEB9C4" />
          <stop offset="100%" stopColor="#7C8896" />
        </linearGradient>
      </defs>

      {/* Vidrio: silueta clásica de ampolleta (globo + cuello) */}
      <path
        d="M50,10 C69,10 82,24 82,42 C82,54 76,62 68,68 C65,71 63,74 63,78 L37,78 C37,74 35,71 32,68 C24,62 18,54 18,42 C18,24 31,10 50,10 Z"
        fill="url(#idea-bulb-glass)"
        stroke="#FFF6DE"
        strokeWidth="2"
      />

      {/* Cuello / rosca metálica */}
      <rect x="38" y="78" width="24" height="5" rx="1.5" fill="url(#idea-bulb-base)" />
      <rect x="38" y="85" width="24" height="5" rx="1.5" fill="url(#idea-bulb-base)" />
      <rect x="39" y="92" width="22" height="6" rx="2.5" fill="#5C6672" />

      {/* Brillo de vidrio */}
      <path d="M32,26 C28,34 27,42 30,50" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" opacity="0.75" />
      <ellipse cx="38" cy="24" rx="6" ry="9" fill="#FFFFFF" opacity="0.55" />

      {/* Filamento */}
      <path
        d="M42,60 L50,44 L50,60 L58,44"
        fill="none"
        stroke="#C5720A"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.8"
      />
      <circle cx="42" cy="60" r="2" fill="#C5720A" opacity="0.8" />
      <circle cx="58" cy="60" r="2" fill="#C5720A" opacity="0.8" />
    </svg>
  );
}

export default function IdeaBulbPopUp() {
  const trackRef = useRef(null);
  const bulbRef = useRef(null);
  const waypointIndexRef = useRef(0);
  const posIndexRef = useRef(-1);
  const timerRef = useRef(null);

  const [xPercent, setXPercent] = useState(WAYPOINTS[0]);
  const [transitionMs, setTransitionMs] = useState(TRAVEL_MS);
  const [factIndex, setFactIndex] = useState(0);
  const [posIndex, setPosIndex] = useState(0);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [glowPop, setGlowPop] = useState(false);

  const clearTimer = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  // Elige una posición al azar para el cuadro del dato, evitando repetir
  // la misma posición dos veces seguidas -así se nota que "se mueve por
  // toda la pantalla" en cada aparición-.
  const pickNextPosition = () => {
    let next = Math.floor(Math.random() * POPUP_POSITIONS.length);
    if (POPUP_POSITIONS.length > 1 && next === posIndexRef.current) {
      next = (next + 1) % POPUP_POSITIONS.length;
    }
    posIndexRef.current = next;
    setPosIndex(next);
  };

  const closePopupThenContinue = () => {
    clearTimer();
    setPopupVisible(false);
    timerRef.current = window.setTimeout(() => {
      setPopupOpen(false);
      goToNextWaypoint();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, CLOSE_TRANSITION_MS);
  };

  const openPopup = () => {
    setFactIndex((prev) => (prev + 1) % FUN_FACTS.length);
    pickNextPosition();
    setPopupOpen(true);
    // Un frame después, para que la transición de opacidad/posición se note.
    requestAnimationFrame(() => setPopupVisible(true));
    clearTimer();
    timerRef.current = window.setTimeout(closePopupThenContinue, POPUP_AUTO_MS);
  };

  function goToNextWaypoint() {
    clearTimer();
    setTransitionMs(TRAVEL_MS);
    waypointIndexRef.current = (waypointIndexRef.current + 1) % WAYPOINTS.length;
    const nextX = WAYPOINTS[waypointIndexRef.current];
    setXPercent(nextX);

    timerRef.current = window.setTimeout(() => {
      if (nextX === 50) {
        openPopup();
      } else {
        goToNextWaypoint();
      }
    }, TRAVEL_MS);
  }

  // Arranca el recorrido al montar.
  useEffect(() => {
    goToNextWaypoint();
    return () => clearTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBulbClick = () => {
    clearTimer();

    // Congela la posición actual exacta: lee el % real ya interpolado
    // por la transición CSS en curso (getBoundingClientRect siempre
    // refleja la posición visual en vivo, incluso a mitad de una
    // transición), para que la parada se vea instantánea y sin saltos.
    if (trackRef.current && bulbRef.current) {
      const trackRect = trackRef.current.getBoundingClientRect();
      const bulbRect = bulbRef.current.getBoundingClientRect();
      const bulbCenterX = bulbRect.left + bulbRect.width / 2;
      const currentPercent = ((bulbCenterX - trackRect.left) / trackRect.width) * 100;
      setTransitionMs(0);
      setXPercent(Math.max(4, Math.min(96, currentPercent)));
    }

    setGlowPop(true);
    window.setTimeout(() => setGlowPop(false), GLOW_POP_MS);

    openPopup();
  };

  const handleRefreshClick = (event) => {
    event.stopPropagation();
    clearTimer();
    setFactIndex((prev) => (prev + 1) % FUN_FACTS.length);
    timerRef.current = window.setTimeout(closePopupThenContinue, POPUP_AUTO_MS);
  };

  const activePosition = POPUP_POSITIONS[posIndex] ?? POPUP_POSITIONS[0];

  return (
    <>
      {/* Cuadro del dato curioso: independiente de la ampolleta, se
          reposiciona por distintos puntos de TODA la tarjeta (no solo
          junto al pie). Mismo degradado morado→celeste que las tarjetas
          de Instagram del Social Kit (from-primary-purple to-primary-cyan
          en ShareCard.jsx), con borde neón + destellos y texto blanco de
          alto contraste. */}
      {popupOpen && (
        <div
          className={`pointer-events-none absolute z-20 w-[230px] max-w-[68vw] rounded-[20px] border-2 border-white/40 bg-gradient-to-b from-primary-purple to-primary-cyan px-4 py-3.5 text-left shadow-[0_10px_30px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.1),0_0_26px_rgba(44,183,255,0.55)] transition-[opacity,transform] duration-200 ease-out ${
            popupVisible ? "pointer-events-auto opacity-100" : "opacity-0"
          }`}
          style={{
            ...activePosition.style,
            transform: popupVisible ? activePosition.visible : activePosition.hidden,
          }}
        >
          {/* Destellos, mismo estilo/animación que los de la ampolleta. */}
          <span
            className="pointer-events-none absolute -left-1.5 -top-1.5 text-[11px] text-[#FFF3C4] animate-sparkle-twinkle"
            style={{ animationDelay: "0.2s" }}
          >
            ✦
          </span>
          <span
            className="pointer-events-none absolute -right-1.5 top-3 text-[11px] text-[#FFF3C4] animate-sparkle-twinkle"
            style={{ animationDelay: "0.9s" }}
          >
            ✦
          </span>
          <span
            className="pointer-events-none absolute -bottom-1.5 left-4 text-[11px] text-[#FFF3C4] animate-sparkle-twinkle"
            style={{ animationDelay: "1.4s" }}
          >
            ✦
          </span>

          <div className="mb-1.5 flex items-center justify-between gap-2">
            <span className="text-xs font-extrabold text-white drop-shadow-sm">💡 ¿Sabías qué?</span>
            <button
              type="button"
              onClick={handleRefreshClick}
              className="flex-shrink-0 rounded-full border border-white/40 bg-white/15 px-2.5 py-1 text-[10px] font-bold text-white transition hover:border-white/70 hover:bg-white/25"
            >
              🔄 Otro dato
            </button>
          </div>
          <p className="text-xs font-medium leading-snug text-white sm:text-[13px]">{FUN_FACTS[factIndex]}</p>
        </div>
      )}

      {/* Carril de la ampolleta: franja angosta en el pie de la tarjeta
          por donde se desliza sola. */}
      <div
        ref={trackRef}
        className="pointer-events-none absolute inset-x-3 bottom-3 z-10 h-16 sm:inset-x-6 sm:bottom-4"
      >
        <div
          ref={bulbRef}
          className="pointer-events-auto absolute bottom-0 flex flex-col items-center"
          style={{
            left: `${xPercent}%`,
            transform: "translateX(-50%)",
            transition: `left ${transitionMs}ms ease-in-out`,
          }}
        >
          {/* Ampolleta: bob vertical continuo + resplandor cálido, con la
              posición horizontal controlada por el wrapper de arriba. */}
          <div className="animate-floating-slide">
            <button
              type="button"
              onClick={handleBulbClick}
              aria-label="Ver un dato curioso"
              className="relative h-14 w-14 sm:h-16 sm:w-16"
            >
              <span
                className={`absolute -inset-3.5 rounded-full bg-[radial-gradient(circle,rgba(255,196,64,0.55)_0%,rgba(255,196,64,0)_70%)] ${
                  glowPop ? "animate-idea-glow-pop" : "animate-idea-glow-flicker"
                }`}
              />
              <span
                className="absolute -left-1.5 -top-0.5 text-[11px] text-[#FFF3C4] animate-sparkle-twinkle"
                style={{ animationDelay: "0s" }}
              >
                ✦
              </span>
              <span
                className="absolute -right-2 top-2 text-[11px] text-[#FFF3C4] animate-sparkle-twinkle"
                style={{ animationDelay: "0.6s" }}
              >
                ✦
              </span>
              <span
                className="absolute -left-2 bottom-1 text-[11px] text-[#FFF3C4] animate-sparkle-twinkle"
                style={{ animationDelay: "1.1s" }}
              >
                ✦
              </span>
              <BulbIllustration />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
