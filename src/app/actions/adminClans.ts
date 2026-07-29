"use server";

import { revalidatePath } from "next/cache";
import { getAccessContext } from "@/lib/access";

export type AdminClanResult =
  | { ok: true; tag: string; name: string; slug: string; alias?: string; member_count?: number }
  | { ok: false; error: string };

async function callBotClans(path: string, tag: string): Promise<AdminClanResult> {
  const access = await getAccessContext();
  if (access.tier !== "admin" || !access.discordId) {
    return { ok: false, error: "Réservé aux administrateurs." };
  }

  const base = process.env.BS_API_URL;
  const secret = process.env.INTERNAL_API_SECRET;
  if (!base || !secret) return { ok: false, error: "Configuration serveur manquante, préviens un admin." };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    const res = await fetch(`${base}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Internal-Secret": secret },
      body: JSON.stringify({ discord_id: access.discordId, tag }),
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timeout);

    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: data.error ?? "Erreur inconnue." };
    return { ok: true, ...data };
  } catch {
    return { ok: false, error: "Impossible de contacter le bot, réessaie plus tard." };
  }
}

export async function addClan(tag: string): Promise<AdminClanResult> {
  const res = await callBotClans("/api/admin/clans/ajouter", tag);
  revalidatePath("/admin");
  revalidatePath("/clubs");
  return res;
}

export async function removeClan(tag: string): Promise<AdminClanResult> {
  const res = await callBotClans("/api/admin/clans/retirer", tag);
  revalidatePath("/admin");
  revalidatePath("/clubs");
  return res;
}
