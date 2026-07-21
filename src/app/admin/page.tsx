import { redirect } from "next/navigation";
import { ShieldCheck, Hammer } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Panel } from "@/components/Panel";
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
        <StaffPanelContent />

        <div className="mt-6">
          <Panel title="Configuration actuelle — clans de la famille">
            <ul className="flex flex-col gap-1">
              {clans.map((c) => (
                <li key={c.tag} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm">
                  <ShieldCheck size={15} className="shrink-0 text-primary-2" />
                  <span className="min-w-0 flex-1 truncate font-medium text-foreground/90">{c.name}</span>
                  <span className="text-xs text-muted">#{c.tag}</span>
                  <span className="text-xs text-muted">!{c.slug}{c.alias ? ` / !${c.alias}` : ""}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-dashed border-border p-5 text-sm text-muted">
          <Hammer size={18} className="mt-0.5 shrink-0 text-primary-2" />
          <p>
            Ajout/retrait de clan, modération et configuration des rôles automatiques depuis le site
            arrivent dans une prochaine passe — pour l&apos;instant ces actions restent sur Discord
            (<code>!bs_famille</code>, <code>!warn</code>, etc.).
          </p>
        </div>
      </main>
    </>
  );
}
