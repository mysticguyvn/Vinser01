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
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
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
