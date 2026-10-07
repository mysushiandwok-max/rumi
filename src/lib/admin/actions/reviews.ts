"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/admin/auth";
import { createReview, updateReviewStatus, deleteReview, removeReviewPhoto } from "@/lib/admin/reviews";
import { deleteReviewPhoto, saveReviewPhoto } from "@/lib/admin/uploads";
import { getProductBySlug } from "@/data/products";
import type { ReviewStatus } from "@/lib/types";

const MAX_PHOTOS = 3;
const MAX_PHOTO_BYTES = 8 * 1024 * 1024;

// Formulario público: todo lo que llega aquí es de una visitante anónima, así que se valida y recorta.
export async function submitReviewAction(formData: FormData) {
  const productSlug = String(formData.get("productSlug") ?? "");
  const authorName = String(formData.get("authorName") ?? "").trim().slice(0, 60);
  const authorCity = String(formData.get("authorCity") ?? "").trim().slice(0, 60);
  const rating = Math.round(Number(formData.get("rating") ?? 5)) || 5;
  const comment = String(formData.get("comment") ?? "").trim().slice(0, 1500);
  const files = formData
    .getAll("photos")
    .filter((value): value is File => value instanceof File && value.size > 0);

  if (!productSlug || !authorName || !authorCity || !comment) {
    return { error: "Completa tu nombre, tu ciudad y tu comentario para enviar la reseña." };
  }
  if (getProductBySlug(productSlug)?.status !== "published") {
    return { error: "Este producto no está disponible para reseñas." };
  }
  if (files.length > MAX_PHOTOS) {
    return { error: `Puedes subir máximo ${MAX_PHOTOS} fotos.` };
  }
  if (files.some((file) => !file.type.startsWith("image/") || file.size > MAX_PHOTO_BYTES)) {
    return { error: "Las fotos deben ser imágenes de máximo 8 MB cada una." };
  }

  const photos: string[] = [];
  try {
    for (const file of files) photos.push(await saveReviewPhoto(file));
  } catch {
    await Promise.all(photos.map(deleteReviewPhoto));
    return { error: "No pudimos leer una de las fotos. Prueba con otra imagen (JPG, PNG o WEBP)." };
  }

  createReview({
    productSlug,
    authorName,
    authorCity,
    rating: Math.min(5, Math.max(1, rating)),
    comment,
    photos,
  });

  revalidatePath(`/producto/${productSlug}`);
  return { success: true };
}

export async function updateReviewStatusAction(id: number, status: ReviewStatus) {
  await requireAdminSession();
  updateReviewStatus(id, status);
}

export async function deleteReviewAction(id: number) {
  await requireAdminSession();
  await deleteReview(id);
}

export async function removeReviewPhotoAction(id: number, photo: string) {
  await requireAdminSession();
  await removeReviewPhoto(id, photo);
}
