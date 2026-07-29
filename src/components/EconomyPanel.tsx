"use client";

import { useState, useTransition } from "react";
import { Pause, Play, Snowflake, Sun, Ban, LockOpen, Coins, Loader2, CircleCheck } from "lucide-react";
import { Panel } from "@/components/Panel";
import { MemberSearchInput, type ResolvedMember } from "@/components/MemberSearchInput";
import { pauseCasino, resumeCasino, freezeCrypto, banCasino, unbanCasino, adjustCoins } from "@/app/actions/adminEconomy";

function Feedback({ result }: { result: { ok: boolean; error?: string } | null }) {
  if (!result) return null;
  if (result.ok) {
    return (
      <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-emerald-600">
        <CircleCheck size={13} /> Fait.
      </p>
    );
  }
  return <p className="mt-2 text-xs text-red-500">{result.error}</p>;
}

export function EconomyPanel({ casinoPaused, cryptoFrozen }: { casinoPaused: boolean; cryptoFrozen: boolean }) {
  const [isPending, startTransition] = useTransition();

  const [banTarget, setBanTarget] = useState<ResolvedMember | null>(null);
  const [banReason, setBanReason] = useState("");
  const [banResult, setBanResult] = useState<{ ok: boolean; error?: string } | null>(null);

  const [unbanTarget, setUnbanTarget] = useState<ResolvedMember | null>(null);
  const [unbanResult, setUnbanResult] = useState<{ ok: boolean; error?: string } | null>(null);

  const [coinsTarget, setCoinsTarget] = useState<ResolvedMember | null>(null);
  const [coinsAmount, setCoinsAmount] = useState("");
  const [coinsCompte, setCoinsCompte] = useState<"cash" | "coffre">("cash");
  const [coinsResult, setCoinsResult] = useState<{ ok: boolean; error?: string } | null>(null);

  function toggleCasino() {
    startTransition(async () => {
      await (casinoPaused ? resumeCasino() : pauseCasino());
    });
  }

  function toggleCrypto() {
    startTransition(async () => {
      await freezeCrypto();
    });
  }

  function submitBan(e: React.FormEvent) {
    e.preventDefault();
    if (!banTarget || isPending) return;
    startTransition(async () => {
      const res = await banCasino(banTarget.discordId, banReason);
      setBanResult(res.ok ? { ok: true } : { ok: false, error: res.error });
      if (res.ok) {
        setBanTarget(null);
        setBanReason("");
      }
    });
  }

  function submitUnban(e: React.FormEvent) {
    e.preventDefault();
    if (!unbanTarget || isPending) return;
    startTransition(async () => {
      const res = await unbanCasino(unbanTarget.discordId);
      setUnbanResult(res.ok ? { ok: true } : { ok: false, error: res.error });
      if (res.ok) setUnbanTarget(null);
    });
  }

  function submitCoins(e: React.FormEvent) {
    e.preventDefault();
    const amount = Number(coinsAmount);
    if (!coinsTarget || isPending || !Number.isFinite(amount) || amount === 0) return;
    startTransition(async () => {
      const res = await adjustCoins(coinsTarget.discordId, amount, coinsCompte);
      setCoinsResult(res.ok ? { ok: true } : { ok: false, error: res.error });
      if (res.ok) {
        setCoinsTarget(null);
        setCoinsAmount("");
      }
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <Panel title="État du marché">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex flex-1 items-center justify-between gap-3 rounded-xl border border-border px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-foreground/90">Casino</p>
              <p className="text-xs text-muted">{casinoPaused ? "⏸️ En pause" : "✅ Actif"}</p>
            </div>
            <button
              type="button"
              onClick={toggleCasino}
              disabled={isPending}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-2 px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
            >
              {casinoPaused ? <Play size={14} /> : <Pause size={14} />}
              {casinoPaused ? "Reprendre" : "Mettre en pause"}
            </button>
          </div>
          <div className="flex flex-1 items-center justify-between gap-3 rounded-xl border border-border px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-foreground/90">Marché crypto</p>
              <p className="text-xs text-muted">{cryptoFrozen ? "🔒 Suspendu" : "✅ Ouvert"}</p>
            </div>
            <button
              type="button"
              onClick={toggleCrypto}
              disabled={isPending}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-2 px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
            >
              {cryptoFrozen ? <Sun size={14} /> : <Snowflake size={14} />}
              {cryptoFrozen ? "Rouvrir" : "Geler"}
            </button>
          </div>
        </div>
      </Panel>

      <div className="flex flex-col gap-6 lg:flex-row">
        <Panel title="Bannir du casino" className="w-full lg:w-1/2">
          <form onSubmit={submitBan} className="flex flex-col gap-3">
            <MemberSearchInput onSelect={setBanTarget} />
            {banTarget && (
              <input
                type="text"
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="Raison (optionnel)"
                className="w-full rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50"
              />
            )}
            <button
              type="submit"
              disabled={!banTarget || isPending}
              className="flex items-center justify-center gap-2 self-start rounded-full bg-red-500/90 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {isPending ? <Loader2 size={14} className="animate-spin" /> : <Ban size={14} />}
              Bannir
            </button>
            <Feedback result={banResult} />
          </form>
        </Panel>

        <Panel title="Débannir du casino" className="w-full lg:w-1/2">
          <form onSubmit={submitUnban} className="flex flex-col gap-3">
            <MemberSearchInput onSelect={setUnbanTarget} />
            <button
              type="submit"
              disabled={!unbanTarget || isPending}
              className="flex items-center justify-center gap-2 self-start rounded-full bg-emerald-600/90 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {isPending ? <Loader2 size={14} className="animate-spin" /> : <LockOpen size={14} />}
              Débannir
            </button>
            <Feedback result={unbanResult} />
          </form>
        </Panel>
      </div>

      <Panel title="Ajuster les coins">
        <form onSubmit={submitCoins} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
          <MemberSearchInput onSelect={setCoinsTarget} placeholder="Joueur ciblé..." />
          <input
            type="number"
            value={coinsAmount}
            onChange={(e) => setCoinsAmount(e.target.value)}
            placeholder="Montant (négatif pour retirer)"
            className="w-56 rounded-full border border-border bg-surface-2 px-3 py-1.5 text-sm text-foreground outline-none focus:border-primary/50"
          />
          <select
            value={coinsCompte}
            onChange={(e) => setCoinsCompte(e.target.value as "cash" | "coffre")}
            className="rounded-full border border-border bg-surface-2 px-3 py-1.5 text-sm text-foreground outline-none focus:border-primary/50"
          >
            <option value="cash">Coins</option>
            <option value="coffre">Coffre</option>
          </select>
          <button
            type="submit"
            disabled={!coinsTarget || isPending || !coinsAmount}
            className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-2 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {isPending ? <Loader2 size={14} className="animate-spin" /> : <Coins size={14} />}
            Appliquer
          </button>
        </form>
        <Feedback result={coinsResult} />
      </Panel>
    </div>
  );
}
