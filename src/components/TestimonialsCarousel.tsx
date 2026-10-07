"use client";

import { useEffect, useState } from "react";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { QuoteIcon, StarIcon, CheckCircleIcon, MapPinIcon, HeartIcon, SparkleIcon } from "@/components/icons";
import type { FeaturedReview } from "@/data/reviews";

const AUTOPLAY_MS = 6000;

const TONE_STYLES: Record<
  string,
  { card: string; blob: string; quote: string; avatar: string; progress: string }
> = {
  blush: {
    card: "from-blush-50 via-white to-white",
    blob: "bg-blush-200/50",
    quote: "text-blush-200",
    avatar: "bg-blush-100 text-blush-700",
    progress: "bg-blush-500",
  },
  mint: {
    card: "from-mint-50 via-white to-white",
    blob: "bg-mint-200/50",
    quote: "text-mint-200",
    avatar: "bg-mint-100 text-mint-700",
    progress: "bg-mint-500",
  },
  peach: {
    card: "from-peach-50 via-white to-white",
    blob: "bg-peach-200/50",
    quote: "text-peach-200",
    avatar: "bg-peach-100 text-peach-600",
    progress: "bg-peach-500",
  },
  lavender: {
    card: "from-lavender-50 via-white to-white",
    blob: "bg-lavender-200/50",
    quote: "text-lavender-200",
    avatar: "bg-lavender-100 text-lavender-600",
    progress: "bg-lavender-500",
  },
};

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function TestimonialsCarousel({ reviews }: { reviews: FeaturedReview[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!api) return;
    const sync = () => {
      setScrollSnaps(api.scrollSnapList());
      setSelected(api.selectedScrollSnap());
    };
    sync();
    api.on("select", sync);
    api.on("reInit", sync);
    return () => {
      api.off("select", sync);
      api.off("reInit", sync);
    };
  }, [api]);

  useEffect(() => {
    if (!api || paused || scrollSnaps.length <= 1) return;
    const id = window.setInterval(() => api.scrollNext(), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [api, paused, scrollSnaps.length, selected]);

  if (reviews.length === 0) return null;

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onPointerDown={() => setPaused(true)}
    >
      <HeartIcon
        className="pointer-events-none absolute -left-2 top-4 hidden h-5 w-5 animate-float text-blush-300/70 opacity-70 sm:block"
        style={{ animationDelay: "0.6s" }}
      />
      <SparkleIcon
        className="pointer-events-none absolute -right-1 bottom-10 hidden h-6 w-6 animate-float text-lavender-300/70 opacity-70 sm:block"
        style={{ animationDelay: "1.6s" }}
      />

      <Carousel setApi={setApi} opts={{ align: "center", loop: true }}>
        <CarouselContent className="-ml-4 py-2 sm:-ml-6">
          {reviews.map((review, i) => {
            const tone = TONE_STYLES[review.tone] ?? TONE_STYLES.blush;
            const isActive = i === selected;

            return (
              <CarouselItem
                key={review.id}
                className="basis-[88%] pl-4 sm:basis-[68%] sm:pl-6 lg:basis-[52%]"
              >
                <article
                  className={`relative flex h-full flex-col overflow-hidden rounded-[2rem] bg-gradient-to-br p-7 shadow-card ring-1 ring-border/40 transition-all duration-500 ease-out-strong sm:p-10 ${tone.card} ${
                    isActive ? "scale-100 opacity-100" : "scale-[0.94] opacity-45"
                  }`}
                >
                  <div
                    className={`pointer-events-none absolute -right-12 -top-16 h-44 w-44 rounded-full blur-3xl ${tone.blob}`}
                  />

                  <QuoteIcon className={`relative h-10 w-10 shrink-0 ${tone.quote}`} />

                  <p className="relative mt-4 flex-1 font-display text-lg font-semibold leading-snug text-ink sm:text-xl">
                    {review.comment}
                  </p>

                  <div className="relative mt-6 flex items-center gap-1 text-peach-400">
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <StarIcon
                        key={starIndex}
                        className={`h-4 w-4 ${starIndex < Math.round(review.rating) ? "opacity-100" : "opacity-25"}`}
                      />
                    ))}
                  </div>

                  <div className="relative mt-5 flex items-center gap-3 border-t border-ink/5 pt-5">
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-display text-sm font-bold ${tone.avatar}`}
                    >
                      {initialsOf(review.authorName)}
                    </span>
                    <div className="min-w-0">
                      <p className="flex items-center gap-1.5 truncate font-display text-sm font-bold text-ink">
                        {review.authorName}
                        <CheckCircleIcon className="h-3.5 w-3.5 shrink-0 text-mint-500" />
                      </p>
                      <p className="flex items-center gap-1 truncate text-xs text-ink/50">
                        {review.authorCity && (
                          <>
                            <MapPinIcon className="h-3 w-3 shrink-0" />
                            {review.authorCity}
                            <span aria-hidden="true">·</span>
                          </>
                        )}
                        Compra verificada
                      </p>
                    </div>
                  </div>
                </article>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>

      {scrollSnaps.length > 1 && (
        <div className="mt-7 flex items-center justify-center gap-2">
          {scrollSnaps.map((_, i) => {
            const tone = TONE_STYLES[reviews[i]?.tone ?? "blush"] ?? TONE_STYLES.blush;
            const isCurrent = i === selected;
            return (
              <button
                key={i}
                type="button"
                onClick={() => api?.scrollTo(i)}
                aria-label={`Ir al testimonio ${i + 1}`}
                className="relative h-1.5 w-8 overflow-hidden rounded-pill bg-ink/10 transition-colors"
              >
                {isCurrent && (
                  <span
                    key={paused ? "paused" : selected}
                    className={`absolute inset-y-0 left-0 rounded-pill ${tone.progress} ${
                      paused ? "w-full" : "w-0 animate-[grow-x_6000ms_linear_forwards]"
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
