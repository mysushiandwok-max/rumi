import type { CSSProperties, SVGProps } from "react";
import { DropletIcon, SparkleIcon } from "@/components/icons";
import { TONE } from "@/components/category/tones";
import type { AccentTone } from "@/lib/types";

// Corazón "dibujado a mano": contorno irregular que no cierra perfecto (remata con un rulito en la punta),
// un repaso parcial del trazo como de lápiz y un brillito. El relleno va corrido del contorno, como coloreado a mano.
function SketchHeart({ className }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path
        d="M21.5 35.5C14 30 5.5 23.5 6.5 14.5 7.5 9 13 7.5 16.5 10.5 18 12 19 13 20 14.5 21.5 11 24.5 7.5 29.5 8 35 8.5 36.5 14 34 19.5 31.5 25 26 29.5 21.5 34"
        fill="currentColor"
        stroke="none"
        className="heart-fill"
      />
      <path
        d="M20 33.5C12 28 4 22 5 13.5 5.8 7.5 12.5 5 16.8 9.2 18.4 10.8 19.4 12.3 20 13.8 21.2 10 24.2 6.2 29.4 6.6 35.2 7.2 37.2 13.2 34.6 19.2 32 25.2 25.4 30 20.6 34.4 19.2 35.6 17.4 34 18.6 32.4"
        strokeWidth="2.4"
      />
      <path d="M19 32.2C12.4 27.4 6.2 21.6 6.6 14.2 7 10 10.6 7.6 14.2 8.4" strokeWidth="1.2" opacity="0.6" />
      <path d="M10 14.5C10 12.4 11.4 11 13.2 10.8" strokeWidth="1.8" />
    </svg>
  );
}

// Posiciones fijas (no aleatorias, para que el patrón no "salte" entre renders) pegadas a los bordes y
// esquinas del panel: así el doodle nunca queda justo debajo del título, los tabs o las cards de producto.
// Mayoría corazones, con un par de destellos y alguna gota como acento suelto, en tamaños y ángulos variados.
// "filled" colorea el corazón por dentro; "float" lo hace flotar suavemente (con desfase propio).
const DOODLES = [
  { Icon: SketchHeart, pos: "right-[8%] top-[6%]", icon: "h-11 w-11 rotate-6", float: 1.2 },
  { Icon: SketchHeart, pos: "left-[7%] bottom-[8%]", icon: "h-10 w-10 rotate-[10deg]", filled: true },
  { Icon: SparkleIcon, pos: "right-[4%] bottom-[14%]", icon: "h-7 w-7 -rotate-6", float: 0.6 },
  { Icon: SketchHeart, pos: "right-[20%] bottom-[6%]", icon: "h-7 w-7 -rotate-[8deg]", filled: true, float: 3 },
  { Icon: SketchHeart, pos: "left-[1.5%] top-[46%]", icon: "h-6 w-6 rotate-[16deg]" },
  { Icon: SketchHeart, pos: "right-[2%] top-[30%]", icon: "h-8 w-8 -rotate-[10deg]", filled: true, float: 1.8 },
  { Icon: SketchHeart, pos: "right-[32%] top-[12%]", icon: "h-6 w-6 rotate-[20deg]", float: 4 },
  { Icon: DropletIcon, pos: "left-[11%] bottom-[22%]", icon: "h-6 w-6 rotate-[6deg]", float: 2 },
  { Icon: SketchHeart, pos: "right-[13%] bottom-[30%]", icon: "h-5 w-5 -rotate-[14deg]", filled: true },
  { Icon: SparkleIcon, pos: "left-[42%] bottom-[4%]", icon: "h-5 w-5 rotate-[10deg]", float: 3.4 },
  { Icon: SketchHeart, pos: "left-[0.5%] top-[72%]", icon: "h-7 w-7 rotate-[8deg]" },
  { Icon: SketchHeart, pos: "right-[46%] top-[3%]", icon: "h-5 w-5 -rotate-[12deg]", filled: true },
  { Icon: DropletIcon, pos: "right-[26%] top-[40%]", icon: "h-4 w-4 rotate-[14deg]" },
] as const;

export type DoodleColors = { doodle: string; doodleSoft: string; blob: string; blobAlt: string };

