"use client";

import { useState } from "react";
import {
  Users,
  UserPlus,
  ShieldAlert,
  VolumeX,
  Ban,
  Lock,
  LockOpen,
  Radio,
  Flag,
  TrendingUp,
  ShieldCheck,
  Wallet,
  Ticket,
  Newspaper,
  Hammer,
} from "lucide-react";
import { Panel } from "@/components/Panel";
import { StatItem } from "@/components/StatItem";
import { NewsPublishForm } from "@/components/NewsPublishForm";
import type { ApiStaffPanel, ApiModerationEntry, ModerationAction, ApiClan, ApiNewsItem } from "@/lib/api";
import { formatDateTime, formatNumber, spaceClubName } from "@/lib/format";

type ClubRow = { club: string; total: number; count: number; top: { name: string; delta: number } };

const TABS = [
  { id: "overview", label: "Vue d'ensemble" },
  { id: "moderation", label: "Modération" },
  { id: "ranked1v1", label: "Ranked 1v1" },
  { id: "clans", label: "Clans" },
  { id: "economie", label: "Économie" },
  { id: "tickets", label: "Tickets" },
  { id: "contenu", label: "Contenu" },
] as const;

type TabId = (typeof TABS)[number]["id"];

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
  return <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${toneClass}`}>{children}</div>;
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

// Section pas encore branchée à une vraie action (voir refonte du panel admin,
// discussion du 29/07/2026) — honnête plutôt que de faire semblant d'avoir
// quelque chose à montrer, même logique que l'ancien encart Hammer.
function ComingSoon({ text, icon: Icon = Hammer }: { text: string; icon?: React.ComponentType<{ size?: number; className?: string }> }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-dashed border-border p-5 text-sm text-muted">
      <Icon size={18} className="mt-0.5 shrink-0 text-primary-2" />
      <p>{text}</p>
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
  casino_ban: { label: "Banni du casino", icon: Ban, tone: "red" },
  casino_unban: { label: "Débanni du casino", icon: LockOpen, tone: "green" },
};

function ModerationRow({ entry }: { entry: ApiModerationEntry }) {
  const meta = MODERATION_META[entry.action];
  const Icon = meta.icon;
  return (
    <li className="flex items-start gap-3 rounded-xl px-3 py-2.5 text-sm odd:bg-surface-2">
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

export function AdminTabs({
  panel,
  clubRows,
  clans,
  actualites,
  initialTab,
}: {
  panel: ApiStaffPanel | null;
  clubRows: ClubRow[];
  clans?: ApiClan[];
  actualites: ApiNewsItem[];
  initialTab?: string;
}) {
  const tabs = clans ? TABS : TABS.filter((t) => t.id !== "clans");
  const [active, setActive] = useState<TabId>(
    tabs.some((t) => t.id === initialTab) ? (initialTab as TabId) : "overview"
  );

  return (
    <div className="card-elevated rounded-2xl border border-border bg-surface p-5">
      <div className="mb-5 flex max-w-full gap-1 overflow-x-auto rounded-full border border-border bg-surface p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
              active === tab.id
                ? "bg-gradient-to-r from-primary to-primary-2 text-white"
                : "text-muted hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {active === "overview" && (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
            <StatItem icon={Flag} label="Signalements" value={String(panel?.reports.length ?? 0)} sub="RANKED" numeric />
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
                    <li key={row.club} className="flex items-center gap-3 rounded-xl px-3 py-2.5 odd:bg-surface-2">
                      <IconChip>
                        <TrendingUp size={15} />
                      </IconChip>
                      <span className="flex min-w-0 flex-1 items-center gap-2">
                        <span className="truncate text-sm font-medium text-foreground/90">{spaceClubName(row.club)}</span>
                        <span className="text-xs text-muted">{row.count} joueurs</span>
                      </span>
                      <span className="hidden text-xs text-muted sm:block">
                        top : {row.top.name} <span className="text-primary-2">+{formatNumber(row.top.delta)}</span>
                      </span>
                      <span className="w-20 text-right text-sm font-semibold text-primary-2">+{formatNumber(row.total)}</span>
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
                    <li key={m.name + m.joined_at} className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm odd:bg-surface-2">
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
        </>
      )}

      {active === "moderation" && (
        <Panel title="Journal de modération">
          {!panel || panel.moderation_log.length === 0 ? (
            <EmptyState text="Aucune action de modération récente." />
          ) : (
            <ul className="flex flex-col gap-1">
              {panel.moderation_log.map((entry, i) => (
                <ModerationRow key={`mod-${i}`} entry={entry} />
              ))}
            </ul>
          )}
        </Panel>
      )}

      {active === "ranked1v1" && (
        <Panel title="Signalements ranked 1v1">
          {!panel || panel.reports.length === 0 ? (
            <EmptyState text="Aucun signalement récent." />
          ) : (
            <ul className="flex flex-col gap-1">
              {panel.reports.map((r, i) => (
                <li key={`report-${i}`} className="flex items-start gap-3 rounded-xl px-3 py-2.5 text-sm odd:bg-surface-2">
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
      )}

      {active === "clans" && clans && (
        <Panel title="Configuration actuelle — clans de la famille">
          <ul className="flex flex-col gap-1">
            {clans.map((c) => (
              <li key={c.tag} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm odd:bg-surface-2">
                <IconChip>
                  <ShieldCheck size={15} />
                </IconChip>
                <span className="min-w-0 flex-1 truncate font-medium text-foreground/90">{c.name}</span>
                <span className="text-xs text-muted">#{c.tag}</span>
                <span className="text-xs text-muted">
                  !{c.slug}
                  {c.alias ? ` / !${c.alias}` : ""}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <ComingSoon text="Ajout/retrait de clan depuis le site arrive dans une prochaine passe — pour l'instant, utilise !bs_famille sur Discord." />
          </div>
        </Panel>
      )}

      {active === "economie" && (
        <ComingSoon
          icon={Wallet}
          text="Pause/reprise du casino, bannissements casino, ajustement de coins, freeze du marché crypto — pas encore branché sur le site, tout ça reste sur Discord pour l'instant."
        />
      )}

      {active === "tickets" && (
        <ComingSoon
          icon={Ticket}
          text="Liste des tickets ouverts et fermeture depuis le site — pas encore branché, utilise !fermer_ticket sur Discord en attendant."
        />
      )}

      {active === "contenu" && (
        <>
          <Panel title="Publier une actualité">
            <NewsPublishForm />
          </Panel>
          <div className="mt-6">
            <Panel title="Actualités récentes">
              {actualites.length === 0 ? (
                <EmptyState text="Aucune actualité publiée pour l'instant." />
              ) : (
                <ul className="flex flex-col gap-1">
                  {actualites.map((n) => (
                    <li key={n.id} className="flex items-start gap-3 rounded-xl px-3 py-2.5 text-sm odd:bg-surface-2">
                      <IconChip>
                        <Newspaper size={15} />
                      </IconChip>
                      <span className="min-w-0 flex-1 pt-1">
                        <span className="font-medium text-foreground/90">{n.title}</span> — {n.description}
                        {n.author && <span className="ml-2 text-xs text-muted">par {n.author}</span>}
                      </span>
                      <span className="shrink-0 pt-1 text-xs text-muted">{formatDateTime(n.created_at)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          </div>
        </>
      )}
    </div>
  );
}
