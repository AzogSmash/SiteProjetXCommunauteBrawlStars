import { TrendingUp } from "lucide-react";
import type { Player } from "@/lib/family";
import { Panel } from "./Panel";
import { Avatar } from "./Avatar";

export function TopPushers({ pushers }: { pushers: Player[] }) {
  return (
    <Panel
      title="Meilleurs pushers (saison en cours)"
      linkLabel="Voir plus"
      linkHref="/pusheurs"
    >
      <ul className="flex flex-col gap-1">
        {pushers.map((player) => (
          <li key={player.tag ?? player.rank} className="flex items-center gap-3 rounded-xl px-3 py-2.5">
            <span className="w-4 text-sm font-bold text-muted">{player.rank}</span>
            <Avatar name={player.name} color={player.color} />
            <span className="flex-1 truncate text-sm font-medium text-foreground/90">
              {player.name}
            </span>
            <span className="text-sm font-semibold text-foreground/90">
              {player.trophies}
            </span>
            <TrendingUp size={14} className="text-primary-2" />
          </li>
        ))}
      </ul>
    </Panel>
  );
}
