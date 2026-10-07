import type Database from "better-sqlite3";
import { normalizeCategoryContent } from "@/lib/category-content";
import type {
  CategoryComparisonRow,
  CategoryContent,
  CategoryEducationPoint,
  CategoryGuideGroup,
  CategoryGuideItem,
} from "@/lib/types";

// Contenido inicial de cada categoría, armado con los datos reales del catálogo (ingredientes, tipos de piel,
// formato). Es un borrador: todo se puede editar desde Admin → Categorías. Solo se aplica a categorías que
// todavía no tienen contenido guardado.

const item = (label: string, blurb: string, ...productSlugs: string[]): CategoryGuideItem => ({
  label,
  blurb,
  productSlugs,
});
const group = (title: string, items: CategoryGuideItem[]): CategoryGuideGroup => ({ title, items });
const row = (
  productSlug: string,
  texture: string,
  keyIngredient: string,
  moment: string,
  skinType = ""
): CategoryComparisonRow => ({ productSlug, skinType, texture, keyIngredient, moment });
const point = (title: string, text: string): CategoryEducationPoint => ({ title, text });

const DEFAULTS: Record<string, CategoryContent> = {
  hidratantes: {
    guide: {
      title: "Encuentra tu crema ideal",
      intro: "Elige cómo quieres buscar y te mostramos lo que mejor encaja.",
      groups: [
        group("Tipo de piel", [
          item(
            "Seca",
            "Busca ácido hialurónico, ceramidas y colágeno que sellen la hidratación durante todo el día.",
            "anua-pdrn-100-moisturizing-cream",
            "nida-ultimate-moisturizing-cream"
          ),
          item(
            "Mixta",
            "Prioriza fórmulas equilibradas que hidraten sin recargar la zona T.",
            "anua-pdrn-100-moisturizing-cream"
          ),
          item(
            "Sensible",
            "Elige fórmulas calmantes con centella, ceramidas y pantenol, y evita mezclar demasiados activos.",
            "dr-althea-345-relief-cream"
          ),
          item(
            "Madura",
            "Péptidos, colágeno y retinoides suaves ayudan a mantener la firmeza y la elasticidad.",
            "anua-pdrn-100-moisturizing-cream",
            "nida-ultimate-moisturizing-cream",
            "nida-revive-eye-cream"
          ),
        ]),
        group("Necesidad", [
          item(
            "Hidratación intensa",
            "Cremas ricas en ácido hialurónico y colágeno para una piel que se siente cómoda y flexible.",
            "anua-pdrn-100-moisturizing-cream",
            "nida-ultimate-moisturizing-cream"
          ),
          item(
            "Calmar y reparar",
            "Ceramidas, pantenol y centella para reforzar la barrera cuando la piel está reactiva.",
            "dr-althea-345-relief-cream"
          ),
          item(
            "Anti-edad",
            "Retinol, retinal y péptidos para trabajar firmeza y líneas de expresión.",
            "anua-360-shot-pdrn-lifting-eye-cream",
            "nida-revive-eye-cream",
            "anua-pdrn-100-moisturizing-cream"
          ),
          item(
            "Contorno de ojos",
            "La piel alrededor de los ojos es más fina y agradece una fórmula pensada para ella.",
            "anua-360-shot-pdrn-lifting-eye-cream",
            "vt-cica-reedle-shot-lifting-eye-cream",
            "nida-revive-eye-cream"
          ),
        ]),
        group("Momento", [
          item(
            "Día",
            "Fórmulas sin retinoides, listas para acompañar tu protector solar.",
            "anua-pdrn-100-moisturizing-cream",
            "dr-althea-345-relief-cream",
            "vt-cica-reedle-shot-lifting-eye-cream"
          ),
          item(
            "Noche",
            "Con retinol o retinal: úsalos de noche y aplica protector solar al día siguiente.",
            "anua-360-shot-pdrn-lifting-eye-cream",
            "nida-revive-eye-cream"
          ),
        ]),
      ],
    },
    comparison: {
      title: "Compara de un vistazo",
      rows: [
        row("anua-pdrn-100-moisturizing-cream", "Crema", "PDRN y ácido hialurónico", "Día y noche"),
        row("nida-ultimate-moisturizing-cream", "Crema", "Colágeno y niacinamida", "Día y noche"),
        row("dr-althea-345-relief-cream", "Crema calmante", "Centella asiática y ceramida NP", "Día y noche"),
        row("vt-cica-reedle-shot-lifting-eye-cream", "Crema para ojos", "Centella asiática", "Día y noche"),
        row("anua-360-shot-pdrn-lifting-eye-cream", "Crema para ojos", "PDRN y retinol", "Noche"),
        row("nida-revive-eye-cream", "Crema para ojos", "Retinal y péptidos", "Noche"),
      ],
    },
    education: {
      title: "¿Cómo elegir tu crema hidratante?",
      intro: "Cuatro ideas para escoger con criterio, sin necesidad de probar todo.",
      points: [
        point(
          "Empieza por tu tipo de piel",
          "La piel seca pide ceramidas, colágeno y ácido hialurónico; la mixta, fórmulas equilibradas que no dejen brillo; la sensible, ingredientes calmantes y pocos activos."
        ),
        point(
          "Fíjate en el ingrediente clave",
          "El ácido hialurónico atrae agua, las ceramidas y el pantenol refuerzan la barrera y la centella calma. Los péptidos y el retinal apuntan a la firmeza."
        ),
        point(
          "Piensa en el momento del día",
          "De día, elige fórmulas que convivan bien con tu protector solar. De noche puedes usar cremas más nutritivas o con activos como retinol o retinal."
        ),
        point(
          "No olvides el contorno de ojos",
          "Es una zona más delgada y delicada. Una crema específica ayuda a hidratarla sin cargar el resto del rostro."
        ),
      ],
    },
    showMiniBanners: true,
  },

  limpiadores: {
    guide: {
      title: "Encuentra tu limpiador",
      intro: "Cuéntanos qué necesitas y te sugerimos por dónde empezar.",
      groups: [
        group("Tipo de piel", [
          item(
            "Sensible",
            "Fórmulas con tensioactivos suaves que limpian sin dejar sensación de tirantez.",
            "skin1004-double-cleansing-duo",
            "round-lab-1025-dokdo-cleanser"
          ),
          item(
            "Todo tipo de piel",
            "Un limpiador equilibrado es la base de cualquier rutina, sea cual sea tu piel.",
            "round-lab-1025-dokdo-cleanser",
            "skin1004-double-cleansing-duo"
          ),
        ]),
        group("Necesidad", [
          item(
            "Desmaquillar",
            "Un aceite limpiador disuelve maquillaje y protector solar; luego una espuma retira el resto.",
            "skin1004-double-cleansing-duo"
          ),
          item(
            "Limpieza diaria suave",
            "Una espuma suave para el día a día que respeta el equilibrio de la piel.",
            "round-lab-1025-dokdo-cleanser"
          ),
        ]),
        group("Momento", [
          item(
            "Mañana",
            "Una limpieza ligera basta para retirar lo acumulado durante la noche.",
            "round-lab-1025-dokdo-cleanser"
          ),
          item(
            "Noche",
            "El momento de la doble limpieza: primero aceite y después espuma.",
            "skin1004-double-cleansing-duo"
          ),
        ]),
      ],
    },
    comparison: {
      title: "Compara de un vistazo",
      rows: [
        row("skin1004-double-cleansing-duo", "Aceite + espuma", "Centella asiática de Madagascar", "Noche"),
        row("round-lab-1025-dokdo-cleanser", "Espuma", "Agua mineral de Dokdo", "Día y noche"),
      ],
    },
    education: {
      title: "¿Cómo elegir tu limpiador facial?",
      intro: "El primer paso de la rutina merece un par de minutos de atención.",
      points: [
        point(
          "Considera la doble limpieza",
          "Si usas maquillaje o protector solar, un aceite limpiador los disuelve primero y una espuma retira lo que queda."
        ),
        point(
          "Busca fórmulas suaves",
          "Un buen limpiador deja la piel limpia, no tirante. Si notas sequedad después de lavarte, la fórmula es demasiado agresiva para ti."
        ),
        point(
          "Adáptalo a tu piel",
          "Las pieles sensibles agradecen ingredientes calmantes como la centella; las mixtas, espumas que limpien sin resecar."
        ),
        point(
          "Cuida el enjuague",
          "Usa agua tibia y enjuaga bien. Los restos de producto pueden irritar y estorbar al resto de tu rutina."
        ),
      ],
    },
    showMiniBanners: true,
  },

  serums: {
    guide: {
      title: "Encuentra tu sérum",
      intro: "Un sérum, una prioridad. Elige por dónde quieres empezar.",
      groups: [
        group("Necesidad", [
          item(
            "Manchas y tono",
            "Niacinamida, vitamina C y ácido tranexámico ayudan a unificar el tono con constancia.",
            "axisy-dark-spot-correcting-glow-serum",
            "dr-althea-vitamin-c-boosting-serum",
            "numbuzin-no5-glutathione-txa-ampoule"
          ),
          item(
            "Hidratación profunda",
            "PDRN, ácido hialurónico y mucina de caracol aportan agua y elasticidad.",
            "anua-pdrn-capsule-100-serum",
            "cosrx-advanced-snail-96-mucin-power-essence"
          ),
          item(
            "Luminosidad",
            "La vitamina C y la centella dan un aspecto más uniforme y radiante.",
            "skin1004-centella-tone-brightening-ampoule",
            "arencia-vitamin-c-booster-shot-duo",
            "dr-althea-vitamin-c-boosting-serum"
          ),
          item(
            "Firmeza",
            "Retinal, péptidos, EGF y NAD+ trabajan la textura y la firmeza de la piel.",
            "firmskin-retinal-03-tightening-booster",
            "medicube-egf-nad-firming-serum"
          ),
        ]),
        group("Tipo de piel", [
          item(
            "Sensible",
            "Activos calmantes como la centella y la mucina de caracol, introducidos de a uno.",
            "skin1004-centella-tone-brightening-ampoule",
            "cosrx-advanced-snail-96-mucin-power-essence"
          ),
          item(
            "Seca o deshidratada",
            "Prioriza ácido hialurónico y PDRN para recuperar confort e hidratación.",
            "anua-pdrn-capsule-100-serum",
            "cosrx-advanced-snail-96-mucin-power-essence"
          ),
          item(
            "Mixta",
            "Niacinamida y centella equilibran el tono sin sobrecargar la piel.",
            "axisy-dark-spot-correcting-glow-serum",
            "skin1004-centella-tone-brightening-ampoule",
            "anua-pdrn-capsule-100-serum"
          ),
          item(
            "Madura",
            "Retinal, EGF y NAD+ para acompañar la firmeza y la elasticidad.",
            "firmskin-retinal-03-tightening-booster",
            "medicube-egf-nad-firming-serum"
          ),
        ]),
        group("Momento", [
          item(
            "Día",
            "La vitamina C es una aliada de la mañana. Termina siempre con protector solar.",
            "dr-althea-vitamin-c-boosting-serum",
            "arencia-vitamin-c-booster-shot-duo"
          ),
          item(
            "Noche",
            "Los retinoides y los activos reparadores rinden mejor mientras duermes.",
            "firmskin-retinal-03-tightening-booster",
            "medicube-egf-nad-firming-serum"
          ),
        ]),
      ],
    },
    comparison: {
      title: "Compara de un vistazo",
      rows: [
        row("skin1004-centella-tone-brightening-ampoule", "Ampolla en cápsula", "Centella asiática de Madagascar", "Día y noche"),
        row("anua-pdrn-capsule-100-serum", "Sérum en cápsula", "PDRN y ácido hialurónico", "Día y noche"),
        row("axisy-dark-spot-correcting-glow-serum", "Sérum", "Niacinamida 3%", "Día y noche"),
        row("dr-althea-vitamin-c-boosting-serum", "Sérum booster", "Vitamina C 63%", "Día"),
        row("arencia-vitamin-c-booster-shot-duo", "Sérum concentrado", "Vitamina C estabilizada", "Día"),
        row("numbuzin-no5-glutathione-txa-ampoule", "Ampolla concentrada", "Glutatión y ácido tranexámico", "Día y noche"),
        row("cosrx-advanced-snail-96-mucin-power-essence", "Esencia", "Mucina de caracol 96%", "Día y noche"),
        row("firmskin-retinal-03-tightening-booster", "Booster", "Retinal 0.3% y Matrixyl", "Noche"),
        row("medicube-egf-nad-firming-serum", "Sérum", "EGF y NAD+", "Día y noche"),
      ],
    },
    education: {
      title: "¿Cómo elegir tu sérum?",
      intro: "Los sérums concentran activos. Elegir bien es cuestión de método.",
      points: [
        point(
          "Define una prioridad",
          "Manchas, hidratación, luminosidad o firmeza. Un sérum enfocado da mejores resultados que varios a la vez."
        ),
        point(
          "Reconoce el activo",
          "Vitamina C para luminosidad, niacinamida para el tono, ácido hialurónico y PDRN para hidratar, retinal para firmeza."
        ),
        point(
          "Introduce de a uno",
          "Prueba un producto nuevo cada vez y observa cómo responde tu piel antes de sumar otro."
        ),
        point(
          "Respeta el momento",
          "Vitamina C por la mañana, retinoides por la noche, y protector solar todos los días."
        ),
      ],
    },
    showMiniBanners: true,
  },

  "proteccion-solar": {
    guide: {
      title: "Encuentra tu protector solar",
      intro: "Todos protegen SPF50+. Cambia la textura, el acabado y el momento de uso.",
      groups: [
        group("Tipo de piel", [
          item(
            "Mixta o grasa",
            "Acabados sedosos y ligeros que no recargan la piel.",
            "tocobo-cotton-soft-sun-stick",
            "birch-juice-moisturizing-sun-cream"
          ),
          item(
            "Sensible",
            "Fórmulas con centella asiática y efecto refrescante para pieles reactivas.",
            "tocobo-cica-cooling-sun-stick"
          ),
          item(
            "Todo tipo de piel",
            "Protectores de acabado natural que funcionan bien en casi cualquier piel.",
            "relief-sun-rice-probiotics",
            "tocobo-vita-waterproof-sun-stick",
            "beauty-of-joseon-relief-sun-aqua-fresh"
          ),
        ]),
        group("Necesidad", [
          item(
            "Uso diario ligero",
            "Texturas cómodas que se sienten poco y no dejan rastro blanco.",
            "relief-sun-rice-probiotics",
            "birch-juice-moisturizing-sun-cream",
            "tocobo-cotton-soft-sun-stick"
          ),
          item(
            "Reaplicar en el día",
            "Un stick permite retocar en segundos, incluso sobre el maquillaje.",
            "tocobo-vita-waterproof-sun-stick",
            "tocobo-cica-cooling-sun-stick",
            "tocobo-cotton-soft-sun-stick"
          ),
          item(
            "Agua y deporte",
            "Una fórmula resistente al agua para días de playa, piscina o entrenamiento.",
            "tocobo-vita-waterproof-sun-stick"
          ),
          item(
            "Calmar después del sol",
            "El efecto refrescante y la centella dan confort a la piel expuesta.",
            "tocobo-cica-cooling-sun-stick"
          ),
        ]),
        group("Momento", [
          item(
            "Mañana",
            "Es el último paso de tu rutina, antes de salir de casa.",
            "relief-sun-rice-probiotics",
            "birch-juice-moisturizing-sun-cream",
            "beauty-of-joseon-relief-sun-aqua-fresh"
          ),
          item(
            "Durante el día",
            "Para retocar cuando pasan las horas, sin deshacer tu look.",
            "tocobo-vita-waterproof-sun-stick",
            "tocobo-cotton-soft-sun-stick"
          ),
        ]),
      ],
    },
    comparison: {
      title: "Compara de un vistazo",
      rows: [
        row("relief-sun-rice-probiotics", "Crema ligera, acabado natural", "Arroz y probióticos", "Día"),
        row("beauty-of-joseon-relief-sun-aqua-fresh", "Crema, acabado fresco", "Arroz y probióticos", "Día"),
        row("birch-juice-moisturizing-sun-cream", "Crema hidratante, acabado fresco", "Savia de abedul", "Día"),
        row("tocobo-vita-waterproof-sun-stick", "Stick resistente al agua", "Niacinamida y vitamina E", "Día"),
        row("tocobo-cica-cooling-sun-stick", "Stick refrescante", "Centella asiática", "Día"),
        row("tocobo-cotton-soft-sun-stick", "Stick de acabado sedoso", "Niacinamida y polvos suavizantes", "Día"),
      ],
    },
    education: {
      title: "¿Cómo elegir tu protector solar?",
      intro: "Es el paso que más impacto tiene a largo plazo. Estas son las claves.",
      points: [
        point(
          "Lee el SPF y el PA",
          "SPF50+ protege de los rayos UVB que queman; PA++++ indica la mayor protección frente a los UVA, relacionados con el envejecimiento."
        ),
        point(
          "Elige según el acabado",
          "En crema para hidratar y cuidar, en stick para retocar y llevar en el bolso. Mejor el que te dé gusto usar cada día."
        ),
        point(
          "Aplica suficiente",
          "Una capa generosa en rostro, cuello y orejas. Si te expones al sol o sudas, reaplica cada dos horas."
        ),
        point(
          "Ten un stick a mano",
          "Reaplicar sobre maquillaje es más fácil con un stick, y te ayuda a no saltarte el retoque."
        ),
      ],
    },
    showMiniBanners: true,
  },

  mascarillas: {
    guide: {
      title: "Encuentra tu mascarilla",
      intro: "Un momento extra para tu piel. Elige lo que necesita hoy.",
      groups: [
        group("Necesidad", [
          item(
            "Hidratación y glow",
            "Texturas hidratantes que dejan la piel con aspecto jugoso y luminoso.",
            "cosrx-advanced-snail-mucin-glass-glow-hydrogel-mask",
            "mixsoon-collagen-tone-skin-mask"
          ),
          item(
            "Luminosidad",
            "Vitamina C y colágeno para una piel de aspecto más uniforme.",
            "anua-kpop-demon-hunters-vita-brightening-collagen-mask",
            "mixsoon-collagen-tone-skin-mask"
          ),
          item(
            "Renovación nocturna",
            "Retinol y niacinamida para trabajar la textura mientras descansas.",
            "anua-kpop-demon-hunters-retinol-niacin-mask"
          ),
        ]),
        group("Momento", [
          item(
            "Noche",
            "Los activos como el retinol se aprovechan mejor de noche.",
            "anua-kpop-demon-hunters-retinol-niacin-mask"
          ),
          item(
            "Cualquier momento",
            "Ideales para un ritual de autocuidado en la mañana, la tarde o antes de salir.",
            "cosrx-advanced-snail-mucin-glass-glow-hydrogel-mask",
            "mixsoon-collagen-tone-skin-mask",
            "anua-kpop-demon-hunters-vita-brightening-collagen-mask"
          ),
        ]),
      ],
    },
    comparison: {
      title: "Compara de un vistazo",
      rows: [
        row("cosrx-advanced-snail-mucin-glass-glow-hydrogel-mask", "Hidrogel", "Mucina de caracol y colágeno", "Cualquier momento"),
        row("mixsoon-collagen-tone-skin-mask", "Mascarilla con brocha", "Colágeno hidrolizado", "Cualquier momento"),
        row("anua-kpop-demon-hunters-vita-brightening-collagen-mask", "Mascarilla", "Vitamina C y colágeno", "Cualquier momento"),
        row("anua-kpop-demon-hunters-retinol-niacin-mask", "Mascarilla nocturna", "Retinol y niacinamida", "Noche"),
      ],
    },
    education: {
      title: "¿Cómo elegir tu mascarilla?",
      intro: "Son un extra, no un paso obligatorio. Úsalas con intención.",
      points: [
        point(
          "Define el objetivo",
          "Hidratar, iluminar o renovar. Cada mascarilla está pensada para una cosa, así que elige la que responda a tu prioridad."
        ),
        point(
          "Mira el activo",
          "Los retinoides se usan de noche y con protector solar al día siguiente. La vitamina C y el colágeno funcionan en cualquier momento."
        ),
        point(
          "Sigue el tiempo de pose",
          "Dejarla más tiempo del indicado no mejora el resultado. Respeta las instrucciones de cada producto."
        ),
        point(
          "Sella con tu crema",
          "Después de retirar la mascarilla, aplica tu crema hidratante para conservar la hidratación."
        ),
      ],
    },
    showMiniBanners: true,
  },
};

