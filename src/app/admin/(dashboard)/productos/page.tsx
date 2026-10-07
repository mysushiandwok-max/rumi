import Link from "next/link";
import { getAllProductsAdmin } from "@/data/products";
import { getAllCategories } from "@/data/categories";
import { formatCOP } from "@/lib/format";
import { PlusIcon, SearchIcon } from "@/components/icons";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";

export const metadata = { title: "Productos" };

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; categoria?: string; estado?: string }>;
}) {
  const { q = "", categoria = "todas", estado = "todos" } = await searchParams;
  const categories = getAllCategories();
  const query = q.trim().toLowerCase();

  const products = getAllProductsAdmin().filter((p) => {
    const matchesQuery = !query || p.name.toLowerCase().includes(query) || (p.sku ?? "").toLowerCase().includes(query);
    const matchesCategory = categoria === "todas" || p.categorySlug === categoria;
    const matchesStatus = estado === "todos" || p.status === estado;
    return matchesQuery && matchesCategory && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Productos</h1>
          <p className="mt-1 text-sm text-ink/60">{products.length} productos</p>
        </div>
        <Link href="/admin/productos/nuevo" className="btn-primary px-5 py-2.5 text-sm">
          <PlusIcon className="h-4 w-4" />
          Nuevo producto
        </Link>
      </div>

      <form className="card-surface flex flex-wrap items-center gap-3 p-4">
        <div className="relative flex-1 min-w-[200px]">
          <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Buscar por nombre o SKU..."
            className="input-field pl-10"
          />
        </div>
        <select name="categoria" defaultValue={categoria} className="input-field w-auto">
          <option value="todas">Todas las categorías</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <select name="estado" defaultValue={estado} className="input-field w-auto">
          <option value="todos">Todos los estados</option>
          <option value="published">Publicado</option>
          <option value="draft">Borrador</option>
        </select>
        <button type="submit" className="btn-secondary px-4 py-2.5 text-sm">
          Filtrar
        </button>
      </form>

      <div className="card-surface overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wide text-ink/50">
              <th className="px-5 py-3">Producto</th>
              <th className="px-5 py-3">Categoría</th>
              <th className="px-5 py-3">Precio</th>
              <th className="px-5 py-3">Stock</th>
              <th className="px-5 py-3">Estado</th>
              <th className="px-5 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const category = categories.find((c) => c.slug === product.categorySlug);
              const lowStock = product.stock <= product.lowStockThreshold;
              return (
                <tr key={product.id} className="border-b border-border/60 last:border-0 hover:bg-blush-50/40">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {product.images[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.images[0]}
                          alt=""
                          className="h-10 w-10 shrink-0 rounded-xl2 border border-border object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 shrink-0 rounded-xl2 bg-blush-50" />
                      )}
                      <div>
                        <p className="font-semibold text-ink">{product.name}</p>
                        <p className="text-xs text-ink/45">{product.sku || product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-ink/70">{category?.name ?? product.categorySlug}</td>
                  <td className="px-5 py-3 font-semibold text-ink">{formatCOP(product.price)}</td>
                  <td className="px-5 py-3">
                    <span className={lowStock ? "font-bold text-blush-600" : "text-ink/70"}>{product.stock}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`pill-badge ${
                        product.status === "published" ? "bg-mint-100 text-mint-700" : "bg-ink/5 text-ink/50"
                      }`}
                    >
                      {product.status === "published" ? "Publicado" : "Borrador"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/admin/productos/${product.id}`} className="text-sm font-semibold text-blush-600 hover:text-blush-700">
                        Editar
                      </Link>
                      <DeleteProductButton id={product.id} name={product.name} />
                    </div>
                  </td>
                </tr>
              );
            })}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-sm text-ink/50">
                  No se encontraron productos con esos filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
