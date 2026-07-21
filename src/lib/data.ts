export const navLinks = [
  { label: "Accueil", href: "/" },
  { label: "Clubs", href: "/clubs" },
  { label: "Joueurs", href: "/joueurs" },
  { label: "Saisons", href: "/saisons" },
  { label: "Ranked", href: "/ranked" },
  { label: "Actualités", href: "/actualites" },
];

export const communityDescription =
  "Projet X est une communauté Brawl Stars qui regroupe plusieurs clubs compétitifs, unis autour de la performance, l'esprit d'équipe et la progression continue.";

export const discordInviteUrl = "https://discord.gg/GrkKPFSBX9";

// Données réelles communiquées via `!bs_famille liste` sur Discord (5 des 7
// clans de la famille — 2 restent à ajouter). Le classement complet passera
// par l'API (/api/famille/clans) une fois le site branché dessus.
export const heroStats = {
  totalTrophies: "14.181.276", // somme des 5 clans connus, augmentera avec les 2 restants
  activePlayers: 145, // somme des membres des 5 clans connus
  bestElo: 2867,
  bestEloTier: "LÉGENDAIRE",
  currentSeason: "Saison 25",
  seasonTimeLeft: "Encore 18j 6h",
};

// Les 2 clans restants seront ajoutés ici une fois configurés côté bot.
export const familyClubs = [
  { rank: 1, slug: "projet-x", tag: "822CL00PG", name: "Projet X", trophies: "3.995.936", memberCount: 30, isFlagship: true },
  { rank: 2, slug: "projet-y", tag: "U02RL0LQ", name: "Projet Y", trophies: "3.425.575", memberCount: 30, color: "#38bdf8" },
  { rank: 3, slug: "projet-delta", tag: "U28UGUQR", name: "Projet Δ", trophies: "2.805.040", memberCount: 30, color: "#f472b6" },
  { rank: 4, slug: "projet-z", tag: "U0P2RYPQ", name: "Projet Z", trophies: "2.707.868", memberCount: 27, color: "#facc15" },
  { rank: 5, slug: "projet-s", tag: "2QCGVYPLR", name: "Projet S", trophies: "1.246.857", memberCount: 28, color: "#4ade80" },
];

export const topPushers = [
  { rank: 1, name: "Kaio", trophies: "123.450", color: "#f97316" },
  { rank: 2, name: "Symantec", trophies: "119.870", color: "#f472b6" },
  { rank: 3, name: "LeNain", trophies: "118.562", color: "#38bdf8" },
  { rank: 4, name: "Flay", trophies: "116.321", color: "#a78bfa" },
  { rank: 5, name: "Nytro", trophies: "115.009", color: "#fb923c" },
];

export type EloTier =
  | "LÉGENDAIRE"
  | "MYTHIQUE III"
  | "MYTHIQUE II"
  | "MYTHIQUE I"
  | "DIAMANT III"
  | "DIAMANT II"
  | "DIAMANT I";

export const eloRanking: { rank: number; name: string; tier: EloTier; elo: number; color: string }[] = [
  { rank: 1, name: "Kaio", tier: "LÉGENDAIRE", elo: 2867, color: "#f97316" },
  { rank: 2, name: "Symantec", tier: "LÉGENDAIRE", elo: 2841, color: "#f472b6" },
  { rank: 3, name: "LeNain", tier: "LÉGENDAIRE", elo: 2793, color: "#38bdf8" },
  { rank: 4, name: "Flay", tier: "LÉGENDAIRE", elo: 2765, color: "#a78bfa" },
  { rank: 5, name: "Nytro", tier: "LÉGENDAIRE", elo: 2732, color: "#fb923c" },
  { rank: 6, name: "Silver", tier: "MYTHIQUE III", elo: 2598, color: "#c084fc" },
  { rank: 7, name: "Skyzz", tier: "MYTHIQUE II", elo: 2487, color: "#f472b6" },
  { rank: 8, name: "Drax", tier: "MYTHIQUE II", elo: 2451, color: "#38bdf8" },
  { rank: 9, name: "Ryu", tier: "MYTHIQUE I", elo: 2398, color: "#fbbf24" },
  { rank: 10, name: "Azox", tier: "MYTHIQUE I", elo: 2346, color: "#a78bfa" },
  { rank: 11, name: "Zeno", tier: "MYTHIQUE I", elo: 2312, color: "#4ade80" },
  { rank: 12, name: "Nexxo", tier: "MYTHIQUE I", elo: 2287, color: "#f472b6" },
  { rank: 13, name: "Volt", tier: "MYTHIQUE I", elo: 2256, color: "#38bdf8" },
  { rank: 14, name: "Mowgli", tier: "DIAMANT III", elo: 2087, color: "#fb923c" },
  { rank: 15, name: "Bayo", tier: "DIAMANT III", elo: 2054, color: "#a78bfa" },
];

export const news = [
  {
    icon: "skull" as const,
    title: "Victoire en Ranked !",
    description: "PROJET X atteint le rang Légendaire avec 2867 elo.",
    time: "il y a 2h",
  },
  {
    icon: "shield" as const,
    title: "Fin de saison 24",
    description: "Top 10 FR en clubs. Bravo à tous !",
    time: "il y a 1j",
  },
  {
    icon: "message" as const,
    title: "Recrutement ouvert",
    description: "Rejoins l'aventure PROJET X. Postule dès maintenant !",
    time: "il y a 2j",
  },
];

