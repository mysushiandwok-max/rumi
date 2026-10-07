"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateOrderStatusAction, updatePaymentStatusAction } from "@/lib/admin/actions/orders";
import type { OrderStatus, PaymentStatus } from "@/lib/types";

const ORDER_STATUSES: OrderStatus[] = ["pendiente", "procesando", "enviado", "entregado", "cancelado"];
const PAYMENT_STATUSES: PaymentStatus[] = ["pendiente", "pagado", "fallido"];

export function OrderStatusSelect({ orderId, status }: { orderId: number; status: OrderStatus }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <select
      defaultValue={status}
      disabled={isPending}
      onChange={(e) => {
        const value = e.target.value as OrderStatus;
        startTransition(async () => {
          await updateOrderStatusAction(orderId, value);
          router.refresh();
        });
      }}
      className="input-field w-auto"
    >
      {ORDER_STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}

export function PaymentStatusSelect({ orderId, status }: { orderId: number; status: PaymentStatus }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <select
      defaultValue={status}
      disabled={isPending}
      onChange={(e) => {
        const value = e.target.value as PaymentStatus;
        startTransition(async () => {
          await updatePaymentStatusAction(orderId, value);
          router.refresh();
        });
      }}
      className="input-field w-auto"
    >
      {PAYMENT_STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