// Puntitos en retícula que se desvanecen hacia el centro del panel, para dar textura sin ensuciar el contenido.
const DOT_GRID: CSSProperties = {
  backgroundImage: "radial-gradient(currentColor 1.4px, transparent 1.6px)",
  backgroundSize: "22px 22px",
  maskImage: "radial-gradient(ellipse 75% 70% at 50% 50%, transparent 35%, black 100%)",
  WebkitMaskImage: "radial-gradient(ellipse 75% 70% at 50% 50%, transparent 35%, black 100%)",
};

// Fondo decorativo de un panel pastel, con el color del tono de la categoría: manchas de color difuminadas,
// textura de puntos, garabatos y anillos grandes, y corazones/destellos sueltos encima.
// Puramente decorativo: va detrás del contenido real (por eso el padre debe envolver su contenido en
// "relative z-10") y se recorta con el overflow-hidden del panel, nunca se ve fuera de sus bordes redondeados.
// Recibe un tono de categoría o, para paneles con colores propios (p. ej. las colecciones de rutinas), los colores directos.
// "sparkles={false}" quita los destellos y deja solo corazones y gotas, para un fondo más calmado.
export function PastelDoodles(props: ({ tone: AccentTone } | { colors: DoodleColors }) & { sparkles?: boolean }) {
  const styles: DoodleColors = "tone" in props ? TONE[props.tone] : props.colors;
  const doodles = props.sparkles === false ? DOODLES.filter((doodle) => doodle.Icon !== SparkleIcon) : DOODLES;
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {/* Manchas de color */}
      <div className={`absolute -left-24 -top-24 h-80 w-80 rounded-full blur-3xl ${styles.blob}`} />
      <div className={`absolute -bottom-32 right-[10%] h-96 w-96 rounded-full blur-3xl ${styles.blob}`} />
      <div className={`absolute left-[30%] top-[35%] h-64 w-64 rounded-full blur-3xl ${styles.blobAlt}`} />
      <div className={`absolute -right-20 -top-16 h-56 w-56 rounded-full blur-3xl ${styles.blobAlt}`} />

      <div className={styles.doodleSoft}>
        {/* Textura de puntos en los bordes */}
        <div className="absolute inset-0" style={DOT_GRID} />

        {/* Garabato ondulado abajo a la izquierda */}
        <svg
          viewBox="0 0 320 120"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          className="absolute -left-6 bottom-[3%] w-72 sm:w-96"
        >
          <path d="M4 80c26-40 52-40 78 0s52 40 78 0 52-40 78 0 52 40 78 0" />
          <path d="M4 104c26-24 52-24 78 0s52 24 78 0 52-24 78 0 52 24 78 0" strokeDasharray="2 10" />
        </svg>

        {/* Anillos arriba a la derecha */}
        <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" className="absolute -right-16 -top-16 w-56 sm:w-72">
          <circle cx="100" cy="100" r="92" strokeWidth="3" />
          <circle cx="100" cy="100" r="68" strokeWidth="2" strokeDasharray="4 12" strokeLinecap="round" />
        </svg>

        {/* Arco suelto a media altura, a la izquierda */}
        <svg
          viewBox="0 0 120 120"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          className="absolute -left-10 top-[22%] w-28 sm:w-36"
        >
          <path d="M20 100A60 60 0 0 1 100 20" />
        </svg>

        {/* Espiral pequeña abajo a la derecha */}
        <svg
          viewBox="0 0 80 80"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          className="absolute bottom-[4%] right-[34%] hidden w-14 lg:block"
        >
          <path d="M40 40c0-4 6-4 6 0 0 8-12 8-12 0 0-12 18-12 18 0 0 16-24 16-24 0" />
        </svg>
      </div>

      {/* Corazones, destellos y gotas */}
      <div className={styles.doodle}>
        {doodles.map((doodle, index) => {
          const { Icon, pos, icon } = doodle;
          const filled = "filled" in doodle && doodle.filled;
          const float = "float" in doodle ? doodle.float : undefined;
          // El wrapper lleva la posición y la animación; el icono, la rotación (la animación pisa "transform").
          return (
            <span
              key={index}
              className={`absolute ${pos} ${float !== undefined ? "animate-float" : ""}`}
              style={float !== undefined ? { animationDelay: `-${float}s` } : undefined}
            >
              <Icon className={`block ${icon} ${filled ? "[&_.heart-fill]:opacity-40" : "[&_.heart-fill]:opacity-0"}`} />
            </span>
          );
        })}
      </div>
    </div>
  );
}
