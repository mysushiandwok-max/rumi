"use client";

import { useEffect, useState } from "react";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { TestimonialCard } from "@/components/TestimonialCard";
import { VideoReviewModal } from "@/components/VideoReviewModal";
import type { FeaturedReview } from "@/data/reviews";

export function VideoReviewsSection({ reviews }: { reviews: FeaturedReview[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [active, setActive] = useState<FeaturedReview | null>(null);

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

  return (
    <>
      <Carousel setApi={setApi} opts={{ align: "start", loop: false }}>
        <CarouselContent className="-ml-4 py-2 sm:-ml-6">
          {reviews.map((review, i) => (
            <CarouselItem
              key={review.id}
              className="basis-[70%] pl-4 sm:basis-1/2 sm:pl-6 lg:basis-1/4"
            >
              <TestimonialCard review={review} index={i} onPlay={() => setActive(review)} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {scrollSnaps.length > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {scrollSnaps.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => api?.scrollTo(i)}
              aria-label={`Ir a la página ${i + 1}`}
              className={`h-2 rounded-pill transition-all duration-300 ease-out-strong ${
                i === selected ? "w-6 bg-blush-500" : "w-2 bg-blush-200 hover:bg-blush-300"
              }`}
            />
          ))}
        </div>
      )}

      <VideoReviewModal review={active} onClose={() => setActive(null)} />
    </>
  );
}
