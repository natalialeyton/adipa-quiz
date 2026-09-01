"use client";

// components/ShareCard.jsx
//
// "Adipa Social Kit": vista previa unificada de las 3 Historias de
// Instagram (9:16, 1080x1920 al exportar) dentro de un marco azul
// corporativo con glow, estilo "Wrapped". Cada Historia lleva solo una
// etiqueta simple de marca (ícono + "ADIPA", sin barra de progreso ni
// @handle simulando la UI real de Instagram) y se puede seleccionar
// (anillo de selección) para compartirla individualmente; "Descargar
// Todas" exporta las 3 en alta resolución vía html-to-image.
//
// Responsive: en pantallas chicas/medianas las 3 Historias son un
// carrusel horizontal deslizable (snap-x); solo a partir de "lg"
// (≥1024px, con espacio real) se muestran las 3 en una cuadrícula fija.
// Todo texto variable (títulos de programas, nombre de escuela, áreas)
// usa line-clamp + min-w-0 para nunca desbordar ni cortarse a la mitad.
//
// Historia "Mis 3 Recomendados": los 3 programas ADIPA con mayor
//   coincidencia según el resultado, cada uno con un ícono blanco sobre
//   fondo de alto contraste, + botón "Ver perfil".
// Historia "Perfil [Escuela] ADIPA": ícono de área + 3 tarjetas-pilar con
//   las fortalezas clave.
// Historia "Resultados del Quiz de Orientación": donut con el % principal
//   + desglose de las 2 áreas siguientes con mayor afinidad.

import { useEffect, useId, useRef, useState } from "react";
import { getAreaIconComponent } from "./icons/AreaIcons";

function slugifyHandle(fullName) {
  const base = (fullName ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "");
  return `@${base || "futuro_especialista"}`;
}

