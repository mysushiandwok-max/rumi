import "server-only";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/client";
import type { Order, OrderItem, OrderStatus, PaymentStatus, ShippingInfo } from "@/lib/types";

type OrderRow = {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  address: string;
  city: string;
  department: string;
  notes: string | null;
  subtotal: number;
  shipping_cost: number;
  total: number;
  status: string;
  payment_status: string;
  tracking_number: string | null;
  carrier: string | null;
  created_at: string;
  updated_at: string;
};

type OrderItemRow = {
  id: number;
  order_id: number;
  product_slug: string;
  product_name: string;
  unit_price: number;
  quantity: number;
};

function rowToItem(row: OrderItemRow): OrderItem {
  return {
    id: row.id,
    productSlug: row.product_slug,
    productName: row.product_name,
    unitPrice: row.unit_price,
    quantity: row.quantity,
  };
}

function rowToOrder(row: OrderRow, items: OrderItem[]): Order {
  return {
    id: row.id,
    orderNumber: row.order_number,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone,
    address: row.address,
    city: row.city,
    department: row.department,
    notes: row.notes ?? undefined,
    subtotal: row.subtotal,
    shippingCost: row.shipping_cost,
    total: row.total,
    status: row.status as OrderStatus,
    paymentStatus: row.payment_status as PaymentStatus,
    trackingNumber: row.tracking_number ?? undefined,
    carrier: row.carrier ?? undefined,
    items,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function getItemsForOrder(orderId: number): OrderItem[] {
  const rows = db.prepare("SELECT * FROM order_items WHERE order_id = ?").all(orderId) as OrderItemRow[];
  return rows.map(rowToItem);
}

export function getAllOrders(): Order[] {
  const rows = db.prepare("SELECT * FROM orders ORDER BY created_at DESC").all() as OrderRow[];
  return rows.map((row) => rowToOrder(row, getItemsForOrder(row.id)));
}

export function getOrderById(id: number): Order | undefined {
  const row = db.prepare("SELECT * FROM orders WHERE id = ?").get(id) as OrderRow | undefined;
  return row ? rowToOrder(row, getItemsForOrder(row.id)) : undefined;
}

export type CreateOrderInput = {
  shipping: ShippingInfo;
  items: { productSlug: string; productName: string; unitPrice: number; quantity: number }[];
  subtotal: number;
  shippingCost: number;
};

function generateOrderNumber(): string {
  for (let attempt = 0; attempt < 5; attempt++) {
    const candidate = `RUMI-${Math.floor(100000 + Math.random() * 900000)}`;
    const existing = db.prepare("SELECT id FROM orders WHERE order_number = ?").get(candidate);
    if (!existing) return candidate;
  }
  return `RUMI-${Date.now()}`;
}

export function createOrder(input: CreateOrderInput): Order {
  const orderNumber = generateOrderNumber();
  const total = input.subtotal + input.shippingCost;

  const insertOrder = db.prepare(
    `INSERT INTO orders (
      order_number, customer_name, customer_email, customer_phone, address, city, department,
      notes, subtotal, shipping_cost, total
    ) VALUES (
      @orderNumber, @customerName, @customerEmail, @customerPhone, @address, @city, @department,
      @notes, @subtotal, @shippingCost, @total
    )`
  );
  const insertItem = db.prepare(
    `INSERT INTO order_items (order_id, product_slug, product_name, unit_price, quantity)
     VALUES (@orderId, @productSlug, @productName, @unitPrice, @quantity)`
  );
  const decrementStock = db.prepare("UPDATE products SET stock = MAX(0, stock - ?) WHERE slug = ?");

  const orderId = db.transaction(() => {
    const result = insertOrder.run({
      orderNumber,
      customerName: input.shipping.fullName,
      customerEmail: input.shipping.email,
      customerPhone: input.shipping.phone,
      address: input.shipping.address,
      city: input.shipping.city,
      department: input.shipping.department,
      notes: input.shipping.notes ?? null,
      subtotal: input.subtotal,
      shippingCost: input.shippingCost,
      total,
    });
    const id = Number(result.lastInsertRowid);
    for (const item of input.items) {
      insertItem.run({ orderId: id, ...item });
      decrementStock.run(item.quantity, item.productSlug);
    }
    return id;
  })();

  revalidatePath("/admin");
  revalidatePath("/admin/pedidos");
  revalidatePath("/admin/finanzas");
  revalidatePath("/tienda");
  return getOrderById(orderId)!;
}

export function updateOrderStatus(id: number, status: OrderStatus): Order {
  db.prepare("UPDATE orders SET status = ?, updated_at = datetime('now') WHERE id = ?").run(status, id);
  revalidatePath("/admin/pedidos");
  revalidatePath(`/admin/pedidos/${id}`);
  return getOrderById(id)!;
}

export function updatePaymentStatus(id: number, paymentStatus: PaymentStatus): Order {
  db.prepare("UPDATE orders SET payment_status = ?, updated_at = datetime('now') WHERE id = ?").run(paymentStatus, id);
  revalidatePath("/admin/pedidos");
  revalidatePath(`/admin/pedidos/${id}`);
  revalidatePath("/admin/finanzas");
  return getOrderById(id)!;
}

export function updateOrderTracking(id: number, trackingNumber: string, carrier: string): Order {
  db.prepare(
    "UPDATE orders SET tracking_number = ?, carrier = ?, updated_at = datetime('now') WHERE id = ?"
  ).run(trackingNumber || null, carrier || null, id);
  revalidatePath("/admin/pedidos");
  revalidatePath(`/admin/pedidos/${id}`);
  return getOrderById(id)!;
}
