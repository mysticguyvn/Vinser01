import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "../types/database.types";
import { getSupabaseUrl, getSupabaseAnonKey } from "../env";

/**
 * Create a Supabase client for use in Browser/Client Components.
 *
 * Uses singleton pattern internally (via @supabase/ssr) —
 * safe to call multiple times without creating duplicate instances.
 */
export function createClient() {
  return createBrowserClient<Database>(
    getSupabaseUrl(),
    getSupabaseAnonKey(),
  );
}