// Fotos de banner que ya estaban en public/uploads/banners antes de poder subirlas desde el dashboard.
const LEGACY_CATEGORY_BANNERS: Record<string, string> = {
  limpiadores: "/uploads/banners/limpiadoresbanner.webp",
  hidratantes: "/uploads/banners/hidratantesbanner.webp",
  serums: "/uploads/banners/serumbanner.webp",
  "proteccion-solar": "/uploads/banners/solarbanner.webp",
};

// Solo rellena categorías sin foto: nunca pisa una foto elegida desde el dashboard.
export function backfillLegacyCategoryBanners(db: Database.Database) {
  const fill = db.prepare("UPDATE categories SET banner_path = ? WHERE slug = ? AND banner_path IS NULL");
  for (const [slug, bannerPath] of Object.entries(LEGACY_CATEGORY_BANNERS)) fill.run(bannerPath, slug);
}

export function seedCategoryContentIfEmpty(db: Database.Database) {
  const pending = db
    .prepare("SELECT id, slug FROM categories WHERE content IS NULL")
    .all() as { id: number; slug: string }[];
  if (pending.length === 0) return;
  // Categorías nuevas de una base recién sembrada: estrenan también su foto de banner.
  backfillLegacyCategoryBanners(db);

  const existingProducts = new Set(
    (db.prepare("SELECT slug FROM products").all() as { slug: string }[]).map((product) => product.slug)
  );
  const save = db.prepare("UPDATE categories SET content = ? WHERE id = ?");

  for (const category of pending) {
    const defaults = DEFAULTS[category.slug];
    if (!defaults) continue;

    // Ignora productos que ya no existan para no dejar referencias rotas.
    const content = normalizeCategoryContent({
      ...defaults,
      guide: {
        ...defaults.guide,
        groups: defaults.guide.groups.map((groupItem) => ({
          ...groupItem,
          items: groupItem.items
            .map((guideItem) => ({
              ...guideItem,
              productSlugs: guideItem.productSlugs.filter((slug) => existingProducts.has(slug)),
            }))
            .filter((guideItem) => guideItem.productSlugs.length > 0),
        })),
      },
      comparison: {
        ...defaults.comparison,
        rows: defaults.comparison.rows.filter((comparisonRow) => existingProducts.has(comparisonRow.productSlug)),
      },
    });
    save.run(JSON.stringify(content), category.id);
  }
}
