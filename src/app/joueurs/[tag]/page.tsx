import Link from "next/link";
import { notFound } from "next/navigation";
import { Users, ChevronRight, ShieldCheck, ImageOff, MessageSquareText } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Panel } from "@/components/Panel";
import { StatItem } from "@/components/StatItem";
import { RoleBadge } from "@/components/RoleBadge";
import { TierIcon } from "@/components/TierIcon";
import { TrophyIcon } from "@/components/TrophyIcon";
import { DataUnavailable } from "@/components/DataUnavailable";
import { getPlayerProfile } from "@/lib/family";
import { formatNumber } from "@/lib/format";

export default async function PlayerProfilePage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const profile = await getPlayerProfile(tag);
  if (!profile) notFound();

  const hasLiveStats = profile.victories3v3 != null || profile.victoriesSolo != null || profile.victoriesDuo != null || profile.expLevel != null;

  return (
    <>
      <PageHeader eyebrow="Joueur" title={profile.name} description={profile.tag} />

      <section className="mx-auto max-w-7xl px-6">
        <div className="card-elevated flex flex-col gap-4 rounded-2xl border border-border bg-surface p-6 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-2xl font-bold text-white" style={{ backgroundColor: profile.color }}>
            {Array.from(profile.name.trim())[0]?.toUpperCase() ?? "?"}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-2xl font-extrabold uppercase tracking-wide">{profile.name}</h2>
              {profile.role && <RoleBadge role={profile.role} />}
              {profile.isAdmin ? (
                <span className="flex items-center gap-1 rounded-full bg-red-500/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-red-500">
                  <ShieldCheck size={12} /> Admin
                </span>
              ) : profile.isStaff ? (
                <span className="flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary-2">
                  <ShieldCheck size={12} /> Staff
                </span>
              ) : null}
            </div>
            {profile.club && (
              profile.clubSlug ? (
                <Link
                  href={`/clubs/${profile.clubSlug}`}
                  className="mt-1 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-primary-2 hover:text-primary"
                >
                  {profile.club}
                  <ChevronRight size={13} />
                </Link>
              ) : (
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-muted">{profile.club}</p>
              )
            )}
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 pb-14">
        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatItem icon={Users} iconNode={<TrophyIcon size={26} />} label="Trophées" value={formatNumber(profile.trophies)} sub="TOTAL" numeric />
          <StatItem
            icon={Users}
            iconNode={profile.rankedTier ? <TierIcon tier={profile.rankedTier} size={26} /> : undefined}
            label="Ranked"
            value={profile.rankedPts != null ? String(profile.rankedPts) : "—"}
            sub={profile.rankedTier ?? "Pas de données"}
            numeric
          />
          <StatItem
            icon={Users}
            iconNode={profile.highestRankedTier ? <TierIcon tier={profile.highestRankedTier} size={26} /> : undefined}
            label="Ranked all-time"
            value={profile.highestRankedPts != null ? String(profile.highestRankedPts) : "—"}
            sub={profile.highestRankedTier ?? "Pas de données"}
            numeric
          />
          <StatItem
            icon={Users}
            label="Niveau d'expérience"
            value={profile.expLevel != null ? String(profile.expLevel) : "—"}
            sub="XP"
            numeric
          />
        </div>

        <div className="mt-6">
          <Panel title="Victoires en jeu">
            {hasLiveStats ? (
              <div className="grid grid-cols-3 gap-3">
                <StatItem icon={Users} label="3v3" value={profile.victories3v3 != null ? formatNumber(profile.victories3v3) : "—"} sub="VICTOIRES" numeric />
                <StatItem icon={Users} label="Solo" value={profile.victoriesSolo != null ? formatNumber(profile.victoriesSolo) : "—"} sub="VICTOIRES" numeric />
                <StatItem icon={Users} label="Duo" value={profile.victoriesDuo != null ? formatNumber(profile.victoriesDuo) : "—"} sub="VICTOIRES" numeric />
              </div>
            ) : (
              <DataUnavailable message="Stats de jeu indisponibles pour l'instant — réessaie un peu plus tard." />
            )}
          </Panel>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Panel title="Ranked 1v1 (Discord)">
            {profile.duel1v1 ? (
              <div className="grid grid-cols-3 gap-3">
                <StatItem icon={Users} label="Points" value={String(profile.duel1v1.points)} sub={profile.duel1v1.tier} numeric />
                <StatItem icon={Users} label="Victoires" value={String(profile.duel1v1.wins)} sub="1V1" numeric />
                <StatItem icon={Users} label="Défaites" value={String(profile.duel1v1.losses)} sub="1V1" numeric />
              </div>
            ) : profile.discordLinked ? (
              <DataUnavailable message="Aucun duel joué pour l'instant." />
            ) : (
              <DataUnavailable message="Compte Discord non lié — ces stats nécessitent une liaison BS ↔ Discord." />
            )}
          </Panel>

          <Panel title="Casino (Discord)">
            {profile.casinoCoins != null ? (
              <div className="flex items-center gap-3 rounded-xl border border-border bg-surface-2 px-4 py-4">
                <span className="text-2xl font-game text-amber-600">{formatNumber(profile.casinoCoins)}</span>
                <span className="text-sm text-muted">jetons</span>
              </div>
            ) : profile.discordLinked ? (
              <DataUnavailable message="Personne n'a encore de jetons." />
            ) : (
              <DataUnavailable message="Compte Discord non lié — ces stats nécessitent une liaison BS ↔ Discord." />
            )}
          </Panel>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Panel title="Présentation">
            {profile.bio ? (
              <p className="flex items-start gap-2 text-sm leading-relaxed text-foreground/90">
                <MessageSquareText size={16} className="mt-0.5 shrink-0 text-primary-2" />
                {profile.bio}
              </p>
            ) : (
              <p className="text-sm text-muted">
                {profile.name} n&apos;a pas encore écrit de présentation.
              </p>
            )}
          </Panel>

          <Panel title="Screenshot du profil">
            {profile.screenshotUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- image hébergée sur Supabase Storage, domaine pas ajouté à next/image
              <img
                src={profile.screenshotUrl}
                alt={`Profil in-game de ${profile.name}`}
                className="w-full rounded-xl border border-border object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 py-8 text-center">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-2 text-muted">
                  <ImageOff size={18} />
                </div>
                <p className="max-w-xs text-sm text-muted">Aucun screenshot ajouté pour l&apos;instant.</p>
              </div>
            )}
          </Panel>
        </div>
      </main>
    </>
  );
}
