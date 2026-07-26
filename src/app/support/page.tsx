import { PageHeader } from "@/components/PageHeader";
import { DataUnavailable } from "@/components/DataUnavailable";
import { TicketForm } from "@/components/TicketForm";
import { getAccessContext } from "@/lib/access";

export default async function SupportPage() {
  const access = await getAccessContext();

  return (
    <>
      <PageHeader
        eyebrow="Besoin d'aide ?"
        title="Support"
        description="Ouvre un ticket privé avec le staff : candidature, recrutement de club, incident..."
      />

      <main className="mx-auto max-w-2xl px-6 pb-14">
        {!access.loggedIn ? (
          <DataUnavailable message="Connecte-toi avec Discord pour ouvrir un ticket." showContact={false} />
        ) : !access.bsLinked ? (
          <DataUnavailable message="Lie ton compte Brawl Stars pour ouvrir un ticket (une fenêtre de liaison s'affiche automatiquement, sinon utilise !bslink sur Discord)." />
        ) : (
          <TicketForm />
        )}
      </main>
    </>
  );
}
