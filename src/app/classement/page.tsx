import { PageHeader } from "@/components/PageHeader";
import { ClassementTabs } from "@/components/ClassementTabs";
import { getRankedLeaderboard, getAllTimeRankedLeaderboard, getPlayersLeaderboard, monthLabel } from "@/lib/family";
import {
  getFamilyClassement1v1,
  getFamilyClassementCasino,
  getFamilyClans,
  getFamily1v1Saisons,
  getFamilyCasinoSaisons,
} from "@/lib/api";
import { spaceClubName } from "@/lib/format";

const normTag = (t: string) => t.replace(/^#/, "").toUpperCase();

export default async function ClassementPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; saison1v1?: string; saisoncasino?: string }>;
}) {
  const { tab, saison1v1, saisoncasino } = await searchParams;
  const [ranked, rankedAllTime, trophees, duel1v1, casino, clans, seasons1v1, seasonsCasino] = await Promise.all([
    getRankedLeaderboard(),
    getAllTimeRankedLeaderboard(),
    getPlayersLeaderboard(),
    getFamilyClassement1v1(saison1v1),
    getFamilyClassementCasino(saisoncasino),
    getFamilyClans(),
    getFamily1v1Saisons(),
    getFamilyCasinoSaisons(),
  ]);

  // 1v1/casino sont des classements internes au Discord (compte lié, pas le
  // tag BS) : aucun champ club natif, contrairement à ranked/trophées. On le
  // déduit via le tag (quand connu) en le recoupant avec le classement
  // trophées, qui a déjà tag+club pour tout le monde. Le rang est calculé ICI
  // sur la liste complète (avant tout filtre) pour rester le rang global,
  // même après un filtre par club côté client (voir ClassementTabs).
  const tagToClub = new Map((trophees ?? []).filter((p) => p.tag).map((p) => [normTag(p.tag!), p.club ?? null]));
  const duel1v1WithClub = (duel1v1 ?? []).map((p, i) => ({
    ...p,
    rank: i + 1,
    club: p.tag ? (tagToClub.get(normTag(p.tag)) ?? null) : null,
  }));
  const casinoWithClub = (casino ?? []).map((p, i) => ({
    ...p,
    rank: i + 1,
    club: p.tag ? (tagToClub.get(normTag(p.tag)) ?? null) : null,
  }));

  const clubs = clans?.map((c) => ({ value: c.name, label: spaceClubName(c.name) })) ?? [];
  const seasons1v1Options = (seasons1v1 ?? []).map((m) => ({ value: m, label: monthLabel(m) }));
  const seasonsCasinoOptions = (seasonsCasino ?? []).map((m) => ({ value: m, label: monthLabel(m) }));

  return (
    <>
      <PageHeader
        eyebrow="La communauté"
        title="Classement"
        description="Ranked Brawl Stars, trophées all-time, ranked 1v1 interne au serveur et économie casino."
      />

      <main className="mx-auto max-w-7xl px-6 pb-14">
        <ClassementTabs
          ranked={ranked}
          rankedAllTime={rankedAllTime}
          trophees={trophees}
          duel1v1={duel1v1WithClub}
          casino={casinoWithClub}
          clubs={clubs}
          initialTab={tab}
          seasons1v1={seasons1v1Options}
          seasonsCasino={seasonsCasinoOptions}
          selectedSeason1v1={saison1v1 ?? null}
          selectedSeasonCasino={saisoncasino ?? null}
        />
      </main>
    </>
  );
}
