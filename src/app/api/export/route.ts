import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { getAccessContext } from "@/lib/access";
import { getRankedLeaderboard, getAllTimeRankedLeaderboard, getPlayersLeaderboard } from "@/lib/family";
import {
  getFamilyClassement1v1,
  getFamilyClassementCasino,
  getFamilySaisons,
  getFamilySeasonArchive,
} from "@/lib/api";

function sheetFromRows(rows: Record<string, unknown>[]) {
  return XLSX.utils.json_to_sheet(rows);
}

// Export Excel des classements pour le staff/admin (demande du 22/07/2026) —
// classements actuels + un onglet par saison de push archivée. Réservé au
// staff/admin comme le reste du panel, voir lib/access.ts.
export async function GET() {
  const access = await getAccessContext();
  if (access.tier !== "staff" && access.tier !== "admin") {
    return NextResponse.json({ error: "unauthorized" }, { status: 403 });
  }

  const [ranked, rankedAllTime, trophees, duel1v1, casino, seasons] = await Promise.all([
    getRankedLeaderboard(),
    getAllTimeRankedLeaderboard(),
    getPlayersLeaderboard(),
    getFamilyClassement1v1(),
    getFamilyClassementCasino(),
    getFamilySaisons(),
  ]);

  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    wb,
    sheetFromRows(ranked.map((p) => ({ Rang: p.rank, Joueur: p.name, Club: p.club ?? "", Tier: p.tier, Élo: p.elo }))),
    "Ranked"
  );

  XLSX.utils.book_append_sheet(
    wb,
    sheetFromRows(
      rankedAllTime.map((p) => ({ Rang: p.rank, Joueur: p.name, Club: p.club ?? "", Tier: p.tier, "Record élo": p.elo }))
    ),
    "Ranked all-time"
  );

  XLSX.utils.book_append_sheet(
    wb,
    sheetFromRows(
      trophees.map((p) => ({ Rang: p.rank, Joueur: p.name, Club: p.club ?? "", Trophées: p.trophies, Élo: p.elo ?? "" }))
    ),
    "Trophées"
  );

  XLSX.utils.book_append_sheet(
    wb,
    sheetFromRows(
      (duel1v1 ?? []).map((p, i) => ({
        Rang: i + 1,
        Joueur: p.name,
        Points: p.points,
        Victoires: p.wins,
        Défaites: p.losses,
        Tier: p.tier,
      }))
    ),
    "1v1"
  );

  XLSX.utils.book_append_sheet(
    wb,
    sheetFromRows((casino ?? []).map((p, i) => ({ Rang: i + 1, Joueur: p.name, Jetons: p.coins }))),
    "Casino"
  );

  const archives = await Promise.all((seasons ?? []).map((month) => getFamilySeasonArchive(month)));
  (seasons ?? []).forEach((month, i) => {
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
    // Nom d'onglet Excel limité à 31 caractères.
    XLSX.utils.book_append_sheet(wb, sheetFromRows(rows), `Saison ${month}`.slice(0, 31));
  });

  const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" }) as Buffer;

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="projetx-classements-${new Date().toISOString().slice(0, 10)}.xlsx"`,
    },
  });
}
