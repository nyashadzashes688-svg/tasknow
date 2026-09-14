import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { isSupabaseConfigured } from "./client";

/**
 * Server-side Supabase client for App Router server components,
 * route handlers, and middleware. Reads/writes the auth cookie jar.
 */
export function getSupabaseServerClient() {
  if (!isSupabaseConfigured()) return null;

  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component — safe to ignore when middleware
            // is refreshing the session.
          }
        },
      },
    }
  );
}