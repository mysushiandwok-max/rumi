import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BrandLogo } from "@/components/BrandLogo";
import { ProductArt } from "@/components/illustrations/ProductArt";
import { ArrowRightIcon } from "@/components/icons";
import { getBrandsByPopularity } from "@/data/brands";
import { getProductsByBrand } from "@/data/products";

export const metadata: Metadata = { title: "Marcas" };

const PRODUCT_TONE_BG: Record<string, string> = {
  blush: "bg-blush-50",
  mint: "bg-mint-50",
  peach: "bg-peach-50",
  lavender: "bg-lavender-50",
};

// Cuántas fotos de producto se asoman en la tarjeta de la marca (el resto se ve entrando a la marca).
const PREVIEW_COUNT = 3;

export default function MarcasPage() {
  return (
    <div className="container-page py-10 sm:py-14">
      <Breadcrumbs items={[{ label: "Marcas" }]} />
      <div className="max-w-2xl">
        <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">Marcas que amamos</h1>
        <p className="mt-3 text-base leading-relaxed text-ink/65">
          Un catálogo curado de marcas coreanas, cada una con su propia filosofía de piel.
          Desde fórmulas minimalistas hasta la sabiduría tradicional del hanbang.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {getBrandsByPopularity().map((brand) => {
          const products = getProductsByBrand(brand.slug);
          const preview = products.slice(0, PREVIEW_COUNT);
          const extra = products.length - preview.length;

          return (
            <Link
              key={brand.slug}
              href={`/marcas/${brand.slug}`}
              className="card-surface group flex flex-col justify-between border border-border/70 p-7 transition-all duration-200 ease-out-strong hover:-translate-y-1 hover:border-blush-200 hover:shadow-soft"
            >
              <div>
                <BrandLogo
                  brand={brand}
                  className="h-8 w-auto max-w-[70%] object-contain"
                  fallbackClassName="font-display text-2xl font-bold text-ink"
                />
                <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-ink/45">{brand.origin}</p>
                <p className="mt-3 text-sm leading-relaxed text-ink/65">{brand.description}</p>
              </div>

              {preview.length > 0 && (
                <div className="mt-6 flex items-center gap-2.5">
                  {preview.map((product) => (
                    <div
                      key={product.slug}
                      className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-xl ${PRODUCT_TONE_BG[product.tone]}`}
                    >
                      {product.images[0] ? (
                        <Image src={product.images[0]} alt={product.name} fill sizes="56px" className="object-cover" />
                      ) : (
                        <ProductArt
                          variant={product.artVariant}
                          tone={product.tone}
                          label={product.name}
                          className="h-full w-full p-1.5"
                        />
                      )}
                    </div>
                  ))}
                  {extra > 0 && (
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-cream text-xs font-semibold text-ink/50">
                      +{extra}
                    </span>
                  )}
                </div>
              )}

              <div className="mt-6 flex items-center justify-between border-t border-border/70 pt-5">
                <span className="text-xs font-semibold text-ink/50">
                  {products.length} producto{products.length === 1 ? "" : "s"}
                </span>
                <span className="flex items-center gap-1.5 text-sm font-semibold text-ink">
                  Ver marca
                  <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-150 ease-out-strong group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
