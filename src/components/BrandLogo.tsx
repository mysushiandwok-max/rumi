"use client";

import { useState } from "react";
import type { Brand } from "@/lib/types";

export function BrandLogo({
  brand,
  className = "max-h-8 w-auto max-w-[75%] object-contain sm:max-h-10",
  fallbackClassName = "font-display text-base font-bold text-ink",
}: {
  brand: Brand;
  className?: string;
  fallbackClassName?: string;
}) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return <span className={fallbackClassName}>{brand.name}</span>;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/uploads/logos/${brand.slug}.svg`}
      alt={brand.name}
      loading="lazy"
      decoding="async"
      onError={() => setErrored(true)}
      className={className}
    />
  );
}
