import "server-only";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/client";
import { recalculateProductRating } from "@/data/products";
import { deleteReviewPhoto } from "@/lib/admin/uploads";
import type { Review, ReviewStatus } from "@/lib/types";

type ReviewRow = {
  id: number;
  product_slug: string;
  author_name: string;
  author_city: string | null;
  rating: number;
  comment: string;
  photos: string;
  status: string;
  created_at: string;
};

function rowToReview(row: ReviewRow): Review {
  return {
    id: row.id,
    productSlug: row.product_slug,
    authorName: row.author_name,
    authorCity: row.author_city,
    rating: row.rating,
    comment: row.comment,
    photos: JSON.parse(row.photos || "[]"),
    status: row.status as ReviewStatus,
    createdAt: row.created_at,
  };
}

export function getAllReviews(): Review[] {
  const rows = db.prepare("SELECT * FROM reviews ORDER BY created_at DESC").all() as ReviewRow[];
  return rows.map(rowToReview);
}

export function getApprovedReviewsForProduct(productSlug: string): Review[] {
  const rows = db
    .prepare("SELECT * FROM reviews WHERE product_slug = ? AND status = 'approved' ORDER BY created_at DESC")
    .all(productSlug) as ReviewRow[];
  return rows.map(rowToReview);
}

// Para la home: reseñas publicadas de 5 estrellas que traen foto, de productos que siguen publicados.
export function getFiveStarPhotoReviews(limit = 4): (Review & { productName: string })[] {
  const rows = db
    .prepare(
      `SELECT r.*, p.name AS product_name FROM reviews r
       JOIN products p ON p.slug = r.product_slug
       WHERE r.status = 'approved' AND r.rating = 5 AND r.photos <> '[]' AND p.status = 'published'
       ORDER BY r.created_at DESC
       LIMIT ?`
    )
    .all(limit) as (ReviewRow & { product_name: string })[];
  return rows.map((row) => ({ ...rowToReview(row), productName: row.product_name }));
}

export type CreateReviewInput = {
  productSlug: string;
  authorName: string;
  authorCity?: string | null;
  rating: number;
  comment: string;
  photos: string[];
};

export function createReview(input: CreateReviewInput): Review {
  const result = db
    .prepare(
      `INSERT INTO reviews (product_slug, author_name, author_city, rating, comment, photos, status)
       VALUES (@productSlug, @authorName, @authorCity, @rating, @comment, @photos, 'pending')`
    )
    .run({ ...input, authorCity: input.authorCity ?? null, photos: JSON.stringify(input.photos) });
  revalidatePath("/admin/resenas");
  const row = db.prepare("SELECT * FROM reviews WHERE id = ?").get(Number(result.lastInsertRowid)) as ReviewRow;
  return rowToReview(row);
}

export function updateReviewStatus(id: number, status: ReviewStatus): void {
  const row = db.prepare("SELECT * FROM reviews WHERE id = ?").get(id) as ReviewRow | undefined;
  db.prepare("UPDATE reviews SET status = ? WHERE id = ?").run(status, id);
  if (row) {
    recalculateProductRating(row.product_slug);
    revalidatePath(`/producto/${row.product_slug}`);
  }
  revalidatePath("/admin/resenas");
  revalidatePath("/");
}

// Quita una foto puntual (p. ej. una que no debería publicarse) sin borrar la reseña.
export async function removeReviewPhoto(id: number, photo: string): Promise<void> {
  const row = db.prepare("SELECT * FROM reviews WHERE id = ?").get(id) as ReviewRow | undefined;
  if (!row) return;
  const photos = rowToReview(row).photos.filter((p) => p !== photo);
  db.prepare("UPDATE reviews SET photos = ? WHERE id = ?").run(JSON.stringify(photos), id);
  await deleteReviewPhoto(photo);
  revalidatePath(`/producto/${row.product_slug}`);
  revalidatePath("/admin/resenas");
  revalidatePath("/");
}

export async function deleteReview(id: number): Promise<void> {
  const row = db.prepare("SELECT * FROM reviews WHERE id = ?").get(id) as ReviewRow | undefined;
  db.prepare("DELETE FROM reviews WHERE id = ?").run(id);
  if (row) {
    recalculateProductRating(row.product_slug);
    await Promise.all(rowToReview(row).photos.map(deleteReviewPhoto));
  }
  revalidatePath("/admin/resenas");
  revalidatePath("/");
}
