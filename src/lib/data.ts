export const navLinks = [
  { label: "Accueil", href: "/" },
  { label: "Clubs", href: "/clubs" },
  { label: "Classement", href: "/classement" },
  { label: "Pusheurs", href: "/pusheurs" },
  { label: "Actualités", href: "/actualites" },
];

export const communityDescription =
  "Projet X est une communauté Brawl Stars qui regroupe plusieurs clubs compétitifs, unis autour de la performance, l'esprit d'équipe et la progression continue.";

export const discordInviteUrl = "https://discord.gg/GrkKPFSBX9";

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
