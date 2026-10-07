"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ProductArt } from "@/components/illustrations/ProductArt";
import { RatingStars } from "@/components/RatingStars";
import { QuantityStepper } from "@/components/QuantityStepper";
import { AccordionItem } from "@/components/Accordion";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CheckIcon, HeartIcon, BagIcon, TruckIcon, ShieldIcon, BoxIcon, RefreshIcon, HourglassIcon } from "@/components/icons";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { formatCOP } from "@/lib/format";
import { flyToCart } from "@/lib/fly-to-cart";
import type { Brand, Category, Product } from "@/lib/types";

const TONE_BG: Record<string, string> = {
  blush: "bg-blush-50",
  mint: "bg-mint-50",
  peach: "bg-peach-50",
  lavender: "bg-lavender-50",
};

// Solo promesas que ya están respaldadas por las políticas publicadas (envíos, pagos con Bold, retracto).
const GUARANTEES = [
  { icon: TruckIcon, title: "Envío gratis", text: "En compras desde $150.000" },
  { icon: BoxIcon, title: "Despacho rápido", text: "Preparamos tu pedido en 1-2 días hábiles" },
  { icon: ShieldIcon, title: "Pago seguro", text: "Tarjeta, PSE, Nequi y Bancolombia" },
  { icon: RefreshIcon, title: "Cambios y devoluciones", text: "Conoce nuestra política", href: "/legal/cambios-y-devoluciones" },
];

