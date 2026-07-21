import { Crown } from "lucide-react";
import type { RankedPlayer } from "@/lib/family";
import { Panel } from "./Panel";
import { Avatar } from "./Avatar";
import { TierIcon } from "./TierIcon";
import { tierColorClass } from "@/lib/tiers";

const crownColor: Record<number, string> = {
  1: "#facc15",
  2: "#d1d5db",
  3: "#c2833f",
};

export function EloRanking({ players }: { players: RankedPlayer[] }) {
  return (
    <Panel
      title="Classement des meilleurs élo"
      linkLabel="Voir tous les classements"
      linkHref="/classement"
    >
      <ul className="flex flex-col gap-0.5">
        {players.map((player) => (
          <li key={player.tag ?? player.rank} className="flex items-center gap-3 rounded-xl px-3 py-2">
            <span className="flex w-4 justify-center">
              {player.rank <= 3 ? (
                <Crown size={15} color={crownColor[player.rank]} fill={crownColor[player.rank]} />
              ) : (
                <span className="text-sm font-bold text-muted">{player.rank}</span>
              )}
            </span>
            <Avatar name={player.name} color={player.color} />
            <span className="flex-1 truncate text-sm font-medium text-foreground/90">
              {player.name}
            </span>
            <span className={`text-xs font-bold uppercase tracking-wide ${tierColorClass(player.tier)}`}>
              {player.tier}
            </span>
            <TierIcon tier={player.tier} size={20} />
            <span className="w-12 text-right text-sm font-semibold text-foreground/90">
              {player.elo}
            </span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
