import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Point d'atterrissage après "Se connecter avec Discord" : Discord redirige
// vers Supabase, qui redirige ici avec un ?code= à échanger contre une session.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/error`);
}
