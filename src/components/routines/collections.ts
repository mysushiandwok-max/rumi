import type { ComponentType } from "react";
import { CloudIcon, DropletIcon, LeafIcon, MoonIcon, SparkleIcon, SunIcon } from "@/components/icons";
import type { RoutineCollection } from "@/lib/types";

// Cada colección de rutinas tiene su propio pastel: el color de la tarjeta dice a qué grupo pertenece
// (y la leyenda/filtro de arriba usa el mismo color, así se lee de un vistazo).
// Clases de Tailwind escritas completas: Tailwind no genera CSS para nombres armados con plantillas.
export const ROUTINE_COLLECTIONS: Record<
  RoutineCollection,
  {
    label: string;
    blurb: string;
    icon: ComponentType<{ className?: string }>;
    // Fondo y borde de la tarjeta.
    card: string;
    // Texto de acento (kicker, "Ver rutina").
    text: string;
    // Chip de la colección sobre la foto y chips de datos.
    chip: string;
    // Botón/flecha y filtro activo.
    solid: string;
    // Decoración del fondo: mancha difuminada y garabatos.
    blob: string;
    doodle: string;
    // Borde del filtro inactivo al pasar el mouse.
    hoverRing: string;
    // Ficha de la rutina (/rutinas/[slug]): fondo del encabezado y de los productos, y colores del fondo decorado.
    surface: string;
    // Fondo del encabezado de la ficha: pastel sólido (no el 50 casi blanco) para que el color se note.
    heroSurface: string;
    heroDoodles: { doodle: string; doodleSoft: string; blob: string; blobAlt: string };
  }
> = {
  iniciar: {
    label: "Para iniciar",
    blurb: "Pocos pasos y fáciles de seguir",
    icon: LeafIcon,
    card: "bg-gradient-to-b from-mint-100 via-mint-50 to-mint-100/70 ring-mint-200/70",
    text: "text-mint-700",
    chip: "bg-mint-100 text-mint-700",
    solid: "bg-mint-700 text-white",
    blob: "bg-mint-200/70",
    doodle: "text-mint-300",
    hoverRing: "can-hover:hover:ring-mint-300",
    surface: "bg-mint-50",
    heroSurface: "bg-mint-100",
    heroDoodles: { doodle: "text-mint-300", doodleSoft: "text-mint-200", blob: "bg-mint-200/40", blobAlt: "bg-mint-200/40" },
  },
  manana: {
    label: "Mañana",
    blurb: "Protección y luz para el día",
    icon: SunIcon,
    card: "bg-gradient-to-b from-butter-100 via-butter-50 to-butter-100/70 ring-butter-200/80",
    text: "text-butter-700",
    chip: "bg-butter-100 text-butter-700",
    solid: "bg-butter-700 text-white",
    blob: "bg-butter-200/70",
    doodle: "text-butter-300",
    hoverRing: "can-hover:hover:ring-butter-300",
    surface: "bg-butter-50",
    heroSurface: "bg-butter-100",
    heroDoodles: { doodle: "text-butter-300", doodleSoft: "text-butter-200", blob: "bg-butter-200/40", blobAlt: "bg-butter-200/40" },
  },
  noche: {
    label: "Noche",
    blurb: "Reparar y tratar mientras duermes",
    icon: MoonIcon,
    card: "bg-gradient-to-b from-lavender-100 via-lavender-50 to-lavender-100/70 ring-lavender-200/70",
    text: "text-lavender-600",
    chip: "bg-lavender-100 text-lavender-600",
    solid: "bg-lavender-600 text-white",
    blob: "bg-lavender-200/70",
    doodle: "text-lavender-300",
    hoverRing: "can-hover:hover:ring-lavender-300",
    surface: "bg-lavender-50",
    heroSurface: "bg-lavender-100",
    heroDoodles: { doodle: "text-lavender-300", doodleSoft: "text-lavender-200", blob: "bg-lavender-200/40", blobAlt: "bg-lavender-200/40" },
  },
  "tipo-piel": {
    label: "Por tipo de piel",
    blurb: "Grasa, seca, mixta, sensible o madura",
    icon: DropletIcon,
    card: "bg-gradient-to-b from-latte-100 via-latte-50 to-latte-100/70 ring-latte-200/80",
    text: "text-latte-700",
    chip: "bg-latte-100 text-latte-700",
    solid: "bg-latte-700 text-white",
    blob: "bg-latte-200/70",
    doodle: "text-latte-300",
    hoverRing: "can-hover:hover:ring-latte-300",
    surface: "bg-latte-50",
    heroSurface: "bg-latte-100",
    heroDoodles: { doodle: "text-latte-300", doodleSoft: "text-latte-200", blob: "bg-latte-200/40", blobAlt: "bg-latte-200/40" },
  },
  clima: {
    label: "Por clima",
    blurb: "Para el calor, el frío o la ciudad",
    icon: CloudIcon,
    card: "bg-gradient-to-b from-peach-100 via-peach-50 to-peach-100/70 ring-peach-200/70",
    text: "text-peach-600",
    chip: "bg-peach-100 text-peach-600",
    solid: "bg-peach-600 text-white",
    blob: "bg-peach-200/70",
    doodle: "text-peach-300",
    hoverRing: "can-hover:hover:ring-peach-300",
    surface: "bg-peach-50",
    heroSurface: "bg-peach-100",
    heroDoodles: { doodle: "text-peach-300", doodleSoft: "text-peach-200", blob: "bg-peach-200/40", blobAlt: "bg-peach-200/40" },
  },
  tendencias: {
    label: "Tendencias",
    blurb: "Lo que se está usando en redes",
    icon: SparkleIcon,
    card: "bg-gradient-to-b from-blush-100 via-blush-50 to-blush-100/70 ring-blush-200/70",
    text: "text-blush-700",
    chip: "bg-blush-100 text-blush-700",
    solid: "bg-blush-600 text-white",
    blob: "bg-blush-200/70",
    doodle: "text-blush-300",
    hoverRing: "can-hover:hover:ring-blush-300",
    surface: "bg-blush-50",
    heroSurface: "bg-blush-100",
    heroDoodles: { doodle: "text-blush-300", doodleSoft: "text-blush-200", blob: "bg-blush-200/40", blobAlt: "bg-blush-200/40" },
  },
};

export const ROUTINE_COLLECTION_ORDER: RoutineCollection[] = ["iniciar", "manana", "noche", "tipo-piel", "clima", "tendencias"];
