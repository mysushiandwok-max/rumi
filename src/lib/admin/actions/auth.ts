"use server";

import { redirect } from "next/navigation";
import { signInAdmin, signOutAdmin } from "@/lib/admin/auth";

export async function signInAdminAction(
  _prevState: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const result = await signInAdmin(email, password);
  if ("error" in result) {
    return { error: result.error };
  }
  redirect("/admin");
}

export async function signOutAdminAction() {
  await signOutAdmin();
  redirect("/admin/login");
}
