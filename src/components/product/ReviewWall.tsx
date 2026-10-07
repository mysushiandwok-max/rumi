"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRightIcon, CloseIcon, MapPinIcon, QuoteIcon, StarIcon } from "@/components/icons";
import type { Review } from "@/lib/types";

// Cada tarjeta queda "pegada" con un ángulo y un color distinto, como fotos y notas en un tablero.
const TILTS = ["-rotate-2", "rotate-[1.5deg]", "-rotate-1", "rotate-2", "-rotate-[1.5deg]", "rotate-1"];
const NOTE_TONES = [
  { paper: "bg-blush-100", tape: "bg-peach-200/80", quote: "text-blush-300" },
  { paper: "bg-lavender-100", tape: "bg-blush-200/80", quote: "text-lavender-300" },
  { paper: "bg-peach-100", tape: "bg-mint-200/80", quote: "text-peach-300" },
  { paper: "bg-mint-100", tape: "bg-lavender-200/80", quote: "text-mint-300" },
];

function Stars({ rating, className = "h-4 w-4" }: { rating: number; className?: string }) {
  return (
    <div className="flex" aria-label={`${rating} de 5 estrellas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon key={i} className={`${className} ${i < rating ? "text-blush-500" : "text-blush-200"}`} />
      ))}
    </div>
  );
}

function Signature({ review }: { review: Review }) {
  return (
    <div className="mt-4 flex items-end justify-between gap-3">
      <div className="min-w-0">
        <p className="truncate font-display text-sm font-bold text-ink">{review.authorName}</p>
        {review.authorCity && (
          <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-ink/55">
            <MapPinIcon className="h-3.5 w-3.5 shrink-0" />
            {review.authorCity}
          </p>
        )}
      </div>
      <p className="shrink-0 text-[11px] text-ink/40">
        {new Date(review.createdAt).toLocaleDateString("es-CO", { day: "numeric", month: "short" })}
      </p>
    </div>
  );
}

// Fuera de la ficha (p. ej. en la home) cada reseña lleva el nombre de su producto.
type WallReview = Review & { productName?: string };

// Carrusel de reseñas tipo tablero: las que traen foto se ven como polaroids con cinta, las de solo texto
// como notas de papel. Al tocar una tarjeta se abre completa (con sus fotos en grande).
export function ReviewWall({ reviews }: { reviews: WallReview[] }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState<WallReview | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [edges, setEdges] = useState({ start: true, end: true });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () =>
      setEdges({
        start: track.scrollLeft <= 4,
        end: track.scrollLeft + track.clientWidth >= track.scrollWidth - 4,
      });
    update();
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      track.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [reviews.length]);

  const scroll = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector("li");
    track.scrollBy({ left: direction * ((card?.clientWidth ?? 280) + 24), behavior: "smooth" });
  };

  const openReview = (review: WallReview) => {
    setOpen(review);
    setPhotoIndex(0);
    dialogRef.current?.showModal();
  };

  return (
    <div className="relative">
      <ul
        ref={trackRef}
        className="-mx-5 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-6 pt-6 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:px-2 [&::-webkit-scrollbar]:hidden"
      >
        {reviews.map((review, i) => {
          const tone = NOTE_TONES[i % NOTE_TONES.length];
          const photo = review.photos[0];
          return (
            <li key={review.id} className="w-[78%] shrink-0 snap-start sm:w-[272px]">
              <button
                type="button"
                onClick={() => openReview(review)}
                aria-label={`Ver la reseña de ${review.authorName}`}
                className={`group relative flex h-full w-full flex-col text-left transition-transform duration-300 ease-out-strong can-hover:hover:-translate-y-1.5 can-hover:hover:rotate-0 ${TILTS[i % TILTS.length]} ${
                  photo
                    ? "rounded-[6px] bg-white p-3 pb-5 shadow-[0_16px_32px_-16px_rgba(43,35,32,0.35)] ring-1 ring-black/5"
                    : `rounded-[1.25rem] ${tone.paper} p-6 shadow-[0_14px_28px_-18px_rgba(43,35,32,0.35)]`
                }`}
              >
                {/* Cinta washi */}
                <span
                  aria-hidden="true"
                  className={`absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 rounded-[2px] ${tone.tape} ${
                    i % 2 ? "rotate-3" : "-rotate-3"
                  }`}
                />

                {photo ? (
                  <>
                    <span className="relative block aspect-[4/5] overflow-hidden rounded-[3px] bg-cream">
                      <Image
                        src={photo}
                        alt={`Foto de ${review.authorName}`}
                        fill
                        sizes="(min-width: 640px) 272px, 78vw"
                        className="object-cover transition-transform duration-500 ease-out-strong can-hover:group-hover:scale-[1.04]"
                      />
                      {review.photos.length > 1 && (
                        <span className="absolute right-2 top-2 rounded-pill bg-white/90 px-2 py-0.5 text-[11px] font-bold text-ink">
                          +{review.photos.length - 1}
                        </span>
                      )}
                    </span>
                    <span className="mt-4 block px-1">
                      <Stars rating={review.rating} className="h-3.5 w-3.5" />
                      {review.productName && (
                        <span className="mt-2 block truncate text-xs font-bold uppercase tracking-wide text-blush-600">
                          {review.productName}
                        </span>
                      )}
                      <span className="mt-2 line-clamp-3 block text-sm leading-relaxed text-ink/75">{review.comment}</span>
                      <Signature review={review} />
                    </span>
                  </>
                ) : (
                  <>
                    <QuoteIcon aria-hidden="true" className={`h-9 w-9 ${tone.quote}`} />
                    <Stars rating={review.rating} className="mt-3 h-4 w-4" />
                    <span className="mt-3 line-clamp-[8] block flex-1 font-display text-base leading-relaxed text-ink/85">
                      {review.comment}
                    </span>
                    <Signature review={review} />
                  </>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {!(edges.start && edges.end) && (
        <div className="mt-2 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => scroll(-1)}
            disabled={edges.start}
            aria-label="Reseñas anteriores"
            className="grid h-11 w-11 place-items-center rounded-full bg-white text-ink shadow-card transition-[opacity,transform] duration-150 active:scale-95 disabled:opacity-35"
          >
            <ArrowRightIcon className="h-4 w-4 rotate-180" />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            disabled={edges.end}
            aria-label="Más reseñas"
            className="grid h-11 w-11 place-items-center rounded-full bg-blush-500 text-white shadow-card transition-[opacity,transform] duration-150 active:scale-95 disabled:opacity-35"
          >
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        </div>
      )}

      <dialog
        ref={dialogRef}
        onClose={() => setOpen(null)}
        onClick={(event) => {
          if (event.target === dialogRef.current) dialogRef.current?.close();
        }}
        className="m-auto w-[min(92vw,720px)] overflow-hidden rounded-[2rem] bg-white p-0 shadow-soft backdrop:bg-ink/50 backdrop:backdrop-blur-sm"
      >
        {open && (
          <div className={open.photos.length > 0 ? "grid sm:grid-cols-2" : ""}>
            {open.photos.length > 0 && (
              <div className="relative bg-cream">
                <div className="relative aspect-[4/5]">
                  <Image
                    src={open.photos[photoIndex]}
                    alt={`Foto ${photoIndex + 1} de ${open.authorName}`}
                    fill
                    sizes="(min-width: 640px) 360px, 92vw"
                    className="object-cover"
                  />
                </div>
                {open.photos.length > 1 && (
                  <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2">
                    {open.photos.map((photo, i) => (
                      <button
                        key={photo}
                        type="button"
                        onClick={() => setPhotoIndex(i)}
                        aria-label={`Ver foto ${i + 1}`}
                        className={`h-2.5 rounded-full transition-[width,background-color] duration-200 ${
                          i === photoIndex ? "w-6 bg-white" : "w-2.5 bg-white/60"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
            <div className="relative flex flex-col p-7">
              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                aria-label="Cerrar"
                className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-ink/5 text-ink/60 hover:text-ink"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
              <Stars rating={open.rating} />
              {open.productName && (
                <Link
                  href={`/producto/${open.productSlug}`}
                  className="mt-3 self-start pr-10 text-sm font-bold text-blush-600 underline-offset-4 hover:underline"
                >
                  {open.productName} →
                </Link>
              )}
              <p className="mt-4 max-h-[50vh] overflow-y-auto pr-2 text-base leading-relaxed text-ink/80">{open.comment}</p>
              <Signature review={open} />
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
