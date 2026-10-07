"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { CloseIcon, StarIcon, UploadIcon } from "@/components/icons";
import { ReviewWall } from "@/components/product/ReviewWall";
import { DrawnHeart } from "@/components/product/SoftHearts";
import { submitReviewAction } from "@/lib/admin/actions/reviews";
import type { Review } from "@/lib/types";

type FormState = { error?: string; success?: boolean } | undefined;

async function action(_prevState: FormState, formData: FormData): Promise<FormState> {
  const result = await submitReviewAction(formData);
  if ("error" in result && result.error) return { error: result.error };
  return { success: true };
}

function Stars({ rating, className = "h-3.5 w-3.5" }: { rating: number; className?: string }) {
  return (
    <div className="flex" aria-label={`${rating} de 5 estrellas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon key={i} className={`${className} ${i < Math.round(rating) ? "text-blush-500" : "text-blush-100"}`} />
      ))}
    </div>
  );
}

export function ProductReviews({
  productSlug,
  reviews,
  rating: productRating,
  reviewCount,
}: {
  productSlug: string;
  reviews: Review[];
  rating: number;
  reviewCount: number;
}) {
  const [state, formAction, isPending] = useActionState(action, undefined);
  const [rating, setRating] = useState(5);
  // El total del producto puede incluir calificaciones anteriores a las reseñas publicadas aquí.
  const total = Math.max(reviewCount, reviews.length);
  const average =
    reviewCount > 0 ? productRating : reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1);
  const withPhotos = reviews.filter((r) => r.photos.length > 0).length;
  // Primero las que traen foto: son las que más ayudan a decidir.
  const wall = [...reviews].sort((a, b) => Number(b.photos.length > 0) - Number(a.photos.length > 0));

  return (
    <div>
      <h2 className="mb-10 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
        Lo que dicen de este producto
      </h2>

      {total > 0 && (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)] lg:items-start">
          <div className="relative overflow-hidden rounded-[2rem] bg-blush-100 p-7">
            {/* Pocos corazones blancos, solo en la esquina de arriba a la derecha: es la única zona libre
                (el número va a la izquierda y las barras y el botón ocupan todo el ancho). */}
            <div aria-hidden="true" className="pointer-events-none absolute right-5 top-5 text-white">
              <DrawnHeart style="sketch" className="block h-auto w-14 rotate-12" />
              <DrawnHeart style="hatch" className="absolute -left-12 top-12 block h-auto w-7 -rotate-12" />
              <DrawnHeart style="burst" className="absolute -left-3 top-[4.5rem] block h-auto w-5 rotate-6" />
            </div>
            <div className="relative z-10">
              <p className="font-display text-6xl font-bold leading-none text-ink">{average.toFixed(1)}</p>
              <Stars rating={average} className="mt-3 h-5 w-5" />
              <p className="mt-2 text-sm text-ink/60">
                {total} {total === 1 ? "calificación" : "calificaciones"}
                {withPhotos > 0 && ` · ${withPhotos} con fotos`}
              </p>
              {reviews.length === total && (
                <ul className="mt-6 flex flex-col gap-2">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const count = reviews.filter((r) => r.rating === stars).length;
                    return (
                      <li key={stars} className="flex items-center gap-3 text-xs font-semibold text-ink/60">
                        <span className="w-3">{stars}</span>
                        <StarIcon className="h-3 w-3 text-blush-500" />
                        <span className="h-2 flex-1 overflow-hidden rounded-pill bg-white">
                          <span
                            className="block h-full rounded-pill bg-blush-400"
                            style={{
                              width: `${(count / reviews.length) * 100}%`,
                            }}
                          />
                        </span>
                        <span className="w-6 text-right">{count}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
              <a href="#escribir-resena" className="btn-secondary mt-6 w-full px-4 py-2.5 text-sm">
                Escribir una reseña
              </a>
            </div>
          </div>

          {wall.length > 0 && <ReviewWall reviews={wall} />}
        </div>
      )}

      {reviews.length === 0 && (
        <p className="text-sm text-ink/50">Todavía no hay reseñas. Cuéntanos cómo te fue y sé la primera.</p>
      )}

      <div id="escribir-resena" className="card-surface mt-8 max-w-lg scroll-mt-28 p-6">
        <h3 className="font-display text-base font-bold text-ink">Deja tu reseña</h3>
        {state?.success ? (
          <p className="mt-3 text-sm font-semibold text-mint-700">
            ¡Gracias! Vamos a revisar tu reseña y la publicamos en poquito.
          </p>
        ) : (
          <form action={formAction} className="mt-4 flex flex-col gap-4">
            <input type="hidden" name="productSlug" value={productSlug} />
            <input type="hidden" name="rating" value={rating} />
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-ink">Calificación</span>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setRating(i + 1)}
                    aria-label={`${i + 1} estrellas`}
                    className="p-0.5"
                  >
                    <StarIcon className={`h-6 w-6 ${i < rating ? "text-blush-500" : "text-blush-100"}`} />
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-semibold text-ink">Tu nombre</span>
                <input name="authorName" required maxLength={60} className="input-field" placeholder="Tu nombre" />
              </label>
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-semibold text-ink">Tu ciudad</span>
                <input name="authorCity" required maxLength={60} className="input-field" placeholder="Ej: Medellín" />
              </label>
            </div>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-semibold text-ink">Comentario</span>
              <textarea
                name="comment"
                required
                className="input-field min-h-20"
                maxLength={1500}
                placeholder="¿Cómo te fue? ¿Qué notaste en tu piel?"
              />
            </label>
            <PhotoPicker />
            {state?.error && <p className="text-sm font-semibold text-blush-600">{state.error}</p>}
            <button
              type="submit"
              disabled={isPending}
              className="btn-primary self-start px-6 py-2.5 text-sm disabled:opacity-60"
            >
              {isPending ? "Enviando..." : "Enviar reseña"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

const MAX_PHOTOS = 3;

// Selector de hasta 3 fotos con vista previa. El input real (name="photos") guarda los archivos vía
// DataTransfer, así el formulario los envía tal cual al server action.
function PhotoPicker() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    const transfer = new DataTransfer();
    files.forEach((file) => transfer.items.add(file));
    if (inputRef.current) inputRef.current.files = transfer.files;
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [files]);

  return (
    <div className="flex flex-col gap-1.5 text-sm">
      <span className="font-semibold text-ink">
        Fotos <span className="font-normal text-ink/45">(opcional, máximo {MAX_PHOTOS})</span>
      </span>
      <div className="flex flex-wrap gap-3">
        {previews.map((url, i) => (
          <div key={url} className="relative h-20 w-20 overflow-hidden rounded-2xl bg-cream ring-1 ring-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={`Foto ${i + 1}`} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => setFiles((current) => current.filter((_, index) => index !== i))}
              aria-label={`Quitar foto ${i + 1}`}
              className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-white/90 text-ink shadow-sm"
            >
              <CloseIcon className="h-3 w-3" />
            </button>
          </div>
        ))}
        {files.length < MAX_PHOTOS && (
          <label className="grid h-20 w-20 cursor-pointer place-items-center rounded-2xl border-2 border-dashed border-blush-200 bg-blush-50 text-blush-500 transition-colors focus-within:ring-2 focus-within:ring-blush-300 hover:border-blush-300 hover:bg-blush-100">
            <UploadIcon className="h-5 w-5" />
            <span className="sr-only">Agregar fotos</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={(event) => {
                const picked = Array.from(event.target.files ?? []);
                event.target.value = "";
                setFiles((current) => [...current, ...picked].slice(0, MAX_PHOTOS));
              }}
            />
          </label>
        )}
      </div>
      <input ref={inputRef} type="file" name="photos" multiple hidden />
      <p className="text-xs text-ink/45">El producto en tu tocador, tu piel después de unas semanas: lo que quieras mostrar.</p>
    </div>
  );
}
