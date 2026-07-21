import { Users, UserPlus, ShieldAlert, VolumeX, Ban, Lock, LockOpen, Radio, Flag, TrendingUp } from "lucide-react";
import { Panel } from "@/components/Panel";
import { StatItem } from "@/components/StatItem";
import { getStaffPanel, getFamilyEvolution, type ApiEvolutionEntry, type ApiModerationEntry, type ModerationAction } from "@/lib/api";
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

type Tone = "primary" | "amber" | "red" | "green";

function IconChip({ children, tone = "primary" }: { children: React.ReactNode; tone?: Tone }) {
  const toneClass =
    tone === "amber"
      ? "bg-amber-500/15 text-amber-600"
      : tone === "red"
        ? "bg-red-500/15 text-red-500"
        : tone === "green"
          ? "bg-emerald-500/15 text-emerald-600"
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

const MODERATION_META: Record<ModerationAction, { label: string; icon: React.ComponentType<{ size?: number }>; tone: Tone }> = {
  warn: { label: "Avertissement", icon: ShieldAlert, tone: "amber" },
  mute: { label: "Mute", icon: VolumeX, tone: "amber" },
  ban: { label: "Bannissement", icon: Ban, tone: "red" },
  silence: { label: "Silence", icon: VolumeX, tone: "red" },
  punition: { label: "Punition", icon: Lock, tone: "primary" },
  punition_fin: { label: "Fin de punition", icon: LockOpen, tone: "green" },
  morse: { label: "Punition morse", icon: Radio, tone: "primary" },
  morse_fin: { label: "Fin de punition morse", icon: LockOpen, tone: "green" },
};

function ModerationRow({ entry }: { entry: ApiModerationEntry }) {
  const meta = MODERATION_META[entry.action];
  const Icon = meta.icon;
  return (
    <li className="flex items-start gap-3 rounded-xl px-3 py-2.5 text-sm">
      <IconChip tone={meta.tone}>
        <Icon size={15} />
      </IconChip>
      <span className="min-w-0 flex-1 pt-1">
        <span className="font-medium text-foreground/90">{meta.label}</span> · {entry.target_name}
        {entry.reason && <> — {entry.reason}</>}
        {entry.extra && <span className="text-muted"> ({entry.extra})</span>}
        <span className="ml-2 text-xs text-muted">par {entry.moderator}</span>
      </span>
      <span className="shrink-0 pt-1 text-xs text-muted">{formatDateTime(entry.timestamp)}</span>
    </li>
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
          label="Actions modération"
          value={String(panel?.moderation_log.length ?? 0)}
          sub="RÉCENTES"
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

      {/* flex plutôt que grid : avec des listes de longueurs très différentes
          (7 clans vs 15 arrivées), une grille étire par défaut la colonne la
          plus courte à la hauteur de la plus longue, laissant un grand vide
          à l'intérieur de la carte (retour du 21/07/2026 — "ça fait vide"). */}
      <div className="mt-6 flex flex-col items-start gap-6 lg:flex-row">
        <Panel title="Progression par clan (saison en cours)" className="w-full lg:w-2/3">
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

        <Panel title="Arrivées récentes" className="w-full lg:w-1/3">
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
          {!panel || (panel.moderation_log.length === 0 && panel.reports.length === 0) ? (
            <EmptyState text="Aucune action de modération ni signalement récent." />
          ) : (
            <ul className="flex flex-col gap-1">
              {panel.moderation_log.map((entry, i) => (
                <ModerationRow key={`mod-${i}`} entry={entry} />
              ))}
              {panel.reports.map((r, i) => (
                <li key={`report-${i}`} className="flex items-start gap-3 rounded-xl px-3 py-2.5 text-sm">
                  <IconChip tone="red">
                    <Flag size={15} />
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
