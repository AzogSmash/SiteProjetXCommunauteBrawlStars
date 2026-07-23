import {
  getFamilyClans,
  getFamilyTrophees,
  getFamilyRanked,
  getFamilyClanDetail,
  getFamilyEvolution,
  getFamilySaisons,
  getFamilySeasonArchive,
  getFamilyJoueur,
  getFamilyActualites,
  type ApiClubRole,
  type ApiNewsItem,
} from "./api";
import { formatNumber, spaceClubName, colorFromSeed, formatRelativeTime } from "./format";
import { getDiscordBadge } from "./access";

export type FamilyClub = {
  rank: number;
  slug: string;
  tag: string;
  name: string;
  trophies: string;
  memberCount: number;
  isFlagship: boolean;
  color?: string;
};

export type Player = {
  rank: number;
  tag?: string;
  name: string;
  club?: string | null;
  trophies: string;
  elo?: number;
  color: string;
};

export type RankedPlayer = {
  rank: number;
  tag?: string;
  name: string;
  club?: string | null;
  tier: string;
  elo: number;
  color: string;
};

async function buildFamilyClubs(): Promise<FamilyClub[] | null> {
  const [clans, trophees] = await Promise.all([getFamilyClans(), getFamilyTrophees()]);
  if (!clans || clans.length === 0 || !trophees) return null;

  const totals = new Map<string, number>();
  const members = new Map<string, number>();
  for (const p of trophees) {
    if (!p.club) continue;
    totals.set(p.club, (totals.get(p.club) ?? 0) + (p.trophies ?? 0));
    members.set(p.club, (members.get(p.club) ?? 0) + 1);
  }

  const merged = clans.map((c) => ({
    slug: c.slug,
    tag: `#${c.tag}`,
    name: spaceClubName(c.name),
    trophies: totals.get(c.name) ?? 0,
    memberCount: members.get(c.name) ?? 0,
    isFlagship: c.slug === "projetx",
  }));
  merged.sort((a, b) => b.trophies - a.trophies);

  return merged.map((c, i) => ({
    rank: i + 1,
    slug: c.slug,
    tag: c.tag,
    name: c.name,
    trophies: formatNumber(c.trophies),
    memberCount: c.memberCount,
    isFlagship: c.isFlagship,
    color: c.isFlagship ? undefined : colorFromSeed(c.slug),
  }));
}

export async function getFamilyClubs(): Promise<FamilyClub[]> {
  return (await buildFamilyClubs()) ?? [];
}

export async function getPlayersLeaderboard(): Promise<Player[]> {
  // Le cache ranked se rafraîchit toutes les 4h côté bot — largement
  // suffisant ici, pas besoin de le solliciter plus souvent.
  const [trophees, ranked] = await Promise.all([getFamilyTrophees(), getFamilyRanked()]);
  if (!trophees || trophees.length === 0) return [];

  const eloByTag = new Map<string, number>();
  if (ranked) {
    for (const [tag, p] of Object.entries(ranked.players)) {
      eloByTag.set(tag, p.ranked_pts);
    }
  }

  return trophees
    .slice()
    .sort((a, b) => b.trophies - a.trophies)
    .map((p, i) => ({
      rank: i + 1,
      tag: p.tag,
      name: p.name,
      club: p.club,
      trophies: formatNumber(p.trophies),
      elo: eloByTag.get(p.tag),
      color: colorFromSeed(p.tag),
    }));
}

// "Pusher" = qui gagne le plus de trophées CETTE saison (delta), pas qui a
// le plus de trophées au total — d'où la source /api/famille/evolution
// (même donnée que la commande !evo côté bot), pas le classement absolu.
// Sans limite : classement complet de la saison en cours (équivalent web
// de !evo, qui affiche le podium + la liste paginée de tous les membres).
export async function getSeasonTopPushers(limit?: number): Promise<Player[]> {
  const evolution = await getFamilyEvolution();
  if (!evolution || evolution.players.length === 0) return [];

  const sorted = evolution.players.slice().sort((a, b) => b.delta - a.delta);
  const sliced = limit ? sorted.slice(0, limit) : sorted;

  return sliced.map((p, i) => ({
    rank: i + 1,
    tag: p.tag,
    name: p.name,
    club: p.club,
    trophies: `${p.delta >= 0 ? "+" : ""}${formatNumber(p.delta)}`,
    color: colorFromSeed(p.tag),
  }));
}

