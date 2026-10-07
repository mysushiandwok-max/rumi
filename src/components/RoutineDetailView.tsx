"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductArt } from "@/components/illustrations/ProductArt";
import { PastelDoodles } from "@/components/category/PastelDoodles";
import { ROUTINE_COLLECTIONS } from "@/components/routines/collections";
import { RoutineCard } from "@/components/routines/RoutineCard";
import { RoutineReviews, Stars } from "@/components/routines/RoutineReviews";
import { Reveal } from "@/components/category/Reveal";
import { PolaroidStack, type PolaroidItem } from "@/components/routines/PolaroidStack";
import { ArrowRightIcon, BagIcon, CheckIcon, StarIcon } from "@/components/icons";
import { useCart } from "@/lib/cart-context";
import { formatCOP } from "@/lib/format";
import type { Product, Routine, RoutineRatingSummary, RoutineReview, RoutineStep } from "@/lib/types";

const PRODUCT_TONE_BG: Record<string, string> = {
  blush: "bg-blush-50",
  mint: "bg-mint-50",
  peach: "bg-peach-50",
  lavender: "bg-lavender-50",
};

// Botón de compra individual: sólido y con etiqueta para que se note. Al añadir, el fondo pasa al color de la
// colección de la rutina (el mismo de los números de paso, para que combine con la ficha) y
// bolsa→check y "Agregar"→"Agregado" se cruzan con un leve blur (las dos etiquetas ocupan la misma celda
// de grid, así el ancho del botón no salta). Mismos 1.4s de confirmación que ProductCard.
function AddToCartButton({ product, addedClass }: { product: Product; addedClass: string }) {
  const { addItem, markAdded, openCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  function handleAdd() {
    addItem(product.slug, 1);
    markAdded(product.slug);
    openCart();
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1400);
  }

  const swap = "transition-[opacity,transform,filter] duration-200 ease-out-strong";
  const shown = "opacity-100 scale-100 blur-0";
  const hidden = "opacity-0 scale-75 blur-[2px]";

  return (
    <button
      type="button"
      onClick={handleAdd}
      aria-label={`Agregar ${product.name} al carrito`}
      className={`flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded-pill px-6 font-display text-sm font-bold text-white transition-[background-color,box-shadow,transform] duration-200 ease-out-strong active:scale-[0.97] sm:w-auto ${
        justAdded
          ? `${addedClass} shadow-card`
          : "bg-blush-500 shadow-pop can-hover:hover:-translate-y-0.5 can-hover:hover:bg-blush-600 can-hover:hover:shadow-[0_12px_24px_-10px_rgba(214,76,116,0.6)]"
      }`}
    >
      <span className="relative flex h-[18px] w-[18px] items-center justify-center">
        <BagIcon className={`absolute h-[18px] w-[18px] ${swap} ${justAdded ? hidden : shown}`} />
        <CheckIcon className={`absolute h-[18px] w-[18px] ${swap} ${justAdded ? shown : hidden}`} />
      </span>
      <span className="grid">
        <span aria-hidden={justAdded} className={`[grid-area:1/1] ${swap} ${justAdded ? hidden : shown}`}>
          Agregar
        </span>
        <span aria-hidden={!justAdded} className={`[grid-area:1/1] ${swap} ${justAdded ? shown : hidden}`}>
          Agregado
        </span>
      </span>
    </button>
  );
}

