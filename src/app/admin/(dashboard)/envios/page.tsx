import { getShippingSettings } from "@/lib/admin/settings";
import { updateShippingSettingsAction } from "@/lib/admin/actions/settings";
import { getDispatchClasses, getMunicipiosByDepartment, getCustomizedDepartments } from "@/lib/admin/shipping";
import { COLOMBIA_DEPARTMENTS } from "@/lib/colombia";
import { DispatchClassManager } from "@/components/admin/DispatchClassManager";
import { MunicipioManager } from "@/components/admin/MunicipioManager";

export const metadata = { title: "Envíos" };

const DEFAULT_CLASS_NAME = "Nacional";

export default function AdminShippingPage() {
  const settings = getShippingSettings();
  const dispatchClasses = getDispatchClasses();
  const municipios = COLOMBIA_DEPARTMENTS.flatMap((department) => getMunicipiosByDepartment(department));
  const customizedDepartments = Array.from(getCustomizedDepartments(DEFAULT_CLASS_NAME));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Envíos</h1>
        <p className="mt-1 text-sm text-ink/60">
          Configura el precio de envío por municipio, agrupado en categorías de despacho.
        </p>
      </div>

      <form action={updateShippingSettingsAction} className="card-surface flex max-w-lg flex-col gap-4 p-6">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-semibold text-ink">Umbral de envío gratis (COP)</span>
          <input
            name="freeShippingThreshold"
            type="number"
            min={0}
            step={1000}
            defaultValue={settings.freeShippingThreshold}
            className="input-field"
            required
          />
          <span className="text-xs text-ink/40">Pedidos por encima de este monto no pagan envío.</span>
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-semibold text-ink">Tarifa de respaldo (COP)</span>
          <input
            name="flatRate"
            type="number"
            min={0}
            step={500}
            defaultValue={settings.flatRate}
            className="input-field"
            required
          />
          <span className="text-xs text-ink/40">
            Se usa solo si el municipio del cliente no está en la lista de abajo. Para el resto, el precio sale de
            su categoría de despacho.
          </span>
        </label>
        <button type="submit" className="btn-primary mt-2 self-start px-6 py-2.5 text-sm">
          Guardar
        </button>
      </form>

      <DispatchClassManager dispatchClasses={dispatchClasses} />
      <MunicipioManager
        municipios={municipios}
        dispatchClasses={dispatchClasses}
        customizedDepartments={customizedDepartments}
      />
    </div>
  );
}
