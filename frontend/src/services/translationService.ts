/**
 * Service de traduction dynamique.
 *
 * Le site est rédigé en français (locale de référence). Les traductions
 * anglaise et espagnole sont fournies statiquement (voir i18n/locales) pour
 * une qualité optimale et un chargement instantané. Pour TOUTE AUTRE langue
 * demandée par l'utilisateur, ce service traduit automatiquement le
 * dictionnaire français à la volée via une API de traduction gratuite
 * (MyMemory - https://mymemory.translated.net), puis met le résultat en
 * cache dans le localStorage du navigateur : la traduction n'est donc
 * appelée qu'une seule fois par langue et par appareil.
 *
 * Si l'utilisateur est hors-ligne ou si l'API est indisponible, le service
 * se replie silencieusement sur le français afin que le site reste
 * utilisable.
 */

const CACHE_PREFIX = "cfc_i18n_cache_";
const MYMEMORY_ENDPOINT = "https://api.mymemory.translated.net/get";

// Aplati un objet de traduction imbriqué en paires { "a.b.c": "texte" }
function flatten(obj: Record<string, any>, prefix = ""): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      Object.assign(result, flatten(value, fullKey));
    } else {
      result[fullKey] = String(value);
    }
  }
  return result;
}

// Reconstruit un objet imbriqué à partir de paires { "a.b.c": "texte" }
function unflatten(flat: Record<string, string>): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [flatKey, value] of Object.entries(flat)) {
    const parts = flatKey.split(".");
    let cursor = result;
    parts.forEach((part, index) => {
      if (index === parts.length - 1) {
        cursor[part] = value;
      } else {
        cursor[part] = cursor[part] || {};
        cursor = cursor[part];
      }
    });
  }
  return result;
}

async function translateBatch(
  texts: string[],
  targetLang: string,
  sourceLang = "fr"
): Promise<string[]> {
  // MyMemory n'accepte qu'une phrase par requête sur son offre gratuite ;
  // on limite donc la concurrence pour rester raisonnable et éviter le rate-limit.
  const CONCURRENCY = 5;
  const results: string[] = new Array(texts.length);
  let cursor = 0;

  async function worker() {
    while (cursor < texts.length) {
      const index = cursor++;
      const text = texts[index];
      if (!text || !text.trim()) {
        results[index] = text;
        continue;
      }
      try {
        const url = `${MYMEMORY_ENDPOINT}?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`;
        const response = await fetch(url);
        const data = await response.json();
        results[index] = data?.responseData?.translatedText || text;
      } catch (err) {
        results[index] = text; // repli : on garde le texte source
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
  return results;
}

export interface TranslationProgress {
  done: number;
  total: number;
}

/**
 * Traduit dynamiquement le dictionnaire `sourceMessages` (français) vers
 * `targetLang` et retourne un objet de messages compatible vue-i18n.
 * Utilise le cache localStorage si disponible.
 */
export async function translateMessages(
  sourceMessages: Record<string, any>,
  targetLang: string,
  onProgress?: (progress: TranslationProgress) => void
): Promise<Record<string, any>> {
  const cacheKey = `${CACHE_PREFIX}${targetLang}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      // cache corrompu, on continue vers une nouvelle traduction
    }
  }

  const flatSource = flatten(sourceMessages);
  const keys = Object.keys(flatSource);
  const texts = keys.map((k) => flatSource[k]);

  const translatedTexts = await translateBatch(texts, targetLang, "fr");

  onProgress?.({ done: texts.length, total: texts.length });

  const flatTranslated: Record<string, string> = {};
  keys.forEach((key, i) => {
    flatTranslated[key] = translatedTexts[i];
  });

  const nested = unflatten(flatTranslated);

  try {
    localStorage.setItem(cacheKey, JSON.stringify(nested));
  } catch {
    // quota localStorage dépassé : on ignore, la traduction reste utilisable
    // pour cette session mais ne sera pas mise en cache.
  }

  return nested;
}

export function clearTranslationCache(lang?: string) {
  if (lang) {
    localStorage.removeItem(`${CACHE_PREFIX}${lang}`);
    return;
  }
  Object.keys(localStorage)
    .filter((k) => k.startsWith(CACHE_PREFIX))
    .forEach((k) => localStorage.removeItem(k));
}
