"use client";

import { useId, useState } from "react";
import { PlusIcon, TrashIcon } from "@/components/icons";
import { CONTENT_LIMITS } from "@/lib/category-content";
import type { CategoryContent } from "@/lib/types";

export type ProductOption = { slug: string; name: string; draft: boolean };

const MOMENT_SUGGESTIONS = ["Día", "Noche", "Día y noche", "Cualquier momento"];

export function CategoryContentEditor({
  initial,
  products,
}: {
  initial: CategoryContent;
  products: ProductOption[];
}) {
  const [content, setContent] = useState<CategoryContent>(initial);
  const momentListId = useId();
  const productName = (slug: string) => products.find((product) => product.slug === slug)?.name ?? slug;

  // Edita una copia y la guarda: evita mutar el estado anterior.
  const edit = (mutate: (draft: CategoryContent) => void) => {
    setContent((current) => {
      const draft = structuredClone(current);
      mutate(draft);
      return draft;
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <input type="hidden" name="content" value={JSON.stringify(content)} />

      {/* Guía */}
      <Section
        title="Guía por tipo de piel, necesidad o momento"
        hint="Aparece debajo del grid. La clienta elige un grupo y una opción, y ve de 2 a 3 productos destacados."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Título de la sección"
            value={content.guide.title}
            placeholder="Encuentra tu crema ideal"
            onChange={(value) => edit((draft) => void (draft.guide.title = value))}
          />
          <TextField
            label="Texto de apoyo"
            value={content.guide.intro}
            placeholder="Elige cómo quieres buscar…"
            onChange={(value) => edit((draft) => void (draft.guide.intro = value))}
          />
        </div>

        {content.guide.groups.map((group, groupIndex) => (
          <div key={groupIndex} className="flex animate-pop-in flex-col gap-4 border-t border-border pt-5">
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <TextField
                  label={`Grupo ${groupIndex + 1}`}
                  value={group.title}
                  placeholder="Tipo de piel, Necesidad, Momento…"
                  onChange={(value) => edit((draft) => void (draft.guide.groups[groupIndex].title = value))}
                />
              </div>
              <RemoveButton
                label={`Quitar el grupo ${group.title || groupIndex + 1}`}
                onClick={() => edit((draft) => void draft.guide.groups.splice(groupIndex, 1))}
              />
            </div>

            <div className="flex flex-col gap-3">
              {group.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex animate-pop-in flex-col gap-3 rounded-xl2 bg-blush-50/50 p-4">
                  <div className="flex items-end gap-3">
                    <div className="flex-1">
                      <TextField
                        label="Opción"
                        value={item.label}
                        placeholder="Seca, Hidratación intensa, Noche…"
                        onChange={(value) =>
                          edit((draft) => void (draft.guide.groups[groupIndex].items[itemIndex].label = value))
                        }
                      />
                    </div>
                    <RemoveButton
                      label={`Quitar la opción ${item.label || itemIndex + 1}`}
                      onClick={() =>
                        edit((draft) => void draft.guide.groups[groupIndex].items.splice(itemIndex, 1))
                      }
                    />
                  </div>
                  <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-semibold text-ink">Mensaje corto</span>
                    <textarea
                      value={item.blurb}
                      rows={2}
                      maxLength={320}
                      onChange={(event) =>
                        edit((draft) => void (draft.guide.groups[groupIndex].items[itemIndex].blurb = event.target.value))
                      }
                      className="input-field"
                      placeholder="Una o dos frases que orienten a la clienta."
                    />
                  </label>
                  <fieldset className="flex flex-col gap-2">
                    <legend className="text-sm font-semibold text-ink">
                      Productos destacados{" "}
                      <span className="font-normal text-ink/45">
                        ({item.productSlugs.length}/{CONTENT_LIMITS.productsPerItem})
                      </span>
                    </legend>
                    {products.length === 0 ? (
                      <p className="text-sm text-ink/50">Esta categoría todavía no tiene productos.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {products.map((product) => {
                          const checked = item.productSlugs.includes(product.slug);
                          const full = !checked && item.productSlugs.length >= CONTENT_LIMITS.productsPerItem;
                          return (
                            <label
                              key={product.slug}
                              className={`cursor-pointer rounded-pill border px-3 py-1.5 text-xs font-semibold transition-colors duration-150 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-blush-500 ${
                                checked
                                  ? "border-blush-500 bg-blush-500 text-white"
                                  : full
                                    ? "cursor-not-allowed border-border bg-white text-ink/30"
                                    : "border-border bg-white text-ink/70 hover:border-blush-300"
                              }`}
                            >
                              <input
                                type="checkbox"
                                className="sr-only"
                                checked={checked}
                                disabled={full}
                                onChange={() =>
                                  edit((draft) => {
                                    const target = draft.guide.groups[groupIndex].items[itemIndex];
                                    target.productSlugs = checked
                                      ? target.productSlugs.filter((slug) => slug !== product.slug)
                                      : [...target.productSlugs, product.slug];
                                  })
                                }
                              />
                              {product.name}
                              {product.draft && " (borrador)"}
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </fieldset>
                </div>
              ))}
              {group.items.length < CONTENT_LIMITS.itemsPerGroup && (
                <AddButton
                  onClick={() =>
                    edit((draft) =>
                      void draft.guide.groups[groupIndex].items.push({ label: "", blurb: "", productSlugs: [] })
                    )
                  }
                >
                  Agregar opción
                </AddButton>
              )}
            </div>
          </div>
        ))}

        {content.guide.groups.length < CONTENT_LIMITS.groups && (
          <AddButton
            onClick={() => edit((draft) => void draft.guide.groups.push({ title: "", items: [] }))}
          >
            Agregar grupo
          </AddButton>
        )}
      </Section>

      {/* Tabla comparativa */}
      <Section
        title="Tabla comparativa"
        hint="Producto, tipo de piel, textura, ingrediente clave y momento de uso. Si dejas el tipo de piel vacío se usan los que tiene guardados el producto."
      >
        <TextField
          label="Título de la sección"
          value={content.comparison.title}
          placeholder="Compara de un vistazo"
          onChange={(value) => edit((draft) => void (draft.comparison.title = value))}
        />

        {content.comparison.rows.length > 0 && (
          <div className="hidden gap-3 px-1 text-xs font-semibold uppercase tracking-wide text-ink/45 lg:grid lg:grid-cols-[minmax(0,1.4fr)_repeat(4,minmax(0,1fr))_2.5rem]">
            <span>Producto</span>
            <span>Tipo de piel ideal</span>
            <span>Textura</span>
            <span>Ingrediente clave</span>
            <span>Momento de uso</span>
            <span />
          </div>
        )}

        <datalist id={momentListId}>
          {MOMENT_SUGGESTIONS.map((suggestion) => (
            <option key={suggestion} value={suggestion} />
          ))}
        </datalist>

        <div className="flex flex-col gap-3">
          {content.comparison.rows.map((row, rowIndex) => {
            const usedElsewhere = new Set(
              content.comparison.rows.filter((_, index) => index !== rowIndex).map((other) => other.productSlug)
            );
            const setField = (field: "skinType" | "texture" | "keyIngredient" | "moment", value: string) =>
              edit((draft) => void (draft.comparison.rows[rowIndex][field] = value));
            return (
              <div
                key={rowIndex}
                className="grid animate-pop-in gap-3 rounded-xl2 bg-blush-50/50 p-3 lg:grid-cols-[minmax(0,1.4fr)_repeat(4,minmax(0,1fr))_2.5rem] lg:items-center lg:bg-transparent lg:p-0"
              >
                <select
                  aria-label="Producto"
                  value={row.productSlug}
                  onChange={(event) => edit((draft) => void (draft.comparison.rows[rowIndex].productSlug = event.target.value))}
                  className="input-field"
                >
                  <option value="">Elige un producto…</option>
                  {products
                    .filter((product) => product.slug === row.productSlug || !usedElsewhere.has(product.slug))
                    .map((product) => (
                      <option key={product.slug} value={product.slug}>
                        {product.name}
                      </option>
                    ))}
                  {row.productSlug && !products.some((product) => product.slug === row.productSlug) && (
                    <option value={row.productSlug}>{productName(row.productSlug)}</option>
                  )}
                </select>
                <input
                  aria-label="Tipo de piel ideal"
                  value={row.skinType}
                  placeholder="Vacío = del producto"
                  onChange={(event) => setField("skinType", event.target.value)}
                  className="input-field"
                />
                <input
                  aria-label="Textura"
                  value={row.texture}
                  placeholder="Crema, gel, stick…"
                  onChange={(event) => setField("texture", event.target.value)}
                  className="input-field"
                />
                <input
                  aria-label="Ingrediente clave"
                  value={row.keyIngredient}
                  placeholder="Niacinamida"
                  onChange={(event) => setField("keyIngredient", event.target.value)}
                  className="input-field"
                />
                <input
                  aria-label="Momento de uso"
                  value={row.moment}
                  list={momentListId}
                  placeholder="Día, Noche…"
                  onChange={(event) => setField("moment", event.target.value)}
                  className="input-field"
                />
                <RemoveButton
                  label={`Quitar la fila de ${row.productSlug ? productName(row.productSlug) : "producto"}`}
                  onClick={() => edit((draft) => void draft.comparison.rows.splice(rowIndex, 1))}
                />
              </div>
            );
          })}
        </div>

        {content.comparison.rows.length < CONTENT_LIMITS.comparisonRows && (
          <AddButton
            onClick={() =>
              edit((draft) =>
                void draft.comparison.rows.push({
                  productSlug: "",
                  skinType: "",
                  texture: "",
                  keyIngredient: "",
                  moment: "",
                })
              )
            }
          >
            Agregar producto a la tabla
          </AddButton>
        )}
      </Section>

      {/* Educativo */}
      <Section
        title="Contenido educativo"
        hint="Un bloque corto tipo «¿Cómo elegir…?» con 3 o 4 ideas clave. Ayuda al SEO de la categoría."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Título"
            value={content.education.title}
            placeholder="¿Cómo elegir tu crema hidratante?"
            onChange={(value) => edit((draft) => void (draft.education.title = value))}
          />
          <TextField
            label="Introducción"
            value={content.education.intro}
            placeholder="Una frase que abra el tema."
            onChange={(value) => edit((draft) => void (draft.education.intro = value))}
          />
        </div>

        {content.education.points.map((educationPoint, pointIndex) => (
          <div key={pointIndex} className="flex animate-pop-in flex-col gap-3 border-t border-border pt-5">
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <TextField
                  label={`Idea ${pointIndex + 1}`}
                  value={educationPoint.title}
                  placeholder="Empieza por tu tipo de piel"
                  onChange={(value) => edit((draft) => void (draft.education.points[pointIndex].title = value))}
                />
              </div>
              <RemoveButton
                label={`Quitar la idea ${educationPoint.title || pointIndex + 1}`}
                onClick={() => edit((draft) => void draft.education.points.splice(pointIndex, 1))}
              />
            </div>
            <textarea
              aria-label={`Texto de la idea ${pointIndex + 1}`}
              value={educationPoint.text}
              rows={2}
              maxLength={420}
              onChange={(event) => edit((draft) => void (draft.education.points[pointIndex].text = event.target.value))}
              className="input-field"
              placeholder="Explícalo en una o dos frases."
            />
          </div>
        ))}

        {content.education.points.length < CONTENT_LIMITS.educationPoints && (
          <AddButton
            onClick={() => edit((draft) => void draft.education.points.push({ title: "", text: "" }))}
          >
            Agregar idea
          </AddButton>
        )}
      </Section>

      {/* Mini banners */}
      <Section
        title="Otras categorías"
        hint="Los mini banners para cambiar de categoría se generan solos con el nombre, la frase, el color y la foto de cada categoría."
      >
        <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-ink">
          <input
            type="checkbox"
            checked={content.showMiniBanners}
            onChange={(event) => edit((draft) => void (draft.showMiniBanners = event.target.checked))}
            className="h-4 w-4 accent-blush-500"
          />
          Mostrar mini banners al final de la página
        </label>
      </Section>
    </div>
  );
}

export function Section({
  title,
  hint,
  id,
  children,
}: {
  title: string;
  hint: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="card-surface flex scroll-mt-24 flex-col gap-5 p-6">
      <div>
        <h2 className="font-display text-lg font-bold text-ink">{title}</h2>
        <p className="mt-1 max-w-2xl text-sm text-ink/55">{hint}</p>
      </div>
      {children}
    </section>
  );
}

export function TextField({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-semibold text-ink">{label}</span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="input-field"
      />
    </label>
  );
}

export function AddButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} className="btn-secondary w-fit px-4 py-2 text-xs">
      <PlusIcon className="h-3.5 w-3.5" />
      {children}
    </button>
  );
}

export function RemoveButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink/45 transition-[color,background-color,transform] duration-150 ease-out-strong hover:bg-blush-50 hover:text-blush-600 active:scale-90"
    >
      <TrashIcon className="h-4 w-4" />
    </button>
  );
}
