"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/admin/auth";
import { getRoutineBySlug } from "@/data/routines";
import { createRoutineReview, deleteRoutineReview, updateRoutineReviewStatus } from "@/lib/routine-reviews";
import type { ReviewStatus } from "@/lib/types";

// Reseña pública de una rutina: entra como pendiente y solo se publica cuando un admin la aprueba.
export async function submitRoutineReviewAction(formData: FormData) {
  const routineSlug = String(formData.get("routineSlug") ?? "");
  const authorName = String(formData.get("authorName") ?? "").trim().slice(0, 80);
  const authorCity = String(formData.get("authorCity") ?? "").trim().slice(0, 60);
  const rating = Math.round(Number(formData.get("rating") ?? 0));
  const comment = String(formData.get("comment") ?? "").trim().slice(0, 1200);

  if (!getRoutineBySlug(routineSlug)) return { error: "No encontramos esta rutina." };
  if (!(rating >= 1 && rating <= 5)) return { error: "Elige de 1 a 5 estrellas." };
  if (!authorName || !comment) return { error: "Completa tu nombre y tu comentario para enviar la reseña." };

  createRoutineReview({ routineSlug, authorName, authorCity: authorCity || null, rating, comment });
  revalidatePath(`/rutinas/${routineSlug}`);
  return { success: true };
}

export async function updateRoutineReviewStatusAction(id: number, status: ReviewStatus) {
  await requireAdminSession();
  updateRoutineReviewStatus(id, status);
}

export async function deleteRoutineReviewAction(id: number) {
  await requireAdminSession();
  deleteRoutineReview(id);
}
