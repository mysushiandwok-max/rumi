import type { ComponentType, SVGProps } from "react";
import { TrendUpIcon, TrendDownIcon } from "@/components/icons";
import type { Trend } from "@/lib/admin/trend";

type Tone = "blush" | "mint" | "peach" | "lavender" | "ink";

const TONE_CHIP: Record<Tone, string> = {
  blush: "bg-blush-100 text-blush-600",
  mint: "bg-mint-100 text-mint-700",
  peach: "bg-peach-100 text-peach-600",
  lavender: "bg-lavender-100 text-lavender-600",
  ink: "bg-ink/5 text-ink/50",
};

function TrendBadge({ trend }: { trend: Trend }) {
  if (trend.direction === "up") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold text-mint-700">
        <TrendUpIcon className="h-3.5 w-3.5" />+{trend.percent}%
      </span>
    );
  }
  if (trend.direction === "down") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold text-blush-600">
        <TrendDownIcon className="h-3.5 w-3.5" />-{trend.percent}%
      </span>
    );
  }
  if (trend.direction === "new") {
    return <span className="text-xs font-bold text-lavender-600">Nuevo</span>;
  }
  return <span className="text-xs font-semibold text-ink/40">Sin cambios</span>;
}

export function StatCard({
  label,
  value,
  hint,
  trend,
  icon: Icon,
  tone = "blush",
  featured = false,
}: {
  label: string;
  value: string;
  hint?: string;
  trend?: Trend;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  tone?: Tone;
  featured?: boolean;
}) {
  return (
    <div className={`card-surface flex flex-col gap-3 p-5 ${featured ? "sm:col-span-2" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">{label}</p>
        {Icon && (
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${TONE_CHIP[tone]}`}>
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>
      <p className={`font-display font-bold leading-none text-ink ${featured ? "text-4xl" : "text-2xl"}`}>{value}</p>
      <div className="flex min-h-[18px] items-center gap-2">
        {trend && <TrendBadge trend={trend} />}
        {hint && <span className="text-xs text-ink/50">{hint}</span>}
      </div>
    </div>
  );
}
