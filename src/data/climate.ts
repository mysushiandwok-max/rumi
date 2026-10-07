export type ClimateTier = "muy-frio" | "frio" | "templado" | "calido";

export const CITY_CLIMATE: Record<string, ClimateTier> = {
  Bogotá: "frio",
  Manizales: "frio",
  Duitama: "frio",
  Zipaquirá: "frio",
  Sogamoso: "frio",
  Tunja: "muy-frio",
  Pasto: "muy-frio",
  Ipiales: "muy-frio",
  Medellín: "templado",
  Bucaramanga: "templado",
  Pereira: "templado",
  Armenia: "templado",
  Ibagué: "templado",
  Popayán: "templado",
  Cúcuta: "calido",
  Cali: "calido",
  Barranquilla: "calido",
  Cartagena: "calido",
  "Santa Marta": "calido",
  Montería: "calido",
  Villavicencio: "calido",
  Neiva: "calido",
  Valledupar: "calido",
  Sincelejo: "calido",
  Riohacha: "calido",
};

export const CITIES = Object.keys(CITY_CLIMATE).sort((a, b) => a.localeCompare(b, "es"));

export const CLIMATE_INFO: Record<ClimateTier, { label: string; description: string; routineSlugs: string[] }> = {
  "muy-frio": {
    label: "Muy frío",
    description: "Viento seco de alta montaña que reseca y sensibiliza la piel.",
    // Resequedad + piel sensibilizada por el viento: hidratación en capas y calma.
    routineSlugs: ["clima-frio-y-seco", "hidratacion-profunda-nocturna", "piel-sensible-o-con-rojeces", "skin-flooding-7-capas"],
  },
  frio: {
    label: "Frío",
    description: "Clima andino frío y de baja humedad que deshidrata la piel.",
    // Deshidratación, y en ciudad días largos fuera de casa con sol de altura.
    routineSlugs: ["clima-frio-y-seco", "piel-seca", "hidratacion-profunda-nocturna", "dia-largo-con-retoque"],
  },
  templado: {
    label: "Templado",
    description: "Clima de eterna primavera, ideal para empezar una rutina balanceada.",
    // Rutinas balanceadas y ligeras.
    routineSlugs: ["clima-templado", "piel-mixta", "basica-3-pasos", "clean-girl-piel-natural"],
  },
  calido: {
    label: "Cálido",
    description: "Calor, humedad y alta exposición solar que opacan el tono de la piel.",
    // Sudor, grasa y mucho sol: texturas ligeras, protección resistente y recuperación tras el sol.
    routineSlugs: ["clima-calido-y-humedo", "deporte-y-aire-libre", "piel-grasa-o-con-acne", "despues-de-sol-o-playa"],
  },
};
