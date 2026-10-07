import type Database from "better-sqlite3";
import { COLOMBIA_MUNICIPIOS } from "@/lib/colombia-municipios";

const DISPATCH_CLASSES = [
  "Urbano",
  "Regional",
  "Nacional",
  "Reexpedición",
  "Reexpedición Especial",
  "San Andrés y Leticia",
  "Poblaciones Especiales Aéreas",
] as const;

const DEFAULT_CLASS = "Nacional";

export function seedShippingIfEmpty(db: Database.Database) {
  const { count } = db.prepare("SELECT COUNT(*) as count FROM dispatch_classes").get() as { count: number };
  if (count > 0) return;

  const insertClass = db.prepare(
    "INSERT INTO dispatch_classes (name, price, sort_order) VALUES (@name, 0, @sortOrder)"
  );
  const insertMunicipio = db.prepare(
    "INSERT OR IGNORE INTO municipios (department, name, dispatch_class_id) VALUES (@department, @name, @dispatchClassId)"
  );

  const seedAll = db.transaction(() => {
    DISPATCH_CLASSES.forEach((name, i) => insertClass.run({ name, sortOrder: i + 1 }));

    const defaultClassId = (
      db.prepare("SELECT id FROM dispatch_classes WHERE name = ?").get(DEFAULT_CLASS) as { id: number }
    ).id;

    for (const m of COLOMBIA_MUNICIPIOS) {
      insertMunicipio.run({ department: m.department, name: m.name, dispatchClassId: defaultClassId });
    }
  });

  seedAll();
}
