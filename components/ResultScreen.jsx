"use client";

// components/ResultScreen.jsx
//
// Pantalla final del flujo, estilo "Wrapped": muestra un informe profundo
// y personalizado de la escuela y sub-especialidad ganadora del Quiz,
// consume services/adipaApi.js para traer en vivo los programas y
// seminarios recomendados de adipa.cl (con su imagen destacada), ofrece
// una tarjeta para compartir en redes (ShareCard) y un reporte imprimible
// ("Descargar Reporte Completo (PDF)" vía window.print(), aprovechando el
// CSS de impresión definido en app/globals.css).
//
// Todo el informe vive sobre el fondo oscuro corporativo de ADIPA, con el
// mismo tratamiento visual que Landing/Onboarding/Quiz.

import { useEffect, useState } from "react";
import {
  SCHOOLS,
  SUBSPECIALTIES,
  getProgramsBySubspecialty,
  getSeminarsBySubspecialty,
  getResourcesBySubspecialty,
  getPodcastEpisodesBySubspecialty,
  getTopAreas,
} from "@/services/adipaApi";
import { buildAdaptiveInsights } from "@/services/specialtyInsights";
import ShareCard from "./ShareCard";
import PodcastWidget from "./PodcastWidget";
import TikTokModule from "./TikTokModule";

// Redes sociales oficiales de ADIPA (confirmadas en adipa.cl, 2026-08-28).
const SOCIAL_LINKS = [
  { name: "Instagram", url: "https://www.instagram.com/adipa.cl/" },
  { name: "YouTube", url: "https://www.youtube.com/channel/UCSx-fxlxiMHExaWwyHT8P8A" },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/company/academia-digital-de-psicologia-y-aprendizaje-adipa/",
  },
  { name: "Facebook", url: "https://www.facebook.com/Adipa-102577181991776" },
];

// TODO: reemplazar por la URL real de la plataforma "ADIPA 2" cuando esté
// disponible. Mientras tanto, apunta al sitio principal de ADIPA.
const ADIPA_2_URL = "https://adipa.cl/";

function buildFallbackExplanation(school, subspecialty) {
  return `Tu perfil de respuestas mostró una fuerte afinidad con ${school.name}, especialmente en ${subspecialty.label}. Tus intereses, conocimientos y estilo de trabajo apuntan a esta área como tu mejor punto de partida dentro de ADIPA.`;
}

function CardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-3 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      <div className="aspect-[16/10] w-full bg-white/10" />
      <div className="flex flex-col gap-2 p-4">
        <div className="h-3 w-3/4 rounded-full bg-white/15" />
        <div className="h-3 w-1/2 rounded-full bg-white/10" />
      </div>
    </div>
  );
}

function OfferCard({ item, tagLabel, ctaLabel }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col overflow-hidden rounded-2xl border border-white/15 bg-white/5 shadow-md backdrop-blur-md transition hover:border-primary-cyan hover:bg-white/10 hover:shadow-lg"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-primary-purple/40 to-primary-cyan/30">
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-3xl">🧠</div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-secondary-navy/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-secondary-light backdrop-blur-md">
          {tagLabel}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="text-sm font-semibold leading-snug text-white sm:text-base">
          {item.title}
        </h3>
        <span className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-primary-cyan">
          {ctaLabel} →
        </span>
      </div>
    </a>
  );
}

function OfferFallbackLink({ href, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-xl border border-white/15 bg-white/5 p-4 text-sm font-medium text-primary-cyan backdrop-blur-md transition hover:border-primary-cyan hover:bg-white/10"
    >
      {label} →
    </a>
  );
}

