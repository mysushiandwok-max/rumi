"use client";

import { useState } from "react";
import { formatCOP } from "@/lib/format";
import { updateDispatchClassAction } from "@/lib/admin/actions/shipping";
import type { DispatchClass } from "@/lib/admin/shipping";

export function DispatchClassManager({ dispatchClasses }: { dispatchClasses: DispatchClass[] }) {
  const [activeId, setActiveId] = useState(dispatchClasses[0]?.id);
  const active = dispatchClasses.find((c) => c.id === activeId) ?? dispatchClasses[0];

  return (
    <div className="card-surface flex flex-col gap-5 p-6">
      <div>
        <h2 className="font-display text-base font-bold text-ink">Tarifas por categoría de despacho</h2>
        <p className="mt-1 text-sm text-ink/60">
          Cada categoría tiene un precio único que aplica a todos los municipios asignados a ella.
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {dispatchClasses.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setActiveId(c.id)}
            className={`rounded-pill px-3.5 py-2 text-xs font-semibold transition-colors ${
              active?.id === c.id ? "bg-blush-500 text-white" : "bg-blush-50 text-ink/60 hover:bg-blush-100"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {active && (
        <form action={updateDispatchClassAction} className="flex flex-col gap-4 rounded-xl2 bg-cream p-5">
          <input type="hidden" name="id" value={active.id} />
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-display text-sm font-bold text-ink">{active.name}</p>
            <span className="pill-badge bg-blush-100 text-blush-700">{active.municipioCount} municipios</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-semibold text-ink">Precio de envío (COP)</span>
              <input
                key={active.id}
                name="price"
                type="number"
                min={0}
                step={500}
                defaultValue={active.price}
                className="input-field"
                required
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-semibold text-ink">Entrega mínima (días)</span>
              <input
                key={`min-${active.id}`}
                name="etaMinDays"
                type="number"
                min={0}
                defaultValue={active.etaMinDays ?? ""}
                className="input-field"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-semibold text-ink">Entrega máxima (días)</span>
              <input
                key={`max-${active.id}`}
                name="etaMaxDays"
                type="number"
                min={0}
                defaultValue={active.etaMaxDays ?? ""}
                className="input-field"
              />
            </label>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs text-ink/40">
              Precio actual: <span className="font-semibold text-ink/70">{formatCOP(active.price)}</span>
            </p>
            <button type="submit" className="btn-primary px-5 py-2.5 text-sm">
              Guardar precio
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
