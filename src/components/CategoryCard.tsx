import Image from "next/image";
import Link from "next/link";
import { ProductArt } from "@/components/illustrations/ProductArt";
import { ArrowRightIcon } from "@/components/icons";
import type { Category } from "@/lib/types";

const TONE_STYLES: Record<
  string,
  { bg: string; text: string; button: string }
> = {
  blush: {
    bg: "bg-blush-100",
    text: "text-blush-700",
    button: "bg-white text-blush-700 hover:bg-blush-50",
  },
  mint: {
    bg: "bg-mint-100",
    text: "text-mint-700",
    button: "bg-white text-mint-700 hover:bg-mint-50",
  },
  peach: {
    bg: "bg-peach-100",
    text: "text-peach-600",
    button: "bg-white text-peach-600 hover:bg-peach-50",
  },
  lavender: {
    bg: "bg-lavender-100",
    text: "text-lavender-600",
    button: "bg-white text-lavender-600 hover:bg-lavender-50",
  },
};

// Paletas pastel alternativas: la tarjeta pierde la ilustración de producto y lleva un fondo decorado
// (ola de color, burbujas y garabatos a mano), cada una con su propio garabato de acento.
// Clases escritas completas porque Tailwind no genera CSS para nombres armados con plantillas.
export const CARD_PALETTES = {
  pistacho: {
    bg: "bg-gradient-to-br from-pistacho-100 via-pistacho-50 to-pistacho-200/70",
    text: "text-pistacho-700",
    button: "bg-white text-pistacho-700 hover:bg-pistacho-50",
    wave: "text-pistacho-200/80",
    doodle: "text-pistacho-400",
    accent: "leaves",
  },
  coral: {
    bg: "bg-gradient-to-br from-coral-100 via-coral-50 to-coral-200/70",
    text: "text-coral-700",
    button: "bg-white text-coral-700 hover:bg-coral-50",
    wave: "text-coral-200/80",
    doodle: "text-coral-400",
    accent: "burst",
  },
  butter: {
    bg: "bg-gradient-to-br from-butter-100 via-butter-50 to-butter-200/70",
    text: "text-butter-700",
    button: "bg-white text-butter-700 hover:bg-butter-50",
    wave: "text-butter-200/80",
    doodle: "text-butter-400",
    accent: "sun",
  },
  latte: {
    bg: "bg-gradient-to-br from-latte-100 via-latte-50 to-latte-200/70",
    text: "text-latte-700",
    button: "bg-white text-latte-700 hover:bg-latte-50",
    wave: "text-latte-200/80",
    doodle: "text-latte-400",
    accent: "star",
  },
  // Mismos tonos (y orden) que las tarjetas de las categorías principales, con el garabato de cada tarjeta.
  blush: {
    bg: "bg-gradient-to-br from-blush-100 via-blush-50 to-blush-200/70",
    text: "text-blush-700",
    button: "bg-white text-blush-700 hover:bg-blush-50",
    wave: "text-blush-200/80",
    doodle: "text-blush-400",
    accent: "leaves",
  },
  mint: {
    bg: "bg-gradient-to-br from-mint-100 via-mint-50 to-mint-200/70",
    text: "text-mint-700",
    button: "bg-white text-mint-700 hover:bg-mint-50",
    wave: "text-mint-200/80",
    doodle: "text-mint-400",
    accent: "burst",
  },
  peach: {
    bg: "bg-gradient-to-br from-peach-100 via-peach-50 to-peach-200/70",
    text: "text-peach-600",
    button: "bg-white text-peach-600 hover:bg-peach-50",
    wave: "text-peach-200/80",
    doodle: "text-peach-400",
    accent: "sun",
  },
  lavender: {
    bg: "bg-gradient-to-br from-lavender-100 via-lavender-50 to-lavender-200/70",
    text: "text-lavender-600",
    button: "bg-white text-lavender-600 hover:bg-lavender-50",
    wave: "text-lavender-200/80",
    doodle: "text-lavender-400",
    accent: "star",
  },
} as const;

export type CardPalette = keyof typeof CARD_PALETTES;

// Burbuja brillante tipo gota de agua: reflejo blanco arriba a la izquierda y borde translúcido.
const BUBBLE = {
  background:
    "radial-gradient(circle at 32% 28%, rgba(255,255,255,0.95) 0 12%, rgba(255,255,255,0.45) 26%, rgba(255,255,255,0.12) 62%, rgba(255,255,255,0.3) 100%)",
  boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.75), inset -2px -3px 6px rgba(255,255,255,0.35), 0 4px 10px -6px rgba(43,35,32,0.18)",
};

const BUBBLES = [
  "right-[30%] top-[62%] h-5 w-5",
  "right-8 bottom-10 h-9 w-9",
  "right-[18%] top-[30%] h-3.5 w-3.5",
  "right-[42%] bottom-7 h-3 w-3",
  "right-4 top-[42%] h-4 w-4",
  "right-[28%] bottom-[30%] h-6 w-6",
];

const DOODLE_STROKE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

