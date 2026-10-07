import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { ProductArt } from "@/components/illustrations/ProductArt";
import { formatCOP } from "@/lib/format";
import type { Product } from "@/lib/types";

const TONE_BG: Record<string, string> = {
  blush: "bg-blush-50",
  mint: "bg-mint-50",
  peach: "bg-peach-50",
  lavender: "bg-lavender-50",
};

export function BannerProductChip({
  product,
  index = 0,
  className = "w-60 shrink-0",
}: {
  product: Product;
  index?: number;
  className?: string;
}) {
  return (
    <Link
      href={`/producto/${product.slug}`}
      style={{ animationDelay: `${index * 90}ms` }}
      className={`group flex animate-pop-in items-center gap-3 rounded-2xl bg-white/95 p-2.5 ring-1 ring-white/60 backdrop-blur-md transition-all duration-200 ease-out-strong hover:-translate-y-1 ${className}`}
    >
      <span className={`flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl ${TONE_BG[product.tone]}`}>
        {product.images[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <ProductArt variant={product.artVariant} tone={product.tone} label={product.name} className="h-full w-full p-1.5" />
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-display text-sm font-bold text-ink">{product.name}</span>
        <span className="block text-xs font-bold text-blush-600">{formatCOP(product.price)}</span>
      </span>
      <ArrowRightIcon className="h-4 w-4 shrink-0 text-ink/25 transition-all duration-150 ease-out-strong group-hover:translate-x-0.5 group-hover:text-blush-500" />
    </Link>
  );
}
