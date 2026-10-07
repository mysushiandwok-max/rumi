import { notFound } from "next/navigation";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { getCategoryById } from "@/data/categories";
import { getAllProductsAdmin } from "@/data/products";
import { updateCategoryAction } from "@/lib/admin/actions/categories";

export const metadata = { title: "Editar categoría" };

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = getCategoryById(Number(id));
  if (!category) notFound();

  const boundAction = updateCategoryAction.bind(null, category.id);
  const productOptions = getAllProductsAdmin()
    .filter((product) => product.categorySlug === category.slug)
    .map((product) => ({ slug: product.slug, name: product.name, draft: product.status === "draft" }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Editar categoría</h1>
        <p className="mt-1 text-sm text-ink/60">{category.name}</p>
      </div>
      <CategoryForm category={category} action={boundAction} productOptions={productOptions} />
    </div>
  );
}
