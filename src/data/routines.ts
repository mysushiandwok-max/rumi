import type { AccentTone, Routine, RoutineCollection, RoutineLevel, RoutineSkinType, RoutineStep } from "@/lib/types";

// Las 40 rutinas reales de Rumí (ver rutinas-skincare-rumi-40.pdf, uso interno). Armadas solo con
// productos que existen en el catálogo (src/data/products.ts) — cada productSlug debe existir ahí.

// Slugs de producto usados en las rutinas, en un solo lugar para no repetir strings largos ni tipearlos mal.
const P = {
  cleanser: "round-lab-1025-dokdo-cleanser",
  doubleCleanse: "skin1004-double-cleansing-duo",
  essenceSnail: "cosrx-advanced-snail-96-mucin-power-essence",
  creamNida: "nida-ultimate-moisturizing-cream",
  creamAnuaPdrn: "anua-pdrn-100-moisturizing-cream",
  creamDrAlthea: "dr-althea-345-relief-cream",
  spfRice: "relief-sun-rice-probiotics",
  spfBirch: "birch-juice-moisturizing-sun-cream",
  spfAquaFresh: "beauty-of-joseon-relief-sun-aqua-fresh",
  stickCica: "tocobo-cica-cooling-sun-stick",
  stickCotton: "tocobo-cotton-soft-sun-stick",
  stickVita: "tocobo-vita-waterproof-sun-stick",
  serumVitC: "arencia-vitamin-c-booster-shot-duo",
  serumDarkSpot: "axisy-dark-spot-correcting-glow-serum",
  serumVitC63: "dr-althea-vitamin-c-boosting-serum",
  serumRetinal: "firmskin-retinal-03-tightening-booster",
  serumPdrn: "anua-pdrn-capsule-100-serum",
  serumEgf: "medicube-egf-nad-firming-serum",
  ampollaCentella: "skin1004-centella-tone-brightening-ampoule",
  ampollaGlutathione: "numbuzin-no5-glutathione-txa-ampoule",
  eyeAnua360: "anua-360-shot-pdrn-lifting-eye-cream",
  eyeNidaRevive: "nida-revive-eye-cream",
  eyeVt: "vt-cica-reedle-shot-lifting-eye-cream",
  maskHydrogel: "cosrx-advanced-snail-mucin-glass-glow-hydrogel-mask",
} as const;

// Título + descripción genérica por rol de paso, para no repetir el mismo texto largo 160 veces.
// Cualquier paso puede pisar la descripción con la 3ª posición de la tupla cuando el PDF trae una nota puntual.
const ROLE_COPY = {
  limpiador: { title: "Limpiador", description: "Retira impurezas del día y prepara la piel para el resto de la rutina." },
  dobleLimpieza: {
    title: "Doble limpieza",
    description: "Primero el aceite para disolver protector solar y maquillaje, luego la espuma.",
  },
  esencia: { title: "Esencia", description: "Hidrata en una capa ligera y prepara la piel para absorber mejor lo que sigue." },
  serum: { title: "Sérum", description: "Concentra el activo principal de esta rutina." },
  ampolla: { title: "Ampolla", description: "Un boost concentrado del activo principal, en textura ligera." },
  crema: { title: "Crema", description: "Sella la hidratación y refuerza la barrera de la piel." },
  protectorSolar: { title: "Protector solar", description: "El paso que nunca se salta, incluso con el cielo nublado." },
  protectorBarra: {
    title: "Protector en barra",
    description: "Para retocar la protección durante el día sin dañar el maquillaje.",
  },
  contornoOjos: { title: "Contorno de ojos", description: "Cuida la piel más fina y delicada del rostro." },
  mascarilla: { title: "Mascarilla", description: "Un boost extra de tratamiento, 1 o 2 veces por semana." },
} as const;

type Role = keyof typeof ROLE_COPY;
type StepInput = [role: Role, productSlug: string, overrideDescription?: string];

function steps(...entries: StepInput[]): RoutineStep[] {
  return entries.map(([role, productSlug, overrideDescription], index) => ({
    step: index + 1,
    title: ROLE_COPY[role].title,
    description: overrideDescription ?? ROLE_COPY[role].description,
    productSlug,
  }));
}

