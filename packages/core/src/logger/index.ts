import pino from "pino";

/**
 * Centralized Pino logger instance.
 *
 * Configuration:
 * - Level: `LOG_LEVEL` env var (defaults to "info")
 * - Dev: pretty-printed, colorized output
 * - Prod: structured JSON output
 * - Redaction: sensitive fields are automatically masked
 *
 * @example
 * ```ts
 * import { logger } from "@vinser/core/logger";
 *
 * logger.info({ userId: "123" }, "User logged in");
 * logger.error({ err }, "Failed to fetch profile");
 * ```
 */
export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  redact: {
    paths: ["password", "token", "secret", "authorization", "*.password", "*.token", "*.secret"],
    censor: "[REDACTED]",
  },
  formatters: {
    level(label) {
      return { level: label };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  ...(process.env.NODE_ENV !== "production" && {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:yyyy-mm-dd HH:MM:ss",
        ignore: "pid,hostname",
      },
    },
  }),
});

export type Logger = typeof logger;

/**
 * Create a child logger with a specific context (e.g., module name).
 *
 * @example
 * ```ts
 * const log = createChildLogger("auth");
 * log.info("User authenticated");
 * // Output: [auth] User authenticated
 * ```
 */
export function createChildLogger(module: string): Logger {
  return logger.child({ module });
}
