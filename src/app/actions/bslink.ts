"use server";

import { createClient } from "@/lib/supabase/server";

export type BsLinkResult =
  | { ok: true; name: string; trophies: number; tier: string | null; club: string | null }
  | { ok: false; error: string };

// Le discord_id vient TOUJOURS de la session serveur, jamais d'un paramètre
// client — sinon n'importe qui pourrait lier un tag au compte Discord de
// quelqu'un d'autre en modifiant la requête (voir doc Next.js : "treat every
// action as an untrusted entry point").
export async function linkBsAccount(tag: string): Promise<BsLinkResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Tu n'es pas connecté." };

  const discordId = user.identities?.find((i) => i.provider === "discord")?.id;
  if (!discordId) return { ok: false, error: "Compte Discord introuvable sur ta session." };

  const base = process.env.BS_API_URL;
  const secret = process.env.INTERNAL_API_SECRET;
  if (!base || !secret) return { ok: false, error: "Configuration serveur manquante, préviens un admin." };

  const cleanTag = tag.trim().replace(/^#/, "").toUpperCase();
  if (!cleanTag) return { ok: false, error: "Tag invalide." };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    const res = await fetch(`${base}/api/bslink`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Internal-Secret": secret },
      body: JSON.stringify({ discord_id: discordId, tag: cleanTag }),
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timeout);

    const body = await res.json();
    if (!res.ok) return { ok: false, error: body.error ?? "Erreur inconnue." };

    return {
      ok: true,
      name: body.name,
      trophies: body.trophies,
      tier: body.ranked_tier ?? null,
      club: body.club ?? null,
    };
  } catch {
    return { ok: false, error: "Impossible de contacter le bot, réessaie plus tard." };
  }
}
