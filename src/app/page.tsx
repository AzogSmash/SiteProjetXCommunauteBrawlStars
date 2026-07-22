import { Hero } from "@/components/Hero";
import { StatsBar } from "@/components/StatsBar";
import { TopClubs } from "@/components/TopClubs";
import { TopPushers } from "@/components/TopPushers";
import { EloRanking } from "@/components/EloRanking";
import { NewsSection } from "@/components/NewsSection";
import { AboutPanel } from "@/components/AboutPanel";
import { AccessBanner } from "@/components/AccessBanner";
import { FounderStory } from "@/components/FounderStory";
import {
  getFamilyClubs,
  getSeasonTopPushers,
  getHomeRankedPreview,
  getCommunityStats,
  getCurrentSeasonInfo,
} from "@/lib/family";
import { getAccessContext } from "@/lib/access";

export default async function Home() {
  const [clubs, pushers, rankedPreview, stats, season, access] = await Promise.all([
    getFamilyClubs(),
    getSeasonTopPushers(5),
    getHomeRankedPreview(),
    getCommunityStats(),
    getCurrentSeasonInfo(),
    getAccessContext(),
  ]);

  const flagship = clubs.find((c) => c.isFlagship) ?? clubs[0];
  const bestPlayer = rankedPreview[0];

  return (
    <>
      <Hero
        flagship={flagship}
        bestPlayer={bestPlayer}
        currentSeason={season?.label}
        seasonTimeLeft={season?.timeLeft}
      />
      <AccessBanner access={access} clubs={clubs} />
      <StatsBar
        stats={stats}
        currentSeason={season?.label ?? null}
        seasonTimeLeft={season?.timeLeft ?? null}
      />
      <FounderStory />

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
          <TopClubs clubs={clubs.slice(0, 5)} />
          <TopPushers pushers={pushers} />
          <EloRanking players={rankedPreview} />
        </div>

        <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <NewsSection />
          </div>
          <div className="lg:col-span-1">
            <AboutPanel />
          </div>
        </div>
      </main>
    </>
  );
}
