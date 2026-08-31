// services/specialtyInsights.js
//
// Contenido personalizado por sub-especialidad para la pantalla de
// Resultados (informe detallado, estilo "Wrapped") y la tarjeta para
// compartir (ShareCard). Cada entrada usa la clave exacta de
// SUBSPECIALTIES en services/adipaApi.js.
//
// - analysis: por qué las respuestas de la persona conectan con esta rama.
// - strengths: 3 fortalezas clave de su estilo de trabajo/pensamiento.
// - recommendation: consejo concreto de hacia dónde orientar su desarrollo.
// - superpower: frase corta de identidad para la tarjeta para compartir.

export const SPECIALTY_INSIGHTS = {
  // Salud Mental Adultos
  clinica_psicoterapia: {
    analysis:
      "Tus respuestas muestran una inclinación clara hacia el acompañamiento terapéutico individual: valoras la escucha, el vínculo y los procesos de cambio que se construyen sesión a sesión. Esa combinación de intereses, conocimientos y forma de trabajar apunta directo a la psicoterapia de adultos.",
    strengths: [
      "Escucha activa y empatía profunda para sostener el vínculo terapéutico.",
      "Capacidad de acompañar procesos largos sin perder el rumbo.",
      "Solidez en marcos teóricos y modelos de intervención clínica.",
    ],
    recommendation:
      "Profundiza en un diplomado de psicoterapia (cognitivo-conductual, sistémico u otro enfoque afín) y súmate a espacios de supervisión clínica continua.",
    superpower: "Tu superpoder: sostener procesos profundos de cambio, una sesión a la vez.",
  },
  trauma_crisis: {
    analysis:
      "Tu perfil se activa en los momentos donde más se necesita calma: intervención en crisis, urgencias emocionales y primeros auxilios psicológicos. Tus respuestas reflejan capacidad de reacción, estabilidad y foco cuando el contexto se vuelve complejo.",
    strengths: [
      "Calma y claridad bajo presión.",
      "Capacidad de estabilizar antes de profundizar.",
      "Pensamiento rápido y efectivo en contextos de urgencia.",
    ],
    recommendation:
      "Certifícate en primeros auxilios psicológicos y protocolos de intervención en crisis, ideales para equipos de salud mental, emergencias o desastres.",
    superpower: "Tu superpoder: transformar el caos en contención.",
  },
  adicciones_regulacion: {
    analysis:
      "Tus respuestas muestran afinidad por acompañar procesos de cambio conductual y regulación emocional, entendiendo que el avance no siempre es lineal. Te orientas hacia el trabajo sostenido con consumo problemático y adicciones.",
    strengths: [
      "Paciencia frente a procesos no lineales.",
      "Capacidad de sostener el vínculo pese a las recaídas.",
      "Mirada estratégica de largo plazo.",
    ],
    recommendation:
      "Profundiza en un diplomado de adicciones y regulación emocional, con foco en estrategias de cambio conductual progresivo.",
    superpower: "Tu superpoder: acompañar el cambio, paso a paso, sin perder el rumbo.",
  },
  evaluacion_adultos: {
    analysis:
      "Tu perfil se orienta con fuerza hacia la evaluación y el psicodiagnóstico: disfrutas construir un diagnóstico preciso a partir de instrumentos y datos, más que avanzar solo por intuición.",
    strengths: [
      "Precisión metodológica.",
      "Pensamiento analítico y estructurado.",
      "Rigurosidad en el manejo de instrumentos psicológicos.",
    ],
    recommendation:
      "Certifícate en instrumentos de evaluación psicológica en adultos y psicodiagnóstico avanzado.",
    superpower: "Tu superpoder: convertir datos en diagnósticos certeros.",
  },

  // Salud Mental Infantojuvenil
  desarrollo_apego: {
    analysis:
      "Tus respuestas conectan con la primera infancia y el vínculo de apego: te interesa el desarrollo temprano y trabajas de forma natural incluyendo a la familia como parte activa del proceso.",
    strengths: [
      "Sensibilidad para leer las señales tempranas del vínculo.",
      "Capacidad de trabajar con el sistema familiar completo.",
      "Paciencia con los tiempos del desarrollo infantil.",
    ],
    recommendation:
      "Especialízate en un diplomado de apego y primera infancia, con foco en crianza y desarrollo temprano.",
    superpower: "Tu superpoder: fortalecer los vínculos que marcan toda una vida.",
  },
  salud_adolescente: {
    analysis:
      "Tu perfil muestra una conexión genuina con adolescentes: te motiva generar espacios de confianza y abordar con cercanía temas sensibles de salud mental juvenil.",
    strengths: [
      "Conexión genuina y cercanía con jóvenes.",
      "Manejo de temas sensibles sin perder la confianza.",
      "Capacidad de generar espacios seguros de escucha.",
    ],
    recommendation:
      "Especialízate en salud mental adolescente y prevención (ansiedad, depresión, autolesiones) con enfoque en primera línea de contacto.",
    superpower: "Tu superpoder: ser el adulto de confianza que cada adolescente necesita.",
  },
  conducta_infantil: {
    analysis:
      "Tus respuestas apuntan al manejo conductual infantil: te orientas a entender patrones de conducta desafiante y a intervenir con estructura y consistencia.",
    strengths: [
      "Consistencia y estructura en la intervención.",
      "Manejo conductual estratégico.",
      "Capacidad de anticipar y regular patrones de conducta.",
    ],
    recommendation:
      "Profundiza en un diplomado de manejo conductual infantil, con foco en refuerzo positivo y prevención del bullying.",
    superpower: "Tu superpoder: transformar el desafío en aprendizaje.",
  },
  terapia_juego_familiar: {
    analysis:
      "Tu perfil conecta con la terapia de juego y el trabajo sistémico con familias: usas la creatividad y la flexibilidad como herramientas terapéuticas centrales.",
    strengths: [
      "Creatividad terapéutica.",
      "Flexibilidad para adaptarte al ritmo de cada niño o niña.",
      "Mirada sistémica de la dinámica familiar.",
    ],
    recommendation:
      "Fórmate en terapia de juego y técnicas de intervención familiar sistémica.",
    superpower: "Tu superpoder: usar el juego como puente hacia el cambio.",
  },

  // Educación y Neurodesarrollo
  autismo_tea: {
    analysis:
      "Tus respuestas muestran una fuerte orientación hacia el trabajo con personas dentro del espectro autista, adaptando cada intervención a sus necesidades sensoriales y de comunicación.",
    strengths: [
      "Capacidad de adaptar cada intervención a la persona.",
      "Atención al detalle sensorial y comunicacional.",
      "Compromiso genuino con la neurodivergencia.",
    ],
    recommendation:
      "Profundiza en un diplomado de TEA y neurodivergencia, incluyendo herramientas como ADOS o ADIR.",
    superpower: "Tu superpoder: ver el mundo desde una mirada única y adaptarte a él.",
  },
  tdah_funciones: {
    analysis:
      "Tu perfil conecta con el funcionamiento ejecutivo y la atención: tiendes a dividir tareas complejas en pasos simples y a fortalecer la autorregulación en niños, niñas y jóvenes con TDAH.",
    strengths: [
      "Capacidad de estructurar procesos complejos en pasos simples.",
      "Paciencia pedagógica.",
      "Foco en el fortalecimiento de la autorregulación.",
    ],
    recommendation:
      "Especialízate en funciones ejecutivas y TDAH, con estrategias de apoyo visual y autorregulación.",
    superpower: "Tu superpoder: convertir la dispersión en foco.",
  },
  dificultades_aprendizaje: {
    analysis:
      "Tus respuestas se orientan a la psicología educacional: te interesa coordinar con profesores y apoderados para reforzar el aprendizaje desde una mirada integral.",
    strengths: [
      "Mirada integral entre familia, escuela y estudiante.",
      "Capacidad de coordinación con distintos actores.",
      "Orientación pedagógica clara.",
    ],
    recommendation:
      "Profundiza en un diplomado de psicología educacional y dificultades del aprendizaje.",
    superpower: "Tu superpoder: destrabar el aprendizaje donde otros ven un obstáculo.",
  },
  evaluacion_neuropsicologica: {
    analysis:
      "Tu perfil se orienta a la neuropsicología y la evaluación cognitiva infantil: te apoyas en resultados de evaluación para diseñar cada plan de intervención con rigurosidad técnica.",
    strengths: [
      "Rigurosidad técnica en la evaluación.",
      "Pensamiento analítico.",
      "Capacidad de traducir resultados en planes de intervención.",
    ],
    recommendation:
      "Certifícate en evaluación neuropsicológica infantil (WISC-V, ICAP y pruebas de estimulación cognitiva).",
    superpower: "Tu superpoder: leer el cerebro para diseñar el camino a seguir.",
  },

  // Psicosocial Jurídica
  peritajes: {
    analysis:
      "Tus respuestas muestran afinidad con la evaluación pericial: eres riguroso/a y objetivo/a al documentar cada evaluación dentro de procesos legales.",
    strengths: [
      "Objetividad en el análisis.",
      "Rigurosidad documental.",
      "Solidez técnica frente a procesos legales.",
    ],
    recommendation:
      "Profundiza en un diplomado de peritajes psicológicos y su metodología aplicada a procesos judiciales.",
    superpower: "Tu superpoder: convertir la evaluación en evidencia que hace justicia.",
  },
  violencia_abuso: {
    analysis:
      "Tu perfil conecta con la prevención y el abordaje del abuso y la violencia: priorizas siempre la contención y el resguardo de la persona afectada.",
    strengths: [
      "Capacidad de contención en momentos críticos.",
      "Sensibilidad ante el dolor ajeno.",
      "Firmeza en el manejo de protocolos.",
    ],
    recommendation:
      "Fórmate en protocolos de entrevista y contención para casos de abuso y violencia.",
    superpower: "Tu superpoder: ser refugio y protección en los momentos más difíciles.",
  },
  tribunales_familia: {
    analysis:
      "Tus respuestas apuntan al trabajo en el sistema judicial de familia: actúas como puente entre el sistema judicial y las personas involucradas en el proceso.",
    strengths: [
      "Capacidad de mediar en contextos de conflicto.",
      "Visión sistémica del conflicto familiar.",
      "Comunicación efectiva entre sistemas distintos.",
    ],
    recommendation:
      "Profundiza en un diplomado de psicología jurídica de familia y mediación.",
    superpower: "Tu superpoder: construir puentes donde hay conflicto.",
  },
  intervencion_comunitaria: {
    analysis:
      "Tu perfil se orienta al trabajo en terreno: construyes confianza con la comunidad y te interesa la psicología social como motor de cambio colectivo.",
    strengths: [
      "Capacidad de generar confianza en terreno.",
      "Visión social e integral.",
      "Habilidad para el trabajo en red.",
    ],
    recommendation:
      "Especialízate en un diplomado de psicología social y comunitaria, con foco en intervención en red.",
    superpower: "Tu superpoder: movilizar comunidades hacia el cambio colectivo.",
  },

  // Psicología Organizacional
  seleccion_talento: {
    analysis:
      "Tus respuestas muestran una orientación clara hacia la gestión y selección de talento: sigues procesos estructurados para comparar candidatos de forma objetiva.",
    strengths: [
      "Pensamiento estructurado.",
      "Objetividad al comparar perfiles.",
      "Ojo clínico para identificar talento.",
    ],
    recommendation:
      "Profundiza en un diplomado de selección y gestión de talento, con foco en entrevistas por competencias.",
    superpower: "Tu superpoder: encontrar a la persona correcta para el lugar correcto.",
  },
  liderazgo_desarrollo: {
    analysis:
      "Tu perfil conecta con el desarrollo de liderazgo y equipos de alto desempeño: trabajas de la mano con jefaturas para potenciar a sus equipos.",
    strengths: [
      "Visión estratégica de equipos.",
      "Capacidad de potenciar a otros.",
      "Orientación clara al desarrollo organizacional.",
    ],
    recommendation:
      "Especialízate en un diplomado de liderazgo y desarrollo organizacional.",
    superpower: "Tu superpoder: hacer crecer a los equipos que lideras.",
  },
  clima_bienestar: {
    analysis:
      "Tus respuestas se orientan al bienestar dentro de las organizaciones: supervisas indicadores de clima laboral y ajustas acciones según los resultados.",
    strengths: [
      "Sensibilidad hacia el bienestar colectivo.",
      "Capacidad de diagnosticar el clima organizacional.",
      "Orientación a la mejora continua.",
    ],
    recommendation:
      "Profundiza en un diplomado de clima laboral y bienestar organizacional.",
    superpower: "Tu superpoder: transformar ambientes laborales en espacios saludables.",
  },
  evaluacion_laboral: {
    analysis:
      "Tu perfil conecta con la evaluación psicolaboral: combinas test estandarizados con observación directa para evaluar perfiles y competencias con objetividad.",
    strengths: [
      "Rigurosidad técnica en la evaluación.",
      "Combinación de test y observación directa.",
      "Mirada objetiva del desempeño.",
    ],
    recommendation:
      "Certifícate en evaluación y assessment organizacional, con foco en test psicolaborales.",
    superpower: "Tu superpoder: predecir el desempeño antes de que ocurra.",
  },
};

