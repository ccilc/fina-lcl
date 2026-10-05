export interface SupportedLanguage {
  code: string;
  label: string;
  flag: string;
}

// Le français et l'anglais sont pré-traduits. Toutes les autres langues
// ci-dessous sont traduites dynamiquement à la volée (voir translationService)
// la première fois qu'elles sont sélectionnées, puis mises en cache.
export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "pt", label: "Português", flag: "🇵🇹" },
  { code: "it", label: "Italiano", flag: "🇮🇹" },
  { code: "nl", label: "Nederlands", flag: "🇳🇱" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "tr", label: "Türkçe", flag: "🇹🇷" },
  { code: "sw", label: "Kiswahili", flag: "🇰🇪" },
  { code: "yo", label: "Yorùbá", flag: "🇳🇬" },
  { code: "ha", label: "Hausa", flag: "🇳🇬" },
  { code: "ln", label: "Lingála", flag: "🇨🇩" },
  { code: "wo", label: "Wolof", flag: "🇸🇳" },
  { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
  { code: "ko", label: "한국어", flag: "🇰🇷" },
  { code: "pl", label: "Polski", flag: "🇵🇱" },
];

// L'utilisateur peut aussi taper le code ISO de n'importe quelle autre
// langue non listée ci-dessus : ensureLocaleLoaded() la traduira tout de
// même via l'API, cette liste n'est qu'un raccourci pour l'interface.
