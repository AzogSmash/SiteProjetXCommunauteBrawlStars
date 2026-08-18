"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { formatDateTime } from "@/lib/format";

const CATEGORY_LABELS: Record<string, string> = {
  candidature: "💼 Candidature",
  club_recruitment: "🎯 Recrutement Club",
  incident: "🔴 Incident",
  other: "❓ Autre",
};

type ClosedTicket = {
  id: number;
  category: string;
  description: string;
  closed_by: string | null;
  created_at: string;
  closed_at: string | null;
};

const PAGE_SIZE = 15;

// Fermés = historique complet (potentiellement des centaines à terme), donc
// pagination + filtre côté client via /api/staff/tickets-closed — contrairement
// aux ouverts (TicketsPanel), toujours peu nombreux et déjà tous chargés par
// le Server Component parent.
export function ClosedTicketsPanel() {
  const [tickets, setTickets] = useState<ClosedTicket[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams({ limit: String(PAGE_SIZE), offset: String(page * PAGE_SIZE) });
    if (category) params.set("category", category);

    fetch(`/api/staff/tickets-closed?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          setTickets([]);
          setTotal(0);
        } else {
          setTickets(data.tickets ?? []);
          setTotal(data.total ?? 0);
        }
      })
      .catch(() => setError("Impossible de contacter le bot."))
      .finally(() => setLoading(false));
  }, [page, category]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(0);
          }}
          className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground outline-none focus:border-primary/50"
        >
          <option value="">Toutes catégories</option>
          {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <span className="text-xs text-muted">
          {total} ticket{total > 1 ? "s" : ""} fermé{total > 1 ? "s" : ""}
        </span>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 size={18} className="animate-spin text-muted" />
        </div>
      ) : error ? (
        <p className="px-3 py-6 text-sm text-muted">{error}</p>
      ) : tickets.length === 0 ? (
        <p className="px-3 py-6 text-sm text-muted">Aucun ticket fermé{category ? " dans cette catégorie" : ""}.</p>
      ) : (
        <ul className="flex flex-col gap-1">
          {tickets.map((t) => (
            <li key={t.id}>
              <Link
                href={`/staff/tickets/${t.id}`}
                className="flex items-start gap-3 rounded-xl px-3 py-2.5 text-sm odd:bg-surface-2 hover:bg-surface-2"
              >
                <span className="min-w-0 flex-1">
                  <span className="font-medium text-foreground/90">
                    #{t.id} — {CATEGORY_LABELS[t.category] ?? t.category}
                  </span>
                  <p className="mt-0.5 truncate text-xs text-muted">{t.description}</p>
                  {t.closed_by && <p className="mt-0.5 text-[11px] text-muted">Fermé par {t.closed_by}</p>}
                </span>
                <span className="flex shrink-0 items-center gap-1 pt-1 text-xs text-muted">
                  {t.closed_at ? formatDateTime(t.closed_at) : ""}
                  <ExternalLink size={12} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            aria-label="Page précédente"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground disabled:opacity-40"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="text-xs text-muted">
            Page {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            aria-label="Page suivante"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground disabled:opacity-40"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
