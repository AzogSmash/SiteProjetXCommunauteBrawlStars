export const navLinks = [
  { label: "Accueil", href: "/" },
  { label: "Clubs", href: "/clubs" },
  { label: "Classement", href: "/classement" },
  { label: "Pusheurs", href: "/pusheurs" },
  { label: "Meilleurs builds", href: "/best-builds" },
  { label: "Actualités", href: "/actualites" },
  { label: "Support", href: "/support" },
  // Externe — pas de page "brawlers" sur le site, juste un lien pratique
  // vers un tier-list/builds déjà maintenu ailleurs (demande du 10/08/2026,
  // pas question de scraper/répliquer leur contenu, voir discussion).
  { label: "Builds", href: "https://www.noff.gg/brawl-stars/builds", external: true },
];

export const communityDescription =
  "Projet X est une communauté Brawl Stars qui regroupe plusieurs clubs compétitifs, unis autour de la performance, l'esprit d'équipe et la progression continue.";

export const discordInviteUrl = "https://discord.gg/GrkKPFSBX9";

// Mêmes clés que TICKET_CATEGORIES côté bot (main.py) — dupliqué, pas de
// package partagé entre les deux repos (même logique que _RANKED_TIER_NAME_MAP).
export const TICKET_CATEGORIES: { value: string; label: string }[] = [
  { value: "candidature", label: "💼 Candidature" },
  { value: "club_recruitment", label: "🎯 Recrutement Club" },
  { value: "incident", label: "🔴 Incident" },
  { value: "other", label: "❓ Autre" },
];
