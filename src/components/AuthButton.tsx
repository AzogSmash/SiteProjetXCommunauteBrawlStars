"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.subscription.unsubscribe();
  }, [supabase]);

  async function signIn() {
    await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  if (loading) {
    return <div className="h-10 w-10 shrink-0 rounded-full bg-surface-2" />;
  }

  if (!user) {
    return (
      <button
        onClick={signIn}
        className="rounded-full bg-gradient-to-r from-primary to-primary-2 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(113,54,186,0.3)] transition-transform hover:scale-[1.03]"
      >
        Connexion
      </button>
    );
  }

  const meta = user.user_metadata as { full_name?: string; name?: string; avatar_url?: string };
  const displayName = meta.full_name ?? meta.name ?? user.email ?? "Compte";

  return (
    <div className="flex items-center gap-2 rounded-full border border-border bg-surface py-1 pl-1.5 pr-2.5">
      {meta.avatar_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={meta.avatar_url} alt="" className="h-7 w-7 rounded-full" />
      ) : (
        <div className="h-7 w-7 rounded-full bg-primary/20" />
      )}
      <span className="max-w-[120px] truncate text-sm font-medium text-foreground">
        {displayName}
      </span>
      <button
        onClick={signOut}
        aria-label="Déconnexion"
        className="rounded-full p-1 text-muted transition-colors hover:text-foreground"
      >
        <LogOut size={15} />
      </button>
    </div>
  );
}
