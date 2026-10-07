import Link from "next/link";
import { computeDashboardMetrics } from "@/lib/admin/metrics";
import { computeTrend } from "@/lib/admin/trend";
import { formatCOP } from "@/lib/format";
import { StatCard } from "@/components/admin/StatCard";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { ReceiptIcon, ChartIcon, UsersIcon, AlertTriangleIcon, BagIcon, ArrowRightIcon, StarIcon, TruckIcon } from "@/components/icons";

export const metadata = { title: "Panel de administración" };

const STATUS_LABELS: Record<string, string> = {
  pendiente: "Pendientes",
  procesando: "Procesando",
  enviado: "Enviados",
  entregado: "Entregados",
  cancelado: "Cancelados",
};

const STATUS_STYLES: Record<string, string> = {
  pendiente: "bg-peach-100 text-peach-600",
  procesando: "bg-lavender-100 text-lavender-600",
  enviado: "bg-mint-100 text-mint-700",
  entregado: "bg-mint-100 text-mint-700",
  cancelado: "bg-ink/5 text-ink/50",
};

const RANGE_TABS = [
  { key: "hoy", label: "Hoy" },
  { key: "7d", label: "7 días" },
  { key: "30d", label: "30 días" },
  { key: "total", label: "Total" },
] as const;

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ rango?: string }>;
}) {
  const { rango = "30d" } = await searchParams;
  const metrics = computeDashboardMetrics();

  const heroByRange: Record<string, { revenue: number; orders: number }> = {
    hoy: { revenue: metrics.revenueToday, orders: metrics.paidOrdersToday },
    "7d": { revenue: metrics.revenue7d, orders: metrics.paidOrders7d },
    "30d": { revenue: metrics.revenue30d, orders: metrics.paidOrders30d },
    total: { revenue: metrics.revenueTotal, orders: metrics.paidOrdersTotal },
  };
  const hero = heroByRange[rango] ?? heroByRange["30d"];

  const ordersTrend = computeTrend(metrics.orders30d, metrics.orders30dPrev);
  const productsTrend = computeTrend(metrics.totalProducts, metrics.totalProductsPrev30d);
  const customersTrend = computeTrend(metrics.totalCustomers, metrics.totalCustomersPrev30d);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Panel de administración</h1>
        <p className="mt-1 text-sm text-ink/60">Resumen general de la tienda</p>
      </div>

      <div
        className="rounded-xl2 p-6 text-white shadow-soft sm:p-7"
        style={{ background: "linear-gradient(135deg, #E8688C 0%, #B5375D 100%)" }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-white/70">Ventas pagadas</p>
          <div className="flex gap-1 rounded-pill bg-white/15 p-1">
            {RANGE_TABS.map((tab) => (
              <Link
                key={tab.key}
                href={`/admin?rango=${tab.key}`}
                className={`rounded-pill px-3 py-1.5 text-xs font-semibold transition-colors ${
                  rango === tab.key ? "bg-white text-blush-600" : "text-white/80 hover:bg-white/10"
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </div>
        <p className="mt-4 font-display text-4xl font-bold sm:text-5xl">{formatCOP(hero.revenue)}</p>
        <p className="mt-2 text-sm text-white/75">
          {hero.orders} pedido{hero.orders === 1 ? "" : "s"} pagado{hero.orders === 1 ? "" : "s"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Pedidos (30 días)"
          value={String(metrics.orders30d)}
          trend={ordersTrend}
          hint={`${metrics.ordersToday} hoy`}
          icon={ReceiptIcon}
          tone="blush"
        />
        <StatCard
          label="Pedidos pendientes"
          value={String(metrics.pendingOrders)}
          hint={metrics.pendingOrders > 0 ? "por procesar" : "al día"}
          icon={TruckIcon}
          tone={metrics.pendingOrders > 0 ? "peach" : "mint"}
        />
        <StatCard
          label="Ticket promedio"
          value={formatCOP(Math.round(metrics.avgOrderValue))}
          icon={ChartIcon}
          tone="lavender"
        />
        <StatCard
          label="Bajo inventario"
          value={String(metrics.lowStockCount)}
          hint="≤ 5 unidades"
          icon={AlertTriangleIcon}
          tone={metrics.lowStockCount > 0 ? "peach" : "mint"}
        />
        <StatCard
          label="Productos publicados"
          value={String(metrics.totalProducts)}
          trend={productsTrend}
          icon={BagIcon}
          tone="mint"
        />
        <StatCard
          label="Clientes"
          value={String(metrics.totalCustomers)}
          trend={customersTrend}
          icon={UsersIcon}
          tone="lavender"
        />
        <StatCard
          label="Reseñas pendientes"
          value={String(metrics.pendingReviews)}
          hint="por moderar"
          icon={StarIcon}
          tone={metrics.pendingReviews > 0 ? "peach" : "mint"}
        />
        <StatCard
          label="Ingresos 30 días"
          value={formatCOP(metrics.revenue30d)}
          icon={ChartIcon}
          tone="blush"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="flex flex-col gap-6">
          <div className="card-surface p-6">
            <h2 className="font-display text-base font-bold text-ink">Ingresos últimos 14 días</h2>
            <div className="mt-5">
              <RevenueChart data={metrics.revenueByDay} />
            </div>
          </div>

          <div className="card-surface p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base font-bold text-ink">Pedidos recientes</h2>
              <Link href="/admin/pedidos" className="flex items-center gap-1 text-xs font-bold text-blush-600 hover:text-blush-700">
                Ver todos <ArrowRightIcon className="h-3.5 w-3.5" />
              </Link>
            </div>
            {metrics.recentOrders.length === 0 ? (
              <p className="mt-4 text-sm text-ink/50">Todavía no hay pedidos registrados.</p>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-xs uppercase tracking-wide text-ink/40">
                      <th className="pb-2 font-semibold">Pedido</th>
                      <th className="pb-2 font-semibold">Cliente</th>
                      <th className="pb-2 font-semibold">Estado</th>
                      <th className="pb-2 text-right font-semibold">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {metrics.recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td className="py-2.5">
                          <Link href={`/admin/pedidos/${order.id}`} className="font-semibold text-ink hover:text-blush-600">
                            {order.orderNumber}
                          </Link>
                        </td>
                        <td className="py-2.5 text-ink/70">{order.customerName}</td>
                        <td className="py-2.5">
                          <span className={`pill-badge ${STATUS_STYLES[order.status]}`}>{order.status}</span>
                        </td>
                        <td className="py-2.5 text-right font-display font-bold text-ink">{formatCOP(order.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {(metrics.pendingReviews > 0 || metrics.pendingOrders > 0) && (
            <div className="rounded-xl2 border border-blush-100 bg-blush-50 p-6">
              <h2 className="font-display text-base font-bold text-ink">Acciones pendientes</h2>
              <ul className="mt-4 flex flex-col gap-3">
                {metrics.pendingOrders > 0 && (
                  <li className="flex items-center justify-between text-sm">
                    <span className="text-ink/70">
                      {metrics.pendingOrders} pedido{metrics.pendingOrders === 1 ? "" : "s"} por procesar
                    </span>
                    <Link href="/admin/pedidos?estado=pendiente" className="text-xs font-bold text-blush-600 hover:text-blush-700">
                      Ver →
                    </Link>
                  </li>
                )}
                {metrics.pendingReviews > 0 && (
                  <li className="flex items-center justify-between text-sm">
                    <span className="text-ink/70">
                      {metrics.pendingReviews} reseña{metrics.pendingReviews === 1 ? "" : "s"} por moderar
                    </span>
                    <Link href="/admin/resenas" className="text-xs font-bold text-blush-600 hover:text-blush-700">
                      Ver →
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          )}

          <div className="card-surface p-6">
            <h2 className="font-display text-base font-bold text-ink">Pedidos por estado</h2>
            <ul className="mt-4 flex flex-col gap-3">
              {Object.entries(metrics.ordersByStatus).map(([status, count]) => (
                <li key={status} className="flex items-center justify-between text-sm">
                  <span className="text-ink/70">{STATUS_LABELS[status] ?? status}</span>
                  <span className="font-display font-bold text-ink">{count}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card-surface p-6">
            <h2 className="font-display text-base font-bold text-ink">Productos más vendidos</h2>
            {metrics.topProducts.length === 0 ? (
              <p className="mt-4 text-sm text-ink/50">Todavía no hay ventas registradas.</p>
            ) : (
              <ul className="mt-4 flex flex-col gap-3">
                {metrics.topProducts.map((p) => (
                  <li key={p.slug} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-semibold text-ink">{p.name}</p>
                      <p className="text-xs text-ink/50">{p.units} unidades vendidas</p>
                    </div>
                    <span className="font-display font-bold text-ink">{formatCOP(p.revenue)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="card-surface p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base font-bold text-ink">Stock bajo</h2>
              <span className="pill-badge bg-blush-100 text-blush-700">{metrics.lowStockCount}</span>
            </div>
            {metrics.lowStockProducts.length === 0 ? (
              <p className="mt-4 text-sm text-ink/50">Todo el inventario está en buen nivel.</p>
            ) : (
              <ul className="mt-4 flex flex-col gap-3">
                {metrics.lowStockProducts.map((p) => (
                  <li key={p.slug} className="flex items-center justify-between text-sm">
                    <span className="text-ink/70">{p.name}</span>
                    <span className="font-display font-bold text-blush-600">{p.stock} und.</span>
                  </li>
                ))}
              </ul>
            )}
            <Link href="/admin/productos" className="mt-4 inline-block text-sm font-semibold text-blush-600 hover:text-blush-700">
              Ver productos →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
