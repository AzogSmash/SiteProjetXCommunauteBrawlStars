import { redirect } from "next/navigation";

// Fusionnée dans /classement (onglet Trophées) le 21/07/2026 — redirect pour
// ne pas casser les liens/favoris existants.
export default function JoueursRedirect() {
  redirect("/classement?tab=trophees");
}
