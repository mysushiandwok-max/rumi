import type { ProductLanding } from "@/lib/types";

export const LANDING_LIMITS = {
  benefits: 4,
  results: 4,
  keyIngredients: 4,
  banners: 2,
  gallery: 6,
  videos: 6,
  vsRows: 8,
  pairWith: 3,
  compareWith: 3,
  faq: 8,
} as const;

export const EMPTY_PRODUCT_LANDING: ProductLanding = {
  headline: "",
  benefitsImage: "",
  benefits: [],
  results: [],
  keyIngredients: [],
  routineImage: "",
  banners: [],
  gallery: [],
  videos: [],
  vsRows: [],
  moment: "",
  pairWith: [],
  compareWith: [],
  faq: [],
};

function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function list(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value)
    ? value.map((item) => (item && typeof item === "object" ? (item as Record<string, unknown>) : {}))
    : [];
}

// Solo imágenes subidas al sitio (el admin las sube a /uploads); cualquier otra cosa se descarta.
function image(value: unknown): string {
  const url = text(value, 300);
  return url.startsWith("/uploads/") && !url.includes("..") ? url : "";
}

function slugs(value: unknown, max: number, own?: string): string[] {
  const values = Array.isArray(value) ? value.map((slug) => text(slug, 120)) : [];
  return Array.from(new Set(values.filter((slug) => slug && slug !== own))).slice(0, max);
}

// Acepta JSON crudo (DB o formulario) o un objeto; siempre devuelve una forma válida y recortada.
export function normalizeProductLanding(raw: unknown, ownSlug?: string): ProductLanding {
  let source: unknown = raw;
  if (typeof raw === "string") {
    try {
      source = JSON.parse(raw);
    } catch {
      source = null;
    }
  }
  const data = source && typeof source === "object" ? (source as Record<string, unknown>) : {};

  return {
    headline: text(data.headline, 140),
    benefitsImage: image(data.benefitsImage),
    benefits: list(data.benefits)
      .map((b) => ({ title: text(b.title, 60), text: text(b.text, 200) }))
      .filter((b) => b.title)
      .slice(0, LANDING_LIMITS.benefits),
    results: list(data.results)
      .map((r) => ({ when: text(r.when, 30), text: text(r.text, 200) }))
      .filter((r) => r.when && r.text)
      .slice(0, LANDING_LIMITS.results),
    keyIngredients: list(data.keyIngredients)
      .map((i) => ({ name: text(i.name, 60), benefit: text(i.benefit, 220), image: image(i.image) }))
      .filter((i) => i.name)
      .slice(0, LANDING_LIMITS.keyIngredients),
    routineImage: image(data.routineImage),
    banners: list(data.banners)
      .map((b) => ({ image: image(b.image), title: text(b.title, 90), text: text(b.text, 200) }))
      .filter((b) => b.image)
      .slice(0, LANDING_LIMITS.banners),
    gallery: (Array.isArray(data.gallery) ? data.gallery : [])
      .map(image)
      .filter(Boolean)
      .slice(0, LANDING_LIMITS.gallery),
    videos: (Array.isArray(data.videos) ? data.videos : [])
      .map((url) => text(url, 300))
      .filter((url) => videoEmbed(url) !== null)
      .slice(0, LANDING_LIMITS.videos),
    vsRows: list(data.vsRows)
      .map((r) => ({ label: text(r.label, 80), ours: Boolean(r.ours), others: Boolean(r.others) }))
      .filter((r) => r.label)
      .slice(0, LANDING_LIMITS.vsRows),
    moment: text(data.moment, 30),
    pairWith: slugs(data.pairWith, LANDING_LIMITS.pairWith, ownSlug),
    compareWith: slugs(data.compareWith, LANDING_LIMITS.compareWith, ownSlug),
    faq: list(data.faq)
      .map((f) => ({ question: text(f.question, 160), answer: text(f.answer, 600) }))
      .filter((f) => f.question && f.answer)
      .slice(0, LANDING_LIMITS.faq),
  };
}

// Convierte un link público de TikTok o Instagram en la URL de su reproductor embebido.
// Solo acepta esos dos hosts: el resultado va a un iframe.
export function videoEmbed(url: string): { src: string; source: "tiktok" | "instagram" } | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  const host = parsed.hostname.replace(/^www\./, "");
  if (host === "tiktok.com") {
    const id = parsed.pathname.match(/\/video\/(\d+)/)?.[1];
    return id ? { src: `https://www.tiktok.com/player/v1/${id}?description=0&music_info=0&rel=0`, source: "tiktok" } : null;
  }
  if (host === "instagram.com") {
    const code = parsed.pathname.match(/^\/(?:p|reel|reels)\/([\w-]+)/)?.[1];
    return code ? { src: `https://www.instagram.com/p/${code}/embed`, source: "instagram" } : null;
  }
  return null;
}

// Todas las imágenes que usa la landing, para borrar del disco las que se quitan al editar o eliminar.
export function landingImages(landing: ProductLanding): string[] {
  return [
    landing.benefitsImage,
    landing.routineImage,
    ...landing.keyIngredients.map((i) => i.image),
    ...landing.banners.map((b) => b.image),
    ...landing.gallery,
  ].filter(Boolean);
}
