import { Shield } from "lucide-react";
import type { FamilyClub } from "@/lib/family";
import { Panel } from "./Panel";
import { LogoMark } from "./Logo";
import { TrophyIcon } from "./TrophyIcon";
import { DataUnavailable } from "./DataUnavailable";

export function TopClubs({ clubs }: { clubs: FamilyClub[] }) {
  return (
    <Panel title="Nos clubs" linkLabel="Voir la famille" linkHref="/clubs">
      {clubs.length === 0 ? (
        <DataUnavailable message="Aucun club synchronisé pour l'instant." />
      ) : (
        <ul className="flex flex-col gap-1">
          {clubs.map((club) => (
            <li
              key={club.slug}
              className={
                club.isFlagship
                  ? "flex items-center gap-3 rounded-xl border border-primary/40 bg-primary/10 px-3 py-2.5"
                  : "flex items-center gap-3 rounded-xl px-3 py-2.5"
              }
            >
              <span
                className={
                  club.isFlagship
                    ? "w-4 text-sm font-bold text-primary-2"
                    : "w-4 text-sm font-bold text-muted"
                }
              >
                {club.rank}
              </span>

              {club.isFlagship ? (
                <LogoMark size={28} />
              ) : (
                <div
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
                  style={{ backgroundColor: `${club.color}22` }}
                >
                  <Shield size={15} color={club.color} />
                </div>
              )}

              <span
                className={
                  club.isFlagship
                    ? "flex-1 truncate text-sm font-bold text-foreground"
                    : "flex-1 truncate text-sm font-medium text-foreground/90"
                }
              >
                {club.name}
              </span>

              <span className="text-sm font-semibold text-foreground/90">
                {club.trophies}
              </span>
              <TrophyIcon size={16} />
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
