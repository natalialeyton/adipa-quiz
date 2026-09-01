"use client";

// components/LandingScreen.jsx
//
// Pantalla de inicio (Home / Landing del Quiz), en 2 pasos sobre el mismo
// fondo oscuro corporativo estilo "Wrapped" (halos de degradado, paleta
// oficial de ADIPA definida en tailwind.config.js):
//
//   Paso 1: situación inicial — "Aún no sé mi área" (objetivo DESCUBRIR)
//   o "Ya sé mi área" (objetivo VALIDAR/PROFUNDIZAR). Ambas opciones
//   despliegan el mismo Paso 2, solo cambia el objetivo que se guarda en
//   el estado global (usado luego por ResultScreen/ShareCard para
//   adaptar el informe final y las Historias del Social Kit).
//
//   Paso 2: duración del Quiz — Express (10), Estándar (15) o Profundo
//   (25 preguntas) — que junto al objetivo se envía a onStart() para que
//   AppFlow.jsx arme la sesión del Quiz.

import { useState } from "react";
import IdeaBulbPopUp from "./IdeaBulbPopUp";

// Ícono "Birrete de graduación": para la opción DESCUBRIR (Paso 1). Vector
// propio en degradado neón cian→morado, mismo acabado que la ampolleta de
// ideas (ver IdeaBulbPopUp.jsx) para mantener una sola identidad visual
// "neón" en toda la pantalla de inicio.
function GraduationCapIcon() {
  return (
    <svg viewBox="0 0 100 100" className="relative h-full w-full" role="img" aria-label="Birrete de graduación">
      <defs>
        <linearGradient id="situation-icon-gradient-cap" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2CB7FF" />
          <stop offset="100%" stopColor="#B48CFF" />
        </linearGradient>
      </defs>
      {/* Base / cabeza del birrete */}
      <path
        d="M28,46 L28,62 C28,70.5 38,77 50,77 C62,77 72,70.5 72,62 L72,46 L50,57 Z"
        fill="url(#situation-icon-gradient-cap)"
        opacity="0.85"
      />
      {/* Plato superior (rombo) */}
      <path
        d="M50,17 L92,40 L50,63 L8,40 Z"
        fill="url(#situation-icon-gradient-cap)"
        stroke="#EAF6FF"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {/* Botón central + borla */}
      <circle cx="50" cy="40" r="4" fill="#FFF6DE" />
      <path d="M50,40 L78,51" stroke="#FFF6DE" strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <circle cx="79" cy="53" r="4.5" fill="#FFE9A8" stroke="#FFF6DE" strokeWidth="1.5" />
      <path d="M79,57.5 L79,67" stroke="#FFE9A8" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

// Ícono "Libro abierto": para la opción VALIDAR (Paso 1). Mismo acabado
// neón que el birrete y la ampolleta.
function OpenBookIcon() {
  return (
    <svg viewBox="0 0 100 100" className="relative h-full w-full" role="img" aria-label="Libro abierto">
      <defs>
        <linearGradient id="situation-icon-gradient-book" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2CB7FF" />
          <stop offset="100%" stopColor="#B48CFF" />
        </linearGradient>
      </defs>
      <path
        d="M50,32 C40,25 24,23 14,27 C12,27.6 11,29 11,31 L11,72 C11,74.4 13.2,76 15.4,75.3 C25,72.3 40,74 50,80 Z"
        fill="url(#situation-icon-gradient-book)"
        stroke="#EAF6FF"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M50,32 C60,25 76,23 86,27 C88,27.6 89,29 89,31 L89,72 C89,74.4 86.8,76 84.6,75.3 C75,72.3 60,74 50,80 Z"
        fill="url(#situation-icon-gradient-book)"
        stroke="#EAF6FF"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M50,32 L50,80" stroke="#EAF6FF" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <path d="M20,38 L38,42 M20,46 L36,50 M20,54 L34,58" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" opacity="0.45" />
      <path d="M80,38 L62,42 M80,46 L64,50 M80,54 L66,58" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" opacity="0.45" />
    </svg>
  );
}

// Envoltorio común de los 2 íconos de decisión: flotado suave
// (animate-floating-slide) + halo neón pulsante (animate-icon-glow-pulse)
// + destellos titilando (animate-sparkle-twinkle) -las 3 animaciones ya
// definidas en app/globals.css y reutilizadas de la ampolleta de ideas,
// para que ambos íconos compartan su misma identidad visual "neón"-.
// `delay` desfasa el ciclo entre los 2 íconos para que no floten/titilen
// en perfecto espejo el uno del otro.
function SituationIcon({ Icon, delay = "0s" }) {
  return (
    <div className="relative flex h-12 w-12 items-center justify-center sm:h-14 sm:w-14">
      <span
        className="absolute -inset-3 rounded-full bg-[radial-gradient(circle,rgba(112,78,253,0.55)_0%,rgba(44,183,255,0.35)_45%,rgba(112,78,253,0)_75%)] animate-icon-glow-pulse"
        style={{ animationDelay: delay }}
      />
      <span
        className="absolute -left-1.5 -top-1 text-[10px] text-[#EAF6FF] animate-sparkle-twinkle"
        style={{ animationDelay: delay }}
      >
        ✦
      </span>
      <span
        className="absolute -right-1.5 top-1 text-[10px] text-[#EAF6FF] animate-sparkle-twinkle"
        style={{ animationDelay: `calc(${delay} + 0.6s)` }}
      >
        ✦
      </span>
      <span
        className="absolute -bottom-1 left-1 text-[10px] text-[#EAF6FF] animate-sparkle-twinkle"
        style={{ animationDelay: `calc(${delay} + 1.1s)` }}
      >
        ✦
      </span>
      <div className="animate-floating-slide" style={{ animationDelay: delay }}>
        <Icon />
      </div>
    </div>
  );
}

const SITUATION_OPTIONS = [
  {
    goal: "DESCUBRIR",
    Icon: GraduationCapIcon,
    iconDelay: "0s",
    title: "Aún no sé mi área",
    description: "Orientado a descubrir tu especialidad ideal.",
  },
  {
    goal: "VALIDAR",
    Icon: OpenBookIcon,
    iconDelay: "-1.1s",
    title: "Ya sé mi área",
    description: "Orientado a validar tu enfoque y profundizar tu ruta de especialización.",
  },
];

const DURATION_OPTIONS = [
  {
    questionCount: 10,
    emoji: "⚡",
    title: "Express",
    subtitle: "10 Preguntas",
    meta: "~1 min · Diagnóstico rápido",
  },
  {
    questionCount: 15,
    emoji: "🎯",
    title: "Estándar",
    subtitle: "15 Preguntas",
    meta: "~2 min · Equilibrio ideal",
  },
  {
    questionCount: 25,
    emoji: "🧠",
    title: "Profundo",
    subtitle: "25 Preguntas",
    meta: "~4 min · Evaluación detallada de máxima precisión",
  },
];

export default function LandingScreen({ onStart }) {
  const [selectedGoal, setSelectedGoal] = useState(null);

  const handleSelectDuration = (questionCount) => {
    onStart?.({ goal: selectedGoal, questionCount });
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-secondary-navy p-8 pb-44 text-center text-white shadow-md sm:p-12 sm:pb-36">
      {/* Halos decorativos, estilo Wrapped */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary-purple/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-primary-cyan/20 blur-3xl" />

      <div className="relative flex flex-col items-center gap-7">
        <div className="flex flex-col items-center gap-3">
          <h1 className="max-w-xl text-2xl font-bold leading-tight sm:text-3xl">
            Encuentra la especialidad de psicología que mejor se ajusta a tu perfil profesional
          </h1>
          <p className="max-w-lg text-sm text-secondary-light/90 sm:text-base">
            Con el test interactivo de ADIPA, descubre tu rama afín o valida y profundiza la
            especialidad que ya elegiste.
          </p>
        </div>

        {/* Paso 1: Selección de Situación Inicial */}
        <div className="flex w-full max-w-md flex-col gap-3">
          <span className="text-xs font-bold uppercase tracking-wide text-secondary-light/70">
            Paso 1 · ¿Cuál es tu situación hoy?
          </span>
          <div className="flex flex-col gap-3 sm:flex-row">
            {SITUATION_OPTIONS.map((option) => {
              const isSelected = selectedGoal === option.goal;
              return (
                <button
                  key={option.goal}
                  type="button"
                  onClick={() => setSelectedGoal(option.goal)}
                  aria-pressed={isSelected}
                  className={`flex flex-1 flex-col items-center gap-1.5 rounded-2xl border px-5 py-5 text-center transition ${
                    isSelected
                      ? "border-transparent bg-gradient-to-r from-primary-purple to-primary-cyan shadow-md"
                      : "border-white/20 bg-white/5 hover:border-primary-cyan/60 hover:bg-white/10"
                  }`}
                >
                  <SituationIcon Icon={option.Icon} delay={option.iconDelay} />
                  <span className="text-sm font-bold text-white sm:text-base">{option.title}</span>
                  <span className="text-xs text-white/75 sm:text-sm">{option.description}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Paso 2: Selección de Duración del Quiz — se despliega tras
            elegir cualquiera de las 2 opciones del Paso 1. */}
        {selectedGoal && (
          <div className="flex w-full max-w-md flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-wide text-secondary-light/70">
              Paso 2 · Elige la duración del Quiz
            </span>
            <div className="flex flex-col gap-3">
              {DURATION_OPTIONS.map((option) => (
                <button
                  key={option.questionCount}
                  type="button"
                  onClick={() => handleSelectDuration(option.questionCount)}
                  className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/5 px-5 py-4 text-left transition hover:border-primary-cyan hover:bg-white/10 hover:shadow-md"
                >
                  <span className="text-xl">{option.emoji}</span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="text-sm font-bold text-white sm:text-base">
                      {option.title}{" "}
                      <span className="font-medium text-white/70">({option.subtitle})</span>
                    </span>
                    <span className="text-xs text-secondary-light/70 sm:text-sm">{option.meta}</span>
                  </span>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setSelectedGoal(null)}
              className="mx-auto text-xs font-medium text-secondary-light/60 transition hover:text-white"
            >
              ← Cambiar situación inicial
            </button>
          </div>
        )}

        {!selectedGoal && (
          <span className="text-xs font-medium text-secondary-light/70">
            ⏱️ Toma entre 1 y 4 minutos, según la versión que elijas
          </span>
        )}
      </div>

      {/* 💡 Ampolleta de Ideas: recorre el pie de la pantalla y comparte
          datos curiosos. Vive fuera del flujo de contenido (posición
          absoluta dentro de este contenedor) y el padding-bottom extra
          de arriba (pb-44/sm:pb-36) le reserva su propio carril para que
          el pop-up nunca tape las tarjetas de Paso 1/Paso 2. */}
      <IdeaBulbPopUp />
    </div>
  );
}
