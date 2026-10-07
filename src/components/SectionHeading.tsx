import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";

export function SectionHeading({
  kicker,
  title,
  highlight,
  subtitle,
  linkHref,
  linkLabel,
  icon,
  titleClassName = "text-ink",
  subtitleClassName = "text-ink/60",
}: {
  kicker?: React.ReactNode;
  title: string;
  highlight?: string;
  subtitle?: string;
  linkHref?: string;
  linkLabel?: string;
  icon?: React.ReactNode;
  titleClassName?: string;
  subtitleClassName?: string;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        {kicker && (
          <span className="pill-badge mb-3 bg-blush-100 text-blush-600">{kicker}</span>
        )}
        <h2 className={`font-display text-2xl font-bold leading-tight sm:text-3xl ${titleClassName}`}>
          {title}
          {highlight && <> <span className="text-blush-500">{highlight}</span></>}
          {icon && <span className="ml-2 inline-flex translate-y-0.5 align-middle">{icon}</span>}
        </h2>
        {subtitle && <p className={`mt-1.5 text-sm sm:text-base ${subtitleClassName}`}>{subtitle}</p>}
      </div>
      {linkHref && linkLabel && (
        <Link
          href={linkHref}
          className="group flex items-center gap-1.5 text-sm font-semibold text-blush-600 hover:text-blush-700"
        >
          {linkLabel}
          <ArrowRightIcon className="h-4 w-4 transition-transform duration-150 ease-out-strong group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
