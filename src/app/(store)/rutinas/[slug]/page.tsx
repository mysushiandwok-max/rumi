import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { RoutineDetailView } from "@/components/RoutineDetailView";
import { routines, getRoutineBySlug, getSuggestedRoutines } from "@/data/routines";
import { getRoutinePreviewProducts } from "@/lib/routine-previews";
import { getApprovedRoutineReviews, getRoutineRatingSummary } from "@/lib/routine-reviews";
import { getProductBySlug } from "@/data/products";
import { getBrandBySlug } from "@/data/brands";

export function generateStaticParams() {
  return routines.map((routine) => ({ slug: routine.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const routine = getRoutineBySlug(slug);
  return { title: routine ? routine.name : "Rutina" };
}

export default async function RoutinePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const routine = getRoutineBySlug(slug);
  if (!routine) notFound();

  const stepsWithProducts = routine.steps.map((step) => {
    const product = getProductBySlug(step.productSlug);
    return { step, product, brandName: product ? getBrandBySlug(product.brandSlug)?.name : undefined };
  });

  // Anterior/siguiente en el mismo orden de /rutinas, dando la vuelta en los extremos.
  const index = routines.findIndex((entry) => entry.slug === routine.slug);
  const previous = routines[(index - 1 + routines.length) % routines.length];
  const next = routines[(index + 1) % routines.length];

  const suggestions = getSuggestedRoutines(routine, 3, [previous.slug, next.slug]).map((suggested) => ({
    routine: suggested,
    previewProducts: getRoutinePreviewProducts(suggested),
  }));

  return (
    <RoutineDetailView
      routine={routine}
      stepsWithProducts={stepsWithProducts}
      previous={previous}
      next={next}
      reviews={getApprovedRoutineReviews(routine.slug)}
      ratingSummary={getRoutineRatingSummary(routine.slug)}
      suggestions={suggestions}
    />
  );
}
