import { redirect, notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { DataUnavailable } from "@/components/DataUnavailable";
import { getAccessContext } from "@/lib/access";
import { getTicket } from "@/lib/api";

const CATEGORY_LABELS: Record<string, string> = {
  candidature: "💼 Candidature",
  club_recruitment: "🎯 Recrutement Club",
  incident: "🔴 Incident",
  other: "❓ Autre",
};

export default async function TicketTranscriptPage({ params }: { params: Promise<{ id: string }> }) {
  const access = await getAccessContext();
  if (access.tier !== "staff" && access.tier !== "admin") redirect("/");

  const { id } = await params;
  const ticket = await getTicket(id);
  if (!ticket) notFound();

  return (
    <>
      <PageHeader
        eyebrow="Staff"
        title={`Ticket #${ticket.id}`}
        description={CATEGORY_LABELS[ticket.category] ?? ticket.category}
      />

      <main className="mx-auto max-w-3xl px-6 pb-14">
        <div className="card-elevated mb-4 rounded-2xl border border-border bg-surface p-4 text-sm text-muted">
          <p>Ouvert par <code>{ticket.discord_id}</code>{ticket.bs_tag ? ` (${ticket.bs_tag})` : ""}</p>
          {ticket.claimed_by && <p>Pris en charge par <code>{ticket.claimed_by}</code></p>}
          {ticket.closed_by && <p>Fermé par <code>{ticket.closed_by}</code></p>}
        </div>

        {!ticket.transcript || ticket.transcript.length === 0 ? (
          <DataUnavailable message="Aucun message dans ce ticket (ou pas encore fermé)." showContact={false} />
        ) : (
          <div className="flex flex-col gap-3">
            {ticket.transcript.map((msg, i) => (
              <div key={i} className="card-elevated flex gap-3 rounded-xl border border-border bg-surface p-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-foreground">{msg.author}</span>
                    <span className="text-[11px] text-muted">{new Date(msg.created_at).toLocaleString("fr-FR")}</span>
                  </div>
                  <p className="whitespace-pre-wrap break-words text-sm text-foreground/90">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
