export const I18N_VERSION = "0.0.1";

// i18next instance (pre-configured)
export { default as i18n } from "./config";

// React provider
export { I18nProvider } from "./provider";

// Re-export useTranslation for convenience
export { useTranslation } from "react-i18next";