export function getSpecialtyInsights(subspecialtyId) {
  return SPECIALTY_INSIGHTS[subspecialtyId] ?? null;
}

// ---------------------------------------------------------------------
// Adaptación dinámica por Carrera + Nivel de Formación
// ---------------------------------------------------------------------
//
// El análisis y la recomendación no deben sonar igual para un/a
// estudiante de Trabajo Social que para un Psicólogo titulado con
// postítulo. En vez de escribir a mano una variante por cada combinación
// de 20 sub-especialidades x 15 carreras x 4 niveles (inmanejable), se
// agrupan las carreras en "voces" afines y los niveles en "profundidades"
// de feedback, y se combinan como una capa de introducción/cierre sobre
// el contenido base (analysis/strengths/recommendation) de cada
// sub-especialidad, mencionando siempre la carrera real que la persona
// escribió.

function classifyCareerGroup(career) {
  const value = (career ?? "").toLowerCase();

  if (value.includes("psicolog")) return "psicologia";
  if (
    value.includes("terapia ocupacional") ||
    value.includes("kinesiolog") ||
    value.includes("fonoaudiolog") ||
    value.includes("enfermer") ||
    value.includes("medicin") ||
    value.includes("nutri") ||
    value.includes("obstetric")
  ) {
    return "salud";
  }
  if (
    value.includes("trabajo social") ||
    value.includes("educacion") ||
    value.includes("pedagog") ||
    value.includes("ciencias sociales") ||
    value.includes("sociolog")
  ) {
    return "social_educativa";
  }
  if (value.includes("derecho") || value.includes("juridic") || value.includes("administracion")) {
    return "gestion_juridica";
  }
  return "general";
}

