import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin/auth";
import { getAllOrders } from "@/lib/admin/orders";

export const dynamic = "force-dynamic";

function csvEscape(value: string | number) {
  const str = String(value);
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const orders = getAllOrders();
  const header = [
    "Pedido",
    "Fecha",
    "Cliente",
    "Correo",
    "Subtotal",
    "Envío",
    "Total",
    "Estado",
    "Pago",
  ];
  const rows = orders.map((o) =>
    [
      o.orderNumber,
      o.createdAt,
      o.customerName,
      o.customerEmail,
      o.subtotal,
      o.shippingCost,
      o.total,
      o.status,
      o.paymentStatus,
    ]
      .map(csvEscape)
      .join(",")
  );
  const csv = [header.join(","), ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="rumi-pedidos.csv"`,
    },
  });
}
