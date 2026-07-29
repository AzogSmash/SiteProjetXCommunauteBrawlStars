"use server";

import { revalidatePath } from "next/cache";
import { getAccessContext } from "@/lib/access";

export type AdminActionResult = { ok: true; message?: string } | { ok: false; error: string };

async function callBotAdmin(path: string, body: Record<string, unknown>): Promise<AdminActionResult> {
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

export async function pauseCasino(): Promise<AdminActionResult> {
  const res = await callBotAdmin("/api/admin/casino/pause", {});
  revalidatePath("/admin");
  return res;
}

export async function resumeCasino(): Promise<AdminActionResult> {
  const res = await callBotAdmin("/api/admin/casino/resume", {});
  revalidatePath("/admin");
  return res;
}

export async function freezeCrypto(): Promise<AdminActionResult> {
  const res = await callBotAdmin("/api/admin/crypto/freeze", {});
  revalidatePath("/admin");
  return res;
}

export async function banCasino(targetDiscordId: string, reason: string): Promise<AdminActionResult> {
  const res = await callBotAdmin("/api/admin/casino/ban", { target_discord_id: targetDiscordId, reason: reason || null });
  revalidatePath("/admin");
  return res;
}

export async function unbanCasino(targetDiscordId: string): Promise<AdminActionResult> {
  const res = await callBotAdmin("/api/admin/casino/unban", { target_discord_id: targetDiscordId });
  revalidatePath("/admin");
  return res;
}

export async function adjustCoins(
  targetDiscordId: string,
  amount: number,
  compte: "cash" | "coffre"
): Promise<AdminActionResult> {
  if (!Number.isFinite(amount) || amount === 0) return { ok: false, error: "Montant invalide." };
  const res = await callBotAdmin("/api/admin/coins", { target_discord_id: targetDiscordId, amount, compte });
  revalidatePath("/admin");
  return res;
}
