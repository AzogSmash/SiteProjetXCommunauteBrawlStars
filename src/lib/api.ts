// Client pour l'API famille exposée par le bot (voir SITE_FAMILLE_BS_CONTEXT.md).
// Fetch côté serveur uniquement (Server Components) — jamais depuis le
// navigateur. Chaque fonction renvoie `null` en cas d'échec/timeout total
// (bot injoignable ET aucune valeur récupérable en repli, voir
// lastGoodCache ci-dessous) plutôt que de faire planter le rendu de la
// page ; les appelants affichent alors un état "pas de données" (voir
// DataUnavailable), plus de données de démo depuis le 23/07/2026.

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
// Meilleurs builds — le cache de fetch de Next.js/Vercel survit aux
// redéploiements (contrairement à ce qu'on pourrait croire), donc un simple
// push après un nouvel ajout ne suffit pas à le rafraîchir : fenêtre courte
// plutôt que d'attendre 30 min ou de forcer un déploiement à chaque lot de
// builds ajouté (constaté le 19/08/2026).
const REVALIDATE_BEST_BUILDS = 300;

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

// Repli en mémoire (par instance serverless) sur la dernière réponse réussie
// par route, servie si le bot est injoignable plutôt que d'afficher "pas de
// données" alors qu'on a déjà une valeur récente. Nécessaire avec ce build
// de Next.js : contrairement au comportement "classique", une entrée de
// cache stale déclenche un vrai refetch en direct (voir fetch.md, section
// options.cache) — si ce refetch échoue (bot down), tout échoue, aucun
// repli automatique sur l'ancienne valeur. Limite assumée : une instance
// qui vient de démarrer (cold start Vercel) n'a rien à proposer avant son
// premier fetch réussi. Demande du 24/08/2026, suite à un crash-loop du
// bot où le site n'affichait plus rien du tout pendant l'incident.
const lastGoodCache = new Map<string, unknown>();

async function getJson<T>(
  path: string,
  options?: { headers?: Record<string, string>; revalidate?: number; fallback?: boolean }
): Promise<T | null> {
  if (!API_BASE) return null;
  const { headers, revalidate = REVALIDATE_DEFAULT, fallback = true } = options ?? {};
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
    const res = await fetch(`${API_BASE}${path}`, {
      signal: controller.signal,
      next: { revalidate },
      headers,
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as T;
    if (fallback) lastGoodCache.set(path, data);
    return data;
  } catch {
    return fallback ? ((lastGoodCache.get(path) as T | undefined) ?? null) : null;
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

export type ApiBestBuild = {
  brawler_slug: string;
  brawler_name: string;
  comment: string;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
};

export function getFamilyBestBuilds() {
  return getJson<ApiBestBuild[]>("/api/famille/best_builds", { revalidate: REVALIDATE_BEST_BUILDS });
}

export type ApiSeasonArchive = Record<
  string,
  { name: string; club: string | null; start: number; end: number; delta: number }
>;

export function getFamilySeasonArchive(month: string) {
  return getJson<ApiSeasonArchive>(`/api/famille/evolution/${encodeURIComponent(month)}`);
}

export type Api1v1Player = { name: string; tag: string | null; points: number; wins: number; losses: number; tier: string };

export function getFamilyClassement1v1(mois?: string) {
  return getJson<Api1v1Player[]>(`/api/famille/classement_1v1${mois ? `?mois=${encodeURIComponent(mois)}` : ""}`);
}

export function getFamily1v1Saisons() {
  return getJson<string[]>("/api/famille/saisons_1v1");
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

export function getFamilyClassementCasino(mois?: string) {
  return getJson<ApiCasinoPlayer[]>(`/api/famille/classement_casino${mois ? `?mois=${encodeURIComponent(mois)}` : ""}`);
}

export function getFamilyCasinoSaisons() {
  return getJson<string[]>("/api/famille/saisons_casino");
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
// contrairement au reste des données du site. fallback:false volontaire :
// servir un ancien statut admin/staff pendant une panne du bot pourrait
// accorder ou retirer un accès à tort (voir lastGoodCache plus haut).
export function getDiscordMember(discordId: string) {
  return getJson<ApiDiscordMember>(`/api/member/${encodeURIComponent(discordId)}`, {
    headers: internalHeaders(),
    revalidate: REVALIDATE_REALTIME,
    fallback: false,
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

// discordId requis depuis le 17/08/2026 : le bot vérifie maintenant l'accès
// lui-même (les tickets "incident" sont réservés au staff Discord, voir
// _is_incident_staff côté bot) plutôt que de ne dépendre que du check de
// tier fait par la page appelante.
export function getTicket(id: string, discordId: string) {
  return getJson<ApiTicket>(
    `/api/tickets/${encodeURIComponent(id)}?discord_id=${encodeURIComponent(discordId)}`,
    { headers: internalHeaders() }
  );
}

// État économie (pause casino / freeze crypto) pour le panel admin — même
// protection par secret partagé que getStaffPanel, jamais mis en cache
// (l'admin doit voir l'état réel juste après avoir cliqué un bouton).
export type ApiEconomyStatus = { casino_paused: boolean; crypto_market_frozen: boolean };

export function getAdminEconomyStatus() {
  return getJson<ApiEconomyStatus>("/api/admin/economy/status", { headers: internalHeaders(), revalidate: REVALIDATE_REALTIME });
}

// Tickets ouverts pour l'onglet Tickets du panel staff/admin — discordId
// sert à la vérification staff côté bot (voir _require_ticket_staff),
// jamais mis en cache pour la même raison que getAdminEconomyStatus.
export type ApiTicketSummary = {
  id: number;
  discord_id: string;
  bs_tag: string | null;
  category: string;
  description: string;
  channel_id: string;
  status: "open" | "closed";
  claimed_by: string | null;
  created_at: string;
};

export function getAdminTickets(discordId: string) {
  return getJson<ApiTicketSummary[]>(`/api/admin/tickets?discord_id=${encodeURIComponent(discordId)}`, {
    headers: internalHeaders(),
    revalidate: REVALIDATE_REALTIME,
  });
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
