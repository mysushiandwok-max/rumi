"use server";

import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/admin/auth";
import { createCategory, updateCategory, deleteCategory, getCategoryById } from "@/data/categories";
import { deleteCategoryBanner, saveCategoryBanner } from "@/lib/admin/uploads";
import { normalizeCategoryContent } from "@/lib/category-content";
import type { AccentTone, ProductArtVariant } from "@/lib/types";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function uploadCategoryBannerAction(
  formData: FormData
): Promise<{ url: string; width: number; height: number } | { error: string }> {
  await requireAdminSession();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Selecciona una imagen válida." };
  }
  if (!file.type.startsWith("image/")) {
    return { error: "El archivo debe ser una imagen." };
  }
  if (file.size > 12 * 1024 * 1024) {
    return { error: "La imagen no puede pesar más de 12 MB." };
  }
  try {
    return await saveCategoryBanner(file);
  } catch {
    return { error: "No se pudo procesar la imagen. Intenta con otro archivo." };
  }
}

function parseCategoryForm(formData: FormData) {
  const nameValue = String(formData.get("name") ?? "").trim();
  const slugValue = String(formData.get("slug") ?? "").trim() || slugify(nameValue);
  // El editor de contenido solo existe al editar; sin ese campo se conserva el contenido guardado.
  const rawContent = formData.get("content");
  // Solo se aceptan rutas de la carpeta de subidas, nunca URLs externas.
  const rawBanner = String(formData.get("bannerPath") ?? "").trim();
  const bannerPath = rawBanner.startsWith("/uploads/banners/") && !rawBanner.includes("..") ? rawBanner : undefined;
  return {
    bannerPath,
    slug: slugify(slugValue),
    name: nameValue,
    tagline: String(formData.get("tagline") ?? ""),
    description: String(formData.get("description") ?? ""),
    tone: String(formData.get("tone") ?? "blush") as AccentTone,
    artVariant: String(formData.get("artVariant") ?? "tube") as ProductArtVariant,
    sortOrder: Number(formData.get("sortOrder") ?? 0),
    content: typeof rawContent === "string" ? normalizeCategoryContent(rawContent) : undefined,
  };
}

export type CategoryFormState = { error?: string } | undefined;

export async function createCategoryAction(
  _prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  await requireAdminSession();
  const input = parseCategoryForm(formData);
  if (!input.name) return { error: "El nombre es obligatorio." };
  try {
    createCategory(input);
  } catch {
    return { error: "No se pudo guardar la categoría. Verifica que el slug no esté repetido." };
  }
  redirect("/admin/categorias");
}

export async function updateCategoryAction(
  id: number,
  _prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  await requireAdminSession();
  const existing = getCategoryById(id);
  const input = parseCategoryForm(formData);
  if (!input.name) return { error: "El nombre es obligatorio." };
  try {
    updateCategory(id, input);
  } catch {
    return { error: "No se pudo guardar la categoría. Verifica que el slug no esté repetido." };
  }
  // La foto anterior queda huérfana si se reemplazó o se quitó.
  if (existing?.bannerPath && existing.bannerPath !== input.bannerPath) {
    await deleteCategoryBanner(existing.bannerPath);
  }
  redirect("/admin/categorias");
}

export async function deleteCategoryAction(id: number) {
  await requireAdminSession();
  const existing = getCategoryById(id);
  deleteCategory(id);
  if (existing?.bannerPath) await deleteCategoryBanner(existing.bannerPath);
}
