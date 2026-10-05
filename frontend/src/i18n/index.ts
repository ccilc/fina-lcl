import { createI18n } from "vue-i18n";
import fr from "./locales/fr.json";
import en from "./locales/en.json";

export const SOURCE_LOCALE = "fr";

// Messages statiques préchargés (qualité optimale, pas d'appel réseau)
export const staticMessages: Record<string, any> = { fr, en };

export const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem("cfc_locale") || "fr",
  fallbackLocale: "fr",
  messages: staticMessages,
});

export default i18n;
