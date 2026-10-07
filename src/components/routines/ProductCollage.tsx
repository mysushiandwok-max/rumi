import Image from "next/image";
import type { Product } from "@/lib/types";

// Collage con las fotos de los productos de una rutina (en /rutinas y en "Skincare hecho para el clima de tu ciudad").
// Las fotos se acercan en cascada con el hover de un ancestro "group".

// Distribución del collage según cuántos productos tiene la rutina (2 a 6 en el catálogo actual).
// Clases escritas completas porque Tailwind no genera CSS para nombres armados con plantillas.
const COLLAGE_LAYOUTS: Record<number, { grid: string; tiles: string[] }> = {
  1: { grid: "grid-cols-1", tiles: [""] },
  2: { grid: "grid-cols-2", tiles: ["", ""] },
  3: { grid: "grid-cols-2 grid-rows-2", tiles: ["row-span-2", "", ""] },
  4: { grid: "grid-cols-2 grid-rows-2", tiles: ["", "", "", ""] },
  5: { grid: "grid-cols-6 grid-rows-2", tiles: ["col-span-3", "col-span-3", "col-span-2", "col-span-2", "col-span-2"] },
  6: { grid: "grid-cols-3 grid-rows-2", tiles: ["", "", "", "", "", ""] },
};
const COLLAGE_MAX = 6;

export function ProductCollage({ products }: { products: Product[] }) {
  const shown = products.slice(0, COLLAGE_MAX);
  const extra = products.length - shown.length;
  const layout = COLLAGE_LAYOUTS[shown.length];

  return (
    <div className={`grid h-full gap-1.5 ${layout.grid}`}>
      {shown.map((product, i) => (
        <div key={product.slug} className={`relative overflow-hidden rounded-[1.1rem] bg-white ${layout.tiles[i]}`}>
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes={i === 0 && shown.length <= 3 ? "(min-width: 1024px) 260px, 50vw" : "(min-width: 1024px) 180px, 33vw"}
            // Al pasar el mouse las fotos se acercan en cascada, una tras otra.
            style={{ transitionDelay: `${i * 40}ms` }}
            className="object-cover transition-transform duration-700 ease-out-strong can-hover:group-hover:scale-[1.07]"
          />
          {extra > 0 && i === shown.length - 1 && (
            <span className="absolute inset-0 flex items-center justify-center bg-ink/45 font-display text-xl font-bold text-white">
              +{extra}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
