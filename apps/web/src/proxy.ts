import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@vinser/core/supabase/middleware";
import { createClient } from "@vinser/core/supabase/server";

export async function proxy(request: NextRequest) {
  // 1. Update session (refresh token if needed)
  const response = await updateSession(request);

  // 2. Auth & Onboarding Protection
  // Note: We need a fresh client here because updateSession doesn't return the user object directly,
  // and we can't easily extract it from the response headers without parsing cookies manually.
  // Using createClient here is generally fine if we need to check user metadata.

  // Actually, to avoid a second DB call in middleware for EVERY request, it's better to check
  // auth state in Server Components or layout for specific protected routes.
  // BUT the plan says: "Enforce Onboarding Completion: Check session.user.app_metadata.onboarding_completed. If missing or false, redirect to /onboarding."
  // Let's implement that.

  const protectedRoutes = ['/profile', '/settings'];
  const isOnboardingRoute = request.nextUrl.pathname.startsWith('/onboarding');
  const isProtectedRoute = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route));

  if (isProtectedRoute || isOnboardingRoute) {
     // Create a client just to get the user from cookies
     // We have to mock the setAll since middleware can't set cookies directly on the request here cleanly without passing the response
     // Fortunately, updateSession already handled the cookie refresh.
     const supabase = await createClient();
     const { data: { user } } = await supabase.auth.getUser();

     if (!user && isProtectedRoute) {
         return NextResponse.redirect(new URL('/login', request.url));
     }

     if (user) {
         const hasCompletedOnboarding = user.app_metadata?.onboarding_completed === true;

         if (isProtectedRoute && !hasCompletedOnboarding) {
             return NextResponse.redirect(new URL('/onboarding', request.url));
         }

         if (isOnboardingRoute && hasCompletedOnboarding) {
             return NextResponse.redirect(new URL('/profile', request.url));
         }
     }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
