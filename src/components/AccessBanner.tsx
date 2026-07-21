import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { AccessContext } from "@/lib/access";
import type { FamilyClub } from "@/lib/family";
import { discordInviteUrl } from "@/lib/data";

// Bandeau d'accueil personnalisé selon le niveau d'accès résolu par
// lib/access.ts — invité (CTA rejoindre), membre (son club mis en avant),
// staff/admin (idem + accès au panel). Volontairement pas de contenu
// supplémentaire pour l'invité, juste de la mise en avant (voir décision du
// 21/07/2026).
export function AccessBanner({ access, clubs }: { access: AccessContext; clubs: FamilyClub[] }) {
  if (access.tier === "invite") {
    return (
      <div className="mx-auto mb-6 flex max-w-7xl flex-col items-center justify-between gap-4 rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/10 to-primary-2/10 p-5 px-6 sm:flex-row">
        <div>
          <p className="font-display text-lg font-bold uppercase tracking-wide text-foreground">
            {access.loggedIn && !access.inGuild
              ? "Tu n'es pas encore dans la famille"
              : "Rejoins la famille Projet X"}
          </p>
          <p className="mt-1 text-sm text-muted">
            Discute avec la communauté et demande à rejoindre un club depuis notre Discord.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <a
            href={discordInviteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-gradient-to-r from-primary to-primary-2 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(113,54,186,0.3)] transition-transform hover:scale-[1.03]"
          >
            Rejoindre le Discord
          </a>
          <Link
            href="/clubs"
            className="rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/60"
          >
            Voir les clubs
          </Link>
        </div>
      </div>
    );
  }

  const club = access.clubSlug ? clubs.find((c) => c.slug === access.clubSlug) : null;
  const panelHref = access.tier === "admin" ? "/admin" : access.tier === "staff" ? "/staff" : null;
  const panelLabel = access.tier === "admin" ? "Panel admin" : "Panel staff";

  return (
    <div className="mx-auto mb-6 flex max-w-7xl flex-col items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-5 px-6 sm:flex-row">
      <div>
        <p className="font-display text-lg font-bold uppercase tracking-wide text-foreground">
          {club ? `Bienvenue dans ${club.name}` : "Bienvenue"}
        </p>
        {club && (
          <p className="mt-1 text-sm text-muted">
            #{club.rank} de la famille · {club.trophies} 🏆 · {club.memberCount} membres
          </p>
        )}
      </div>
      <div className="flex shrink-0 flex-wrap gap-3">
        {club && (
          <Link
            href={`/clubs/${club.slug}`}
            className="flex items-center gap-1 rounded-full border border-border bg-surface-2 px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/60"
          >
            Mon club <ChevronRight size={15} />
          </Link>
        )}
        {panelHref && (
          <Link
            href={panelHref}
            className="flex items-center gap-1 rounded-full bg-gradient-to-r from-primary to-primary-2 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(113,54,186,0.3)] transition-transform hover:scale-[1.03]"
          >
            {panelLabel} <ChevronRight size={15} />
          </Link>
        )}
      </div>
    </div>
  );
}
