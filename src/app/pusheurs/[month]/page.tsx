import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Crown } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Panel } from "@/components/Panel";
import { PushArrow } from "@/components/PushArrow";
import { TopPushersList } from "@/components/TopPushersList";
import { getSeasonArchiveInfo, getSeasonArchiveLeaderboard } from "@/lib/family";

export default async function SeasonArchivePage({
  params,
}: {
  params: Promise<{ month: string }>;
}) {
  const { month } = await params;
  const [info, pushers] = await Promise.all([
    getSeasonArchiveInfo(month),
    getSeasonArchiveLeaderboard(month),
  ]);
  if (!info || !pushers) notFound();

  return (
    <>
      <PageHeader
        eyebrow="Saison archivée"
        title={info.label}
        description="Classement final du push de cette saison — figé au reset suivant."
      />

      <main className="mx-auto max-w-7xl px-6 pb-14">
        <Link
          href="/pusheurs"
          className="mb-6 inline-flex items-center gap-1 text-sm font-semibold text-primary-2 hover:text-primary"
        >
          <ChevronLeft size={16} />
          Retour à la saison en cours
        </Link>

        <div className="card-elevated rounded-2xl border border-primary/40 bg-primary/10 p-6">
          <div className="flex items-center gap-3">
            <Crown size={20} className="text-primary-2" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary-2">
                Roi du push — {info.label}
              </p>
              <p className="flex items-center gap-1 font-display text-lg font-extrabold uppercase tracking-wide">
                {info.topPlayer}
                {info.topPlayerDelta && (
                  <span className="flex items-center gap-1 text-primary-2">
                    {info.topPlayerDelta}
                    <PushArrow value={info.topPlayerDelta} size={16} />
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Panel title={`Classement complet — ${pushers.length} joueurs`}>
            <TopPushersList pushers={pushers} />
          </Panel>
        </div>
      </main>
    </>
  );
}
