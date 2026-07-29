import {
  getStaffPanel,
  getFamilyEvolution,
  getFamilySaisons,
  getFamily1v1Saisons,
  getFamilyCasinoSaisons,
  getFamilyActualites,
  getAdminEconomyStatus,
  type ApiEvolutionEntry,
  type ApiClan,
} from "@/lib/api";
import { monthLabel } from "@/lib/family";
import { ExportPanel } from "@/components/ExportPanel";
import { AdminTabs } from "@/components/AdminTabs";

function groupByClub(players: ApiEvolutionEntry[]) {
  const byClub = new Map<string, { total: number; players: ApiEvolutionEntry[] }>();
  for (const p of players) {
    const key = p.club ?? "Sans club";
    const entry = byClub.get(key) ?? { total: 0, players: [] };
    entry.total += p.delta;
    entry.players.push(p);
    byClub.set(key, entry);
  }
  return [...byClub.entries()]
    .map(([club, { total, players }]) => ({
      club,
      total,
      count: players.length,
      top: players.slice().sort((a, b) => b.delta - a.delta)[0],
    }))
    .sort((a, b) => b.total - a.total);
}

// Contenu du panel staff — partagé entre /staff et /admin (un admin voit
// tout ce que voit un staff, cf. modèle d'accès cumulatif décidé le
// 21/07/2026), voir lib/access.ts. `clans` n'est passé que par /admin
// (l'onglet Clans reste caché pour le staff simple).
export async function StaffPanelContent({ clans }: { clans?: ApiClan[] }) {
  const isAdmin = clans !== undefined;
  const [panel, evolution, bsSeasons, duel1v1Seasons, casinoSeasons, actualites, economyStatus] = await Promise.all([
    getStaffPanel(),
    getFamilyEvolution(),
    getFamilySaisons(),
    getFamily1v1Saisons(),
    getFamilyCasinoSaisons(),
    getFamilyActualites(10),
    isAdmin ? getAdminEconomyStatus() : Promise.resolve(null),
  ]);
  const clubRows = evolution ? groupByClub(evolution.players) : [];

  const allSeasonKeys = new Set([...(bsSeasons ?? []), ...(duel1v1Seasons ?? []), ...(casinoSeasons ?? [])]);
  const seasonLabels = Object.fromEntries([...allSeasonKeys].map((m) => [m, monthLabel(m)]));

  return (
    <>
      <ExportPanel
        duel1v1Seasons={duel1v1Seasons ?? []}
        casinoSeasons={casinoSeasons ?? []}
        bsSeasons={bsSeasons ?? []}
        seasonLabels={seasonLabels}
      />

      <AdminTabs
        panel={panel}
        clubRows={clubRows}
        clans={clans}
        actualites={actualites ?? []}
        economyStatus={economyStatus}
      />
    </>
  );
}