export default function ResultScreen({ userData, quizResult, onRestart }) {
  const [programs, setPrograms] = useState([]);
  const [programsFallbackUrl, setProgramsFallbackUrl] = useState(null);
  const [seminars, setSeminars] = useState([]);
  const [seminarsFallbackUrl, setSeminarsFallbackUrl] = useState(null);
  const [resources, setResources] = useState([]);
  const [resourcesFallbackUrl, setResourcesFallbackUrl] = useState(null);
  const [podcastEpisodes, setPodcastEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);

  const school = SCHOOLS[quizResult?.schoolId];
  const subspecialty = SUBSPECIALTIES[quizResult?.subspecialtyId];
  const insights = buildAdaptiveInsights(quizResult?.subspecialtyId, {
    career: userData?.career,
    educationLevel: userData?.educationLevel,
  });
  const matchPercent = typeof quizResult?.matchPercent === "number" ? quizResult.matchPercent : null;
  const topAreas = getTopAreas(quizResult?.scores);

  useEffect(() => {
    if (!quizResult?.subspecialtyId) {
      setLoading(false);
      return undefined;
    }

    let cancelled = false;

    async function loadRecommendations() {
      setLoading(true);
      const [programsResult, seminarsResult, resourcesResult, podcastResult] = await Promise.all([
        getProgramsBySubspecialty(quizResult.subspecialtyId),
        getSeminarsBySubspecialty(quizResult.subspecialtyId),
        getResourcesBySubspecialty(quizResult.subspecialtyId),
        getPodcastEpisodesBySubspecialty(quizResult.subspecialtyId),
      ]);

      if (cancelled) return;

      setPrograms(programsResult.items);
      setProgramsFallbackUrl(programsResult.fallbackUrl);
      setSeminars(seminarsResult.items);
      setSeminarsFallbackUrl(seminarsResult.fallbackUrl);
      setResources(resourcesResult.items);
      setResourcesFallbackUrl(resourcesResult.fallbackUrl);
      setPodcastEpisodes(podcastResult.items);
      setLoading(false);
    }

    loadRecommendations();

    return () => {
      cancelled = true;
    };
  }, [quizResult?.subspecialtyId]);

  if (!school || !subspecialty) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-secondary-navy p-6 text-center text-white shadow-md sm:p-10">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary-purple/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-primary-cyan/20 blur-3xl" />
        <div className="relative flex flex-col gap-4">
          <p className="text-sm text-secondary-light/80">
            No pudimos calcular tu resultado. Vuelve a intentar el Quiz.
          </p>
          <button
            type="button"
            onClick={onRestart}
            className="mx-auto rounded-xl bg-gradient-to-r from-primary-purple to-primary-cyan px-8 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
          >
            Volver a Empezar
          </button>
        </div>
      </div>
    );
  }

  const firstName = userData?.fullName?.split(" ")[0] ?? "";

  return (
    <div className="flex flex-col gap-8">
      {/* Reporte imprimible: encabezado + resultado + programas/seminarios,
          sobre el fondo oscuro corporativo de ADIPA. */}
      <div className="printable-report relative overflow-hidden rounded-2xl bg-secondary-navy p-6 text-white shadow-md sm:p-10">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary-purple/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-primary-cyan/20 blur-3xl" />

        <div className="relative flex flex-col gap-8">
          {/* Encabezado simplificado y personalizado */}
          <div className="flex flex-col gap-2 text-center">
            <span className="mx-auto inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-secondary-light">
              Paso 3 de 3: Tus Resultados
            </span>
            <h1 className="text-2xl font-bold sm:text-3xl">
              ¡Hola, {firstName || "colega"}! 👋
            </h1>
            <p className="text-sm text-secondary-light/80 sm:text-base">
              Este es el perfil que mejor se alinea contigo:
            </p>
          </div>

          {/* Informe detallado y recomendación personalizada */}
          <div
            className="relative flex flex-col gap-5 overflow-hidden rounded-2xl p-6 text-white shadow-md sm:p-8"
            style={{ background: `linear-gradient(135deg, ${school.color} 0%, ${school.color}CC 100%)` }}
          >
            <div className="flex flex-col items-center gap-2 text-center sm:items-start sm:text-left">
              {matchPercent !== null && (
                <span className="rounded-full bg-white/20 px-4 py-1 text-xs font-bold uppercase tracking-wide backdrop-blur-md">
                  {matchPercent}% de afinidad
                </span>
              )}
              <span className="text-xs font-semibold uppercase tracking-wide text-white/70">
                {school.name}
              </span>
              <h2 className="text-2xl font-bold sm:text-3xl">{subspecialty.label}</h2>
            </div>

            <div className="flex flex-col gap-2 rounded-xl bg-white/10 p-4 backdrop-blur-md">
              <h3 className="text-xs font-bold uppercase tracking-wide text-white/80">
                🔍 Análisis de Tu Perfil
              </h3>
              <p className="text-sm leading-relaxed text-white/95 sm:text-base">
                {insights?.analysis ?? buildFallbackExplanation(school, subspecialty)}
              </p>
            </div>

            {insights?.strengths?.length > 0 && (
              <div className="flex flex-col gap-2 rounded-xl bg-white/10 p-4 backdrop-blur-md">
                <h3 className="text-xs font-bold uppercase tracking-wide text-white/80">
                  💪 Tus Fortalezas Clave
                </h3>
                <ul className="flex flex-col gap-1.5">
                  {insights.strengths.map((strength) => (
                    <li key={strength} className="flex items-start gap-2 text-sm text-white/95 sm:text-base">
                      <span className="mt-0.5 text-white/70">✓</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {insights?.recommendation && (
              <div className="flex flex-col gap-2 rounded-xl bg-white/10 p-4 backdrop-blur-md">
                <h3 className="text-xs font-bold uppercase tracking-wide text-white/80">
                  🚀 Recomendación Profesional
                </h3>
                <p className="text-sm leading-relaxed text-white/95 sm:text-base">
                  {insights.recommendation}
                </p>
              </div>
            )}
          </div>

          {/* Perfecciónate con ADIPA */}
          <section className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-white sm:text-xl">
              Perfecciónate con ADIPA
            </h2>
            {loading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <CardSkeleton key={`program-skeleton-${index}`} />
                ))}
              </div>
            ) : programs.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {programs.map((program) => (
                  <OfferCard
                    key={program.id}
                    item={program}
                    tagLabel="Programa ADIPA"
                    ctaLabel="Ver en adipa.cl"
                  />
                ))}
              </div>
            ) : (
              <OfferFallbackLink
                href={programsFallbackUrl ?? school.url}
                label={`Ver toda la oferta de ${school.name} en adipa.cl`}
              />
            )}
          </section>

          {/* Seminarios Gratuitos */}
          <section className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-white sm:text-xl">Seminarios Gratuitos</h2>
            {loading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {Array.from({ length: 3 }).map((_, index) => (
                  <CardSkeleton key={`seminar-skeleton-${index}`} />
                ))}
              </div>
            ) : seminars.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {seminars.map((seminar) => (
                  <OfferCard
                    key={seminar.id}
                    item={seminar}
                    tagLabel="Seminario Gratuito"
                    ctaLabel="Inscribirme en adipa.cl"
                  />
                ))}
              </div>
            ) : (
              <OfferFallbackLink
                href={seminarsFallbackUrl ?? "https://adipa.cl/seminarios/"}
                label="Ver todos los seminarios gratuitos en adipa.cl"
              />
            )}
            <a
              href="https://www.youtube.com/channel/UCSx-fxlxiMHExaWwyHT8P8A"
              target="_blank"
              rel="noopener noreferrer"
              className="no-print text-center text-xs font-medium text-primary-cyan hover:underline"
            >
              Ver más seminarios grabados en el canal de YouTube de ADIPA →
            </a>
          </section>

          {/* ¿Quieres profundizar? Descarga gratuita */}
          <section className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-white sm:text-xl">
              ¿Quieres profundizar? Descarga gratuita
            </h2>
            {loading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {Array.from({ length: 3 }).map((_, index) => (
                  <CardSkeleton key={`resource-skeleton-${index}`} />
                ))}
              </div>
            ) : resources.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {resources.map((resource) => (
                  <OfferCard
                    key={resource.id}
                    item={resource}
                    tagLabel="Descarga Gratuita"
                    ctaLabel="Descargar en adipa.cl"
                  />
                ))}
              </div>
            ) : (
              <OfferFallbackLink
                href={resourcesFallbackUrl ?? "https://adipa.cl/recursos/ebooks/"}
                label="Ver todos los recursos gratuitos en adipa.cl"
              />
            )}
          </section>
        </div>
      </div>

      {/* Comparte tu Resultado (Story 9:16) - fuera del reporte imprimible */}
      <ShareCard
        userData={userData}
        school={school}
        subspecialty={subspecialty}
        subspecialtyId={quizResult?.subspecialtyId}
        matchPercent={matchPercent}
        programs={programs}
        strengths={insights?.strengths ?? []}
        topAreas={topAreas}
      />

      {/* Adipados Podcast + TikTok */}
      <PodcastWidget episodes={podcastEpisodes} />
      <TikTokModule />

      {/* Profundiza con ADIPA 2 */}
      <section className="flex flex-col gap-3 rounded-2xl bg-secondary-navy p-6 text-center text-white shadow-md sm:p-8">
        <h2 className="text-lg font-semibold sm:text-xl">Profundiza con ADIPA 2</h2>
        <p className="text-sm text-white/80 sm:text-base">
          Continúa tu formación en la comunidad y plataforma avanzada de ADIPA.
        </p>
        <a
          href={ADIPA_2_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mx-auto rounded-xl bg-white px-6 py-2.5 text-sm font-semibold text-secondary-navy shadow-md transition hover:opacity-90"
        >
          Accede a la experiencia de aprendizaje continuo en ADIPA 2
        </a>
      </section>

      {/* Acciones del reporte + footer institucional */}
      <div className="no-print flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-xl bg-primary-cyan px-8 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-90 sm:text-base"
        >
          Descargar Reporte Completo (PDF)
        </button>
        <p className="max-w-xs text-center text-xs text-secondary-navy/50">
          Se abrirá el diálogo de impresión de tu navegador: elige &ldquo;Guardar como PDF&rdquo; como
          destino.
        </p>
      </div>

      <footer className="no-print flex flex-col items-center gap-4 border-t border-secondary-lavender pt-6">
        <div className="flex flex-wrap items-center justify-center gap-4">
          {SOCIAL_LINKS.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-secondary-navy/70 transition hover:text-primary-purple"
            >
              {social.name}
            </a>
          ))}
        </div>
        <a
          href="https://adipa.cl/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium text-secondary-navy/50 hover:text-primary-purple"
        >
          adipa.cl
        </a>
        <button
          type="button"
          onClick={onRestart}
          className="rounded-xl border border-primary-purple px-8 py-3 text-sm font-semibold text-primary-purple transition hover:bg-primary-gray sm:text-base"
        >
          Volver a Empezar
        </button>
      </footer>
    </div>
  );
}
