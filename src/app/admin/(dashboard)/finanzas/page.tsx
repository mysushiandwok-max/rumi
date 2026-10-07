import Link from "next/link";
import { getAllOrders } from "@/lib/admin/orders";
import { computeDashboardMetrics } from "@/lib/admin/metrics";
import { formatCOP } from "@/lib/format";
import { KpiCard } from "@/components/admin/KpiCard";
import { RevenueChart } from "@/components/admin/RevenueChart";

export const metadata = { title: "Finanzas" };

export default function AdminFinancePage() {
  const metrics = computeDashboardMetrics();
  const orders = getAllOrders();

  const paidRevenue = orders.filter((o) => o.paymentStatus === "pagado").reduce((sum, o) => sum + o.total, 0);
  const pendingRevenue = orders.filter((o) => o.paymentStatus === "pendiente").reduce((sum, o) => sum + o.total, 0);
  const topOrders = [...orders].sort((a, b) => b.total - a.total).slice(0, 8);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Finanzas</h1>
          <p className="mt-1 text-sm text-ink/60">Resumen de ingresos y pagos</p>
        </div>
        <a href="/admin/finanzas/exportar" className="btn-secondary px-5 py-2.5 text-sm">
          Exportar CSV
        </a>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Ingresos 30 días" value={formatCOP(metrics.revenue30d)} tone="blush" />
        <KpiCard label="Pagos confirmados" value={formatCOP(paidRevenue)} tone="mint" />
        <KpiCard label="Pagos pendientes" value={formatCOP(pendingRevenue)} tone="peach" />
        <KpiCard label="Ticket promedio" value={formatCOP(Math.round(metrics.avgOrderValue))} tone="lavender" />
      </div>

      <div className="card-surface p-6">
        <h2 className="font-display text-base font-bold text-ink">Ingresos últimos 14 días</h2>
        <div className="mt-4">
          <RevenueChart data={metrics.revenueByDay} />
        </div>
      </div>

      <div className="card-surface overflow-x-auto p-0">
        <div className="border-b border-border px-5 py-3">
          <h2 className="font-display text-base font-bold text-ink">Pedidos de mayor valor</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wide text-ink/50">
              <th className="px-5 py-3">Pedido</th>
              <th className="px-5 py-3">Cliente</th>
              <th className="px-5 py-3">Pago</th>
              <th className="px-5 py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {topOrders.map((order) => (
              <tr key={order.id} className="border-b border-border/60 last:border-0">
                <td className="px-5 py-3 font-semibold text-ink">
                  <Link href={`/admin/pedidos/${order.id}`} className="hover:text-blush-600">
                    #{order.orderNumber}
                  </Link>
                </td>
                <td className="px-5 py-3 text-ink/70">{order.customerName}</td>
                <td className="px-5 py-3 text-ink/70">{order.paymentStatus}</td>
                <td className="px-5 py-3 text-right font-semibold text-ink">{formatCOP(order.total)}</td>
              </tr>
            ))}
            {topOrders.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-sm text-ink/50">
                  Todavía no hay pedidos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
