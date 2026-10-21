import "server-only";
import { getOrderById, updatePaymentStatus } from "@/lib/admin/orders";
import { sendTemplatedEmail } from "@/lib/email/mailer";
import { PAYMENT_STATUS_EVENT, buildOrderItemsHtml, orderEmailVars } from "@/lib/email/order-email";
import type { PaymentStatus } from "@/lib/types";

// Compartido por el panel (cambio manual) y el webhook de Bold: guarda el estado de pago y envía los correos.
export async function setPaymentStatusAndNotify(id: number, status: PaymentStatus) {
  const current = getOrderById(id);
  if (!current || current.paymentStatus === status) return;
  const order = updatePaymentStatus(id, status);

  const vars = orderEmailVars(order);
  const event = PAYMENT_STATUS_EVENT[status];
  if (event) await sendTemplatedEmail(event, order.customerEmail, vars);

  // La confirmación de pedido (con el listado de productos) sale cuando el pago queda
  // confirmado, no al crear el pedido: así nadie recibe "pedido confirmado" de un pago que falló.
  if (status === "pagado") {
    await sendTemplatedEmail("COMPRA", order.customerEmail, { ...vars, items_html: buildOrderItemsHtml(order) });
  }
}
