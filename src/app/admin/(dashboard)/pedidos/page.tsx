import Link from "next/link";
import { getAllOrders } from "@/lib/admin/orders";
import { formatCOP } from "@/lib/format";

export const metadata = { title: "Pedidos" };

const STATUS_STYLES: Record<string, string> = {
  pendiente: "bg-peach-100 text-peach-600",
  procesando: "bg-lavender-100 text-lavender-600",
  enviado: "bg-mint-100 text-mint-700",
  entregado: "bg-mint-100 text-mint-700",
  cancelado: "bg-ink/5 text-ink/50",
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>;
}) {
  const { estado = "todos" } = await searchParams;
  const orders = getAllOrders().filter((o) => estado === "todos" || o.status === estado);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Pedidos</h1>
        <p className="mt-1 text-sm text-ink/60">{orders.length} pedidos</p>
      </div>

      <form className="flex flex-wrap items-center gap-2">
        {["todos", "pendiente", "procesando", "enviado", "entregado", "cancelado"].map((s) => (
          <Link
            key={s}
            href={s === "todos" ? "/admin/pedidos" : `/admin/pedidos?estado=${s}`}
            className={`rounded-pill px-4 py-2 text-xs font-semibold transition-colors ${
              estado === s ? "bg-ink text-white" : "bg-white text-ink/70 border border-border hover:border-blush-300"
            }`}
          >
            {s === "todos" ? "Todos" : s[0].toUpperCase() + s.slice(1)}
          </Link>
        ))}
      </form>

      <div className="card-surface overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wide text-ink/50">
              <th className="px-5 py-3">Pedido</th>
              <th className="px-5 py-3">Cliente</th>
              <th className="px-5 py-3">Fecha</th>
              <th className="px-5 py-3">Total</th>
              <th className="px-5 py-3">Estado</th>
              <th className="px-5 py-3 text-right">Detalle</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-border/60 last:border-0 hover:bg-blush-50/40">
                <td className="px-5 py-3 font-semibold text-ink">#{order.orderNumber}</td>
                <td className="px-5 py-3 text-ink/70">
                  <p>{order.customerName}</p>
                  <p className="text-xs text-ink/45">{order.customerEmail}</p>
                </td>
                <td className="px-5 py-3 text-ink/60">
                  {new Date(order.createdAt).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" })}
                </td>
                <td className="px-5 py-3 font-semibold text-ink">{formatCOP(order.total)}</td>
                <td className="px-5 py-3">
                  <span className={`pill-badge ${STATUS_STYLES[order.status]}`}>{order.status}</span>
                </td>
                <td className="px-5 py-3 text-right">
                  <Link href={`/admin/pedidos/${order.id}`} className="text-sm font-semibold text-blush-600 hover:text-blush-700">
                    Ver
                  </Link>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-sm text-ink/50">
                  No hay pedidos con este filtro.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
