// services/adipaApi.js
//
// Servicio de datos dinámico de ADIPA.
//
// Consulta EN VIVO la API pública de WordPress de adipa.cl (wp-json) para
// traer cursos/diplomados (post type "product") y seminarios gratuitos
// (post type "webinars"), filtrados por las taxonomías reales del sitio
// "interests" y "segmentation" (verificadas manualmente contra adipa.cl).
//
// Si la oferta de adipa.cl cambia -se agregan, quitan o renombran cursos-
// estas funciones lo reflejan automáticamente la próxima vez que se
// consultan, sin tocar ningún componente visual. Lo único que podría
// necesitar mantención manual es el mapa SUBSPECIALTIES si ADIPA crea una
// escuela o sub-especialidad completamente nueva.
//
// Si la API no responde (sin conexión, mantenimiento del sitio, CORS),
// cada función devuelve una lista vacía junto con un "fallbackUrl" hacia la
// página correspondiente en adipa.cl, para que la UI siempre tenga algo
// útil que mostrar.

const ADIPA_BASE_URL = "https://adipa.cl";
const WP_API = `${ADIPA_BASE_URL}/wp-json/wp/v2`;

// Podcast oficial de ADIPA (confirmado en Spotify, 2026-08-31).
export const ADIPADOS_SPOTIFY_URL = "https://open.spotify.com/show/4mwZlXLYaGdr9WIqiuSHup";

// TikTok oficial de ADIPA (confirmado, 2026-08-31).
export const ADIPA_TIKTOK_URL = "https://www.tiktok.com/@somosadipa";

// Las 5 Escuelas Oficiales de ADIPA.
export const SCHOOLS = {
  salud_mental_adultos: {
    id: "salud_mental_adultos",
    name: "Salud Mental Adultos",
    color: "#432D86",
    url: `${ADIPA_BASE_URL}/escuela-en-salud-mental-adultos/`,
  },
  salud_mental_infantojuvenil: {
    id: "salud_mental_infantojuvenil",
    name: "Salud Mental Infantojuvenil",
    color: "#0272AA",
    url: `${ADIPA_BASE_URL}/escuela-en-salud-mental-infantojuvenil/`,
  },
  educacion_neurodesarrollo: {
    id: "educacion_neurodesarrollo",
    name: "Educación y Neurodesarrollo",
    color: "#00770E",
    url: `${ADIPA_BASE_URL}/escuela-de-educacion-y-neurodesarrollo/`,
  },
  psicosocial_juridica: {
    id: "psicosocial_juridica",
    name: "Psicosocial Jurídica",
    color: "#CC6A00",
    url: `${ADIPA_BASE_URL}/escuela-psicosocial-juridica/`,
  },
  organizacional: {
    id: "organizacional",
    name: "Psicología Organizacional",
    color: "#B20000",
    url: `${ADIPA_BASE_URL}/escuela-de-psicologia-organizacional/`,
  },
};

