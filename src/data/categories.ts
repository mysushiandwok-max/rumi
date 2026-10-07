import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/client";
import { normalizeCategoryContent } from "@/lib/category-content";
import type { AccentTone, Category, CategoryContent, ProductArtVariant } from "@/lib/types";

type CategoryRow = {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  tone: string;
  art_variant: string;
  image_path: string | null;
  banner_path: string | null;
  content: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

function rowToCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    tone: row.tone as AccentTone,
    artVariant: row.art_variant as ProductArtVariant,
    imagePath: row.image_path ?? undefined,
    bannerPath: row.banner_path ?? undefined,
    content: normalizeCategoryContent(row.content),
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function getAllCategories(): Category[] {
  const rows = db.prepare("SELECT * FROM categories ORDER BY sort_order ASC, name ASC").all() as CategoryRow[];
  return rows.map(rowToCategory);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  const row = db.prepare("SELECT * FROM categories WHERE slug = ?").get(slug) as CategoryRow | undefined;
  return row ? rowToCategory(row) : undefined;
}

export function getCategoryById(id: number): Category | undefined {
  const row = db.prepare("SELECT * FROM categories WHERE id = ?").get(id) as CategoryRow | undefined;
  return row ? rowToCategory(row) : undefined;
}

export type CategoryInput = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  tone: AccentTone;
  artVariant: ProductArtVariant;
  imagePath?: string;
  bannerPath?: string;
  // Si no se envía, en una actualización se conserva el contenido guardado.
  content?: CategoryContent;
  sortOrder: number;
};

function revalidateCategoryPaths(slug?: string) {
  revalidatePath("/");
  revalidatePath("/tienda");
  // Las secciones de "sigue explorando" de todas las categorías dependen de esta.
  revalidatePath("/categoria/[slug]", "page");
  if (slug) revalidatePath(`/categoria/${slug}`);
}

export function createCategory(input: CategoryInput): Category {
  const result = db
    .prepare(
      `INSERT INTO categories (slug, name, tagline, description, tone, art_variant, image_path, banner_path, content, sort_order)
       VALUES (@slug, @name, @tagline, @description, @tone, @artVariant, @imagePath, @bannerPath, @content, @sortOrder)`
    )
    .run({
      slug: input.slug,
      name: input.name,
      tagline: input.tagline,
      description: input.description,
      tone: input.tone,
      artVariant: input.artVariant,
      imagePath: input.imagePath ?? null,
      bannerPath: input.bannerPath ?? null,
      content: JSON.stringify(normalizeCategoryContent(input.content)),
      sortOrder: input.sortOrder,
    });
  revalidateCategoryPaths(input.slug);
  return getCategoryById(Number(result.lastInsertRowid))!;
}

export function updateCategory(id: number, input: CategoryInput): Category {
  const current = getCategoryById(id);
  const content = input.content ?? current?.content;
  db.prepare(
    `UPDATE categories SET slug = @slug, name = @name, tagline = @tagline, description = @description,
       tone = @tone, art_variant = @artVariant, image_path = @imagePath, banner_path = @bannerPath,
       content = @content, sort_order = @sortOrder, updated_at = datetime('now')
     WHERE id = @id`
  ).run({
    slug: input.slug,
    name: input.name,
    tagline: input.tagline,
    description: input.description,
    tone: input.tone,
    artVariant: input.artVariant,
    imagePath: input.imagePath ?? null,
    bannerPath: input.bannerPath ?? null,
    content: JSON.stringify(normalizeCategoryContent(content)),
    sortOrder: input.sortOrder,
    id,
  });
  // Si cambió el slug, la página anterior ya no existe.
  if (current && current.slug !== input.slug) revalidatePath(`/categoria/${current.slug}`);
  revalidateCategoryPaths(input.slug);
  return getCategoryById(id)!;
}

export function deleteCategory(id: number): void {
  const category = getCategoryById(id);
  db.prepare("DELETE FROM categories WHERE id = ?").run(id);
  revalidateCategoryPaths(category?.slug);
}
