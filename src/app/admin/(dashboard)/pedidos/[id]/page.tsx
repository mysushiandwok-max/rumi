import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/admin/orders";
import { updateOrderTrackingAction } from "@/lib/admin/actions/orders";
import { formatCOP } from "@/lib/format";
import { OrderStatusSelect, PaymentStatusSelect } from "@/components/admin/OrderStatusSelect";

export const metadata = { title: "Detalle de pedido" };

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = getOrderById(Number(id));
  if (!order) notFound();

  const boundTrackingAction = updateOrderTrackingAction.bind(null, order.id);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Pedido #{order.orderNumber}</h1>
        <p className="mt-1 text-sm text-ink/60">
          {new Date(order.createdAt).toLocaleDateString("es-CO", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-6">
          <div className="card-surface p-6">
            <h2 className="font-display text-base font-bold text-ink">Productos</h2>
            <ul className="mt-4 flex flex-col divide-y divide-border/60">
              {order.items.map((item) => (
                <li key={item.id} className="flex items-center justify-between py-3 text-sm">
                  <div>
                    <p className="font-semibold text-ink">{item.productName}</p>
                    <p className="text-xs text-ink/50">
                      {formatCOP(item.unitPrice)} × {item.quantity}
                    </p>
                  </div>
                  <span className="font-display font-bold text-ink">{formatCOP(item.unitPrice * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-col gap-1.5 border-t border-border pt-4 text-sm">
              <div className="flex justify-between text-ink/70">
                <span>Subtotal</span>
                <span>{formatCOP(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-ink/70">
                <span>Envío</span>
                <span>{order.shippingCost === 0 ? "Gratis" : formatCOP(order.shippingCost)}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2 font-display text-base font-bold text-ink">
                <span>Total</span>
                <span>{formatCOP(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="card-surface p-6">
            <h2 className="font-display text-base font-bold text-ink">Envío y seguimiento</h2>
            <dl className="mt-4 grid gap-2 text-sm text-ink/70">
              <div className="flex justify-between">
                <dt>Dirección</dt>
                <dd className="text-right font-medium text-ink">{order.address}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Ciudad</dt>
                <dd className="font-medium text-ink">{order.city}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Departamento</dt>
                <dd className="font-medium text-ink">{order.department}</dd>
              </div>
              {order.notes && (
                <div className="flex justify-between gap-4">
                  <dt>Notas</dt>
                  <dd className="text-right font-medium text-ink">{order.notes}</dd>
                </div>
              )}
            </dl>

            <form action={boundTrackingAction} className="mt-5 grid gap-3 border-t border-border pt-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-semibold text-ink">Transportadora</span>
                <input name="carrier" defaultValue={order.carrier} className="input-field" placeholder="Servientrega" />
              </label>
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-semibold text-ink">Número de guía</span>
                <input name="trackingNumber" defaultValue={order.trackingNumber} className="input-field" />
              </label>
              <button type="submit" className="btn-secondary sm:col-span-2 py-2.5 text-sm">
                Guardar seguimiento
              </button>
            </form>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="card-surface p-6">
            <h2 className="font-display text-base font-bold text-ink">Cliente</h2>
            <dl className="mt-4 flex flex-col gap-2 text-sm text-ink/70">
              <div>
                <dt className="text-xs uppercase tracking-wide text-ink/40">Nombre</dt>
                <dd className="font-medium text-ink">{order.customerName}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-ink/40">Correo</dt>
                <dd className="font-medium text-ink">{order.customerEmail}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-ink/40">Teléfono</dt>
                <dd className="font-medium text-ink">{order.customerPhone}</dd>
              </div>
            </dl>
          </div>

          <div className="card-surface flex flex-col gap-4 p-6">
            <h2 className="font-display text-base font-bold text-ink">Estado</h2>
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-ink">Estado del pedido</span>
              <OrderStatusSelect key={order.status} orderId={order.id} status={order.status} />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-ink">Estado del pago</span>
              <PaymentStatusSelect orderId={order.id} status={order.paymentStatus} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