// Sub-especialidades por escuela, con los IDs reales de las taxonomías
// "interests" y "segmentation" de adipa.cl (confirmados vía wp-json el
// 2026-08-28). Si ADIPA agrega una sub-especialidad nueva, solo hay que
// sumar una entrada aquí -los componentes visuales no cambian-.
//
// IMPORTANTE: estos IDs (las claves del objeto, ej. "clinica_psicoterapia")
// deben coincidir exactamente con los `subspecialty` que genera
// components/QuizModule.jsx al puntuar el test.
export const SUBSPECIALTIES = {
  // Salud Mental Adultos
  clinica_psicoterapia: {
    school: "salud_mental_adultos",
    label: "Psicología Clínica y Psicoterapia de Adultos",
    interests: [100, 105, 107],
    segmentation: [237, 246, 241],
  },
  trauma_crisis: {
    school: "salud_mental_adultos",
    label: "Trauma, Crisis y Primeros Auxilios Psicológicos",
    interests: [131],
    segmentation: [253, 244, 214, 213],
  },
  adicciones_regulacion: {
    school: "salud_mental_adultos",
    label: "Adicciones y Regulación Emocional",
    interests: [104, 115],
    segmentation: [245, 248],
  },
  evaluacion_adultos: {
    school: "salud_mental_adultos",
    label: "Evaluación y Test Psicológicos en Adultos",
    interests: [122, 86, 116],
    segmentation: [216, 217, 222, 218],
  },

  // Salud Mental Infantojuvenil
  desarrollo_apego: {
    school: "salud_mental_infantojuvenil",
    label: "Desarrollo Infantil y Apego",
    interests: [130, 91, 92],
    segmentation: [252, 232, 234],
  },
  salud_adolescente: {
    school: "salud_mental_infantojuvenil",
    label: "Salud Mental en la Adolescencia",
    interests: [96, 109, 118],
    segmentation: [281, 254],
  },
  conducta_infantil: {
    school: "salud_mental_infantojuvenil",
    label: "Conducta y Regulación Infantil",
    interests: [95, 93, 97],
    segmentation: [236, 239],
  },
  terapia_juego_familiar: {
    school: "salud_mental_infantojuvenil",
    label: "Terapia de Juego y Familia",
    interests: [121, 102],
    segmentation: [240, 232],
  },

  // Educación y Neurodesarrollo
  autismo_tea: {
    school: "educacion_neurodesarrollo",
    label: "Autismo y Trastorno del Espectro Autista",
    interests: [127, 129],
    segmentation: [207, 208, 209, 210],
  },
  tdah_funciones: {
    school: "educacion_neurodesarrollo",
    label: "TDAH y Funciones Ejecutivas",
    interests: [111],
    segmentation: [230],
  },
  dificultades_aprendizaje: {
    school: "educacion_neurodesarrollo",
    label: "Dificultades del Aprendizaje y Psicología Escolar",
    interests: [117],
    segmentation: [235, 228, 229],
  },
  evaluacion_neuropsicologica: {
    school: "educacion_neurodesarrollo",
    label: "Evaluación Neuropsicológica Infantil",
    interests: [114, 125],
    segmentation: [256, 219, 220, 221, 211, 212],
  },

  // Psicosocial Jurídica
  peritajes: {
    school: "psicosocial_juridica",
    label: "Peritajes y Evaluación Pericial",
    interests: [106, 101, 103],
    segmentation: [263],
  },
  violencia_abuso: {
    school: "psicosocial_juridica",
    label: "Abuso, Violencia y Delitos Sexuales",
    interests: [120, 123, 128, 133],
    segmentation: [243],
  },
  tribunales_familia: {
    school: "psicosocial_juridica",
    label: "Tribunales de Familia y Mediación",
    interests: [99],
    segmentation: [264],
  },
  intervencion_comunitaria: {
    school: "psicosocial_juridica",
    label: "Psicología Social y Comunitaria",
    interests: [132],
    segmentation: [267, 265, 262, 266],
  },

  // Psicología Organizacional
  seleccion_talento: {
    school: "organizacional",
    label: "Selección y Gestión de Talento",
    interests: [90],
    segmentation: [223, 227],
  },
  liderazgo_desarrollo: {
    school: "organizacional",
    label: "Liderazgo y Desarrollo Organizacional",
    interests: [89],
    segmentation: [225, 226],
  },
  clima_bienestar: {
    school: "organizacional",
    label: "Clima Laboral y Bienestar Organizacional",
    interests: [],
    segmentation: [248, 251],
  },
  evaluacion_laboral: {
    school: "organizacional",
    label: "Evaluación y Assessment Organizacional",
    interests: [122],
    segmentation: [224, 216],
  },
};

