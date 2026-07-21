import { redirect } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { StaffPanelContent } from "@/components/StaffPanelContent";
import { getAccessContext } from "@/lib/access";

export default async function StaffPage() {
  const access = await getAccessContext();
  if (access.tier !== "staff" && access.tier !== "admin") redirect("/");

  return (
    <>
      <PageHeader
        eyebrow="Staff"
        title="Panel staff"
        description="Vue d'ensemble réservée au staff : progression détaillée par clan, arrivées récentes et journal de modération."
      />

      <main className="mx-auto max-w-7xl px-6 pb-14">
        <StaffPanelContent />
      </main>
    </>
  );
}
