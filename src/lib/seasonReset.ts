// Dates de fin de saison par type de classement (demande du 21/07/2026) —
// pur calcul de calendrier, sans I/O, donc utilisable aussi bien côté
// serveur que dans un composant client. Toutes les heures sont "murales"
// heure de Paris (comme check_bs_season côté bot), stockées en UTC pour
// éviter les soucis d'heure d'été/hiver pendant les calculs.

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

function nthWeekdayOfMonth(year: number, monthIndex: number, weekday: number, n: number, hour: number): Date {
  const first = new Date(Date.UTC(year, monthIndex, 1, hour, 0, 0));
  const offsetToFirst = (weekday - first.getUTCDay() + 7) % 7;
  const day = 1 + offsetToFirst + (n - 1) * 7;
  return new Date(Date.UTC(year, monthIndex, day, hour, 0, 0));
}

function nextNthWeekday(from: Date, weekday: number, n: number, hour: number): Date {
  let year = from.getUTCFullYear();
  let month = from.getUTCMonth();
  for (let i = 0; i < 4; i++) {
    const candidate = nthWeekdayOfMonth(year, month, weekday, n, hour);
    if (candidate.getTime() > from.getTime()) return candidate;
    month += 1;
    if (month > 11) {
      month = 0;
      year += 1;
    }
  }
  return nthWeekdayOfMonth(year, month, weekday, n, hour);
}

function nextEndOfMonth(from: Date): Date {
  const end = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth() + 1, 0, 23, 59, 59));
  if (end.getTime() > from.getTime()) return end;
  return new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth() + 2, 0, 23, 59, 59));
}

export type SeasonCategory = "ranked" | "trophees" | "1v1" | "casino";

// Règles de reset communiquées le 21/07/2026 : ranked = 3ème mardi du mois
// 10h, trophées (push) = 1er jeudi du mois 10h (même point que
// check_bs_season côté bot), 1v1/casino = fin de mois.
function nextResetFor(category: SeasonCategory, from: Date): Date {
  switch (category) {
    case "trophees":
      return nextNthWeekday(from, 4, 1, 10); // jeudi = 4, 1er
    case "ranked":
      return nextNthWeekday(from, 2, 3, 10); // mardi = 2, 3ème
    case "1v1":
    case "casino":
      return nextEndOfMonth(from);
  }
}

export function formatSeasonEndLabel(category: SeasonCategory, now: Date = new Date()): string {
  const wall = parisWallClock(now);
  const reset = nextResetFor(category, wall);
  const ms = reset.getTime() - wall.getTime();
  const totalHours = Math.max(0, Math.round(ms / (1000 * 60 * 60)));
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  return `Fin de saison dans ${days}j ${hours}h`;
}
