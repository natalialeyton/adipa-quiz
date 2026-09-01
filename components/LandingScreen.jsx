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
import CerebritoMascot from "./CerebritoMascot";

const SITUATION_OPTIONS = [
  {
    goal: "DESCUBRIR",
    emoji: "🧩",
    title: "Aún no sé mi área",
    description: "Orientado a descubrir tu especialidad ideal.",
  },
  {
    goal: "VALIDAR",
    emoji: "🎯",
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
    <div className="relative overflow-hidden rounded-2xl bg-secondary-navy p-8 text-center text-white shadow-md sm:p-12">
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

        {/* Cerebrito ADIPA: mascota animada + dato curioso. En móvil queda
            centrado justo sobre el título/antes del Paso 1, sin tapar
            nunca las tarjetas de decisión; en escritorio se acomoda al
            costado, junto al título. */}
        <CerebritoMascot />

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
                  <span className="text-2xl">{option.emoji}</span>
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
    </div>
  );
}
