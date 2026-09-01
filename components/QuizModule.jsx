"use client";

// components/QuizModule.jsx
//
// Motor del Quiz. Evalúa 4 dimensiones (trayectoria, intereses,
// conocimientos y estilo de trabajo) y en cada pregunta rota 4 de las 5
// Escuelas Oficiales de ADIPA (se excluye una escuela distinta por
// pregunta, en un ciclo de 5).
//
// La cantidad de preguntas de la sesión (`questionCount`) llega desde
// Landing (Paso 2: Express 10 / Estándar 15 / Profundo 25) y es siempre
// un múltiplo de 5 -por diseño-, así que el mismo ciclo escuela×dimensión
// sigue siendo parejo sin importar la duración elegida: cada escuela
// queda excluida exactamente questionCount/5 veces y presente en las
// otras questionCount - questionCount/5, y dentro de cada escuela sus 4
// sub-especialidades también rotan parejo (questionCount*4/5/4 veces cada
// una: 2 en Express, 3 en Estándar, 5 en Profundo). Los IDs de
// sub-especialidad usados aquí deben coincidir con las claves de
// SUBSPECIALTIES en services/adipaApi.js.
//
// Aleatorización por sesión: cada slot (escuela excluida + dimensión) se
// redacta con un enunciado elegido al azar desde un banco más amplio de
// variantes por dimensión (PROMPT_BANK), las opciones de respuesta de
// cada pregunta se muestran en orden aleatorio, y el orden de despliegue
// de las 25 preguntas también se aleatoriza. Nada de esto toca la
// estructura de slots, así que la ponderación por escuela/dimensión se
// mantiene exactamente igual sesión a sesión.

import { useState } from "react";

const SCHOOL_ORDER = [
  "salud_mental_adultos",
  "salud_mental_infantojuvenil",
  "educacion_neurodesarrollo",
  "psicosocial_juridica",
  "organizacional",
];

const DIMENSION_ORDER = ["trayectoria", "intereses", "conocimientos", "estilo_trabajo"];

// Duraciones válidas del Quiz (Landing Paso 2). Todas son múltiplos de 5
// -el tamaño del ciclo de escuelas-, lo que mantiene la rotación pareja
// sin importar cuál se elija.
const DEFAULT_QUESTION_COUNT = 25;

// Banco de enunciados por dimensión (más variantes de las que se usan por
// sesión), para poder aleatorizar el texto de cada pregunta sin alterar
// cuántas preguntas hay por dimensión.
const PROMPT_BANK = {
  trayectoria: [
    "¿Cuál de estas experiencias se parece más a tu trayectoria hasta ahora?",
    "Piensa en un logro profesional del que te sientes orgulloso/a. ¿A cuál se parece más?",
    "En tus prácticas o trabajos anteriores, ¿qué tipo de labor realizaste con más frecuencia?",
    "¿Con qué tipo de población has tenido más contacto profesional?",
    "¿Qué tipo de proyecto recuerdas con más satisfacción?",
    "¿Qué tipo de casos te han pedido resolver con más frecuencia?",
    "Para cerrar: ¿cuál de estas trayectorias sientes más cercana a la tuya?",
    "Si repasaras tu historial laboral, ¿qué tipo de tarea aparece más seguido?",
    "¿Qué experiencia previa marcó más tu forma de trabajar hoy?",
    "¿En qué contexto profesional te has sentido más cómodo/a hasta ahora?",
    "¿Qué tipo de intervención has realizado con mayor frecuencia en tu carrera?",
    "Si tuvieras que resumir tu experiencia en una frase, ¿cuál calza mejor?",
  ],
  intereses: [
    "Si pudieras elegir un tema para profundizar el próximo año, ¿cuál elegirías?",
    "¿Qué tipo de lectura o capacitación te llamaría más la atención?",
    "Si tuvieras que elegir una especialización para estudiar, ¿cuál sería?",
    "¿Qué desafío profesional te resulta más motivador?",
    "Si asistieras a un congreso de psicología, ¿a qué charla irías primero?",
    "¿Qué problemática social te gustaría abordar profesionalmente?",
    "¿Qué área te gustaría explorar si tuvieras tiempo y recursos ilimitados?",
    "¿Qué tema podrías investigar durante horas sin aburrirte?",
    "Si un colega te invitara a un proyecto nuevo, ¿cuál te haría decir que sí de inmediato?",
  ],
  conocimientos: [
    "¿En cuál de estas áreas sientes que tienes más herramientas o conocimientos?",
    "¿Sobre cuál de estos temas podrías dar una charla sin preparación previa?",
    "¿Qué instrumentos o técnicas manejas con mayor confianza?",
    "¿En qué área podrías orientar a un/a colega con mayor seguridad?",
    "¿Qué marco teórico o modelo dominas mejor?",
    "¿Qué tipo de evaluación o diagnóstico te resulta más natural de aplicar?",
    "¿En qué tema te sientes con más autoridad para responder preguntas difíciles?",
    "¿Qué conocimiento aplicas casi automáticamente en tu día a día?",
    "Si te pidieran capacitar a un equipo mañana, ¿sobre qué tema lo harías?",
  ],
  estilo_trabajo: [
    "¿Cómo te describirías mejor en tu forma de trabajar?",
    "Cuando enfrentas un caso complejo, ¿cuál de estas frases te representa mejor?",
    "¿Qué ritmo de trabajo te acomoda más?",
    "Cuando trabajas en equipo, ¿qué rol sueles tomar?",
    "¿Cómo prefieres estructurar tu jornada de trabajo?",
    "¿Qué te motiva más al iniciar un nuevo caso o proyecto?",
    "¿Cómo sueles reaccionar frente a un imprevisto en tu trabajo?",
    "¿Qué describe mejor tu manera de tomar decisiones profesionales?",
    "Si describieras tu método de trabajo en una palabra, ¿cuál sería más cercana?",
  ],
};

