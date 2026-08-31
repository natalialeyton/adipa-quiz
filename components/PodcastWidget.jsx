"use client";

// components/PodcastWidget.jsx
//
// Módulo "Adipados Podcast Widget": transversal a todas las áreas de la
// salud mental, muestra 2-3 episodios reales del podcast oficial de ADIPA
// (post type "adipados" de adipa.cl, filtrado por la misma taxonomía
// "interests" de la sub-especialidad resultante) en un mini-player de
// estética oscura corporativa (mismo tratamiento visual que TikTokModule,
// para mantener contraste y armonía con el resto del reporte), con un
// botón principal hacia el show en Spotify.
//
// Cada episodio (tanto la miniatura/título como el botón de play) abre en
// una pestaña nueva el episodio específico en Spotify -no la web de
// adipa.cl ni un reproductor interno-. El link exacto se extrae del embed
// de Spotify que adipa.cl incrusta en cada post (ver
// services/adipaApi.js#extractSpotifyEpisodeUrl); si por algún motivo no
// se pudo extraer, cae de respaldo al show completo en Spotify.

import { ADIPADOS_SPOTIFY_URL } from "@/services/adipaApi";

function EpisodeItem({ episode }) {
  return (
    <a
      href={episode.spotifyUrl ?? ADIPADOS_SPOTIFY_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Escuchar "${episode.title}" en Spotify`}
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
          Adipados · Spotify
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
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-secondary-navy to-[#1C2541] p-5 shadow-md sm:p-6">
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary-purple/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-6 h-32 w-32 rounded-full bg-primary-cyan/20 blur-3xl" />

      <div className="relative flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-white sm:text-xl">
          Dale play a Adipados, el podcast de quienes acompañan, entienden y transforman la salud
          mental. 🎧
        </h2>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
          {episodes.length > 0 ? (
            <div className="flex flex-col gap-3">
              {episodes.map((episode) => (
                <EpisodeItem key={episode.id} episode={episode} />
              ))}
            </div>
          ) : (
            <p className="px-1 py-2 text-sm text-white/75">
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
      </div>
    </section>
  );
}
