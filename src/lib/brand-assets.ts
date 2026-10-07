import "server-only";
import fs from "node:fs";
import path from "node:path";
import { DATA_ROOT } from "@/lib/paths";

const BANNER_DIR = path.join(DATA_ROOT, "public", "uploads", "brand-banners");
const BANNER_EXTENSIONS = ["webp", "jpg", "jpeg", "png"];

// Drop a file named {slug}.{ext} into public/uploads/brand-banners/ to set a brand's banner background.
export function getBrandBannerImage(slug: string): string | null {
  for (const ext of BANNER_EXTENSIONS) {
    const filename = `${slug}.${ext}`;
    if (fs.existsSync(path.join(BANNER_DIR, filename))) {
      return `/uploads/brand-banners/${filename}`;
    }
  }
  return null;
}
