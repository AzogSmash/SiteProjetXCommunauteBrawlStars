import { MessageCircleWarning } from "lucide-react";
import { discordInviteUrl } from "@/lib/data";

// Repli honnête quand une donnée réelle (joueurs, clubs, saison...) n'est
// pas encore synchronisée côté bot — remplace l'ancien réflexe de retomber
// sur des données de démo qui ressemblaient à de vrais membres (décision du
// 22/07/2026, suite à une confusion en pré-prod).
// showContact: false pour les cas où il n'y a rien d'anormal à signaler
// (ex: un joueur lié qui n'a simplement jamais joué au casino/en 1v1) — le
// lien "contacter le staff" n'a de sens que quand quelque chose semble
// vraiment cassé ou pas encore synchronisé.
export function DataUnavailable({ message, showContact = true }: { message: string; showContact?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl px-6 py-10 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-500/15 text-amber-600">
        <MessageCircleWarning size={20} />
      </div>
      <p className="max-w-sm text-sm text-muted">{message}</p>
      {showContact && (
        <a
          href={discordInviteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold uppercase tracking-wide text-primary-2 hover:text-primary"
        >
          Contacter le staff sur Discord
        </a>
      )}
    </div>
  );
}
