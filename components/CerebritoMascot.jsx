"use client";

// components/CerebritoMascot.jsx
//
// "Cerebrito ADIPA": mascota animada 100% original de LandingScreen.jsx,
// para hacer la primera interacción más dinámica, amigable y
// participativa. Personaje-cerebro ilustrado a mano en SVG (silueta de
// óvalo + 3 lóbulos, contorno neón vía filtro SVG, brazos y piernas
// propios), sin parecido a ninguna marca ni personaje con derechos de
// autor, en la paleta oficial de ADIPA (primary.purple, primary.cyan,
// secondary.navy).
//
// Va acompañado de una burbuja de diálogo estilo cómic/glassmorphism con
// un dato curioso sobre la mente y la psicología, que rota sola cada 7s
// (fade suave) o al tocar "🔄 Otro dato". El banco de datos vive en
// FUN_FACTS más abajo.
//
// Animación: @keyframes float-walk (definido en app/globals.css, junto a
// las de brazos/piernas/sombra) mueve solo `transform` y `opacity`
// -aceleradas por hardware- para mantenerse fluida a 60fps sin afectar el
// resto del flujo del Quiz. En móvil, el personaje y su burbuja quedan
// centrados sobre el título (antes de las 2 tarjetas de decisión), para
// no taparlas nunca.

import { useEffect, useRef, useState } from "react";

const FUN_FACTS = [
  "...caminar 20 minutos en un entorno natural reduce el cortisol (hormona del estrés) en un 21%?",
  "...el cerebro humano procesa imágenes y estímulos visuales hasta 60.000 veces más rápido que el texto?",
  "...practicar la gratitud de forma constante reorganiza las conexiones de la corteza prefrontal aumentando la resiliencia?",
  "...existen más de 50 ramas y enfoques de especialización dentro de la psicología moderna y la neurociencia?",
  "...escuchar música durante el estudio activa ambos hemisferios cerebrales facilitando la consolidación de la memoria?",
];

const ROTATE_INTERVAL_MS = 7000;
const FADE_MS = 220;