function classifyEducationLevel(educationLevel) {
  const value = (educationLevel ?? "").toLowerCase();

  if (value.includes("estudiante")) return "estudiante";
  if (value.includes("egresad") || value.includes("licenciad")) return "egresado";
  if (value.includes("postítulo") || value.includes("postitulo") || value.includes("magíster") || value.includes("magister")) {
    return "avanzado";
  }
  if (value.includes("titulad")) return "titulado";
  return "titulado";
}

const CAREER_INTRO = {
  psicologia: (career) =>
    `Como ${career ? `profesional de ${career}` : "psicólogo/a"}, tu mirada clínica y tu manejo de marcos teóricos le dan una base sólida a este resultado.`,
  salud: (career) =>
    `Tu formación en ${career || "el área de la salud"} te aporta una mirada integral del bienestar de la persona, algo que se nota en cómo respondiste este quiz.`,
  social_educativa: (career) =>
    `Desde ${career || "tu área"}, tu enfoque tiende a mirar el contexto social y comunitario detrás de cada caso, y eso se refleja en tus respuestas.`,
  gestion_juridica: (career) =>
    `Tu perfil en ${career || "tu área"} suma una mirada estructurada y normativa que complementa muy bien esta especialidad.`,
  general: (career) => `Tu formación en ${career || "tu área"} aporta una mirada propia a este resultado.`,
};

