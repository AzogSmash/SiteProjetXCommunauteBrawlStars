import { PageHeader } from "@/components/PageHeader";
import { Panel } from "@/components/Panel";
import { ClassementTabs } from "@/components/ClassementTabs";
import { getRankedLeaderboard, getAllTimeRankedLeaderboard, getPlayersLeaderboard } from "@/lib/family";
import { getFamilyClassement1v1, getFamilyClassementCasino } from "@/lib/api";

export default async function ClassementPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const [{ tab }, ranked, rankedAllTime, trophees, duel1v1, casino] = await Promise.all([
    searchParams,
    getRankedLeaderboard(),
    getAllTimeRankedLeaderboard(),
    getPlayersLeaderboard(),
    getFamilyClassement1v1(),
    getFamilyClassementCasino(),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="La communauté"
        title="Classement"
        description="Ranked Brawl Stars, trophées all-time, ranked 1v1 interne au serveur et économie casino."
      />

      <main className="mx-auto max-w-7xl px-6 pb-14">
        <Panel title="Classements" linkLabel="Voir les clubs" linkHref="/clubs">
          <ClassementTabs
            ranked={ranked}
            rankedAllTime={rankedAllTime}
            trophees={trophees}
            duel1v1={duel1v1 ?? []}
            casino={casino ?? []}
            initialTab={tab}
          />
        </Panel>
      </main>
    </>
  );
}