export const allNews = [
  ...news,
  {
    icon: "trophy" as const,
    title: "Nouveau record de trophées",
    description: "Le club dépasse les 12,8M de trophées cumulés, un nouveau record pour PROJET X.",
    time: "il y a 4j",
  },
  {
    icon: "skull" as const,
    title: "Kaio passe la barre des 120k",
    description: "Notre meilleur pusher franchit les 120.000 trophées personnels ce mois-ci.",
    time: "il y a 6j",
  },
  {
    icon: "shield" as const,
    title: "Tournoi interne du mois",
    description: "Bracket 1v1 lancé sur le serveur Discord, inscriptions ouvertes jusqu'à vendredi.",
    time: "il y a 9j",
  },
  {
    icon: "message" as const,
    title: "Mise à jour du règlement du club",
    description: "Quota d'activité hebdomadaire ajusté pour la saison 25, détails sur le Discord.",
    time: "il y a 12j",
  },
];

// Repli démo pour la fiche club phare, utilisé seulement si le cache de
// détail du bot (description/type/trophées requis) n'est pas encore prêt.
export const flagshipClub = {
  name: "Projet X",
  description:
    "Projet X est le club phare de notre communauté Brawl Stars, axé sur la performance, l'esprit d'équipe et la progression continue. Nous recrutons des joueurs actifs, motivés et prêts à pousser ensemble.",
  requiredTrophies: "60.000+",
  type: "Sur invitation",
};

export const clubRoster: {
  rank: number;
  name: string;
  role: "president" | "vicePresident" | "senior" | "member";
  trophies: string;
  elo: number;
  color: string;
}[] = [
  { rank: 1, name: "Kaio", role: "president", trophies: "123.450", elo: 2867, color: "#f97316" },
  { rank: 2, name: "Symantec", role: "vicePresident", trophies: "119.870", elo: 2841, color: "#f472b6" },
  { rank: 3, name: "LeNain", role: "vicePresident", trophies: "118.562", elo: 2793, color: "#38bdf8" },
  { rank: 4, name: "Flay", role: "senior", trophies: "116.321", elo: 2765, color: "#a78bfa" },
  { rank: 5, name: "Nytro", role: "senior", trophies: "115.009", elo: 2732, color: "#fb923c" },
  { rank: 6, name: "Silver", role: "senior", trophies: "108.214", elo: 2598, color: "#c084fc" },
  { rank: 7, name: "Skyzz", role: "member", trophies: "101.876", elo: 2487, color: "#f472b6" },
  { rank: 8, name: "Drax", role: "member", trophies: "97.542", elo: 2451, color: "#38bdf8" },
  { rank: 9, name: "Ryu", role: "member", trophies: "94.310", elo: 2398, color: "#fbbf24" },
  { rank: 10, name: "Azox", role: "member", trophies: "90.128", elo: 2346, color: "#a78bfa" },
  { rank: 11, name: "Zeno", role: "member", trophies: "87.665", elo: 2312, color: "#4ade80" },
  { rank: 12, name: "Nexxo", role: "member", trophies: "84.902", elo: 2287, color: "#f472b6" },
  { rank: 13, name: "Volt", role: "member", trophies: "81.230", elo: 2256, color: "#38bdf8" },
  { rank: 14, name: "Mowgli", role: "member", trophies: "76.514", elo: 2087, color: "#fb923c" },
  { rank: 15, name: "Bayo", role: "member", trophies: "72.980", elo: 2054, color: "#a78bfa" },
  { rank: 16, name: "Lumi", role: "member", trophies: "68.145", elo: 1986, color: "#4ade80" },
];

export const allPlayers = clubRoster.map((member) => ({
  rank: member.rank,
  name: member.name,
  trophies: member.trophies,
  elo: member.elo,
  color: member.color,
}));

export const fullEloRanking: { rank: number; name: string; tier: EloTier; elo: number; color: string }[] = [
  ...eloRanking,
  { rank: 16, name: "Lumi", tier: "DIAMANT III", elo: 1986, color: "#4ade80" },
  { rank: 17, name: "Draven", tier: "DIAMANT II", elo: 1932, color: "#f97316" },
  { rank: 18, name: "Kya", tier: "DIAMANT II", elo: 1874, color: "#f472b6" },
  { rank: 19, name: "Nova", tier: "DIAMANT I", elo: 1801, color: "#38bdf8" },
  { rank: 20, name: "Vex", tier: "DIAMANT I", elo: 1745, color: "#a78bfa" },
];

export const seasons = [
  {
    id: "2026-07",
    label: "Saison 25",
    status: "En cours",
    timeLeft: "Encore 18j 6h",
    topClubTrophies: "3.995.936",
    topPlayer: "Kaio",
    topPlayerDelta: "+18.320",
  },
  {
    id: "2026-06",
    label: "Saison 24",
    status: "Terminée",
    result: "Top 10 FR en clubs",
    topPlayer: "Kaio",
    topPlayerDelta: "+21.540",
  },
  {
    id: "2026-05",
    label: "Saison 23",
    status: "Terminée",
    result: "Top 18 FR en clubs",
    topPlayer: "Symantec",
    topPlayerDelta: "+17.890",
  },
  {
    id: "2026-04",
    label: "Saison 22",
    status: "Terminée",
    result: "Top 25 FR en clubs",
    topPlayer: "LeNain",
    topPlayerDelta: "+15.230",
  },
  {
    id: "2026-03",
    label: "Saison 21",
    status: "Terminée",
    result: "Top 34 FR en clubs",
    topPlayer: "Kaio",
    topPlayerDelta: "+19.010",
  },
];
