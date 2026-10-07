import type { Metadata } from "next";
import { CarritoClient } from "@/components/CarritoClient";
import { getShippingSettings } from "@/lib/admin/settings";

export const metadata: Metadata = { title: "Carrito" };

export default function CarritoPage() {
  const { freeShippingThreshold } = getShippingSettings();
  return <CarritoClient freeShippingThreshold={freeShippingThreshold} />;
}
