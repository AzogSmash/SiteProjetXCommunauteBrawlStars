import type { Player } from "@/lib/family";
import { Panel } from "./Panel";
import { Avatar } from "./Avatar";
import { TrophyIcon } from "./TrophyIcon";
import { DataUnavailable } from "./DataUnavailable";

export function TopPushers({ pushers }: { pushers: Player[] }) {
  return (
    <Panel
      title="Meilleurs pushers (saison en cours)"
      linkLabel="Voir plus"
      linkHref="/pusheurs"
    >
      {pushers.length === 0 ? (
        <DataUnavailable message="Pas encore de progression enregistrée cette saison." />
      ) : (
        <ul className="flex flex-col gap-1">
          {pushers.map((player) => (
            <li key={player.tag ?? player.rank} className="flex items-center gap-3 rounded-xl px-3 py-2.5 odd:bg-surface-2">
              <span className="w-4 text-sm font-bold text-muted">{player.rank}</span>
              <Avatar name={player.name} color={player.color} />
              <span className="flex-1 truncate text-sm font-medium text-foreground/90">
                {player.name}
              </span>
              <span className="text-sm font-semibold text-foreground/90">
                {player.trophies}
              </span>
              <TrophyIcon size={16} />
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
