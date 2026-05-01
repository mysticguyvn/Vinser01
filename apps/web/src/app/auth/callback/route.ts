import { NextResponse } from 'next/server';
import { createClient } from '@vinser/core/supabase/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/onboarding';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // In Vercel environments, forwardedHost contains the actual domain
      // that the user visited, avoiding localhost redirects in preview
      const forwardedHost = request.headers.get('x-forwarded-host');
      const isLocalEnv = process.env.NODE_ENV === 'development';

      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${requestUrl.origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${requestUrl.origin}${next}`);
      }
    } else {
      // Append the actual error to the URL to help the user debug why it failed
      return NextResponse.redirect(`${requestUrl.origin}/login?error=auth-callback-failed&details=${encodeURIComponent(error.message)}`);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${requestUrl.origin}/login?error=auth-callback-missing-code`);
}
