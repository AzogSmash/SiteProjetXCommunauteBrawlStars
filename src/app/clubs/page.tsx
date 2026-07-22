import Link from "next/link";
import { Users, Shield, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { LogoMark } from "@/components/Logo";
import { TrophyIcon } from "@/components/TrophyIcon";
import { DataUnavailable } from "@/components/DataUnavailable";
import { getFamilyClubs } from "@/lib/family";

export default async function ClubsPage() {
  const clubs = await getFamilyClubs();

  return (
    <>
      <PageHeader
        eyebrow="La communauté"
        title="Nos clubs"
        description="Projet X regroupe plusieurs clubs Brawl Stars sous une même bannière. Choisis un club pour voir sa fiche complète."
      />

      <main className="mx-auto max-w-7xl px-6 pb-14">
        {clubs.length === 0 && (
          <div className="card-elevated rounded-2xl border border-border bg-surface">
            <DataUnavailable message="Aucun club synchronisé pour l'instant." />
          </div>
        )}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {clubs.map((club) => (
            <Link
              key={club.slug}
              href={`/clubs/${club.slug}`}
              className={
                club.isFlagship
                  ? "card-elevated card-elevated-hover group flex flex-col gap-3 rounded-2xl border border-primary/40 bg-primary/10 p-4 hover:border-primary/70"
                  : "card-elevated card-elevated-hover group flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4 hover:border-primary/40"
              }
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  {club.isFlagship ? (
                    <LogoMark size={32} />
                  ) : (
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
                      style={{ backgroundColor: `${club.color}22` }}
                    >
                      <Shield size={16} color={club.color} />
                    </div>
                  )}
                  {club.isFlagship && (
                    <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-2">
                      Club phare
                    </span>
                  )}
                </div>
                <ChevronRight size={16} className="text-muted transition-transform group-hover:translate-x-0.5" />
              </div>
              <p className="truncate text-sm font-bold text-foreground">{club.name}</p>
              <div className="flex items-center justify-between text-sm font-semibold text-foreground/90">
                <span className="flex items-center gap-1.5">
                  <TrophyIcon size={15} />
                  {club.trophies}
                </span>
                <span className="flex items-center gap-1.5 text-xs font-medium text-muted">
                  <Users size={13} />
                  {club.memberCount}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
