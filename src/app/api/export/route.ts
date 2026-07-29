import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { getAccessContext } from "@/lib/access";
import { getRankedLeaderboard, getAllTimeRankedLeaderboard, getPlayersLeaderboard, monthLabel } from "@/lib/family";
import {
  getFamilyClassement1v1,
  getFamilyClassementCasino,
  getFamilySaisons,
  getFamilySeasonArchive,
  getFamily1v1Saisons,
  getFamilyCasinoSaisons,
} from "@/lib/api";

function sheetFromRows(rows: Record<string, unknown>[]) {
  return XLSX.utils.json_to_sheet(rows);
}

// Nom d'onglet Excel limité à 31 caractères et unique dans le classeur.
function sheetName(label: string) {
  return label.slice(0, 31);
}

// Export Excel des classements pour le staff/admin (demande du 22/07/2026,
// étendu le 29/07/2026 avec des options : quels classements, quelle période
// pour le 1v1/casino, quelles saisons Brawl Stars archiver — avant ça,
// l'export incluait systématiquement tout, sans choix possible). Réservé au
// staff/admin comme le reste du panel, voir lib/access.ts.
export async function GET(request: Request) {
  const access = await getAccessContext();
  if (access.tier !== "staff" && access.tier !== "admin") {
    return NextResponse.json({ error: "unauthorized" }, { status: 403 });
  }

  const url = new URL(request.url);
  const statsParam = url.searchParams.get("stats");
  const stats = new Set(
    (statsParam ?? "ranked,rankedAllTime,trophees,duel1v1,casino").split(",").filter(Boolean)
  );
  const duel1v1Season = url.searchParams.get("duel1v1Season") ?? "current";
  const casinoSeason = url.searchParams.get("casinoSeason") ?? "current";
  const bsSeasonMode = url.searchParams.get("bsSeasons") ?? "all";

  const wb = XLSX.utils.book_new();

  if (stats.has("ranked")) {
    const ranked = await getRankedLeaderboard();
    XLSX.utils.book_append_sheet(
      wb,
      sheetFromRows(ranked.map((p) => ({ Rang: p.rank, Joueur: p.name, Club: p.club ?? "", Tier: p.tier, Élo: p.elo }))),
      "Ranked"
    );
  }

  if (stats.has("rankedAllTime")) {
    const rankedAllTime = await getAllTimeRankedLeaderboard();
    XLSX.utils.book_append_sheet(
      wb,
      sheetFromRows(
        rankedAllTime.map((p) => ({ Rang: p.rank, Joueur: p.name, Club: p.club ?? "", Tier: p.tier, "Record élo": p.elo }))
      ),
      "Ranked all-time"
    );
  }

  if (stats.has("trophees")) {
    const trophees = await getPlayersLeaderboard();
    XLSX.utils.book_append_sheet(
      wb,
      sheetFromRows(
        trophees.map((p) => ({ Rang: p.rank, Joueur: p.name, Club: p.club ?? "", Trophées: p.trophies, Élo: p.elo ?? "" }))
      ),
      "Trophées"
    );
  }

  if (stats.has("duel1v1")) {
    const months = duel1v1Season === "all" ? (await getFamily1v1Saisons()) ?? [] : [];
    const toFetch = duel1v1Season === "all" ? months : [duel1v1Season === "current" ? undefined : duel1v1Season];
    for (const month of toFetch) {
      const data = (await getFamilyClassement1v1(month)) ?? [];
      const rows = data.map((p, i) => ({
        Rang: i + 1,
        Joueur: p.name,
        Points: p.points,
        Victoires: p.wins,
        Défaites: p.losses,
        Tier: p.tier,
      }));
      XLSX.utils.book_append_sheet(wb, sheetFromRows(rows), sheetName(month ? `1v1 ${monthLabel(month)}` : "1v1"));
    }
  }

  if (stats.has("casino")) {
    const months = casinoSeason === "all" ? (await getFamilyCasinoSaisons()) ?? [] : [];
    const toFetch = casinoSeason === "all" ? months : [casinoSeason === "current" ? undefined : casinoSeason];
    for (const month of toFetch) {
      const data = (await getFamilyClassementCasino(month)) ?? [];
      const rows = data.map((p, i) => ({ Rang: i + 1, Joueur: p.name, Jetons: p.coins }));
      XLSX.utils.book_append_sheet(wb, sheetFromRows(rows), sheetName(month ? `Casino ${monthLabel(month)}` : "Casino"));
    }
  }

  if (bsSeasonMode !== "none") {
    const allSeasons = (await getFamilySaisons()) ?? [];
    const seasonsToExport = bsSeasonMode === "all" ? allSeasons : allSeasons.includes(bsSeasonMode) ? [bsSeasonMode] : [];
    const archives = await Promise.all(seasonsToExport.map((month) => getFamilySeasonArchive(month)));
    seasonsToExport.forEach((month, i) => {
      const archive = archives[i];
      if (!archive) return;
      const rows = Object.entries(archive).map(([tag, e]) => ({
        Tag: tag,
        Joueur: e.name,
        Club: e.club ?? "",
        Début: e.start,
        Fin: e.end,
        Delta: e.delta,
      }));
      XLSX.utils.book_append_sheet(wb, sheetFromRows(rows), sheetName(`Saison ${monthLabel(month)}`));
    });
  }

  if (wb.SheetNames.length === 0) {
    XLSX.utils.book_append_sheet(wb, sheetFromRows([{ Info: "Aucun classement sélectionné" }]), "Info");
  }

  const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" }) as Buffer;

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="projetx-classements-${new Date().toISOString().slice(0, 10)}.xlsx"`,
    },
  });
}
