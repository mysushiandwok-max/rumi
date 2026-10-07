"use client";

import { useActionState, useRef, useState } from "react";
import { CloseIcon, PlusIcon, UploadIcon } from "@/components/icons";
import { uploadProductImageAction } from "@/lib/admin/actions/products";
import { ProductLandingEditor, type LandingProductOption } from "@/components/admin/ProductLandingEditor";
import { EMPTY_PRODUCT_LANDING } from "@/lib/product-landing";
import type { Brand, Category, Product } from "@/lib/types";

const ART_VARIANTS = ["tube", "dropper", "toner", "jar", "pump", "mist", "stick"] as const;
const TONES = ["blush", "mint", "peach", "lavender"] as const;
const BADGES = ["", "Bestseller", "Nuevo", "Últimas unidades"] as const;

type FormState = { error?: string } | undefined;

// Accesos directos de la barra fija; los ids viven en cada tarjeta del formulario y del editor de la landing.
const FORM_SECTIONS = [
  { id: "informacion", label: "Información" },
  { id: "precio", label: "Precio y stock" },
  { id: "descripcion", label: "Descripción" },
  { id: "fotos", label: "Fotos" },
  { id: "beneficios", label: "Beneficios" },
  { id: "ingredientes", label: "Ingredientes" },
  { id: "banners", label: "Banners" },
  { id: "galeria", label: "Galería" },
  { id: "videos", label: "Videos" },
  { id: "comparativas", label: "Comparativas" },
  { id: "rutina", label: "Rutina" },
  { id: "preguntas", label: "Preguntas" },
];

