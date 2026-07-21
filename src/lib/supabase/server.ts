import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Client Supabase pour les Server Components / route handlers — lit/écrit la
// session via les cookies de la requête (voir aussi middleware.ts, qui
// rafraîchit le token à chaque requête pour que la session ne meure pas).
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll appelé depuis un Server Component (pas une route handler
            // ou une action) : la session sera quand même rafraîchie côté
            // middleware, donc rien à faire ici — voir doc @supabase/ssr.
          }
        },
      },
    }
  );
}
