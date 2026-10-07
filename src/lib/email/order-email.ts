import "server-only";
import { formatCOP } from "@/lib/format";
import type { Order, OrderStatus, PaymentStatus } from "@/lib/types";
import { escapeHtml } from "./template-vars";
import type { EmailEventKey } from "./events";

export const STATUS_EVENT: Partial<Record<OrderStatus, EmailEventKey>> = {
  procesando: "PREPARACION",
  enviado: "ENVIO",
  entregado: "ENTREGA",
  cancelado: "CANCELACION",
};

export const PAYMENT_STATUS_EVENT: Partial<Record<PaymentStatus, EmailEventKey>> = {
  pagado: "PAGO_CONFIRMADO",
  fallido: "PAGO_RECHAZADO",
};

// Tabla HTML de productos para el correo COMPRA ({{items_html}}).
export function buildOrderItemsHtml(order: Order): string {
  const rows = order.items
    .map(
      (it) =>
        `<tr><td style="padding:8px 0;font-size:14px;color:#2B2320;">${it.quantity}× ${escapeHtml(it.productName)}</td>` +
        `<td style="padding:8px 0;text-align:right;font-size:14px;font-weight:700;color:#2B2320;white-space:nowrap;">${formatCOP(it.unitPrice * it.quantity)}</td></tr>`
    )
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;margin:0 0 14px;">${rows}</table>`;
}

// Bloque con transportadora/guía para el correo ENVIO ({{guia_html}}): vacío si todavía no hay
// número de guía, para no dejar un hueco raro en el correo con un dato que no existe todavía.
export function buildTrackingHtml(carrier: string | undefined, trackingNumber: string | undefined): string {
  if (!trackingNumber) return "";
  const carrierLine = carrier ? `Transportadora: <strong>${escapeHtml(carrier)}</strong><br>` : "";
  return (
    '<p style="margin:12px 0 0;padding:12px 14px;background:#FDF3F6;border-radius:10px;">' +
    `${carrierLine}Número de guía: <strong>${escapeHtml(trackingNumber)}</strong></p>`
  );
}

export function orderEmailVars(order: Order) {
  return {
    nombre: order.customerName,
    numero_pedido: order.orderNumber,
    total: formatCOP(order.total),
    guia_html: buildTrackingHtml(order.carrier, order.trackingNumber),
  };
}
