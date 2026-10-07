import { ProductForm } from "@/components/admin/ProductForm";
import { getAllCategories } from "@/data/categories";
import { getAllProductsAdmin } from "@/data/products";
import { brands } from "@/data/brands";
import { createProductAction } from "@/lib/admin/actions/products";

export const metadata = { title: "Nuevo producto" };

export default function NewProductPage() {
  const categories = getAllCategories();
  const productOptions = getAllProductsAdmin().map(({ slug, name }) => ({ slug, name }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Nuevo producto</h1>
        <p className="mt-1 text-sm text-ink/60">Completa la información para publicarlo en la tienda.</p>
      </div>
      <ProductForm categories={categories} brands={brands} productOptions={productOptions} action={createProductAction} />
    </div>
  );
}
