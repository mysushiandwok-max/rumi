// Uso (desde la raíz de la app):
//   node scripts/sync-products.cjs export 45      -> export-hostinger/productos.json (productos con id >= 45)
//   node sync-products.cjs import [--update]  (productos.json junto al script o en export-hostinger/)
const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");

const [mode, arg] = process.argv.slice(2);
const root = process.env.DATA_DIR || process.cwd();
const db = new Database(path.join(root, "data", "rumi.db"));
const file = fs.existsSync(path.join(process.cwd(), "productos.json")) ? path.join(process.cwd(), "productos.json") : path.join(process.cwd(), "export-hostinger", "productos.json");
const catCols = ["slug","name","tagline","description","tone","art_variant","image_path","banner_path","content","sort_order"];
const cols = ["slug","name","brand_slug","category_slug","price","compare_at_price","cost_price","size","short_description","description","how_to_use","ingredients","skin_types","badge","art_variant","tone","featured","images","stock","low_stock_threshold","sku","status","landing"];

if (mode === "export") {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const rows = db.prepare(`select ${cols.join(",")} from products where id >= ? order by id`).all(Number(arg));
  const slugs = [...new Set(rows.map((r) => r.category_slug))];
  const categorias = db.prepare(`select ${catCols.join(",")} from categories where slug in (${slugs.map(() => "?").join(",")})`).all(...slugs);
  fs.writeFileSync(file, JSON.stringify({ categorias, productos: rows }, null, 1));
  console.log(`${rows.length} productos, ${categorias.length} categorías -> ${file}`);
} else if (mode === "import") {
  const update = process.argv.includes("--update");
  const { categorias, productos: rows } = JSON.parse(fs.readFileSync(file, "utf8"));
  const insCat = db.prepare(`insert or ignore into categories (${catCols.join(",")}) values (${catCols.map((c) => "@" + c).join(",")})`);
  const ins = db.prepare(`insert into products (${cols.join(",")}) values (${cols.map((c) => "@" + c).join(",")})`);
  const upd = db.prepare(`update products set ${cols.map((c) => `${c}=@${c}`).join(",")}, updated_at=datetime('now') where slug=@slug`);
  const has = db.prepare("select 1 from products where slug=?");
  let n = { nuevos: 0, actualizados: 0, saltados: 0 };
  db.transaction(() => {
    for (const c of categorias) insCat.run(c);
    for (const r of rows) {
      if (!has.get(r.slug)) { ins.run(r); n.nuevos++; }
      else if (update) { upd.run(r); n.actualizados++; }
      else n.saltados++;
    }
  })();
  console.log(n);
}
