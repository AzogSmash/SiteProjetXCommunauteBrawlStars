export function formatNumber(n: number): string {
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// "ProjetX" -> "Projet X", "ProjetΔ" -> "Projet Δ" — les noms viennent du
// bot sans espace (contrainte de commande Discord : !projetx).
export function spaceClubName(name: string): string {
  return name.replace(/^Projet(?=\S)/, "Projet ");
}

const PALETTE = ["#38bdf8", "#f472b6", "#facc15", "#4ade80", "#a78bfa", "#fb923c", "#c084fc", "#f87171"];

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

// "il y a 2h", "il y a 3j"... pour les actualités (voir NewsCard).
export function formatRelativeTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const minutes = Math.floor((Date.now() - d.getTime()) / 60000);
  if (minutes < 1) return "à l'instant";
  if (minutes < 60) return `il y a ${minutes}min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  return `il y a ${days}j`;
}

export function colorFromSeed(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return PALETTE[hash % PALETTE.length];
}
