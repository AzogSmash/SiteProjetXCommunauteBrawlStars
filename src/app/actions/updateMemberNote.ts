"use server";

import { revalidatePath } from "next/cache";
import { getAccessContext } from "@/lib/access";

export type UpdateMemberNoteResult = { ok: true } | { ok: false; error: string };

const MAX_NOTE_LENGTH = 300;

// Re-vérifié ici même si le champ n'est rendu que pour un viewer déjà staff/admin
// du bon club côté client — une server action est un point d'entrée public,
// jamais protégée par le seul fait qu'un champ ne s'affiche pas pour tout le
// monde (même logique que createTicket/createNews).
export async function updateMemberNote(clubSlug: string, tag: string, note: string): Promise<UpdateMemberNoteResult> {
  const access = await getAccessContext();
  if (!access.discordId) return { ok: false, error: "Tu n'es pas connecté." };
  const canEdit = access.tier === "admin" || (access.tier === "staff" && access.clubSlug === clubSlug);
  if (!canEdit) return { ok: false, error: "Réservé au staff de ce club." };

  const trimmed = note.trim();
  if (trimmed.length > MAX_NOTE_LENGTH) {
    return { ok: false, error: `Note trop longue (${MAX_NOTE_LENGTH} caractères max).` };
  }

  const base = process.env.BS_API_URL;
  const secret = process.env.INTERNAL_API_SECRET;
  if (!base || !secret) return { ok: false, error: "Configuration serveur manquante, préviens un admin." };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    const res = await fetch(`${base}/api/famille/notes/${encodeURIComponent(clubSlug)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Internal-Secret": secret },
      body: JSON.stringify({ discord_id: access.discordId, tag, note: trimmed }),
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

  revalidatePath(`/clubs/${clubSlug}`);
  return { ok: true };
}