// Personaje ilustrado en SVG puro (sin imágenes externas). La silueta se
// arma superponiendo un óvalo + 3 círculos del mismo relleno (para que no
// se noten las costuras) dentro de un único filtro de contorno neón
// (feMorphology + feFlood + feComposite), en vez de tratar de dibujar un
// solo path complejo a mano.
function BrainCharacter() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" role="img" aria-label="Cerebrito ADIPA">
      <defs>
        <linearGradient id="cerebrito-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#9B7BFF" />
          <stop offset="100%" stopColor="#2CB7FF" />
        </linearGradient>
        <filter id="cerebrito-outline" x="-30%" y="-30%" width="160%" height="160%">
          <feMorphology operator="dilate" radius="1.6" in="SourceAlpha" result="dilated" />
          <feFlood floodColor="#B6F2FF" floodOpacity="0.95" />
          <feComposite in2="dilated" operator="in" result="outline" />
          <feMerge>
            <feMergeNode in="outline" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Piernas: rotan en sentido opuesto entre sí, simulando el paso al
          caminar (van detrás del cuerpo). */}
      <g className="animate-cerebrito-leg-left">
        <rect x="35" y="70" width="10" height="20" rx="5" fill="#432D86" />
      </g>
      <g className="animate-cerebrito-leg-right">
        <rect x="55" y="70" width="10" height="20" rx="5" fill="#432D86" />
      </g>

      {/* Brazos: se balancean como saludando (van detrás del cuerpo). */}
      <g className="animate-cerebrito-arm-left">
        <rect x="14" y="44" width="10" height="24" rx="5" fill="url(#cerebrito-gradient)" />
      </g>
      <g className="animate-cerebrito-arm-right">
        <rect x="76" y="44" width="10" height="24" rx="5" fill="url(#cerebrito-gradient)" />
      </g>

      {/* Silueta del cerebro: óvalo + 3 lóbulos superpuestos, mismo
          relleno degradado, con un único contorno neón. */}
      <g filter="url(#cerebrito-outline)">
        <ellipse cx="50" cy="50" rx="30" ry="27" fill="url(#cerebrito-gradient)" />
        <circle cx="31" cy="27" r="13" fill="url(#cerebrito-gradient)" />
        <circle cx="50" cy="20" r="14.5" fill="url(#cerebrito-gradient)" />
        <circle cx="69" cy="27" r="13" fill="url(#cerebrito-gradient)" />
      </g>

      {/* Textura de pliegues cerebrales */}
      <path
        d="M50,17 Q45,30 50,42 Q55,54 50,64"
        fill="none"
        stroke="#432D86"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.45"
      />
      <path
        d="M33,29 Q29,34 33,40"
        fill="none"
        stroke="#432D86"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.4"
      />
      <path
        d="M67,29 Q71,34 67,40"
        fill="none"
        stroke="#432D86"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.4"
      />

      {/* Mejillas */}
      <ellipse cx="32" cy="57" rx="4.5" ry="2.6" fill="#B6F2FF" opacity="0.5" />
      <ellipse cx="68" cy="57" rx="4.5" ry="2.6" fill="#B6F2FF" opacity="0.5" />

      {/* Ojos */}
      <circle cx="40" cy="49" r="7.2" fill="#FFFFFF" />
      <circle cx="60" cy="49" r="7.2" fill="#FFFFFF" />
      <circle cx="41.5" cy="50" r="3.6" fill="#091E42" />
      <circle cx="61.5" cy="50" r="3.6" fill="#091E42" />
      <circle cx="43" cy="47.5" r="1.2" fill="#FFFFFF" />
      <circle cx="63" cy="47.5" r="1.2" fill="#FFFFFF" />

      {/* Sonrisa */}
      <path
        d="M40,60 Q50,68 60,60"
        fill="none"
        stroke="#091E42"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function CerebritoMascot() {
  const [factIndex, setFactIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);

  const goToNextFact = () => {
    setVisible(false);
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      setFactIndex((prev) => (prev + 1) % FUN_FACTS.length);
      setVisible(true);
    }, FADE_MS);
  };

  // Auto-avance cada 7s.
  useEffect(() => {
    intervalRef.current = window.setInterval(goToNextFact, ROTATE_INTERVAL_MS);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefreshClick = () => {
    goToNextFact();
    // Reinicia el temporizador de auto-avance para que no vuelva a
    // cambiar casi de inmediato después de un click manual.
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(goToNextFact, ROTATE_INTERVAL_MS);
  };

  return (
    <div className="relative mx-auto flex w-full max-w-xs flex-col items-center gap-2 sm:mx-0 sm:max-w-none sm:flex-row sm:items-center sm:justify-center sm:gap-4">
      {/* Personaje + su sombra. La sombra vive en un div aparte (no
          animado con el bounce) para que se vea "en el piso" mientras
          Cerebrito flota/camina sobre ella. */}
      <div className="relative h-20 w-20 flex-shrink-0 sm:h-24 sm:w-24">
        <div className="animate-cerebrito-shadow absolute inset-x-0 bottom-0 mx-auto h-2 w-10 rounded-full bg-black/35 blur-[2px] sm:w-12" />
        <div className="animate-float-walk absolute inset-0">
          <BrainCharacter />
        </div>
      </div>

      {/* Burbuja de diálogo: glassmorphism morado/cian con dato curioso. */}
      <div className="relative w-full max-w-xs rounded-2xl border border-primary-cyan/60 bg-primary-purple/40 px-4 py-3 text-left shadow-[0_0_18px_rgba(44,183,255,0.35)] backdrop-blur-md">
        {/* Tail móvil: apunta hacia arriba, a Cerebrito sobre la burbuja */}
        <span className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-l border-t border-primary-cyan/60 bg-primary-purple/90 sm:hidden" />
        {/* Tail escritorio: apunta a la izquierda, a Cerebrito junto a la burbuja */}
        <span className="absolute -left-1.5 top-6 hidden h-3 w-3 -translate-y-1/2 rotate-45 border-b border-l border-primary-cyan/60 bg-primary-purple/90 sm:block" />

        <div className="mb-1 flex items-center justify-between gap-2">
          <span className="text-xs font-bold text-primary-cyan">💡 ¿Sabías que...?</span>
          <button
            type="button"
            onClick={handleRefreshClick}
            className="flex-shrink-0 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-semibold text-white transition hover:border-primary-cyan hover:bg-white/20"
          >
            🔄 Otro dato
          </button>
        </div>
        <p
          className={`text-xs leading-snug text-white transition-opacity duration-200 sm:text-sm ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        >
          {FUN_FACTS[factIndex]}
        </p>
      </div>
    </div>
  );
}
