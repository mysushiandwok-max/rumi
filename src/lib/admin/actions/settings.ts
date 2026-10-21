"use server";

import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/admin/auth";
import { setShippingSettings, setConnectorSettings, getConnectorSettings } from "@/lib/admin/settings";

export async function updateShippingSettingsAction(formData: FormData) {
  await requireAdminSession();
  setShippingSettings({
    freeShippingThreshold: Number(formData.get("freeShippingThreshold") ?? 0),
    flatRate: Number(formData.get("flatRate") ?? 0),
  });
  redirect("/admin/envios");
}

export async function updateConnectorSettingsAction(formData: FormData) {
  await requireAdminSession();
  setConnectorSettings({
    ...getConnectorSettings(),
    carrier: {
      name: String(formData.get("carrierName") ?? ""),
      apiKey: String(formData.get("carrierApiKey") ?? ""),
      enabled: formData.get("carrierEnabled") === "on",
    },
  });
  redirect("/admin/conectores");
}

export async function updateBoldSettingsAction(formData: FormData) {
  await requireAdminSession();
  setConnectorSettings({
    ...getConnectorSettings(),
    bold: {
      apiKey: String(formData.get("boldApiKey") ?? "").trim(),
      secretKey: String(formData.get("boldSecretKey") ?? "").trim(),
      enabled: formData.get("boldEnabled") === "on",
      sandbox: formData.get("boldSandbox") === "on",
    },
  });
  redirect("/admin/bold");
}
