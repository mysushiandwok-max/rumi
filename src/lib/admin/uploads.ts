import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";
import { DATA_ROOT } from "@/lib/paths";

const UPLOAD_DIR = path.join(DATA_ROOT, "public", "uploads", "products");
// Rechaza imágenes con más de 40 megapíxeles (bombas de descompresión) en cualquier subida.
const SHARP_INPUT = { limitInputPixels: 40_000_000, failOn: "error" } as const;
const MAX_DIMENSION = 1600;
const WEBP_QUALITY = 82;

export async function saveProductImage(file: File): Promise<string> {
  const bytes = Buffer.from(await file.arrayBuffer());
  const optimized = await sharp(bytes, SHARP_INPUT)
    .rotate()
    .resize({
      width: MAX_DIMENSION,
      height: MAX_DIMENSION,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer();

  const filename = `${crypto.randomUUID()}.webp`;
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOAD_DIR, filename), optimized);
  return `/uploads/products/${filename}`;
}

const BANNER_DIR = path.join(DATA_ROOT, "public", "uploads", "banners");
const BANNER_MAX_WIDTH = 2560;
const BANNER_WEBP_QUALITY = 90;
// Solo se borran las fotos subidas desde el dashboard (nombre uuid), nunca las que se copiaron a mano a la carpeta.
const UPLOADED_BANNER_PATH = /^\/uploads\/banners\/[0-9a-f-]{36}\.webp$/;

// Guarda con nombre único: así cambiar la foto cambia la URL y Next no sirve una versión vieja de su caché.
export async function saveCategoryBanner(file: File): Promise<{ url: string; width: number; height: number }> {
  const bytes = Buffer.from(await file.arrayBuffer());
  const optimized = await sharp(bytes, SHARP_INPUT)
    .rotate()
    .resize({ width: BANNER_MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: BANNER_WEBP_QUALITY })
    .toBuffer();
  const { width = 0, height = 0 } = await sharp(optimized).metadata();

  const filename = `${crypto.randomUUID()}.webp`;
  await fs.mkdir(BANNER_DIR, { recursive: true });
  await fs.writeFile(path.join(BANNER_DIR, filename), optimized);
  return { url: `/uploads/banners/${filename}`, width, height };
}

export async function deleteCategoryBanner(bannerPath: string): Promise<void> {
  if (!UPLOADED_BANNER_PATH.test(bannerPath)) return;
  await fs.unlink(path.join(DATA_ROOT, "public", bannerPath)).catch(() => {});
}

const REVIEW_DIR = path.join(DATA_ROOT, "public", "uploads", "reviews");
const UPLOADED_REVIEW_PATH = /^\/uploads\/reviews\/[0-9a-f-]{36}\.webp$/;

// Fotos de reseñas de clientas: se re-codifican a webp (así se descarta cualquier cosa que no sea imagen,
// y los metadatos como la ubicación GPS del celular) y se achican a un tamaño razonable.
export async function saveReviewPhoto(file: File): Promise<string> {
  const bytes = Buffer.from(await file.arrayBuffer());
  const optimized = await sharp(bytes, SHARP_INPUT)
    .rotate()
    .resize({ width: 1200, height: 1200, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();
  const filename = `${crypto.randomUUID()}.webp`;
  await fs.mkdir(REVIEW_DIR, { recursive: true });
  await fs.writeFile(path.join(REVIEW_DIR, filename), optimized);
  return `/uploads/reviews/${filename}`;
}

export async function deleteReviewPhoto(photoPath: string): Promise<void> {
  if (!UPLOADED_REVIEW_PATH.test(photoPath)) return;
  await fs.unlink(path.join(DATA_ROOT, "public", photoPath)).catch(() => {});
}

// Regex estricta: `startsWith` dejaba pasar rutas con `..` (p. ej. /uploads/products/../../data/rumi.db).
const UPLOADED_PRODUCT_PATH = /^\/uploads\/products\/[0-9a-f-]{36}\.webp$/;

export async function deleteProductImage(imagePath: string): Promise<void> {
  if (!UPLOADED_PRODUCT_PATH.test(imagePath)) return;
  await fs.unlink(path.join(DATA_ROOT, "public", imagePath)).catch(() => {});
}
