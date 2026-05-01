import { type NextRequest } from "next/server";
import { updateSession } from "@vinser/core/supabase/middleware";

export async function proxy(request: NextRequest) {
  // 1. Update session (refresh token if needed)
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
