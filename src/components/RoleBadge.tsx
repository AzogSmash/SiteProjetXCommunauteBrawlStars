import type { ApiClubRole } from "@/lib/api";

const roleStyles: Record<ApiClubRole, string> = {
  president: "bg-amber-400/15 text-amber-300",
  vicePresident: "bg-primary/15 text-primary-2",
  senior: "bg-sky-400/15 text-sky-300",
  member: "bg-white/5 text-muted",
};

const roleLabels: Record<ApiClubRole, string> = {
  president: "Président",
  vicePresident: "Vice-président",
  senior: "Senior",
  member: "Membre",
};

const roleLabelsFeminine: Record<ApiClubRole, string> = {
  president: "Présidente",
  vicePresident: "Vice-présidente",
  senior: "Senior",
  member: "Membre",
};

// L'API Brawl Stars n'expose aucune donnée de genre sur les joueurs — accord
// au féminin géré via cette liste tenue à la main (tag sans "#", majuscules).
// Ajoute un tag ici pour accorder son rôle au féminin.
const FEMININE_TAGS = new Set([
  "9QVUYLVP8", // Clochette, présidente de Projet Y
]);

export function RoleBadge({ role, tag }: { role: ApiClubRole; tag?: string }) {
  const clean = tag?.replace(/^#/, "").toUpperCase();
  const label = clean && FEMININE_TAGS.has(clean) ? roleLabelsFeminine[role] : roleLabels[role];
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${roleStyles[role]}`}
    >
      {label}
    </span>
  );
}
