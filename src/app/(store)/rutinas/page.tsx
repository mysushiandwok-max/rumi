import type { Metadata } from "next";
import { RutinasClient } from "@/components/RutinasClient";
import { routines } from "@/data/routines";
import { getRoutinePreviewProducts } from "@/lib/routine-previews";
import { ROUTINE_COLLECTIONS } from "@/components/routines/collections";
import { SKIN_TYPE_SLUGS } from "@/components/routines/skin-types";
import type { Product, RoutineCollection } from "@/lib/types";

export const metadata: Metadata = { title: "Rutinas" };

export default async function RutinasPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // "?coleccion=iniciar", "?piel=grasa" y "?favoritas=1" abren la página con ese filtro ya activo (los usa el inicio).
  const { coleccion, piel, favoritas } = await searchParams;
  const initialOnlyFeatured = favoritas === "1";
  const initialSkinType = typeof piel === "string" ? SKIN_TYPE_SLUGS[piel] : undefined;
  const initialCollection =
    typeof coleccion === "string" && coleccion in ROUTINE_COLLECTIONS ? (coleccion as RoutineCollection) : undefined;

  const productPreviews: Record<string, Product[]> = Object.fromEntries(
    routines.map((routine) => [routine.slug, getRoutinePreviewProducts(routine)])
  );

  return (
    <RutinasClient
      key={`${initialCollection ?? "todas"}-${initialSkinType ?? "todas"}-${initialOnlyFeatured}`}
      routines={routines}
      productPreviews={productPreviews}
      initialCollection={initialCollection}
      initialSkinType={initialSkinType}
      initialOnlyFeatured={initialOnlyFeatured}
    />
  );
}
