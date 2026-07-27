"use server";

import { getAccessContext } from "@/lib/access";
import { TICKET_CATEGORIES } from "@/lib/data";

export type CreateTicketResult =
  | { ok: true; channelUrl: string; alreadyOpen: boolean }
  | { ok: false; error: string };

const VALID_CATEGORIES = new Set(TICKET_CATEGORIES.map((c) => c.value));
const MAX_DESCRIPTION_LENGTH = 1000;

// Re-vérifié ici même si le formulaire n'est rendu que sur /support pour un
// compte lié — une server action est un point d'entrée public, jamais
// protégée par le seul fait qu'un bouton ne s'affiche pas pour tout le monde.
export async function createTicket(formData: FormData): Promise<CreateTicketResult> {
  const access = await getAccessContext();
  if (!access.loggedIn || !access.discordId) return { ok: false, error: "Tu n'es pas connecté." };
  if (!access.bsLinked || !access.bsTag) {
    return { ok: false, error: "Lie ton compte Brawl Stars avant d'ouvrir un ticket." };
  }

  const category = String(formData.get("category") ?? "");
  const description = String(formData.get("description") ?? "").trim();

  if (!VALID_CATEGORIES.has(category)) return { ok: false, error: "Catégorie invalide." };
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
    const res = await fetch(`${base}/api/tickets`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Internal-Secret": secret },
      body: JSON.stringify({ discord_id: access.discordId, bs_tag: access.bsTag, category, description }),
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timeout);

    const body = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: body.error ?? "Erreur inconnue." };

    return { ok: true, channelUrl: body.channel_url, alreadyOpen: body.already_open };
  } catch {
    return { ok: false, error: "Impossible de contacter le bot, réessaie plus tard." };
  }
}
