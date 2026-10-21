// Uso (desde la raíz de la app, con DATA_DIR si la base no está en ./data):
//   node scripts/bold-check.cjs                              -> revisa que haya llaves y prueba la API key contra Bold
//   node scripts/bold-check.cjs <webhookUrl> <RUMI-123456>   -> además simula una venta aprobada firmada para ese pedido
const path = require("path");
const crypto = require("crypto");
const Database = require("better-sqlite3");

const [webhookUrl, orderNumber] = process.argv.slice(2);
const db = new Database(path.join(process.env.DATA_DIR || process.cwd(), "data", "rumi.db"), { readonly: true });
const row = db.prepare("select value from settings where key = 'connectors'").get();
const bold = (row && JSON.parse(row.value).bold) || {};

(async () => {
  console.log(`activo: ${!!bold.enabled} | sandbox: ${!!bold.sandbox} | apiKey: ${bold.apiKey ? "sí" : "FALTA"} | secretKey: ${bold.secretKey ? "sí" : "FALTA"}`);
  if (!bold.apiKey || !bold.secretKey) process.exit(1);

  const res = await fetch("https://integrations.api.bold.co/online/link/v1/payment_methods", {
    headers: { Authorization: `x-api-key ${bold.apiKey}` },
  });
  console.log(`API key en Bold: HTTP ${res.status} ${res.ok ? "(válida)" : "(rechazada)"}`);

  if (webhookUrl && orderNumber) {
    const order = db.prepare("select total from orders where order_number = ?").get(orderNumber);
    if (!order) return console.log(`No existe el pedido ${orderNumber}`);
    const body = JSON.stringify({ type: "SALE_APPROVED", data: { amount: { total: order.total }, metadata: { reference: orderNumber } } });
    const signature = crypto.createHmac("sha256", bold.sandbox ? "" : bold.secretKey).update(Buffer.from(body).toString("base64")).digest("hex");
    const r = await fetch(webhookUrl, { method: "POST", headers: { "x-bold-signature": signature, "content-type": "application/json" }, body });
    console.log(`Webhook simulado: HTTP ${r.status} ${await r.text()}`);
  }
})();