// Decodifica entidades HTML (&#8211;, &amp;, &#8217;, etc.) que llegan sin
// procesar desde la API de WordPress. Usa el DOM cuando está disponible
// (siempre es el caso aquí, ya que estas funciones solo se llaman desde el
// navegador vía useEffect) y cae a un set de reemplazos manuales como
// respaldo defensivo.
function decodeHtmlEntities(text) {
  const raw = String(text ?? "");

  if (typeof document !== "undefined") {
    const el = document.createElement("textarea");
    el.innerHTML = raw;
    return el.value;
  }

  return raw
    .replace(/&#8211;|&#x2013;/gi, "–")
    .replace(/&#8212;|&#x2014;/gi, "—")
    .replace(/&#8216;|&#x2018;/gi, "‘")
    .replace(/&#8217;|&#x2019;/gi, "’")
    .replace(/&#8220;|&#x201c;/gi, "“")
    .replace(/&#8221;|&#x201d;/gi, "”")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}

function stripHtml(html) {
  return decodeHtmlEntities(String(html ?? "").replace(/<[^>]*>/g, "")).trim();
}

// Extrae la imagen destacada (thumbnail) de un post de WordPress cuando la
// consulta incluyó "_embed=wp:featuredmedia". Prioriza tamaños medianos
// para no cargar imágenes de alta resolución innecesarias en las tarjetas.
function extractFeaturedImage(item) {
  const media = item?._embedded?.["wp:featuredmedia"]?.[0];
  if (!media || media?.code === "rest_forbidden") return null;

  const sizes = media?.media_details?.sizes;
  return (
    sizes?.medium_large?.source_url ??
    sizes?.medium?.source_url ??
    sizes?.thumbnail?.source_url ??
    media?.source_url ??
    null
  );
}

function mapWpItem(item) {
  return {
    id: item.id,
    title: stripHtml(item?.title?.rendered ?? item?.title ?? ""),
    url: item.link,
    excerpt: stripHtml(item?.excerpt?.rendered ?? ""),
    imageUrl: extractFeaturedImage(item),
    // Fecha de inicio real del curso/seminario, cuando adipa.cl la exponga
    // en el futuro (ej. vía un campo ACF). Hoy la API pública no entrega
    // este dato para "product"/"webinars", así que queda en null y la UI
    // simplemente no muestra el badge de fecha -nunca se inventa una-.
    startDateLabel: item?.acf?.fecha_inicio_label ?? null,
  };
}

// El embed de Spotify de cada episodio de "Adipados" viaja dentro del HTML
// de `content.rendered` (adipa.cl incrusta un iframe de
// open.spotify.com/embed/episode/<id>). Lo extraemos para poder llevar a
// la gente directo al episodio real en Spotify, en vez de a adipa.cl.
function extractSpotifyEpisodeUrl(html) {
  const match = String(html ?? "").match(/open\.spotify\.com\/embed\/episode\/([a-zA-Z0-9]+)/);
  return match ? `https://open.spotify.com/episode/${match[1]}` : null;
}

function mapPodcastItem(item) {
  const base = mapWpItem(item);
  const spotifyUrl = extractSpotifyEpisodeUrl(item?.content?.rendered) ?? ADIPADOS_SPOTIFY_URL;
  return { ...base, spotifyUrl };
}

function buildTaxonomyParams(subcategoryId, limit) {
  const meta = SUBSPECIALTIES[subcategoryId];
  if (!meta) return null;

  const params = new URLSearchParams();
  if (meta.interests?.length) params.set("interests", meta.interests.join(","));
  if (meta.segmentation?.length) params.set("segmentation", meta.segmentation.join(","));
  params.set("per_page", String(limit));
  // "_embed=wp:featuredmedia" trae la imagen destacada del curso/seminario;
  // "_embedded" debe listarse explícitamente en _fields para que la API no
  // la descarte al filtrar la respuesta.
  params.set("_embed", "wp:featuredmedia");
  params.set("_fields", "id,title,link,excerpt,_embedded");

  return { meta, params };
}

async function fetchAdipa(path, params, { signal } = {}) {
  const response = await fetch(`${WP_API}${path}?${params.toString()}`, {
    signal,
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`ADIPA API respondió ${response.status} en ${path}`);
  }

  return response.json();
}

/**
 * Cursos, diplomados y programas de adipa.cl relacionados a una
 * sub-especialidad. Consulta en vivo el catálogo (post type "product")
 * filtrado por sus taxonomías reales, así que refleja automáticamente
 * altas, bajas o cambios de nombre en adipa.cl.
 *
 * @param {string} subcategoryId - clave de SUBSPECIALTIES (ej. "autismo_tea")
 * @returns {Promise<{items: Array<{id:number,title:string,url:string,excerpt:string}>, fallbackUrl: string}>}
 */
export async function getProgramsBySubspecialty(subcategoryId, { limit = 4 } = {}) {
  const fallbackUrl = `${ADIPA_BASE_URL}/cursos?cat=diplomados`;
  const query = buildTaxonomyParams(subcategoryId, limit);
  if (!query) return { items: [], fallbackUrl };

  const { meta, params } = query;
  const schoolUrl = SCHOOLS[meta.school]?.url ?? fallbackUrl;

  try {
    const data = await fetchAdipa("/product", params);
    return { items: Array.isArray(data) ? data.map(mapWpItem) : [], fallbackUrl: schoolUrl };
  } catch (error) {
    console.error("[adipaApi] getProgramsBySubspecialty:", error);
    return { items: [], fallbackUrl: schoolUrl };
  }
}

/**
 * Seminarios gratuitos de adipa.cl (post type "webinars") relacionados a
 * una sub-especialidad, vía la misma taxonomía en vivo.
 *
 * @param {string} subcategoryId - clave de SUBSPECIALTIES (ej. "autismo_tea")
 * @returns {Promise<{items: Array<{id:number,title:string,url:string,excerpt:string}>, fallbackUrl: string}>}
 */
export async function getSeminarsBySubspecialty(subcategoryId, { limit = 3 } = {}) {
  const fallbackUrl = `${ADIPA_BASE_URL}/seminarios/`;
  const query = buildTaxonomyParams(subcategoryId, limit);
  if (!query) return { items: [], fallbackUrl };

  const { params } = query;

  try {
    const data = await fetchAdipa("/webinars", params);
    return { items: Array.isArray(data) ? data.map(mapWpItem) : [], fallbackUrl };
  } catch (error) {
    console.error("[adipaApi] getSeminarsBySubspecialty:", error);
    return { items: [], fallbackUrl };
  }
}

/**
 * Recursos gratuitos descargables de adipa.cl (ebooks, guías, plantillas,
 * infografías) relacionados a una sub-especialidad. Post type "ebooks"
 * (sección /recursos/ebooks/ en adipa.cl), filtrado por la misma
 * taxonomía "interests" y "segmentation" en vivo.
 *
 * @param {string} subcategoryId - clave de SUBSPECIALTIES (ej. "autismo_tea")
 * @returns {Promise<{items: Array<{id:number,title:string,url:string,excerpt:string,imageUrl:string|null}>, fallbackUrl: string}>}
 */
export async function getResourcesBySubspecialty(subcategoryId, { limit = 3 } = {}) {
  const fallbackUrl = `${ADIPA_BASE_URL}/recursos/ebooks/`;
  const query = buildTaxonomyParams(subcategoryId, limit);
  if (!query) return { items: [], fallbackUrl };

  const { params } = query;

  try {
    const data = await fetchAdipa("/ebooks", params);
    return { items: Array.isArray(data) ? data.map(mapWpItem) : [], fallbackUrl };
  } catch (error) {
    console.error("[adipaApi] getResourcesBySubspecialty:", error);
    return { items: [], fallbackUrl };
  }
}

/**
 * Episodios del podcast oficial de ADIPA, "Adipados"
 * (https://open.spotify.com/show/4mwZlXLYaGdr9WIqiuSHup), relacionados a
 * una sub-especialidad. Post type "adipados", filtrado por la taxonomía
 * "interests" (la única que aplica a este post type en adipa.cl -
 * "segmentation" no aplica a "adipados").
 *
 * @param {string} subcategoryId - clave de SUBSPECIALTIES (ej. "autismo_tea")
 * @returns {Promise<{items: Array<{id:number,title:string,url:string,excerpt:string,imageUrl:string|null}>, fallbackUrl: string}>}
 */
export async function getPodcastEpisodesBySubspecialty(subcategoryId, { limit = 3 } = {}) {
  const fallbackUrl = ADIPADOS_SPOTIFY_URL;
  const meta = SUBSPECIALTIES[subcategoryId];
  if (!meta) return { items: [], fallbackUrl };

  // "content" es necesario aquí (a diferencia de programas/seminarios/
  // recursos) porque de ahí extraemos el iframe de Spotify con el episodio
  // real -ver extractSpotifyEpisodeUrl-.
  const params = new URLSearchParams();
  if (meta.interests?.length) params.set("interests", meta.interests.join(","));
  params.set("per_page", String(limit));
  params.set("_embed", "wp:featuredmedia");
  params.set("_fields", "id,title,link,excerpt,content,_embedded");

  try {
    const data = await fetchAdipa("/adipados", params);
    let items = Array.isArray(data) ? data.map(mapPodcastItem) : [];

    // Si esta sub-especialidad no tiene episodios propios etiquetados aún,
    // mostramos los episodios más recientes del podcast como respaldo, en
    // vez de dejar el módulo vacío.
    if (items.length === 0) {
      const recentParams = new URLSearchParams();
      recentParams.set("per_page", String(limit));
      recentParams.set("_embed", "wp:featuredmedia");
      recentParams.set("_fields", "id,title,link,excerpt,content,_embedded");
      const recentData = await fetchAdipa("/adipados", recentParams);
      items = Array.isArray(recentData) ? recentData.map(mapPodcastItem) : [];
    }

    return { items, fallbackUrl };
  } catch (error) {
    console.error("[adipaApi] getPodcastEpisodesBySubspecialty:", error);
    return { items: [], fallbackUrl };
  }
}

// Número de "oportunidades" en las que cada una de las 5 Escuelas
// aparece como opción a lo largo del Quiz (ver components/QuizModule.jsx):
// 25 preguntas, cada escuela excluida exactamente 5 veces => 20.
export const SCHOOL_MATCH_OPPORTUNITIES = 20;

/**
 * A partir del objeto `scores` que entrega QuizModule (una cuenta por
 * escuela), calcula el listado de escuelas ordenado por afinidad
 * descendente, con su % de afinidad (misma fórmula que `matchPercent`).
 * Se usa para el desglose "Top 3 áreas" de la tarjeta "Mi Radar de
 * Afinidad" en ShareCard.
 *
 * @param {Record<string, number>} scores
 * @param {number} limit
 * @returns {Array<{id: string, name: string, color: string, percent: number}>}
 */
export function getTopAreas(scores, limit = 3) {
  if (!scores) return [];

  return Object.entries(scores)
    .map(([schoolId, score]) => {
      const school = SCHOOLS[schoolId];
      if (!school) return null;
      const percent = Math.min(100, Math.round((score / SCHOOL_MATCH_OPPORTUNITIES) * 100));
      return { id: schoolId, name: school.name, color: school.color, percent };
    })
    .filter(Boolean)
    .sort((a, b) => b.percent - a.percent)
    .slice(0, limit);
}

export function getSchool(schoolId) {
  return SCHOOLS[schoolId] ?? null;
}

export function getSubspecialty(subcategoryId) {
  return SUBSPECIALTIES[subcategoryId] ?? null;
}
