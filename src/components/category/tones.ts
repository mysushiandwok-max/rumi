import type { AccentTone } from "@/lib/types";

// Clases de Tailwind escritas completas: Tailwind no genera CSS para nombres armados con plantillas.
export const TONE: Record<
  AccentTone,
  {
    panel: string;
    tile: string;
    thumb: string;
    solid: string;
    chip: string;
    gradient: string;
    rowHover: string;
    // Color de los doodles (corazones/destellos) decorativos sobre un panel pastel de este tono.
    doodle: string;
    // Trazos grandes del fondo (garabatos, anillos, puntos) y manchas de color difuminadas.
    doodleSoft: string;
    blob: string;
    blobAlt: string;
  }
> = {
  blush: {
    panel: "bg-blush-100",
    tile: "bg-blush-100",
    thumb: "bg-blush-50",
    solid: "bg-blush-600",
    chip: "ring-blush-200 hover:ring-blush-300",
    gradient: "from-blush-100 via-blush-100/75",
    rowHover: "hover:bg-blush-50/70",
    doodle: "text-blush-400/75",
    doodleSoft: "text-blush-300/60",
    blob: "bg-blush-200/70",
    blobAlt: "bg-peach-200/50",
  },
  mint: {
    panel: "bg-mint-100",
    tile: "bg-mint-100",
    thumb: "bg-mint-50",
    solid: "bg-mint-600",
    chip: "ring-mint-200 hover:ring-mint-300",
    gradient: "from-mint-100 via-mint-100/75",
    rowHover: "hover:bg-mint-50/70",
    doodle: "text-mint-400/75",
    doodleSoft: "text-mint-300/60",
    blob: "bg-mint-200/70",
    blobAlt: "bg-lavender-200/50",
  },
  peach: {
    panel: "bg-peach-100",
    tile: "bg-peach-100",
    thumb: "bg-peach-50",
    solid: "bg-peach-600",
    chip: "ring-peach-200 hover:ring-peach-300",
    gradient: "from-peach-100 via-peach-100/75",
    rowHover: "hover:bg-peach-50/70",
    doodle: "text-peach-400/75",
    doodleSoft: "text-peach-300/60",
    blob: "bg-peach-200/70",
    blobAlt: "bg-blush-200/50",
  },
  lavender: {
    panel: "bg-lavender-100",
    tile: "bg-lavender-100",
    thumb: "bg-lavender-50",
    solid: "bg-lavender-600",
    chip: "ring-lavender-200 hover:ring-lavender-300",
    gradient: "from-lavender-100 via-lavender-100/75",
    rowHover: "hover:bg-lavender-50/70",
    doodle: "text-lavender-400/75",
    doodleSoft: "text-lavender-300/60",
    blob: "bg-lavender-200/70",
    blobAlt: "bg-blush-200/50",
  },
};
