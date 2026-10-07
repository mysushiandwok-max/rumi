import type { Routine, RoutineSkinType } from "@/lib/types";

// Valor de "?piel=" en /rutinas para cada tipo de piel (sin tildes ni espacios, para que el enlace sea limpio).
export const SKIN_TYPE_SLUGS: Record<string, RoutineSkinType> = {
  grasa: "Grasa",
  seca: "Seca",
  mixta: "Mixta",
  sensible: "Sensible",
  madura: "Madura",
  normal: "Normal",
  todo: "Todo tipo de piel",
};

export function skinTypeSlug(skinType: RoutineSkinType) {
  return Object.keys(SKIN_TYPE_SLUGS).find((slug) => SKIN_TYPE_SLUGS[slug] === skinType) ?? "todo";
}

// Una rutina sirve para un tipo de piel si está hecha para él o para todo tipo de piel
// (si no, "Normal" o "Mixta" se quedarían casi sin rutinas).
export function matchesSkinType(routine: Routine, skinType: RoutineSkinType) {
  return routine.skinTypes.includes(skinType) || routine.skinTypes.includes("Todo tipo de piel");
}

// Las hechas específicamente para ese tipo de piel van primero.
export function isSpecificFor(routine: Routine, skinType: RoutineSkinType) {
  return skinType !== "Todo tipo de piel" && routine.skinTypes.includes(skinType);
}
