"use client";

// components/icons/AreaIcons.jsx
//
// Set de íconos vectoriales "line-art" en estética neón (degradado
// cian → púrpura, la misma paleta oficial de ADIPA) para representar cada
// gran área de especialidad dentro de la tarjeta de perfil profesional y
// el resto del informe. Explícitamente NO se usan símbolos médicos
// tradicionales (caduceo, cruces, etc.): solo formas abstractas ligadas a
// mente, desarrollo humano y comunidad, en el mismo lenguaje visual
// "Wrapped" del resto de la app.
//
// Uso: getAreaIcon(subspecialtyId) devuelve el componente de ícono que
// corresponde a esa sub-especialidad (ver ICON_KEY_BY_SUBSPECIALTY).

import { useId } from "react";

function useGradientId(prefix) {
  const id = useId();
  return `${prefix}-${id.replace(/[:]/g, "")}`;
}

function IconShell({ gradientId, children, className }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={className ?? "h-10 w-10"}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2CB7FF" />
          <stop offset="100%" stopColor="#B48CFF" />
        </linearGradient>
      </defs>
      <g stroke={`url(#${gradientId})`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </g>
    </svg>
  );
}

// Cerebro con sinapsis — Psicología Clínica y Psicoterapia de Adultos.
export function BrainSynapsesIcon(props) {
  const gradientId = useGradientId("brain");
  return (
    <IconShell gradientId={gradientId} {...props}>
      <path d="M18 10c-4.4 0-7 3.2-7 6.6 0 1.7.7 3 1.7 4-1.4 1-2.3 2.6-2.3 4.6 0 3.6 3 5.8 6 5.8h1" />
      <path d="M30 10c4.4 0 7 3.2 7 6.6 0 1.7-.7 3-1.7 4 1.4 1 2.3 2.6 2.3 4.6 0 3.6-3 5.8-6 5.8h-1" />
      <path d="M18 10c1.2-1.6 3.3-2.6 6-2.6s4.8 1 6 2.6" />
      <path d="M17 31c0 3 2.3 5.6 7 5.6s7-2.6 7-5.6" />
      <path d="M20 16.5h1.5M27 16.5h1.5M19 22h2M27 22h2M21 27h1.5M26 27h1.5" />
      <circle cx="20" cy="16.5" r="1.1" fill={`url(#${gradientId})`} stroke="none" />
      <circle cx="28.5" cy="16.5" r="1.1" fill={`url(#${gradientId})`} stroke="none" />
      <circle cx="21" cy="22" r="1.1" fill={`url(#${gradientId})`} stroke="none" />
      <circle cx="29" cy="22" r="1.1" fill={`url(#${gradientId})`} stroke="none" />
    </IconShell>
  );
}

// Brote creciendo — Psicología Infanto-Juvenil (desarrollo y crecimiento).
export function SproutIcon(props) {
  const gradientId = useGradientId("sprout");
  return (
    <IconShell gradientId={gradientId} {...props}>
      <path d="M24 40V21" />
      <path d="M24 22c0-6-4.5-9.5-10-9.8C14.4 18 18 22.4 24 22z" />
      <path d="M24 26c0-5.6 4-8.8 9-9C32.7 22.4 29.5 26 24 26z" />
      <path d="M15 40h18" />
      <circle cx="24" cy="14" r="1.2" fill={`url(#${gradientId})`} stroke="none" />
    </IconShell>
  );
}

// Red neuronal detallada — Neuropsicología / Neurociencias.
export function NeuralNetworkIcon(props) {
  const gradientId = useGradientId("neural");
  return (
    <IconShell gradientId={gradientId} {...props}>
      <circle cx="12" cy="14" r="2" />
      <circle cx="12" cy="26" r="2" />
      <circle cx="12" cy="36" r="2" />
      <circle cx="24" cy="10" r="2" />
      <circle cx="24" cy="22" r="2" />
      <circle cx="24" cy="34" r="2" />
      <circle cx="36" cy="16" r="2" />
      <circle cx="36" cy="28" r="2" />
      <path d="M14 14.6l8-3.8M14 15l8 6M14 25.4l8-2.6M14 27l8 6M14 35.4l8-1M26 11l8 4.4M26 21.6l8-4M26 23l8 4M26 33l8-4" />
    </IconShell>
  );
}

// Balanza estilizada en neón — Psicología Jurídica, Forense y Peritaje.
export function LegalScaleIcon(props) {
  const gradientId = useGradientId("scale");
  return (
    <IconShell gradientId={gradientId} {...props}>
      <path d="M24 8v30" />
      <path d="M15 40h18" />
      <path d="M10 15h28" />
      <path d="M10 15L5 25a5 5 0 0010 0z" />
      <path d="M38 15l-5 10a5 5 0 0010 0z" />
      <circle cx="24" cy="8" r="1.6" fill={`url(#${gradientId})`} stroke="none" />
    </IconShell>
  );
}

