import { NextRequest, NextResponse } from "next/server";
import { getAccessContext } from "@/lib/access";

// Proxy server-only vers l'API du bot — ClosedTicketsPanel est un composant
// client (pagination/filtre déclenchés par l'utilisateur), et lib/api.ts est
// réservé aux Server Components. Le navigateur ne parle qu'à cette route,
// qui vérifie le staff et ajoute le secret partagé avant d'appeler le bot.
export async function GET(request: NextRequest) {
  const access = await getAccessContext();
  if ((access.tier !== "staff" && access.tier !== "admin") || !access.discordId) {
    return NextResponse.json({ error: "Réservé au staff." }, { status: 403 });
  }

  const base = process.env.BS_API_URL;
  const secret = process.env.INTERNAL_API_SECRET;
  if (!base || !secret) {
    return NextResponse.json({ error: "Configuration serveur manquante, préviens un admin." }, { status: 500 });
  }

  const params = new URLSearchParams({ discord_id: access.discordId });
  for (const key of ["limit", "offset", "category"]) {
    const value = request.nextUrl.searchParams.get(key);
    if (value) params.set(key, value);
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(`${base}/api/admin/tickets/closed?${params.toString()}`, {
      headers: { "X-Internal-Secret": secret },
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timeout);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json({ error: data.error ?? "Erreur inconnue." }, { status: res.status });
    }
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Impossible de contacter le bot, réessaie plus tard." }, { status: 500 });
  }
}
