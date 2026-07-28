// Client pour l'API famille exposée par le bot (voir SITE_FAMILLE_BS_CONTEXT.md).
// Fetch côté serveur uniquement (Server Components) — jamais depuis le
// navigateur. Chaque fonction renvoie `null` en cas d'échec/timeout plutôt
// que de faire planter le rendu de la page ; les appelants retombent alors
// sur les données de démo.

const API_BASE = process.env.BS_API_URL;
const TIMEOUT_MS = 5000;
// Rafraîchissement par défaut de toutes les données du site — 30 min
// (demande du 22/07/2026). Le rôle Discord de la personne connectée est
// l'exception explicite : voir REVALIDATE_REALTIME sur getDiscordMember.
const REVALIDATE_DEFAULT = 1800;
const REVALIDATE_REALTIME = 0;
// Pusheurs/évolution de saison — fenêtre plus courte que le reste du site
// (demande du 26/07/2026, suite à un cache figé constaté sur /pusheurs).
const REVALIDATE_EVOLUTION = 900;

export type ApiClan = { tag: string; name: string; slug: string; alias: string };

export type ApiTrophyEntry = {
  tag: string;
  name: string;
  club: string | null;
  trophies: number;
  date: string;
};

export type ApiRankedPlayer = {
  name: string;
  club: string | null;
  ranked_pts: number;
  ranked_tier: string;
  highest_ranked_pts: number | null;
  highest_ranked_tier: string | null;
  // Index de palier officiel — clé de tri fiable pour le classement all-time
  // (voir buildAllTimeRankedLeaderboard dans lib/family.ts), contrairement à
  // highest_ranked_pts qui n'est pas comparable pour les vieux records.
  highest_ranked_rank: number | null;
};

export type ApiRanked = {
  players: Record<string, ApiRankedPlayer>;
  updated_at: string | null;
};

export type ApiClubRole = "member" | "senior" | "vicePresident" | "president";

export type ApiClubDetail = {
  name: string;
  description: string;
  type: "open" | "inviteOnly" | "closed";
  requiredTrophies: number;
  trophies: number;
  members: { tag: string; name: string; trophies: number; role: ApiClubRole }[];
};

export type ApiEvolutionEntry = {
  tag: string;
  name: string;
  club: string | null;
  start: number;
  end: number;
  delta: number;
};

export type ApiEvolution = {
  season_month: string | null;
  season_start_date: string | null;
  players: ApiEvolutionEntry[];
};

