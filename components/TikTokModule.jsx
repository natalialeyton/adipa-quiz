"use client";

// components/TikTokModule.jsx
//
// Módulo promocional "SOMOS ADIPA": acceso directo al TikTok oficial de
// ADIPA (@somosadipa, confirmado activo), con contenidos breves de salud
// mental y comunidad. Se ubica justo debajo del widget del podcast.

import { ADIPA_TIKTOK_URL } from "@/services/adipaApi";

export default function TikTokModule() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-secondary-navy to-[#1C2541] p-5 shadow-md sm:p-6">
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary-purple/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-6 h-32 w-32 rounded-full bg-primary-cyan/20 blur-3xl" />

      <div className="relative flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex flex-col gap-1">
          <span className="mx-auto w-fit rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-secondary-light sm:mx-0">
            Somos ADIPA
          </span>
          <h3 className="text-base font-bold text-white sm:text-lg">
            Salud mental y comunidad, en formato corto
          </h3>
          <p className="text-sm text-white/75">
            Síguenos en TikTok para contenido breve, dinámico y educativo sobre psicología.
          </p>
        </div>

        <a
          href={ADIPA_TIKTOK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-secondary-navy shadow-md transition hover:opacity-90"
        >
          🎵 @somosadipa
        </a>
      </div>
    </section>
  );
}
