"use client";

import { useState, useTransition } from "react";
import { Loader2, CircleCheck, Save } from "lucide-react";
import { updatePlayerProfile } from "@/app/actions/updateProfile";

const MAX_BIO_LENGTH = 280;

export function ProfileEditForm({
  tag,
  initialBio,
  screenshotUrl,
}: {
  tag: string;
  initialBio: string | null;
  screenshotUrl: string | null;
}) {
  const [bio, setBio] = useState(initialBio ?? "");
  const [preview, setPreview] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; message?: string } | null>(null);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setPreview(file ? URL.createObjectURL(file) : null);
  }

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isPending) return;
    const formData = new FormData(e.currentTarget);
    setResult(null);
    startTransition(async () => {
      const res = await updatePlayerProfile(tag, formData);
      setResult(res.ok ? { ok: true } : { ok: false, message: res.error });
    });
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
          Présentation
        </label>
        <textarea
          name="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          maxLength={MAX_BIO_LENGTH}
          disabled={isPending}
          rows={3}
          placeholder="Une courte présentation de toi..."
          className="w-full resize-none rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50"
        />
        <p className="mt-1 text-right text-[11px] text-muted">
          {bio.length}/{MAX_BIO_LENGTH}
        </p>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
          Screenshot du profil
        </label>
        {(preview ?? screenshotUrl) && (
          // eslint-disable-next-line @next/next/no-img-element -- prévisualisation locale (blob:) ou image Supabase Storage
          <img
            src={preview ?? screenshotUrl ?? undefined}
            alt=""
            className="mb-2 w-full rounded-xl border border-border object-cover"
          />
        )}
        <input
          type="file"
          name="screenshot"
          accept="image/png,image/jpeg,image/webp"
          disabled={isPending}
          onChange={onFileChange}
          className="w-full text-xs text-muted file:mr-3 file:rounded-full file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-primary-2 hover:file:bg-primary/20"
        />
      </div>

      {result && !result.ok && <p className="text-xs text-red-500">{result.message}</p>}
      {result?.ok && (
        <p className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
          <CircleCheck size={13} /> Profil mis à jour.
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="flex items-center justify-center gap-2 self-start rounded-full bg-gradient-to-r from-primary to-primary-2 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(113,54,186,0.3)] transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
      >
        {isPending ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
        Enregistrer
      </button>
    </form>
  );
}
