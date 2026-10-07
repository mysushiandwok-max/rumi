import { getConnectorSettings } from "@/lib/admin/settings";
import { updateConnectorSettingsAction } from "@/lib/admin/actions/settings";

export const metadata = { title: "Conectores" };

export default function AdminConnectorsPage() {
  const settings = getConnectorSettings();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Conectores</h1>
        <p className="mt-1 text-sm text-ink/60">
          Guarda las credenciales de pagos y envíos. Todavía no se realizan llamadas reales a estos servicios.
        </p>
      </div>

      <form action={updateConnectorSettingsAction} className="flex flex-col gap-6">
        <div className="card-surface flex flex-col gap-4 p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-ink">Bold (pagos)</h2>
            <label className="flex items-center gap-2 text-sm font-semibold text-ink">
              <input type="checkbox" name="boldEnabled" defaultChecked={settings.bold.enabled} className="h-4 w-4 rounded border-border" />
              Activo
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-semibold text-ink">API Key</span>
              <input name="boldApiKey" defaultValue={settings.bold.apiKey} className="input-field" placeholder="pk_live_..." />
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-semibold text-ink">Secret Key</span>
              <input name="boldSecretKey" type="password" defaultValue={settings.bold.secretKey} className="input-field" placeholder="sk_live_..." />
            </label>
          </div>
        </div>

        <div className="card-surface flex flex-col gap-4 p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-ink">Transportadora</h2>
            <label className="flex items-center gap-2 text-sm font-semibold text-ink">
              <input type="checkbox" name="carrierEnabled" defaultChecked={settings.carrier.enabled} className="h-4 w-4 rounded border-border" />
              Activo
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-semibold text-ink">Nombre</span>
              <input name="carrierName" defaultValue={settings.carrier.name} className="input-field" placeholder="Servientrega" />
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-semibold text-ink">API Key</span>
              <input name="carrierApiKey" defaultValue={settings.carrier.apiKey} className="input-field" />
            </label>
          </div>
        </div>

        <button type="submit" className="btn-primary self-start px-6 py-2.5 text-sm">
          Guardar conectores
        </button>
      </form>
    </div>
  );
}
