"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import {
  ArrowRightIcon,
  CheckIcon,
  CheckCircleIcon,
  ShieldIcon,
  TruckIcon,
  BagIcon,
} from "@/components/icons";
import { useCart } from "@/lib/cart-context";
import { formatCOP } from "@/lib/format";
import { placeOrderAction } from "@/lib/admin/actions/orders";
import { COLOMBIA_DEPARTMENTS } from "@/lib/colombia";
import type { ShippingLookupRow } from "@/lib/admin/shipping";

type Step = "envio" | "pago" | "confirmacion";

const STEPS: { key: Step; label: string }[] = [
  { key: "envio", label: "Envío" },
  { key: "pago", label: "Pago" },
  { key: "confirmacion", label: "Confirmación" },
];

const DEFAULT_DEPARTMENT = "Bogotá D.C.";

export function CheckoutClient({
  freeShippingThreshold,
  flatRate,
  shippingTable,
}: {
  freeShippingThreshold: number;
  flatRate: number;
  shippingTable: ShippingLookupRow[];
}) {
  const { lines, subtotal, clear, getProduct } = useCart();
  const [step, setStep] = useState<Step>("envio");
  const [orderNumber, setOrderNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [shipping, setShipping] = useState(() => {
    const citiesInDept = shippingTable.filter((r) => r.department === DEFAULT_DEPARTMENT);
    return {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      city: citiesInDept[0]?.name ?? "",
      department: DEFAULT_DEPARTMENT,
      notes: "",
    };
  });

  const citiesInDepartment = useMemo(
    () => shippingTable.filter((r) => r.department === shipping.department),
    [shippingTable, shipping.department]
  );

  const shippingRate = useMemo(() => {
    const match = shippingTable.find((r) => r.department === shipping.department && r.name === shipping.city);
    return match ? match.price : flatRate;
  }, [shippingTable, shipping.department, shipping.city, flatRate]);

  const shippingCost = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : shippingRate;
  const total = subtotal + shippingCost;

  function handleDepartmentChange(department: string) {
    const citiesInDept = shippingTable.filter((r) => r.department === department);
    setShipping((prev) => ({ ...prev, department, city: citiesInDept[0]?.name ?? "" }));
  }

  if (lines.length === 0 && step !== "confirmacion") {
    return (
      <div className="container-page flex flex-col items-center gap-4 py-24 text-center">
        <BagIcon className="h-10 w-10 text-blush-300" />
        <h1 className="font-display text-2xl font-bold text-ink">No hay nada que pagar todavía</h1>
        <p className="max-w-sm text-sm text-ink/60">Tu carrito está vacío. Añade productos antes de pasar por caja.</p>
        <Link href="/tienda" className="btn-primary mt-2 px-6 py-3 text-sm">
          Ir a la tienda
        </Link>
      </div>
    );
  }

  function handleShippingSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStep("pago");
  }

  async function handlePaymentSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const items = lines
        .map((line) => {
          const product = getProduct(line.productSlug);
          if (!product) return null;
          return {
            productSlug: product.slug,
            productName: product.name,
            unitPrice: product.price,
            quantity: line.quantity,
          };
        })
        .filter((item): item is NonNullable<typeof item> => item !== null);

      const result = await placeOrderAction({
        shipping,
        items,
        subtotal,
        shippingCost,
      });
      setOrderNumber(result.orderNumber);
      clear();
      setStep("confirmacion");
    } catch {
      setError("No pudimos registrar tu pedido. Intenta de nuevo en unos segundos.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container-page py-10 sm:py-14">
      {step !== "confirmacion" && <Breadcrumbs items={[{ label: "Carrito", href: "/carrito" }, { label: "Checkout" }]} />}

      {step !== "confirmacion" && (
        <div className="mb-10 flex items-center justify-center gap-2 sm:gap-4">
          {STEPS.map((s, i) => {
            const currentIndex = STEPS.findIndex((x) => x.key === step);
            const isActive = s.key === step;
            const isDone = i < currentIndex;
            return (
              <div key={s.key} className="flex items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                      isActive
                        ? "bg-blush-500 text-white"
                        : isDone
                          ? "bg-mint-500 text-white"
                          : "bg-blush-100 text-ink/40"
                    }`}
                  >
                    {isDone ? <CheckIcon className="h-3.5 w-3.5" /> : i + 1}
                  </span>
                  <span className={`text-sm font-semibold ${isActive ? "text-ink" : "text-ink/40"}`}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && <div className="h-px w-6 bg-border sm:w-12" />}
              </div>
            );
          })}
        </div>
      )}

      {step === "envio" && (
        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          <form onSubmit={handleShippingSubmit} className="card-surface flex flex-col gap-5 p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold text-ink">Datos de envío</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Nombre completo" required>
                <input
                  required
                  value={shipping.fullName}
                  onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })}
                  className="input-field"
                  placeholder="Tu nombre y apellido"
                />
              </Field>
              <Field label="Correo electrónico" required>
                <input
                  required
                  type="email"
                  value={shipping.email}
                  onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                  className="input-field"
                  placeholder="tu@correo.com"
                />
              </Field>
              <Field label="Teléfono" required>
                <input
                  required
                  type="tel"
                  value={shipping.phone}
                  onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                  className="input-field"
                  placeholder="300 123 4567"
                />
              </Field>
              <Field label="Departamento" required>
                <select
                  value={shipping.department}
                  onChange={(e) => handleDepartmentChange(e.target.value)}
                  className="input-field"
                >
                  {COLOMBIA_DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Ciudad / Municipio" required>
                <select
                  required
                  value={shipping.city}
                  onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                  className="input-field"
                  disabled={citiesInDepartment.length === 0}
                >
                  {citiesInDepartment.length === 0 && <option value="">Sin municipios registrados</option>}
                  {citiesInDepartment.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Dirección" required>
                <input
                  required
                  value={shipping.address}
                  onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                  className="input-field"
                  placeholder="Calle 123 # 45-67, Apto 8"
                />
              </Field>
            </div>
            <Field label="Notas de entrega (opcional)">
              <textarea
                value={shipping.notes}
                onChange={(e) => setShipping({ ...shipping, notes: e.target.value })}
                className="input-field min-h-20 resize-none"
                placeholder="Ej: dejar con la portería"
              />
            </Field>
            <label className="flex items-start gap-3 text-sm leading-relaxed text-ink/70">
              <input type="checkbox" required className="mt-1 h-4 w-4 shrink-0 accent-blush-500" />
              <span>
                Acepto los{" "}
                <Link href="/legal/terminos-y-condiciones" target="_blank" className="font-semibold text-blush-600 underline">
                  términos y condiciones
                </Link>{" "}
                y autorizo el tratamiento de mis datos personales según la{" "}
                <Link href="/legal/politica-de-privacidad" target="_blank" className="font-semibold text-blush-600 underline">
                  política de privacidad
                </Link>
                .
              </span>
            </label>
            <button type="submit" className="btn-primary mt-2 w-full py-3.5 text-sm sm:w-fit sm:px-8">
              Continuar al pago
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          </form>

          <OrderSummary lines={lines} subtotal={subtotal} shippingCost={shippingCost} total={total} />
        </div>
      )}

      {step === "pago" && (
        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          <form onSubmit={handlePaymentSubmit} className="card-surface flex flex-col gap-5 p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold text-ink">Pago</h2>
            <div className="flex items-start gap-3 rounded-xl2 bg-lavender-50 p-4 text-sm text-lavender-600">
              <ShieldIcon className="h-5 w-5 shrink-0" />
              <p>
                Este es un <span className="font-bold">pago de prueba</span>: aún no procesamos cobros
                reales mientras conectamos nuestra pasarela de pago. Puedes completar el formulario para
                ver cómo funcionará el proceso.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Número de tarjeta" required className="sm:col-span-2">
                <input required inputMode="numeric" maxLength={19} className="input-field" placeholder="4111 1111 1111 1111" />
              </Field>
              <Field label="Nombre en la tarjeta" required className="sm:col-span-2">
                <input required className="input-field" placeholder="Como aparece en la tarjeta" />
              </Field>
              <Field label="Vencimiento" required>
                <input required className="input-field" placeholder="MM/AA" maxLength={5} />
              </Field>
              <Field label="CVV" required>
                <input required inputMode="numeric" maxLength={4} className="input-field" placeholder="123" />
              </Field>
            </div>

            {error && (
              <p className="rounded-xl2 bg-blush-50 px-4 py-3 text-sm font-semibold text-blush-700">{error}</p>
            )}

            <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => setStep("envio")}
                className="text-sm font-semibold text-ink/60 hover:text-ink"
              >
                ← Volver a envío
              </button>
              <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3.5 text-sm sm:w-fit sm:px-8 disabled:opacity-60">
                {isSubmitting ? "Procesando..." : "Confirmar pedido"}
                <ArrowRightIcon className="h-4 w-4" />
              </button>
            </div>
          </form>

          <OrderSummary lines={lines} subtotal={subtotal} shippingCost={shippingCost} total={total} />
        </div>
      )}

      {step === "confirmacion" && (
        <div className="mx-auto flex max-w-lg flex-col items-center py-10 text-center animate-fade-up">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-mint-100">
            <CheckCircleIcon className="h-10 w-10 text-mint-600" />
          </div>
          <h1 className="mt-6 font-display text-3xl font-bold text-ink">¡Gracias por tu compra!</h1>
          <p className="mt-2 text-sm text-ink/60">
            Tu pedido <span className="font-bold text-ink">#{orderNumber}</span> fue registrado. Te
            enviaremos la confirmación al correo indicado.
          </p>
          <div className="mt-8 flex w-full items-center gap-3 rounded-xl2 bg-blush-50 p-4 text-left text-sm text-ink/70">
            <TruckIcon className="h-5 w-5 shrink-0 text-blush-500" />
            Recibirás tu pedido en un plazo estimado de 3 a 5 días hábiles.
          </div>
          <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
            <Link href="/tienda" className="btn-secondary flex-1 py-3 text-sm">
              Seguir comprando
            </Link>
            <Link href="/" className="btn-primary flex-1 py-3 text-sm">
              Volver al inicio
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  required,
  children,
  className = "",
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-1.5 text-sm ${className}`}>
      <span className="font-semibold text-ink">
        {label} {required && <span className="text-blush-500">*</span>}
      </span>
      {children}
    </label>
  );
}

function OrderSummary({
  lines,
  subtotal,
  shippingCost,
  total,
}: {
  lines: { productSlug: string; quantity: number }[];
  subtotal: number;
  shippingCost: number;
  total: number;
}) {
  const { getProduct } = useCart();
  return (
    <aside className="card-surface h-fit p-6">
      <h2 className="font-display text-lg font-bold text-ink">Tu pedido</h2>
      <ul className="mt-4 flex flex-col gap-3">
        {lines.map((line) => {
          const product = getProduct(line.productSlug);
          if (!product) return null;
          return (
            <li key={line.productSlug} className="flex items-center justify-between text-sm">
              <span className="text-ink/70">
                {product.name} <span className="text-ink/40">× {line.quantity}</span>
              </span>
              <span className="font-semibold text-ink">{formatCOP(product.price * line.quantity)}</span>
            </li>
          );
        })}
      </ul>
      <div className="mt-4 flex justify-between border-t border-border pt-4 text-sm text-ink/70">
        <span>Subtotal</span>
        <span className="font-semibold text-ink">{formatCOP(subtotal)}</span>
      </div>
      <div className="mt-2 flex justify-between text-sm text-ink/70">
        <span>Envío</span>
        <span className="font-semibold text-ink">{shippingCost === 0 ? "Gratis" : formatCOP(shippingCost)}</span>
      </div>
      <div className="mt-4 flex justify-between border-t border-border pt-4">
        <span className="font-display text-base font-bold text-ink">Total</span>
        <span className="font-display text-lg font-bold text-ink">{formatCOP(total)}</span>
      </div>
    </aside>
  );
}
