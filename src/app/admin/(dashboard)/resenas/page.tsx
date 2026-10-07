import Link from "next/link";
import { getAllReviews } from "@/lib/admin/reviews";
import { getAllRoutineReviews } from "@/lib/routine-reviews";
import { getRoutineBySlug } from "@/data/routines";
import { getAllProductsAdmin } from "@/data/products";
import { ReviewModerationRow } from "@/components/admin/ReviewModerationRow";

export const metadata = { title: "Reseñas" };

const TABLE_HEAD = "border-b border-border text-left text-xs font-semibold uppercase tracking-wide text-ink/50";

const FILTERS = [
  { value: "todas", label: "Todas" },
  { value: "pending", label: "Pendientes" },
  { value: "approved", label: "Publicadas" },
  { value: "rejected", label: "Rechazadas" },
  { value: "fotos", label: "Con fotos" },
];

export default async function AdminReviewsPage({ searchParams }: { searchParams: Promise<{ estado?: string }> }) {
  const { estado = "todas" } = await searchParams;
  const allReviews = getAllReviews();
  const productNames = new Map(getAllProductsAdmin().map((product) => [product.slug, product.name]));
  // Las pendientes arriba: son las que esperan una decisión.
  const reviews = allReviews
    .filter((review) =>
      estado === "todas" ? true : estado === "fotos" ? review.photos.length > 0 : review.status === estado
    )
    .sort((a, b) => Number(b.status === "pending") - Number(a.status === "pending"));
  const pendingProducts = allReviews.filter((review) => review.status === "pending").length;
  const routineReviews = getAllRoutineReviews();
  const pendingRoutines = routineReviews.filter((review) => review.status === "pending").length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Reseñas</h1>
        <p className="mt-1 text-sm text-ink/60">
          {allReviews.length} de productos · {routineReviews.length} de rutinas
        </p>
      </div>

      <h2 className="font-display text-lg font-bold text-ink">
        Productos
        {pendingProducts > 0 && (
          <span className="pill-badge ml-2 bg-peach-100 align-middle text-peach-600">{pendingProducts} pendientes</span>
        )}
      </h2>
      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((filter) => (
          <Link
            key={filter.value}
            href={filter.value === "todas" ? "/admin/resenas" : `/admin/resenas?estado=${filter.value}`}
            className={`rounded-pill px-4 py-2 text-xs font-semibold transition-colors ${
              estado === filter.value
                ? "bg-ink text-white"
                : "border border-border bg-white text-ink/70 hover:border-blush-300"
            }`}
          >
            {filter.label}
          </Link>
        ))}
      </div>
      <div className="card-surface overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className={TABLE_HEAD}>
              <th className="px-5 py-3">Producto</th>
              <th className="px-5 py-3">Cliente</th>
              <th className="px-5 py-3">Calificación</th>
              <th className="px-5 py-3">Comentario</th>
              <th className="px-5 py-3">Estado</th>
              <th className="px-5 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <ReviewModerationRow
                key={review.id}
                review={review}
                subject={productNames.get(review.productSlug) ?? review.productSlug}
              />
            ))}
            {reviews.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-sm text-ink/50">
                  {estado === "todas" ? "Todavía no hay reseñas de clientes." : "No hay reseñas con este filtro."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <h2 className="mt-4 font-display text-lg font-bold text-ink">
        Rutinas
        {pendingRoutines > 0 && (
          <span className="pill-badge ml-2 bg-peach-100 align-middle text-peach-600">{pendingRoutines} pendientes</span>
        )}
      </h2>
      <div className="card-surface overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className={TABLE_HEAD}>
              <th className="px-5 py-3">Rutina</th>
              <th className="px-5 py-3">Cliente</th>
              <th className="px-5 py-3">Calificación</th>
              <th className="px-5 py-3">Comentario</th>
              <th className="px-5 py-3">Estado</th>
              <th className="px-5 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {routineReviews.map((review) => (
              <ReviewModerationRow
                key={review.id}
                review={review}
                subject={getRoutineBySlug(review.routineSlug)?.name ?? review.routineSlug}
                kind="routine"
              />
            ))}
            {routineReviews.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-sm text-ink/50">
                  Todavía no hay reseñas de rutinas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
