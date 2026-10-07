"use server";

import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/admin/auth";
import { saveProductImage, deleteProductImage } from "@/lib/admin/uploads";
import { createProduct, updateProduct, deleteProduct, getProductById } from "@/data/products";
import { landingImages, normalizeProductLanding } from "@/lib/product-landing";
import type { AccentTone, Product, ProductArtVariant, ProductStatus } from "@/lib/types";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function uploadProductImageAction(
  formData: FormData
): Promise<{ url: string } | { error: string }> {
  await requireAdminSession();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Selecciona una imagen válida." };
  }
  if (!file.type.startsWith("image/")) {
    return { error: "El archivo debe ser una imagen." };
  }
  if (file.size > 8 * 1024 * 1024) {
    return { error: "La imagen no puede pesar más de 8 MB." };
  }
  try {
    const url = await saveProductImage(file);
    return { url };
  } catch {
    return { error: "No se pudo procesar la imagen. Intenta con otro archivo." };
  }
}

function parseProductForm(formData: FormData) {
  const nonEmpty = (values: FormDataEntryValue[]) =>
    values.map((v) => String(v).trim()).filter((v) => v.length > 0);

  const nameValue = String(formData.get("name") ?? "").trim();
  const slugValue = String(formData.get("slug") ?? "").trim() || slugify(nameValue);
  const slug = slugify(slugValue);

  return {
    slug,
    name: nameValue,
    brandSlug: String(formData.get("brandSlug") ?? ""),
    categorySlug: String(formData.get("categorySlug") ?? ""),
    price: Number(formData.get("price") ?? 0),
    compareAtPrice: formData.get("compareAtPrice") ? Number(formData.get("compareAtPrice")) : undefined,
    costPrice: formData.get("costPrice") ? Number(formData.get("costPrice")) : undefined,
    size: String(formData.get("size") ?? ""),
    shortDescription: String(formData.get("shortDescription") ?? ""),
    description: String(formData.get("description") ?? ""),
    howToUse: nonEmpty(formData.getAll("howToUse")),
    ingredients: String(formData.get("ingredients") ?? ""),
    skinTypes: nonEmpty(formData.getAll("skinTypes")),
    badge: (String(formData.get("badge") ?? "") || undefined) as Product["badge"],
    artVariant: String(formData.get("artVariant") ?? "tube") as ProductArtVariant,
    tone: String(formData.get("tone") ?? "blush") as AccentTone,
    featured: formData.get("featured") === "on",
    images: nonEmpty(formData.getAll("images")),
    stock: Number(formData.get("stock") ?? 0),
    lowStockThreshold: Number(formData.get("lowStockThreshold") ?? 5),
    sku: String(formData.get("sku") ?? "") || undefined,
    status: (String(formData.get("status") ?? "published") as ProductStatus),
    landing: normalizeProductLanding(formData.get("landing"), slug),
  };
}

export type ProductFormState = { error?: string } | undefined;

export async function createProductAction(
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requireAdminSession();
  const input = parseProductForm(formData);
  if (!input.name || !input.categorySlug || !input.brandSlug) {
    return { error: "Nombre, marca y categoría son obligatorios." };
  }
  try {
    createProduct(input);
  } catch {
    return { error: "No se pudo guardar el producto. Verifica que el slug no esté repetido." };
  }
  redirect("/admin/productos");
}

export async function updateProductAction(
  id: number,
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requireAdminSession();
  const existing = getProductById(id);
  const input = parseProductForm(formData);
  if (!input.name || !input.categorySlug || !input.brandSlug) {
    return { error: "Nombre, marca y categoría son obligatorios." };
  }
  try {
    updateProduct(id, input);
  } catch {
    return { error: "No se pudo guardar el producto. Verifica que el slug no esté repetido." };
  }
  const kept = [...input.images, ...landingImages(input.landing)];
  const previous = existing ? [...existing.images, ...landingImages(existing.landing)] : [];
  const removedImages = previous.filter((img) => !kept.includes(img));
  await Promise.all(removedImages.map((img) => deleteProductImage(img)));
  redirect("/admin/productos");
}

export async function deleteProductAction(id: number) {
  await requireAdminSession();
  const existing = getProductById(id);
  if (existing) {
    await Promise.all([...existing.images, ...landingImages(existing.landing)].map((img) => deleteProductImage(img)));
  }
  deleteProduct(id);
}
