import { headers } from "next/headers";
import { getConnectorSettings } from "@/lib/admin/settings";
import { updateBoldSettingsAction } from "@/lib/admin/actions/settings";
import { db } from "@/lib/db/client";
import { formatCOP } from "@/lib/format";

export const metadata = { title: "Bold (pagos)" };

export default async function AdminBoldPage() {
  const { bold } = getConnectorSettings();
  const host = (await headers()).get("host") ?? "rumiskincare.com";
  const webhookUrl = `${host.startsWith("localhost") ? "http" : "https"}://${host}/api/bold/webhook`;
  const paid = db.prepare("SELECT COUNT(*) n, COALESCE(SUM(total),0) t FROM orders WHERE payment_status = 'pagado'").get() as { n: number; t: number };
  const ready = bold.enabled && bold.apiKey && bold.secretKey;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Bold (pagos)</h1>
        <p className="mt-1 text-sm text-ink/60">
          Con Bold activo, el checkout abre la pasarela de Bold y el pedido pasa a «pagado» solo cuando Bold lo confirma por webhook.
        </p>
      </div>

      <div className="card-surface flex flex-wrap items-center gap-x-8 gap-y-2 p-6 text-sm">
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${ready ? "bg-mint-100 text-mint-600" : "bg-blush-100 text-blush-700"}`}>
          {ready ? (bold.sandbox ? "Activo · modo pruebas" : "Activo · producción") : "Inactivo (el checkout no cobra)"}
        </span>
        <span className="text-ink/60">Pedidos pagados: <b className="text-ink">{paid.n}</b> · {formatCOP(paid.t)}</span>
      </div>

      <form action={updateBoldSettingsAction} className="card-surface flex flex-col gap-5 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-semibold text-ink">Llave de identidad (API Key)</span>
            <input name="boldApiKey" defaultValue={bold.apiKey} className="input-field" autoComplete="off" />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-semibold text-ink">Llave secreta</span>
            <input name="boldSecretKey" type="password" defaultValue={bold.secretKey} className="input-field" autoComplete="off" />
          </label>
        </div>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm font-semibold text-ink">
            <input type="checkbox" name="boldEnabled" defaultChecked={bold.enabled} className="h-4 w-4 rounded border-border" />
            Activar pagos con Bold
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold text-ink">
            <input type="checkbox" name="boldSandbox" defaultChecked={bold.sandbox} className="h-4 w-4 rounded border-border" />
            Modo pruebas (llaves de sandbox)
          </label>
        </div>
        <button type="submit" className="btn-primary self-start px-6 py-2.5 text-sm">Guardar</button>
      </form>

      <div className="card-surface flex flex-col gap-3 p-6 text-sm text-ink/70">
        <h2 className="font-display text-base font-bold text-ink">Webhook</h2>
        <p>En Bold → Integraciones → Webhooks, registra esta URL para los eventos de venta aprobada y rechazada:</p>
        <code className="break-all rounded-lg bg-blush-50 px-3 py-2 text-ink">{webhookUrl}</code>
        <p>
          Probar sin pagar: <code>node scripts/bold-check.cjs {webhookUrl} RUMI-123456</code> (revisa las llaves y simula una venta aprobada del pedido indicado).
        </p>
      </div>
    </div>
  );
}
