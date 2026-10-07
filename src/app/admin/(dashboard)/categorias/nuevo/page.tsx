import { CategoryForm } from "@/components/admin/CategoryForm";
import { createCategoryAction } from "@/lib/admin/actions/categories";

export const metadata = { title: "Nueva categoría" };

export default function NewCategoryPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Nueva categoría</h1>
        <p className="mt-1 text-sm text-ink/60">Aparecerá en la tienda y en el menú de navegación.</p>
      </div>
      <CategoryForm action={createCategoryAction} />
    </div>
  );
}
