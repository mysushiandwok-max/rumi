import { TONE } from "@/components/category/tones";
import type { AccentTone } from "@/lib/types";

type HeartStyle = "sketch" | "hatch" | "burst";

// Corazones pegados a los bordes para no pisar el contenido. "float" = desfase de la animación.
// En celular se ocultan los marcados "wide" para que no se amontonen.
const HEARTS: { pos: string; size: string; style: HeartStyle; float?: number; wide?: boolean }[] = [
  { pos: "left-[2.5%] top-[28%] -rotate-12", size: "w-12", style: "sketch", float: 1.2 },
  { pos: "left-[4%] bottom-[7%] -rotate-6", size: "w-16", style: "burst", float: 2.6 },
  { pos: "left-[24%] top-[3%] rotate-6", size: "w-10", style: "hatch", wide: true },
  { pos: "left-[50%] top-[5%] -rotate-[8deg]", size: "w-8", style: "sketch", wide: true },
  { pos: "left-[40%] bottom-[3%] rotate-[10deg]", size: "w-10", style: "hatch", float: 3.4, wide: true },
  { pos: "right-[16%] bottom-[5%] rotate-6", size: "w-12", style: "sketch" },
  { pos: "right-[2%] top-[44%] -rotate-[14deg]", size: "w-14", style: "hatch", float: 0.6 },
  { pos: "right-[3%] bottom-[22%] rotate-12", size: "w-9", style: "burst", wide: true },
];

// Para franjas bajas (p. ej. "Combínalo con"): el contenido ocupa todo el centro vertical, así que los
// corazones asoman desde el borde superior/inferior, en los huecos entre el texto y las cards.
const STRIP_HEARTS: typeof HEARTS = [
  { pos: "left-[33%] -top-4 rotate-6", size: "w-10", style: "hatch", wide: true },
  { pos: "left-[44%] -bottom-5 -rotate-[10deg]", size: "w-12", style: "sketch", float: 1.8, wide: true },
  { pos: "right-[3%] -top-5 rotate-12", size: "w-11", style: "burst", float: 0.8 },
  { pos: "right-[38%] -bottom-6 rotate-[8deg]", size: "w-10", style: "hatch", wide: true },
  { pos: "-left-3 -bottom-5 -rotate-12", size: "w-14", style: "sketch", wide: true },
];

// Corazón con trazo a mano: contorno irregular y un segundo trazo corrido, como dibujado con marcador.
export function DrawnHeart({ style, className }: { style: HeartStyle; className: string }) {
  return (
    <svg
      viewBox="0 0 60 56"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path
        strokeWidth="3.5"
        d="M30 50C20 42 8 33 8.5 20.5 9 12 16.5 7.5 23 9.5c3.6 1.1 5.6 4.4 6.7 7.2 1.3-3.6 4.3-7.6 9.3-8.4 7-1.1 12.4 4.4 12 11.5C50.4 31 40 41 30 50Z"
      />
      <path strokeWidth="2.5" d="M27.5 46.5C19 39.5 11.5 32 11.8 21.5 12 16 15.5 12.4 20 12.2" opacity="0.7" />
      {style === "hatch" && (
        <g strokeWidth="2.2" opacity="0.75">
          <path d="M17 28l10-10" />
          <path d="M20 35l16-16" />
          <path d="M26 40l15-15" />
          <path d="M33 41l9-9" />
        </g>
      )}
      {style === "burst" && (
        <g strokeWidth="2.6">
          <path d="M51 6l3-4" />
          <path d="M55 13l4-1" />
          <path d="M44 4l0.5-3.5" />
        </g>
      )}
    </svg>
  );
}

// Fondo decorativo para paneles pastel de la ficha de producto: manchas de color suaves y corazones
// dibujados. El padre debe tener "relative overflow-hidden" y envolver su contenido en "relative z-10".
export function SoftHearts({ tone, strip = false }: { tone: AccentTone; strip?: boolean }) {
  const styles = TONE[tone];
  const hearts = strip ? STRIP_HEARTS : HEARTS;
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className={`absolute -left-24 -top-24 h-96 w-96 rounded-full blur-3xl ${styles.blob}`} />
      <div className={`absolute -bottom-32 -right-16 h-[28rem] w-[28rem] rounded-full blur-3xl ${styles.blobAlt}`} />
      <div className={styles.doodle}>
        {hearts.map((heart, i) => (
          <span
            key={i}
            className={`absolute ${heart.wide ? "hidden sm:block" : ""} ${heart.pos}`}
          >
            <span
              className={`block ${heart.float !== undefined ? "animate-float" : ""}`}
              style={heart.float !== undefined ? { animationDelay: `-${heart.float}s` } : undefined}
            >
              <DrawnHeart style={heart.style} className={`block h-auto ${heart.size}`} />
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