// Íconos blancos (trazo blanco puro, sin degradado) para las tarjetas de
// curso de la Historia "Mis 3 Recomendados": necesitan alto contraste
// sobre su badge de fondo sólido, a diferencia de los íconos línea-neón
// del resto de la app.
function GraduationCapGlyph(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" {...props}>
      <path
        d="M12 5 2 9.5 12 14l10-4.5L12 5Z"
        stroke="#FFFFFF"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M6 11.5V16c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-4.5" stroke="#FFFFFF" strokeWidth="1.6" />
      <path d="M21 9.5v5" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function HeartGlyph(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" {...props}>
      <path
        d="M12 20s-7.2-4.6-9.7-9.1C.7 7.8 2.2 4.5 5.6 4c2-.3 3.8.6 4.9 2.2C11.6 4.6 13.4 3.7 15.4 4c3.4.5 4.9 3.8 3.3 6.9C16.2 15.4 12 20 12 20Z"
        stroke="#FFFFFF"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShieldCheckGlyph(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" {...props}>
      <path
        d="M12 3.5 4.5 6v5.5C4.5 15.9 7.7 19.7 12 21c4.3-1.3 7.5-5.1 7.5-9.5V6L12 3.5Z"
        stroke="#FFFFFF"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M8.7 11.7l2.1 2.1 4.2-4.4" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Heurística por palabras clave del título real del curso (no inventamos
// categorías: adipa.cl no expone un "tipo de ícono" en su API, así que
// elegimos el glifo más representativo del contenido).
function pickProgramIcon(title) {
  const t = (title ?? "").toLowerCase();
  if (/superviv|evaluaci|forense|perit|assessment|protecci|seguridad/.test(t)) return ShieldCheckGlyph;
  if (/clínic|terapia|apoyo|acompañ|cuidado|bienestar|duelo|trauma|salud mental/.test(t)) return HeartGlyph;
  return GraduationCapGlyph;
}

function DonutGauge({ percent, label }) {
  const gradientId = useId();
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, percent ?? 0));
  const dash = (clamped / 100) * circumference;

  return (
    <div className="relative flex h-24 w-24 flex-shrink-0 items-center justify-center">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2CB7FF" />
            <stop offset="100%" stopColor="#B48CFF" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="9" />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference - dash}`}
        />
      </svg>
      <div className="absolute flex flex-col items-center px-2.5 text-center">
        <span className="text-lg font-extrabold leading-none text-white">{clamped}%</span>
        {label && (
          <span className="mt-1 line-clamp-2 max-w-[72px] break-words text-[7px] font-bold uppercase leading-tight tracking-wide text-white">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}

// Etiqueta de marca simple dentro de cada Historia: solo ícono + "ADIPA".
// Se removieron la barra de progreso segmentada y el "@adipaoficial" que
// simulaban la interfaz real de Instagram Stories — la imagen debe verse
// y descargarse como una imagen normal para compartir, no como una
// réplica de la UI de Instagram.
function StoryStatusHeader() {
  return (
    <div className="flex items-center gap-2">
      <img
        src="/adipa-icon.png"
        alt="ADIPA"
        className="h-6 w-6 rounded-full border border-white/40 object-cover"
      />
      <span className="text-[11px] font-extrabold uppercase tracking-wide text-white">
        ADIPA
      </span>
    </div>
  );
}

function StoryFrame({ innerRef, kicker, children, footer }) {
  // Ya no es un <button> seleccionable: con el carrusel estricto de 1
  // tarjeta a la vez, la Historia visible en pantalla ES la Historia
  // "seleccionada" (la que exportan Descargar/Compartir), así que no
  // hace falta un estado de selección aparte ni un anillo destacado.
  return (
    <div
      ref={innerRef}
      className="relative flex aspect-[9/16] w-full flex-shrink-0 flex-col overflow-hidden rounded-3xl bg-gradient-to-b from-primary-purple to-primary-cyan text-left text-white shadow-2xl"
    >
      <div className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-white/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-8 h-44 w-44 rounded-full bg-white/10 blur-3xl" />

      <div className="relative flex h-full min-w-0 flex-col px-3.5 pb-[5%] pt-[4%] sm:px-4">
        <StoryStatusHeader />

        {kicker && (
          <span className="mt-2 line-clamp-1 text-[9px] font-bold uppercase tracking-wide text-white/90">
            {kicker}
          </span>
        )}

        {/* justify-start (no "center"): si el contenido llegara a ser más
            alto que el espacio disponible, debe recortarse solo por abajo
            — centrar + overflow-hidden recorta arriba Y abajo por igual,
            lo que hace que el título de más arriba desaparezca y parezca
            "flotar" encima del texto de abajo. */}
        <div className="flex min-h-0 flex-1 flex-col justify-start gap-2 overflow-hidden py-1.5">
          {children}
        </div>

        <div className="flex flex-shrink-0 flex-col items-center gap-2 text-center">{footer}</div>
      </div>
    </div>
  );
}

function DefaultFooter() {
  return <span className="text-[10px] font-bold tracking-wide text-white">adipa.cl</span>;
}

export default function ShareCard({
  userData,
  school,
  subspecialty,
  subspecialtyId,
  matchPercent,
  programs = [],
  strengths = [],
  topAreas = [],
}) {
  const cardRefs = [useRef(null), useRef(null), useRef(null)];
  const toastTimeoutRef = useRef(null);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("¡Link copiado!");

  const firstName = userData?.fullName?.split(" ")[0] || "Futuro/a Especialista";
  const handle = slugifyHandle(userData?.fullName);
  const areaLabel = subspecialty?.label ?? school?.name ?? "tu especialidad";
  const AreaIcon = getAreaIconComponent(subspecialtyId);
  const topPrograms = programs.slice(0, 3);
  const secondaryAreas = topAreas.filter((area) => area.id !== school?.id).slice(0, 2);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) window.clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  const showToast = (message) => {
    setToastMessage(message);
    setToastVisible(true);
    if (toastTimeoutRef.current) window.clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = window.setTimeout(() => setToastVisible(false), 2500);
  };

  async function exportCardToPng(node, filename) {
    const { toPng } = await import("html-to-image");
    const scale = node.offsetWidth ? 1080 / node.offsetWidth : 3;
    const dataUrl = await toPng(node, { pixelRatio: scale, cacheBust: true });
    return { dataUrl, filename };
  }

  const downloadDataUrl = (dataUrl, filename) => {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    link.click();
  };

  const handleShareSelected = async () => {
    const node = cardRefs[selectedIndex].current;
    if (!node) return;

    setExporting(true);
    setError(null);

    try {
      const filename = `adipa-${firstName.toLowerCase()}-historia-${selectedIndex + 1}.png`;
      const { dataUrl } = await exportCardToPng(node, filename);

      if (typeof navigator !== "undefined" && navigator.canShare) {
        try {
          const blob = await (await fetch(dataUrl)).blob();
          const file = new File([blob], filename, { type: "image/png" });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: "Mi resultado ADIPA",
              text: "Descubre tu especialidad en adipa.cl",
            });
            setExporting(false);
            return;
          }
        } catch (shareErr) {
          if (shareErr?.name === "AbortError") {
            setExporting(false);
            return;
          }
          console.warn("[ShareCard] Web Share falló, uso descarga directa:", shareErr);
        }
      }

      downloadDataUrl(dataUrl, filename);
    } catch (err) {
      console.error("[ShareCard] No se pudo generar la imagen:", err);
      setError("No pudimos generar la imagen. Intenta nuevamente.");
    } finally {
      setExporting(false);
    }
  };

  const handleDownloadAll = async () => {
    setExporting(true);
    setError(null);

    try {
      for (let i = 0; i < cardRefs.length; i += 1) {
        const node = cardRefs[i].current;
        if (!node) continue;
        const filename = `adipa-${firstName.toLowerCase()}-historia-${i + 1}.png`;
        const { dataUrl } = await exportCardToPng(node, filename);
        downloadDataUrl(dataUrl, filename);
        // Pequeña pausa entre descargas: algunos navegadores bloquean
        // múltiples descargas disparadas en el mismo instante.
        // eslint-disable-next-line no-await-in-loop
        await new Promise((resolve) => window.setTimeout(resolve, 400));
      }
    } catch (err) {
      console.error("[ShareCard] No se pudo generar el kit completo:", err);
      setError("No pudimos generar alguna de las imágenes. Intenta nuevamente.");
    } finally {
      setExporting(false);
    }
  };

  const handleCopyLink = async () => {
    const quizUrl = typeof window !== "undefined" ? window.location.origin : "https://adipa.cl";

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(quizUrl);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = quizUrl;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setError(null);
      showToast("¡Link copiado!");
    } catch (err) {
      console.error("[ShareCard] No se pudo copiar el enlace:", err);
      setError("No pudimos copiar el enlace. Intenta nuevamente.");
    }
  };

  return (
    <section className="no-print flex flex-col items-center gap-4">
      <h2 className="text-lg font-semibold text-secondary-navy sm:text-xl">
        Comparte tu Resultado
      </h2>

      {/* Adipa Social Kit: marco corporativo con vista unificada de las 3 Historias */}
      <div className="relative w-full max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-b from-secondary-navy to-[#1C2541] p-3 shadow-2xl sm:p-4">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary-purple/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-primary-cyan/20 blur-3xl" />

        <div className="relative flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <img
              src="/adipa-icon.png"
              alt="ADIPA"
              className="h-8 w-8 rounded-full border border-white/30 object-cover"
            />
            <span className="text-sm font-bold text-white">Adipa Social Kit</span>
            <span className="ml-auto rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-secondary-light">
              Vista General · 3 Historias de Instagram
            </span>
          </div>

          {/* El contenedor real de la app nunca supera ~672px de ancho (lo
              limita el <main> de la página, no este componente), así que
              "3 columnas lado a lado" siempre terminaba siendo 3 tarjetas
              de ~200px — imposible que quepa bien el contenido sin importar
              cuánto se achiquen letras e íconos. Carrusel estricto de 1
              sola tarjeta visible a la vez: el "viewport" recorta con
              overflow-hidden y el "track" interno se desliza con
              translateX(-index * 100%), exactamente una tarjeta por vez,
              sin que asome ni un borde de la tarjeta vecina. */}
          <div className="relative">
            <div className="overflow-hidden rounded-2xl">
              <div
                className="flex transition-transform duration-300 ease-out"
                style={{ transform: `translateX(-${selectedIndex * 100}%)` }}
              >
            {/* Historia 1: Mis 3 Recomendados */}
            <div className="w-full min-w-0 flex-shrink-0">
              <StoryFrame
                innerRef={cardRefs[0]}
                kicker="Mi Ruta de Especialización"
                footer={
                  <span className="rounded-full bg-white px-5 py-1.5 text-[11px] font-bold text-secondary-navy shadow-md">
                    Ver perfil ⌃
                  </span>
                }
              >
                <h3 className="line-clamp-2 break-words text-sm font-extrabold leading-tight text-white sm:text-base">
                  MIS 3 RECOMENDADOS
                </h3>
                {topPrograms.length > 0 ? (
                  <ol className="flex min-w-0 flex-col gap-1.5">
                    {topPrograms.map((program, index) => {
                      const Icon = pickProgramIcon(program.title);
                      return (
                        <li
                          key={program.id ?? index}
                          className="flex min-w-0 items-start gap-2 rounded-xl bg-white/10 p-1.5 text-[10px] font-medium leading-snug text-white sm:text-[11px]"
                        >
                          <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-secondary-navy/60 to-secondary-navy/40 shadow-sm ring-1 ring-white/40">
                            <Icon className="h-3.5 w-3.5" />
                          </span>
                          <span className="line-clamp-2 min-w-0 break-words">{program.title}</span>
                        </li>
                      );
                    })}
                  </ol>
                ) : (
                  <p className="text-xs text-white/85">
                    Descubre los programas recomendados para ti en adipa.cl.
                  </p>
                )}
              </StoryFrame>
            </div>

            {/* Historia 2: Perfil [Escuela] ADIPA */}
            <div className="w-full min-w-0 flex-shrink-0">
              <StoryFrame
                innerRef={cardRefs[1]}
                kicker="Mi Sello Profesional"
                footer={<DefaultFooter />}
              >
                <div className="flex min-w-0 flex-col items-center gap-1.5 text-center">
                  <h3 className="line-clamp-2 max-w-full break-words text-xs font-extrabold uppercase leading-tight text-white sm:text-sm">
                    Perfil {school?.name ?? "Profesional"} ADIPA
                  </h3>
                  <AreaIcon className="h-8 w-8 flex-shrink-0" />
                  <div className="flex max-w-full flex-col gap-0.5">
                    <span className="truncate text-xs font-semibold text-white">{handle}</span>
                    <span className="line-clamp-2 text-[11px] font-medium text-white/90">
                      Especialidad: {areaLabel}
                    </span>
                  </div>
                  {strengths.length > 0 && (
                    <div className="mt-1 flex w-full min-w-0 flex-col gap-1.5">
                      {strengths.slice(0, 3).map((strength) => (
                        <div
                          key={strength}
                          className="flex min-w-0 items-center gap-2 rounded-xl border border-white/15 bg-white/10 p-1.5 text-left"
                        >
                          <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary-cyan text-[10px] font-bold text-secondary-navy">
                            ✓
                          </span>
                          <span className="line-clamp-2 min-w-0 break-words text-[10px] font-semibold leading-snug text-white sm:text-[11px]">
                            {strength}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </StoryFrame>
            </div>

            {/* Historia 3: Resultados del Quiz de Orientación */}
            <div className="w-full min-w-0 flex-shrink-0">
              <StoryFrame
                innerRef={cardRefs[2]}
                kicker="Mi Radar de Afinidad"
                footer={
                  <span className="rounded-full bg-white/10 px-4 py-1.5 text-[11px] font-bold text-white backdrop-blur-md">
                    Descubre el tuyo en adipa.cl ✨
                  </span>
                }
              >
                <div className="flex min-w-0 flex-col items-center gap-2 text-center">
                  <h3 className="line-clamp-2 max-w-full break-words text-xs font-extrabold uppercase leading-tight text-white sm:text-sm">
                    Resultados del Quiz de Orientación
                  </h3>
                  <DonutGauge percent={matchPercent ?? 0} label={areaLabel} />
                  {secondaryAreas.length > 0 && (
                    <div className="flex w-full min-w-0 flex-col gap-2">
                      {secondaryAreas.map((area) => (
                        <div key={area.id} className="flex min-w-0 flex-col gap-1 text-left">
                          <div className="flex min-w-0 items-center justify-between gap-2 text-[11px] font-bold text-white">
                            <span className="min-w-0 truncate">{area.name}</span>
                            <span className="flex-shrink-0">{area.percent}%</span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-white/20">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-primary-cyan to-primary-purple"
                              style={{ width: `${area.percent}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </StoryFrame>
            </div>
              </div>
            </div>

            {/* Flechas de navegación: absolutas dentro del marco oscuro,
                avanzan/retroceden entre las 3 Historias sin dar la vuelta
                (deshabilitadas visualmente en los extremos). */}
            <button
              type="button"
              onClick={() => setSelectedIndex((i) => Math.max(0, i - 1))}
              disabled={selectedIndex === 0}
              aria-label="Historia anterior"
              className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-secondary-navy/60 text-white shadow-lg ring-1 ring-white/30 backdrop-blur-md transition hover:bg-secondary-navy/80 disabled:cursor-not-allowed disabled:opacity-0"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setSelectedIndex((i) => Math.min(2, i + 1))}
              disabled={selectedIndex === 2}
              aria-label="Historia siguiente"
              className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-secondary-navy/60 text-white shadow-lg ring-1 ring-white/30 backdrop-blur-md transition hover:bg-secondary-navy/80 disabled:cursor-not-allowed disabled:opacity-0"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div className="flex items-center justify-center gap-2">
            {[0, 1, 2].map((index) => (
              <button
                key={index}
                type="button"
                onClick={() => setSelectedIndex(index)}
                aria-label={`Seleccionar Historia ${index + 1}`}
                className={`h-2 rounded-full transition-all ${
                  index === selectedIndex ? "w-6 bg-primary-cyan" : "w-2 bg-white/25"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Botones de acción del kit */}
      <div className="flex w-full max-w-3xl flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleDownloadAll}
          disabled={exporting}
          className="flex-1 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-secondary-navy shadow-md transition hover:bg-primary-gray disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
        >
          {exporting ? "Generando…" : "📥 Descargar Todas"}
        </button>
        <button
          type="button"
          onClick={handleShareSelected}
          disabled={exporting}
          className="flex-1 rounded-xl bg-primary-purple px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
        >
          {exporting ? "Generando…" : "📸 Compartir en Instagram Stories"}
        </button>
        <button
          type="button"
          onClick={handleCopyLink}
          className="flex-1 rounded-xl border border-primary-purple px-5 py-3 text-sm font-semibold text-primary-purple shadow-md transition hover:bg-primary-gray sm:text-base"
        >
          🔗 Copiar Enlace
        </button>
      </div>

      {error && <p className="text-xs font-medium text-red-600">{error}</p>}

      {/* Toast de confirmación */}
      <div
        aria-live="polite"
        className={`pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-secondary-navy px-5 py-2.5 text-sm font-semibold text-white shadow-lg ring-1 ring-white/20 transition-all duration-300 ${
          toastVisible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        }`}
      >
        {toastMessage}
      </div>
    </section>
  );
}
