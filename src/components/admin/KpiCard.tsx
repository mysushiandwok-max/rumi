export function KpiCard({
  label,
  value,
  hint,
  tone = "blush",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "blush" | "mint" | "peach" | "lavender";
}) {
  const TONE_TEXT: Record<string, string> = {
    blush: "text-blush-600",
    mint: "text-mint-600",
    peach: "text-peach-600",
    lavender: "text-lavender-600",
  };
  return (
    <div className="card-surface p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">{label}</p>
      <p className={`mt-2 font-display text-2xl font-bold ${TONE_TEXT[tone]}`}>{value}</p>
      {hint && <p className="mt-1 text-xs text-ink/50">{hint}</p>}
    </div>
  );
}
