"use client";

// components/ShareCard.jsx
//
// Carrusel de 3 tarjetas para Instagram Stories (9:16, 1080x1920),
// estilo "Wrapped": navegación lateral (swipe + flechas), fondo oscuro
// corporativo de ADIPA con degradado vertical y glow, márgenes de
// seguridad para la UI de Instagram, e ícono dinámico según el área de
// especialidad. Cada tarjeta se puede compartir/descargar de forma
// individual (Web Share API en celulares, con descarga PNG en alta
// resolución como respaldo/desktop vía html-to-image).
//
// Tarjeta 1 "Mi Ruta de Especialización": los 3 programas ADIPA con
//   mayor coincidencia según el resultado.
// Tarjeta 2 "Mi Sello Profesional": ícono de área + fortalezas clave.
// Tarjeta 3 "Mi Radar de Afinidad": donut con el % principal + desglose
//   de las 2 áreas siguientes con mayor afinidad.

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

function DonutGauge({ percent, label }) {
  const gradientId = useId();
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, percent ?? 0));
  const dash = (clamped / 100) * circumference;

  return (
    <div className="relative flex h-36 w-36 flex-shrink-0 items-center justify-center">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2CB7FF" />
            <stop offset="100%" stopColor="#B48CFF" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="9" />
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
      <div className="absolute flex flex-col items-center px-3 text-center">
        <span className="text-3xl font-extrabold leading-none">{clamped}%</span>
        {label && (
          <span className="mt-1 max-w-[92px] text-[9px] font-bold uppercase leading-tight tracking-wide text-white/75">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}

function StickerCallout({ children }) {
  return (
    <span className="w-fit max-w-[85%] rounded-2xl rounded-bl-sm bg-white px-3.5 py-2 text-xs font-semibold leading-snug text-secondary-navy shadow-md">
      {children}
    </span>
  );
}

function StoryFrame({ innerRef, kicker, children, footer }) {
  return (
    <div
      ref={innerRef}
      className="relative flex aspect-[9/16] w-full flex-col overflow-hidden rounded-3xl bg-gradient-to-b from-[#0B132B] to-[#3A1C71] text-white shadow-2xl"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary-purple/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-primary-cyan/25 blur-3xl" />

      <div className="relative flex h-full flex-col px-6 pb-[10%] pt-[8%]">
        <div className="flex items-center gap-2">
          <img
            src="/adipa-icon.png"
            alt="ADIPA"
            className="h-8 w-8 rounded-full border border-white/40 object-cover backdrop-blur-md"
          />
          <span className="text-xs font-bold tracking-wide">ADIPA</span>
        </div>

        {kicker && (
          <span className="mt-3 text-[10px] font-bold uppercase tracking-wide text-secondary-light/70">
            {kicker}
          </span>
        )}

        <div className="flex flex-1 flex-col justify-center gap-4 py-4">{children}</div>

        <div className="flex flex-col items-center gap-2 text-center">{footer}</div>
      </div>
    </div>
  );
}

function DefaultFooter() {
  return <span className="text-[11px] font-bold tracking-wide text-white/80">adipa.cl</span>;
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
  const touchStartX = useRef(null);
  const toastTimeoutRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);
  const [toastVisible, setToastVisible] = useState(false);

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

  const goNext = () => setActiveIndex((i) => (i + 1) % 3);
  const goPrev = () => setActiveIndex((i) => (i + 2) % 3);

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event) => {
    if (touchStartX.current === null) return;
    const deltaX = (event.changedTouches[0]?.clientX ?? touchStartX.current) - touchStartX.current;
    if (Math.abs(deltaX) > 40) {
      if (deltaX < 0) goNext();
      else goPrev();
    }
    touchStartX.current = null;
  };

  const showToast = () => {
    setToastVisible(true);
    if (toastTimeoutRef.current) window.clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = window.setTimeout(() => setToastVisible(false), 2500);
  };

  const handleShareOrDownload = async () => {
    const node = cardRefs[activeIndex].current;
    if (!node) return;

    setExporting(true);
    setError(null);

    try {
      const { toPng } = await import("html-to-image");
      const scale = node.offsetWidth ? 1080 / node.offsetWidth : 3;
      const dataUrl = await toPng(node, { pixelRatio: scale, cacheBust: true });
      const filename = `adipa-${firstName.toLowerCase()}-tarjeta-${activeIndex + 1}.png`;

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

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = filename;
      link.click();
    } catch (err) {
      console.error("[ShareCard] No se pudo generar la imagen:", err);
      setError("No pudimos generar la imagen. Intenta nuevamente.");
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
      showToast();
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

      <div className="relative w-full max-w-[320px]">
        <div className="overflow-hidden rounded-3xl">
          <div
            className="flex transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Tarjeta 1: Mi Ruta de Especialización */}
            <div className="relative w-full flex-shrink-0 px-1">
              <div className="pointer-events-none absolute -inset-1 rounded-[2rem] bg-gradient-to-br from-primary-purple via-primary-cyan to-primary-purple opacity-60 blur-xl" />
              <StoryFrame
                innerRef={cardRefs[0]}
                kicker="Mi Ruta de Especialización"
                footer={<DefaultFooter />}
              >
                <h3 className="text-2xl font-extrabold leading-tight sm:text-3xl">
                  MIS 3 RECOMENDADOS
                </h3>
                {topPrograms.length > 0 ? (
                  <ol className="flex flex-col gap-2.5">
                    {topPrograms.map((program, index) => (
                      <li
                        key={program.id ?? index}
                        className="flex items-start gap-2.5 text-sm font-medium leading-snug text-white/95"
                      >
                        <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-white/15 text-[11px] font-bold">
                          {index + 1}
                        </span>
                        <span>{program.title}</span>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-sm text-white/75">
                    Descubre los programas recomendados para ti en adipa.cl.
                  </p>
                )}
                <StickerCallout>Para potenciar mi práctica en {areaLabel}!</StickerCallout>
              </StoryFrame>
            </div>

            {/* Tarjeta 2: Mi Sello Profesional */}
            <div className="relative w-full flex-shrink-0 px-1">
              <div className="pointer-events-none absolute -inset-1 rounded-[2rem] bg-gradient-to-br from-primary-purple via-primary-cyan to-primary-purple opacity-60 blur-xl" />
              <StoryFrame
                innerRef={cardRefs[1]}
                kicker="Mi Sello Profesional"
                footer={<DefaultFooter />}
              >
                <div className="flex flex-col items-center gap-3 text-center">
                  <h3 className="text-xl font-extrabold sm:text-2xl">PERFIL PROFESIONAL ADIPA</h3>
                  <AreaIcon className="h-14 w-14" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-semibold text-secondary-light/90">{handle}</span>
                    <span className="text-xs text-white/70">Especialidad: {areaLabel}</span>
                  </div>
                  {strengths.length > 0 && (
                    <ul className="mt-1 flex w-full flex-col gap-2 text-left">
                      {strengths.slice(0, 3).map((strength) => (
                        <li
                          key={strength}
                          className="flex items-start gap-2 text-[13px] font-medium leading-snug text-white/95"
                        >
                          <span className="mt-0.5 text-primary-cyan">✓</span>
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <StickerCallout>Mis fortalezas en el área {areaLabel}</StickerCallout>
                </div>
              </StoryFrame>
            </div>

            {/* Tarjeta 3: Mi Radar de Afinidad */}
            <div className="relative w-full flex-shrink-0 px-1">
              <div className="pointer-events-none absolute -inset-1 rounded-[2rem] bg-gradient-to-br from-primary-purple via-primary-cyan to-primary-purple opacity-60 blur-xl" />
              <StoryFrame
                innerRef={cardRefs[2]}
                kicker="Mi Radar de Afinidad"
                footer={
                  <span className="rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold text-white backdrop-blur-md">
                    Descubre el tuyo en adipa.cl ✨
                  </span>
                }
              >
                <div className="flex flex-col items-center gap-4 text-center">
                  <h3 className="text-base font-extrabold uppercase leading-tight sm:text-lg">
                    Resultados del Quiz de Orientación
                  </h3>
                  <DonutGauge percent={matchPercent ?? 0} label={areaLabel} />
                  {secondaryAreas.length > 0 && (
                    <div className="flex w-full flex-col gap-2.5">
                      {secondaryAreas.map((area) => (
                        <div key={area.id} className="flex flex-col gap-1 text-left">
                          <div className="flex items-center justify-between text-[11px] font-semibold text-white/80">
                            <span>{area.name}</span>
                            <span>{area.percent}%</span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/15">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-primary-cyan to-primary-purple"
                              style={{ width: `${area.percent}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <StickerCallout>Mi perfil académico ideal, ¿y el tuyo?</StickerCallout>
                </div>
              </StoryFrame>
            </div>
          </div>
        </div>

        {/* Flechas de navegación lateral */}
        <button
          type="button"
          onClick={goPrev}
          aria-label="Tarjeta anterior"
          className="absolute left-[-6px] top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-secondary-navy/80 text-lg text-white shadow-md backdrop-blur-md transition hover:bg-secondary-navy"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={goNext}
          aria-label="Tarjeta siguiente"
          className="absolute right-[-6px] top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-secondary-navy/80 text-lg text-white shadow-md backdrop-blur-md transition hover:bg-secondary-navy"
        >
          ›
        </button>
      </div>

      {/* Indicadores de posición */}
      <div className="flex items-center gap-2">
        {[0, 1, 2].map((index) => (
          <button
            key={index}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`Ir a la tarjeta ${index + 1}`}
            className={`h-2 rounded-full transition-all ${
              index === activeIndex ? "w-6 bg-primary-purple" : "w-2 bg-secondary-lavender"
            }`}
          />
        ))}
      </div>

      {/* Botones de acción, fuera de la tarjeta */}
      <div className="flex w-full max-w-[320px] flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleShareOrDownload}
          disabled={exporting}
          className="flex-1 rounded-xl bg-primary-purple px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
        >
          {exporting ? "Generando imagen..." : "📸 Compartir / Descargar Tarjeta"}
        </button>
        <button
          type="button"
          onClick={handleCopyLink}
          className="flex-1 rounded-xl border border-primary-purple px-5 py-3 text-sm font-semibold text-primary-purple shadow-md transition hover:bg-primary-gray sm:text-base"
        >
          🔗 Copiar Enlace del Quiz
        </button>
      </div>

      {error && <p className="text-xs font-medium text-red-600">{error}</p>}

      {/* Toast de confirmación al copiar el enlace */}
      <div
        aria-live="polite"
        className={`pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-secondary-navy px-5 py-2.5 text-sm font-semibold text-white shadow-lg ring-1 ring-white/20 transition-all duration-300 ${
          toastVisible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        }`}
      >
        ✅ Enlace copiado al portapapeles
      </div>
    </section>
  );
}
