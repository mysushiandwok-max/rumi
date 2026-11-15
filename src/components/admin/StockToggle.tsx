"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { setProductStockAction } from "@/lib/admin/actions/products";

// Apagar = stock 0 (la tienda ya muestra "agotado"). Encender pide cuántas unidades hay.
export function StockToggle({ id, name, stock }: { id: number; name: string; stock: number }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const on = stock > 0;

  function toggle() {
    let next = 0;
    if (!on) {
      const answer = window.prompt(`¿Cuántas unidades de "${name}" hay disponibles?`, "10");
      next = Number(answer);
      if (!answer || !Number.isInteger(next) || next <= 0) return;
    }
    startTransition(async () => {
      await setProductStockAction(id, next);
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={`${on ? "Apagar" : "Encender"} ${name}`}
      title={on ? "Disponible (clic para marcar agotado)" : "Agotado (clic para reactivar)"}
      disabled={isPending}
      onClick={toggle}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-50 ${on ? "bg-mint-700" : "bg-ink/20"}`}
    >
      <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${on ? "translate-x-5" : ""}`} />
    </button>
  );
}
