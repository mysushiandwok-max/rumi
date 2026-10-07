"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRightIcon, ChevronDownIcon, StarIcon } from "@/components/icons";
import { getRoutineBySlug } from "@/data/routines";
import { CITIES, CITY_CLIMATE, CLIMATE_INFO } from "@/data/climate";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { ROUTINE_COLLECTIONS } from "@/components/routines/collections";
import { ProductCollage } from "@/components/routines/ProductCollage";
import type { Product } from "@/lib/types";

export function ClimateRoutineFinder({ routineProducts }: { routineProducts: Record<string, Product[]> }) {
  const [city, setCity] = useState("Bogotá");
  const climate = CITY_CLIMATE[city];
  const info = CLIMATE_INFO[climate];
  const routines = info.routineSlugs
    .map((slug) => getRoutineBySlug(slug))
    .filter((routine): routine is NonNullable<typeof routine> => Boolean(routine));

  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

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

  // Mismo collage y mismos colores de colección que las tarjetas de /rutinas.
  const renderCard = (routine: (typeof routines)[number], i: number) => {
    const styles = ROUTINE_COLLECTIONS[routine.collection];
    const CollectionIcon = styles.icon;
    const products = routineProducts[routine.slug] ?? [];
    return (
      <Link
        href={`/rutinas/${routine.slug}`}
        style={{ animationDelay: `${i * 70}ms` }}
        className={`group relative flex aspect-square w-full animate-fade-up flex-col overflow-hidden rounded-2xl p-1.5 ring-1 transition-[transform,box-shadow] duration-300 ease-out-strong active:scale-[0.98] can-hover:hover:-translate-y-1 can-hover:hover:shadow-card ${styles.card}`}
      >
        <div className="absolute inset-1.5">
          {products.length > 0 ? (
            <ProductCollage products={products} />
          ) : (
            <div className={`flex h-full items-center justify-center rounded-[1.1rem] bg-white/70 ${styles.text}`}>
              <CollectionIcon className="h-10 w-10 opacity-40" />
            </div>
          )}
        </div>

        {i === 0 && (
          <span
            className="relative m-1.5 flex h-7 w-7 shrink-0 items-center justify-center self-start rounded-full bg-white/95 text-peach-500 shadow-sm backdrop-blur-sm"
            title="La más recomendada para tu clima"
          >
            <StarIcon className="h-3.5 w-3.5 fill-current" />
          </span>
        )}

        <span
          className={`relative m-1.5 mt-auto inline-flex w-fit max-w-[calc(100%-0.75rem)] items-center gap-1.5 rounded-full bg-white/95 py-1.5 pl-1.5 pr-3 text-[11px] font-bold leading-tight text-ink shadow-sm backdrop-blur-sm`}
        >
          <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${styles.chip}`}>
            <CollectionIcon className="h-3 w-3" />
          </span>
          {routine.name}
          <ArrowRightIcon className="h-2.5 w-2.5 shrink-0 transition-transform duration-150 ease-out-strong can-hover:group-hover:translate-x-0.5" />
        </span>
      </Link>
    );
  };

  return (
    <div>
      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold text-ink">Tu ciudad</span>
        <div className="relative">
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full appearance-none rounded-xl2 border border-border bg-white px-4 py-3 pr-10 text-sm font-semibold text-ink transition-colors duration-150 focus:border-blush-400 focus:outline-none"
          >
            {CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />
        </div>
      </label>

      <span key={`pill-${climate}`} className="pill-badge mt-3 w-fit animate-fade-up bg-blush-50 text-blush-700">
        {info.label} · {info.description}
      </span>

      {/* Mobile: carousel with bigger cards */}
      <div key={`carousel-${climate}`} className="mt-5 sm:hidden">
        <Carousel setApi={setApi} opts={{ align: "start", loop: false }}>
          <CarouselContent className="-ml-4">
            {routines.map((routine, i) => (
              <CarouselItem key={routine.slug} className="basis-[82%] pl-4">
                {renderCard(routine, i)}
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {scrollSnaps.length > 1 && (
          <div className="mt-4 flex items-center justify-center gap-2">
            {scrollSnaps.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => api?.scrollTo(i)}
                aria-label={`Ir a la rutina ${i + 1}`}
                className={`h-2 rounded-pill transition-all duration-300 ease-out-strong ${
                  i === selected ? "w-6 bg-blush-500" : "w-2 bg-blush-200 hover:bg-blush-300"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Desktop / tablet: grid */}
      <div key={`grid-${climate}`} className="mt-5 hidden grid-cols-2 gap-4 sm:grid xl:grid-cols-4">
        {routines.map((routine, i) => (
          <div key={routine.slug}>{renderCard(routine, i)}</div>
        ))}
      </div>
    </div>
  );
}
