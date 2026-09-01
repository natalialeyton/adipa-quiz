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
//
// Arquitectura del informe (3 niveles, según `quizResult.questionCount` -
// Express 10 / Estándar 15 / Profundo 25, elegidos en Landing) x 2
// objetivos (DESCUBRIR / VALIDAR): cada nivel despliega progresivamente
// más contenido -diagnóstico directo -> diagnóstico + fortalezas ->
// diagnóstico integral + competencias-, y cada uno (salvo Profundo)
// cierra con un banner que invita a subir de nivel. Ver `tier` más abajo.

import { useEffect, useRef, useState } from "react";
import {
  SCHOOLS,
  SUBSPECIALTIES,
  getProgramsBySubspecialty,
  getSeminarsBySubspecialty,
  getResourcesBySubspecialty,
  getPodcastEpisodesBySubspecialty,
  getTopAreas,
  ADIPADOS_SPOTIFY_URL,
  ADIPA_TIKTOK_URL,
} from "@/services/adipaApi";
import { buildAdaptiveInsights } from "@/services/specialtyInsights";
import ShareCard from "./ShareCard";

// Íconos vectoriales simples (trazo, sin logos de marca reproducidos) para
// la fila de Redes Sociales Oficiales del footer institucional.
function SpotifyIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
      <path d="M7.2 10.2c3-1 7-0.7 9.6 0.9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M7.6 13c2.4-0.7 5.6-0.5 7.7 0.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M8.1 15.6c1.8-0.5 4.2-0.4 5.7 0.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function YouTubeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" stroke="currentColor" strokeWidth="1.7" />
      <path d="M10.5 9.2 L15.5 12 L10.5 14.8 Z" fill="currentColor" />
    </svg>
  );
}

function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17.1" cy="6.9" r="1.1" fill="currentColor" />
    </svg>
  );
}

function TikTokIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M13 3.5 V14.8 a3.2 3.2 0 1 1 -2 -2.96"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M13 3.5 c0.6 2.4 2.4 4 4.8 4.3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LinkedInIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="7.6" cy="8.2" r="1.15" fill="currentColor" />
      <path d="M7.6 11 L7.6 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M11.2 17 L11.2 13.3 C11.2 11.6 13.9 11.5 13.9 13.3 L13.9 17"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M11.2 13 L11.2 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

// Redes sociales oficiales de ADIPA (confirmadas en adipa.cl, 2026-08-28).
const SOCIAL_LINKS = [
  { name: "Spotify", url: ADIPADOS_SPOTIFY_URL, Icon: SpotifyIcon },
  { name: "YouTube", url: "https://www.youtube.com/channel/UCSx-fxlxiMHExaWwyHT8P8A", Icon: YouTubeIcon },
  { name: "Instagram", url: "https://www.instagram.com/adipa.cl/", Icon: InstagramIcon },
  { name: "TikTok", url: ADIPA_TIKTOK_URL, Icon: TikTokIcon },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/company/academia-digital-de-psicologia-y-aprendizaje-adipa/",
    Icon: LinkedInIcon,
  },
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

// Nota de conservación: ResourceCardSkeleton/ResourceCard (tarjeta
// horizontal clara para "Recursos Gratuitos") quedan sin uso tras esta
// refactorización -el Bloque 3 de Profundo ahora reutiliza OfferCard
// dentro de un carrusel, igual que Programas/Seminarios, para mantener
// un mismo lenguaje visual entre los 3 bloques de recomendaciones-. Se
// conservan intactas por si se necesitan más adelante.
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

