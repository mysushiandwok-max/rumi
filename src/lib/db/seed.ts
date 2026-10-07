import type Database from "better-sqlite3";

type SeedCategory = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  tone: string;
  artVariant: string;
  sortOrder: number;
};

type SeedProduct = {
  slug: string;
  name: string;
  brandSlug: string;
  categorySlug: string;
  price: number;
  compareAtPrice?: number;
  size: string;
  shortDescription: string;
  description: string;
  howToUse: string[];
  ingredients: string;
  skinTypes: string[];
  badge?: string;
  rating: number;
  reviewCount: number;
  artVariant: string;
  tone: string;
  featured?: boolean;
};

const SEED_CATEGORIES: SeedCategory[] = [
  {
    slug: "limpiadores",
    name: "Limpiadores",
    tagline: "Piel limpia, corazón feliz",
    description:
      "El primer paso de toda rutina coreana: limpiadores en espuma, en aceite y bálsamos que retiran impurezas sin resecar la piel.",
    tone: "blush",
    artVariant: "tube",
    sortOrder: 0,
  },
  {
    slug: "hidratantes",
    name: "Hidratantes",
    tagline: "Hidratación profunda para cada día",
    description:
      "Cremas y emulsiones que sellan la hidratación y fortalecen la barrera cutánea, para una piel de vidrio todos los días.",
    tone: "mint",
    artVariant: "jar",
    sortOrder: 1,
  },
  {
    slug: "serums",
    name: "Sérums",
    tagline: "Tratamientos que transforman",
    description:
      "Fórmulas concentradas en ingredientes activos coreanos para manchas, textura, luminosidad y firmeza.",
    tone: "peach",
    artVariant: "dropper",
    sortOrder: 2,
  },
  {
    slug: "proteccion-solar",
    name: "Protección solar",
    tagline: "Tu escudo diario contra el sol",
    description:
      "Protectores solares ligeros de acabado invisible, el paso favorito del K-beauty para prevenir el envejecimiento prematuro.",
    tone: "lavender",
    artVariant: "pump",
    sortOrder: 3,
  },
  {
    slug: "tonicos",
    name: "Tónicos",
    tagline: "El puente entre limpieza e hidratación",
    description:
      "Tónicos hidratantes y exfoliantes que preparan la piel para absorber mejor el resto de la rutina.",
    tone: "mint",
    artVariant: "toner",
    sortOrder: 4,
  },
  {
    slug: "mascarillas",
    name: "Mascarillas",
    tagline: "Un momento spa en casa",
    description:
      "Mascarillas en tela, en gel y de dormir para un boost extra de hidratación y luminosidad cuando la piel lo pide.",
    tone: "blush",
    artVariant: "stick",
    sortOrder: 5,
  },
];