async function buildRankedLeaderboard(): Promise<RankedPlayer[] | null> {
  const ranked = await getFamilyRanked();
  if (!ranked || Object.keys(ranked.players).length === 0) return null;

  return Object.entries(ranked.players)
    .map(([tag, p]) => ({ tag, ...p }))
    .sort((a, b) => (b.ranked_pts ?? 0) - (a.ranked_pts ?? 0))
    .map((p, i) => ({
      rank: i + 1,
      tag: p.tag,
      name: p.name,
      club: p.club,
      tier: p.ranked_tier,
      elo: p.ranked_pts,
      color: colorFromSeed(p.tag),
    }));
}

export async function getRankedLeaderboard(limit?: number): Promise<RankedPlayer[]> {
  const source = (await buildRankedLeaderboard()) ?? [];
  return limit ? source.slice(0, limit) : source;
}

// Record all-time de points classés (HighestRankedPoints côté api.rnt.dev),
// pas un classement de saison — pas d'équivalent en démo, on retombe juste
// sur une liste vide si l'API n'a pas encore synchronisé ces valeurs.
async function buildAllTimeRankedLeaderboard(): Promise<RankedPlayer[] | null> {
  const ranked = await getFamilyRanked();
  if (!ranked) return null;

  const withPeak = Object.entries(ranked.players).filter(([, p]) => p.highest_ranked_pts != null);
  if (withPeak.length === 0) return null;

  return withPeak
    .map(([tag, p]) => ({ tag, ...p }))
    // Trié par index de palier officiel d'abord (fiable même quand le score
    // brut n'est pas comparable — record fait sous l'ancien système Ranked,
    // voir highest_ranked_rank sur ApiRankedPlayer), score en départage.
    .sort((a, b) => {
      const rankDiff = (b.highest_ranked_rank ?? -1) - (a.highest_ranked_rank ?? -1);
      if (rankDiff !== 0) return rankDiff;
      return (b.highest_ranked_pts ?? 0) - (a.highest_ranked_pts ?? 0);
    })
    .map((p, i) => ({
      rank: i + 1,
      tag: p.tag,
      name: p.name,
      club: p.club,
      tier: p.highest_ranked_tier ?? "",
      elo: p.highest_ranked_pts ?? 0,
      color: colorFromSeed(p.tag),
    }));
}

export async function getAllTimeRankedLeaderboard(): Promise<RankedPlayer[]> {
  return (await buildAllTimeRankedLeaderboard()) ?? [];
}

export async function getHomeRankedPreview(): Promise<RankedPlayer[]> {
  const real = await buildRankedLeaderboard();
  return real ? real.slice(0, 5) : [];
}

export type CommunityStats = {
  totalTrophies: string;
  activePlayers: number;
  bestElo: number | null;
  bestEloTier: string | null;
  clubCount: number;
  topPusher: { name: string; trophies: string } | null;
};

// null si le bot n'a pas encore synchronisé clans/trophées — chaque champ
// individuel (élo, pusher) reste nullable même quand le reste est
// disponible, ce cache-là pouvant se remplir séparément des autres.
export async function getCommunityStats(): Promise<CommunityStats | null> {
  const [clans, trophees, ranked, evolution] = await Promise.all([
    getFamilyClans(),
    getFamilyTrophees(),
    getFamilyRanked(),
    getFamilyEvolution(),
  ]);

  if (!clans || clans.length === 0 || !trophees) return null;

  const totalTrophies = trophees.reduce((sum, p) => sum + (p.trophies ?? 0), 0);

  let bestElo: number | null = null;
  let bestEloTier: string | null = null;
  if (ranked && Object.keys(ranked.players).length > 0) {
    const top = Object.values(ranked.players).sort((a, b) => b.ranked_pts - a.ranked_pts)[0];
    bestElo = top.ranked_pts;
    bestEloTier = top.ranked_tier;
  }

  // "Meilleur pusher" = plus grosse progression de trophées cette saison
  // (même donnée que !evo), pas le plus gros total de trophées.
  let topPusher: { name: string; trophies: string } | null = null;
  if (evolution && evolution.players.length > 0) {
    const top = evolution.players.slice().sort((a, b) => b.delta - a.delta)[0];
    topPusher = { name: top.name, trophies: `${top.delta >= 0 ? "+" : ""}${formatNumber(top.delta)}` };
  }

  return {
    totalTrophies: formatNumber(totalTrophies),
    activePlayers: trophees.length,
    bestElo,
    bestEloTier,
    clubCount: clans.length,
    topPusher,
  };
}

function admissionTypeLabel(type: string): string {
  switch (type) {
    case "inviteOnly":
      return "Sur invitation";
    case "closed":
      return "Fermé";
    default:
      return "Ouvert à tous";
  }
}

