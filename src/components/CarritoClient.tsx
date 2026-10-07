"use client";

import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { QuantityStepper } from "@/components/QuantityStepper";
import { ProductArt } from "@/components/illustrations/ProductArt";
import { BagIcon, CloseIcon, ArrowRightIcon, TruckIcon, CheckIcon } from "@/components/icons";
import { useCart } from "@/lib/cart-context";
import { formatCOP } from "@/lib/format";

export function CarritoClient({ freeShippingThreshold }: { freeShippingThreshold: number }) {
  const { lines, setQuantity, removeItem, subtotal, isReady, getProduct } = useCart();
  const remaining = Math.max(0, freeShippingThreshold - subtotal);
  const progress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  if (isReady && lines.length === 0) {
    return (
      <div className="container-page flex flex-col items-center gap-4 py-24 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blush-50">
          <BagIcon className="h-9 w-9 text-blush-400" />
        </div>
        <h1 className="font-display text-2xl font-bold text-ink">Tu carrito está vacío</h1>
        <p className="max-w-sm text-sm text-ink/60">
          Explora la tienda y encuentra tu próximo producto favorito de skincare coreano.
        </p>
        <Link href="/tienda" className="btn-primary mt-2 px-6 py-3 text-sm">
          Ir a la tienda
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-10 sm:py-14">
      <Breadcrumbs items={[{ label: "Carrito" }]} />
      <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">Tu carrito</h1>

      <div className="mt-8 rounded-xl2 bg-blush-50/70 p-4">
        {remaining > 0 ? (
          <p className="flex items-center gap-2 text-sm font-semibold text-blush-700">
            <TruckIcon className="h-4 w-4" />
            Te faltan {formatCOP(remaining)} para envío gratis
          </p>
        ) : (
          <p className="flex items-center gap-2 text-sm font-semibold text-mint-700">
            <CheckIcon className="h-4 w-4" />
            ¡Tu pedido tiene envío gratis!
          </p>
        )}
        <div className="mt-2.5 h-2 w-full overflow-hidden rounded-pill bg-white">
          <div
            className="h-full rounded-pill bg-blush-500 transition-[width] duration-500 ease-out-strong"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
        <ul className="flex flex-col">
          {lines.map((line) => {
            const product = getProduct(line.productSlug);
            if (!product) return null;
            return (
              <li
                key={line.productSlug}
                className="flex flex-col gap-4 border-b border-border/70 py-6 sm:flex-row sm:items-center"
              >
                <Link
                  href={`/producto/${product.slug}`}
                  className="h-24 w-24 shrink-0 overflow-hidden rounded-xl2 bg-blush-50"
                >
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
                      className="h-full w-full p-3"
                    />
                  )}
                </Link>
                <div className="flex flex-1 flex-col gap-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link
                        href={`/producto/${product.slug}`}
                        className="font-display text-base font-bold text-ink hover:text-blush-600"
                      >
                        {product.name}
                      </Link>
                      <p className="text-sm text-ink/50">{product.size}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(line.productSlug)}
                      aria-label={`Quitar ${product.name}`}
                      className="text-ink/40 transition-colors hover:text-blush-600"
                    >
                      <CloseIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <QuantityStepper
                      value={line.quantity}
                      onChange={(q) => setQuantity(line.productSlug, q)}
                    />
                    <span className="font-display text-base font-bold text-ink">
                      {formatCOP(product.price * line.quantity)}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <aside className="card-surface h-fit p-6">
          <h2 className="font-display text-lg font-bold text-ink">Resumen del pedido</h2>
          <div className="mt-4 flex justify-between text-sm text-ink/70">
            <span>Subtotal</span>
            <span className="font-semibold text-ink">{formatCOP(subtotal)}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm text-ink/70">
            <span>Envío</span>
            <span className="font-semibold text-ink">
              {remaining > 0 ? "Se calcula al pagar" : "Gratis"}
            </span>
          </div>
          <div className="mt-4 flex justify-between border-t border-border pt-4">
            <span className="font-display text-base font-bold text-ink">Total</span>
            <span className="font-display text-lg font-bold text-ink">{formatCOP(subtotal)}</span>
          </div>
          <Link href="/checkout" className="btn-primary mt-6 w-full py-3.5 text-sm">
            Finalizar compra
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
          <Link href="/tienda" className="btn-ghost mt-2.5 w-full py-3 text-sm">
            Seguir comprando
          </Link>
        </aside>
      </div>
    </div>
  );
}