// Garabato de acento distinto por paleta, arriba a la derecha (como el sol o el destello de las tarjetas con foto).
function AccentDoodle({ kind }: { kind: (typeof CARD_PALETTES)[CardPalette]["accent"] }) {
  if (kind === "sun")
    return (
      <svg viewBox="0 0 48 48" {...DOODLE_STROKE} className="absolute right-6 top-5 h-12 w-12">
        <circle cx="24" cy="24" r="8" />
        <path d="M24 5v6M24 37v6M5 24h6M37 24h6M10.5 10.5l4.2 4.2M33.3 33.3l4.2 4.2M10.5 37.5l4.2-4.2M33.3 14.7l4.2-4.2" />
      </svg>
    );
  if (kind === "star")
    return (
      <svg viewBox="0 0 48 48" {...DOODLE_STROKE} className="absolute right-7 top-5 h-11 w-11 rotate-6">
        <path d="M24 5c1.6 9.4 5.2 13.4 15 15-9.8 1.6-13.4 5.6-15 15-1.6-9.4-5.2-13.4-15-15 9.8-1.6 13.4-5.6 15-15z" />
        <path d="M39 33c.6 3 1.8 4.2 4.6 4.8-2.8.6-4 1.8-4.6 4.8-.6-3-1.8-4.2-4.6-4.8 2.8-.6 4-1.8 4.6-4.8z" />
      </svg>
    );
  if (kind === "leaves")
    return (
      <svg viewBox="0 0 64 48" {...DOODLE_STROKE} className="absolute right-5 top-4 h-12 w-16 -rotate-6">
        <path d="M8 44C14 26 28 14 50 8" />
        <path d="M22 30c-6-10-2-20 8-24 4 10 0 20-8 24z" />
        <path d="M34 22c4-10 14-14 24-10-4 10-14 14-24 10z" />
      </svg>
    );
  return (
    <svg viewBox="0 0 48 48" {...DOODLE_STROKE} className="absolute right-6 top-5 h-11 w-11">
      <path d="M24 34s-10-6-12.6-12c-1.8-4.4.6-8.6 4.8-9.2 3-.4 5.8 1.2 7.8 4 2-2.8 4.8-4.4 7.8-4 4.2.6 6.6 4.8 4.8 9.2C34 28 24 34 24 34z" />
      <path d="M8 8l4 4M24 3v5M40 8l-4 4" />
    </svg>
  );
}

// Fondo decorativo de la tarjeta con paleta, al estilo de las tarjetas con foto pero sin producto:
// ola de color abajo, burbujas brillantes y garabatos a mano.
// Todo se concentra a la derecha y abajo para no pisar el título ni la descripción.
function CardDecor({ palette }: { palette: CardPalette }) {
  const p = CARD_PALETTES[palette];
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {/* Ola de color abajo */}
      <svg viewBox="0 0 400 120" preserveAspectRatio="none" className={`absolute inset-x-0 bottom-0 h-24 w-full ${p.wave}`}>
        <path fill="currentColor" d="M0 70c60-30 110-34 170-8s120 30 230-24v82H0z" />
      </svg>

      {/* Burbujas */}
      {BUBBLES.map((position) => (
        <span key={position} className={`absolute rounded-full ${position}`} style={BUBBLE} />
      ))}

      {/* Garabatos a mano */}
      <div className={p.doodle}>
        <AccentDoodle kind={p.accent} />
        <svg
          viewBox="0 0 24 24"
          {...DOODLE_STROKE}
          className="absolute right-[38%] top-[52%] h-7 w-7 -rotate-12 transition-transform duration-300 ease-out-strong group-hover:-translate-y-1 group-hover:-rotate-[18deg]"
        >
          <path d="M12 20s-7.2-4.4-9.2-8.8C1.4 8 3.1 5 6.2 4.6c2.3-.3 4.3.9 5.8 3 1.5-2.1 3.5-3.3 5.8-3 3.1.4 4.8 3.4 3.4 6.6C19.2 15.6 12 20 12 20z" />
        </svg>
        <svg viewBox="0 0 24 24" {...DOODLE_STROKE} className="absolute bottom-[42%] right-5 h-4 w-4">
          <path d="M12 3v18M3 12h18" />
        </svg>
        <svg viewBox="0 0 24 24" {...DOODLE_STROKE} className="absolute bottom-6 right-[46%] h-5 w-5 opacity-80">
          <path d="M5 16c2-4 5-4 7 0s5 4 7 0" />
        </svg>
      </div>
    </div>
  );
}

export function CategoryCard({ category, palette }: { category: Category; palette?: CardPalette }) {
  const styles = palette ? CARD_PALETTES[palette] : TONE_STYLES[category.tone];
  return (
    <Link
      href={`/categoria/${category.slug}`}
      className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-xl2 ${styles.bg} p-6 transition-transform duration-200 ease-out-strong hover:-translate-y-1`}
    >
      {palette ? (
        <CardDecor palette={palette} />
      ) : category.imagePath ? (
        <Image
          src={category.imagePath}
          alt=""
          fill
          className="pointer-events-none object-cover transition-transform duration-300 ease-out-strong group-hover:scale-105"
        />
      ) : null}
      <div className="relative z-10">
        <h3 className={`font-display text-xl font-bold ${styles.text}`}>{category.name}</h3>
        <p className="mt-1.5 max-w-[70%] text-sm text-ink/70">{category.tagline}</p>
      </div>
      <span
        className={`relative z-10 mt-6 inline-flex w-fit items-center gap-1.5 rounded-pill px-4 py-2 text-sm font-semibold shadow-sm transition-colors duration-150 ${styles.button}`}
      >
        Ver más
        <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-150 ease-out-strong group-hover:translate-x-0.5" />
      </span>
      {!palette && !category.imagePath ? (
        <ProductArt
          variant={category.artVariant}
          tone={category.tone}
          label={category.name}
          className="pointer-events-none absolute -bottom-6 -right-6 h-40 w-auto opacity-90 transition-transform duration-300 ease-out-strong group-hover:scale-105 group-hover:rotate-2"
        />
      ) : null}
    </Link>
  );
}
