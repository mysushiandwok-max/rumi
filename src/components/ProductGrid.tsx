import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/lib/types";

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="card-surface flex flex-col items-center gap-2 px-6 py-16 text-center">
        <p className="font-display text-lg font-bold text-ink">No encontramos productos</p>
        <p className="text-sm text-ink/60">Intenta con otra categoría, marca o término de búsqueda.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </div>
  );
}
