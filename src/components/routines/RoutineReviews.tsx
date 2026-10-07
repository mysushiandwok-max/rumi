"use client";

import { useActionState, useState, type CSSProperties } from "react";
import { Reveal } from "@/components/category/Reveal";
import { CheckIcon, HeartIcon, StarIcon } from "@/components/icons";
import { ROUTINE_COLLECTIONS } from "@/components/routines/collections";
import { submitRoutineReviewAction } from "@/lib/admin/actions/routine-reviews";
import type { RoutineCollection, RoutineRatingSummary, RoutineReview } from "@/lib/types";

type FormState = { error?: string; success?: boolean } | undefined;

async function action(_prevState: FormState, formData: FormData): Promise<FormState> {
  const result = await submitRoutineReviewAction(formData);
  if ("error" in result && result.error) return { error: result.error };
  return { success: true };
}

const RATING_LABELS = ["Toca una estrella", "No me gustó", "Regular", "Está bien", "Me gustó", "¡Me encantó!"];
const INITIAL_REVIEWS = 4;

export function Stars({ value, className = "h-4 w-4" }: { value: number; className?: string }) {
  return (
    <span className="flex" aria-label={`${value} de 5 estrellas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon key={i} className={`${className} ${i < Math.round(value) ? "text-peach-400" : "text-ink/10"}`} />
      ))}
    </span>
  );
}

// Selector de 1 a 5 estrellas: al pasar el mouse muestra la vista previa; al elegir, las estrellas se
// encienden en cascada. La etiqueta de abajo cambia para que la calificación se sienta como una respuesta.
function RatingPicker({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;

  return (
    <div>
      <div className="flex gap-1" role="radiogroup" aria-label="Calificación" onMouseLeave={() => setHover(0)}>
        {Array.from({ length: 5 }).map((_, i) => {
          const star = i + 1;
          const on = star <= shown;
          return (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={value === star}
              aria-label={`${star} ${star === 1 ? "estrella" : "estrellas"}`}
              onClick={() => onChange(star)}
              onMouseEnter={() => setHover(star)}
              className="rounded-full p-0.5 transition-transform duration-150 ease-out-strong active:scale-90 can-hover:hover:scale-110"
            >
              <StarIcon
                style={{ transitionDelay: hover ? "0ms" : `${i * 30}ms` }}
                className={`h-8 w-8 transition-[color,transform] duration-200 ease-out-strong ${
                  on ? "scale-100 text-peach-400" : "scale-90 text-ink/10"
                }`}
              />
            </button>
          );
        })}
      </div>
      <p className={`mt-1 text-sm font-semibold transition-colors duration-150 ${shown ? "text-ink/70" : "text-ink/40"}`}>
        {RATING_LABELS[shown]}
      </p>
    </div>
  );
}

function ReviewForm({ routineSlug, collection }: { routineSlug: string; collection: RoutineCollection }) {
  const styles = ROUTINE_COLLECTIONS[collection];
  const [state, formAction, isPending] = useActionState(action, undefined);
  const [rating, setRating] = useState(0);

  if (state?.success) {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <span className={`flex h-14 w-14 animate-pop-in items-center justify-center rounded-full ${styles.solid}`}>
          <CheckIcon className="h-7 w-7" />
        </span>
        <p className="font-display text-lg font-bold text-ink">¡Gracias por contarnos!</p>
        <p className="max-w-xs text-sm text-ink/60">Tu reseña aparecerá aquí en cuanto la revisemos.</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="routineSlug" value={routineSlug} />
      <input type="hidden" name="rating" value={rating} />

      <RatingPicker value={rating} onChange={setRating} />

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-semibold text-ink">Tu nombre</span>
          <input name="authorName" required maxLength={80} className="input-field bg-white" placeholder="Cómo quieres aparecer" />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-semibold text-ink">
            Tu ciudad <span className="font-normal text-ink/40">(opcional)</span>
          </span>
          <input name="authorCity" maxLength={60} className="input-field bg-white" placeholder="Ciudad" />
        </label>
      </div>
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-semibold text-ink">Tu experiencia</span>
        <textarea
          name="comment"
          required
          maxLength={1200}
          className="input-field min-h-24 resize-y bg-white"
          placeholder="¿Cuánto tiempo la usaste? ¿Qué cambió en tu piel?"
        />
      </label>

      {state?.error && <p className="text-sm font-semibold text-blush-600">{state.error}</p>}

      <button
        type="submit"
        disabled={isPending || rating === 0}
        className={`self-start rounded-pill px-6 py-3 font-display text-sm font-bold shadow-sm transition-[transform,opacity] duration-200 ease-out-strong active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 can-hover:enabled:hover:-translate-y-0.5 ${styles.solid}`}
      >
        {isPending ? "Enviando…" : "Enviar reseña"}
      </button>
    </form>
  );
}

function ReviewItem({ review, collection }: { review: RoutineReview; collection: RoutineCollection }) {
  const styles = ROUTINE_COLLECTIONS[collection];
  return (
    <article className="rounded-[1.5rem] bg-white p-5 shadow-card ring-1 ring-border/50">
      <div className="flex items-center gap-3">
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-display text-sm font-bold ${styles.chip}`}>
          {review.authorName.trim().charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-ink">
            {review.authorName}
            {review.authorCity && <span className="font-normal text-ink/45"> · {review.authorCity}</span>}
          </p>
          <p className="text-xs text-ink/40">
            {/* SQLite guarda "AAAA-MM-DD HH:MM:SS" en UTC; con "T…Z" lo entienden todos los navegadores */}
            {new Date(`${review.createdAt.replace(" ", "T")}Z`).toLocaleDateString("es-CO", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <Stars value={review.rating} className="h-3.5 w-3.5" />
      </div>
      <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink/70">{review.comment}</p>
    </article>
  );
}

// Reseñas de la rutina: resumen con barras por estrella (se llenan al entrar en pantalla), formulario y lista.
export function RoutineReviews({
  routineSlug,
  collection,
  reviews,
  summary,
}: {
  routineSlug: string;
  collection: RoutineCollection;
  reviews: RoutineReview[];
  summary: RoutineRatingSummary;
}) {
  const styles = ROUTINE_COLLECTIONS[collection];
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? reviews : reviews.slice(0, INITIAL_REVIEWS);

  return (
    <section id="resenas" aria-labelledby="resenas-title" className="mt-16 scroll-mt-24">
      <h2 id="resenas-title" className="font-display text-2xl font-bold text-ink sm:text-3xl">
        Reseñas de la rutina
      </h2>
      <p className="mt-1 text-sm text-ink/60">Cuéntanos cómo te fue: tu experiencia ayuda a otras personas a elegir.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start">
        <div className={`rounded-[1.75rem] p-5 sm:p-7 ${styles.surface}`}>
          {summary.count > 0 && (
            <Reveal className="group mb-6 flex items-center gap-5 border-b border-ink/10 pb-6">
              <div className="text-center">
                <p className="font-display text-5xl font-bold leading-none text-ink">{summary.average.toFixed(1)}</p>
                <div className="mt-2">
                  <Stars value={summary.average} />
                </div>
                <p className="mt-1 text-xs text-ink/50">
                  {summary.count} {summary.count === 1 ? "reseña" : "reseñas"}
                </p>
              </div>
              <div className="flex flex-1 flex-col gap-1.5">
                {([5, 4, 3, 2, 1] as const).map((star, i) => (
                  <div key={star} className="flex items-center gap-2 text-xs text-ink/55">
                    <span className="w-2 text-right">{star}</span>
                    <span className="relative h-2 flex-1 overflow-hidden rounded-full bg-white/80">
                      <span
                        style={
                          {
                            "--fill": summary.distribution[star] / summary.count,
                            transitionDelay: `${150 + i * 60}ms`,
                          } as CSSProperties
                        }
                        className={`absolute inset-0 origin-left scale-x-0 rounded-full transition-transform duration-700 ease-out-strong group-data-[visible=true]:[transform:scaleX(var(--fill))] ${styles.solid}`}
                      />
                    </span>
                    <span className="w-5 text-right">{summary.distribution[star]}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          )}

          <h3 className="font-display text-lg font-bold text-ink">Califica esta rutina</h3>
          <div className="mt-3">
            <ReviewForm routineSlug={routineSlug} collection={collection} />
          </div>
        </div>

        {reviews.length > 0 ? (
          <div>
            <ul className="flex flex-col gap-4">
              {visible.map((review, i) => (
                <Reveal key={review.id} as="li" delay={Math.min(i, 3) * 60} className="list-none">
                  <ReviewItem review={review} collection={collection} />
                </Reveal>
              ))}
            </ul>
            {reviews.length > INITIAL_REVIEWS && (
              <button
                type="button"
                onClick={() => setShowAll((current) => !current)}
                className={`mt-4 rounded-pill bg-white px-5 py-2.5 text-sm font-semibold shadow-sm ring-1 ring-border/70 transition-transform duration-150 ease-out-strong active:scale-[0.97] ${styles.text}`}
              >
                {showAll ? "Ver menos" : `Ver las ${reviews.length} reseñas`}
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 rounded-[1.75rem] border-2 border-dashed border-border px-6 py-14 text-center">
            <span className={`flex h-14 w-14 items-center justify-center rounded-full ${styles.chip}`}>
              <HeartIcon className="h-6 w-6" />
            </span>
            <p className="font-display text-lg font-bold text-ink">Todavía no hay reseñas</p>
            <p className="max-w-xs text-sm text-ink/60">¡Sé la primera persona en contar cómo te fue con esta rutina!</p>
          </div>
        )}
      </div>
    </section>
  );
}
