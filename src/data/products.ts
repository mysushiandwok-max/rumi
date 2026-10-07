import fs from "node:fs";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/client";
import { formatCOP } from "@/lib/format";
import { normalizeProductLanding } from "@/lib/product-landing";
import type { AccentTone, Product, ProductArtVariant, ProductLanding, ProductStatus } from "@/lib/types";
import { DATA_ROOT } from "@/lib/paths";

export { formatCOP };

const PRODUCT_UPLOAD_DIR = path.join(DATA_ROOT, "public", "uploads", "products");
const FALLBACK_IMAGE_EXTENSIONS = ["webp", "jpg", "jpeg", "png"];

// Falls back to /uploads/products/{slug}.{ext} when no image is linked in the DB,
// so dropping a file with that name in the folder is enough — no admin edit needed.
function resolveProductImages(slug: string, storedImages: string[]): string[] {
  if (storedImages.length > 0) return storedImages;
  for (const ext of FALLBACK_IMAGE_EXTENSIONS) {
    const filename = `${slug}.${ext}`;
    if (fs.existsSync(path.join(PRODUCT_UPLOAD_DIR, filename))) {
      return [`/uploads/products/${filename}`];
    }
  }
  return storedImages;
}

type ProductRow = {
  id: number;
  slug: string;
  name: string;
  brand_slug: string;
  category_slug: string;
  price: number;
  compare_at_price: number | null;
  cost_price: number | null;
  size: string;
  short_description: string;
  description: string;
  how_to_use: string;
  ingredients: string;
  skin_types: string;
  badge: string | null;
  art_variant: string;
  tone: string;
  featured: number;
  images: string;
  stock: number;
  low_stock_threshold: number;
  sku: string | null;
  status: string;
  rating: number;
  review_count: number;
  landing: string | null;
  created_at: string;
  updated_at: string;
};

function rowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    brandSlug: row.brand_slug,
    categorySlug: row.category_slug,
    price: row.price,
    compareAtPrice: row.compare_at_price ?? undefined,
    costPrice: row.cost_price ?? undefined,
    size: row.size,
    shortDescription: row.short_description,
    description: row.description,
    howToUse: JSON.parse(row.how_to_use),
    ingredients: row.ingredients,
    skinTypes: JSON.parse(row.skin_types),
    badge: (row.badge as Product["badge"]) ?? undefined,
    rating: row.rating,
    reviewCount: row.review_count,
    artVariant: row.art_variant as ProductArtVariant,
    tone: row.tone as AccentTone,
    featured: Boolean(row.featured),
    images: resolveProductImages(row.slug, JSON.parse(row.images)),
    stock: row.stock,
    lowStockThreshold: row.low_stock_threshold,
    sku: row.sku ?? undefined,
    status: row.status as ProductStatus,
    landing: normalizeProductLanding(row.landing, row.slug),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// La tienda pública pasa estos productos a componentes cliente, así que viajan en el HTML de la página.
// El costo es un dato interno: solo lo devuelven las lecturas del admin (getAllProductsAdmin y getProductById).
function rowToPublicProduct(row: ProductRow): Product {
  const product = rowToProduct(row);
  delete product.costPrice;
  return product;
}

export function getAllProducts(): Product[] {
  const rows = db
    .prepare("SELECT * FROM products WHERE status = 'published' ORDER BY created_at DESC")
    .all() as ProductRow[];
  return rows.map((row) => rowToPublicProduct(row));
}

export function getAllProductsAdmin(): Product[] {
  const rows = db.prepare("SELECT * FROM products ORDER BY created_at DESC").all() as ProductRow[];
  return rows.map((row) => rowToProduct(row));
}

export function getProductBySlug(slug: string): Product | undefined {
  const row = db.prepare("SELECT * FROM products WHERE slug = ?").get(slug) as ProductRow | undefined;
  return row ? rowToPublicProduct(row) : undefined;
}

export function getProductById(id: number): Product | undefined {
  const row = db.prepare("SELECT * FROM products WHERE id = ?").get(id) as ProductRow | undefined;
  return row ? rowToProduct(row) : undefined;
}

export function getProductsByCategory(categorySlug: string): Product[] {
  const rows = db
    .prepare("SELECT * FROM products WHERE category_slug = ? AND status = 'published' ORDER BY created_at DESC")
    .all(categorySlug) as ProductRow[];
  return rows.map((row) => rowToPublicProduct(row));
}

export function getProductsByBrand(brandSlug: string): Product[] {
  const rows = db
    .prepare("SELECT * FROM products WHERE brand_slug = ? AND status = 'published' ORDER BY created_at DESC")
    .all(brandSlug) as ProductRow[];
  return rows.map((row) => rowToPublicProduct(row));
}

