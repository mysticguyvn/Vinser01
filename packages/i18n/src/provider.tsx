"use client";

import React from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "./config";

/**
 * Provider component to wrap the application with i18n support.
 *
 * @example
 * ```tsx
 * // In your root layout:
 * import { I18nProvider } from "@vinser/i18n";
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <I18nProvider>
 *       {children}
 *     </I18nProvider>
 *   );
 * }
 * ```
 */
export function I18nProvider({ children }: { children: React.ReactNode }) {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
