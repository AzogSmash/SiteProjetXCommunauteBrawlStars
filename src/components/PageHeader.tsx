export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-7xl px-6 pb-8 pt-12">
      <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary-2">
        {eyebrow}
      </p>
      <h1 className="font-display text-3xl font-black uppercase tracking-wide sm:text-4xl">
        {title}
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
        {description}
      </p>
    </div>
  );
}