export function ProductForm({
  product,
  categories,
  brands,
  productOptions,
  action,
}: {
  product?: Product;
  categories: Category[];
  brands: Brand[];
  productOptions: LandingProductOption[];
  action: (state: FormState, formData: FormData) => Promise<FormState>;
}) {
  const [state, formAction, isPending] = useActionState(action, undefined);
  const [howToUse, setHowToUse] = useState<string[]>(product?.howToUse.length ? product.howToUse : [""]);
  const [skinTypes, setSkinTypes] = useState<string[]>(product?.skinTypes ?? []);
  const [skinTypeDraft, setSkinTypeDraft] = useState("");
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFilesSelected(fileList: FileList | null) {
    const files = Array.from(fileList ?? []);
    if (files.length === 0) return;
    setUploadError("");
    setIsUploading(true);
    try {
      for (const file of files) {
        const fd = new FormData();
        fd.set("file", file);
        const result = await uploadProductImageAction(fd);
        if ("error" in result) {
          setUploadError(result.error);
          continue;
        }
        setImages((prev) => [...prev, result.url]);
      }
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <nav
        aria-label="Secciones del producto"
        className="sticky top-0 z-30 -mx-5 flex gap-2 overflow-x-auto border-b border-border bg-cream/95 px-5 py-3 backdrop-blur sm:-mx-8 sm:px-8"
      >
        {FORM_SECTIONS.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="shrink-0 rounded-pill border border-border bg-white px-3.5 py-1.5 text-xs font-semibold text-ink/70 transition-colors hover:border-blush-300 hover:text-blush-600"
          >
            {section.label}
          </a>
        ))}
      </nav>

      <div id="informacion" className="card-surface flex scroll-mt-24 flex-col gap-4 p-6">
        <h2 className="font-display text-base font-bold text-ink">Información general</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nombre" required>
            <input name="name" defaultValue={product?.name} required className="input-field" />
          </Field>
          <Field label="Slug (URL)" hint="Déjalo vacío para generarlo del nombre">
            <input name="slug" defaultValue={product?.slug} className="input-field" placeholder="mi-producto" />
          </Field>
          <Field label="Marca" required>
            <select name="brandSlug" defaultValue={product?.brandSlug} required className="input-field">
              <option value="">Selecciona una marca</option>
              {brands.map((b) => (
                <option key={b.slug} value={b.slug}>
                  {b.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Categoría" required>
            <select name="categorySlug" defaultValue={product?.categorySlug} required className="input-field">
              <option value="">Selecciona una categoría</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Tamaño / presentación">
            <input name="size" defaultValue={product?.size} className="input-field" placeholder="50 ml" />
          </Field>
          <Field label="SKU">
            <input name="sku" defaultValue={product?.sku} className="input-field" placeholder="RUMI-0001" />
          </Field>
        </div>
      </div>

      <div id="precio" className="card-surface flex scroll-mt-24 flex-col gap-4 p-6">
        <h2 className="font-display text-base font-bold text-ink">Precio e inventario</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Precio (COP)" required>
            <input name="price" type="number" min={0} step={100} defaultValue={product?.price} required className="input-field" />
          </Field>
          <Field label="Precio comparativo" hint="Para mostrar descuento">
            <input name="compareAtPrice" type="number" min={0} step={100} defaultValue={product?.compareAtPrice} className="input-field" />
          </Field>
          <Field label="Costo" hint="Uso interno">
            <input name="costPrice" type="number" min={0} step={100} defaultValue={product?.costPrice} className="input-field" />
          </Field>
          <Field label="Stock" required>
            <input name="stock" type="number" min={0} defaultValue={product?.stock ?? 0} required className="input-field" />
          </Field>
          <Field label="Umbral de stock bajo">
            <input name="lowStockThreshold" type="number" min={0} defaultValue={product?.lowStockThreshold ?? 5} className="input-field" />
          </Field>
          <Field label="Estado">
            <select name="status" defaultValue={product?.status ?? "published"} className="input-field">
              <option value="published">Publicado</option>
              <option value="draft">Borrador</option>
            </select>
          </Field>
        </div>
      </div>

      <div id="descripcion" className="card-surface flex scroll-mt-24 flex-col gap-4 p-6">
        <h2 className="font-display text-base font-bold text-ink">Descripción y uso</h2>
        <Field label="Descripción corta" required>
          <input name="shortDescription" defaultValue={product?.shortDescription} required className="input-field" />
        </Field>
        <Field label="Descripción completa" required>
          <textarea name="description" defaultValue={product?.description} required className="input-field min-h-28" />
        </Field>
        <Field label="Ingredientes">
          <textarea name="ingredients" defaultValue={product?.ingredients} className="input-field min-h-20" />
        </Field>

        <div>
          <p className="mb-2 text-sm font-semibold text-ink">Cómo usar</p>
          <div className="flex flex-col gap-2">
            {howToUse.map((step, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  name="howToUse"
                  defaultValue={step}
                  className="input-field flex-1"
                  placeholder={`Paso ${i + 1}`}
                />
                <button
                  type="button"
                  onClick={() => setHowToUse((prev) => prev.filter((_, idx) => idx !== i))}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink/40 hover:text-blush-600"
                  aria-label="Quitar paso"
                >
                  <CloseIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setHowToUse((prev) => [...prev, ""])}
            className="btn-ghost mt-2 px-3 py-1.5 text-xs"
          >
            <PlusIcon className="h-3.5 w-3.5" />
            Añadir paso
          </button>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-ink">Tipos de piel</p>
          <div className="flex flex-wrap gap-2">
            {skinTypes.map((type) => (
              <span key={type} className="pill-badge bg-blush-50 text-blush-700">
                {type}
                <input type="hidden" name="skinTypes" value={type} />
                <button
                  type="button"
                  onClick={() => setSkinTypes((prev) => prev.filter((t) => t !== type))}
                  className="ml-1"
                  aria-label={`Quitar ${type}`}
                >
                  <CloseIcon className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <input
              value={skinTypeDraft}
              onChange={(e) => setSkinTypeDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const value = skinTypeDraft.trim();
                  if (value && !skinTypes.includes(value)) setSkinTypes((prev) => [...prev, value]);
                  setSkinTypeDraft("");
                }
              }}
              className="input-field flex-1"
              placeholder="Ej: Sensible (Enter para añadir)"
            />
          </div>
        </div>
      </div>

      <div id="fotos" className="card-surface flex scroll-mt-24 flex-col gap-4 p-6">
        <div>
          <h2 className="font-display text-base font-bold text-ink">Fotos del producto</h2>
          <p className="mt-1 text-sm text-ink/55">
            La primera es la principal: se ve en la tienda, el carrito y la parte de arriba de la ficha.
          </p>
        </div>
        {images.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {images.map((img, index) => (
              <div key={img} className="relative flex w-24 flex-col items-center gap-1.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img}
                  alt=""
                  className={`h-24 w-24 rounded-xl2 border-2 object-cover ${index === 0 ? "border-blush-400" : "border-border"}`}
                />
                <input type="hidden" name="images" value={img} />
                {index === 0 ? (
                  <span className="text-[11px] font-bold text-blush-600">Principal</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setImages((prev) => [img, ...prev.filter((i) => i !== img)])}
                    className="text-[11px] font-semibold text-ink/55 underline-offset-2 hover:text-blush-600 hover:underline"
                  >
                    Hacer principal
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setImages((prev) => prev.filter((i) => i !== img))}
                  className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-ink text-white"
                  aria-label="Quitar imagen"
                >
                  <CloseIcon className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        <div>
          <button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="btn-secondary px-4 py-2.5 text-sm disabled:opacity-60"
          >
            <UploadIcon className="h-4 w-4" />
            {isUploading ? "Subiendo..." : "Subir imágenes"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFilesSelected(e.target.files)}
          />
          {uploadError && <p className="mt-2 text-xs font-semibold text-blush-600">{uploadError}</p>}
          <p className="mt-1 text-xs text-ink/40">Si no subes imágenes, se usará la ilustración de producto.</p>
        </div>
      </div>

      <div id="presentacion" className="card-surface flex scroll-mt-24 flex-col gap-4 p-6">
        <h2 className="font-display text-base font-bold text-ink">Presentación visual</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Ilustración">
            <select name="artVariant" defaultValue={product?.artVariant ?? "tube"} className="input-field">
              {ART_VARIANTS.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Tono de color">
            <select name="tone" defaultValue={product?.tone ?? "blush"} className="input-field">
              {TONES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Insignia">
            <select name="badge" defaultValue={product?.badge ?? ""} className="input-field">
              {BADGES.map((b) => (
                <option key={b} value={b}>
                  {b || "Ninguna"}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <label className="flex items-center gap-2 text-sm font-semibold text-ink">
          <input type="checkbox" name="featured" defaultChecked={product?.featured} className="h-4 w-4 rounded border-border" />
          Destacar en la página de inicio
        </label>
      </div>

      <ProductLandingEditor
        initial={product?.landing ?? EMPTY_PRODUCT_LANDING}
        products={productOptions.filter((option) => option.slug !== product?.slug)}
      />

      {state?.error && (
        <p className="rounded-xl2 bg-blush-50 px-4 py-3 text-sm font-semibold text-blush-700">{state.error}</p>
      )}

      <div className="sticky bottom-4 z-30 flex items-center justify-end gap-3 rounded-pill border border-border bg-white/95 p-2 pl-5 shadow-card backdrop-blur">
        {product && (
          <a
            href={`/producto/${product.slug}`}
            target="_blank"
            rel="noreferrer"
            className="mr-auto text-sm font-semibold text-ink/60 hover:text-blush-600"
          >
            Ver en la tienda ↗
          </a>
        )}
        <button type="submit" disabled={isPending} className="btn-primary px-7 py-3 text-sm disabled:opacity-60">
          {isPending ? "Guardando..." : product ? "Guardar cambios" : "Crear producto"}
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
