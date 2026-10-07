import Image from "next/image";
import type { CSSProperties } from "react";
import { ROUTINE_COLLECTIONS } from "@/components/routines/collections";
import type { Product, RoutineCollection } from "@/lib/types";

// Posición (left/top en % del contenedor) y ángulo de cada polaroid según cuántas hay, para que se vean
// "tiradas" sobre la mesa sin taparse del todo. Hasta 6 (el máximo de productos de una rutina hoy).
const LAYOUTS: Record<number, [left: number, top: number, rotate: number][]> = {
  1: [[34, 14, -4]],
  2: [[14, 14, -7], [50, 26, 6]],
  3: [[2, 22, -8], [34, 4, 4], [66, 28, 9]],
  4: [[2, 6, -8], [40, 0, 5], [14, 48, 6], [54, 44, -5]],
  5: [[0, 6, -9], [34, 0, 4], [67, 10, 10], [10, 50, 6], [46, 48, -5]],
  6: [[0, 4, -9], [34, 0, 3], [67, 8, 10], [3, 52, 5], [35, 54, -6], [67, 50, 8]],
};

// Ángulo de la cinta de cada polaroid, alternado para que no se vean todas iguales.
const TAPE_TILT = ["-rotate-6", "rotate-3", "-rotate-2", "rotate-6", "-rotate-3", "rotate-2"];

export type PolaroidItem = { product: Product; caption: string };

// Fotos de los productos de la rutina como polaroids: caen en cascada al cargar y, al pasar el mouse,
// la foto se endereza, se levanta y queda encima de las demás.
export function PolaroidStack({ items, collection }: { items: PolaroidItem[]; collection: RoutineCollection }) {
  const shown = items.slice(0, 6);
  const layout = LAYOUTS[shown.length];
  const styles = ROUTINE_COLLECTIONS[collection];
  if (!layout) return null;

  return (
    <div aria-hidden="true" className="relative mx-auto aspect-[23/20] w-full max-w-[460px]">
      {shown.map(({ product, caption }, i) => {
        const [left, top, rotate] = layout[i];
        return (
          // Capa externa: posición, ángulo y caída de entrada (la animación deja el ángulo fijado).
          <div
            key={product.slug}
            style={
              {
                left: `${left}%`,
                top: `${top}%`,
                "--r": `${rotate}deg`,
                animationDelay: `${150 + i * 90}ms`,
              } as CSSProperties
            }
            className="group/polaroid absolute w-[31%] animate-polaroid-in can-hover:hover:z-20"
          >
            {/* Capa interna: al pasar el mouse contrarresta el ángulo (se endereza), sube y crece */}
            <div
              style={{ "--r": `${rotate}deg` } as CSSProperties}
              className="relative rounded-[4px] bg-white p-[7%] pb-[22%] shadow-[0_14px_30px_-14px_rgba(43,35,32,0.35)] ring-1 ring-black/5 transition-[transform,box-shadow] duration-300 ease-out-strong can-hover:group-hover/polaroid:shadow-[0_24px_40px_-16px_rgba(43,35,32,0.4)] can-hover:group-hover/polaroid:[transform:rotate(calc(var(--r)*-1))_translateY(-8px)_scale(1.06)]"
            >
              <span
                className={`absolute -top-2.5 left-1/2 h-5 w-[42%] -translate-x-1/2 rounded-[2px] shadow-sm backdrop-blur-[1px] ${styles.blob} ${TAPE_TILT[i]}`}
              />
              <div className="relative aspect-square overflow-hidden rounded-[2px] bg-cream">
                <Image
                  src={product.images[0]}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 150px, 30vw"
                  className="object-cover transition-transform duration-500 ease-out-strong can-hover:group-hover/polaroid:scale-105"
                />
              </div>
              <p className="absolute inset-x-0 bottom-[4%] truncate px-2 text-center font-script text-base leading-none text-ink/70 sm:text-lg">
                {caption}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
