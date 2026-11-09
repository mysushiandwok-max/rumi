// Copia tarifas y clasificación de municipios de Merkapez (scripts/shipping-merkapez.json).
// Uso: [DATA_DIR=...] node scripts/sync-shipping.cjs
const path = require("path");
const Database = require("better-sqlite3");
const { prices, municipios } = require("./shipping-merkapez.json");

const db = new Database(path.join(process.env.DATA_DIR || process.cwd(), "data", "rumi.db"));
const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s*d\.?\s*c\.?$/i, "").toLowerCase().trim();
const classId = Object.fromEntries(db.prepare("SELECT id, name FROM dispatch_classes").all().map((r) => [r.name, r.id]));
const exact = new Map(municipios.map((m) => [m.d + "|" + m.n, m.c]));
const target = new Map(municipios.map((m) => [norm(m.d) + "|" + norm(m.n), m.c]));

let updated = 0, missing = [];
db.transaction(() => {
  for (const [name, price] of Object.entries(prices))
    db.prepare("UPDATE dispatch_classes SET price = ? WHERE name = ?").run(price, name);
  const upd = db.prepare("UPDATE municipios SET dispatch_class_id = ? WHERE id = ?");
  for (const m of db.prepare("SELECT id, department, name FROM municipios").all()) {
    const c = exact.get(m.department + "|" + m.name) || target.get(norm(m.department) + "|" + norm(m.name));
    if (c && classId[c]) { upd.run(classId[c], m.id); updated++; } else missing.push(m.department + "/" + m.name);
  }
})();
console.log("Municipios actualizados:", updated, "| sin match:", missing.length, missing.slice(0, 20));
console.log(db.prepare("SELECT dc.name, dc.price, COUNT(m.id) n FROM dispatch_classes dc LEFT JOIN municipios m ON m.dispatch_class_id = dc.id GROUP BY dc.id ORDER BY dc.sort_order").all());
