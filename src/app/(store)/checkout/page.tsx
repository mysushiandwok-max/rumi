import type { Metadata } from "next";
import { CheckoutClient } from "@/components/CheckoutClient";
import { getShippingSettings } from "@/lib/admin/settings";
import { getShippingLookupTable } from "@/lib/admin/shipping";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  const { freeShippingThreshold, flatRate } = getShippingSettings();
  const shippingTable = getShippingLookupTable();
  return (
    <CheckoutClient
      freeShippingThreshold={freeShippingThreshold}
      flatRate={flatRate}
      shippingTable={shippingTable}
    />
  );
}
