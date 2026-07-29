"use client";

import { useState, useTransition } from "react";
import { Lock, Loader2 } from "lucide-react";
import { Panel } from "@/components/Panel";
import { fermerTicket } from "@/app/actions/adminTickets";
import { formatDateTime } from "@/lib/format";
import type { ApiTicketSummary } from "@/lib/api";

const CATEGORY_LABELS: Record<string, string> = {
  candidature: "💼 Candidature",
  club_recruitment: "🎯 Recrutement Club",
  incident: "🔴 Incident",
  other: "❓ Autre",
};

function TicketRow({ ticket }: { ticket: ApiTicketSummary }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function submit() {
    if (isPending) return;
    startTransition(async () => {
      const res = await fermerTicket(ticket.id, reason);
      if (res.ok) setDone(true);
      else setError(res.error);
    });
  }

  if (done) return null;

  return (
    <li className="flex flex-col gap-2 rounded-xl px-3 py-2.5 text-sm odd:bg-surface-2">
      <div className="flex items-start gap-3">
        <span className="min-w-0 flex-1">
          <span className="font-medium text-foreground/90">
            #{ticket.id} — {CATEGORY_LABELS[ticket.category] ?? ticket.category}
          </span>
          <p className="mt-0.5 text-xs text-muted">{ticket.description}</p>
          {ticket.claimed_by && <p className="mt-0.5 text-[11px] text-muted">Pris en charge par {ticket.claimed_by}</p>}
        </span>
        <span className="shrink-0 pt-1 text-xs text-muted">{formatDateTime(ticket.created_at)}</span>
        {!open && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-red-500/90 px-3 py-1.5 text-xs font-semibold text-white"
          >
            <Lock size={12} />
            Fermer
          </button>
        )}
      </div>

      {open && (
        <div className="flex flex-wrap items-center gap-2 pl-0">
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Raison (optionnel)"
            className="w-56 rounded-full border border-border bg-surface-2 px-3 py-1.5 text-xs text-foreground outline-none focus:border-primary/50"
          />
          <button
            type="button"
            onClick={submit}
            disabled={isPending}
            className="flex items-center gap-1.5 rounded-full bg-red-500/90 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
          >
            {isPending ? <Loader2 size={12} className="animate-spin" /> : <Lock size={12} />}
            Confirmer la fermeture
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            disabled={isPending}
            className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted"
          >
            Annuler
          </button>
          {error && <p className="w-full text-xs text-red-500">{error}</p>}
        </div>
      )}
    </li>
  );
}

export function TicketsPanel({ tickets }: { tickets: ApiTicketSummary[] }) {
  return (
    <Panel title={`Tickets ouverts — ${tickets.length}`}>
      {tickets.length === 0 ? (
        <p className="px-3 py-6 text-sm text-muted">Aucun ticket ouvert pour l&apos;instant.</p>
      ) : (
        <ul className="flex flex-col gap-1">
          {tickets.map((t) => (
            <TicketRow key={t.id} ticket={t} />
          ))}
        </ul>
      )}
    </Panel>
  );
}
