import "server-only";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/client";
import type { ReviewStatus, RoutineReview, RoutineRatingSummary } from "@/lib/types";

// El handle de la base queda cacheado en globalThis durante el desarrollo, así que un servidor ya corriendo
// no vuelve a ejecutar el SCHEMA: se asegura la tabla aquí también (es idempotente).
db.exec(`
  CREATE TABLE IF NOT EXISTS routine_reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    routine_slug TEXT NOT NULL,
    author_name TEXT NOT NULL,
    author_city TEXT,
    rating INTEGER NOT NULL,
    comment TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE INDEX IF NOT EXISTS routine_reviews_slug_status ON routine_reviews (routine_slug, status);
`);

type RoutineReviewRow = {
  id: number;
  routine_slug: string;
  author_name: string;
  author_city: string | null;
  rating: number;
  comment: string;
  status: string;
  created_at: string;
};

function rowToReview(row: RoutineReviewRow): RoutineReview {
  return {
    id: row.id,
    routineSlug: row.routine_slug,
    authorName: row.author_name,
    authorCity: row.author_city,
    rating: row.rating,
    comment: row.comment,
    status: row.status as ReviewStatus,
    createdAt: row.created_at,
  };
}

export function getAllRoutineReviews(): RoutineReview[] {
  const rows = db.prepare("SELECT * FROM routine_reviews ORDER BY created_at DESC").all() as RoutineReviewRow[];
  return rows.map(rowToReview);
}

export function getApprovedRoutineReviews(routineSlug: string): RoutineReview[] {
  const rows = db
    .prepare("SELECT * FROM routine_reviews WHERE routine_slug = ? AND status = 'approved' ORDER BY created_at DESC")
    .all(routineSlug) as RoutineReviewRow[];
  return rows.map(rowToReview);
}

// Promedio, total y cuántas reseñas hay de cada estrella (solo aprobadas).
export function getRoutineRatingSummary(routineSlug: string): RoutineRatingSummary {
  const rows = db
    .prepare(
      "SELECT rating, COUNT(*) as count FROM routine_reviews WHERE routine_slug = ? AND status = 'approved' GROUP BY rating"
    )
    .all(routineSlug) as { rating: number; count: number }[];
  const distribution: RoutineRatingSummary["distribution"] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let total = 0;
  let sum = 0;
  for (const { rating, count } of rows) {
    distribution[rating as 1 | 2 | 3 | 4 | 5] = count;
    total += count;
    sum += rating * count;
  }
  return { average: total > 0 ? Math.round((sum / total) * 10) / 10 : 0, count: total, distribution };
}

export function createRoutineReview(input: {
  routineSlug: string;
  authorName: string;
  authorCity: string | null;
  rating: number;
  comment: string;
}): void {
  db.prepare(
    `INSERT INTO routine_reviews (routine_slug, author_name, author_city, rating, comment, status)
     VALUES (@routineSlug, @authorName, @authorCity, @rating, @comment, 'pending')`
  ).run(input);
  revalidatePath("/admin/resenas");
}

export function updateRoutineReviewStatus(id: number, status: ReviewStatus): void {
  const row = db.prepare("SELECT routine_slug FROM routine_reviews WHERE id = ?").get(id) as { routine_slug: string } | undefined;
  db.prepare("UPDATE routine_reviews SET status = ? WHERE id = ?").run(status, id);
  if (row) revalidatePath(`/rutinas/${row.routine_slug}`);
  revalidatePath("/admin/resenas");
}

export function deleteRoutineReview(id: number): void {
  const row = db.prepare("SELECT routine_slug FROM routine_reviews WHERE id = ?").get(id) as { routine_slug: string } | undefined;
  db.prepare("DELETE FROM routine_reviews WHERE id = ?").run(id);
  if (row) revalidatePath(`/rutinas/${row.routine_slug}`);
  revalidatePath("/admin/resenas");
}