async function getJson<T>(
  path: string,
  options?: { headers?: Record<string, string>; revalidate?: number }
): Promise<T | null> {
  if (!API_BASE) return null;
  const { headers, revalidate = REVALIDATE_DEFAULT } = options ?? {};
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
    const res = await fetch(`${API_BASE}${path}`, {
      signal: controller.signal,
      next: { revalidate },
      headers,
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export function getFamilyClans() {
  return getJson<ApiClan[]>("/api/famille/clans");
}

// Signal global "le bot répond" pour la bannière de données de démo (voir
// DemoDataBanner) — même endpoint et même cache que getFamilyClans, pas
// d'appel réseau supplémentaire pour les pages qui l'appellent déjà.
export async function isBotReachable(): Promise<boolean> {
  const clans = await getFamilyClans();
  return !!clans && clans.length > 0;
}

export function getFamilyTrophees() {
  return getJson<ApiTrophyEntry[]>("/api/famille/trophees");
}

export function getFamilyRanked() {
  return getJson<ApiRanked>("/api/famille/ranked");
}

export function getFamilyClanDetail(tag: string) {
  return getJson<ApiClubDetail>(`/api/famille/clan/${encodeURIComponent(tag)}`);
}

export function getFamilyEvolution() {
  return getJson<ApiEvolution>("/api/famille/evolution", { revalidate: REVALIDATE_EVOLUTION });
}

export function getFamilySaisons() {
  return getJson<string[]>("/api/famille/saisons");
}

export type ApiNewsItem = {
  id: number;
  icon: "skull" | "shield" | "message" | "trophy";
  title: string;
  description: string;
  author: string | null;
  created_at: string;
};

export function getFamilyActualites(limit?: number) {
  return getJson<ApiNewsItem[]>(`/api/famille/actualites${limit ? `?limit=${limit}` : ""}`);
}

export type ApiSeasonArchive = Record<
  string,
  { name: string; club: string | null; start: number; end: number; delta: number }
>;

export function getFamilySeasonArchive(month: string) {
  return getJson<ApiSeasonArchive>(`/api/famille/evolution/${encodeURIComponent(month)}`);
}

export type Api1v1Player = { name: string; tag: string | null; points: number; wins: number; losses: number; tier: string };

export function getFamilyClassement1v1() {
  return getJson<Api1v1Player[]>("/api/famille/classement_1v1");
}

export type ApiPlayerProfile = {
  tag: string;
  name: string;
  club: string | null;
  role: ApiClubRole | null;
  trophies: number;
  ranked_pts: number | null;
  ranked_tier: string | null;
  highest_ranked_pts: number | null;
  highest_ranked_tier: string | null;
  highest_ranked_rank: number | null;
  duel_1v1: { points: number; wins: number; losses: number; tier: string } | null;
  casino_coins: number | null;
  victories_3v3: number | null;
  victories_solo: number | null;
  victories_duo: number | null;
  exp_level: number | null;
  discord_id: string | null;
  bio: string | null;
};

export function getFamilyJoueur(tag: string) {
  return getJson<ApiPlayerProfile>(`/api/famille/joueur/${encodeURIComponent(tag)}`);
}

export type ApiCasinoPlayer = { name: string; tag: string | null; coins: number };

export function getFamilyClassementCasino() {
  return getJson<ApiCasinoPlayer[]>("/api/famille/classement_casino");
}

// Miroir des rôles Discord (voir supabase/003_discord_members.sql côté bot)
// — pilote les niveaux d'accès du site, voir lib/access.ts. `null` veut dire
// soit l'API est injoignable, soit cet ID n'est pas (plus) membre du serveur
// Discord — les deux cas se traitent pareil ici (retombe sur "invité").
export type ApiDiscordMember = { role_ids: string[]; is_admin: boolean; bs_linked: boolean; bs_tag: string | null };

function internalHeaders(): Record<string, string> | undefined {
  const secret = process.env.INTERNAL_API_SECRET;
  return secret ? { "X-Internal-Secret": secret } : undefined;
}

// Le rôle de la personne connectée pilote les vues membre/staff/admin —
// jamais mis en cache, revérifié à chaque requête (demande du 22/07/2026),
// contrairement au reste des données du site.
export function getDiscordMember(discordId: string) {
  return getJson<ApiDiscordMember>(`/api/member/${encodeURIComponent(discordId)}`, {
    headers: internalHeaders(),
    revalidate: REVALIDATE_REALTIME,
  });
}

// Panel staff (voir lib/access.ts) — arrivées récentes, journal d'audit de
// modération, signalements. Même protection par secret partagé que
// getDiscordMember.
export type ModerationAction =
  | "warn"
  | "mute"
  | "ban"
  | "silence"
  | "punition"
  | "punition_fin"
  | "morse"
  | "morse_fin"
  | "casino_ban"
  | "casino_unban";

export type ApiModerationEntry = {
  action: ModerationAction;
  target_id: string;
  target_name: string;
  moderator: string;
  reason: string | null;
  extra: string | null;
  timestamp: string;
};

export type ApiStaffPanel = {
  recent_members: { name: string; joined_at: string }[];
  moderation_log: ApiModerationEntry[];
  reports: { target: string; reporter: string; reason: string; created_at: string; resolved: boolean }[];
};

export function getStaffPanel() {
  return getJson<ApiStaffPanel>("/api/staff/panel", { headers: internalHeaders() });
}

// Transcript d'un ticket fermé (voir /staff/tickets/[id]) — même protection
// par secret partagé que getStaffPanel.
export type ApiTicketMessage = { author: string; avatar_url: string | null; content: string; created_at: string };

export type ApiTicket = {
  id: number;
  discord_id: string;
  bs_tag: string | null;
  category: string;
  description: string;
  channel_id: string;
  status: "open" | "closed";
  claimed_by: string | null;
  closed_by: string | null;
  close_reason: string | null;
  transcript: ApiTicketMessage[] | null;
  created_at: string;
  closed_at: string | null;
};

export function getTicket(id: string) {
  return getJson<ApiTicket>(`/api/tickets/${encodeURIComponent(id)}`, { headers: internalHeaders() });
}

// Notes internes staff sur les membres d'un club (voir MemberNoteField) —
// même protection par secret partagé que getStaffPanel, le site ne les
// demande de toute façon que pour un viewer déjà vérifié staff/admin de ce club.
export type ApiMemberNote = { note: string; updated_by: string; updated_at: string };

export function getFamilyMemberNotes(slug: string) {
  return getJson<Record<string, ApiMemberNote>>(`/api/famille/notes/${encodeURIComponent(slug)}`, {
    headers: internalHeaders(),
  });
}
