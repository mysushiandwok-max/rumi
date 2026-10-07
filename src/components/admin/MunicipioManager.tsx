"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ColombiaMap } from "@/components/admin/ColombiaMap";
import { COLOMBIA_DEPARTMENTS } from "@/lib/colombia";
import { saveMunicipioAssignmentsAction } from "@/lib/admin/actions/shipping";
import type { DispatchClass, Municipio } from "@/lib/admin/shipping";

export function MunicipioManager({
  municipios,
  dispatchClasses,
  customizedDepartments,
}: {
  municipios: Municipio[];
  dispatchClasses: DispatchClass[];
  customizedDepartments: string[];
}) {
  const router = useRouter();
  const [selectedDepartment, setSelectedDepartment] = useState<string>(COLOMBIA_DEPARTMENTS[0]);
  const [pending, setPending] = useState<Record<number, number>>({});
  const [bulkClassId, setBulkClassId] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const configuredDepartments = useMemo(() => new Set(customizedDepartments), [customizedDepartments]);

  const departmentCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const m of municipios) counts.set(m.department, (counts.get(m.department) ?? 0) + 1);
    return counts;
  }, [municipios]);

  const municipiosInDepartment = useMemo(
    () => municipios.filter((m) => m.department === selectedDepartment).sort((a, b) => a.name.localeCompare(b.name)),
    [municipios, selectedDepartment]
  );

  const pendingCount = Object.keys(pending).length;

  function handleAssign(municipioId: number, dispatchClassId: number) {
    setPending((prev) => ({ ...prev, [municipioId]: dispatchClassId }));
  }

  function handleBulkAssign() {
    if (!bulkClassId) return;
    const classId = Number(bulkClassId);
    setPending((prev) => {
      const next = { ...prev };
      for (const m of municipiosInDepartment) next[m.id] = classId;
      return next;
    });
  }

  async function handleSave() {
    const changes = Object.entries(pending).map(([municipioId, dispatchClassId]) => ({
      municipioId: Number(municipioId),
      dispatchClassId,
    }));
    if (changes.length === 0) return;
    setSaving(true);
    try {
      await saveMunicipioAssignmentsAction(changes);
      setPending({});
      setSavedAt(Date.now());
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="card-surface flex flex-col gap-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-base font-bold text-ink">Municipios por categoría de despacho</h2>
          <p className="mt-1 text-sm text-ink/60">
            Haz clic en un departamento para ver sus municipios y asignarles una categoría.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {savedAt && pendingCount === 0 && (
            <span className="text-xs font-semibold text-mint-600">Cambios guardados</span>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={pendingCount === 0 || saving}
            className="btn-primary px-5 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-40"
          >
            {saving ? "Guardando…" : pendingCount > 0 ? `Guardar cambios (${pendingCount})` : "Guardar cambios"}
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="flex flex-col gap-4">
          <ColombiaMap
            configuredDepartments={configuredDepartments}
            selected={selectedDepartment}
            onSelect={setSelectedDepartment}
          />
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink/40">Cobertura por departamento</p>
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
              {COLOMBIA_DEPARTMENTS.map((dept) => (
                <button
                  key={dept}
                  type="button"
                  onClick={() => setSelectedDepartment(dept)}
                  className={`truncate rounded-pill px-2.5 py-1.5 text-left text-xs font-semibold transition-colors ${
                    selectedDepartment === dept
                      ? "bg-blush-500 text-white"
                      : "bg-blush-50 text-ink/60 hover:bg-blush-100"
                  }`}
                  title={dept}
                >
                  {dept} <span className="opacity-60">({departmentCounts.get(dept) ?? 0})</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-display text-sm font-bold text-ink">
              {selectedDepartment} <span className="font-normal text-ink/40">({municipiosInDepartment.length})</span>
            </h3>
            <div className="flex items-center gap-2">
              <select
                value={bulkClassId}
                onChange={(e) => setBulkClassId(e.target.value)}
                className="input-field py-1.5 text-xs"
              >
                <option value="">Asignar todos a…</option>
                {dispatchClasses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleBulkAssign}
                disabled={!bulkClassId}
                className="btn-secondary px-3 py-1.5 text-xs disabled:cursor-not-allowed disabled:opacity-40"
              >
                Aplicar
              </button>
            </div>
          </div>

          <div className="max-h-[420px] overflow-y-auto rounded-xl2 border border-border">
            <ul className="divide-y divide-border">
              {municipiosInDepartment.map((m) => {
                const currentClassId = pending[m.id] ?? m.dispatchClassId;
                const isDirty = m.id in pending && pending[m.id] !== m.dispatchClassId;
                return (
                  <li key={m.id} className="flex items-center justify-between gap-3 px-4 py-2.5">
                    <span className={`text-sm ${isDirty ? "font-semibold text-blush-600" : "text-ink/80"}`}>
                      {m.name}
                    </span>
                    <select
                      value={currentClassId}
                      onChange={(e) => handleAssign(m.id, Number(e.target.value))}
                      className="input-field w-44 py-1.5 text-xs"
                    >
                      {dispatchClasses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </li>
                );
              })}
              {municipiosInDepartment.length === 0 && (
                <li className="px-4 py-6 text-center text-sm text-ink/40">
                  Este departamento no tiene municipios registrados todavía.
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
