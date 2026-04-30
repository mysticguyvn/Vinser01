import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseUrl, getSupabaseAnonKey } from "../env";

/**
 * Refresh the user's auth session in Next.js middleware.
 *
 * This function:
 * 1. Creates a fresh Supabase client per request
 * 2. Refreshes the Auth token via `supabase.auth.getUser()`
 * 3. Passes refreshed cookies to both the request and response
 *
 * @important Always call this in middleware — without it, Server Components
 * may encounter stale or expired auth tokens.
 *
 * @important Never trust `getSession()` in server code. Always use `getUser()`
 * which revalidates the JWT against Supabase Auth server.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    getSupabaseUrl(),
    getSupabaseAnonKey(),
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          supabaseResponse = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          supabaseResponse.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          supabaseResponse = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          supabaseResponse.cookies.set({ name, value: "", ...options });
        },
      },
    },
  );

  // Do not run code between createServerClient and supabase.auth.getUser().
  // A simple mistake could make it very hard to debug issues with users
  // being randomly logged out.
  await supabase.auth.getUser();

  return supabaseResponse;
}