const SEED_PRODUCTS: SeedProduct[] = [
  {
    slug: "centella-ampoule-foam",
    name: "Centella Ampoule Foam",
    brandSlug: "skin1004",
    categorySlug: "limpiadores",
    price: 62000,
    size: "120 ml",
    shortDescription: "Espuma calmante con centella asiática para piel sensible.",
    description:
      "Una espuma limpiadora de textura densa que arrastra impurezas y exceso de sebo sin alterar el manto hidrolipídico. Formulada con 70% de extracto de Centella Asiática de Madagascar para calmar la piel desde el primer uso.",
    howToUse: [
      "Aplica una pequeña cantidad sobre piel húmeda.",
      "Masajea en movimientos circulares hasta generar espuma.",
      "Enjuaga con agua tibia.",
    ],
    ingredients: "Centella Asiatica Extract, Sodium Cocoyl Glutamate, Panthenol, Madecassoside.",
    skinTypes: ["Sensible", "Mixta", "Grasa"],
    badge: "Bestseller",
    rating: 4.8,
    reviewCount: 214,
    artVariant: "tube",
    tone: "mint",
    featured: true,
  },
  {
    slug: "heartleaf-77-soothing-toner",
    name: "Heartleaf 77% Soothing Toner",
    brandSlug: "anua",
    categorySlug: "tonicos",
    price: 78000,
    size: "250 ml",
    shortDescription: "Tónico calmante con 77% de extracto de heartleaf.",
    description:
      "El tónico viral de Anua: 77% de extracto de heartleaf fermentado que calma el enrojecimiento, cierra los poros y prepara la piel para el resto de la rutina. Textura ligera tipo agua que se absorbe al instante.",
    howToUse: [
      "Vierte una cantidad generosa en un algodón o en tus manos.",
      "Da golpecitos suaves sobre el rostro limpio.",
      "Puedes aplicar en capas para mayor hidratación.",
    ],
    ingredients: "Houttuynia Cordata Extract, Niacinamide, Panthenol, Betaine.",
    skinTypes: ["Sensible", "Todo tipo de piel"],
    badge: "Bestseller",
    rating: 4.9,
    reviewCount: 389,
    artVariant: "toner",
    tone: "mint",
    featured: true,
  },
  {
    slug: "niacinamide-80-serum",
    name: "Niacinamide 80% Serum",
    brandSlug: "anua",
    categorySlug: "serums",
    price: 89000,
    size: "30 ml",
    shortDescription: "Sérum concentrado para tono desigual y poros visibles.",
    description:
      "Un sérum de alta concentración de niacinamida que unifica el tono, minimiza poros visibles y controla la producción de sebo, sin resecar la piel gracias a su base de betaína.",
    howToUse: [
      "Aplica 2-3 gotas después del tónico.",
      "Extiende suavemente por rostro y cuello.",
      "Sigue con crema hidratante.",
    ],
    ingredients: "Niacinamide, Zinc PCA, Betaine, Panthenol.",
    skinTypes: ["Mixta", "Grasa", "Con manchas"],
    badge: "Bestseller",
    rating: 4.7,
    reviewCount: 301,
    artVariant: "dropper",
    tone: "peach",
    featured: true,
  },
  {
    slug: "green-tea-seed-hyaluronic-cream",
    name: "Green Tea Seed Hyaluronic Cream",
    brandSlug: "innisfree",
    categorySlug: "hidratantes",
    price: 96000,
    size: "50 ml",
    shortDescription: "Crema hidratante con té verde de Jeju y ácido hialurónico.",
    description:
      "Una crema gel ligera que combina té verde de la isla de Jeju con ácido hialurónico de cadena múltiple, para una hidratación profunda de larga duración sin sensación grasa.",
    howToUse: [
      "Aplica como último paso de tu rutina, mañana y noche.",
      "Masajea suavemente hasta absorber por completo.",
    ],
    ingredients: "Camellia Sinensis Leaf Water, Sodium Hyaluronate, Betaine.",
    skinTypes: ["Deshidratada", "Todo tipo de piel"],
    badge: "Nuevo",
    rating: 4.6,
    reviewCount: 128,
    artVariant: "jar",
    tone: "mint",
    featured: true,
  },
  {
    slug: "relief-sun-rice-probiotics",
    name: "Relief Sun: Rice + Probiotics",
    brandSlug: "beauty-of-joseon",
    categorySlug: "proteccion-solar",
    price: 68000,
    size: "50 ml",
    shortDescription: "Protector solar SPF50+ de acabado natural con arroz.",
    description:
      "Protector solar híbrido SPF50+ PA+++ con extracto de arroz y probióticos que deja un acabado natural, sin la clásica capa blanca. El favorito del K-beauty para uso diario bajo maquillaje.",
    howToUse: [
      "Aplica generosamente como último paso de la mañana.",
      "Reaplica cada 2-3 horas si estás en exposición solar directa.",
    ],
    ingredients: "Rice Extract, Niacinamide, Octocrylene, Homosalate.",
    skinTypes: ["Todo tipo de piel"],
    badge: "Bestseller",
    rating: 4.9,
    reviewCount: 512,
    artVariant: "pump",
    tone: "lavender",
    featured: true,
  },
  {
    slug: "dive-in-serum",
    name: "Dive-In Low Molecular Hyaluronic Acid Serum",
    brandSlug: "torriden",
    categorySlug: "serums",
    price: 72000,
    size: "50 ml",
    shortDescription: "Sérum de ácido hialurónico de bajo peso molecular.",
    description:
      "Cinco tipos de ácido hialurónico de bajo peso molecular que penetran capa por capa para una hidratación intensa e inmediata. Textura acuosa, ideal como primer sérum del día.",
    howToUse: ["Aplica 3-4 gotas sobre piel limpia y húmeda.", "Da toques suaves hasta absorber."],
    ingredients: "Sodium Hyaluronate, Panthenol, Allantoin.",
    skinTypes: ["Deshidratada", "Sensible"],
    rating: 4.7,
    reviewCount: 176,
    artVariant: "dropper",
    tone: "blush",
  },
  {
    slug: "birch-juice-moisturizing-sun-cream",
    name: "Birch Juice Moisturizing Sun Cream",
    brandSlug: "round-lab",
    categorySlug: "proteccion-solar",
    price: 64000,
    size: "50 ml",
    shortDescription: "Protector solar hidratante con savia de abedul.",
    description:
      "Combina protección SPF50+ con la hidratación de la savia de abedul de Gangwon, ideal para pieles secas que buscan un solar que también nutra.",
    howToUse: ["Aplica como último paso de tu rutina de mañana.", "Reaplica durante el día."],
    ingredients: "Betula Platyphylla Juice, Niacinamide, Panthenol.",
    skinTypes: ["Seca", "Sensible"],
    badge: "Nuevo",
    rating: 4.5,
    reviewCount: 87,
    artVariant: "pump",
    tone: "lavender",
  },
  {
    slug: "mugwort-cleansing-balm",
    name: "Mugwort Cleansing Balm",
    brandSlug: "beauty-of-joseon",
    categorySlug: "limpiadores",
    price: 58000,
    size: "100 ml",
    shortDescription: "Bálsamo desmaquillante con ajenjo calmante.",
    description:
      "Un bálsamo que se derrite con el calor de la piel para disolver maquillaje y protector solar, con extracto de ajenjo que calma la irritación desde el primer paso de la doble limpieza.",
    howToUse: [
      "Masajea sobre piel seca para disolver maquillaje.",
      "Emulsiona con agua tibia y enjuaga.",
      "Continúa con tu limpiador en espuma.",
    ],
    ingredients: "Artemisia Princeps Extract, Simmondsia Chinensis Oil.",
    skinTypes: ["Sensible", "Todo tipo de piel"],
    rating: 4.8,
    reviewCount: 203,
    artVariant: "jar",
    tone: "blush",
  },
  {
    slug: "centella-asiatica-100-ampoule",
    name: "Centella Asiatica 100 Ampoule",
    brandSlug: "skin1004",
    categorySlug: "serums",
    price: 71000,
    size: "100 ml",
    shortDescription: "Ampolla calmante con 100% extracto de centella.",
    description:
      "Fórmula ultra minimalista con extracto puro de Centella Asiática cultivada en Madagascar. Calma, repara y fortalece la barrera cutánea sin fragancia ni alcohol.",
    howToUse: ["Aplica sobre piel limpia, mañana y noche.", "Da palmaditas suaves hasta absorber."],
    ingredients: "Centella Asiatica Extract 100%.",
    skinTypes: ["Sensible", "Con rojeces"],
    rating: 4.8,
    reviewCount: 267,
    artVariant: "dropper",
    tone: "mint",
  },
  {
    slug: "ceramide-cream",
    name: "Dive-In Ceramide Barrier Cream",
    brandSlug: "torriden",
    categorySlug: "hidratantes",
    price: 82000,
    size: "80 ml",
    shortDescription: "Crema barrera con ceramidas para piel reactiva.",
    description:
      "Una crema rica en 5 tipos de ceramidas que refuerza la barrera cutánea y reduce la sensibilidad, ideal para después de tratamientos activos o en climas fríos y secos.",
    howToUse: ["Aplica como último paso de tu rutina.", "Puedes reforzar en zonas más secas."],
    ingredients: "Ceramide NP, Shea Butter, Panthenol.",
    skinTypes: ["Seca", "Sensible"],
    rating: 4.6,
    reviewCount: 94,
    artVariant: "jar",
    tone: "blush",
  },
  {
    slug: "jeju-volcanic-pore-clay-mask",
    name: "Jeju Volcanic Pore Clay Mask",
    brandSlug: "innisfree",
    categorySlug: "mascarillas",
    price: 54000,
    size: "100 ml",
    shortDescription: "Mascarilla de arcilla volcánica para poros dilatados.",
    description:
      "Arcilla volcánica de doble porosidad de la isla de Jeju que absorbe el exceso de sebo e impurezas, minimizando la apariencia de los poros en un solo uso.",
    howToUse: ["Aplica una capa uniforme, evitando el contorno de ojos.", "Deja actuar 10-15 minutos y enjuaga."],
    ingredients: "Jeju Volcanic Scoria Powder, Kaolin.",
    skinTypes: ["Grasa", "Mixta"],
    rating: 4.5,
    reviewCount: 152,
    artVariant: "stick",
    tone: "mint",
  },
  {
    slug: "revive-eye-serum",
    name: "Revive Eye Serum",
    brandSlug: "round-lab",
    categorySlug: "serums",
    price: 75000,
    size: "20 ml",
    shortDescription: "Sérum de contorno de ojos con cafeína y péptidos.",
    description:
      "Fórmula ligera con cafeína y péptidos que ayuda a reducir la apariencia de ojeras y líneas de expresión en la delicada zona del contorno de ojos.",
    howToUse: ["Aplica pequeños puntos alrededor del contorno de ojos.", "Da golpecitos suaves con el dedo anular."],
    ingredients: "Caffeine, Palmitoyl Tripeptide-1, Panthenol.",
    skinTypes: ["Todo tipo de piel"],
    badge: "Nuevo",
    rating: 4.4,
    reviewCount: 61,
    artVariant: "dropper",
    tone: "lavender",
  },
  {
    slug: "rice-milk-moisture-toner",
    name: "Rice Milk Moisture Toner",
    brandSlug: "beauty-of-joseon",
    categorySlug: "tonicos",
    price: 56000,
    size: "150 ml",
    shortDescription: "Tónico hidratante con leche de arroz y niacinamida.",
    description:
      "Un tónico nutritivo inspirado en las recetas tradicionales coreanas de belleza con arroz, que hidrata y aporta luminosidad desde el primer paso de la rutina.",
    howToUse: ["Aplica con algodón o en manos sobre piel limpia.", "Da palmaditas hasta absorber."],
    ingredients: "Rice Extract, Niacinamide, Beta-Glucan.",
    skinTypes: ["Seca", "Opaca"],
    rating: 4.6,
    reviewCount: 118,
    artVariant: "toner",
    tone: "peach",
  },
  {
    slug: "soon-jung-relief-sun",
    name: "Soonjung Relief Sun SPF50+",
    brandSlug: "round-lab",
    categorySlug: "proteccion-solar",
    price: 61000,
    size: "50 ml",
    shortDescription: "Protector solar mineral para piel muy sensible.",
    description:
      "Filtro 100% mineral formulado sin fragancia ni alcohol, pensado para las pieles más reactivas que no toleran los solares químicos tradicionales.",
    howToUse: ["Aplica generosamente como último paso de la mañana.", "Reaplica cada 2-3 horas."],
    ingredients: "Zinc Oxide, Titanium Dioxide, Panthenol.",
    skinTypes: ["Sensible", "Con rosácea"],
    rating: 4.7,
    reviewCount: 143,
    artVariant: "pump",
    tone: "lavender",
  },
  {
    slug: "sleeping-mask-honey",
    name: "Honey Overnight Sleeping Mask",
    brandSlug: "innisfree",
    categorySlug: "mascarillas",
    price: 69000,
    size: "80 ml",
    shortDescription: "Mascarilla de dormir nutritiva con miel de Jeju.",
    description:
      "Una mascarilla nocturna en textura bálsamo que nutre intensamente mientras duermes, dejando la piel visiblemente más luminosa al despertar.",
    howToUse: ["Aplica como último paso de tu rutina de noche.", "Deja actuar toda la noche y enjuaga por la mañana."],
    ingredients: "Honey Extract, Royal Jelly Extract, Shea Butter.",
    skinTypes: ["Seca", "Opaca"],
    rating: 4.8,
    reviewCount: 176,
    artVariant: "jar",
    tone: "peach",
  },
  {
    slug: "cica-repair-cream",
    name: "Cica Repair Barrier Cream",
    brandSlug: "skin1004",
    categorySlug: "hidratantes",
    price: 74000,
    size: "80 ml",
    shortDescription: "Crema reparadora con centella y ceramidas.",
    description:
      "Combina centella asiática y ceramidas en una textura rica pero no pesada, pensada para reparar la barrera cutánea después de tratamientos activos o exposición ambiental.",
    howToUse: ["Aplica como último paso de tu rutina, mañana y noche."],
    ingredients: "Centella Asiatica Extract, Ceramide NP, Panthenol.",
    skinTypes: ["Sensible", "Deshidratada"],
    rating: 4.7,
    reviewCount: 132,
    artVariant: "jar",
    tone: "mint",
  },
  {
    slug: "milky-bomb-mist",
    name: "Milky Bomb Hydrating Mist",
    brandSlug: "torriden",
    categorySlug: "tonicos",
    price: 49000,
    size: "120 ml",
    shortDescription: "Bruma hidratante para refrescar en cualquier momento.",
    description:
      "Una bruma ligera de ácido hialurónico que puedes usar durante el día sobre maquillaje para refrescar la piel y reforzar la hidratación en segundos.",
    howToUse: ["Agita antes de usar.", "Aplica a una distancia de 20 cm del rostro."],
    ingredients: "Sodium Hyaluronate, Panthenol, Beta-Glucan.",
    skinTypes: ["Todo tipo de piel"],
    badge: "Últimas unidades",
    rating: 4.5,
    reviewCount: 98,
    artVariant: "mist",
    tone: "blush",
  },
];

