"use client";

import { useEffect, useState } from "react";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { ProductCard } from "@/components/ProductCard";
import { ArrowRightIcon } from "@/components/icons";
import type { Product } from "@/lib/types";

export function ProductCarousel({ products }: { products: Product[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  useEffect(() => {
    if (!api) return;

    const sync = () => {
      setScrollSnaps(api.scrollSnapList());
      setSelected(api.selectedScrollSnap());
      setCanPrev(api.canScrollPrev());
      setCanNext(api.canScrollNext());
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
    <div className="relative">
      <Carousel setApi={setApi} opts={{ align: "start", loop: false }}>
        <CarouselContent className="-ml-5 sm:-ml-6">
          {products.map((product, i) => (
            <CarouselItem
              key={product.slug}
              className="basis-[80%] pl-5 sm:basis-1/2 sm:pl-6 lg:basis-1/4"
            >
              <ProductCard product={product} index={i} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <button
        type="button"
        onClick={() => api?.scrollPrev()}
        aria-label="Ver productos anteriores"
        disabled={!canPrev}
        className="absolute -left-3 top-[34%] z-10 hidden h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow-card ring-1 ring-border/60 transition-all duration-200 ease-out-strong hover:scale-110 hover:text-blush-600 disabled:pointer-events-none disabled:opacity-0 sm:-left-5 lg:flex"
      >
        <ArrowRightIcon className="h-4 w-4 rotate-180" />
      </button>
      <button
        type="button"
        onClick={() => api?.scrollNext()}
        aria-label="Ver más productos"
        disabled={!canNext}
        className="absolute -right-3 top-[34%] z-10 hidden h-11 w-11 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-white text-ink shadow-card ring-1 ring-border/60 transition-all duration-200 ease-out-strong hover:scale-110 hover:text-blush-600 disabled:pointer-events-none disabled:opacity-0 sm:-right-5 lg:flex"
      >
        <ArrowRightIcon className="h-4 w-4" />
      </button>

      {scrollSnaps.length > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
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
    </div>
  );
}
