/**
 * Supabase client factories for different runtime contexts.
 *
 * - `client.ts` — Browser/Client Components
 * - `server.ts` — Server Components, Server Actions, Route Handlers
 * - `middleware.ts` — Next.js middleware for session refresh
 *
 * Import the specific module you need rather than this barrel export
 * to avoid pulling in server-only code into client bundles.
 */
export { createClient as createBrowserClient } from "./client";
export { createClient as createServerClient } from "./server";
export { updateSession } from "./middleware";
