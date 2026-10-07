import type {
  CategoryComparisonRow,
  CategoryContent,
  CategoryEducationPoint,
  CategoryGuideGroup,
  CategoryGuideItem,
} from "@/lib/types";

export const CONTENT_LIMITS = {
  groups: 4,
  itemsPerGroup: 8,
  productsPerItem: 3,
  comparisonRows: 12,
  educationPoints: 6,
} as const;

export const EMPTY_CATEGORY_CONTENT: CategoryContent = {
  guide: { title: "", intro: "", groups: [] },
  comparison: { title: "", rows: [] },
  education: { title: "", intro: "", points: [] },
  showMiniBanners: true,
};

function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function list(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function normalizeItem(raw: unknown): CategoryGuideItem | null {
  const item = record(raw);
  const label = text(item.label, 60);
  if (!label) return null;
  const productSlugs = Array.from(
    new Set(list(item.productSlugs).map((slug) => text(slug, 120)).filter(Boolean))
  ).slice(0, CONTENT_LIMITS.productsPerItem);
  return { label, blurb: text(item.blurb, 320), productSlugs };
}

function normalizeGroup(raw: unknown): CategoryGuideGroup | null {
  const group = record(raw);
  const title = text(group.title, 40);
  if (!title) return null;
  const items = list(group.items)
    .map(normalizeItem)
    .filter((item): item is CategoryGuideItem => item !== null)
    .slice(0, CONTENT_LIMITS.itemsPerGroup);
  return { title, items };
}

function normalizeRow(raw: unknown): CategoryComparisonRow | null {
  const row = record(raw);
  const productSlug = text(row.productSlug, 120);
  if (!productSlug) return null;
  return {
    productSlug,
    skinType: text(row.skinType, 80),
    texture: text(row.texture, 80),
    keyIngredient: text(row.keyIngredient, 100),
    moment: text(row.moment, 60),
  };
}

function normalizePoint(raw: unknown): CategoryEducationPoint | null {
  const point = record(raw);
  const title = text(point.title, 90);
  if (!title) return null;
  return { title, text: text(point.text, 420) };
}

// Acepta JSON crudo (string desde la DB o el formulario) o un objeto, y siempre devuelve una forma válida.
export function normalizeCategoryContent(raw: unknown): CategoryContent {
  let source: unknown = raw;
  if (typeof raw === "string") {
    try {
      source = JSON.parse(raw);
    } catch {
      source = null;
    }
  }
  const content = record(source);
  const guide = record(content.guide);
  const comparison = record(content.comparison);
  const education = record(content.education);

  return {
    guide: {
      title: text(guide.title, 90),
      intro: text(guide.intro, 240),
      groups: list(guide.groups)
        .map(normalizeGroup)
        .filter((group): group is CategoryGuideGroup => group !== null)
        .slice(0, CONTENT_LIMITS.groups),
    },
    comparison: {
      title: text(comparison.title, 90),
      rows: list(comparison.rows)
        .map(normalizeRow)
        .filter((row): row is CategoryComparisonRow => row !== null)
        .slice(0, CONTENT_LIMITS.comparisonRows),
    },
    education: {
      title: text(education.title, 120),
      intro: text(education.intro, 320),
      points: list(education.points)
        .map(normalizePoint)
        .filter((point): point is CategoryEducationPoint => point !== null)
        .slice(0, CONTENT_LIMITS.educationPoints),
    },
    showMiniBanners: content.showMiniBanners === undefined ? true : Boolean(content.showMiniBanners),
  };
}
