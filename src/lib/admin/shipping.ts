import "server-only";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/client";

export type DispatchClass = {
  id: number;
  name: string;
  price: number;
  etaMinDays: number | null;
  etaMaxDays: number | null;
  sortOrder: number;
  municipioCount: number;
};

export type Municipio = {
  id: number;
  department: string;
  name: string;
  dispatchClassId: number;
  dispatchClassName: string;
};

type DispatchClassRow = {
  id: number;
  name: string;
  price: number;
  eta_min_days: number | null;
  eta_max_days: number | null;
  sort_order: number;
  municipio_count: number;
};

function rowToDispatchClass(row: DispatchClassRow): DispatchClass {
  return {
    id: row.id,
    name: row.name,
    price: row.price,
    etaMinDays: row.eta_min_days,
    etaMaxDays: row.eta_max_days,
    sortOrder: row.sort_order,
    municipioCount: row.municipio_count,
  };
}

export function getDispatchClasses(): DispatchClass[] {
  const rows = db
    .prepare(
      `SELECT dc.id, dc.name, dc.price, dc.eta_min_days, dc.eta_max_days, dc.sort_order,
              (SELECT COUNT(*) FROM municipios m WHERE m.dispatch_class_id = dc.id) as municipio_count
       FROM dispatch_classes dc
       ORDER BY dc.sort_order ASC`
    )
    .all() as DispatchClassRow[];
  return rows.map(rowToDispatchClass);
}

export function updateDispatchClass(
  id: number,
  input: { price: number; etaMinDays: number | null; etaMaxDays: number | null }
): void {
  db.prepare(
    `UPDATE dispatch_classes SET price = @price, eta_min_days = @etaMinDays, eta_max_days = @etaMaxDays WHERE id = @id`
  ).run({ id, ...input });
  revalidatePath("/admin/envios");
  revalidatePath("/checkout");
  revalidatePath("/legal/envios");
}

export function getMunicipiosByDepartment(department: string): Municipio[] {
  const rows = db
    .prepare(
      `SELECT m.id, m.department, m.name, m.dispatch_class_id as dispatchClassId, dc.name as dispatchClassName
       FROM municipios m
       JOIN dispatch_classes dc ON dc.id = m.dispatch_class_id
       WHERE m.department = ?
       ORDER BY m.name ASC`
    )
    .all(department) as Municipio[];
  return rows;
}

/** Departments where at least one municipio has been moved off the default class — used to color the map. */
export function getCustomizedDepartments(defaultClassName: string): Set<string> {
  const rows = db
    .prepare(
      `SELECT DISTINCT m.department FROM municipios m
       JOIN dispatch_classes dc ON dc.id = m.dispatch_class_id
       WHERE dc.name != ?`
    )
    .all(defaultClassName) as { department: string }[];
  return new Set(rows.map((r) => r.department));
}

export function batchAssignMunicipios(changes: { municipioId: number; dispatchClassId: number }[]): void {
  const stmt = db.prepare("UPDATE municipios SET dispatch_class_id = @dispatchClassId WHERE id = @municipioId");
  const tx = db.transaction((items: typeof changes) => {
    for (const item of items) stmt.run(item);
  });
  tx(changes);
  revalidatePath("/admin/envios");
  revalidatePath("/checkout");
}

export function createMunicipio(department: string, name: string, dispatchClassId: number): void {
  db.prepare(
    "INSERT OR IGNORE INTO municipios (department, name, dispatch_class_id) VALUES (?, ?, ?)"
  ).run(department, name, dispatchClassId);
  revalidatePath("/admin/envios");
}

export type ShippingLookupRow = { department: string; name: string; price: number };

/** Lightweight department+city+price table for the storefront checkout (no dispatch-class ids). */
export function getShippingLookupTable(): ShippingLookupRow[] {
  return db
    .prepare(
      `SELECT m.department, m.name, dc.price
       FROM municipios m
       JOIN dispatch_classes dc ON dc.id = m.dispatch_class_id
       ORDER BY m.department ASC, m.name ASC`
    )
    .all() as ShippingLookupRow[];
}

function normalize(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

/** Looks up the shipping price for a customer's department + city, matched loosely (accent/case-insensitive). */
export function getShippingPriceForLocation(department: string, city: string): number | null {
  const targetDept = normalize(department);
  const targetCity = normalize(city);

  const row = db
    .prepare(
      `SELECT m.department, m.name, dc.price
       FROM municipios m
       JOIN dispatch_classes dc ON dc.id = m.dispatch_class_id`
    )
    .all() as { department: string; name: string; price: number }[];

  const match = row.find((r) => normalize(r.department) === targetDept && normalize(r.name) === targetCity);
  return match ? match.price : null;
}
