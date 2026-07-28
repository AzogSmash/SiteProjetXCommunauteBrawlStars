import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

// Invalidation à la demande du Data Cache Next.js — sur Vercel ce cache est
// persistant au niveau de la plateforme (pas vidé par un redéploiement),
// donc en cas de donnée visiblement périmée sur une page, c'est la seule
// façon de forcer un rafraîchissement immédiat sans attendre la fenêtre de
// revalidate (30 min par défaut, voir REVALIDATE_DEFAULT dans lib/api.ts).
export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  if (secret !== process.env.INTERNAL_API_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const path = request.nextUrl.searchParams.get("path") ?? "/";
  revalidatePath(path);
  return NextResponse.json({ revalidated: true, path });
}
