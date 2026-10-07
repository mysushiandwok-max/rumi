"use server";

import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/admin/auth";
import { updateDispatchClass, batchAssignMunicipios, createMunicipio } from "@/lib/admin/shipping";

export async function updateDispatchClassAction(formData: FormData) {
  await requireAdminSession();
  const id = Number(formData.get("id"));
  const price = Number(formData.get("price") ?? 0);
  const etaMinRaw = String(formData.get("etaMinDays") ?? "").trim();
  const etaMaxRaw = String(formData.get("etaMaxDays") ?? "").trim();
  updateDispatchClass(id, {
    price,
    etaMinDays: etaMinRaw ? Number(etaMinRaw) : null,
    etaMaxDays: etaMaxRaw ? Number(etaMaxRaw) : null,
  });
  redirect("/admin/envios");
}

export async function saveMunicipioAssignmentsAction(changes: { municipioId: number; dispatchClassId: number }[]) {
  await requireAdminSession();
  batchAssignMunicipios(changes);
}

export async function createMunicipioAction(formData: FormData) {
  await requireAdminSession();
  const department = String(formData.get("department") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const dispatchClassId = Number(formData.get("dispatchClassId"));
  if (department && name && dispatchClassId) {
    createMunicipio(department, name, dispatchClassId);
  }
  redirect("/admin/envios");
}
