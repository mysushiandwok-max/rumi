"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatCOP } from "@/lib/format";
import { ProductArt } from "@/components/illustrations/ProductArt";
import { BagIcon, CheckIcon, CloseIcon, MinusIcon, PlusIcon } from "@/components/icons";

export function CartDrawer() {
  const [mounted, setMounted] = useState(false);
  const {
    lines,
    itemCount,
    subtotal,
    setQuantity,
    removeItem,
    isReady,
    getProduct,
    isOpen: open,
    openCart,
    closeCart,
    revealFrom,
    lastAdded,
    addedNonce,
    addedAt,
  } = useCart();
  const asideRef = useRef<HTMLElement>(null);

  // Apertura "revelada": el panel ya está en su sitio y un círculo crece desde el botón que lo abrió.
  // Antes del primer pintado, así nunca se ve el panel completo ni el deslizamiento normal.
  useLayoutEffect(() => {
    const aside = asideRef.current;
    if (!open || !revealFrom || !aside) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const width = aside.offsetWidth;
    const height = window.innerHeight;
    const x = revealFrom.x - (window.innerWidth - width);
    const y = revealFrom.y;
    const radius = Math.hypot(Math.max(x, width - x), Math.max(y, height - y));
    const animation = aside.animate(
      [
        { clipPath: `circle(0px at ${x}px ${y}px)` },
        { clipPath: `circle(${radius}px at ${x}px ${y}px)` },
      ],
      { duration: 680, easing: "cubic-bezier(0.65, 0, 0.25, 1)" }
    );
    return () => animation.cancel();
  }, [open, revealFrom]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- portal target (document.body) only exists client-side; flips once after hydration
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    document.addEventListener("keydown", onKey);
    // Al bloquear el scroll desaparece la barra y la página saltaría a la derecha: se compensa su ancho.
    const previousOverflow = document.body.style.overflow;
    const previousPadding = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => openCart()}
        aria-label="Abrir carrito"
        className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink transition-transform duration-150 ease-out-strong hover:bg-blush-50 active:scale-90"
      >
        {/* La key cambia con cada agregado, así la animación se repite aunque ya hubiera algo en el carrito */}
        <BagIcon key={`bag-${addedNonce}`} className={`h-5 w-5 ${addedNonce > 0 ? "animate-bag-bump" : ""}`} />
        {isReady && itemCount > 0 && (
          <span
            key={`count-${itemCount}`}
            className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 animate-pop-in items-center justify-center rounded-full bg-blush-500 px-1 text-[11px] font-bold text-white"
          >
            {itemCount}
          </span>
        )}
      </button>

      {mounted &&
        createPortal(
          <>
            <div
              // El fondo acompaña al panel: aparece con él y se va un poco antes.
              className={`fixed inset-0 z-[70] bg-ink/35 backdrop-blur-[2px] transition-opacity ease-out ${
                open ? "opacity-100 [transition-duration:400ms]" : "pointer-events-none opacity-0 [transition-duration:260ms]"
              }`}
              onClick={() => closeCart()}
              aria-hidden="true"
            />

            <aside
        ref={asideRef}
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
        // Curva tipo iOS (ease-drawer): responde al instante y se asienta suave. Sale más rápido de lo que entra.
        className={`fixed inset-y-0 right-0 z-[80] flex w-full max-w-md flex-col bg-cream shadow-soft transition-transform ease-drawer ${
          open
            ? `translate-x-0 ${revealFrom ? "[transition-duration:0ms]" : "[transition-duration:480ms]"}`
            : "translate-x-full [transition-duration:320ms]"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <div>
            <h2 className="font-display text-lg font-bold text-ink">Tu carrito</h2>
            <p
              aria-live="polite"
              className={`flex items-center gap-1 text-xs font-semibold text-blush-600 transition-[opacity,transform] duration-300 ease-out-strong ${
                lastAdded.length > 0 ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0"
              }`}
            >
              <CheckIcon className="h-3 w-3" />
              {lastAdded.length > 1 ? `${lastAdded.length} productos agregados` : "Producto agregado"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => closeCart()}
            aria-label="Cerrar carrito"
            className="flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-150 ease-out-strong hover:bg-blush-50 active:scale-90"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blush-50">
              <BagIcon className="h-7 w-7 text-blush-400" />
            </div>
            <p className="font-display text-base font-semibold text-ink">Tu carrito está vacío</p>
            <p className="text-sm text-ink/60">Descubre nuestros productos más amados.</p>
            <Link href="/tienda" onClick={() => closeCart()} className="btn-primary mt-2 px-5 py-2.5 text-sm">
              Ir a la tienda
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto px-6 py-4">
              {lines.map((line) => {
                const product = getProduct(line.productSlug);
                if (!product) return null;
                const addedIndex = lastAdded.indexOf(line.productSlug);
                const justAdded = addedIndex !== -1;
                return (
                  <li
                    // Cada vez que se agrega, la key cambia y el <li> se vuelve a montar para repetir la entrada
                    // (y no cambia al terminar, así el fondo rosado se desvanece en vez de cortarse).
                    key={`${line.productSlug}-${addedAt[line.productSlug] ?? 0}`}
                    // Espera a que el drawer vaya entrando y, con la rutina completa, entra uno tras otro.
                    style={justAdded ? { animationDelay: `${180 + addedIndex * 60}ms` } : undefined}
                    className={`flex gap-4 rounded-xl2 border-b border-border/70 px-2 py-4 -mx-2 transition-colors [transition-duration:1400ms] ease-out last:border-0 ${
                      justAdded ? "animate-cart-line-in bg-blush-50/80" : "bg-transparent"
                    }`}
                  >
                    <div data-cart-thumb={line.productSlug} className="h-20 w-20 shrink-0 overflow-hidden rounded-xl2 bg-blush-50">
                      {product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ProductArt
                          variant={product.artVariant}
                          tone={product.tone}
                          label={product.name}
                          className="h-full w-full p-2"
                        />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="line-clamp-1 font-display text-sm font-bold text-ink">{product.name}</p>
                          <span
                            className={`inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-pill bg-blush-100 px-2 py-0.5 text-[10px] font-bold text-blush-700 transition-[opacity,transform] duration-300 ease-out-strong ${
                              justAdded ? "scale-100 opacity-100" : "scale-90 opacity-0"
                            }`}
                          >
                            <CheckIcon className="h-2.5 w-2.5" /> Agregado
                          </span>
                        </div>
                        <p className="text-xs text-ink/50">{product.size}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 rounded-pill border border-border px-1.5 py-1">
                          <button
                            type="button"
                            onClick={() => setQuantity(line.productSlug, line.quantity - 1)}
                            aria-label="Reducir cantidad"
                            className="flex h-5 w-5 items-center justify-center rounded-full transition-transform duration-150 ease-out-strong active:scale-90"
                          >
                            <MinusIcon className="h-3 w-3" />
                          </button>
                          <span className="w-4 text-center text-xs font-semibold">{line.quantity}</span>
                          <button
                            type="button"
                            onClick={() => setQuantity(line.productSlug, line.quantity + 1)}
                            aria-label="Aumentar cantidad"
                            className="flex h-5 w-5 items-center justify-center rounded-full transition-transform duration-150 ease-out-strong active:scale-90"
                          >
                            <PlusIcon className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="text-sm font-bold text-ink">
                          {formatCOP(product.price * line.quantity)}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(line.productSlug)}
                      aria-label={`Quitar ${product.name} del carrito`}
                      className="self-start text-ink/40 transition-colors hover:text-blush-600"
                    >
                      <CloseIcon className="h-4 w-4" />
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="border-t border-border px-6 py-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-ink/60">Subtotal</span>
                <span className="font-display text-lg font-bold text-ink">{formatCOP(subtotal)}</span>
              </div>
              <div className="flex flex-col gap-2.5">
                <Link href="/checkout" onClick={() => closeCart()} className="btn-primary w-full py-3 text-sm">
                  Finalizar compra
                </Link>
                <Link
                  href="/carrito"
                  onClick={() => closeCart()}
                  className="btn-secondary w-full py-3 text-sm"
                >
                  Ver carrito completo
                </Link>
              </div>
            </div>
          </>
        )}
            </aside>
          </>,
          document.body
        )}
    </>
  );
}
