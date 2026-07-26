"use client";

import { useState } from "react";
import { Avatar } from "./Avatar";
import { PushArrow } from "./PushArrow";
import { PlayerLink } from "./PlayerLink";
import { DataUnavailable } from "./DataUnavailable";
import type { Player } from "@/lib/family";

// Même pattern "Voir plus" que ClassementTabs — évite d'imposer la liste
// complète (200+ joueurs) d'un coup, surtout sur mobile.
const PAGE_SIZE = 20;

export function TopPushersList({ pushers }: { pushers: Player[] }) {
  const [expanded, setExpanded] = useState(false);

  if (pushers.length === 0) {
    return <DataUnavailable message="Pas encore de progression enregistrée cette saison." />;
  }

  const visible = expanded ? pushers : pushers.slice(0, PAGE_SIZE);
  const remaining = pushers.length - PAGE_SIZE;

  return (
    <>
      <ul className="flex flex-col gap-0.5">
        {visible.map((player) => (
          <li key={player.tag ?? player.rank} className="flex items-center gap-3 rounded-xl px-3 py-2 odd:bg-surface-2">
            <span className="w-6 text-sm font-bold text-muted">{player.rank}</span>
            <Avatar name={player.name} color={player.color} />
            <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground/90">
              <PlayerLink tag={player.tag}>{player.name}</PlayerLink>
              {player.club && <span className="ml-2 text-xs font-normal text-muted">{player.club}</span>}
            </span>
            <span className="flex items-center gap-1 text-sm font-semibold text-primary-2">
              {player.trophies}
              <PushArrow value={player.trophies} size={16} />
            </span>
          </li>
        ))}
      </ul>
      {!expanded && remaining > 0 && (
        <button
          onClick={() => setExpanded(true)}
          className="mt-2 w-full rounded-xl border border-border py-2.5 text-xs font-semibold uppercase tracking-wide text-primary-2 transition-colors hover:bg-surface-2"
        >
          Voir plus ({remaining} de plus)
        </button>
      )}
    </>
  );
}
