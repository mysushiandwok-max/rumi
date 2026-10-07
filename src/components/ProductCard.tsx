"use client";

import { useState } from "react";
import Link from "next/link";
import { ProductArt } from "@/components/illustrations/ProductArt";
import { RatingStars } from "@/components/RatingStars";
import { HeartIcon, PlusIcon, CheckIcon, SparkleIcon } from "@/components/icons";
import { formatCOP } from "@/lib/format";
import { getBrandBySlug } from "@/data/brands";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import type { Product } from "@/lib/types";

const TONE_BG: Record<string, string> = {
  blush: "bg-blush-50",
  mint: "bg-mint-50",
  peach: "bg-peach-50",
  lavender: "bg-lavender-50",
};

const TONE_DOODLE: Record<string, string> = {
  blush: "text-blush-300",
  mint: "text-mint-300",
  peach: "text-peach-300",
  lavender: "text-lavender-300",
};

const BADGE_STYLES: Record<string, string> = {
  Bestseller: "bg-mint-100 text-mint-700",
  Nuevo: "bg-lavender-100 text-lavender-600",
  "Últimas unidades": "bg-blush-100 text-blush-700",
};

const BADGE_LABELS: Record<string, string> = {
  Bestseller: "Más vendido",
  Nuevo: "Nuevo",
  "Últimas unidades": "Últimas unidades",
};

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { addItem, openCart, markAdded } = useCart();
  const { toggle, has } = useWishlist();
  const [justAdded, setJustAdded] = useState(false);
  const brand = getBrandBySlug(product.brandSlug);
  const saved = has(product.slug);
  const secondaryImage = product.images[1];

  const handleAdd = () => {
    addItem(product.slug, 1);
    markAdded(product.slug);
    openCart();
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <div
      style={{ animationDelay: `${index * 70}ms` }}
      className="group relative flex w-full animate-pop-in flex-col"
    >
      <div className={`relative aspect-[4/5] overflow-hidden ${TONE_BG[product.tone]}`}>
        <SparkleIcon
          className={`pointer-events-none absolute right-6 top-1/3 h-5 w-5 animate-float opacity-70 ${TONE_DOODLE[product.tone]}`}
          style={{ animationDelay: "0.4s" }}
        />
        <HeartIcon
          className={`pointer-events-none absolute bottom-8 left-6 h-4 w-4 animate-float opacity-60 ${TONE_DOODLE[product.tone]}`}
          style={{ animationDelay: "1.4s" }}
        />

        <Link href={`/producto/${product.slug}`} className="absolute inset-0 z-0" aria-label={product.name}>
          {product.images[0] ? (
            <>
              <img
                src={product.images[0]}
                alt={product.name}
                loading="lazy"
                decoding="async"
                className={`absolute inset-0 h-full w-full object-cover transition-[transform,opacity,filter] duration-500 ease-out-strong group-hover:scale-[1.06] ${
                  secondaryImage ? "group-hover:opacity-0 group-hover:blur-[2px]" : ""
                }`}
              />
              {secondaryImage && (
                <img
                  src={secondaryImage}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  aria-hidden
                  className="absolute inset-0 h-full w-full scale-[1.1] object-cover opacity-0 blur-[2px] transition-[transform,opacity,filter] duration-500 ease-out-strong group-hover:scale-[1.06] group-hover:opacity-100 group-hover:blur-none"
                />
              )}
            </>
          ) : (
            <div className="flex h-full items-center justify-center p-4 transition-transform duration-500 ease-out-strong group-hover:scale-[1.06]">
              <ProductArt
                variant={product.artVariant}
                tone={product.tone}
                label={product.name}
                className="h-full w-auto max-w-[72%] drop-shadow-[0_16px_20px_rgba(43,35,32,0.12)]"
              />
            </div>
          )}
        </Link>

        {product.badge && (
          <span
            className={`pill-badge pointer-events-none absolute left-3 top-3 z-10 ${BADGE_STYLES[product.badge]}`}
          >
            {BADGE_LABELS[product.badge]}
          </span>
        )}

        <button
          type="button"
          aria-pressed={saved}
          aria-label={saved ? "Quitar de favoritos" : "Guardar en favoritos"}
          onClick={() => toggle(product.slug)}
          className={`absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm backdrop-blur-sm transition-all duration-200 ease-out-strong hover:scale-110 active:scale-90 ${
            saved ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <HeartIcon
            className={`h-4 w-4 transition-colors duration-200 ${saved ? "fill-blush-500 text-blush-500" : "text-ink/60"}`}
          />
        </button>
      </div>

      <div className="mt-4 flex flex-1 flex-col gap-1 px-1">
        {brand && <span className="text-sm text-ink/50">{brand.name}</span>}
        <Link
          href={`/producto/${product.slug}`}
          className="line-clamp-1 font-display text-base font-bold text-ink transition-colors hover:text-blush-600"
        >
          {product.name}
        </Link>
        <p className="line-clamp-1 text-sm text-ink/55">{product.shortDescription}</p>
        <RatingStars rating={product.rating} reviewCount={product.reviewCount} />

        <div className="mt-1.5 flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-lg font-bold text-blush-600">{formatCOP(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-xs text-ink/35 line-through">{formatCOP(product.compareAtPrice)}</span>
            )}
          </div>

          <button
            type="button"
            onClick={handleAdd}
            aria-label={`Añadir ${product.name} al carrito`}
            className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blush-500 text-white shadow-pop transition-colors duration-150 ease-out-strong hover:bg-blush-600 active:scale-90"
          >
            <PlusIcon
              className={`absolute h-4 w-4 transition-all duration-200 ease-out-strong ${
                justAdded ? "scale-50 rotate-45 opacity-0" : "scale-100 rotate-0 opacity-100"
              }`}
            />
            <CheckIcon
              className={`absolute h-4 w-4 transition-all duration-200 ease-out-strong ${
                justAdded ? "scale-100 opacity-100" : "scale-50 opacity-0"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
