"use server";

import { getAccessContext } from "@/lib/access";

export type ModActionResult =
  | { ok: true; num_warns?: number; dm_sent?: boolean; auto_muted?: boolean; duration?: string }
  | { ok: false; error: string };

async function callBotMod(path: string, body: Record<string, unknown>): Promise<ModActionResult> {
  const access = await getAccessContext();
  if (access.tier !== "admin" || !access.discordId) {
    return { ok: false, error: "Réservé aux administrateurs." };
  }

  const base = process.env.BS_API_URL;
  const secret = process.env.INTERNAL_API_SECRET;
  if (!base || !secret) return { ok: false, error: "Configuration serveur manquante, préviens un admin." };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    const res = await fetch(`${base}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Internal-Secret": secret },
      body: JSON.stringify({ discord_id: access.discordId, ...body }),
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

export async function warnMember(targetDiscordId: string, reason: string): Promise<ModActionResult> {
  return callBotMod("/api/admin/moderation/warn", { target_discord_id: targetDiscordId, reason });
}

export async function muteMember(targetDiscordId: string, duration: string, reason: string): Promise<ModActionResult> {
  return callBotMod("/api/admin/moderation/mute", { target_discord_id: targetDiscordId, duration, reason });
}

export async function unmuteMember(targetDiscordId: string): Promise<ModActionResult> {
  return callBotMod("/api/admin/moderation/unmute", { target_discord_id: targetDiscordId });
}

export async function banMember(targetDiscordId: string, reason: string): Promise<ModActionResult> {
  return callBotMod("/api/admin/moderation/ban", { target_discord_id: targetDiscordId, reason });
}

export async function silenceMember(targetDiscordId: string): Promise<ModActionResult> {
  return callBotMod("/api/admin/moderation/silence", { target_discord_id: targetDiscordId });
}

export async function unsilenceMember(targetDiscordId: string): Promise<ModActionResult> {
  return callBotMod("/api/admin/moderation/unsilence", { target_discord_id: targetDiscordId });
}
