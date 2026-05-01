import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@vinser/core/supabase/middleware";

export async function proxy(request: NextRequest) {
  // IMPORTANT: Do NOT run updateSession or supabase.auth.getUser() on the auth callback route.
  // The PKCE code verifier is stored in cookies. Running getUser() clears it
  // if no session exists yet, causing exchangeCodeForSession to fail later in the route handler.
  if (request.nextUrl.pathname.startsWith('/auth/callback')) {
    return NextResponse.next();
  }

  // 1. Update session (refresh token if needed)
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
