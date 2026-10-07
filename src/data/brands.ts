import type { Brand } from "@/lib/types";

export const brands: Brand[] = [
  {
    slug: "anua",
    name: "Anua",
    origin: "Seúl, Corea del Sur",
    tagline: "Ingredientes reales, resultados reales",
    description:
      "Fórmulas minimalistas centradas en un ingrediente hero por producto, sin rellenos innecesarios. Famosa por su tónico de heartleaf.",
    tone: "mint",
  },
  {
    slug: "beauty-of-joseon",
    name: "Beauty of Joseon",
    origin: "Seúl, Corea del Sur",
    tagline: "Sabiduría de hanbang para la piel moderna",
    description:
      "Combina ingredientes tradicionales coreanos (arroz, ginseng) con dermocosmética moderna en fórmulas suaves y efectivas.",
    tone: "peach",
  },
  {
    slug: "round-lab",
    name: "Round Lab",
    origin: "Provincia de Gangwon, Corea del Sur",
    tagline: "Belleza dermatológica desde la naturaleza",
    description:
      "Inspirada en los ingredientes minerales de Gangwon, crea fórmulas balanceadoras para pieles reactivas y mixtas.",
    tone: "lavender",
  },
  {
    slug: "skin1004",
    name: "SKIN1004",
    origin: "Isla de Madagascar",
    tagline: "Centella asiática en su forma más pura",
    description:
      "Reconocida por su Centella Asiática 100 al cultivarla directamente en Madagascar para máxima pureza y trazabilidad.",
    tone: "mint",
  },
  {
    slug: "tocobo",
    name: "Tocobo",
    origin: "Seúl, Corea del Sur",
    tagline: "Protección solar que se siente como skincare",
    description:
      "Especialistas en sticks y fórmulas de protección solar ligeras, con acabado cosmético y cero rastro blanco.",
    tone: "peach",
  },
  {
    slug: "axis-y",
    name: "Axis-Y",
    origin: "Seúl, Corea del Sur",
    tagline: "Ciencia clínica con conciencia ambiental",
    description:
      "Fórmulas veganas y libres de crueldad animal, enfocadas en ingredientes activos de alta concentración respaldados por estudios clínicos.",
    tone: "peach",
  },
  {
    slug: "firmskin",
    name: "Firmskin",
    origin: "Corea del Sur",
    tagline: "Firmeza clínica para la piel madura",
    description:
      "Marca dermocosmética enfocada en retinal y activos reafirmantes de alta concentración para líneas de expresión y flacidez.",
    tone: "lavender",
  },
  {
    slug: "mixsoon",
    name: "Mixsoon",
    origin: "Corea del Sur",
    tagline: "Un ingrediente, sin rodeos",
    description:
      "Fórmulas de un solo ingrediente hero en su máxima concentración, pensadas para rutinas simples y efectivas.",
    tone: "blush",
  },
  {
    slug: "dr-althea",
    name: "Dr. Althea",
    origin: "Seúl, Corea del Sur",
    tagline: "Dermocosmética desarrollada por dermatólogos",
    description:
      "Línea Pro Lab creada junto a dermatólogos coreanos, con fórmulas concentradas y minimalistas para piel sensible y con imperfecciones.",
    tone: "mint",
  },
  {
    slug: "vt-cosmetics",
    name: "VT Cosmetics",
    origin: "Seúl, Corea del Sur",
    tagline: "Tecnología Cica-Needle para resultados visibles",
    description:
      "Reconocida por su tecnología Reedle Shot (micro-agujas de cera), que impulsa la absorción de activos reafirmantes en la piel.",
    tone: "lavender",
  },
  {
    slug: "nida",
    name: "NIDA",
    origin: "Corea del Sur",
    tagline: "Fórmula joven para toda la piel",
    description:
      "Cremas 'todo en uno' con colágeno, niacinamida y centella asiática, formuladas para líneas de expresión, manchas y sequedad.",
    tone: "peach",
  },
  {
    slug: "cosrx",
    name: "COSRX",
    origin: "Seúl, Corea del Sur",
    tagline: "Skincare simple, sin ingredientes innecesarios",
    description:
      "Pionera del cuidado minimalista coreano, célebre por su mucina de caracol y fórmulas de baja irritación con pocos ingredientes.",
    tone: "mint",
  },
  {
    slug: "numbuzin",
    name: "numbuzin",
    origin: "Seúl, Corea del Sur",
    tagline: "Fórmulas creadas por y para la Gen Z coreana",
    description:
      "Marca joven nacida de la comunidad, enfocada en fórmulas de alta concentración para brillo, luminosidad y manchas.",
    tone: "blush",
  },
  {
    slug: "medicube",
    name: "medicube",
    origin: "Seúl, Corea del Sur",
    tagline: "Skincare de nivel clínico para uso diario",
    description:
      "Desarrollada junto a dermatólogos, combina activos de grado clínico como EGF y péptidos en fórmulas de alta performance.",
    tone: "lavender",
  },
  {
    slug: "arencia",
    name: "Arencia",
    origin: "Corea del Sur",
    tagline: "Activos concentrados en dosis booster",
    description:
      "Especialista en sérums tipo 'shot' de alta concentración, pensados para potenciar rutinas existentes.",
    tone: "peach",
  },
];

export function getBrandBySlug(slug: string) {
  return brands.find((brand) => brand.slug === slug);
}

const POPULARITY_ORDER = [
  "cosrx",
  "beauty-of-joseon",
  "anua",
  "skin1004",
  "round-lab",
  "vt-cosmetics",
  "tocobo",
  "axis-y",
  "mixsoon",
  "dr-althea",
  "nida",
];

export function getBrandsByPopularity(list: Brand[] = brands) {
  const rank = (slug: string) => {
    const index = POPULARITY_ORDER.indexOf(slug);
    return index === -1 ? POPULARITY_ORDER.length : index;
  };
  return [...list].sort((a, b) => rank(a.slug) - rank(b.slug));
}
