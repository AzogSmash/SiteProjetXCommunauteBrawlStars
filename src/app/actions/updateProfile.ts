"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type UpdateProfileResult = { ok: true } | { ok: false; error: string };

const MAX_BIO_LENGTH = 280;
const MAX_SCREENSHOT_BYTES = 5 * 1024 * 1024;
const ALLOWED_SCREENSHOT_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);

// Le discord_id vient TOUJOURS de la session serveur, jamais d'un paramètre
// client (même logique que linkBsAccount) — sinon n'importe qui pourrait
// modifier le profil de quelqu'un d'autre en rejouant la requête avec un
// tag différent. Le bot revérifie aussi de son côté (défense en profondeur).
export async function updatePlayerProfile(tag: string, formData: FormData): Promise<UpdateProfileResult> {
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

  const bio = formData.get("bio");
  const screenshot = formData.get("screenshot");

  const upstream = new FormData();
  upstream.set("discord_id", discordId);
  if (typeof bio === "string") {
    if (bio.length > MAX_BIO_LENGTH) {
      return { ok: false, error: `Présentation trop longue (${MAX_BIO_LENGTH} caractères max).` };
    }
    upstream.set("bio", bio);
  }
  if (screenshot instanceof File && screenshot.size > 0) {
    if (!ALLOWED_SCREENSHOT_TYPES.has(screenshot.type)) {
      return { ok: false, error: "Format d'image non supporté (PNG, JPEG ou WebP uniquement)." };
    }
    if (screenshot.size > MAX_SCREENSHOT_BYTES) {
      return { ok: false, error: "Image trop lourde (5 Mo max)." };
    }
    upstream.set("screenshot", screenshot, screenshot.name);
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    const res = await fetch(`${base}/api/profile/${encodeURIComponent(cleanTag)}`, {
      method: "POST",
      headers: { "X-Internal-Secret": secret },
      body: upstream,
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timeout);

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { ok: false, error: body.error ?? "Erreur inconnue." };
    }
  } catch {
    return { ok: false, error: "Impossible de contacter le bot, réessaie plus tard." };
  }

  revalidatePath(`/joueurs/${cleanTag}`);
  return { ok: true };
}