export function getFeaturedProducts(): Product[] {
  const rows = db
    .prepare("SELECT * FROM products WHERE featured = 1 AND status = 'published' ORDER BY created_at DESC")
    .all() as ProductRow[];
  return rows.map((row) => rowToPublicProduct(row));
}

export function getLowStockProducts(): Product[] {
  const rows = db
    .prepare("SELECT * FROM products WHERE stock <= low_stock_threshold AND status = 'published' ORDER BY stock ASC")
    .all() as ProductRow[];
  return rows.map((row) => rowToPublicProduct(row));
}

export type ProductInput = {
  slug: string;
  name: string;
  brandSlug: string;
  categorySlug: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  size: string;
  shortDescription: string;
  description: string;
  howToUse: string[];
  ingredients: string;
  skinTypes: string[];
  badge?: Product["badge"];
  artVariant: ProductArtVariant;
  tone: AccentTone;
  featured: boolean;
  images: string[];
  stock: number;
  lowStockThreshold: number;
  sku?: string;
  status: ProductStatus;
  landing: ProductLanding;
};

function revalidateProductPaths(product: { slug: string; categorySlug: string }) {
  revalidatePath("/");
  revalidatePath("/tienda");
  revalidatePath(`/producto/${product.slug}`);
  revalidatePath(`/categoria/${product.categorySlug}`);
}

function toRowParams(input: ProductInput) {
  return {
    slug: input.slug,
    name: input.name,
    brandSlug: input.brandSlug,
    categorySlug: input.categorySlug,
    price: input.price,
    compareAtPrice: input.compareAtPrice ?? null,
    costPrice: input.costPrice ?? null,
    size: input.size,
    shortDescription: input.shortDescription,
    description: input.description,
    howToUse: JSON.stringify(input.howToUse),
    ingredients: input.ingredients,
    skinTypes: JSON.stringify(input.skinTypes),
    badge: input.badge ?? null,
    artVariant: input.artVariant,
    tone: input.tone,
    featured: input.featured ? 1 : 0,
    images: JSON.stringify(input.images),
    stock: input.stock,
    lowStockThreshold: input.lowStockThreshold,
    sku: input.sku ?? null,
    status: input.status,
    landing: JSON.stringify(input.landing),
  };
}

export function createProduct(input: ProductInput): Product {
  const result = db
    .prepare(
      `INSERT INTO products (
        slug, name, brand_slug, category_slug, price, compare_at_price, cost_price, size,
        short_description, description, how_to_use, ingredients, skin_types, badge,
        art_variant, tone, featured, images, stock, low_stock_threshold, sku, status, landing
      ) VALUES (
        @slug, @name, @brandSlug, @categorySlug, @price, @compareAtPrice, @costPrice, @size,
        @shortDescription, @description, @howToUse, @ingredients, @skinTypes, @badge,
        @artVariant, @tone, @featured, @images, @stock, @lowStockThreshold, @sku, @status, @landing
      )`
    )
    .run(toRowParams(input));
  revalidateProductPaths(input);
  return getProductById(Number(result.lastInsertRowid))!;
}

export function updateProduct(id: number, input: ProductInput): Product {
  const previous = getProductById(id);
  db.prepare(
    `UPDATE products SET
      slug = @slug, name = @name, brand_slug = @brandSlug, category_slug = @categorySlug,
      price = @price, compare_at_price = @compareAtPrice, cost_price = @costPrice, size = @size,
      short_description = @shortDescription, description = @description, how_to_use = @howToUse,
      ingredients = @ingredients, skin_types = @skinTypes, badge = @badge, art_variant = @artVariant,
      tone = @tone, featured = @featured, images = @images, stock = @stock,
      low_stock_threshold = @lowStockThreshold, sku = @sku, status = @status, landing = @landing,
      updated_at = datetime('now')
     WHERE id = @id`
  ).run({ ...toRowParams(input), id });
  revalidateProductPaths(input);
  if (previous && previous.categorySlug !== input.categorySlug) {
    revalidatePath(`/categoria/${previous.categorySlug}`);
  }
  if (previous && previous.slug !== input.slug) {
    revalidatePath(`/producto/${previous.slug}`);
  }
  return getProductById(id)!;
}

export function deleteProduct(id: number): void {
  const product = getProductById(id);
  db.prepare("DELETE FROM products WHERE id = ?").run(id);
  if (product) revalidateProductPaths(product);
}

export function recalculateProductRating(slug: string): void {
  const { avg, count } = db
    .prepare(
      "SELECT AVG(rating) as avg, COUNT(*) as count FROM reviews WHERE product_slug = ? AND status = 'approved'"
    )
    .get(slug) as { avg: number | null; count: number };
  if (count > 0) {
    db.prepare("UPDATE products SET rating = ?, review_count = ? WHERE slug = ?").run(
      Math.round(avg! * 10) / 10,
      count,
      slug
    );
    revalidatePath(`/producto/${slug}`);
  }
}
