import { NextResponse, type NextRequest } from "next/server";

/**
 * Route protection for the client/provider areas.
 *
 * Stays dependency-free (no Supabase client) so it can run on the Edge
 * Runtime. In demo mode (no Supabase env vars) it passes everything through.
 *
 * In production mode it checks for the Supabase auth cookie that @supabase/ssr
 * sets after sign-in; missing cookie on a protected path -> redirect to login.
 * Role enforcement happens client-side (role-select / dashboards).
 */
export function middleware(request: NextRequest) {
  const demoMode =
    !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (demoMode) {
    return NextResponse.next({ request });
  }

  const pathname = request.nextUrl.pathname;
  const isClientArea = pathname.startsWith("/client");
  const isProviderArea = pathname.startsWith("/provider");

  // Public routes don't require anything.
  if (!isClientArea && !isProviderArea) {
    return NextResponse.next({ request });
  }

  // @supabase/ssr stores the session in a cookie named `sb-<ref>-auth-token`.
  const hasAuthCookie = request.cookies
    .getAll()
    .some((cookie) => cookie.name.startsWith("sb-") && cookie.name.endsWith("-auth-token"));

  if (!hasAuthCookie) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next({ request });
}

export const config = {
  matcher: [
    /*
     * Run on everything except:
     * - _next/static, _next/image, favicon, public assets
     * - API routes (routes in app/api are guarded separately)
     */
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|icon-.*\\.png|api).*)",
  ],
};