// Carrusel horizontal compacto ("cajitas deslizables") para los Bloques de
// Recomendaciones de los 3 niveles del informe: Top 3 Programas, Top 3
// Seminarios y (solo Profundo) Recursos Gratuitos. Reutiliza OfferCard tal
// cual -mismo diseño de tarjeta clara- dentro de un contenedor angosto con
// scroll horizontal + snap, más botones [ ◄ ] [ ► ] para navegar sin
// depender del gesto táctil. `compact` angosta aún más la tarjeta (para el
// tercer bloque de Profundo, "no tan largo" según el pedido).
function OfferCarousel({ title, items, tagLabel, ctaLabel, loading, skeletonCount = 3, emptyHref, emptyLabel, compact = false }) {
  const scrollerRef = useRef(null);

  const scrollByAmount = (direction) => {
    const node = scrollerRef.current;
    if (!node) return;
    const firstCard = node.querySelector("[data-carousel-card]");
    const amount = firstCard ? firstCard.getBoundingClientRect().width + 12 : node.clientWidth * 0.85;
    node.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  const cardWidthClass = compact ? "w-[148px]" : "w-[176px]";

  return (
    <div className="flex flex-col gap-3">
      {title && <h4 className="text-xs font-bold uppercase tracking-wide text-white/80">{title}</h4>}

      {loading ? (
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: skeletonCount }).map((_, index) => (
            <div key={index} className={`${cardWidthClass} flex-shrink-0`}>
              <CardSkeleton />
            </div>
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className="relative">
          <div
            ref={scrollerRef}
            className="hide-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-1 print:flex-wrap print:overflow-visible"
          >
            {items.map((item) => (
              <div key={item.id} data-carousel-card className={`${cardWidthClass} flex-shrink-0 snap-start`}>
                <OfferCard item={item} tagLabel={tagLabel} ctaLabel={ctaLabel} />
              </div>
            ))}
          </div>
          {items.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => scrollByAmount(-1)}
                aria-label="Anterior"
                className="no-print absolute -left-2 top-[38%] z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-secondary-navy/70 text-white shadow-lg ring-1 ring-white/30 backdrop-blur-md transition hover:bg-secondary-navy/90"
              >
                ◄
              </button>
              <button
                type="button"
                onClick={() => scrollByAmount(1)}
                aria-label="Siguiente"
                className="no-print absolute -right-2 top-[38%] z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-secondary-navy/70 text-white shadow-lg ring-1 ring-white/30 backdrop-blur-md transition hover:bg-secondary-navy/90"
              >
                ►
              </button>
            </>
          )}
        </div>
      ) : (
        <OfferFallbackLink href={emptyHref} label={emptyLabel} />
      )}
    </div>
  );
}

// Grid de fortalezas clave (Estándar y Profundo).
function StrengthsGrid({ strengths }) {
  if (!strengths || strengths.length === 0) return null;
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {strengths.map((strength) => (
        <div key={strength} className="flex flex-col gap-2 rounded-xl bg-white/10 p-3.5 backdrop-blur-md">
          <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary-cyan text-sm font-bold text-secondary-navy">
            ✓
          </span>
          <span className="text-sm leading-snug text-white/95">{strength}</span>
        </div>
      ))}
    </div>
  );
}

// Banner CTA de cierre: invita a subir de nivel (Express -> Estándar,
// Estándar -> Profundo). Como AppFlow.jsx arma la sesión del Quiz en
// Landing (Paso 1/Paso 2), este botón vuelve al inicio del flujo -no hay
// forma de "seguir" la misma sesión con más preguntas sin tocar
// AppFlow.jsx/QuizModule.jsx, fuera del alcance de este cambio-.
function UpgradeCtaBanner({ title, subtitle, buttonLabel, onUpgrade }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl bg-gradient-to-r from-primary-purple to-primary-cyan p-6 text-center text-white shadow-md sm:p-8">
      <h3 className="text-lg font-bold sm:text-xl">{title}</h3>
      <p className="max-w-md text-sm text-white/90 sm:text-base">{subtitle}</p>
      <button
        type="button"
        onClick={onUpgrade}
        className="no-print mt-1 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-primary-purple shadow-md transition hover:opacity-90 sm:text-base"
      >
        {buttonLabel}
      </button>
    </div>
  );
}

