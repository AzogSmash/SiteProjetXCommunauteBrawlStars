import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";

export default function AuthErrorPage() {
  return (
    <>
      <PageHeader
        eyebrow="Connexion"
        title="Échec de la connexion"
        description="La connexion avec Discord a échoué ou a été annulée."
      />
      <main className="mx-auto max-w-7xl px-6 pb-14">
        <Link href="/" className="text-sm font-semibold text-primary-2 hover:underline">
          Retour à l&apos;accueil
        </Link>
      </main>
    </>
  );
}
