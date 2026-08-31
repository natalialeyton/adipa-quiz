"use client";

// components/LandingScreen.jsx
//
// Pantalla de inicio (Home / Landing del Quiz). Primer paso del flujo de
// entrada, con tratamiento "Wrapped" (tarjeta oscura, halos de degradado)
// pero usando únicamente la paleta oficial de ADIPA definida en
// tailwind.config.js (primary.purple, primary.cyan, secondary.navy,
// secondary.light).

export default function LandingScreen({ onStart }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-secondary-navy p-8 text-center text-white shadow-md sm:p-12">
      {/* Halos decorativos, estilo Wrapped */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary-purple/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-primary-cyan/20 blur-3xl" />

      <div className="relative flex flex-col items-center gap-6">
        <h1 className="max-w-xl text-2xl font-bold leading-tight sm:text-3xl">
          Tu mente ya eligió una rama de la Psicología... ¿sabes cuál es? 🧠✨
        </h1>

        <p className="max-w-lg text-sm text-secondary-light/90 sm:text-base">
          ¿Clínica, Forense, Organizacional, Neuro...? Estas son solo algunas de las áreas que
          podrás descubrir. Deja de adivinar, responde este quiz de 25 preguntas y encuentra en
          cuál encajas mejor para llevar tus conocimientos al siguiente nivel.
        </p>

        <button
          type="button"
          onClick={onStart}
          className="rounded-xl bg-gradient-to-r from-primary-purple to-primary-cyan px-8 py-3.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90 sm:px-10 sm:text-base"
        >
          Averiguarlo ahora ⚡
        </button>

        <span className="text-xs font-medium text-secondary-light/70">⏱️ Toma 3 minutos</span>
      </div>
    </div>
  );
}
