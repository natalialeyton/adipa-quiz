"use client";

// components/PodcastWidget.jsx
//
// Módulo "Adipados Podcast Widget": transversal a todas las áreas de la
// salud mental, muestra 2-3 episodios reales del podcast oficial de ADIPA
// (post type "adipados" de adipa.cl, filtrado por la misma taxonomía
// "interests" de la sub-especialidad resultante) en un mini-player de
// estética oscura, con un botón principal hacia el show en Spotify.
//
// "Reproducir" abre la página del episodio en adipa.cl (que incluye el
// reproductor embebido de Spotify) en una pestaña nueva -no inventamos
// una URL de audio directa que no tenemos-.

import { ADIPADOS_SPOTIFY_URL } from "@/services/adipaApi";

function EpisodeItem({ episode }) {
  return (
    <a
      href={episode.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3 transition hover:border-primary-cyan/60 hover:bg-white/[0.08]"
    >
      <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-primary-purple/50 to-primary-cyan/40">
        {episode.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={episode.imageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xl">🎙️</div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="w-fit rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-secondary-light">
          Adipados
        </span>
        <p className="truncate text-sm font-semibold leading-snug text-white sm:whitespace-normal sm:text-[13px]">
          {episode.title}
        </p>
      </div>

      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-cyan to-primary-purple text-white shadow-[0_0_16px_rgba(44,183,255,0.55)] transition group-hover:scale-105">
        ▶
      </span>
    </a>
  );
}

export default function PodcastWidget({ episodes = [] }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-white sm:text-xl">
        Dale play a Adipados, el podcast de quienes acompañan, entienden y transforman la salud
        mental. 🎧
      </h2>

      <div className="rounded-2xl border border-white/10 bg-[#0B132B] p-4 shadow-md sm:p-5">
        {episodes.length > 0 ? (
          <div className="flex flex-col gap-3">
            {episodes.map((episode) => (
              <EpisodeItem key={episode.id} episode={episode} />
            ))}
          </div>
        ) : (
          <p className="px-1 py-2 text-sm text-white/70">
            Explora los episodios de Adipados relacionados con tu especialidad directamente en
            Spotify.
          </p>
        )}
      </div>

      <a
        href={ADIPADOS_SPOTIFY_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mx-auto flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-purple to-primary-cyan px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
      >
        🎧 Escuchar más episodios en Spotify
      </a>
    </section>
  );
}
