"use client";

import { useState, useTransition } from "react";
import { ShieldAlert, VolumeX, LockOpen, Ban, MicOff, Mic, Loader2, CircleCheck } from "lucide-react";
import { Panel } from "@/components/Panel";
import { MemberSearchInput, type ResolvedMember } from "@/components/MemberSearchInput";
import {
  warnMember,
  muteMember,
  unmuteMember,
  banMember,
  silenceMember,
  unsilenceMember,
  type ModActionResult,
} from "@/app/actions/adminModeration";

type Feedback = { ok: boolean; error?: string; message?: string } | null;

function ResultLine({ feedback }: { feedback: Feedback }) {
  if (!feedback) return null;
  if (feedback.ok) {
    return (
      <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-emerald-600">
        <CircleCheck size={13} /> {feedback.message ?? "Fait."}
      </p>
    );
  }
  return <p className="mt-2 text-xs text-red-500">{feedback.error}</p>;
}

export function ModerationPanel() {
  const [target, setTarget] = useState<ResolvedMember | null>(null);
  const [isPending, startTransition] = useTransition();

  const [warnReason, setWarnReason] = useState("");
  const [warnResult, setWarnResult] = useState<Feedback>(null);

  const [muteDuration, setMuteDuration] = useState("");
  const [muteReason, setMuteReason] = useState("");
  const [muteResult, setMuteResult] = useState<Feedback>(null);
  const [unmuteResult, setUnmuteResult] = useState<Feedback>(null);

  const [banReason, setBanReason] = useState("");
  const [banConfirm, setBanConfirm] = useState(false);
  const [banResult, setBanResult] = useState<Feedback>(null);

  const [silenceResult, setSilenceResult] = useState<Feedback>(null);
  const [unsilenceResult, setUnsilenceResult] = useState<Feedback>(null);

  function feedbackFrom(res: ModActionResult, message?: string): Feedback {
    return res.ok ? { ok: true, message } : { ok: false, error: res.error };
  }

  function submitWarn() {
    if (!target || isPending) return;
    startTransition(async () => {
      const res = await warnMember(target.discordId, warnReason || "Aucune raison spécifiée");
      setWarnResult(feedbackFrom(res, res.ok ? `Averti (${res.num_warns} au total).` : undefined));
      if (res.ok) setWarnReason("");
    });
  }

  function submitMute() {
    if (!target || isPending) return;
    startTransition(async () => {
      const res = await muteMember(target.discordId, muteDuration, muteReason || "Aucune raison spécifiée");
      setMuteResult(feedbackFrom(res, res.ok ? `Muté (${res.duration}).` : undefined));
      if (res.ok) {
        setMuteDuration("");
        setMuteReason("");
      }
    });
  }

  function submitUnmute() {
    if (!target || isPending) return;
    startTransition(async () => {
      const res = await unmuteMember(target.discordId);
      setUnmuteResult(feedbackFrom(res));
    });
  }

  function submitBan() {
    if (!target || isPending || !banConfirm) return;
    startTransition(async () => {
      const res = await banMember(target.discordId, banReason);
      setBanResult(feedbackFrom(res));
      if (res.ok) {
        setBanReason("");
        setBanConfirm(false);
        setTarget(null);
      }
    });
  }

  function submitSilence() {
    if (!target || isPending) return;
    startTransition(async () => {
      const res = await silenceMember(target.discordId);
      setSilenceResult(feedbackFrom(res));
    });
  }

  function submitUnsilence() {
    if (!target || isPending) return;
    startTransition(async () => {
      const res = await unsilenceMember(target.discordId);
      setUnsilenceResult(feedbackFrom(res));
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <Panel title="Cible">
        <MemberSearchInput onSelect={setTarget} placeholder="Rechercher un membre à sanctionner..." />
        {!target && <p className="mt-2 text-xs text-muted">Choisis un joueur ci-dessus pour activer les actions ci-dessous.</p>}
      </Panel>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel title="Avertissement">
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={warnReason}
              onChange={(e) => setWarnReason(e.target.value)}
              placeholder="Raison"
              disabled={!target}
              className="rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50 disabled:opacity-50"
            />
            <button
              type="button"
              onClick={submitWarn}
              disabled={!target || isPending}
              className="flex items-center justify-center gap-2 self-start rounded-full bg-amber-500/90 px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
            >
              {isPending ? <Loader2 size={13} className="animate-spin" /> : <ShieldAlert size={13} />}
              Avertir
            </button>
            <ResultLine feedback={warnResult} />
          </div>
        </Panel>

        <Panel title="Mute / Unmute">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={muteDuration}
                onChange={(e) => setMuteDuration(e.target.value)}
                placeholder="Durée (30s, 1.5h, 7j...)"
                disabled={!target}
                className="w-40 rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50 disabled:opacity-50"
              />
              <input
                type="text"
                value={muteReason}
                onChange={(e) => setMuteReason(e.target.value)}
                placeholder="Raison"
                disabled={!target}
                className="flex-1 rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50 disabled:opacity-50"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={submitMute}
                disabled={!target || isPending}
                className="flex items-center justify-center gap-2 rounded-full bg-amber-500/90 px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
              >
                {isPending ? <Loader2 size={13} className="animate-spin" /> : <VolumeX size={13} />}
                Mute
              </button>
              <button
                type="button"
                onClick={submitUnmute}
                disabled={!target || isPending}
                className="flex items-center justify-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground disabled:opacity-50"
              >
                {isPending ? <Loader2 size={13} className="animate-spin" /> : <LockOpen size={13} />}
                Unmute
              </button>
            </div>
            <ResultLine feedback={muteResult ?? unmuteResult} />
          </div>
        </Panel>

        <Panel title="Silence / Unsilence">
          <p className="mb-2 text-xs text-muted">Supprime automatiquement tous les messages du membre.</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={submitSilence}
              disabled={!target || isPending}
              className="flex items-center justify-center gap-2 rounded-full bg-slate-600/90 px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
            >
              {isPending ? <Loader2 size={13} className="animate-spin" /> : <MicOff size={13} />}
              Silence
            </button>
            <button
              type="button"
              onClick={submitUnsilence}
              disabled={!target || isPending}
              className="flex items-center justify-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground disabled:opacity-50"
            >
              {isPending ? <Loader2 size={13} className="animate-spin" /> : <Mic size={13} />}
              Unsilence
            </button>
          </div>
          <ResultLine feedback={silenceResult ?? unsilenceResult} />
        </Panel>

        <Panel title="Bannissement">
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              placeholder="Raison"
              disabled={!target}
              className="rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50 disabled:opacity-50"
            />
            <label className="flex items-center gap-2 text-xs text-muted">
              <input type="checkbox" checked={banConfirm} onChange={(e) => setBanConfirm(e.target.checked)} disabled={!target} />
              Je confirme vouloir bannir ce membre du serveur.
            </label>
            <button
              type="button"
              onClick={submitBan}
              disabled={!target || isPending || !banConfirm}
              className="flex items-center justify-center gap-2 self-start rounded-full bg-red-600/90 px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
            >
              {isPending ? <Loader2 size={13} className="animate-spin" /> : <Ban size={13} />}
              Bannir
            </button>
            <ResultLine feedback={banResult} />
          </div>
        </Panel>
      </div>
    </div>
  );
}
