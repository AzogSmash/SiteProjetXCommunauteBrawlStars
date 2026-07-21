import { redirect } from "next/navigation";

// Fusionnée dans /classement (onglet Ranked) le 21/07/2026 — redirect pour
// ne pas casser les liens/favoris existants.
export default function RankedRedirect() {
  redirect("/classement?tab=ranked");
}
