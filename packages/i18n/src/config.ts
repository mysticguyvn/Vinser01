import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import vi from "./locales/vi/common.json";
import en from "./locales/en/common.json";

/**
 * i18next configuration for the Vinser platform.
 *
 * - Default language: Vietnamese (vi)
 * - Fallback language: English (en)
 * - Namespace: "common" (default)
 * - Auto-detects browser language preferences
 * - escapeValue disabled (React handles XSS protection)
 */
const i18nInstance = i18n.createInstance();

i18nInstance
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      vi: { common: vi },
      en: { common: en },
    },
    defaultNS: "common",
    fallbackLng: "en",
    lng: "vi", // Default to Vietnamese
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
      lookupLocalStorage: "vinser-language",
    },
    react: {
      useSuspense: false, // Avoid hydration issues in SSR
    },
  });

export default i18nInstance;
