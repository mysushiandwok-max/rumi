import "server-only";
import { db } from "@/lib/db/client";
import { getLowStockProducts } from "@/data/products";
import type { OrderStatus } from "@/lib/types";

export type DashboardMetrics = {
  revenueToday: number;
  revenue7d: number;
  revenue30d: number;
  revenueTotal: number;
  paidOrdersToday: number;
  paidOrders7d: number;
  paidOrders30d: number;
  paidOrdersTotal: number;
  ordersToday: number;
  orders7d: number;
  orders30d: number;
  orders30dPrev: number;
  ordersByStatus: Record<OrderStatus, number>;
  pendingOrders: number;
  avgOrderValue: number;
  pendingReviews: number;
  lowStockCount: number;
  lowStockProducts: { slug: string; name: string; stock: number }[];
  revenueByDay: { date: string; total: number }[];
  topProducts: { slug: string; name: string; revenue: number; units: number }[];
  totalProducts: number;
  totalProductsPrev30d: number;
  totalCustomers: number;
  totalCustomersPrev30d: number;
  recentOrders: {
    id: number;
    orderNumber: string;
    customerName: string;
    total: number;
    status: OrderStatus;
    createdAt: string;
  }[];
};

const ORDER_STATUSES: OrderStatus[] = ["pendiente", "procesando", "enviado", "entregado", "cancelado"];

function scalar<T = number>(sql: string, key = "value"): T {
  return (db.prepare(sql).get() as Record<string, T>)[key];
}

export function computeDashboardMetrics(): DashboardMetrics {
  const revenueToday = scalar<number>(
    "SELECT COALESCE(SUM(total), 0) as value FROM orders WHERE payment_status = 'pagado' AND date(created_at) = date('now')"
  );
  const revenue7d = scalar<number>(
    "SELECT COALESCE(SUM(total), 0) as value FROM orders WHERE payment_status = 'pagado' AND created_at >= datetime('now', '-7 days')"
  );
  const revenue30d = scalar<number>(
    "SELECT COALESCE(SUM(total), 0) as value FROM orders WHERE payment_status = 'pagado' AND created_at >= datetime('now', '-30 days')"
  );
  const revenueTotal = scalar<number>(
    "SELECT COALESCE(SUM(total), 0) as value FROM orders WHERE payment_status = 'pagado'"
  );

  const paidOrdersToday = scalar<number>(
    "SELECT COUNT(*) as value FROM orders WHERE payment_status = 'pagado' AND date(created_at) = date('now')"
  );
  const paidOrders7d = scalar<number>(
    "SELECT COUNT(*) as value FROM orders WHERE payment_status = 'pagado' AND created_at >= datetime('now', '-7 days')"
  );
  const paidOrders30d = scalar<number>(
    "SELECT COUNT(*) as value FROM orders WHERE payment_status = 'pagado' AND created_at >= datetime('now', '-30 days')"
  );
  const paidOrdersTotal = scalar<number>("SELECT COUNT(*) as value FROM orders WHERE payment_status = 'pagado'");

  const ordersToday = scalar<number>("SELECT COUNT(*) as value FROM orders WHERE date(created_at) = date('now')");
  const orders7d = scalar<number>(
    "SELECT COUNT(*) as value FROM orders WHERE created_at >= datetime('now', '-7 days')"
  );
  const orders30d = scalar<number>(
    "SELECT COUNT(*) as value FROM orders WHERE created_at >= datetime('now', '-30 days')"
  );
  const orders30dPrev = scalar<number>(
    `SELECT COUNT(*) as value FROM orders
     WHERE created_at >= datetime('now', '-60 days') AND created_at < datetime('now', '-30 days')`
  );

  const pendingOrders = scalar<number>("SELECT COUNT(*) as value FROM orders WHERE status = 'pendiente'");

  const statusRows = db.prepare("SELECT status, COUNT(*) as count FROM orders GROUP BY status").all() as {
    status: string;
    count: number;
  }[];
  const ordersByStatus = ORDER_STATUSES.reduce(
    (acc, status) => ({ ...acc, [status]: 0 }),
    {} as Record<OrderStatus, number>
  );
  for (const row of statusRows) {
    if (row.status in ordersByStatus) ordersByStatus[row.status as OrderStatus] = row.count;
  }

  const avgOrderValue = scalar<number>("SELECT COALESCE(AVG(total), 0) as value FROM orders WHERE payment_status = 'pagado'");

  const pendingReviews = scalar<number>("SELECT COUNT(*) as value FROM reviews WHERE status = 'pending'");

  const lowStockProducts = getLowStockProducts().map((p) => ({ slug: p.slug, name: p.name, stock: p.stock }));

  const revenueRows = db
    .prepare(
      `SELECT date(created_at) as day, SUM(total) as total FROM orders
       WHERE payment_status = 'pagado' AND created_at >= datetime('now', '-14 days')
       GROUP BY day`
    )
    .all() as { day: string; total: number }[];
  const revenueByDay = buildLast14Days(revenueRows);

  const topProducts = db
    .prepare(
      `SELECT product_slug as slug, product_name as name,
              SUM(unit_price * quantity) as revenue, SUM(quantity) as units
       FROM order_items
       GROUP BY product_slug, product_name
       ORDER BY revenue DESC
       LIMIT 5`
    )
    .all() as { slug: string; name: string; revenue: number; units: number }[];

  const totalProducts = scalar<number>("SELECT COUNT(*) as value FROM products WHERE status = 'published'");
  const totalProductsPrev30d = scalar<number>(
    "SELECT COUNT(*) as value FROM products WHERE status = 'published' AND created_at < datetime('now', '-30 days')"
  );

  const totalCustomers = scalar<number>("SELECT COUNT(DISTINCT customer_email) as value FROM orders");
  const totalCustomersPrev30d = scalar<number>(
    "SELECT COUNT(DISTINCT customer_email) as value FROM orders WHERE created_at < datetime('now', '-30 days')"
  );

  const recentOrders = db
    .prepare(
      `SELECT id, order_number as orderNumber, customer_name as customerName, total, status, created_at as createdAt
       FROM orders ORDER BY created_at DESC LIMIT 6`
    )
    .all() as DashboardMetrics["recentOrders"];

  return {
    revenueToday,
    revenue7d,
    revenue30d,
    revenueTotal,
    paidOrdersToday,
    paidOrders7d,
    paidOrders30d,
    paidOrdersTotal,
    ordersToday,
    orders7d,
    orders30d,
    orders30dPrev,
    ordersByStatus,
    pendingOrders,
    avgOrderValue,
    pendingReviews,
    lowStockCount: lowStockProducts.length,
    lowStockProducts,
    revenueByDay,
    topProducts,
    totalProducts,
    totalProductsPrev30d,
    totalCustomers,
    totalCustomersPrev30d,
    recentOrders,
  };
}

export function getAdminNotificationCount(): number {
  const pendingReviews = scalar<number>("SELECT COUNT(*) as value FROM reviews WHERE status = 'pending'");
  const pendingOrders = scalar<number>("SELECT COUNT(*) as value FROM orders WHERE status = 'pendiente'");
  return pendingReviews + pendingOrders;
}

function buildLast14Days(rows: { day: string; total: number }[]): { date: string; total: number }[] {
  const byDay = new Map(rows.map((r) => [r.day, r.total]));
  const days: { date: string; total: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    const key = d.toISOString().slice(0, 10);
    days.push({ date: key, total: byDay.get(key) ?? 0 });
  }
  return days;
}
