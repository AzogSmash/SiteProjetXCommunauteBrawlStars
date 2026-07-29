import { redirect } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { StaffPanelContent } from "@/components/StaffPanelContent";
import { getAccessContext } from "@/lib/access";
import { getFamilyClans } from "@/lib/api";

export default async function AdminPage() {
  const access = await getAccessContext();
  if (access.tier !== "admin") redirect("/");

  const clans = (await getFamilyClans()) ?? [];

  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Panel admin"
        description="Tout ce que voit le staff, plus la configuration de la famille."
      />

      <main className="mx-auto max-w-7xl px-6 pb-14">
        <StaffPanelContent clans={clans} />
      </main>
    </>
  );
}
