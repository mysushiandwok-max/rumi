import "server-only";
import { getProductBySlug } from "@/data/products";
import type { Product, Routine } from "@/lib/types";

// Productos (con foto) de una rutina, en el orden de los pasos y sin repetir: lo que muestra su collage.
// Se resuelve en el servidor porque los componentes cliente no pueden importar @/data/products.
export function getRoutinePreviewProducts(routine: Routine): Product[] {
  const seen = new Set<string>();
  return routine.steps
    .map((step) => getProductBySlug(step.productSlug))
    .filter((product): product is Product => {
      if (!product || product.images.length === 0 || seen.has(product.slug)) return false;
      seen.add(product.slug);
      return true;
    });
}