type RoutineInput = {
  collection: RoutineCollection;
  slug: string;
  name: string;
  tagline: string;
  skinConcern: string;
  level: RoutineLevel;
  skinTypes: RoutineSkinType[];
  featured?: boolean;
  timeOfDay: Routine["timeOfDay"];
  tone: AccentTone;
  description: string;
  steps: RoutineStep[];
};

function routine(input: RoutineInput): Routine {
  return input;
}

export const routines: Routine[] = [
  // ── Para iniciar ──────────────────────────────────────────────────────────
  routine({
    collection: "iniciar",
    slug: "basica-3-pasos",
    name: "Básica 3 pasos",
    tagline: "Lo esencial para arrancar tu piel",
    skinConcern: "Todo tipo de piel, quiere empezar",
    level: "Iniciación",
    skinTypes: ["Todo tipo de piel"],
    featured: true,
    timeOfDay: "Mañana",
    tone: "mint",
    description: "Con 3 productos tienes lo básico cubierto: limpieza, hidratación y protección solar, sin complicarte.",
    steps: steps(["limpiador", P.cleanser], ["crema", P.creamNida], ["protectorSolar", P.spfRice]),
  }),
  routine({
    collection: "iniciar",
    slug: "kit-bestseller",
    name: "Kit Bestseller",
    tagline: "La favorita de la comunidad Rumí",
    skinConcern: "Todo tipo de piel",
    level: "Iniciación",
    skinTypes: ["Todo tipo de piel"],
    featured: true,
    timeOfDay: "Mañana y noche",
    tone: "mint",
    description:
      "El combo que más se repite entre nuestras clientas: limpieza, esencia calmante, hidratación y protector solar. El protector solar va solo en la mañana.",
    steps: steps(
      ["limpiador", P.cleanser],
      ["esencia", P.essenceSnail],
      ["crema", P.creamNida],
      ["protectorSolar", P.spfRice]
    ),
  }),
  routine({
    collection: "iniciar",
    slug: "primera-rutina-de-noche",
    name: "Primera rutina de noche",
    tagline: "Tu primer ritual antes de dormir",
    skinConcern: "Todo tipo de piel, quiere empezar",
    level: "Iniciación",
    skinTypes: ["Todo tipo de piel"],
    timeOfDay: "Noche",
    tone: "mint",
    description: "Tu primera rutina para la noche, con los mismos productos del Kit Bestseller menos el protector solar.",
    steps: steps(["limpiador", P.cleanser], ["esencia", P.essenceSnail], ["crema", P.creamAnuaPdrn]),
  }),
  routine({
    collection: "iniciar",
    slug: "iniciar-piel-sensible",
    name: "Iniciar con piel sensible",
    tagline: "Calma desde el primer día",
    skinConcern: "Piel sensible, primeros pasos",
    level: "Iniciación",
    skinTypes: ["Sensible"],
    timeOfDay: "Mañana",
    tone: "mint",
    description: "Para piel sensible que recién empieza: pocos pasos, ingredientes calmantes y protección mineral suave.",
    steps: steps(["limpiador", P.cleanser], ["crema", P.creamDrAlthea], ["protectorSolar", P.spfRice]),
  }),
  routine({
    collection: "iniciar",
    slug: "iniciar-con-pdrn",
    name: "Iniciar con PDRN",
    tagline: "Hidratación de tendencia, fácil de empezar",
    skinConcern: "Todo tipo de piel",
    level: "Iniciación",
    skinTypes: ["Todo tipo de piel"],
    timeOfDay: "Mañana",
    tone: "mint",
    description:
      "Una rutina de mañana simple que introduce el PDRN, uno de los ingredientes más queridos del K-beauty reciente.",
    steps: steps(["limpiador", P.cleanser], ["crema", P.creamAnuaPdrn], ["protectorSolar", P.spfBirch]),
  }),
  routine({
    collection: "iniciar",
    slug: "minima-de-noche",
    name: "Mínima de noche",
    tagline: "Dos pasos y listo, para noches ocupadas",
    skinConcern: "Todo tipo de piel",
    level: "Iniciación",
    skinTypes: ["Todo tipo de piel"],
    timeOfDay: "Noche",
    tone: "mint",
    description: "Lo mínimo indispensable antes de dormir: limpiar y calmar la piel.",
    steps: steps(["limpiador", P.cleanser], ["crema", P.creamDrAlthea]),
  }),

  // ── Rutinas de mañana (AM) ───────────────────────────────────────────────
  routine({
    collection: "manana",
    slug: "glow-vitamina-c",
    name: "Glow vitamina C",
    tagline: "Luminosidad real desde la mañana",
    skinConcern: "Piel apagada",
    level: "Intermedia",
    skinTypes: ["Todo tipo de piel"],
    timeOfDay: "Mañana",
    tone: "blush",
    description: "Vitamina C desde la mañana para revivir la piel apagada, sellada con hidratación y protección solar.",
    steps: steps(
      ["limpiador", P.cleanser],
      ["serum", P.serumVitC],
      ["crema", P.creamNida],
      ["protectorSolar", P.spfRice]
    ),
  }),
  routine({
    collection: "manana",
    slug: "antimanchas-de-dia",
    name: "Antimanchas de día",
    tagline: "Unifica el tono mientras te proteges",
    skinConcern: "Manchas y tono disparejo",
    level: "Intermedia",
    skinTypes: ["Todo tipo de piel"],
    timeOfDay: "Mañana",
    tone: "blush",
    description: "Ataca el tono disparejo con un sérum despigmentante, protegido con SPF para no generar manchas nuevas.",
    steps: steps(
      ["limpiador", P.cleanser],
      ["serum", P.serumDarkSpot],
      ["crema", P.creamAnuaPdrn],
      ["protectorSolar", P.spfRice]
    ),
  }),
  routine({
    collection: "manana",
    slug: "express-2-pasos",
    name: "Express 2 pasos",
    tagline: "Rápida, directa y efectiva",
    skinConcern: "Para quien tiene prisa",
    level: "Iniciación",
    skinTypes: ["Todo tipo de piel"],
    timeOfDay: "Mañana",
    tone: "blush",
    description: "Dos pasos, cero excusas: limpieza y protección solar para quien no tiene tiempo de una rutina larga.",
    steps: steps(["limpiador", P.cleanser], ["protectorSolar", P.spfRice]),
  }),
  routine({
    collection: "manana",
    slug: "dia-largo-con-retoque",
    name: "Día largo con retoque",
    tagline: "Protección que aguanta toda la jornada",
    skinConcern: "Oficina o ciudad",
    level: "Intermedia",
    skinTypes: ["Todo tipo de piel"],
    timeOfDay: "Mañana",
    tone: "blush",
    description:
      "Pensada para el día de oficina, con un stick para retocar el protector solar al mediodía sin dañar el maquillaje.",
    steps: steps(
      ["limpiador", P.cleanser],
      ["esencia", P.essenceSnail],
      ["protectorSolar", P.spfRice],
      ["protectorBarra", P.stickCotton, "Para retocar al mediodía sin dañar el maquillaje."]
    ),
  }),
  routine({
    collection: "manana",
    slug: "antiedad-de-dia",
    name: "Antiedad de día",
    tagline: "Firmeza que empieza en la mañana",
    skinConcern: "Firmeza",
    level: "Intermedia",
    skinTypes: ["Madura"],
    timeOfDay: "Mañana",
    tone: "blush",
    description: "Un sérum reafirmante de día para trabajar la firmeza mientras proteges la piel del sol.",
    steps: steps(
      ["limpiador", P.cleanser],
      ["serum", P.serumEgf],
      ["crema", P.creamNida],
      ["protectorSolar", P.spfRice]
    ),
  }),
  routine({
    collection: "manana",
    slug: "luminosidad-intensa",
    name: "Luminosidad intensa",
    tagline: "El combo completo contra la piel opaca",
    skinConcern: "Piel apagada y manchas",
    level: "Intermedia",
    skinTypes: ["Todo tipo de piel"],
    featured: true,
    timeOfDay: "Mañana",
    tone: "blush",
    description:
      "La rutina completa para piel opaca y con manchas: vitamina C, snail mucin, PDRN y contorno de ojos en un solo combo.",
    steps: steps(
      ["limpiador", P.cleanser],
      ["serum", P.serumVitC63],
      ["esencia", P.essenceSnail],
      ["crema", P.creamAnuaPdrn],
      ["contornoOjos", P.eyeAnua360],
      ["protectorSolar", P.spfRice]
    ),
  }),

  // ── Rutinas de noche (PM) ────────────────────────────────────────────────
  routine({
    collection: "noche",
    slug: "reparadora-doble-limpieza",
    name: "Reparadora con doble limpieza",
    tagline: "Limpieza a fondo para reparar de noche",
    skinConcern: "Piel cansada del día",
    level: "Intermedia",
    skinTypes: ["Todo tipo de piel"],
    timeOfDay: "Noche",
    tone: "lavender",
    description:
      "Doble limpieza para remover bien el día y una crema calmante que repara mientras duermes. La doble limpieza cuenta como el primer paso completo: primero el aceite, luego la espuma.",
    steps: steps(["dobleLimpieza", P.doubleCleanse], ["esencia", P.essenceSnail], ["crema", P.creamDrAlthea]),
  }),
  routine({
    collection: "noche",
    slug: "antiedad-retinal",
    name: "Antiedad retinal",
    tagline: "Retinal, con cuidado y a tu ritmo",
    skinConcern: "Líneas de expresión",
    level: "Avanzada",
    skinTypes: ["Madura"],
    timeOfDay: "Noche",
    tone: "lavender",
    description:
      "Retinal para líneas de expresión, en dosis controlada. Empezar 2 o 3 noches por semana y usar protector solar al día siguiente sin falta.",
    steps: steps(
      ["dobleLimpieza", P.doubleCleanse],
      ["serum", P.serumRetinal, "Empieza 2 o 3 noches por semana para que la piel se adapte."],
      ["crema", P.creamAnuaPdrn],
      ["contornoOjos", P.eyeNidaRevive, "No lo uses la misma noche que una mascarilla de retinol."]
    ),
  }),
  routine({
    collection: "noche",
    slug: "antimanchas-de-noche",
    name: "Antimanchas de noche",
    tagline: "Ataca las manchas mientras duermes",
    skinConcern: "Manchas",
    level: "Intermedia",
    skinTypes: ["Todo tipo de piel"],
    timeOfDay: "Noche",
    tone: "lavender",
    description: "Una ampolla concentrada ataca las manchas mientras la piel descansa por la noche.",
    steps: steps(["limpiador", P.cleanser], ["ampolla", P.ampollaGlutathione], ["crema", P.creamAnuaPdrn]),
  }),
  routine({
    collection: "noche",
    slug: "glass-skin-pdrn",
    name: "Glass Skin PDRN",
    tagline: "La piel de vidrio que se ve en TikTok",
    skinConcern: "Tendencia",
    level: "Intermedia",
    skinTypes: ["Todo tipo de piel"],
    featured: true,
    timeOfDay: "Noche",
    tone: "lavender",
    description:
      "El combo completo detrás de la piel de vidrio que se volvió tendencia: PDRN en capas, de la esencia al contorno de ojos.",
    steps: steps(
      ["dobleLimpieza", P.doubleCleanse],
      ["esencia", P.essenceSnail],
      ["serum", P.serumPdrn],
      ["crema", P.creamAnuaPdrn],
      ["contornoOjos", P.eyeAnua360]
    ),
  }),
  routine({
    collection: "noche",
    slug: "hidratacion-profunda-nocturna",
    name: "Hidratación profunda",
    tagline: "Capas de hidratación para piel reseca",
    skinConcern: "Piel deshidratada",
    level: "Intermedia",
    skinTypes: ["Seca"],
    timeOfDay: "Noche",
    tone: "lavender",
    description: "Capas de PDRN y una crema rica para piel deshidratada que necesita reponerse durante la noche.",
    steps: steps(
      ["dobleLimpieza", P.doubleCleanse],
      ["esencia", P.essenceSnail],
      ["serum", P.serumPdrn],
      ["crema", P.creamNida]
    ),
  }),
  routine({
    collection: "noche",
    slug: "despues-de-sol-o-playa",
    name: "Después de sol o playa",
    tagline: "Calma la piel después de un día de sol",
    skinConcern: "Piel irritada por el sol",
    level: "Intermedia",
    skinTypes: ["Sensible"],
    timeOfDay: "Noche",
    tone: "lavender",
    description: "Para calmar la piel después de un día de sol o playa, con ingredientes suaves que no irritan más.",
    steps: steps(["limpiador", P.cleanser], ["esencia", P.essenceSnail], ["crema", P.creamDrAlthea]),
  }),
  routine({
    collection: "noche",
    slug: "mirada-descansada",
    name: "Mirada descansada",
    tagline: "Menos ojeras, más descanso",
    skinConcern: "Ojeras y líneas en el contorno",
    level: "Intermedia",
    skinTypes: ["Todo tipo de piel"],
    timeOfDay: "Noche",
    tone: "lavender",
    description: "Un contorno de ojos con retinal se suma a la rutina de noche, para las ojeras y las líneas de expresión.",
    steps: steps(
      ["limpiador", P.cleanser],
      ["esencia", P.essenceSnail],
      ["crema", P.creamAnuaPdrn],
      ["contornoOjos", P.eyeNidaRevive, "Va solo alrededor de los ojos. No usar la misma noche que una mascarilla de retinol."]
    ),
  }),

  // ── Por tipo de piel ─────────────────────────────────────────────────────
  routine({
    collection: "tipo-piel",
    slug: "piel-grasa-o-con-acne",
    name: "Piel grasa o con acné",
    tagline: "Control de brillo sin resecar",
    skinConcern: "Piel grasa",
    level: "Intermedia",
    skinTypes: ["Grasa"],
    timeOfDay: "Mañana",
    tone: "peach",
    description: "Controla el brillo y las imperfecciones sin resecar la piel grasa.",
    steps: steps(["limpiador", P.cleanser], ["serum", P.serumDarkSpot], ["protectorSolar", P.spfAquaFresh]),
  }),
  routine({
    collection: "tipo-piel",
    slug: "piel-seca",
    name: "Piel seca",
    tagline: "Hidratación que sí se siente",
    skinConcern: "Piel seca",
    level: "Intermedia",
    skinTypes: ["Seca"],
    timeOfDay: "Mañana",
    tone: "peach",
    description: "Capas de hidratación pensadas para piel seca que necesita más que una sola crema.",
    steps: steps(
      ["limpiador", P.cleanser],
      ["esencia", P.essenceSnail],
      ["crema", P.creamNida],
      ["protectorSolar", P.spfBirch]
    ),
  }),
  routine({
    collection: "tipo-piel",
    slug: "piel-sensible-o-con-rojeces",
    name: "Piel sensible o con rojeces",
    tagline: "Calma visible, sin irritar más",
    skinConcern: "Piel sensible",
    level: "Intermedia",
    skinTypes: ["Sensible"],
    timeOfDay: "Mañana",
    tone: "peach",
    description: "Ingredientes calmantes para piel sensible o con rojeces, sin fragancia ni activos agresivos.",
    steps: steps(
      ["limpiador", P.cleanser],
      ["ampolla", P.ampollaCentella],
      ["crema", P.creamDrAlthea],
      ["protectorBarra", P.stickCica]
    ),
  }),
  routine({
    collection: "tipo-piel",
    slug: "piel-mixta",
    name: "Piel mixta",
    tagline: "Equilibrio para zona T y mejillas",
    skinConcern: "Piel mixta",
    level: "Intermedia",
    skinTypes: ["Mixta"],
    timeOfDay: "Mañana",
    tone: "peach",
    description: "Equilibra la hidratación entre la zona T y las mejillas. Usa poca crema en la zona T.",
    steps: steps(
      ["limpiador", P.cleanser],
      ["esencia", P.essenceSnail],
      ["crema", P.creamAnuaPdrn],
      ["protectorSolar", P.spfRice]
    ),
  }),
  routine({
    collection: "tipo-piel",
    slug: "piel-grasa-de-noche",
    name: "Piel grasa de noche",
    tagline: "Repara sin sensación grasa",
    skinConcern: "Piel grasa",
    level: "Intermedia",
    skinTypes: ["Grasa"],
    timeOfDay: "Noche",
    tone: "peach",
    description: "Una versión nocturna para piel grasa, ligera pero efectiva contra imperfecciones.",
    steps: steps(["limpiador", P.cleanser], ["serum", P.serumDarkSpot], ["crema", P.creamAnuaPdrn]),
  }),
  routine({
    collection: "tipo-piel",
    slug: "piel-sensible-de-noche",
    name: "Piel sensible de noche",
    tagline: "Descanso nocturno para piel reactiva",
    skinConcern: "Piel sensible",
    level: "Intermedia",
    skinTypes: ["Sensible"],
    timeOfDay: "Noche",
    tone: "peach",
    description: "Contorno de ojos y crema calmante para piel sensible que necesita descansar de noche.",
    steps: steps(
      ["limpiador", P.cleanser],
      ["esencia", P.essenceSnail],
      ["contornoOjos", P.eyeVt],
      ["crema", P.creamDrAlthea]
    ),
  }),
  routine({
    collection: "tipo-piel",
    slug: "piel-madura-firmeza",
    name: "Piel madura / firmeza",
    tagline: "Firmeza visible, paso a paso",
    skinConcern: "Piel madura",
    level: "Intermedia",
    skinTypes: ["Madura"],
    timeOfDay: "Mañana",
    tone: "peach",
    description: "Un sérum reafirmante, contorno de ojos y protección solar para trabajar la firmeza de piel madura.",
    steps: steps(
      ["limpiador", P.cleanser],
      ["serum", P.serumEgf],
      ["crema", P.creamAnuaPdrn],
      ["contornoOjos", P.eyeVt],
      ["protectorSolar", P.spfRice]
    ),
  }),

  // ── Por clima ────────────────────────────────────────────────────────────
  routine({
    collection: "clima",
    slug: "clima-calido-y-humedo",
    name: "Clima cálido y húmedo",
    tagline: "Ligera para el calor y la humedad",
    skinConcern: "Costa y playa",
    level: "Intermedia",
    skinTypes: ["Todo tipo de piel"],
    timeOfDay: "Mañana",
    tone: "mint",
    description: "Texturas ligeras para climas cálidos y húmedos, con un stick para retocar durante el día.",
    steps: steps(
      ["limpiador", P.cleanser],
      ["esencia", P.essenceSnail],
      ["protectorSolar", P.spfAquaFresh],
      ["protectorBarra", P.stickVita, "Para retocar la protección durante el día."]
    ),
  }),
  routine({
    collection: "clima",
    slug: "clima-frio-y-seco",
    name: "Clima frío y seco",
    tagline: "Capas extra para el frío",
    skinConcern: "Ciudades frías",
    level: "Intermedia",
    skinTypes: ["Seca"],
    timeOfDay: "Mañana",
    tone: "mint",
    description: "Más capas de hidratación para climas fríos y secos que deshidratan la piel rápido.",
    steps: steps(
      ["limpiador", P.cleanser],
      ["esencia", P.essenceSnail],
      ["serum", P.serumPdrn],
      ["crema", P.creamNida],
      ["protectorSolar", P.spfBirch]
    ),
  }),
  routine({
    collection: "clima",
    slug: "deporte-y-aire-libre",
    name: "Deporte y aire libre",
    tagline: "Protección que aguanta el sudor",
    skinConcern: "Sudor y sol fuerte",
    level: "Iniciación",
    skinTypes: ["Todo tipo de piel"],
    timeOfDay: "Mañana",
    tone: "mint",
    description: "Protección resistente al sudor para quienes entrenan o pasan el día al aire libre.",
    steps: steps(
      ["limpiador", P.cleanser],
      ["protectorSolar", P.spfAquaFresh],
      ["protectorBarra", P.stickVita, "Retocar cada 2 horas o después de sudar o nadar."]
    ),
  }),
  routine({
    collection: "clima",
    slug: "clima-templado",
    name: "Clima templado",
    tagline: "El balance perfecto para clima templado",
    skinConcern: "Clima templado",
    level: "Intermedia",
    skinTypes: ["Todo tipo de piel"],
    timeOfDay: "Mañana",
    tone: "mint",
    description: "El balance justo de hidratación y protección para climas templados, ni muy secos ni muy húmedos.",
    steps: steps(
      ["limpiador", P.cleanser],
      ["ampolla", P.ampollaCentella],
      ["crema", P.creamAnuaPdrn],
      ["protectorSolar", P.spfRice]
    ),
  }),

  // ── Inspiradas en tendencias de TikTok ───────────────────────────────────
  routine({
    collection: "tendencias",
    slug: "skin-cycling-noche-de-retinal",
    name: "Skin Cycling · Noche de retinal",
    tagline: "La noche fuerte del método skin cycling",
    skinConcern: "Tendencia: skin cycling",
    level: "Avanzada",
    skinTypes: ["Todo tipo de piel"],
    timeOfDay: "Noche",
    tone: "blush",
    description:
      "La noche fuerte del ciclo, con retinal para renovar la piel. Se sigue de 2 noches de recuperación antes de repetir. El skin cycling original incluye una noche de exfoliante, que por ahora no hay en el catálogo.",
    steps: steps(["limpiador", P.cleanser], ["serum", P.serumRetinal], ["crema", P.creamAnuaPdrn]),
  }),
  routine({
    collection: "tendencias",
    slug: "skin-cycling-noche-de-recuperacion",
    name: "Skin Cycling · Noche de recuperación",
    tagline: "La noche de descanso que completa el ciclo",
    skinConcern: "Tendencia: skin cycling",
    level: "Intermedia",
    skinTypes: ["Todo tipo de piel"],
    timeOfDay: "Noche",
    tone: "mint",
    description: "Las 2 noches de descanso después de la noche de retinal, sin activos fuertes, solo hidratación.",
    steps: steps(
      ["limpiador", P.cleanser],
      ["esencia", P.essenceSnail],
      ["serum", P.serumPdrn],
      ["crema", P.creamDrAlthea]
    ),
  }),
  routine({
    collection: "tendencias",
    slug: "metodo-sandwich-de-retinal",
    name: "Método sándwich de retinal",
    tagline: "Retinal protegido entre dos capas de crema",
    skinConcern: "Tendencia: retinol sandwich",
    level: "Avanzada",
    skinTypes: ["Sensible"],
    timeOfDay: "Noche",
    tone: "peach",
    description:
      "El retinal va protegido entre dos capas de crema para reducir la irritación. Ideal para quien empieza con retinal o tiene piel sensible.",
    steps: steps(
      ["limpiador", P.cleanser],
      ["crema", P.creamNida, "Una capa ligera antes del retinal, para amortiguar la irritación."],
      ["serum", P.serumRetinal],
      ["crema", P.creamDrAlthea, "Una capa más densa después del retinal, para sellar y calmar."]
    ),
  }),
  routine({
    collection: "tendencias",
    slug: "doble-limpieza-viral",
    name: "Doble limpieza viral",
    tagline: "El método coreano que arrasa en TikTok",
    skinConcern: "Tendencia: double cleansing",
    level: "Intermedia",
    skinTypes: ["Todo tipo de piel"],
    timeOfDay: "Noche",
    tone: "lavender",
    description:
      "El método de doble limpieza que se volvió viral: primero el aceite en piel seca para disolver protector solar y maquillaje, luego la espuma.",
    steps: steps(["dobleLimpieza", P.doubleCleanse], ["esencia", P.essenceSnail], ["crema", P.creamNida]),
  }),
  routine({
    collection: "tendencias",
    slug: "skin-flooding-7-capas",
    name: "Skin flooding (método 7 capas)",
    tagline: "Hidratación en capas, la tendencia viral",
    skinConcern: "Tendencia: 7 skin method",
    level: "Intermedia",
    skinTypes: ["Todo tipo de piel"],
    featured: true,
    timeOfDay: "Noche",
    tone: "blush",
    description: "El método de las 7 capas de esencia, aplicada de a poco, para una hidratación intensa.",
    steps: steps(
      ["limpiador", P.cleanser],
      ["esencia", P.essenceSnail, "Aplícala en 2 o 3 capas finas, dejando absorber cada una, antes del sérum."],
      ["serum", P.serumPdrn],
      ["crema", P.creamAnuaPdrn]
    ),
  }),
  routine({
    collection: "tendencias",
    slug: "glass-skin-de-dia",
    name: "Glass skin de día",
    tagline: "Base luminosa antes del maquillaje",
    skinConcern: "Base luminosa para maquillaje",
    level: "Intermedia",
    skinTypes: ["Todo tipo de piel"],
    timeOfDay: "Mañana",
    tone: "mint",
    description: "Un protector solar con acabado luminoso funciona como base antes del maquillaje.",
    steps: steps(
      ["limpiador", P.cleanser],
      ["esencia", P.essenceSnail],
      ["ampolla", P.ampollaCentella],
      ["protectorSolar", P.spfRice, "Deja un acabado luminoso, perfecto como base antes del maquillaje."]
    ),
  }),
  routine({
    collection: "tendencias",
    slug: "pdrn-mas-vitamina-c",
    name: "PDRN + vitamina C",
    tagline: "Dos tendencias, una sola rutina",
    skinConcern: "Tendencia 2026: PDRN",
    level: "Intermedia",
    skinTypes: ["Todo tipo de piel"],
    timeOfDay: "Mañana",
    tone: "peach",
    description: "Dos tendencias del momento combinadas: vitamina C en la mañana y PDRN para hidratar y dar firmeza.",
    steps: steps(
      ["limpiador", P.cleanser],
      ["serum", P.serumVitC],
      ["crema", P.creamAnuaPdrn],
      ["protectorSolar", P.spfRice]
    ),
  }),
  routine({
    collection: "tendencias",
    slug: "noche-de-mascarilla-hydrogel",
    name: "Noche de mascarilla hydrogel",
    tagline: "Un extra de hidratación, 1 o 2 veces por semana",
    skinConcern: "Tendencia: mascarillas hydrogel",
    level: "Intermedia",
    skinTypes: ["Todo tipo de piel"],
    timeOfDay: "Noche",
    tone: "lavender",
    description: "Una mascarilla hydrogel como extra de hidratación, para sumar a cualquier rutina de noche.",
    steps: steps(
      ["limpiador", P.cleanser],
      ["esencia", P.essenceSnail],
      ["mascarilla", P.maskHydrogel, "Déjala el tiempo que indique el empaque y sella con la crema. 1 o 2 veces por semana."],
      ["crema", P.creamAnuaPdrn]
    ),
  }),
  routine({
    collection: "tendencias",
    slug: "skinimalism-3-productos",
    name: "Skinimalism: 3 productos",
    tagline: "Menos pasos, resultados reales",
    skinConcern: "Rutinas minimalistas",
    level: "Iniciación",
    skinTypes: ["Todo tipo de piel"],
    timeOfDay: "Mañana",
    tone: "blush",
    description: "La tendencia skinimalism en su versión más simple: solo 3 productos, sin relleno.",
    steps: steps(["limpiador", P.cleanser], ["crema", P.creamDrAlthea], ["protectorSolar", P.spfAquaFresh]),
  }),
  routine({
    collection: "tendencias",
    slug: "clean-girl-piel-natural",
    name: "Clean girl: piel natural",
    tagline: "El look natural que domina redes",
    skinConcern: "Tendencia: clean girl",
    level: "Iniciación",
    skinTypes: ["Todo tipo de piel"],
    featured: true,
    timeOfDay: "Mañana",
    tone: "mint",
    description: "El look \"clean girl\" que domina redes: piel natural, luminosa y sin necesidad de maquillaje.",
    steps: steps(
      ["limpiador", P.cleanser],
      ["esencia", P.essenceSnail],
      ["contornoOjos", P.eyeAnua360],
      ["protectorSolar", P.spfRice]
    ),
  }),
];

