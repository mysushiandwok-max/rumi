import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductGrid } from "@/components/ProductGrid";
import { ProductArt } from "@/components/illustrations/ProductArt";
import { CategoryComparison, type ComparisonRowView } from "@/components/category/CategoryComparison";
import { CategoryEducation } from "@/components/category/CategoryEducation";
import { CategoryGuide, type GuideGroupView } from "@/components/category/CategoryGuide";
import { CategoryMiniBanners, type MiniBannerItem } from "@/components/category/CategoryMiniBanners";
import { getBrandBySlug } from "@/data/brands";
import { getAllCategories, getCategoryBySlug } from "@/data/categories";
import { getProductsByCategory } from "@/data/products";
import type { Category } from "@/lib/types";

const TONE_STYLES: Record<string, string> = {
  blush: "bg-blush-100",
  mint: "bg-mint-100",
  peach: "bg-peach-100",
  lavender: "bg-lavender-100",
};

const TONE_OVERLAY: Record<string, string> = {
  blush: "bg-blush-100/75",
  mint: "bg-mint-100/75",
  peach: "bg-peach-100/75",
  lavender: "bg-lavender-100/75",
};

// Tónicos no debe aparecer como destino en "sigue explorando"; en su lugar hay un banner fijo a Rutinas.
const HIDDEN_MINI_BANNER_SLUG = "tonicos";

const RUTINAS_MINI_BANNER: MiniBannerItem = {
  type: "routine",
  name: "Rutinas",
  tagline: "Paso a paso, sin adivinar qué sigue. Elige por nivel, tipo de piel o momento del día y arma tu rutina completa.",
  tone: "peach",
};

function toCategoryMiniBanner(category: Category): MiniBannerItem {
  return {
    type: "category",
    slug: category.slug,
    name: category.name,
    tagline: category.tagline,
    tone: category.tone,
    artVariant: category.artVariant,
    bannerPath: category.bannerPath,
  };
}

export function generateStaticParams() {
  return getAllCategories().map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  return {
    title: category ? category.name : "Categoría",
    description: category?.description,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const categoryProducts = getProductsByCategory(category.slug);
  const bannerImage = category.bannerPath;

  // Las secciones de contenido solo usan productos publicados de esta categoría.
  const productsBySlug = new Map(categoryProducts.map((product) => [product.slug, product]));
  const { guide, comparison, education, showMiniBanners } = category.content;

  const guideGroups: GuideGroupView[] = guide.groups
    .map((group) => ({
      title: group.title,
      items: group.items
        .map((item) => ({
          label: item.label,
          blurb: item.blurb,
          products: item.productSlugs.flatMap((productSlug) => productsBySlug.get(productSlug) ?? []),
        }))
        .filter((item) => item.products.length > 0),
    }))
    .filter((group) => group.items.length > 0);

  const comparisonRows: ComparisonRowView[] = comparison.rows.flatMap((row) => {
    const product = productsBySlug.get(row.productSlug);
    if (!product) return [];
    return [
      {
        product,
        brandName: getBrandBySlug(product.brandSlug)?.name,
        skinType: row.skinType || product.skinTypes.join(", "),
        texture: row.texture,
        keyIngredient: row.keyIngredient,
        moment: row.moment,
      },
    ];
  });

  const educationPoints = education.title ? education.points : [];

  // Se ven todas las demás categorías (menos Tónicos, que ya no es destino) y el banner de Rutinas cierra la fila.
  const exploreItems: MiniBannerItem[] = showMiniBanners
    ? [
        ...getAllCategories()
          .filter((other) => other.slug !== category.slug && other.slug !== HIDDEN_MINI_BANNER_SLUG)
          .map(toCategoryMiniBanner),
        RUTINAS_MINI_BANNER,
      ]
    : [];

  const hasExtraSections =
    guideGroups.length > 0 || comparisonRows.length > 0 || educationPoints.length > 0 || exploreItems.length > 0;

  return (
    <div className="container-page py-10 sm:py-14">
      <Breadcrumbs items={[{ label: "Tienda", href: "/tienda" }, { label: category.name }]} />

      <div
        className={`relative overflow-hidden rounded-[2rem] ${TONE_STYLES[category.tone]} px-8 py-12 sm:px-12 sm:py-16 ${
          bannerImage ? "flex items-center sm:aspect-[1280/300]" : ""
        }`}
      >
        {bannerImage ? (
          <>
            <Image
              src={bannerImage}
              alt=""
              fill
              sizes="(min-width: 1360px) 1280px, 100vw"
              loading="eager"
              fetchPriority="high"
              className="pointer-events-none object-cover object-right-bottom sm:object-bottom"
            />
            <div className={`absolute inset-0 ${TONE_OVERLAY[category.tone]} sm:hidden`} aria-hidden="true" />
          </>
        ) : null}
        <div className="relative z-10 max-w-lg">
          <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">{category.name}</h1>
          <p className="mt-2 font-display text-lg text-ink/70">{category.tagline}</p>
          <p className="mt-4 text-sm leading-relaxed text-ink/65 sm:text-base">{category.description}</p>
        </div>
        {!bannerImage ? (
          <ProductArt
            variant={category.artVariant}
            tone={category.tone}
            label={category.name}
            className="pointer-events-none absolute -bottom-10 -right-8 h-52 w-auto opacity-90 sm:h-64"
          />
        ) : null}
      </div>

      <div className="mt-10">
        <p className="mb-6 text-sm text-ink/60">
          {categoryProducts.length} producto{categoryProducts.length === 1 ? "" : "s"} en esta categoría
        </p>
        <ProductGrid products={categoryProducts} />
      </div>

      {hasExtraSections && (
        <div className="mt-16 flex flex-col gap-16 sm:mt-24 sm:gap-24">
          {guideGroups.length > 0 && (
            <CategoryGuide
              title={guide.title || "Encuentra el ideal para ti"}
              intro={guide.intro}
              tone={category.tone}
              groups={guideGroups}
            />
          )}
          {comparisonRows.length > 0 && (
            <CategoryComparison
              title={comparison.title || "Compara de un vistazo"}
              tone={category.tone}
              rows={comparisonRows}
            />
          )}
          {educationPoints.length > 0 && (
            <CategoryEducation title={education.title} intro={education.intro} points={educationPoints} />
          )}
          {exploreItems.length > 0 && <CategoryMiniBanners items={exploreItems} />}
        </div>
      )}
    </div>
  );
}
