import Image from "next/image";
import Link from "next/link";
import { ProductArt } from "@/components/illustrations/ProductArt";
import { ArrowRightIcon } from "@/components/icons";
import { Reveal } from "@/components/category/Reveal";
import { TONE } from "@/components/category/tones";
import type { AccentTone, ProductArtVariant } from "@/lib/types";

// Un tile puede llevar a otra categoría, o ser el banner fijo que invita a "Rutinas".
export type MiniBannerItem =
  | {
      type: "category";
      slug: string;
      name: string;
      tagline: string;
      tone: AccentTone;
      artVariant: ProductArtVariant;
      bannerPath?: string;
    }
  | {
      type: "routine";
      name: string;
      tagline: string;
      tone: AccentTone;
    };

// El overlay de una foto normalmente usa el tono de marca de la categoría, pero alguna foto no combina con ese
// tono (p. ej. Mascarillas es "blush"/rosa en el resto del sitio, pero su foto tiene fondo azul): se sobreescribe aquí,
// tile por tile, sin tocar el tono real de la categoría (que sigue siendo el mismo en el resto del sitio).
const BANNER_GRADIENT_OVERRIDE: Partial<Record<string, string>> = {
  mascarillas: "from-sky-100 via-sky-100/70",
};

// Mismo halo difuminado que ya usa el sitio (ver la sección de reseñas en el inicio) para darle profundidad
// al espacio vacío del tile de Rutinas sin recurrir a un ícono o ilustración.
const ROUTINE_GLOW: Record<AccentTone, string> = {
  blush: "bg-blush-200/50",
  mint: "bg-mint-200/50",
  peach: "bg-peach-200/50",
  lavender: "bg-lavender-200/50",
};

// Mini banners para saltar a otra categoría (o a Rutinas). Se arman solos con nombre, frase y tono.
export function CategoryMiniBanners({ items }: { items: MiniBannerItem[] }) {
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="mini-banners-title">
      <h2 id="mini-banners-title" className="font-display text-2xl font-bold leading-tight text-ink sm:text-3xl">
        Sigue explorando
      </h2>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:max-lg:[&>div:last-child:nth-child(odd)]:col-span-2 lg:[&>div:last-child:nth-child(3n+2)]:col-span-2">
        {items.map((item, index) => {
          const styles = TONE[item.tone];
          const key = item.type === "category" ? item.slug : "rutinas";
          const href = item.type === "category" ? `/categoria/${item.slug}` : "/rutinas";
          const image = item.type === "category" ? item.bannerPath : undefined;
          const gradient = (item.type === "category" && BANNER_GRADIENT_OVERRIDE[item.slug]) || styles.gradient;
          const isRoutine = item.type === "routine";

          return (
            <Reveal key={key} delay={index * 70} className="h-full">
              <Link
                href={href}
                className={`group relative isolate flex items-center overflow-hidden rounded-[1.75rem] transition-transform duration-300 ease-out-strong active:scale-[0.98] [@media(hover:hover)]:hover:-translate-y-0.5 ${
                  isRoutine ? "h-auto sm:h-40" : "h-32"
                } ${styles.tile}`}
              >
                {image ? (
                  <Image
                    src={image}
                    alt=""
                    fill
                    sizes="(min-width: 1360px) 420px, (min-width: 640px) 50vw, 100vw"
                    className="pointer-events-none object-cover object-right-bottom transition-transform duration-500 ease-out-strong [@media(hover:hover)]:group-hover:scale-105"
                  />
                ) : item.type === "category" ? (
                  <ProductArt
                    variant={item.artVariant}
                    tone={item.tone}
                    label={item.name}
                    className="pointer-events-none absolute -bottom-6 right-4 h-32 w-auto opacity-90 transition-transform duration-500 ease-out-strong [@media(hover:hover)]:group-hover:-rotate-3 [@media(hover:hover)]:group-hover:scale-105"
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className={`pointer-events-none absolute -right-16 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full blur-3xl ${ROUTINE_GLOW[item.tone]}`}
                  />
                )}
                {image && (
                  <div
                    aria-hidden="true"
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-r ${gradient} from-35% via-55% to-transparent`}
                  />
                )}

                {isRoutine ? (
                  <div className="relative z-10 flex w-full flex-col items-start gap-4 px-7 py-7 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-9 sm:py-0">
                    <div className="flex min-w-0 flex-col gap-2">
                      <h3 className="font-display text-2xl font-bold leading-tight text-ink sm:text-3xl lg:text-4xl">
                        {item.name}
                      </h3>
                      <p className="max-w-sm text-sm leading-relaxed text-ink/65 sm:text-base">{item.tagline}</p>
                    </div>
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-ink shadow-sm transition-transform duration-200 ease-out-strong group-hover:translate-x-1 sm:h-14 sm:w-14">
                      <ArrowRightIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </span>
                  </div>
                ) : (
                  <div className="relative z-10 flex flex-col items-start gap-1.5 px-6">
                    <h3 className="font-display text-lg font-bold leading-tight text-ink">{item.name}</h3>
                    <p className="line-clamp-2 max-w-[11rem] text-xs leading-snug text-ink/65">{item.tagline}</p>
                    <span className="mt-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-white text-ink shadow-sm">
                      <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 ease-out-strong group-hover:translate-x-0.5" />
                    </span>
                  </div>
                )}
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