export function getRoutineBySlug(slug: string) {
  return routines.find((r) => r.slug === slug);
}

// Rutinas parecidas a una dada, para "Rutinas que también te pueden gustar": suma puntos por misma colección,
// tipos de piel específicos en común, mismo momento del día y mismo nivel. `exclude` evita repetir las que
// ya se muestran en otra parte (p. ej. la anterior y la siguiente).
export function getSuggestedRoutines(routine: Routine, limit = 3, exclude: string[] = []) {
  const skip = new Set([routine.slug, ...exclude]);
  const specificSkin = routine.skinTypes.filter((type) => type !== "Todo tipo de piel");
  const sameMoment = (other: Routine) =>
    other.timeOfDay === routine.timeOfDay || other.timeOfDay === "Mañana y noche" || routine.timeOfDay === "Mañana y noche";

  return routines
    .filter((other) => !skip.has(other.slug))
    .map((other) => {
      let score = 0;
      if (other.collection === routine.collection) score += 3;
      score += 2 * specificSkin.filter((type) => other.skinTypes.includes(type)).length;
      if (sameMoment(other)) score += 1;
      if (other.level === routine.level) score += 1;
      if (other.featured) score += 0.5;
      return { other, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ other }) => other);
}

// Rutinas que usan un producto, para "Rutinas con este producto" en su ficha: primero las favoritas
// de la comunidad y, a igualdad, las más cortas (más fáciles de empezar).
export function getRoutinesWithProduct(productSlug: string, limit = 3) {
  return routines
    .filter((routine) => routine.steps.some((step) => step.productSlug === productSlug))
    .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || a.steps.length - b.steps.length)
    .slice(0, limit);
}
