"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowRightIcon, PlayIcon, TikTokIcon } from "@/components/icons";
import { formatCOP } from "@/lib/format";
import type { Product } from "@/lib/types";

export type TikTokVideo = { product: Product; video: string };

const TONE_RING: Record<string, string> = {
  blush: "bg-blush-100",
  mint: "bg-mint-100",
  peach: "bg-peach-100",
  lavender: "bg-lavender-100",
};

// Desfase vertical y giro de cada tarjeta para que no se vea como cuadrícula.
const LAYOUT = [
  "lg:mt-0 lg:-rotate-2",
  "lg:mt-16 lg:rotate-2",
  "lg:mt-4 lg:-rotate-1",
  "lg:mt-20 lg:rotate-3",
];

export function TikTokVideosSection({ items }: { items: TikTokVideo[] }) {
  const [playing, setPlaying] = useState<number | null>(null);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);

  function play(i: number) {
    videos.current.forEach((v, j) => j !== i && v?.pause());
    videos.current[i]?.play();
  }

  return (
    <div className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-6 pt-2 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-8 lg:overflow-visible lg:px-0">
      {items.map(({ product, video }, i) => (
        <div
          key={product.slug}
          className={`w-[70%] shrink-0 snap-center transition-transform duration-300 ease-out-strong sm:w-[42%] lg:hover:rotate-0 lg:w-auto ${LAYOUT[i % LAYOUT.length]}`}
        >
          <div className={`rounded-[2rem] p-2 shadow-card ${TONE_RING[product.tone] ?? "bg-blush-100"}`}>
            <div className="relative aspect-[9/16] overflow-hidden rounded-[1.6rem] bg-ink">
              {video ? (
                <video
                  ref={(el) => {
                    videos.current[i] = el;
                  }}
                  src={video}
                  poster={product.images[0]}
                  controls={playing === i}
                  playsInline
                  preload="metadata"
                  onPlay={() => setPlaying(i)}
                  onPause={() => setPlaying((p) => (p === i ? null : p))}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                product.images[0] && (
                  <img src={product.images[0]} alt={product.name} className="absolute inset-0 h-full w-full object-cover opacity-90" />
                )
              )}

              {playing !== i && (
                <>
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/45" />
                  <span className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-pill bg-black/55 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur-sm">
                    <TikTokIcon className="h-3.5 w-3.5" /> #{i + 1} en tendencia
                  </span>
                  {video ? (
                    <button
                      type="button"
                      onClick={() => play(i)}
                      aria-label={`Reproducir video de ${product.name}`}
                      className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-blush-600 shadow-soft transition-transform duration-200 ease-out-strong hover:scale-110 active:scale-95"
                    >
                      <PlayIcon className="ml-1 h-6 w-6" />
                    </button>
                  ) : (
                    <span className="pointer-events-none absolute inset-x-3 bottom-3 rounded-pill bg-white/90 px-3 py-1.5 text-center text-xs font-semibold text-ink/70">
                      Video próximamente
                    </span>
                  )}
                </>
              )}
            </div>
          </div>

          <Link
            href={`/producto/${product.slug}`}
            className="group mt-4 flex items-center gap-3 rounded-2xl bg-white p-2.5 pr-4 shadow-soft ring-1 ring-border/60 transition-transform duration-200 ease-out-strong hover:-translate-y-0.5"
          >
            {product.images[0] && (
              <img src={product.images[0]} alt="" className="h-12 w-12 shrink-0 rounded-xl object-cover" />
            )}
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-ink">{product.name}</span>
              <span className="text-sm font-bold text-blush-600">{formatCOP(product.price)}</span>
            </span>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blush-50 text-blush-600 transition-colors group-hover:bg-blush-500 group-hover:text-white">
              <ArrowRightIcon className="h-4 w-4" />
            </span>
          </Link>
        </div>
      ))}
    </div>
  );
}
