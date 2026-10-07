"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { CloseIcon, StarIcon } from "@/components/icons";
import { formatCOP } from "@/lib/format";
import type { FeaturedReview } from "@/data/reviews";

function ReviewInfoPanel({
  review,
  onClose,
  variant,
}: {
  review: FeaturedReview;
  onClose: () => void;
  variant: "overlay" | "panel";
}) {
  const isOverlay = variant === "overlay";
  return (
    <div
      className={
        isOverlay
          ? "absolute inset-x-0 bottom-0 flex flex-col gap-3 bg-gradient-to-t from-black/85 via-black/55 to-transparent p-5 pt-20 sm:hidden"
          : "hidden flex-col gap-3 p-5 sm:flex"
      }
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className={`font-display text-sm font-bold ${isOverlay ? "text-white" : "text-ink"}`}>
            {review.authorName}
          </p>
          {review.authorCity && (
            <p className={`text-xs ${isOverlay ? "text-white/70" : "text-ink/50"}`}>{review.authorCity}</p>
          )}
        </div>
        <div className="flex items-center gap-0.5 text-peach-400">
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon
              key={i}
              className={`h-3.5 w-3.5 ${i < Math.round(review.rating) ? "opacity-100" : "opacity-25"}`}
            />
          ))}
        </div>
      </div>
      <p className={`text-sm leading-relaxed ${isOverlay ? "text-white/90" : "text-ink/70"}`}>
        &ldquo;{review.comment}&rdquo;
      </p>
      <Link
        href={`/producto/${review.productSlug}`}
        onClick={onClose}
        className={`flex items-center gap-2.5 rounded-2xl p-2.5 transition-colors ${
          isOverlay ? "bg-white/15 backdrop-blur-sm hover:bg-white/25" : "bg-blush-50 hover:bg-blush-100"
        }`}
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white">
          {review.productImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={review.productImage} alt="" className="h-full w-full object-contain p-1.5" />
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className={`block truncate text-sm font-bold ${isOverlay ? "text-white" : "text-ink"}`}>
            {review.productName}
          </span>
          <span className={`block text-xs font-bold ${isOverlay ? "text-blush-200" : "text-blush-600"}`}>
            {formatCOP(review.productPrice)}
          </span>
        </span>
      </Link>
    </div>
  );
}

export function VideoReviewModal({
  review,
  onClose,
}: {
  review: FeaturedReview | null;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- portal target (document.body) only exists client-side; flips once after hydration
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!review) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [review, onClose]);

  if (!mounted) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-[90] flex items-center justify-center bg-ink/90 transition-opacity duration-300 ease-out-strong sm:bg-ink/80 sm:p-8 ${
        review ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      onClick={onClose}
      aria-hidden={!review}
    >
      {review && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Video de ${review.authorName}`}
          onClick={(e) => e.stopPropagation()}
          className="relative h-full w-full animate-pop-in overflow-hidden bg-black shadow-soft sm:h-auto sm:max-h-[88vh] sm:w-full sm:max-w-sm sm:rounded-3xl sm:bg-white"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar video"
            className="absolute right-3 top-[max(0.75rem,env(safe-area-inset-top))] z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-transform duration-150 ease-out-strong hover:scale-110 active:scale-90"
          >
            <CloseIcon className="h-4 w-4" />
          </button>

          <div className="relative h-full w-full sm:h-auto sm:aspect-[9/16]">
            {review.videoUrl ? (
              <video
                src={review.videoUrl}
                controls
                autoPlay
                playsInline
                className="h-full w-full bg-black object-cover"
              />
            ) : (
              review.productImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={review.productImage}
                  alt={review.productName}
                  className="h-full w-full bg-ink object-contain p-10"
                />
              )
            )}

            <ReviewInfoPanel review={review} onClose={onClose} variant="overlay" />
          </div>

          <ReviewInfoPanel review={review} onClose={onClose} variant="panel" />
        </div>
      )}
    </div>,
    document.body
  );
}
