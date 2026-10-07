import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { seedIfEmpty } from "./seed";
import { seedShippingIfEmpty } from "./seed-shipping";
import { backfillLegacyCategoryBanners, seedCategoryContentIfEmpty } from "./category-content-defaults";
import { seedEmailTemplatesIfMissing } from "./seed-email-templates";
import { DATA_ROOT } from "@/lib/paths";

const SCHEMA = `
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  tone TEXT NOT NULL,
  art_variant TEXT NOT NULL,
  image_path TEXT,
  banner_path TEXT,
  content TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  brand_slug TEXT NOT NULL,
  category_slug TEXT NOT NULL REFERENCES categories(slug),
  price INTEGER NOT NULL,
  compare_at_price INTEGER,
  cost_price INTEGER,
  size TEXT NOT NULL,
  short_description TEXT NOT NULL,
  description TEXT NOT NULL,
  how_to_use TEXT NOT NULL DEFAULT '[]',
  ingredients TEXT NOT NULL,
  skin_types TEXT NOT NULL DEFAULT '[]',
  badge TEXT,
  art_variant TEXT NOT NULL,
  tone TEXT NOT NULL,
  featured INTEGER NOT NULL DEFAULT 0,
  images TEXT NOT NULL DEFAULT '[]',
  stock INTEGER NOT NULL DEFAULT 0,
  low_stock_threshold INTEGER NOT NULL DEFAULT 5,
  sku TEXT,
  status TEXT NOT NULL DEFAULT 'published',
  rating REAL NOT NULL DEFAULT 0,
  review_count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_slug TEXT NOT NULL REFERENCES products(slug),
  author_name TEXT NOT NULL,
  author_city TEXT,
  rating INTEGER NOT NULL,
  comment TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  video_url TEXT,
  photos TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Reseñas de rutinas: las rutinas viven en código (src/data/routines.ts), no en la base, así que
-- routine_slug no tiene llave foránea. Misma moderación que las reseñas de productos.
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

CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  department TEXT NOT NULL,
  notes TEXT,
  subtotal INTEGER NOT NULL,
  shipping_cost INTEGER NOT NULL,
  total INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendiente',
  payment_status TEXT NOT NULL DEFAULT 'pendiente',
  tracking_number TEXT,
  carrier TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL REFERENCES orders(id),
  product_slug TEXT NOT NULL,
  product_name TEXT NOT NULL,
  unit_price INTEGER NOT NULL,
  quantity INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS dispatch_classes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  price INTEGER NOT NULL DEFAULT 0,
  eta_min_days INTEGER,
  eta_max_days INTEGER,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS municipios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  department TEXT NOT NULL,
  name TEXT NOT NULL,
  dispatch_class_id INTEGER NOT NULL REFERENCES dispatch_classes(id),
  UNIQUE(department, name)
);

-- Correos automáticos: una plantilla por evento (src/lib/email/events.ts) + bitácora de envíos.
CREATE TABLE IF NOT EXISTS email_templates (
  event TEXT PRIMARY KEY,
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL,
  enabled INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS email_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event TEXT NOT NULL,
  recipient TEXT NOT NULL,
  subject TEXT NOT NULL,
  status TEXT NOT NULL,
  error TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS email_logs_event_created ON email_logs (event, created_at);
`;

function migrate(db: Database.Database) {
  const categoryColumns = db.prepare("PRAGMA table_info(categories)").all() as { name: string }[];
  if (!categoryColumns.some((column) => column.name === "content")) {
    db.exec("ALTER TABLE categories ADD COLUMN content TEXT");
  }
  if (!categoryColumns.some((column) => column.name === "banner_path")) {
    db.exec("ALTER TABLE categories ADD COLUMN banner_path TEXT");
    backfillLegacyCategoryBanners(db);
  }

  const productColumns = db.prepare("PRAGMA table_info(products)").all() as { name: string }[];
  if (!productColumns.some((column) => column.name === "landing")) {
    db.exec("ALTER TABLE products ADD COLUMN landing TEXT");
  }

  const reviewColumns = db.prepare("PRAGMA table_info(reviews)").all() as { name: string }[];
  if (!reviewColumns.some((column) => column.name === "author_city")) {
    db.exec("ALTER TABLE reviews ADD COLUMN author_city TEXT");
  }
  if (!reviewColumns.some((column) => column.name === "video_url")) {
    db.exec("ALTER TABLE reviews ADD COLUMN video_url TEXT");
  }
  if (!reviewColumns.some((column) => column.name === "photos")) {
    db.exec("ALTER TABLE reviews ADD COLUMN photos TEXT NOT NULL DEFAULT '[]'");
  }
}

function createDb() {
  const dataDir = path.join(DATA_ROOT, "data");
  fs.mkdirSync(dataDir, { recursive: true });
  const db = new Database(path.join(dataDir, "rumi.db"));
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  // Un solo bloqueo para todo el arranque: `next build` abre la base en varios procesos a la vez
  // y, sin esto, todos ven la tabla vacía y siembran a la vez (UNIQUE categories.slug).
  db.transaction(() => {
    db.exec(SCHEMA);
    migrate(db);
    seedIfEmpty(db);
    seedShippingIfEmpty(db);
    seedCategoryContentIfEmpty(db);
    seedEmailTemplatesIfMissing(db);
  }).immediate();
  return db;
}

const globalForDb = globalThis as unknown as { __rumiDb?: Database.Database };

export const db = globalForDb.__rumiDb ?? createDb();

if (process.env.NODE_ENV !== "production") {
  globalForDb.__rumiDb = db;
}
