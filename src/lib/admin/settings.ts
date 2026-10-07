import "server-only";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/client";
import type { ConnectorSettings, ShippingSettings } from "@/lib/types";

const DEFAULT_SHIPPING: ShippingSettings = { freeShippingThreshold: 150000, flatRate: 12000 };
const DEFAULT_CONNECTORS: ConnectorSettings = {
  bold: { apiKey: "", secretKey: "", enabled: false },
  carrier: { name: "", apiKey: "", enabled: false },
};

function readSetting<T>(key: string, fallback: T): T {
  const row = db.prepare("SELECT value FROM settings WHERE key = ?").get(key) as { value: string } | undefined;
  if (!row) return fallback;
  try {
    return { ...fallback, ...JSON.parse(row.value) };
  } catch {
    return fallback;
  }
}

function writeSetting(key: string, value: unknown) {
  db.prepare(
    `INSERT INTO settings (key, value) VALUES (@key, @value)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`
  ).run({ key, value: JSON.stringify(value) });
}

export function getShippingSettings(): ShippingSettings {
  return readSetting("shipping", DEFAULT_SHIPPING);
}

export function setShippingSettings(settings: ShippingSettings): void {
  writeSetting("shipping", settings);
  revalidatePath("/carrito");
  revalidatePath("/checkout");
  revalidatePath("/admin/envios");
  revalidatePath("/legal/envios");
}

export function getConnectorSettings(): ConnectorSettings {
  return readSetting("connectors", DEFAULT_CONNECTORS);
}

export function setConnectorSettings(settings: ConnectorSettings): void {
  writeSetting("connectors", settings);
  revalidatePath("/admin/conectores");
}
