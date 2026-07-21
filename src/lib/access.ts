import { createClient } from "@/lib/supabase/server";
import { getDiscordMember } from "./api";

// Les 4 niveaux d'accès du site, du plus bas au plus haut. Cumulatif : un
// staff voit tout ce que voit un membre (+ son panel staff), un admin voit
// tout ce que voit un staff (+ les actions d'admin). `clubSlug` est résolu
// indépendamment du tier — un staff/admin qui a aussi un rôle de clan garde
// sa vue personnalisée par-dessus son panel staff/admin.
export type AccessTier = "invite" | "membre" | "staff" | "admin";

export type AccessContext = {
  loggedIn: boolean;
  inGuild: boolean;
  tier: AccessTier;
  clubSlug: string | null;
};

const GUEST_ROLE_ID = "1513110804583547047";

const STAFF_ROLE_IDS = new Set(["1513110804595998788", "1516514610881237084"]);

// role Discord -> club (slug = FamilyClub.slug dans lib/family.ts). Confirmé
// avec le contenu réel de bs_family_clubs, pas seulement le nom du rôle.
const CLUB_ROLE_SLUGS: Record<string, string> = {
  "1513110804595998782": "projetx",
  "1513110804595998781": "projety",
  "1513110804583547051": "projets",
  "1513110804583547050": "projetz",
  "1513110804583547048": "projetdelta",
  "1525898511017578678": "projetsigma",
  "1528835091718213743": "projet", // Projet Ψ
};

const ANONYMOUS: AccessContext = { loggedIn: false, inGuild: false, tier: "invite", clubSlug: null };

// Server-only : lit la session Supabase (cookies) puis résout le rôle Discord
// réel depuis le miroir tenu par le bot (jamais via un scope OAuth guilds —
// voir lib/api.ts). Ne jette jamais : une API bot injoignable ou un ID
// inconnu retombe sur "invité", jamais sur un tier plus privilégié.
export async function getAccessContext(): Promise<AccessContext> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return ANONYMOUS;

  const discordId = user.identities?.find((i) => i.provider === "discord")?.id;
  if (!discordId) return { ...ANONYMOUS, loggedIn: true };

  const member = await getDiscordMember(discordId);
  if (!member) return { loggedIn: true, inGuild: false, tier: "invite", clubSlug: null };

  const clubSlug =
    Object.entries(CLUB_ROLE_SLUGS).find(([roleId]) => member.role_ids.includes(roleId))?.[1] ?? null;

  let tier: AccessTier = "invite";
  if (member.is_admin) {
    tier = "admin";
  } else if (member.role_ids.some((r) => STAFF_ROLE_IDS.has(r))) {
    tier = "staff";
  } else if (clubSlug && !member.role_ids.includes(GUEST_ROLE_ID)) {
    tier = "membre";
  }

  return { loggedIn: true, inGuild: true, tier, clubSlug };
}
