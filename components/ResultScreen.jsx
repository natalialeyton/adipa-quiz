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

function buildFallbackExplanation(school, subspecialty) {
  return `Tu perfil de respuestas mostró una fuerte afinidad con ${school.name}, especialmente en ${subspecialty.label}. Tus intereses, conocimientos y estilo de trabajo apuntan a esta área como tu mejor punto de partida dentro de ADIPA.`;
}

function CardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-3 overflow-hidden rounded-2xl bg-white shadow-md">
      <div className="aspect-[16/10] w-full bg-primary-gray" />
      <div className="flex flex-col gap-2 p-4">
        <div className="h-3 w-3/4 rounded-full bg-primary-gray" />
        <div className="h-3 w-1/2 rounded-full bg-primary-gray" />
      </div>
    </div>
  );
}

// Tarjeta clara para Cursos/Programas/Diplomados y Seminarios: imagen de
// portada de borde a borde arriba, badge de categoría superpuesto, y
// (cuando adipa.cl lo entregue) fecha de inicio en acento corporativo.
// Fondo blanco -no oscuro-, para que resalte sobre el bloque navy del
// informe y el texto quede siempre oscuro-sobre-claro.
function OfferCard({ item, tagLabel, ctaLabel }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-primary-gray to-secondary-light">
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl}
            alt=""
            loading="lazy"
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="rounded-full bg-white/70 px-4 py-1.5 text-xs font-semibold text-primary-purple">
              ADIPA
            </span>
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-primary-purple px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
          {tagLabel}
        </span>
        {item.startDateLabel && (
          <span className="absolute right-3 top-3 rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-primary-purple shadow-sm">
            Inicia {item.startDateLabel}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="text-sm font-semibold leading-snug text-secondary-navy sm:text-base">
          {item.title}
        </h3>
        <span className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-primary-purple">
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
      className="rounded-xl bg-white p-4 text-sm font-medium text-primary-purple shadow-md transition hover:shadow-lg"
    >
      {label} →
    </a>
  );
}

function ResourceCardSkeleton() {
  return (
    <div className="flex animate-pulse items-center gap-4 rounded-2xl bg-white p-3 shadow-md">
      <div className="h-16 w-16 flex-shrink-0 rounded-xl bg-primary-gray" />
      <div className="flex flex-1 flex-col gap-2">
        <div className="h-3 w-2/3 rounded-full bg-primary-gray" />
        <div className="h-3 w-1/3 rounded-full bg-primary-gray" />
      </div>
    </div>
  );
}

// Tarjeta horizontal clara para "Recursos Gratuitos": miniatura a la
// izquierda, título en negrita al centro, flecha de acción a la derecha.
function ResourceCard({ item, ctaLabel }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 rounded-2xl bg-white p-3 shadow-md transition hover:-translate-y-0.5 hover:shadow-lg sm:p-4"
    >
      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-primary-gray to-secondary-light">
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl}
            alt=""
            loading="lazy"
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-2xl">📘</div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-[10px] font-bold uppercase tracking-wide text-primary-purple">
          {ctaLabel}
        </span>
        <h3 className="truncate text-sm font-bold leading-snug text-secondary-navy sm:whitespace-normal sm:text-base">
          {item.title}
        </h3>
      </div>

      <span className="flex-shrink-0 text-xl font-semibold text-primary-purple transition group-hover:translate-x-0.5">
        →
      </span>
    </a>
  );
}

// Banner de suscripción al newsletter real de ADIPA (el mismo formulario
// vive en el footer de adipa.cl). Abre esa página en una pestaña nueva en
// vez de simular aquí un formulario que no procesaría la suscripción de
// verdad.
function NewsletterBanner() {
  return (
    <a
      href="https://adipa.cl/#newsletter"
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 rounded-2xl bg-secondary-light p-5 shadow-md transition hover:shadow-lg sm:p-6"
    >
      <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white text-2xl shadow-sm">
        ✉️
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-[11px] font-bold uppercase tracking-wide text-primary-purple">
          ¿Quieres más recursos gratuitos?
        </span>
        <h3 className="text-base font-bold text-secondary-navy sm:text-lg">
          Suscríbete al newsletter
        </h3>
        <p className="text-sm text-secondary-navy/70">
          Seminarios, recursos y novedades cada semana.
        </p>
      </div>
      <span className="flex-shrink-0 text-2xl font-semibold text-primary-purple transition group-hover:translate-x-0.5">
        →
      </span>
    </a>
  );
}

export default function ResultScreen({ userData, quizResult, goal = "DESCUBRIR", onRestart }) {
  // "VALIDAR" = llegó desde "Ya sé mi área" en Landing: el informe debe
  // sonar a confirmar y profundizar una ruta ya elegida, no a
  // descubrirla desde cero.
  const isValidating = goal === "VALIDAR";
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
  const topAreas = getTopAreas(quizResult?.scores, quizResult?.schoolOpportunities);

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
              {isValidating
                ? "Confirmamos tu enfoque y así puedes llevarlo al siguiente nivel:"
                : "Este es el perfil que mejor se alinea contigo:"}
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
                {isValidating ? "🔍 Validación de tu Enfoque" : "🔍 Análisis de Tu Perfil"}
              </h3>
              <p className="text-sm leading-relaxed text-white/95 sm:text-base">
                {isValidating && `Confirmamos que tu enfoque en ${subspecialty.label} es sólido. `}
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
                  {isValidating ? "🚀 Tu Siguiente Nivel" : "🚀 Recomendación Profesional"}
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
              {isValidating ? "Profundiza tu Especialización" : "Perfecciónate con ADIPA"}
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

          {/* Recursos Gratuitos */}
          <section className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-white sm:text-xl">Recursos Gratuitos</h2>
            {loading ? (
              <div className="flex flex-col gap-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <ResourceCardSkeleton key={`resource-skeleton-${index}`} />
                ))}
              </div>
            ) : resources.length > 0 ? (
              <div className="flex flex-col gap-3">
                {resources.map((resource) => (
                  <ResourceCard key={resource.id} item={resource} ctaLabel="Descarga Gratuita" />
                ))}
              </div>
            ) : (
              <OfferFallbackLink
                href={resourcesFallbackUrl ?? "https://adipa.cl/recursos/ebooks/"}
                label="Ver todos los recursos gratuitos en adipa.cl"
              />
            )}
          </section>

          {/* Newsletter */}
          <NewsletterBanner />
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
        goal={goal}
      />

      {/* Adipados Podcast + TikTok */}
      <PodcastWidget episodes={podcastEpisodes} />
      <TikTokModule />

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