// Sub-especialidades por escuela con una frase por dimensión. El orden de
// las 4 sub-especialidades dentro de cada escuela define el ciclo de
// rotación (ver buildQuestions).
const SCHOOL_SUBSPECIALTIES = {
  salud_mental_adultos: [
    {
      id: "clinica_psicoterapia",
      answers: {
        trayectoria: "He acompañado procesos terapéuticos individuales con personas adultas.",
        intereses: "Me atrae profundizar en psicoterapia y el vínculo terapéutico.",
        conocimientos: "Manejo con soltura enfoques de psicoterapia y modelos de intervención clínica.",
        estilo_trabajo: "Prefiero sesiones uno a uno, con foco en la escucha y el proceso individual.",
      },
    },
    {
      id: "trauma_crisis",
      answers: {
        trayectoria: "He intervenido en situaciones de crisis o urgencias emocionales.",
        intereses: "Me interesa especializarme en trauma y primeros auxilios psicológicos.",
        conocimientos: "Conozco protocolos de intervención en crisis y manejo de trauma complejo.",
        estilo_trabajo: "Actúo con calma bajo presión y me enfoco en estabilizar antes de profundizar.",
      },
    },
    {
      id: "adicciones_regulacion",
      answers: {
        trayectoria: "He trabajado con personas en procesos de consumo problemático o adicciones.",
        intereses: "Me interesa la regulación emocional y los procesos de cambio conductual.",
        conocimientos: "Domino estrategias de regulación emocional y abordaje de conductas adictivas.",
        estilo_trabajo: "Trabajo con planes progresivos, revisando avances y recaídas paso a paso.",
      },
    },
    {
      id: "evaluacion_adultos",
      answers: {
        trayectoria: "He aplicado evaluaciones y test psicológicos a personas adultas.",
        intereses: "Disfruto el proceso de evaluación y la construcción de diagnósticos precisos.",
        conocimientos: "Manejo instrumentos de evaluación psicológica y psicodiagnóstico en adultos.",
        estilo_trabajo: "Soy metódico/a: me apoyo en datos e instrumentos antes de intervenir.",
      },
    },
  ],
  salud_mental_infantojuvenil: [
    {
      id: "desarrollo_apego",
      answers: {
        trayectoria: "He trabajado con familias en la primera infancia y el vínculo de apego.",
        intereses: "Me interesa el desarrollo infantil temprano y la crianza.",
        conocimientos: "Conozco los hitos del desarrollo y las teorías del apego.",
        estilo_trabajo: "Incluyo siempre a la familia como parte activa del proceso.",
      },
    },
    {
      id: "salud_adolescente",
      answers: {
        trayectoria: "He acompañado a adolescentes en procesos de salud mental.",
        intereses: "Me interesa la salud mental adolescente y la prevención del suicidio.",
        conocimientos: "Manejo herramientas para abordar ansiedad, depresión y autolesiones en jóvenes.",
        estilo_trabajo: "Genero espacios de confianza donde los y las adolescentes se sientan escuchados.",
      },
    },
    {
      id: "conducta_infantil",
      answers: {
        trayectoria: "He intervenido en conductas desafiantes de niños y niñas.",
        intereses: "Me interesa entender y regular la conducta infantil.",
        conocimientos: "Conozco estrategias de manejo conductual y prevención del bullying.",
        estilo_trabajo: "Trabajo con rutinas claras y refuerzo positivo constante.",
      },
    },
    {
      id: "terapia_juego_familiar",
      answers: {
        trayectoria: "He usado el juego y la dinámica familiar como herramienta terapéutica.",
        intereses: "Me interesa la terapia de juego y el trabajo sistémico con familias.",
        conocimientos: "Manejo técnicas de terapia de juego y test gráficos infantiles.",
        estilo_trabajo: "Prefiero sesiones lúdicas y flexibles, adaptadas al ritmo de cada niño o niña.",
      },
    },
  ],
  educacion_neurodesarrollo: [
    {
      id: "autismo_tea",
      answers: {
        trayectoria: "He trabajado con personas dentro del espectro autista.",
        intereses: "Me interesa profundizar en autismo y neurodivergencia.",
        conocimientos: "Conozco herramientas de evaluación e intervención en TEA (como ADOS o ADIR).",
        estilo_trabajo: "Adapto cada intervención a las necesidades sensoriales y de comunicación de la persona.",
      },
    },
    {
      id: "tdah_funciones",
      answers: {
        trayectoria: "He apoyado a niños, niñas o jóvenes con TDAH.",
        intereses: "Me interesa el funcionamiento ejecutivo y la atención.",
        conocimientos: "Manejo estrategias para fortalecer funciones ejecutivas y autorregulación.",
        estilo_trabajo: "Divido las tareas en pasos pequeños y uso apoyos visuales.",
      },
    },
    {
      id: "dificultades_aprendizaje",
      answers: {
        trayectoria: "He trabajado en contextos escolares con dificultades de aprendizaje.",
        intereses: "Me interesa la psicología educacional y escolar.",
        conocimientos: "Conozco estrategias para abordar dificultades de aprendizaje y lenguaje.",
        estilo_trabajo: "Coordino de cerca con profesores y apoderados para reforzar el aprendizaje.",
      },
    },
    {
      id: "evaluacion_neuropsicologica",
      answers: {
        trayectoria: "He aplicado evaluaciones neuropsicológicas en población infantil.",
        intereses: "Me interesa la neuropsicología y la evaluación cognitiva.",
        conocimientos: "Manejo instrumentos como WISC-V, ICAP o pruebas de estimulación cognitiva.",
        estilo_trabajo: "Me apoyo en resultados de evaluación para diseñar cada plan de intervención.",
      },
    },
  ],
  psicosocial_juridica: [
    {
      id: "peritajes",
      answers: {
        trayectoria: "He realizado o apoyado peritajes psicológicos.",
        intereses: "Me interesa la evaluación pericial y su rol en procesos legales.",
        conocimientos: "Conozco la metodología de peritajes psicológicos y sociales.",
        estilo_trabajo: "Soy riguroso/a y objetivo/a al documentar cada evaluación.",
      },
    },
    {
      id: "violencia_abuso",
      answers: {
        trayectoria: "He intervenido en casos de abuso o violencia.",
        intereses: "Me interesa trabajar en la prevención y abordaje del abuso.",
        conocimientos: "Manejo protocolos de entrevista y contención en casos de abuso sexual.",
        estilo_trabajo: "Priorizo siempre la contención y el resguardo de la persona afectada.",
      },
    },
    {
      id: "tribunales_familia",
      answers: {
        trayectoria: "He participado en procesos vinculados a tribunales de familia.",
        intereses: "Me interesa el trabajo en el sistema judicial y de familia.",
        conocimientos: "Conozco el funcionamiento de los tribunales de familia y la mediación.",
        estilo_trabajo: "Actúo como puente entre el sistema judicial y las personas involucradas.",
      },
    },
    {
      id: "intervencion_comunitaria",
      answers: {
        trayectoria: "He trabajado con comunidades en programas de intervención social.",
        intereses: "Me interesa la psicología social y comunitaria.",
        conocimientos: "Manejo estrategias de intervención comunitaria y trabajo en red.",
        estilo_trabajo: "Trabajo en terreno, construyendo confianza con la comunidad.",
      },
    },
  ],
  organizacional: [
    {
      id: "seleccion_talento",
      answers: {
        trayectoria: "He participado en procesos de selección y reclutamiento de personal.",
        intereses: "Me interesa la gestión y selección de talento.",
        conocimientos: "Manejo técnicas de entrevista y evaluación por competencias.",
        estilo_trabajo: "Sigo procesos estructurados para comparar candidatos de forma objetiva.",
      },
    },
    {
      id: "liderazgo_desarrollo",
      answers: {
        trayectoria: "He apoyado programas de liderazgo o desarrollo organizacional.",
        intereses: "Me interesa el desarrollo de liderazgo y equipos de alto desempeño.",
        conocimientos: "Conozco modelos de liderazgo y desarrollo de competencias laborales.",
        estilo_trabajo: "Trabajo de la mano con jefaturas para potenciar a sus equipos.",
      },
    },
    {
      id: "clima_bienestar",
      answers: {
        trayectoria: "He trabajado en iniciativas de clima laboral y bienestar.",
        intereses: "Me interesa la salud mental y el bienestar dentro de las organizaciones.",
        conocimientos: "Manejo herramientas para diagnosticar y mejorar el clima laboral.",
        estilo_trabajo: "Superviso indicadores de bienestar y ajusto acciones según los resultados.",
      },
    },
    {
      id: "evaluacion_laboral",
      answers: {
        trayectoria: "He aplicado evaluaciones psicolaborales o assessment center.",
        intereses: "Me interesa la evaluación de perfiles y competencias laborales.",
        conocimientos: "Conozco test psicolaborales y técnicas de assessment.",
        estilo_trabajo: "Combino test estandarizados con observación directa del desempeño.",
      },
    },
  ],
};

