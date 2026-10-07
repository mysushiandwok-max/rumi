import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductDetailView } from "@/components/ProductDetailView";
import { ProductBanner, ProductCompareSection, ProductFaqSection, ProductLandingSections } from "@/components/product/ProductLandingSections";
import { ProductReviews } from "@/components/ProductReviews";
import { ProductCarousel } from "@/components/ProductCarousel";
import { getAllProducts, getProductBySlug, getProductsByCategory } from "@/data/products";
import { getBrandBySlug } from "@/data/brands";
import { getCategoryBySlug } from "@/data/categories";
import { getApprovedReviewsForProduct } from "@/lib/admin/reviews";
import { getRoutinesWithProduct } from "@/data/routines";
import { getRoutinePreviewProducts } from "@/lib/routine-previews";
import { RoutineCard } from "@/components/routines/RoutineCard";
import { Reveal } from "@/components/category/Reveal";

export function generateStaticParams() {
  return getAllProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  return {
    title: product ? product.name : "Producto",
    description: product?.shortDescription,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product || product.status !== "published") notFound();

  const brand = getBrandBySlug(product.brandSlug);
  const category = getCategoryBySlug(product.categorySlug);
  const related = getProductsByCategory(product.categorySlug)
    .filter((p) => p.slug !== product.slug)
    .slice(0, 4);
  const reviews = getApprovedReviewsForProduct(product.slug);
  const bySlugs = (slugs: string[]) =>
    slugs.map(getProductBySlug).filter((p): p is NonNullable<typeof p> => p?.status === "published");
  const pairProducts = bySlugs(product.landing.pairWith);
  const compareProducts = bySlugs(product.landing.compareWith);
  const routines = getRoutinesWithProduct(product.slug).map((routine) => ({
    routine,
    previewProducts: getRoutinePreviewProducts(routine),
  }));

  return (
    <div className="pb-24">
      <ProductDetailView product={product} brand={brand} category={category} />
      <ProductLandingSections product={product} pairProducts={pairProducts} />

      {routines.length > 0 && (
        <section aria-labelledby="rutinas-title" className="container-page mt-24 sm:mt-32">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2
                id="rutinas-title"
                className="max-w-3xl text-balance font-display text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl lg:text-5xl"
              >
                Rutinas con este producto
              </h2>
              <p className="mt-3 text-sm text-ink/60 sm:text-base">
                Te recomendamos cómo combinarlo, paso a paso, según tu piel y tu momento del día.
              </p>
            </div>
            <Link href="/rutinas" className="text-sm font-semibold text-blush-600 hover:text-blush-700">
              Ver todas las rutinas →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {routines.map(({ routine, previewProducts }, index) => (
              <Reveal key={routine.slug} delay={index * 70} className="h-full">
                <RoutineCard routine={routine} previewProducts={previewProducts} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {product.landing.banners[1] && (
        <div className="container-page mt-24 sm:mt-32">
          <ProductBanner banner={product.landing.banners[1]} tone={product.tone} />
        </div>
      )}

      <section id="resenas" className="container-page mt-24 scroll-mt-28 sm:mt-32">
        <ProductReviews productSlug={product.slug} reviews={reviews} rating={product.rating} reviewCount={product.reviewCount} />
      </section>

      <ProductCompareSection product={product} others={compareProducts} />
      <ProductFaqSection product={product} />

      {related.length > 0 && (
        <section className="container-page mt-24 sm:mt-32">
          <h2 className="mb-8 font-display text-2xl font-bold text-ink sm:text-3xl">También te puede gustar</h2>
          <ProductCarousel products={related} />
        </section>
      )}
    </div>
  );
}
