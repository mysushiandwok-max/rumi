"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { ArrowRightIcon } from "@/components/icons";
import { BrandLogo } from "@/components/BrandLogo";
import { getBrandsByPopularity } from "@/data/brands";
import type { Brand } from "@/lib/types";

const EXCLUDED_SLUGS = ["firmskin"];

export function BrandCarousel({ brands }: { brands: Brand[] }) {
  const orderedBrands = getBrandsByPopularity(
    brands.filter((brand) => !EXCLUDED_SLUGS.includes(brand.slug))
  );
  const [api, setApi] = useState<CarouselApi>();
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  useEffect(() => {
    if (!api) return;

    const sync = () => {
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
        <CarouselContent className="-ml-3 py-1.5 sm:-ml-4">
          {orderedBrands.map((brand) => (
            <CarouselItem key={brand.slug} className="basis-[42%] pl-3 sm:basis-[28%] sm:pl-4 lg:basis-1/6">
              <Link
                href={`/marcas/${brand.slug}`}
                className="group flex h-16 items-center justify-center rounded-2xl border border-border/70 bg-white px-4 text-center shadow-card transition-all duration-200 ease-out-strong hover:-translate-y-1 hover:border-blush-300 hover:shadow-[0_20px_36px_-18px_rgba(43,35,32,0.22)] sm:h-20"
              >
                <BrandLogo
                  brand={brand}
                  fallbackClassName="line-clamp-2 font-display text-base font-bold text-ink transition-colors group-hover:text-blush-600"
                />
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <button
        type="button"
        onClick={() => api?.scrollPrev()}
        aria-label="Ver marcas anteriores"
        disabled={!canPrev}
        className="absolute -left-3 top-1/2 z-10 hidden h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow-card ring-1 ring-border/60 transition-all duration-200 ease-out-strong hover:scale-110 hover:text-blush-600 disabled:pointer-events-none disabled:opacity-0 sm:-left-5 lg:flex"
      >
        <ArrowRightIcon className="h-4 w-4 rotate-180" />
      </button>
      <button
        type="button"
        onClick={() => api?.scrollNext()}
        aria-label="Ver más marcas"
        disabled={!canNext}
        className="absolute -right-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-white text-ink shadow-card ring-1 ring-border/60 transition-all duration-200 ease-out-strong hover:scale-110 hover:text-blush-600 disabled:pointer-events-none disabled:opacity-0 sm:-right-5 lg:flex"
      >
        <ArrowRightIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
