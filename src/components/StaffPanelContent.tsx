import { Users, UserPlus, ShieldAlert, Flag, TrendingUp } from "lucide-react";
import { Panel } from "@/components/Panel";
import { StatItem } from "@/components/StatItem";
import { getStaffPanel, getFamilyEvolution, type ApiEvolutionEntry } from "@/lib/api";
import { formatDateTime, formatNumber, spaceClubName } from "@/lib/format";

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

function IconChip({ children, tone = "primary" }: { children: React.ReactNode; tone?: "primary" | "amber" | "red" }) {
  const toneClass =
    tone === "amber"
      ? "bg-amber-500/15 text-amber-600"
      : tone === "red"
        ? "bg-red-500/15 text-red-500"
        : "bg-gradient-to-br from-primary/25 to-primary-2/10 text-primary-2";
  return (
    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${toneClass}`}>{children}</div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center gap-2 py-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-2 text-muted">
        <ShieldAlert size={20} />
      </div>
      <p className="max-w-xs text-sm text-muted">{text}</p>
    </div>
  );
}

// Contenu du panel staff — partagé entre /staff et /admin (un admin voit
// tout ce que voit un staff, cf. modèle d'accès cumulatif décidé le
// 21/07/2026), voir lib/access.ts.
export async function StaffPanelContent() {
  const [panel, evolution] = await Promise.all([getStaffPanel(), getFamilyEvolution()]);
  const clubRows = evolution ? groupByClub(evolution.players) : [];

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatItem icon={Users} label="Clans suivis" value={String(clubRows.length)} sub="SAISON EN COURS" numeric />
        <StatItem
          icon={UserPlus}
          label="Nouveaux membres"
          value={String(panel?.recent_members.length ?? 0)}
          sub="AFFICHÉS"
          numeric
        />
        <StatItem
          icon={ShieldAlert}
          label="Avertissements"
          value={String(panel?.warns.length ?? 0)}
          sub="RÉCENTS"
          numeric
        />
        <StatItem
          icon={Flag}
          label="Signalements"
          value={String(panel?.reports.length ?? 0)}
          sub="RANKED"
          numeric
        />
      </div>

      <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        <Panel title="Progression par clan (saison en cours)" className="lg:col-span-2">
          {clubRows.length === 0 ? (
            <EmptyState text="Pas encore de données de saison." />
          ) : (
            <ul className="flex flex-col gap-1">
              {clubRows.map((row) => (
                <li key={row.club} className="flex items-center gap-3 rounded-xl px-3 py-2.5">
                  <IconChip>
                    <TrendingUp size={15} />
                  </IconChip>
                  <span className="flex min-w-0 flex-1 items-center gap-2">
                    <span className="truncate text-sm font-medium text-foreground/90">
                      {spaceClubName(row.club)}
                    </span>
                    <span className="text-xs text-muted">{row.count} joueurs</span>
                  </span>
                  <span className="hidden text-xs text-muted sm:block">
                    top : {row.top.name} <span className="text-primary-2">+{formatNumber(row.top.delta)}</span>
                  </span>
                  <span className="w-20 text-right text-sm font-semibold text-primary-2">
                    +{formatNumber(row.total)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Arrivées récentes">
          {!panel || panel.recent_members.length === 0 ? (
            <EmptyState text="Aucune donnée disponible." />
          ) : (
            <ul className="flex flex-col gap-1">
              {panel.recent_members.map((m) => (
                <li key={m.name + m.joined_at} className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm">
                  <IconChip>
                    <UserPlus size={14} />
                  </IconChip>
                  <span className="min-w-0 flex-1 truncate font-medium text-foreground/90">{m.name}</span>
                  <span className="shrink-0 text-xs text-muted">{formatDateTime(m.joined_at)}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <div className="mt-6">
        <Panel title="Journal de modération">
          {!panel || (panel.warns.length === 0 && panel.reports.length === 0) ? (
            <EmptyState text="Aucun avertissement ni signalement récent." />
          ) : (
            <ul className="flex flex-col gap-1">
              {panel.warns.map((w, i) => (
                <li key={`warn-${i}`} className="flex items-start gap-3 rounded-xl px-3 py-2.5 text-sm">
                  <IconChip tone="amber">
                    <ShieldAlert size={15} />
                  </IconChip>
                  <span className="min-w-0 flex-1 pt-1">
                    <span className="font-medium text-foreground/90">Avertissement</span> · membre{" "}
                    <span className="text-muted">{w.user_id}</span> — {w.reason}
                    <span className="ml-2 text-xs text-muted">par {w.moderator}</span>
                  </span>
                  <span className="shrink-0 pt-1 text-xs text-muted">{formatDateTime(w.timestamp)}</span>
                </li>
              ))}
              {panel.reports.map((r, i) => (
                <li key={`report-${i}`} className="flex items-start gap-3 rounded-xl px-3 py-2.5 text-sm">
                  <IconChip tone="red">
                    <ShieldAlert size={15} />
                  </IconChip>
                  <span className="min-w-0 flex-1 pt-1">
                    <span className="font-medium text-foreground/90">Signalement ranked</span> · cible{" "}
                    <span className="text-muted">{r.target}</span> — {r.reason}
                    {r.resolved && (
                      <span className="ml-2 rounded-full bg-surface-2 px-2 py-0.5 text-[10px] font-bold uppercase text-muted">
                        Résolu
                      </span>
                    )}
                  </span>
                  <span className="shrink-0 pt-1 text-xs text-muted">{formatDateTime(r.created_at)}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}