export type ClubDetail = {
  name: string;
  tag: string;
  slug: string;
  description: string;
  typeLabel: string;
  requiredTrophies: string;
  trophies: string;
  memberCount: number;
  isFlagship: boolean;
  roster: { rank: number; tag: string; name: string; trophies: string; role: ApiClubRole; color: string }[];
  // false si la fiche détaillée (description/rôles) n'a pas encore été
  // synchronisée côté bot — arrive juste après un déploiement, le temps
  // que sync_trophy_history tourne une première fois.
  synced: boolean;
};

export async function getClubDetail(slug: string): Promise<ClubDetail | null> {
  const clubs = await getFamilyClubs();
  const club = clubs.find((c) => c.slug === slug);
  if (!club) return null;

  const rawTag = club.tag.replace(/^#/, "");
  const detail = await getFamilyClanDetail(rawTag);

  if (!detail) {
    return {
      name: club.name,
      tag: club.tag,
      slug: club.slug,
      description: "",
      typeLabel: "",
      requiredTrophies: "",
      trophies: club.trophies,
      memberCount: club.memberCount,
      isFlagship: club.isFlagship,
      roster: [],
      synced: false,
    };
  }

  const roster = detail.members
    .slice()
    .sort((a, b) => b.trophies - a.trophies)
    .map((m, i) => ({
      rank: i + 1,
      tag: m.tag,
      name: m.name,
      trophies: formatNumber(m.trophies),
      role: m.role,
      color: colorFromSeed(m.tag),
    }));

  return {
    name: club.name,
    tag: club.tag,
    slug: club.slug,
    description: detail.description,
    typeLabel: admissionTypeLabel(detail.type),
    requiredTrophies: formatNumber(detail.requiredTrophies),
    trophies: formatNumber(detail.trophies),
    memberCount: detail.members.length,
    isFlagship: club.isFlagship,
    roster,
    synced: true,
  };
}

export type CurrentSeasonProgress = { topClubTrophies: string; topPlayer: string; topPlayerDelta: string };

export async function getCurrentSeasonProgress(): Promise<CurrentSeasonProgress | null> {
  const evolution = await getFamilyEvolution();
  if (!evolution || evolution.players.length === 0) return null;

  const totalDelta = evolution.players.reduce((sum, p) => sum + p.delta, 0);
  const topMover = evolution.players.slice().sort((a, b) => b.delta - a.delta)[0];

  return {
    topClubTrophies: formatNumber(totalDelta),
    topPlayer: topMover.name,
    topPlayerDelta: `${topMover.delta >= 0 ? "+" : ""}${formatNumber(topMover.delta)}`,
  };
}

const MONTH_NAMES = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

function monthLabel(month: string): string {
  const [year, m] = month.split("-").map(Number);
  const name = MONTH_NAMES[(m ?? 1) - 1] ?? month;
  return `${name} ${year}`;
}

// Représente "maintenant" avec les champs calendaires de l'heure de Paris
// (le fuseau utilisé par le bot pour check_bs_season), mais stockés comme
// s'ils étaient UTC — pratique pour faire de l'arithmétique de calendrier
// sans se soucier de l'heure d'été/hiver à chaque étape.
function parisWallClock(date: Date): Date {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
  return new Date(
    Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second"))
  );
}

// 1er jeudi du mois à 10h, dans le référentiel "heure murale de Paris" ci-dessus.
function firstThursday10(year: number, monthIndex: number): Date {
  const d = new Date(Date.UTC(year, monthIndex, 1, 10, 0, 0));
  const offset = (4 - d.getUTCDay() + 7) % 7; // 4 = jeudi
  d.setUTCDate(1 + offset);
  return d;
}

function nextSeasonReset(fromWallClock: Date): Date {
  let year = fromWallClock.getUTCFullYear();
  let month = fromWallClock.getUTCMonth();
  for (let i = 0; i < 4; i++) {
    const candidate = firstThursday10(year, month);
    if (candidate.getTime() > fromWallClock.getTime()) return candidate;
    month += 1;
    if (month > 11) {
      month = 0;
      year += 1;
    }
  }
  return firstThursday10(year, month);
}

function formatCountdown(ms: number): string {
  const totalHours = Math.max(0, Math.round(ms / (1000 * 60 * 60)));
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  return `Encore ${days}j ${hours}h`;
}

export async function getCurrentSeasonInfo(): Promise<{ label: string; timeLeft: string } | null> {
  const evolution = await getFamilyEvolution();
  if (!evolution || !evolution.season_month) return null;

  const now = parisWallClock(new Date());
  const reset = nextSeasonReset(now);

  return {
    label: monthLabel(evolution.season_month),
    timeLeft: formatCountdown(reset.getTime() - now.getTime()),
  };
}

export type SeasonArchiveSummary = {
  id: string;
  label: string;
  topPlayer: string;
  topPlayerDelta: string;
};

// null si aucune saison n'a encore été archivée côté bot (pas de faux
// historique affiché dans ce cas — voir décision du 2026-07-21).
export async function getSeasonHistory(): Promise<SeasonArchiveSummary[] | null> {
  const months = await getFamilySaisons();
  if (!months || months.length === 0) return null;

  const archives = await Promise.all(
    months.map(async (month) => ({ month, archive: await getFamilySeasonArchive(month) }))
  );

  return archives
    .filter((a) => a.archive)
    .map(({ month, archive }) => {
      const entries = Object.values(archive!);
      const topMover = entries.slice().sort((a, b) => b.delta - a.delta)[0];
      return {
        id: month,
        label: monthLabel(month),
        topPlayer: topMover?.name ?? "—",
        topPlayerDelta: topMover ? `${topMover.delta >= 0 ? "+" : ""}${formatNumber(topMover.delta)}` : "",
      };
    })
    .sort((a, b) => (a.id < b.id ? 1 : -1));
}

export type PlayerProfile = {
  tag: string;
  name: string;
  club: string | null;
  clubSlug: string | null;
  role: ApiClubRole | null;
  trophies: number;
  rankedPts: number | null;
  rankedTier: string | null;
  highestRankedPts: number | null;
  highestRankedTier: string | null;
  duel1v1: { points: number; wins: number; losses: number; tier: string } | null;
  casinoCoins: number | null;
  victories3v3: number | null;
  victoriesSolo: number | null;
  victoriesDuo: number | null;
  expLevel: number | null;
  isStaff: boolean;
  isAdmin: boolean;
  discordLinked: boolean;
  bio: string | null;
  // Progression de trophées depuis le début de la saison en cours (même
  // donnée que !evo / la page Pusheurs) — null si le joueur n'a pas encore
  // de point enregistré cette saison.
  seasonPushDelta: string | null;
  seasonPushRank: number | null;
  color: string;
};

// null si ce tag n'a jamais été synchronisé (jamais membre d'un des clans
// suivis par le bot) — voir /joueurs/[tag]/page.tsx qui appelle notFound()
// dans ce cas.
export async function getPlayerProfile(tag: string): Promise<PlayerProfile | null> {
  const clean = tag.replace(/^#/, "").toUpperCase();
  const [data, clans, evolution] = await Promise.all([
    getFamilyJoueur(clean),
    getFamilyClans(),
    getFamilyEvolution(),
  ]);
  if (!data) return null;

  const { isStaff, isAdmin } = await getDiscordBadge(data.discord_id);
  const clubSlug = data.club ? (clans?.find((c) => c.name === data.club)?.slug ?? null) : null;

  let seasonPushDelta: string | null = null;
  let seasonPushRank: number | null = null;
  if (evolution && evolution.players.length > 0) {
    const sorted = evolution.players.slice().sort((a, b) => b.delta - a.delta);
    const idx = sorted.findIndex((p) => p.tag === clean);
    if (idx !== -1) {
      const p = sorted[idx];
      seasonPushDelta = `${p.delta >= 0 ? "+" : ""}${formatNumber(p.delta)}`;
      seasonPushRank = idx + 1;
    }
  }

  return {
    tag: data.tag,
    name: data.name,
    club: data.club,
    clubSlug,
    role: data.role as ApiClubRole | null,
    trophies: data.trophies,
    rankedPts: data.ranked_pts,
    rankedTier: data.ranked_tier,
    highestRankedPts: data.highest_ranked_pts,
    highestRankedTier: data.highest_ranked_tier,
    duel1v1: data.duel_1v1,
    casinoCoins: data.casino_coins,
    victories3v3: data.victories_3v3,
    victoriesSolo: data.victories_solo,
    victoriesDuo: data.victories_duo,
    expLevel: data.exp_level,
    isStaff,
    isAdmin,
    discordLinked: !!data.discord_id,
    bio: data.bio,
    seasonPushDelta,
    seasonPushRank,
    color: colorFromSeed(data.tag),
  };
}

export type NewsItem = {
  icon: ApiNewsItem["icon"];
  title: string;
  description: string;
  time: string;
};

// [] si le bot n'est pas joignable ou qu'aucune actualité n'a encore été
// publiée — plus de fausses actus par défaut (voir décision du 22/07/2026).
export async function getFamilyNews(limit?: number): Promise<NewsItem[]> {
  const items = await getFamilyActualites(limit);
  if (!items) return [];
  return items.map((n) => ({
    icon: n.icon,
    title: n.title,
    description: n.description,
    time: formatRelativeTime(n.created_at),
  }));
}
