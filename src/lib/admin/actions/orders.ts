"use server";

import { requireAdminSession } from "@/lib/admin/auth";
import { updateOrderStatus, updatePaymentStatus, updateOrderTracking, createOrder, getOrderById } from "@/lib/admin/orders";
import type { CreateOrderInput } from "@/lib/admin/orders";
import type { OrderStatus, PaymentStatus } from "@/lib/types";
import { getShippingSettings } from "@/lib/admin/settings";
import { getShippingPriceForLocation } from "@/lib/admin/shipping";
import { sendTemplatedEmail } from "@/lib/email/mailer";
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

export async function placeOrderAction(input: CreateOrderInput) {
  const settings = getShippingSettings();
  const matchedPrice = getShippingPriceForLocation(input.shipping.department, input.shipping.city);
  const rate = matchedPrice ?? settings.flatRate;
  const shippingCost = input.subtotal >= settings.freeShippingThreshold ? 0 : rate;

  const order = createOrder({ ...input, shippingCost });

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