// Fisher-Yates: baraja sin mutar el arreglo original.
function shuffleArray(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Construye las preguntas de una sesión (totalQuestions: 10, 15 o 25). La
// estructura de slots (dimensión + escuela excluida por índice) es
// SIEMPRE la misma -eso es lo que garantiza la ponderación pareja para
// cualquier duración-; lo único aleatorio por sesión es qué enunciado se
// usa por slot, el orden de las opciones dentro de cada pregunta, y el
// orden final en que se presentan las preguntas.
function buildQuestions(totalQuestions = DEFAULT_QUESTION_COUNT) {
  const subspecialtyCursor = Object.fromEntries(SCHOOL_ORDER.map((school) => [school, 0]));

  // Banco de enunciados barajado por dimensión, para no repetir dentro de
  // la misma sesión y variar de una sesión a otra.
  const shuffledBank = Object.fromEntries(
    DIMENSION_ORDER.map((dimension) => [dimension, shuffleArray(PROMPT_BANK[dimension])])
  );
  const promptCursor = Object.fromEntries(DIMENSION_ORDER.map((dimension) => [dimension, 0]));

  const questions = Array.from({ length: totalQuestions }).map((_, index) => {
    const dimension = DIMENSION_ORDER[index % DIMENSION_ORDER.length];
    const excludedSchool = SCHOOL_ORDER[index % SCHOOL_ORDER.length];
    const includedSchools = SCHOOL_ORDER.filter((school) => school !== excludedSchool);

    const options = includedSchools.map((school) => {
      const subspecialties = SCHOOL_SUBSPECIALTIES[school];
      const subIndex = subspecialtyCursor[school] % subspecialties.length;
      subspecialtyCursor[school] += 1;
      const subspecialty = subspecialties[subIndex];

      return {
        school,
        subspecialty: subspecialty.id,
        text: subspecialty.answers[dimension],
      };
    });

    const bank = shuffledBank[dimension];
    const promptIndex = promptCursor[dimension] % bank.length;
    promptCursor[dimension] += 1;

    return {
      id: index + 1,
      dimension,
      prompt: bank[promptIndex],
      options: shuffleArray(options),
    };
  });

  return shuffleArray(questions);
}

function pickWinningSchool(scores) {
  return SCHOOL_ORDER.reduce(
    (best, school) => (scores[school] > scores[best] ? school : best),
    SCHOOL_ORDER[0]
  );
}

function pickWinningSubspecialty(winningSchool, subspecialtyScores) {
  const candidates = SCHOOL_SUBSPECIALTIES[winningSchool];
  return candidates.reduce((best, candidate) => {
    const candidateKey = `${winningSchool}::${candidate.id}`;
    const bestKey = `${winningSchool}::${best.id}`;
    const candidateCount = subspecialtyScores[candidateKey] ?? 0;
    const bestCount = subspecialtyScores[bestKey] ?? 0;
    return candidateCount > bestCount ? candidate : best;
  }, candidates[0]);
}

export default function QuizModule({ userData, questionCount = DEFAULT_QUESTION_COUNT, onComplete }) {
  // Preguntas de esta sesión: se calculan una sola vez al montar el
  // componente (init perezoso de useState) con la duración elegida en
  // Landing (Express 10 / Estándar 15 / Profundo 25), así el orden y los
  // enunciados quedan fijos mientras se responde el test, pero cambian
  // cada vez que alguien empieza el Quiz de nuevo.
  const [questions] = useState(() => buildQuestions(questionCount));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scores, setScores] = useState(() =>
    Object.fromEntries(SCHOOL_ORDER.map((school) => [school, 0]))
  );
  const [subspecialtyScores, setSubspecialtyScores] = useState({});

  const firstName = userData?.fullName?.split(" ")[0];
  const currentQuestion = questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  if (!currentQuestion) return null;

  const handleAnswer = (option) => {
    const nextScores = { ...scores, [option.school]: scores[option.school] + 1 };
    const subspecialtyKey = `${option.school}::${option.subspecialty}`;
    const nextSubspecialtyScores = {
      ...subspecialtyScores,
      [subspecialtyKey]: (subspecialtyScores[subspecialtyKey] ?? 0) + 1,
    };

    setScores(nextScores);
    setSubspecialtyScores(nextSubspecialtyScores);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      return;
    }

    const winningSchool = pickWinningSchool(nextScores);
    const winningSubspecialty = pickWinningSubspecialty(winningSchool, nextSubspecialtyScores);

    // % de afinidad: cuántas veces se eligió la escuela ganadora sobre el
    // total de veces que estuvo disponible como opción (questions.length
    // menos las veces que quedó excluida, siempre 1/5 del total ya que
    // questionCount es múltiplo de 5). Es una medida precisa y estable,
    // invariante al orden o selección de preguntas dentro de la sesión, y
    // se recalcula según la duración elegida (10, 15 o 25 preguntas) en
    // vez de asumir siempre 25.
    const schoolOpportunities = questions.length - questions.length / SCHOOL_ORDER.length;
    const matchPercent = Math.min(
      100,
      Math.round((nextScores[winningSchool] / schoolOpportunities) * 100)
    );

    onComplete?.({
      schoolId: winningSchool,
      subspecialtyId: winningSubspecialty.id,
      scores: nextScores,
      matchPercent,
      questionCount: questions.length,
      schoolOpportunities,
    });
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-secondary-navy p-6 text-white shadow-md sm:p-10">
      {/* Halos decorativos, estilo Wrapped (mismo fondo oscuro que Landing/Onboarding) */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary-purple/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-primary-cyan/20 blur-3xl" />

      <div className="relative flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-secondary-light">
            Paso 2 de 3: Descubre tu Perfil
          </span>
          {firstName && (
            <p className="text-sm font-medium text-secondary-light/80">¡Vamos, {firstName}!</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-medium text-secondary-light/70">
            <span>
              Pregunta {currentIndex + 1} de {questions.length}
            </span>
            <span>{progressPercent}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary-purple to-primary-cyan transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <h2 className="text-center text-lg font-semibold text-white sm:text-xl">
          {currentQuestion.prompt}
        </h2>

        <div className="flex flex-col gap-3">
          {currentQuestion.options.map((option, idx) => (
            <button
              key={`${currentQuestion.id}-${option.school}-${idx}`}
              type="button"
              onClick={() => handleAnswer(option)}
              className="rounded-xl border border-white/20 bg-white/5 px-5 py-4 text-left text-sm font-medium text-white backdrop-blur-md transition hover:border-primary-cyan hover:bg-white/10 hover:shadow-md sm:text-base"
            >
              {option.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
