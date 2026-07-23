import { NextRequest, NextResponse } from "next/server";

export type SearchResult = {
  players: { tag: string; name: string; club: string | null }[];
  clubs: { slug: string; name: string }[];
};

const EMPTY: SearchResult = { players: [], clubs: [] };

// Proxy server-only vers l'API du bot — la barre de recherche est un champ
// client (tape en direct), et lib/api.ts est réservé aux Server Components
// (jamais d'appel direct au bot depuis le navigateur). Cette route tourne
// côté serveur Next.js, le navigateur ne parle qu'à elle.
export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) return NextResponse.json(EMPTY);

  const base = process.env.BS_API_URL;
  if (!base) return NextResponse.json(EMPTY);

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`${base}/api/famille/recherche?q=${encodeURIComponent(q)}`, {
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timeout);
    if (!res.ok) return NextResponse.json(EMPTY);
    const data = (await res.json()) as SearchResult;
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(EMPTY);
  }
}
