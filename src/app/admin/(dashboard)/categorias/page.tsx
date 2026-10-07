import Link from "next/link";
import { getAllCategories } from "@/data/categories";
import { getAllProductsAdmin } from "@/data/products";
import { PlusIcon } from "@/components/icons";
import { DeleteCategoryButton } from "@/components/admin/DeleteCategoryButton";

export const metadata = { title: "Categorías" };

const TONE_BADGE: Record<string, string> = {
  blush: "bg-blush-100 text-blush-700",
  mint: "bg-mint-100 text-mint-700",
  peach: "bg-peach-100 text-peach-600",
  lavender: "bg-lavender-100 text-lavender-600",
};

export default function AdminCategoriesPage() {
  const categories = getAllCategories();
  const products = getAllProductsAdmin();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Categorías</h1>
          <p className="mt-1 text-sm text-ink/60">{categories.length} categorías</p>
        </div>
        <Link href="/admin/categorias/nuevo" className="btn-primary px-5 py-2.5 text-sm">
          <PlusIcon className="h-4 w-4" />
          Nueva categoría
        </Link>
      </div>

      <div className="card-surface overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wide text-ink/50">
              <th className="px-5 py-3">Categoría</th>
              <th className="px-5 py-3">Tono</th>
              <th className="px-5 py-3">Productos</th>
              <th className="px-5 py-3">Orden</th>
              <th className="px-5 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => {
              const count = products.filter((p) => p.categorySlug === category.slug).length;
              return (
                <tr key={category.id} className="border-b border-border/60 last:border-0 hover:bg-blush-50/40">
                  <td className="px-5 py-3">
                    <p className="font-semibold text-ink">{category.name}</p>
                    <p className="text-xs text-ink/45">{category.slug}</p>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`pill-badge ${TONE_BADGE[category.tone]}`}>
                      {category.tone}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-ink/70">{count}</td>
                  <td className="px-5 py-3 text-ink/70">{category.sortOrder}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/admin/categorias/${category.id}`} className="text-sm font-semibold text-blush-600 hover:text-blush-700">
                        Editar
                      </Link>
                      <DeleteCategoryButton id={category.id} name={category.name} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
