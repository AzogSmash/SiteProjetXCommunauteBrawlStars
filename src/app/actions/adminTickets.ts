"use server";

import { revalidatePath } from "next/cache";
import { getAccessContext } from "@/lib/access";

export type CloseTicketResult = { ok: true } | { ok: false; error: string };

// Réservé au staff ticket ou admin (mêmes rôles que le bouton Discord
// "Fermer", voir TICKET_STAFF_ROLE_IDS) — revérifié aussi côté bot
// (_require_ticket_staff dans keep_alive.py), même logique de défense en
// profondeur que le reste des actions admin.
export async function fermerTicket(ticketId: number, reason: string): Promise<CloseTicketResult> {
  const access = await getAccessContext();
  if ((access.tier !== "staff" && access.tier !== "admin") || !access.discordId) {
    return { ok: false, error: "Réservé au staff." };
  }

  const base = process.env.BS_API_URL;
  const secret = process.env.INTERNAL_API_SECRET;
  if (!base || !secret) return { ok: false, error: "Configuration serveur manquante, préviens un admin." };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    const res = await fetch(`${base}/api/admin/tickets/fermer`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Internal-Secret": secret },
      body: JSON.stringify({ discord_id: access.discordId, ticket_id: ticketId, reason: reason || null }),
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timeout);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { ok: false, error: data.error ?? "Erreur inconnue." };
    }
  } catch {
    return { ok: false, error: "Impossible de contacter le bot, réessaie plus tard." };
  }

  revalidatePath("/admin");
  revalidatePath("/staff");
  return { ok: true };
}
