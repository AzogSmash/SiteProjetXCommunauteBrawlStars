import type { ApiClubRole } from "@/lib/api";

const roleStyles: Record<ApiClubRole, string> = {
  president: "bg-amber-400/15 text-amber-300",
  vicePresident: "bg-primary/15 text-primary-2",
  senior: "bg-sky-400/15 text-sky-300",
  member: "bg-white/5 text-muted",
};

export function RoleBadge({ role }: { role: ApiClubRole }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${roleStyles[role]}`}
    >
      {role}
    </span>
  );
}
