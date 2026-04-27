export const CORE_VERSION = "0.0.1";

// Environment validation
export { validateEnv, envSchema, getSupabaseUrl, getSupabaseAnonKey } from "./env";
export type { Env } from "./env";

// Error handling
export {
  AppError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  InternalError,
} from "./errors";

// Logger
export { logger } from "./logger";
export type { Logger } from "./logger";

// Tenant resolution
export { extractSchoolDomain, resolveSchoolName } from "./tenant";

// Database types
export type { Database } from "./types/database.types";
