import Image from "next/image";
import { notFound } from "next/navigation";
import { Users, Globe2, Shield } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Panel } from "@/components/Panel";
import { Avatar } from "@/components/Avatar";
import { RoleBadge } from "@/components/RoleBadge";
import { StatItem } from "@/components/StatItem";
import { TrophyIcon } from "@/components/TrophyIcon";
import { LockIcon } from "@/components/LockIcon";
import { PlayerLink } from "@/components/PlayerLink";
import { ClubRankingTabs } from "@/components/ClubRankingTabs";
import { getClubDetail } from "@/lib/family";
import { discordInviteUrl } from "@/lib/data";

export default async function ClubDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const club = await getClubDetail(slug);
  if (!club) notFound();

  return (
    <>
      <PageHeader
        eyebrow="La communauté"
        title={club.name}
        description={`Fiche du club, effectif et statistiques en direct depuis Brawl Stars.`}
      />

      <section className="mx-auto max-w-7xl px-6">
        <div className="card-elevated flex flex-col gap-6 rounded-2xl border border-border bg-surface p-6 sm:flex-row sm:items-center">
          <div className="relative flex h-32 w-32 shrink-0 items-center justify-center rounded-2xl bg-white p-5 shadow-[0_4px_24px_rgba(113,54,186,0.18)] sm:h-40 sm:w-40">
            {club.isFlagship ? (
              <Image src="/logo-x-square.png" alt={`Emblème ${club.name}`} fill sizes="160px" className="object-contain p-4" />
            ) : (
              <Shield size={48} className="text-primary-2" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-display text-2xl font-extrabold uppercase tracking-wide">
                {club.name}
              </h2>
              <span className="text-sm font-medium text-muted">{club.tag}</span>
              {club.isFlagship && (
                <span className="rounded-full bg-primary/20 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-primary-2">
                  Club phare
                </span>
              )}
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
              {club.description || "Pas encore de description synchronisée pour ce club."}
            </p>
            <a
              href={discordInviteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-2 px-4 py-2 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(113,54,186,0.3)] transition-transform hover:scale-[1.03]"
            >
              <DiscordIcon />
              Rejoindre sur Discord
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatItem icon={Users} iconNode={<TrophyIcon size={26} />} label="Trophées totaux" value={club.trophies} sub="CLUB" numeric />
          <StatItem icon={Users} label="Membres" value={String(club.memberCount)} sub="ACTIFS" numeric />
          <StatItem icon={Users} iconNode={<LockIcon size={24} />} label="Trophées requis" value={club.requiredTrophies || "—"} sub="MINIMUM" numeric />
          <StatItem icon={Globe2} label="Type" value={club.typeLabel || "—"} sub="ADMISSION" />
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 pb-14">
        <Panel title="Effectif du club" linkLabel="Voir le classement" linkHref="/classement?tab=trophees">
          {club.roster.length === 0 ? (
            <p className="px-3 py-6 text-sm text-muted">
              L&apos;effectif de ce club n&apos;est pas encore synchronisé — réessaie un peu plus
              tard.
            </p>
          ) : (
            <ul className="flex flex-col gap-1">
              {club.roster.map((member) => (
                <li key={member.tag} className="flex items-center gap-3 rounded-xl px-3 py-2.5 odd:bg-surface-2">
                  <span className="w-5 text-sm font-bold text-muted">{member.rank}</span>
                  <Avatar name={member.name} color={member.color} />
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground/90">
                    <PlayerLink tag={member.tag}>{member.name}</PlayerLink>
                  </span>
                  <RoleBadge role={member.role} tag={member.tag} />
                  <span className="w-24 text-right text-sm font-semibold text-foreground/90">
                    {member.trophies}
                  </span>
                  <TrophyIcon size={16} />
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <div className="mt-8">
          <ClubRankingTabs ranking={club.ranking} />
        </div>
      </main>
    </>
  );
}

function DiscordIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.3 5.3A18 18 0 0 0 15.9 4l-.3.6a13 13 0 0 1 3.7 1.4A16 16 0 0 0 12 4a16 16 0 0 0-7.3 2 13 13 0 0 1 3.8-1.4L8.1 4a18 18 0 0 0-4.4 1.3C1.6 9 1 12.6 1.2 16.1a18 18 0 0 0 5.4 2.7l.8-1.3a12 12 0 0 1-1.9-.9l.5-.4a13 13 0 0 0 11.9 0l.5.4c-.6.4-1.2.6-1.9.9l.8 1.3a18 18 0 0 0 5.4-2.7c.3-4-.6-7.6-2.4-10.8ZM8.7 14.2c-.8 0-1.5-.8-1.5-1.7s.7-1.7 1.5-1.7 1.5.8 1.5 1.7-.7 1.7-1.5 1.7Zm6.6 0c-.8 0-1.5-.8-1.5-1.7s.7-1.7 1.5-1.7 1.5.8 1.5 1.7-.7 1.7-1.5 1.7Z" />
    </svg>
  );
}