// Recuadro Newsletter ADIPA: tarjeta glassmorphic (fondo en degradado de
// marca + bordes/inputs translúcidos con blur) en el footer institucional,
// igual para los 3 niveles del informe. No hay backend propio para
// procesar la suscripción, así que -en vez de simular un formulario que
// en realidad no inscribe a nadie- el envío abre la página real de
// suscripción de adipa.cl en una pestaña nueva, donde se completa de
// verdad.
function NewsletterCard() {
  const [email, setEmail] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (typeof window !== "undefined") {
      window.open("https://adipa.cl/#newsletter", "_blank", "noopener,noreferrer");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="no-print relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/30 bg-gradient-to-br from-primary-purple to-primary-cyan p-6 text-center text-white shadow-lg sm:p-8"
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/20 blur-3xl" />
      <div className="relative flex flex-col items-center gap-3">
        <h3 className="text-lg font-bold sm:text-xl">¿No quieres perderte de nada?</h3>
        <p className="max-w-md text-sm text-white/90">
          Inscríbete al newsletter de ADIPA y recibe noticias, seminarios gratuitos y actualizaciones de
          tu área.
        </p>
        <div className="mt-2 flex w-full max-w-sm flex-col gap-2 sm:flex-row">
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="tu@correo.com"
            aria-label="Correo electrónico"
            className="w-full flex-1 rounded-xl border border-white/40 bg-white/15 px-4 py-2.5 text-sm text-white placeholder:text-white/60 backdrop-blur-md transition focus:border-white focus:outline-none"
          />
          <button
            type="submit"
            className="flex-shrink-0 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-primary-purple shadow-md transition hover:opacity-90"
          >
            Suscribirme
          </button>
        </div>
        <span className="text-[11px] text-white/70">Se abrirá adipa.cl para completar tu suscripción.</span>
      </div>
    </form>
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
  // Solo se usa/muestra en el nivel Profundo (ver Bloque 4: "Top 3
  // Capítulos Recomendados por tu Perfil"); en Express/Estándar no se
  // renderiza sección de Adipados.
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

  // Nivel del informe según la duración elegida en Landing (Paso 2):
  // Express (10), Estándar (15) o Profundo (25). questionCount siempre
  // viene en quizResult (ver QuizModule.jsx#onComplete); 25 por defecto
  // si por algún motivo faltara.
  const questionCount = quizResult?.questionCount ?? 25;
  const tier = questionCount <= 10 ? "EXPRESS" : questionCount <= 15 ? "ESTANDAR" : "PROFUNDO";
  const percentLabel = isValidating ? "de compatibilidad" : "de afinidad";
  const secondaryAreas = topAreas.filter((area) => area.id !== school?.id).slice(0, 2);
  const top3Programs = programs.slice(0, 3);
  const top3Seminars = seminars.slice(0, 3);
  const top3Resources = resources.slice(0, 3);
  // Los episodios enlazan a Spotify (mismo comportamiento que
  // PodcastWidget.jsx), no al post de adipa.cl que trae `item.url` por
  // defecto -por eso se remapea acá antes de pasarlos a OfferCarousel/
  // OfferCard, que siempre usan `item.url` como link-.
  const top3Episodes = podcastEpisodes
    .slice(0, 3)
    .map((episode) => ({ ...episode, url: episode.spotifyUrl ?? ADIPADOS_SPOTIFY_URL }));

  const handleUpgradeClick = () => {
    onRestart?.();
  };

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
      {/* Reporte imprimible: encabezado + resultado + recomendaciones,
          sobre el fondo oscuro corporativo de ADIPA. Estructura del
          informe según el nivel (tier). */}
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

          {/* Informe detallado y recomendación personalizada, según nivel */}
          <div
            className="relative flex flex-col gap-5 overflow-hidden rounded-2xl p-6 text-white shadow-md sm:p-8"
            style={{ background: `linear-gradient(135deg, ${school.color} 0%, ${school.color}CC 100%)` }}
          >
            {/* --- Encabezado del nivel --- */}
            <div className="flex flex-col items-center gap-2 text-center sm:items-start sm:text-left">
              {tier === "PROFUNDO" ? (
                <span className="rounded-full bg-white/20 px-4 py-1 text-xs font-bold uppercase tracking-wide backdrop-blur-md">
                  Máxima Precisión · 100%
                </span>
              ) : (
                matchPercent !== null && (
                  <span className="rounded-full bg-white/20 px-4 py-1 text-xs font-bold uppercase tracking-wide backdrop-blur-md">
                    {matchPercent}% {percentLabel}
                  </span>
                )
              )}
              <span className="text-xs font-semibold uppercase tracking-wide text-white/70">
                {school.name}
              </span>
              {tier === "EXPRESS" && (
                <h2 className="text-2xl font-bold sm:text-3xl">
                  {isValidating
                    ? `Validación de Perfil: ${subspecialty.label}`
                    : `Tu área afín principal es: ${subspecialty.label}`}
                </h2>
              )}
              {tier === "ESTANDAR" && (
                <h2 className="text-2xl font-bold sm:text-3xl">
                  {isValidating
                    ? `Confirmación y Diagnóstico: ${subspecialty.label}`
                    : `Perfil de Especialización: ${subspecialty.label}`}
                </h2>
              )}
              {tier === "PROFUNDO" && (
                <>
                  <h2 className="text-2xl font-bold sm:text-3xl">
                    Informe de Orientación Profesional Completo
                  </h2>
                  <p className="text-sm font-semibold text-white/85 sm:text-base">{subspecialty.label}</p>
                </>
              )}
            </div>

            {/* --- Diagnóstico --- */}
            {tier === "EXPRESS" && (
              <div className="flex flex-col gap-2 rounded-xl bg-white/10 p-4 backdrop-blur-md">
                <h3 className="text-xs font-bold uppercase tracking-wide text-white/80">
                  Diagnóstico Directo
                </h3>
                <p className="text-sm leading-relaxed text-white/95 sm:text-base">
                  {insights?.analysis ?? buildFallbackExplanation(school, subspecialty)}
                </p>
              </div>
            )}

            {tier === "ESTANDAR" && (
              <>
                <div className="flex flex-col gap-2 rounded-xl bg-white/10 p-4 backdrop-blur-md">
                  <h3 className="text-xs font-bold uppercase tracking-wide text-white/80">
                    {isValidating ? "🔍 Validación de tu Enfoque" : "🔍 Análisis de Tu Perfil"}
                  </h3>
                  <p className="text-sm leading-relaxed text-white/95 sm:text-base">
                    {isValidating && `Confirmamos que tu enfoque en ${subspecialty.label} es sólido. `}
                    {insights?.analysis ?? buildFallbackExplanation(school, subspecialty)}
                  </p>
                </div>

                {secondaryAreas.length > 0 && (
                  <div className="flex flex-col gap-2 rounded-xl bg-white/10 p-4 backdrop-blur-md">
                    <h3 className="text-xs font-bold uppercase tracking-wide text-white/80">
                      Áreas Secundarias Complementarias
                    </h3>
                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                      {secondaryAreas.map((area) => (
                        <div
                          key={area.id}
                          className="flex items-center justify-between gap-2 rounded-lg bg-white/10 px-3.5 py-2.5 text-sm"
                        >
                          <span className="min-w-0 truncate font-semibold text-white">{area.name}</span>
                          <span className="flex-shrink-0 font-bold text-white/90">{area.percent}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {insights?.strengths?.length > 0 && (
                  <div className="flex flex-col gap-2 rounded-xl bg-white/10 p-4 backdrop-blur-md">
                    <h3 className="text-xs font-bold uppercase tracking-wide text-white/80">
                      💪 Tus Fortalezas Clave
                    </h3>
                    <StrengthsGrid strengths={insights.strengths} />
                  </div>
                )}
              </>
            )}

            {tier === "PROFUNDO" && (
              <>
                <div className="flex flex-col gap-3 rounded-xl bg-white/10 p-4 backdrop-blur-md">
                  <h3 className="text-xs font-bold uppercase tracking-wide text-white/80">
                    {isValidating ? "🔍 Validación de tu Enfoque" : "🔍 Análisis de Tu Perfil"}
                  </h3>
                  <p className="text-sm leading-relaxed text-white/95 sm:text-base">
                    {isValidating && `Confirmamos que tu enfoque en ${subspecialty.label} es sólido. `}
                    {insights?.analysis ?? buildFallbackExplanation(school, subspecialty)}
                  </p>
                  {insights?.superpower && (
                    <p className="rounded-lg bg-white/10 px-3.5 py-2.5 text-sm font-semibold italic text-white sm:text-base">
                      ✨ {insights.superpower}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-3 rounded-xl bg-white/10 p-4 backdrop-blur-md">
                  <h3 className="text-xs font-bold uppercase tracking-wide text-white/80">
                    Análisis de Competencias
                  </h3>
                  <StrengthsGrid strengths={insights?.strengths ?? []} />
                  {insights?.recommendation && (
                    <div className="flex flex-col gap-1.5 rounded-lg bg-white/10 p-3.5">
                      <span className="text-[11px] font-bold uppercase tracking-wide text-white/70">
                        Oportunidades de Crecimiento
                      </span>
                      <p className="text-sm leading-relaxed text-white/95 sm:text-base">
                        {insights.recommendation}
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* --- Bloques de Recomendaciones (carruseles), según nivel --- */}
          <section className="flex flex-col gap-5">
            <h2 className="text-lg font-semibold text-white sm:text-xl">
              Esto es lo que te recomendamos según tu perfil
            </h2>

            <OfferCarousel
              title="Top 3 Programas Recomendados"
              items={top3Programs}
              tagLabel="Programa ADIPA"
              ctaLabel="Ver en adipa.cl"
              loading={loading}
              emptyHref={programsFallbackUrl ?? school.url}
              emptyLabel={`Ver toda la oferta de ${school.name} en adipa.cl`}
            />

            {(tier === "ESTANDAR" || tier === "PROFUNDO") && (
              <OfferCarousel
                title="Top 3 Seminarios Gratuitos"
                items={top3Seminars}
                tagLabel="Seminario Gratuito"
                ctaLabel="Inscribirme en adipa.cl"
                loading={loading}
                emptyHref={seminarsFallbackUrl ?? "https://adipa.cl/seminarios/"}
                emptyLabel="Ver todos los seminarios gratuitos en adipa.cl"
              />
            )}

            {tier === "PROFUNDO" && (
              <OfferCarousel
                title="Profundiza en esta área con recursos gratuitos"
                items={top3Resources}
                tagLabel="Recurso Gratuito"
                ctaLabel="Descarga Gratuita"
                loading={loading}
                emptyHref={resourcesFallbackUrl ?? "https://adipa.cl/recursos/ebooks/"}
                emptyLabel="Ver todos los recursos gratuitos en adipa.cl"
                compact
              />
            )}

            {/* Adipados (podcast): solo en Profundo, como carrusel "Top 3"
                -mismo lenguaje visual que Programas/Seminarios/Recursos-,
                en vez del widget aparte de antes. No se muestra en
                Express ni Estándar. */}
            {tier === "PROFUNDO" && (
              <OfferCarousel
                title="Top 3 Capítulos Recomendados por tu Perfil"
                items={top3Episodes}
                tagLabel="Capítulo Adipados"
                ctaLabel="Escuchar en Spotify"
                loading={loading}
                emptyHref={ADIPADOS_SPOTIFY_URL}
                emptyLabel="Escuchar Adipados en Spotify"
                compact
              />
            )}
          </section>

          {/* --- Banner CTA de cierre: sube de nivel (no aplica a Profundo,
              que ya es el nivel máximo) --- */}
          {tier === "EXPRESS" && (
            <UpgradeCtaBanner
              title="¿Te gustaría descubrir qué cursos y seminarios gratuitos calzan con tu perfil?"
              subtitle="Responde 5 preguntas más en la versión Estándar y desbloquea tus recomendaciones personalizadas."
              buttonLabel="Continuar a Versión Estándar ➔"
              onUpgrade={handleUpgradeClick}
            />
          )}
          {tier === "ESTANDAR" && (
            <UpgradeCtaBanner
              title="¿Quieres obtener tu mapa de desarrollo profesional detallado?"
              subtitle="Completa la evaluación Profunda para analizar tus competencias clave y oportunidades de especialización al máximo."
              buttonLabel="Desbloquear Análisis Profundo ➔"
              onUpgrade={handleUpgradeClick}
            />
          )}
        </div>
      </div>

      {/* Comparte tu Resultado (Story 9:16) - fuera del reporte imprimible.
          Adipa Social Kit: se mantiene intacto en los 3 niveles. */}
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

      {/* Footer institucional: Newsletter + Redes Sociales + acciones. El
          recuadro aparte "Somos ADIPA" (TikTok) ya no va: TikTok ahora
          vive dentro de la fila de íconos de Redes Sociales del footer. */}
      <NewsletterCard />

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
        <div className="flex flex-wrap items-center justify-center gap-3">
          {SOCIAL_LINKS.map(({ name, url, Icon }) => (
            <a
              key={name}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={name}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-secondary-navy/15 bg-white text-secondary-navy shadow-sm transition hover:-translate-y-0.5 hover:border-primary-cyan hover:text-primary-purple hover:shadow-md"
            >
              <Icon className="h-5 w-5" />
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
