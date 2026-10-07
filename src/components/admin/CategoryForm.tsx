"use client";

import { useActionState } from "react";
import { CategoryBannerField } from "@/components/admin/CategoryBannerField";
import { CategoryContentEditor, type ProductOption } from "@/components/admin/CategoryContentEditor";
import type { Category } from "@/lib/types";

const ART_VARIANTS = ["tube", "dropper", "toner", "jar", "pump", "mist", "stick"] as const;
const TONES = ["blush", "mint", "peach", "lavender"] as const;

type FormState = { error?: string } | undefined;

export function CategoryForm({
  category,
  action,
  productOptions = [],
}: {
  category?: Category;
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  productOptions?: ProductOption[];
}) {
  const [state, formAction, isPending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="card-surface flex flex-col gap-4 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nombre" required>
            <input name="name" defaultValue={category?.name} required className="input-field" />
          </Field>
          <Field label="Slug (URL)" hint="Déjalo vacío para generarlo del nombre">
            <input name="slug" defaultValue={category?.slug} className="input-field" placeholder="mi-categoria" />
          </Field>
          <Field label="Frase corta">
            <input name="tagline" defaultValue={category?.tagline} className="input-field" />
          </Field>
          <Field label="Orden">
            <input name="sortOrder" type="number" defaultValue={category?.sortOrder ?? 0} className="input-field" />
          </Field>
          <Field label="Tono de color">
            <select name="tone" defaultValue={category?.tone ?? "blush"} className="input-field">
              {TONES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Ilustración">
            <select name="artVariant" defaultValue={category?.artVariant ?? "tube"} className="input-field">
              {ART_VARIANTS.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Descripción" required>
          <textarea name="description" defaultValue={category?.description} required className="input-field min-h-24" />
        </Field>
      </div>

      <CategoryBannerField initial={category?.bannerPath} />

      {category ? (
        <CategoryContentEditor initial={category.content} products={productOptions} />
      ) : (
        <p className="rounded-xl2 bg-blush-50/60 px-5 py-4 text-sm text-ink/60">
          Después de crear la categoría y agregarle productos podrás configurar la guía por necesidad, la tabla
          comparativa, el contenido educativo y los mini banners.
        </p>
      )}

      {state?.error && (
        <p className="rounded-xl2 bg-blush-50 px-4 py-3 text-sm font-semibold text-blush-700">{state.error}</p>
      )}

      <div className="flex justify-end gap-3">
        <button type="submit" disabled={isPending} className="btn-primary px-7 py-3 text-sm disabled:opacity-60">
          {isPending ? "Guardando..." : category ? "Guardar cambios" : "Crear categoría"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-semibold text-ink">
        {label} {required && <span className="text-blush-500">*</span>}
      </span>
      {children}
      {hint && <span className="text-xs text-ink/40">{hint}</span>}
    </label>
  );
}