// Nodos de red humana — Psicología Organizacional, Trabajo y RRHH.
export function NetworkNodesIcon(props) {
  const gradientId = useGradientId("network");
  return (
    <IconShell gradientId={gradientId} {...props}>
      <circle cx="24" cy="12" r="3.2" />
      <circle cx="11" cy="30" r="3.2" />
      <circle cx="37" cy="30" r="3.2" />
      <circle cx="24" cy="38" r="3.2" />
      <path d="M22 15l-8.5 12M26 15l8.5 12M14 32l7.5 5M34 32l-7.5 5" />
    </IconShell>
  );
}

// Libro con conexiones — Psicología Educacional y Psicopedagogía.
export function BookConnectionsIcon(props) {
  const gradientId = useGradientId("book");
  return (
    <IconShell gradientId={gradientId} {...props}>
      <path d="M8 12c4-2 9-2 13 0v26c-4-2-9-2-13 0z" />
      <path d="M40 12c-4-2-9-2-13 0v26c4-2 9-2 13 0z" />
      <circle cx="24" cy="10" r="2" />
      <circle cx="14" cy="20" r="1.4" />
      <circle cx="34" cy="20" r="1.4" />
      <path d="M24 12l-8.5 7M24 12l8.5 7" />
    </IconShell>
  );
}

// Red comunitaria / manos interconectadas — Salud Mental Pública,
// Comunitaria e Intervención Social.
export function CommunityIcon(props) {
  const gradientId = useGradientId("community");
  return (
    <IconShell gradientId={gradientId} {...props}>
      <circle cx="14" cy="16" r="4" />
      <circle cx="34" cy="16" r="4" />
      <circle cx="24" cy="30" r="4.4" />
      <path d="M14 20c-3.5 1.6-6 4.6-6 9v3h9v-4" />
      <path d="M34 20c3.5 1.6 6 4.6 6 9v3h-9v-4" />
      <path d="M18 27l3.4.6M30 27l-3.4.6" />
    </IconShell>
  );
}

// Regulación emocional / procesos de cambio — Especialidades
// Transversales (Trauma, Sexología, Adicciones, TCA, etc.).
export function TransversalIcon(props) {
  const gradientId = useGradientId("transversal");
  return (
    <IconShell gradientId={gradientId} {...props}>
      <path d="M6 26c4 0 4-10 8-10s4 18 8 18 4-24 8-24 4 16 8 16 4-6 4-6" />
      <circle cx="42" cy="20" r="1.6" fill={`url(#${gradientId})`} stroke="none" />
    </IconShell>
  );
}

const ICON_COMPONENTS = {
  brain: BrainSynapsesIcon,
  sprout: SproutIcon,
  neural: NeuralNetworkIcon,
  scale: LegalScaleIcon,
  network: NetworkNodesIcon,
  book: BookConnectionsIcon,
  community: CommunityIcon,
  transversal: TransversalIcon,
};

// Mapa de cada sub-especialidad (ver services/adipaApi.js -> SUBSPECIALTIES)
// a su familia de ícono. Se resuelve por sub-especialidad para máxima
// fidelidad; varias sub-especialidades de una misma escuela pueden
// compartir familia de ícono cuando su naturaleza es la misma.
export const ICON_KEY_BY_SUBSPECIALTY = {
  clinica_psicoterapia: "brain",
  trauma_crisis: "transversal",
  adicciones_regulacion: "transversal",
  evaluacion_adultos: "brain",

  desarrollo_apego: "sprout",
  salud_adolescente: "sprout",
  conducta_infantil: "sprout",
  terapia_juego_familiar: "sprout",

  autismo_tea: "neural",
  tdah_funciones: "book",
  dificultades_aprendizaje: "book",
  evaluacion_neuropsicologica: "neural",

  peritajes: "scale",
  violencia_abuso: "scale",
  tribunales_familia: "scale",
  intervencion_comunitaria: "community",

  seleccion_talento: "network",
  liderazgo_desarrollo: "network",
  clima_bienestar: "network",
  evaluacion_laboral: "network",
};

export function getAreaIconKey(subspecialtyId) {
  return ICON_KEY_BY_SUBSPECIALTY[subspecialtyId] ?? "brain";
}

export function getAreaIconComponent(subspecialtyId) {
  const key = getAreaIconKey(subspecialtyId);
  return ICON_COMPONENTS[key] ?? BrainSynapsesIcon;
}