// Tarjeta para ir a la rutina anterior o siguiente, con los colores de la colección de esa rutina.
function RoutineNavLink({ routine, direction }: { routine: Routine; direction: "previous" | "next" }) {
  const styles = ROUTINE_COLLECTIONS[routine.collection];
  const Icon = styles.icon;
  const isNext = direction === "next";

  return (
    <Link
      href={`/rutinas/${routine.slug}`}
      className={`group relative isolate flex items-center gap-4 overflow-hidden rounded-[1.75rem] p-5 ring-1 transition-[transform,box-shadow] duration-200 ease-out-strong active:scale-[0.98] can-hover:hover:-translate-y-1 can-hover:hover:shadow-card sm:p-6 ${styles.card} ${
        isNext ? "flex-row-reverse text-right" : ""
      }`}
    >
      {/* Ícono de la colección grande y suave en la esquina opuesta a la flecha */}
      <Icon
        aria-hidden="true"
        className={`pointer-events-none absolute -bottom-5 -z-10 h-24 w-24 opacity-50 transition-transform duration-500 ease-out-strong can-hover:group-hover:rotate-12 ${styles.doodle} ${
          isNext ? "-left-4 -rotate-12" : "-right-4 rotate-12"
        }`}
      />

      <span
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full shadow-sm transition-transform duration-200 ease-out-strong ${styles.solid} ${
          isNext ? "can-hover:group-hover:translate-x-1" : "can-hover:group-hover:-translate-x-1"
        }`}
      >
        <ArrowRightIcon className={`h-5 w-5 ${isNext ? "" : "rotate-180"}`} />
      </span>

      <div className="min-w-0 flex-1">
        <p className={`text-xs font-bold uppercase tracking-wide ${styles.text}`}>
          {isNext ? "Siguiente rutina" : "Rutina anterior"}
        </p>
        <p className="mt-1 truncate font-display text-lg font-bold text-ink sm:text-xl">{routine.name}</p>
        <p className="mt-0.5 truncate text-sm text-ink/60">
          {styles.label} · {routine.steps.length} pasos
        </p>
      </div>
    </Link>
  );
}

export function RoutineDetailView({
  routine,
  stepsWithProducts,
  previous,
  next,
  reviews,
  ratingSummary,
  suggestions,
}: {
  routine: Routine;
  previous: Routine;
  next: Routine;
  reviews: RoutineReview[];
  ratingSummary: RoutineRatingSummary;
  // Rutinas parecidas, con los productos de su collage ya resueltos en el servidor.
  suggestions: { routine: Routine; previewProducts: Product[] }[];
  stepsWithProducts: {
    step: RoutineStep;
    product: Product | undefined;
    brandName?: string;
  }[];
}) {
  const { addItem, markAdded, openCart } = useCart();
  // Mismos colores que la tarjeta de la rutina en /rutinas (los de su colección).
  const styles = ROUTINE_COLLECTIONS[routine.collection];
  const [bundleAdded, setBundleAdded] = useState(false);

  // Un polaroid por producto con foto (sin repetir), con el nombre del paso como pie de foto.
  const polaroids: PolaroidItem[] = [];
  for (const { step, product } of stepsWithProducts) {
    if (product?.images[0] && !polaroids.some((item) => item.product.slug === product.slug)) {
      polaroids.push({ product, caption: step.title });
    }
  }

  const total = stepsWithProducts.reduce((sum, { product }) => sum + (product?.price ?? 0), 0);

  function addRoutineToCart() {
    const slugs = stepsWithProducts.flatMap(({ product }) => (product ? [product.slug] : []));
    slugs.forEach((slug) => addItem(slug, 1));
    // El carrito se abre y muestra los productos entrando uno tras otro (reemplaza el toast de antes).
    markAdded([...new Set(slugs)]);
    openCart();
    setBundleAdded(true);
    window.setTimeout(() => setBundleAdded(false), 1600);
  }

  return (
    <div className="container-page py-10 sm:py-14">
      <Breadcrumbs items={[{ label: "Rutinas", href: "/rutinas" }, { label: routine.name }]} />

      <div
        className={`relative isolate overflow-hidden rounded-[2rem] ${styles.heroSurface} px-8 py-12 sm:px-12 sm:py-16`}
      >
        <PastelDoodles colors={styles.heroDoodles} sparkles={false} />

        <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:gap-12">
          <div>
            <span className={`pill-badge bg-white/75 ${styles.text}`}>{routine.skinConcern}</span>
            <h1 className="mt-3 font-display text-3xl font-bold text-ink sm:text-4xl">{routine.name}</h1>
            <p className={`mt-1.5 font-display text-lg ${styles.text}`}>{routine.tagline}</p>
            {ratingSummary.count > 0 && (
              <a
                href="#resenas"
                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-ink/70 transition-colors duration-150 can-hover:hover:text-ink"
              >
                <Stars value={ratingSummary.average} />
                {ratingSummary.average.toFixed(1)} · {ratingSummary.count}{" "}
                {ratingSummary.count === 1 ? "reseña" : "reseñas"}
              </a>
            )}
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink/65 sm:text-base">{routine.description}</p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button type="button" onClick={addRoutineToCart} className="btn-primary px-6 py-3.5 text-sm sm:text-base">
                <span className="relative flex h-4 w-4 items-center justify-center">
                  <BagIcon
                    className={`absolute h-4 w-4 transition-all duration-200 ease-out-strong ${
                      bundleAdded ? "scale-50 rotate-45 opacity-0" : "scale-100 rotate-0 opacity-100"
                    }`}
                  />
                  <CheckIcon
                    className={`absolute h-4 w-4 transition-all duration-200 ease-out-strong ${
                      bundleAdded ? "scale-100 opacity-100" : "scale-50 opacity-0"
                    }`}
                  />
                </span>
                Añadir rutina completa
              </button>
              <span className="text-sm text-ink/60">
                {stepsWithProducts.length} productos · <span className="font-bold text-ink">{formatCOP(total)}</span>
              </span>
            </div>
          </div>

          {polaroids.length > 0 && <PolaroidStack items={polaroids} collection={routine.collection} />}
        </div>
      </div>

      <ol className="mt-12 flex flex-col gap-6">
        {stepsWithProducts.map(({ step, product, brandName }, index) => (
          <li
            key={step.step}
            style={{ animationDelay: `${Math.min(index, 5) * 70}ms` }}
            className="relative grid animate-fade-up-fast gap-5 rounded-[1.75rem] bg-white p-4 shadow-card ring-1 ring-border/50 sm:p-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,9fr)] lg:items-center lg:gap-10 lg:p-7"
          >
            {/* Conector entre pasos, en el hueco que hay entre tarjeta y tarjeta */}
            {index < stepsWithProducts.length - 1 && (
              <span
                aria-hidden="true"
                className={`absolute left-[2.35rem] top-full h-6 w-0.5 rounded-full opacity-40 sm:left-[2.85rem] lg:left-[3.1rem] ${styles.solid}`}
              />
            )}

            <div className="flex items-start gap-4">
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-display text-base font-bold text-white shadow-sm ${styles.solid}`}
              >
                {step.step}
              </span>
              <div className="pt-0.5">
                <p className={`text-xs font-bold uppercase tracking-wide ${styles.text}`}>Paso {step.step}</p>
                <h3 className="mt-0.5 font-display text-lg font-bold text-ink sm:text-xl">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink/60">{step.description}</p>
              </div>
            </div>

            {product ? (
              <div
                className={`group/product flex flex-col gap-4 rounded-[1.5rem] p-3 sm:flex-row sm:items-center sm:p-4 ${styles.surface}`}
              >
                <Link href={`/producto/${product.slug}`} className="flex min-w-0 flex-1 items-center gap-4 sm:gap-5">
                  <div
                    className={`relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-white sm:h-32 sm:w-32 lg:h-36 lg:w-36 ${PRODUCT_TONE_BG[product.tone]}`}
                  >
                    {product.images[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="(min-width: 1024px) 144px, (min-width: 640px) 128px, 96px"
                        className="object-cover transition-transform duration-500 ease-out-strong can-hover:group-hover/product:scale-[1.06]"
                      />
                    ) : (
                      <ProductArt
                        variant={product.artVariant}
                        tone={product.tone}
                        label={product.name}
                        className="h-full w-full p-3"
                      />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    {brandName && (
                      <p className="text-xs font-semibold uppercase tracking-wide text-ink/45">{brandName}</p>
                    )}
                    <p className="mt-0.5 line-clamp-2 font-display text-base font-bold leading-snug text-ink transition-colors duration-150 can-hover:group-hover/product:text-blush-600 sm:text-lg">
                      {product.name}
                    </p>
                    <p className="mt-1 hidden line-clamp-2 text-sm text-ink/60 sm:block">{product.shortDescription}</p>
                    <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      <span className="font-display text-lg font-bold text-blush-600 sm:text-xl">
                        {formatCOP(product.price)}
                      </span>
                      {product.compareAtPrice && product.compareAtPrice > product.price && (
                        <span className="text-sm text-ink/40 line-through">{formatCOP(product.compareAtPrice)}</span>
                      )}
                      {product.reviewCount > 0 && (
                        <span className="flex items-center gap-1 text-xs font-semibold text-ink/55">
                          <StarIcon className="h-3.5 w-3.5 fill-peach-400 text-peach-400" />
                          {product.rating.toFixed(1)}
                        </span>
                      )}
                    </div>
                    <span className="mt-2 hidden items-center gap-1 text-xs font-semibold text-ink/50 sm:inline-flex">
                      Ver producto
                      <ArrowRightIcon className="h-3 w-3 transition-transform duration-150 ease-out-strong can-hover:group-hover/product:translate-x-0.5" />
                    </span>
                  </div>
                </Link>

                <AddToCartButton product={product} addedClass={styles.solid} />
              </div>
            ) : null}
          </li>
        ))}
      </ol>

      <RoutineReviews
        routineSlug={routine.slug}
        collection={routine.collection}
        reviews={reviews}
        summary={ratingSummary}
      />

      {suggestions.length > 0 && (
        <section aria-labelledby="sugeridas-title" className="mt-16">
          <h2 id="sugeridas-title" className="font-display text-2xl font-bold text-ink sm:text-3xl">
            Rutinas que también te pueden gustar
          </h2>
          <p className="mt-1 text-sm text-ink/60">Elegidas por tipo de piel, colección y momento del día parecidos.</p>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {suggestions.map(({ routine: suggested, previewProducts }, index) => (
              <Reveal key={suggested.slug} delay={index * 70} className="h-full">
                <RoutineCard routine={suggested} previewProducts={previewProducts} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <nav aria-label="Otras rutinas" className="mt-16 grid gap-4 sm:grid-cols-2 sm:gap-6">
        <RoutineNavLink routine={previous} direction="previous" />
        <RoutineNavLink routine={next} direction="next" />
      </nav>
    </div>
  );
}
