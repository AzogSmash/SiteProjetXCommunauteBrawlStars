import { redirect } from "next/navigation";

// Renommée /pusheurs le 21/07/2026 — redirect pour ne pas casser les
// liens/favoris existants.
export default function SaisonsRedirect() {
  redirect("/pusheurs");
}
