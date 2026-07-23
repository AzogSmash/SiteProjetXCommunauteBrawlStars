"use server";

import { revalidatePath } from "next/cache";
import { getAccessContext } from "@/lib/access";

export type CreateNewsResult = { ok: true } | { ok: false; error: string };

const VALID_ICONS = new Set(["skull", "shield", "message", "trophy"]);
const MAX_TITLE_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 300;

// Re-vérifié ici même si le formulaire n'est rendu que dans le panel
// staff/admin côté client — une server action est un point d'entrée
// public, jamais protégée par le seul fait qu'un bouton ne s'affiche pas
// pour tout le monde.
export async function createNews(formData: FormData): Promise<CreateNewsResult> {
  const access = await getAccessContext();
  if (access.tier !== "staff" && access.tier !== "admin") {
    return { ok: false, error: "Réservé au staff et aux admins." };
  }

  const icon = String(formData.get("icon") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!VALID_ICONS.has(icon)) return { ok: false, error: "Icône invalide." };
  if (!title) return { ok: false, error: "Titre requis." };
  if (title.length > MAX_TITLE_LENGTH) return { ok: false, error: `Titre trop long (${MAX_TITLE_LENGTH} caractères max).` };
  if (!description) return { ok: false, error: "Description requise." };
  if (description.length > MAX_DESCRIPTION_LENGTH) {
    return { ok: false, error: `Description trop longue (${MAX_DESCRIPTION_LENGTH} caractères max).` };
  }

  const base = process.env.BS_API_URL;
  const secret = process.env.INTERNAL_API_SECRET;
  if (!base || !secret) return { ok: false, error: "Configuration serveur manquante, préviens un admin." };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    const res = await fetch(`${base}/api/actualites`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Internal-Secret": secret },
      body: JSON.stringify({ icon, title, description }),
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

  revalidatePath("/");
  revalidatePath("/actualites");
  return { ok: true };
}
