"use client";

import { useId, useRef, useState } from "react";
import { AddButton, RemoveButton, Section, TextField } from "@/components/admin/CategoryContentEditor";
import { CloseIcon, UploadIcon } from "@/components/icons";
import { uploadProductImageAction } from "@/lib/admin/actions/products";
import { LANDING_LIMITS, videoEmbed } from "@/lib/product-landing";
import type { ProductLanding } from "@/lib/types";

export type LandingProductOption = { slug: string; name: string };

const MOMENT_SUGGESTIONS = ["Mañana", "Noche", "Mañana y noche"];

export function ProductLandingEditor({
  initial,
  products,
}: {
  initial: ProductLanding;
  products: LandingProductOption[];
}) {
  const [landing, setLanding] = useState<ProductLanding>(initial);
  const momentListId = useId();

  const edit = (mutate: (draft: ProductLanding) => void) => {
    setLanding((current) => {
      const draft = structuredClone(current);
      mutate(draft);
      return draft;
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <input type="hidden" name="landing" value={JSON.stringify(landing)} />

      <div className="px-1">
        <h2 className="font-display text-lg font-bold text-ink">Landing de ventas</h2>
        <p className="mt-1 max-w-2xl text-sm text-ink/55">
          Todo lo de aquí aparece debajo de la ficha del producto. Las secciones vacías no se muestran.
        </p>
      </div>

      <Section id="beneficios" title="Beneficios" hint="Una frase grande que resuma la promesa y de 2 a 4 beneficios cortos.">
        <TextField
          label="Frase principal"
          value={landing.headline}
          placeholder="Piel calmada y luminosa en 2 semanas"
          onChange={(value) => edit((d) => void (d.headline = value))}
        />
        <ImageField
          label="Foto junto a los beneficios"
          hint="Vertical (4:5). Si la dejas vacía se usa la primera foto del producto."
          value={landing.benefitsImage}
          onChange={(url) => edit((d) => void (d.benefitsImage = url))}
        />
        {landing.benefits.map((benefit, i) => (
          <Row key={i} onRemove={() => edit((d) => void d.benefits.splice(i, 1))} label={`beneficio ${i + 1}`}>
            <TextField
              label={`Beneficio ${i + 1}`}
              value={benefit.title}
              placeholder="Calma rojeces"
              onChange={(value) => edit((d) => void (d.benefits[i].title = value))}
            />
            <TextField
              label="Detalle"
              value={benefit.text}
              placeholder="La centella reduce la irritación desde el primer uso."
              onChange={(value) => edit((d) => void (d.benefits[i].text = value))}
            />
          </Row>
        ))}
        {landing.benefits.length < LANDING_LIMITS.benefits && (
          <AddButton onClick={() => edit((d) => void d.benefits.push({ title: "", text: "" }))}>
            Agregar beneficio
          </AddButton>
        )}
      </Section>

      <Section id="resultados" title="Resultados en el tiempo" hint="Qué notará la clienta y cuándo. Ej: «1 semana», «4 semanas».">
        {landing.results.map((result, i) => (
          <Row key={i} onRemove={() => edit((d) => void d.results.splice(i, 1))} label={`resultado ${i + 1}`}>
            <TextField
              label="Cuándo"
              value={result.when}
              placeholder="2 semanas"
              onChange={(value) => edit((d) => void (d.results[i].when = value))}
            />
            <TextField
              label="Qué se nota"
              value={result.text}
              placeholder="Tono más parejo y menos rojez."
              onChange={(value) => edit((d) => void (d.results[i].text = value))}
            />
          </Row>
        ))}
        {landing.results.length < LANDING_LIMITS.results && (
          <AddButton onClick={() => edit((d) => void d.results.push({ when: "", text: "" }))}>Agregar resultado</AddButton>
        )}
      </Section>

      <Section
        id="ingredientes"
        title="Ingredientes estrella"
        hint="De 2 a 4 ingredientes clave explicados en simple. La lista completa sigue en el campo «Ingredientes»."
      >
        {landing.keyIngredients.map((ingredient, i) => (
          <Row key={i} onRemove={() => edit((d) => void d.keyIngredients.splice(i, 1))} label={ingredient.name || `ingrediente ${i + 1}`}>
            <TextField
              label="Ingrediente"
              value={ingredient.name}
              placeholder="Centella asiática"
              onChange={(value) => edit((d) => void (d.keyIngredients[i].name = value))}
            />
            <TextField
              label="Qué hace"
              value={ingredient.benefit}
              placeholder="Calma y repara la barrera de la piel."
              onChange={(value) => edit((d) => void (d.keyIngredients[i].benefit = value))}
            />
            <div className="sm:col-span-2">
              <ImageField
                label="Foto (opcional)"
                hint="El ingrediente o la textura, horizontal."
                value={ingredient.image}
                onChange={(url) => edit((d) => void (d.keyIngredients[i].image = url))}
              />
            </div>
          </Row>
        ))}
        {landing.keyIngredients.length < LANDING_LIMITS.keyIngredients && (
          <AddButton onClick={() => edit((d) => void d.keyIngredients.push({ name: "", benefit: "", image: "" }))}>
            Agregar ingrediente
          </AddButton>
        )}
      </Section>

      <Section
        id="banners"
        title="Banners"
        hint="Fotos grandes a todo el ancho (horizontal, 16:7). El primero va después de los beneficios y el segundo antes de las reseñas."
      >
        {landing.banners.map((banner, i) => (
          <div key={i} className="flex animate-pop-in flex-col gap-3 rounded-xl2 bg-blush-50/50 p-4">
            <div className="flex items-end gap-3">
              <div className="grid flex-1 gap-3 sm:grid-cols-2">
                <TextField
                  label={`Banner ${i + 1}: título`}
                  value={banner.title}
                  placeholder="Tu protector de todos los días"
                  onChange={(value) => edit((d) => void (d.banners[i].title = value))}
                />
                <TextField
                  label="Texto corto"
                  value={banner.text}
                  placeholder="Ligero, invisible y con SPF50+."
                  onChange={(value) => edit((d) => void (d.banners[i].text = value))}
                />
              </div>
              <RemoveButton label={`Quitar el banner ${i + 1}`} onClick={() => edit((d) => void d.banners.splice(i, 1))} />
            </div>
            <ImageField
              label="Imagen"
              value={banner.image}
              wide
              onChange={(url) => edit((d) => void (d.banners[i].image = url))}
            />
          </div>
        ))}
        {landing.banners.length < LANDING_LIMITS.banners && (
          <AddButton onClick={() => edit((d) => void d.banners.push({ image: "", title: "", text: "" }))}>
            Agregar banner
          </AddButton>
        )}
      </Section>

      <Section
        id="galeria"
        title="Mini galería"
        hint="De 3 a 6 fotos extra: texturas, detalles del empaque, el producto en la mano. Aparece después de los ingredientes."
      >
        <div className="flex flex-wrap items-start gap-4">
          {landing.gallery.map((url, i) => (
            <ImageField
              key={url}
              label={`Foto ${i + 1}`}
              value={url}
              onChange={(next) =>
                edit((d) => void (next ? (d.gallery[i] = next) : d.gallery.splice(i, 1)))
              }
            />
          ))}
          {landing.gallery.length < LANDING_LIMITS.gallery && (
            <ImageField
              key={`nueva-${landing.gallery.length}`}
              label="Agregar foto"
              value=""
              onChange={(url) => url && edit((d) => void d.gallery.push(url))}
            />
          )}
        </div>
      </Section>

      <Section
        id="videos"
        title="Videos"
        hint="Pega el link completo del video (tiktok.com/@usuario/video/… o instagram.com/reel/…). Los links cortos tipo vm.tiktok.com no funcionan: ábrelos y copia el link largo."
      >
        {landing.videos.map((url, i) => {
          const embed = videoEmbed(url.trim());
          const invalid = url.trim() !== "" && embed === null;
          return (
            <div key={i} className="flex animate-pop-in items-end gap-3">
              {embed && (
                <iframe
                  src={embed.src}
                  title={`Vista previa del video ${i + 1}`}
                  loading="lazy"
                  className="h-40 w-[90px] shrink-0 rounded-xl2 border border-border bg-ink"
                />
              )}
              <label className="flex flex-1 flex-col gap-1.5 text-sm">
                <span className="font-semibold text-ink">Video {i + 1}</span>
                <input
                  value={url}
                  placeholder="https://www.tiktok.com/@rumi/video/123…"
                  onChange={(event) => edit((d) => void (d.videos[i] = event.target.value))}
                  className="input-field"
                  aria-invalid={invalid}
                />
                {invalid && <span className="text-xs font-semibold text-blush-600">Este link no es de un video de TikTok o Instagram.</span>}
              </label>
              <RemoveButton label={`Quitar el video ${i + 1}`} onClick={() => edit((d) => void d.videos.splice(i, 1))} />
            </div>
          );
        })}
        {landing.videos.length < LANDING_LIMITS.videos && (
          <AddButton onClick={() => edit((d) => void d.videos.push(""))}>Agregar video</AddButton>
        )}
      </Section>

      <Section
        id="comparativas"
        title="Tabla «Por qué este y no otro»"
        hint="Características de este producto contra un producto común. Marca cuáles cumple cada uno."
      >
        {landing.vsRows.map((row, i) => (
          <div key={i} className="flex animate-pop-in flex-wrap items-end gap-3 rounded-xl2 bg-blush-50/50 p-3">
            <div className="min-w-48 flex-1">
              <TextField
                label="Característica"
                value={row.label}
                placeholder="Sin fragancia"
                onChange={(value) => edit((d) => void (d.vsRows[i].label = value))}
              />
            </div>
            <Check label="Este producto" checked={row.ours} onChange={(v) => edit((d) => void (d.vsRows[i].ours = v))} />
            <Check label="Otros" checked={row.others} onChange={(v) => edit((d) => void (d.vsRows[i].others = v))} />
            <RemoveButton label={`Quitar la fila ${row.label || i + 1}`} onClick={() => edit((d) => void d.vsRows.splice(i, 1))} />
          </div>
        ))}
        {landing.vsRows.length < LANDING_LIMITS.vsRows && (
          <AddButton onClick={() => edit((d) => void d.vsRows.push({ label: "", ours: true, others: false }))}>
            Agregar característica
          </AddButton>
        )}
      </Section>

      <Section
        id="rutina"
        title="Rutina"
        hint="Los pasos salen del campo «Cómo usar». Aquí eliges el momento del día y con qué combinarlo."
      >
        <label className="flex max-w-xs flex-col gap-1.5 text-sm">
          <span className="font-semibold text-ink">Momento de uso</span>
          <input
            value={landing.moment}
            list={momentListId}
            placeholder="Mañana y noche"
            onChange={(event) => edit((d) => void (d.moment = event.target.value))}
            className="input-field"
          />
          <datalist id={momentListId}>
            {MOMENT_SUGGESTIONS.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
        </label>
        <ImageField
          label="Foto de textura o aplicación"
          hint="Un swatch del producto en la mano o la piel. Vertical."
          value={landing.routineImage}
          onChange={(url) => edit((d) => void (d.routineImage = url))}
        />
        <ProductPicker
          legend="Combínalo con"
          selected={landing.pairWith}
          max={LANDING_LIMITS.pairWith}
          products={products}
          onChange={(value) => edit((d) => void (d.pairWith = value))}
        />
      </Section>

      <Section
        id="comparar"
        title="Comparar con otros de la tienda"
        hint="Elige de 1 a 3 productos parecidos. La tabla se llena sola con precio, tamaño, tipo de piel y calificación."
      >
        <ProductPicker
          legend="Productos a comparar"
          selected={landing.compareWith}
          max={LANDING_LIMITS.compareWith}
          products={products}
          onChange={(value) => edit((d) => void (d.compareWith = value))}
        />
      </Section>

      <Section id="preguntas" title="Preguntas frecuentes" hint="Las dudas que más te hacen por WhatsApp sobre este producto.">
        {landing.faq.map((item, i) => (
          <div key={i} className="flex animate-pop-in flex-col gap-3 border-t border-border pt-5 first:border-t-0 first:pt-0">
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <TextField
                  label={`Pregunta ${i + 1}`}
                  value={item.question}
                  placeholder="¿Sirve para piel sensible?"
                  onChange={(value) => edit((d) => void (d.faq[i].question = value))}
                />
              </div>
              <RemoveButton label={`Quitar la pregunta ${i + 1}`} onClick={() => edit((d) => void d.faq.splice(i, 1))} />
            </div>
            <textarea
              aria-label={`Respuesta ${i + 1}`}
              value={item.answer}
              rows={2}
              maxLength={600}
              onChange={(event) => edit((d) => void (d.faq[i].answer = event.target.value))}
              className="input-field"
              placeholder="Respuesta corta y clara."
            />
          </div>
        ))}
        {landing.faq.length < LANDING_LIMITS.faq && (
          <AddButton onClick={() => edit((d) => void d.faq.push({ question: "", answer: "" }))}>Agregar pregunta</AddButton>
        )}
      </Section>
    </div>
  );
}

function Row({ children, onRemove, label }: { children: React.ReactNode; onRemove: () => void; label: string }) {
  return (
    <div className="flex animate-pop-in items-end gap-3 rounded-xl2 bg-blush-50/50 p-3">
      <div className="grid flex-1 gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">{children}</div>
      <RemoveButton label={`Quitar ${label}`} onClick={onRemove} />
    </div>
  );
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex h-11 cursor-pointer items-center gap-2 text-sm font-semibold text-ink">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 accent-blush-500"
      />
      {label}
    </label>
  );
}

function ProductPicker({
  legend,
  selected,
  max,
  products,
  onChange,
}: {
  legend: string;
  selected: string[];
  max: number;
  products: LandingProductOption[];
  onChange: (value: string[]) => void;
}) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-2 text-sm font-semibold text-ink">
        {legend}{" "}
        <span className="font-normal text-ink/45">
          ({selected.length}/{max})
        </span>
      </legend>
      <div className="flex flex-wrap gap-2">
        {products.map((product) => {
          const checked = selected.includes(product.slug);
          const full = !checked && selected.length >= max;
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
                onChange={() => onChange(checked ? selected.filter((s) => s !== product.slug) : [...selected, product.slug])}
              />
              {product.name}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function ImageField({
  label,
  hint,
  value,
  wide,
  onChange,
}: {
  label: string;
  hint?: string;
  value: string;
  wide?: boolean;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function upload(file: File | undefined) {
    if (!file) return;
    setError("");
    setUploading(true);
    const fd = new FormData();
    fd.set("file", file);
    const result = await uploadProductImageAction(fd);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
    if ("error" in result) setError(result.error);
    else onChange(result.url);
  }

  return (
    <div className="flex flex-col gap-1.5 text-sm">
      <span className="font-semibold text-ink">{label}</span>
      <div className="flex flex-wrap items-center gap-3">
        {value && (
          <div className={`relative ${wide ? "h-20 w-44" : "h-20 w-20"}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="" className="h-full w-full rounded-xl2 border border-border object-cover" />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-ink text-white"
              aria-label={`Quitar ${label.toLowerCase()}`}
            >
              <CloseIcon className="h-3 w-3" />
            </button>
          </div>
        )}
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="btn-secondary px-4 py-2 text-xs disabled:opacity-60"
        >
          <UploadIcon className="h-3.5 w-3.5" />
          {uploading ? "Subiendo..." : value ? "Cambiar" : "Subir foto"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => upload(event.target.files?.[0])}
        />
      </div>
      {hint && <span className="text-xs text-ink/40">{hint}</span>}
      {error && <span className="text-xs font-semibold text-blush-600">{error}</span>}
    </div>
  );
}
