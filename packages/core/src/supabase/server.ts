import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "../types/database.types";
import { getSupabaseUrl, getSupabaseAnonKey } from "../env";

/**
 * Create a Supabase client for use in Server Components, Server Actions,
 * and Route Handlers.
 *
 * Must be called per-request — configures cookie handling via Next.js
 * `cookies()` API to maintain user sessions.
 *
 * @example
 * ```ts
 * // In a Server Component or Server Action:
 * const supabase = await createClient();
 * const { data } = await supabase.from("profiles").select("*");
 * ```
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    getSupabaseUrl(),
    getSupabaseAnonKey(),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
}