export function seedIfEmpty(db: Database.Database) {
  const { count } = db.prepare("SELECT COUNT(*) as count FROM categories").get() as { count: number };
  if (count > 0) return;

  const insertCategory = db.prepare(`
    INSERT INTO categories (slug, name, tagline, description, tone, art_variant, sort_order)
    VALUES (@slug, @name, @tagline, @description, @tone, @artVariant, @sortOrder)
  `);

  const insertProduct = db.prepare(`
    INSERT INTO products (
      slug, name, brand_slug, category_slug, price, compare_at_price, size,
      short_description, description, how_to_use, ingredients, skin_types, badge,
      art_variant, tone, featured, images, stock, low_stock_threshold, status,
      rating, review_count
    ) VALUES (
      @slug, @name, @brandSlug, @categorySlug, @price, @compareAtPrice, @size,
      @shortDescription, @description, @howToUse, @ingredients, @skinTypes, @badge,
      @artVariant, @tone, @featured, @images, @stock, @lowStockThreshold, @status,
      @rating, @reviewCount
    )
  `);

  const seedAll = db.transaction(() => {
    for (const category of SEED_CATEGORIES) {
      insertCategory.run(category);
    }
    for (const product of SEED_PRODUCTS) {
      insertProduct.run({
        ...product,
        compareAtPrice: product.compareAtPrice ?? null,
        badge: product.badge ?? null,
        featured: product.featured ? 1 : 0,
        howToUse: JSON.stringify(product.howToUse),
        skinTypes: JSON.stringify(product.skinTypes),
        images: "[]",
        stock: 25,
        lowStockThreshold: 5,
        status: "published",
      });
    }
  });

  seedAll();
}
