import Link from "next/link";
import { ChevronRightIcon } from "@/components/icons";

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-ink/50">
      <Link href="/" className="hover:text-blush-600">
        Inicio
      </Link>
      {items.map((item) => (
        <span key={item.label} className="flex items-center gap-1.5">
          <ChevronRightIcon className="h-3 w-3" />
          {item.href ? (
            <Link href={item.href} className="hover:text-blush-600">
              {item.label}
            </Link>
          ) : (
            <span className="text-ink/75">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
