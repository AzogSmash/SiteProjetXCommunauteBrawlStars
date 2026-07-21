// Client pour l'API famille exposée par le bot (voir SITE_FAMILLE_BS_CONTEXT.md).
// Fetch côté serveur uniquement (Server Components) — jamais depuis le
// navigateur. Chaque fonction renvoie `null` en cas d'échec/timeout plutôt
// que de faire planter le rendu de la page ; les appelants retombent alors
// sur les données de démo.

const API_BASE = process.env.BS_API_URL;
const TIMEOUT_MS = 5000;

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

async function getJson<T>(path: string, headers?: Record<string, string>): Promise<T | null> {
  if (!API_BASE) return null;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
    const res = await fetch(`${API_BASE}${path}`, {
      signal: controller.signal,
      next: { revalidate: 60 },
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
  return getJson<ApiEvolution>("/api/famille/evolution");
}

export function getFamilySaisons() {
  return getJson<string[]>("/api/famille/saisons");
}

export type ApiSeasonArchive = Record<
  string,
  { name: string; club: string | null; start: number; end: number; delta: number }
>;

export function getFamilySeasonArchive(month: string) {
  return getJson<ApiSeasonArchive>(`/api/famille/evolution/${encodeURIComponent(month)}`);
}

export type Api1v1Player = { name: string; points: number; wins: number; losses: number; tier: string };

export function getFamilyClassement1v1() {
  return getJson<Api1v1Player[]>("/api/famille/classement_1v1");
}

export type ApiCasinoPlayer = { name: string; coins: number };

export function getFamilyClassementCasino() {
  return getJson<ApiCasinoPlayer[]>("/api/famille/classement_casino");
}

// Miroir des rôles Discord (voir supabase/003_discord_members.sql côté bot)
// — pilote les niveaux d'accès du site, voir lib/access.ts. `null` veut dire
// soit l'API est injoignable, soit cet ID n'est pas (plus) membre du serveur
// Discord — les deux cas se traitent pareil ici (retombe sur "invité").
export type ApiDiscordMember = { role_ids: string[]; is_admin: boolean };

function internalHeaders(): Record<string, string> | undefined {
  const secret = process.env.INTERNAL_API_SECRET;
  return secret ? { "X-Internal-Secret": secret } : undefined;
}

export function getDiscordMember(discordId: string) {
  return getJson<ApiDiscordMember>(`/api/member/${encodeURIComponent(discordId)}`, internalHeaders());
}

// Panel staff (voir lib/access.ts) — arrivées récentes, avertissements,
// signalements. Même protection par secret partagé que getDiscordMember.
export type ApiStaffPanel = {
  recent_members: { name: string; joined_at: string }[];
  warns: { user_id: string; reason: string; moderator: string; timestamp: string }[];
  reports: { target: string; reporter: string; reason: string; created_at: string; resolved: boolean }[];
};

export function getStaffPanel() {
  return getJson<ApiStaffPanel>("/api/staff/panel", internalHeaders());
}
