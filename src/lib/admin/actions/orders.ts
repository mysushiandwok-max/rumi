"use server";

import { requireAdminSession } from "@/lib/admin/auth";
import { updateOrderStatus, updatePaymentStatus, updateOrderTracking, createOrder, getOrderById } from "@/lib/admin/orders";
import type { CreateOrderInput } from "@/lib/admin/orders";
import type { OrderStatus, PaymentStatus } from "@/lib/types";
import { getShippingSettings } from "@/lib/admin/settings";
import { getShippingPriceForLocation } from "@/lib/admin/shipping";
import { sendTemplatedEmail } from "@/lib/email/mailer";
import { getProductBySlug } from "@/data/products";
import { formatCOP } from "@/lib/format";
import { STATUS_EVENT, PAYMENT_STATUS_EVENT, buildOrderItemsHtml, orderEmailVars } from "@/lib/email/order-email";

export async function updateOrderStatusAction(id: number, status: OrderStatus) {
  await requireAdminSession();
  const current = getOrderById(id);
  if (!current) return;
  const order = updateOrderStatus(id, status);

  const event = current.status !== status ? STATUS_EVENT[status] : undefined;
  if (event) await sendTemplatedEmail(event, order.customerEmail, orderEmailVars(order));
}

export async function updatePaymentStatusAction(id: number, status: PaymentStatus) {
  await requireAdminSession();
  const current = getOrderById(id);
  if (!current) return;
  const order = updatePaymentStatus(id, status);
  if (current.paymentStatus === status) return;

  const vars = orderEmailVars(order);
  const event = PAYMENT_STATUS_EVENT[status];
  if (event) await sendTemplatedEmail(event, order.customerEmail, vars);

  // La confirmación de pedido (con el listado de productos) sale cuando el pago queda
  // confirmado, no al crear el pedido: así nadie recibe "pedido confirmado" de un pago que falló.
  if (status === "pagado") {
    await sendTemplatedEmail("COMPRA", order.customerEmail, { ...vars, items_html: buildOrderItemsHtml(order) });
  }
}

export async function updateOrderTrackingAction(id: number, formData: FormData) {
  await requireAdminSession();
  const current = getOrderById(id);
  if (!current) return;

  const trackingNumber = String(formData.get("trackingNumber") ?? "").trim();
  const carrier = String(formData.get("carrier") ?? "").trim();
  let order = updateOrderTracking(id, trackingNumber, carrier);

  // Cargar guía + transportadora es, en la práctica, lo que marca que el pedido salió: se
  // avanza a "enviado" solo si seguía pendiente/procesando (nunca revierte entregado/cancelado).
  const shouldAutoShip = Boolean(trackingNumber && carrier) && (current.status === "pendiente" || current.status === "procesando");
  if (shouldAutoShip) {
    order = updateOrderStatus(id, "enviado");
    await sendTemplatedEmail("ENVIO", order.customerEmail, orderEmailVars(order));
    return;
  }

  // Ya estaba enviado y pagado y la guía es nueva o cambió: se le avisa al cliente. No se
  // reenvía si guarda de nuevo el mismo número, para no repetir el correo por un ajuste menor.
  const trackingIsNew = trackingNumber && trackingNumber !== current.trackingNumber;
  if (trackingIsNew && current.status === "enviado" && current.paymentStatus === "pagado") {
    await sendTemplatedEmail("ENVIO", order.customerEmail, orderEmailVars(order));
  }
}

// Endpoint público: nada de lo que llega del navegador se toma como cierto. Precios, nombres y totales se
// recalculan con la base de datos, y los datos del cliente se validan en formato y longitud.
function cleanText(value: unknown, min: number, max: number): string {
  const text = typeof value === "string" ? value.trim() : "";
  if (text.length < min || text.length > max) throw new Error("Datos de envío inválidos");
  return text;
}

export async function placeOrderAction(input: CreateOrderInput) {
  const raw = input?.shipping;
  const shipping = {
    fullName: cleanText(raw?.fullName, 2, 100),
    email: cleanText(raw?.email, 5, 120),
    phone: cleanText(raw?.phone, 7, 20),
    address: cleanText(raw?.address, 5, 200),
    city: cleanText(raw?.city, 2, 80),
    department: cleanText(raw?.department, 2, 80),
    notes: raw?.notes ? cleanText(raw.notes, 0, 500) : undefined,
  };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shipping.email)) throw new Error("Correo inválido");
  if (!/^[0-9+\s()-]{7,20}$/.test(shipping.phone)) throw new Error("Teléfono inválido");

  if (!Array.isArray(input.items) || input.items.length === 0 || input.items.length > 50) throw new Error("Carrito inválido");
  const merged = new Map<string, number>();
  for (const item of input.items) {
    const quantity = Number(item?.quantity);
    if (typeof item?.productSlug !== "string" || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
      throw new Error("Carrito inválido");
    }
    merged.set(item.productSlug, (merged.get(item.productSlug) ?? 0) + quantity);
  }
  const items = [...merged].map(([slug, quantity]) => {
    const product = getProductBySlug(slug);
    if (!product || product.status !== "published" || quantity > 20 || product.stock < quantity) {
      throw new Error("Carrito inválido");
    }
    return { productSlug: product.slug, productName: product.name, unitPrice: product.price, quantity };
  });
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  const settings = getShippingSettings();
  const matchedPrice = getShippingPriceForLocation(shipping.department, shipping.city);
  const rate = matchedPrice ?? settings.flatRate;
  const shippingCost = subtotal >= settings.freeShippingThreshold ? 0 : rate;

  const order = createOrder({ shipping, items, subtotal, shippingCost });

  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail) {
    await sendTemplatedEmail("ADMIN_VENTA", adminEmail, {
      numero_pedido: order.orderNumber,
      cliente: order.customerName,
      total: formatCOP(order.total),
    });
  }

  return { orderNumber: order.orderNumber };
}