export function ProductDetailView({
  product,
  brand,
  category,
}: {
  product: Product;
  brand?: Brand;
  category?: Category;
}) {
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const buyRowRef = useRef<HTMLDivElement>(null);
  const stickyThumbRef = useRef<HTMLDivElement>(null);
  const { addItem, markAdded, openCart } = useCart();
  const { toggle, has } = useWishlist();
  const saved = has(product.slug);
  const soldOut = product.stock <= 0;
  const lowStock = !soldOut && product.stock <= product.lowStockThreshold;
  const discount = product.compareAtPrice
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : 0;

  // La barra fija aparece cuando el botón principal sale de pantalla por arriba.
  useEffect(() => {
    const target = buyRowRef.current;
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) =>
      setShowStickyBar(!entry.isIntersecting && entry.boundingClientRect.top < 0)
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  // El carrito se abre como un círculo desde el botón tocado y la foto vuela hasta su lugar en él.
  // Desde la barra fija la foto sale de su miniatura (oculta en móvil: ahí sale del botón).
  function addToCart(event: React.MouseEvent<HTMLButtonElement>, source?: HTMLElement | null) {
    const button = event.currentTarget.getBoundingClientRect();
    addItem(product.slug, quantity);
    markAdded(product.slug);
    openCart({ x: button.left + button.width / 2, y: button.top + button.height / 2 });
    const from = source && source.offsetWidth > 0 ? source : event.currentTarget;
    if (product.images[0]) flyToCart(from, product.images[0], product.slug);
  }

  return (
    <div className="container-page pt-10 sm:pt-14">
      <Breadcrumbs
        items={[
          { label: "Tienda", href: "/tienda" },
          ...(category ? [{ label: category.name, href: `/categoria/${category.slug}` }] : []),
          { label: product.name },
        ]}
      />

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className={`relative flex aspect-square items-center justify-center overflow-hidden rounded-[2rem] ${TONE_BG[product.tone]}`}>
            {product.badge && (
              <span className="pill-badge absolute left-5 top-5 z-10 bg-mint-100 text-mint-700">{product.badge}</span>
            )}
            {discount > 0 && (
              <span className="pill-badge absolute right-5 top-5 z-10 bg-blush-500 text-white">-{discount}%</span>
            )}
            {product.images.length > 0 ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.images[activeImage] ?? product.images[0]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <ProductArt
                variant={product.artVariant}
                tone={product.tone}
                label={product.name}
                className="h-3/4 w-auto drop-shadow-[0_24px_28px_rgba(43,35,32,0.14)]"
              />
            )}
          </div>
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  aria-label={`Ver imagen ${i + 1}`}
                  aria-pressed={activeImage === i}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl2 border-2 transition-colors sm:h-20 sm:w-20 ${
                    activeImage === i ? "border-blush-400" : "border-transparent"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          {brand && (
            <Link
              href={`/marcas/${brand.slug}`}
              className="text-sm font-semibold uppercase tracking-wide text-blush-600 hover:text-blush-700"
            >
              {brand.name}
            </Link>
          )}
          <h1 className="mt-2 font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">{product.name}</h1>
          <div className="mt-3 flex items-center gap-3">
            {product.reviewCount > 0 ? (
              <a href="#resenas" className="hover:opacity-80">
                <RatingStars rating={product.rating} reviewCount={product.reviewCount} size="md" />
              </a>
            ) : (
              <RatingStars rating={product.rating} reviewCount={product.reviewCount} size="md" />
            )}
            <span className="text-sm text-ink/40">·</span>
            <span className="text-sm text-ink/60">{product.size}</span>
          </div>

          <div className="mt-5 flex flex-wrap items-baseline gap-3">
            <span className="font-display text-3xl font-bold text-ink">{formatCOP(product.price)}</span>
            {product.compareAtPrice && (
              <>
                <span className="text-base text-ink/40 line-through">{formatCOP(product.compareAtPrice)}</span>
                <span className="text-sm font-semibold text-blush-600">
                  Ahorras {formatCOP(product.compareAtPrice - product.price)}
                </span>
              </>
            )}
          </div>

          <p className="mt-5 text-base leading-relaxed text-ink/70">{product.shortDescription}</p>

          {product.landing.benefits.length > 0 && (
            <ul className="mt-5 flex flex-col gap-2">
              {product.landing.benefits.map((benefit) => (
                <li key={benefit.title} className="flex items-center gap-2.5 text-sm font-semibold text-ink/80">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-mint-100 text-mint-700">
                    <CheckIcon className="h-3 w-3" />
                  </span>
                  {benefit.title}
                </li>
              ))}
            </ul>
          )}

          {product.skinTypes.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {product.skinTypes.map((type) => (
                <span key={type} className="rounded-pill bg-blush-50 px-3 py-1.5 text-xs font-semibold text-blush-700">
                  {type}
                </span>
              ))}
            </div>
          )}

          {(soldOut || lowStock) && (
            <p
              className={`mt-6 inline-flex items-center gap-2 rounded-pill px-4 py-2 text-sm font-semibold ${
                soldOut ? "bg-ink/5 text-ink/60" : "bg-peach-50 text-peach-600"
              }`}
            >
              <HourglassIcon className="h-4 w-4" />
              {soldOut
                ? "Agotado por ahora"
                : product.stock === 1
                  ? "¡Queda la última unidad!"
                  : `¡Solo quedan ${product.stock} unidades!`}
            </p>
          )}

          <div ref={buyRowRef} id="comprar" className="mt-6 flex scroll-mt-40 items-center gap-2 sm:gap-3">
            <QuantityStepper value={quantity} onChange={setQuantity} />
            <button
              type="button"
              onClick={addToCart}
              disabled={soldOut}
              className="btn-primary flex-1 whitespace-nowrap px-5 py-3.5 text-sm disabled:pointer-events-none disabled:opacity-50 sm:flex-none sm:px-6 sm:text-base"
            >
              <BagIcon className="h-4 w-4" />
              {soldOut ? "Agotado" : "Añadir al carrito"}
            </button>
            <button
              type="button"
              aria-pressed={saved}
              aria-label={saved ? "Quitar de favoritos" : "Guardar en favoritos"}
              onClick={() => toggle(product.slug)}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border transition-transform duration-150 ease-out-strong hover:border-blush-300 active:scale-90"
            >
              <HeartIcon className={`h-5 w-5 ${saved ? "fill-blush-500 text-blush-500" : "text-ink/60"}`} />
            </button>
          </div>

          <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-5 rounded-xl2 bg-blush-50/70 p-5">
            {GUARANTEES.map(({ icon: Icon, title, text, href }) => (
              <li key={title} className="flex items-start gap-2.5">
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-blush-500" />
                <span className="text-xs leading-snug">
                  <span className="block font-bold text-ink">{title}</span>
                  {href ? (
                    <Link href={href} className="text-ink/60 underline decoration-ink/20 underline-offset-2 hover:text-blush-600">
                      {text}
                    </Link>
                  ) : (
                    <span className="text-ink/60">{text}</span>
                  )}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <AccordionItem title="Descripción" defaultOpen>
              {product.description}
            </AccordionItem>
            {product.ingredients && (
              <AccordionItem title="Ingredientes completos">{product.ingredients}</AccordionItem>
            )}
          </div>
        </div>
      </div>

      <div
        aria-hidden={!showStickyBar}
        inert={!showStickyBar}
        className={`fixed inset-x-0 bottom-0 z-40 transition-[transform,opacity] duration-300 ease-out-strong lg:inset-x-auto lg:bottom-6 lg:left-1/2 lg:w-[min(640px,calc(100%-12rem))] lg:-translate-x-1/2 ${
          showStickyBar ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0 lg:translate-y-[150%]"
        }`}
      >
        <div className="flex items-center gap-3 border-t border-border bg-white/95 px-4 py-3 shadow-card backdrop-blur-md lg:rounded-pill lg:border lg:py-2.5 lg:pl-2.5 lg:pr-2.5">
          <div ref={stickyThumbRef} className={`hidden h-11 w-11 shrink-0 overflow-hidden rounded-full sm:block ${TONE_BG[product.tone]}`}>
            {product.images[0] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.images[0]} alt="" className="h-full w-full object-cover" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-ink">{product.name}</p>
            <p className="text-sm text-ink/60">
              <span className="font-semibold text-ink">{formatCOP(product.price)}</span>
              {product.compareAtPrice && <span className="ml-2 text-xs line-through">{formatCOP(product.compareAtPrice)}</span>}
            </p>
          </div>
          <button
            type="button"
            onClick={(e) => addToCart(e, stickyThumbRef.current)}
            disabled={soldOut}
            className="btn-primary shrink-0 px-5 py-3 text-sm disabled:pointer-events-none disabled:opacity-50"
          >
            <BagIcon className="h-4 w-4" />
            {soldOut ? "Agotado" : "Añadir"}
          </button>
        </div>
      </div>
    </div>
  );
}
