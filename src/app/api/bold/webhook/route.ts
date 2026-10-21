import { db } from "@/lib/db/client";
import { isValidBoldSignature } from "@/lib/bold";
import { setPaymentStatusAndNotify } from "@/lib/admin/payments";

// Webhook de Bold: configúralo en el panel de Bold apuntando a https://<tu-dominio>/api/bold/webhook.
// Sin firma válida no se toca ningún pedido. Bold reintenta si no recibe 2xx; el cambio de estado es idempotente.
export async function POST(request: Request) {
  const raw = await request.text();
  if (!isValidBoldSignature(raw, request.headers.get("x-bold-signature"))) {
    return new Response("firma inválida", { status: 401 });
  }

  let event: { type?: string; data?: { amount?: { total?: number }; metadata?: { reference?: string } } };
  try {
    event = JSON.parse(raw);
  } catch {
    return new Response("json inválido", { status: 400 });
  }

  const reference = event.data?.metadata?.reference;
  const order = reference
    ? (db.prepare("SELECT id, total, payment_status FROM orders WHERE order_number = ?").get(reference) as
        | { id: number; total: number; payment_status: string }
        | undefined)
    : undefined;
  if (!order) return new Response("ok"); // pedido desconocido: 200 para que Bold no reintente en bucle

  if (event.type === "SALE_APPROVED") {
    // El monto cobrado debe coincidir con el pedido guardado; si no, se deja pendiente para revisarlo a mano.
    if (Number(event.data?.amount?.total) !== order.total) return new Response("monto no coincide", { status: 422 });
    await setPaymentStatusAndNotify(order.id, "pagado");
  } else if (event.type === "SALE_REJECTED" && order.payment_status === "pendiente") {
    await setPaymentStatusAndNotify(order.id, "fallido");
  }
  return new Response("ok");
}