const LEVEL_CLOSING = {
  estudiante: (career) =>
    `Como estudiante${career ? ` de ${career}` : ""}, este es un excelente momento para explorar sin presión: parte con un seminario gratuito de ADIPA en esta área antes de comprometerte con una especialización completa.`,
  egresado: (career) =>
    `Como egresado/a${career ? ` de ${career}` : ""}, ya tienes las bases; el siguiente paso natural es profesionalizar este interés con un curso o diplomado corto de ADIPA.`,
  titulado: (career) =>
    `Como ${career || "profesional"} titulado/a, puedes aplicar esto directo en tu práctica: un diplomado de ADIPA en esta área te dará herramientas concretas para usar desde ya.`,
  avanzado: (career) =>
    `Con tu formación de postítulo o magíster, estás en condiciones de profundizar a nivel experto: busca una acreditación internacional o un espacio de supervisión/liderazgo en esta área dentro de ADIPA.`,
};

/**
 * Devuelve el contenido de SPECIALTY_INSIGHTS adaptado al momento
 * profesional exacto de la persona (carrera + nivel de formación),
 * agregando una introducción y un cierre de recomendación que reflejan
 * su campo disciplinar y si está recién empezando o ya tiene experiencia.
 *
 * @param {string} subspecialtyId
 * @param {{career?: string, educationLevel?: string}} profile
 */
export function buildAdaptiveInsights(subspecialtyId, profile = {}) {
  const base = SPECIALTY_INSIGHTS[subspecialtyId];
  if (!base) return null;

  const career = (profile.career ?? "").trim();
  const careerGroup = classifyCareerGroup(career);
  const level = classifyEducationLevel(profile.educationLevel);

  const intro = CAREER_INTRO[careerGroup](career);
  const closing = LEVEL_CLOSING[level](career);

  return {
    ...base,
    analysis: `${intro} ${base.analysis}`,
    recommendation: `${base.recommendation} ${closing}`,
  };
}
