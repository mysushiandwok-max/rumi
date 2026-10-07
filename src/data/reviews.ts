import { db } from "@/lib/db/client";
import { getBrandBySlug } from "@/data/brands";
import type { AccentTone } from "@/lib/types";

export type FeaturedReview = {
  id: number;
  authorName: string;
  authorCity: string | null;
  rating: number;
  comment: string;
  createdAt: string;
  videoUrl: string | null;
  productSlug: string;
  productName: string;
  productImage: string | null;
  productPrice: number;
  brandName: string;
  tone: AccentTone;
};

type FeaturedReviewRow = {
  id: number;
  author_name: string;
  author_city: string | null;
  rating: number;
  comment: string;
  created_at: string;
  video_url: string | null;
  product_slug: string;
  product_name: string;
  images: string;
  price: number;
  tone: string;
};

export function getFeaturedReviews(limit = 6): FeaturedReview[] {
  const rows = db
    .prepare(
      `SELECT r.id, r.author_name, r.author_city, r.rating, r.comment, r.created_at, r.video_url,
              r.product_slug, p.name as product_name, p.images, p.price, p.tone, p.brand_slug
       FROM reviews r
       JOIN products p ON p.slug = r.product_slug
       WHERE r.status = 'approved' AND p.status = 'published'
       ORDER BY r.rating DESC, r.created_at DESC
       LIMIT ?`
    )
    .all(limit) as (FeaturedReviewRow & { brand_slug: string })[];

  return rows.map((row) => {
    const images = JSON.parse(row.images) as string[];
    const brand = getBrandBySlug(row.brand_slug);
    return {
      id: row.id,
      authorName: row.author_name,
      authorCity: row.author_city,
      rating: row.rating,
      comment: row.comment,
      createdAt: row.created_at,
      videoUrl: row.video_url,
      productSlug: row.product_slug,
      productName: row.product_name,
      productImage: images[0] ?? null,
      productPrice: row.price,
      brandName: brand?.name ?? row.brand_slug,
      tone: (brand?.tone ?? "blush") as AccentTone,
    };
  });
}
