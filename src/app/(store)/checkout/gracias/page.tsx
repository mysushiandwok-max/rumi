import Link from "next/link";
import type { Metadata } from "next";
import { db } from "@/lib/db/client";
import { ClearCartOnMount } from "@/components/ClearCartOnMount";

export const metadata: Metadata = { title: "Estado de tu pago" };
export const dynamic = "force-dynamic";

// Bold redirige aquí con ?bold-order-id=<pedido>&bold-tx-status=...; ese estado viene del navegador y no es de fiar,
// así que se muestra el estado guardado en la base (lo escribe el webhook firmado).
export default async function GraciasPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const q = await searchParams;
  const orderNumber = q["bold-order-id"] ?? "";
  const row = db.prepare("SELECT payment_status FROM orders WHERE order_number = ?").get(orderNumber) as
    | { payment_status: string }
    | undefined;
  const failed = q["bold-tx-status"] === "rejected" || q["bold-tx-status"] === "failed" || row?.payment_status === "fallido";

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center">
      {!failed && <ClearCartOnMount />}
      <h1 className="font-display text-3xl font-bold text-ink">{failed ? "No pudimos procesar tu pago" : "¡Gracias por tu compra!"}</h1>
      {row ? (
        <p className="mt-3 text-sm text-ink/60">
          Pedido <span className="font-bold text-ink">#{orderNumber}</span> —{" "}
          {failed
            ? "el pago fue rechazado. Tus productos siguen en el carrito para que lo intentes de nuevo."
            : row.payment_status === "pagado"
              ? "pago confirmado. Te enviamos la confirmación al correo."
              : "estamos confirmando tu pago con el banco; te avisaremos por correo en unos minutos."}
        </p>
      ) : (
        <p className="mt-3 text-sm text-ink/60">No encontramos ese pedido.</p>
      )}
      <Link href={failed ? "/checkout" : "/tienda"} className="btn-primary mt-8 px-6 py-3 text-sm">
        {failed ? "Volver al checkout" : "Seguir comprando"}
      </Link>
    </div>
  );
}
