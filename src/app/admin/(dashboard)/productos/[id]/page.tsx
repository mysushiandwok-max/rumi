import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { getAllProductsAdmin, getProductById } from "@/data/products";
import { getAllCategories } from "@/data/categories";
import { brands } from "@/data/brands";
import { updateProductAction } from "@/lib/admin/actions/products";

export const metadata = { title: "Editar producto" };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProductById(Number(id));
  if (!product) notFound();

  const categories = getAllCategories();
  const productOptions = getAllProductsAdmin().map(({ slug, name }) => ({ slug, name }));
  const boundAction = updateProductAction.bind(null, product.id);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Editar producto</h1>
          <p className="mt-1 text-sm text-ink/60">{product.name}</p>
        </div>
        <a
          href={`/producto/${product.slug}`}
          target="_blank"
          rel="noreferrer"
          className="btn-secondary px-4 py-2 text-sm"
        >
          Ver en la tienda ↗
        </a>
      </div>
      <ProductForm product={product} categories={categories} brands={brands} productOptions={productOptions} action={boundAction} />
    </div>
  );
}
