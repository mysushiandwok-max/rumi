import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductGrid } from "@/components/ProductGrid";
import { BrandLogo } from "@/components/BrandLogo";
import { HeartIcon, SparkleIcon } from "@/components/icons";
import { brands, getBrandBySlug } from "@/data/brands";
import { getProductsByBrand } from "@/data/products";
import { getBrandBannerImage } from "@/lib/brand-assets";

const TONE_STYLES: Record<string, { bg: string; circle: string; heart: string; heart2: string }> = {
  blush: { bg: "bg-blush-100", circle: "bg-blush-200/70", heart: "text-blush-300", heart2: "text-lavender-300" },
  mint: { bg: "bg-mint-100", circle: "bg-mint-200/70", heart: "text-blush-300", heart2: "text-mint-300" },
  peach: { bg: "bg-peach-100", circle: "bg-peach-200/70", heart: "text-blush-300", heart2: "text-peach-300" },
  lavender: { bg: "bg-lavender-100", circle: "bg-lavender-200/70", heart: "text-blush-300", heart2: "text-lavender-300" },
};

// Corazones decorativos del banner: posición, tamaño, giro, relleno y color (1 = heart, 2 = heart2)
const HEARTS = [
  { pos: "right-[8%] top-10", size: "h-16 w-16", rot: "-rotate-12", fill: true, c: 1, delay: "0s" },
  { pos: "right-[26%] top-8", size: "h-7 w-7", rot: "rotate-12", fill: false, c: 2, delay: "0.6s" },
  { pos: "right-[18%] bottom-10", size: "h-10 w-10", rot: "rotate-6", fill: true, c: 2, delay: "1.2s" },
  { pos: "right-[36%] bottom-8", size: "h-6 w-6", rot: "-rotate-6", fill: true, c: 1, delay: "1.8s" },
  { pos: "right-[4%] bottom-16", size: "h-6 w-6", rot: "rotate-12", fill: false, c: 1, delay: "2.4s" },
  { pos: "right-[30%] top-[45%]", size: "h-5 w-5", rot: "-rotate-12", fill: false, c: 1, delay: "0.9s" },
  { pos: "right-[14%] top-[48%]", size: "h-8 w-8", rot: "-rotate-3", fill: true, c: 1, delay: "1.5s" },
];

export function generateStaticParams() {
  return brands.map((brand) => ({ slug: brand.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);
  return { title: brand ? brand.name : "Marca" };
}

export default async function BrandPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);
  if (!brand) notFound();

  const brandProducts = getProductsByBrand(brand.slug);
  const bannerImage = getBrandBannerImage(brand.slug);
  const tone = TONE_STYLES[brand.tone] ?? TONE_STYLES.peach;

  return (
    <div className="container-page py-10 sm:py-14">
      <Breadcrumbs items={[{ label: "Marcas", href: "/marcas" }, { label: brand.name }]} />

      <div
        className={`relative overflow-hidden rounded-[2rem] px-8 py-12 sm:px-12 sm:py-16 ${
          bannerImage ? "bg-cover bg-center" : tone.bg
        }`}
        style={bannerImage ? { backgroundImage: `url(${bannerImage})` } : undefined}
      >
        {bannerImage ? (
          <div className="absolute inset-0 bg-ink/45" />
        ) : (
          <div aria-hidden className="pointer-events-none absolute inset-0 hidden sm:block">
            <div className={`absolute -right-16 -top-20 h-72 w-72 rounded-full ${tone.circle}`} />
            <div className={`absolute -bottom-16 right-[22%] h-40 w-40 rounded-full ${tone.circle}`} />
            <div className="absolute right-[40%] top-10 h-3 w-3 rounded-full bg-white/80" />
            <div className="absolute right-[10%] bottom-8 h-2 w-2 rounded-full bg-white/80" />
            {HEARTS.map((h, i) => (
              <HeartIcon
                key={i}
                fill={h.fill ? "currentColor" : "none"}
                className={`absolute animate-float ${h.pos} ${h.size} ${h.rot} ${h.c === 1 ? tone.heart : tone.heart2}`}
                style={{ animationDelay: h.delay }}
              />
            ))}
            <SparkleIcon className="absolute right-[44%] bottom-14 h-5 w-5 animate-float text-white" style={{ animationDelay: "2s" }} />
          </div>
        )}
        <div className="relative">
          <p
            className={`text-xs font-semibold uppercase tracking-wide ${
              bannerImage ? "text-white/75" : "text-ink/50"
            }`}
          >
            {brand.origin}
          </p>
          <h1 className={`mt-3 ${bannerImage ? "inline-flex rounded-2xl bg-white/95 px-5 py-3 shadow-soft" : ""}`}>
            <BrandLogo
              brand={brand}
              className="h-10 w-auto max-w-[240px] object-contain sm:h-12"
              fallbackClassName="font-display text-3xl font-bold text-ink sm:text-4xl"
            />
          </h1>
          <p className={`mt-2 font-display text-lg ${bannerImage ? "text-white/90" : "text-ink/70"}`}>
            {brand.tagline}
          </p>
          <p
            className={`mt-4 max-w-xl text-sm leading-relaxed sm:text-base ${
              bannerImage ? "text-white/80" : "text-ink/65"
            }`}
          >
            {brand.description}
          </p>
        </div>
      </div>

      <div className="mt-10">
        <p className="mb-6 text-sm text-ink/60">
          {brandProducts.length} producto{brandProducts.length === 1 ? "" : "s"} de {brand.name}
        </p>
        <ProductGrid products={brandProducts} />
      </div>
    </div>
  );
}
