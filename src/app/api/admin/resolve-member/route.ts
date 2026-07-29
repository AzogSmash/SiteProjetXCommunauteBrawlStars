import { NextRequest, NextResponse } from "next/server";
import { getAccessContext } from "@/lib/access";
import { getFamilyJoueur } from "@/lib/api";

// Résout un tag Brawl Stars vers son discord_id (si le compte est lié) —
// utilisé par MemberSearchInput pour cibler un membre par nom/tag plutôt que
// par ID Discord brut (mode développeur pas toujours activé, voir !fermer_ticket
// côté bot pour le même souci résolu autrement via mention de salon).
// Réservé aux admins : la donnée (discord_id) est déjà publique côté API
// bot, mais pas de raison de l'exposer ici à des viewers non admin.
export async function GET(request: NextRequest) {
  const access = await getAccessContext();
  if (access.tier !== "admin") {
    return NextResponse.json({ error: "unauthorized" }, { status: 403 });
  }

  const tag = request.nextUrl.searchParams.get("tag")?.trim();
  if (!tag) return NextResponse.json({ error: "tag requis" }, { status: 400 });

  const player = await getFamilyJoueur(tag);
  if (!player || !player.discord_id) {
    return NextResponse.json({ error: "Compte Discord non lié pour ce joueur." }, { status: 404 });
  }

  return NextResponse.json({ tag: player.tag, name: player.name, discordId: player.discord_id });
}
