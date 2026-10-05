import { ref } from "vue";
import { i18n, staticMessages, SOURCE_LOCALE } from "@/i18n";
import { translateMessages } from "@/services/translationService";
import { SUPPORTED_LANGUAGES } from "@/i18n/supportedLanguages";

const isTranslating = ref(false);
const currentLocale = ref(localStorage.getItem("cfc_locale") || "fr");

export function useLanguage() {
  async function setLanguage(code: string) {
    if (code === currentLocale.value) return;

    // Langue déjà chargée statiquement (fr, en) ou déjà traduite pendant cette session
    if (i18n.global.availableLocales.includes(code as any)) {
      i18n.global.locale.value = code as any;
      currentLocale.value = code;
      localStorage.setItem("cfc_locale", code);
      return;
    }

    isTranslating.value = true;
    try {
      const translated = await translateMessages(staticMessages[SOURCE_LOCALE], code);
      i18n.global.setLocaleMessage(code, translated);
      i18n.global.locale.value = code as any;
      currentLocale.value = code;
      localStorage.setItem("cfc_locale", code);
    } finally {
      isTranslating.value = false;
    }
  }

  return {
    currentLocale,
    isTranslating,
    setLanguage,
    supportedLanguages: SUPPORTED_LANGUAGES,
  };
}
