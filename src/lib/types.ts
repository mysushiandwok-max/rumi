export type ProductArtVariant =
  | "tube"
  | "dropper"
  | "toner"
  | "jar"
  | "pump"
  | "mist"
  | "stick";

export type AccentTone = "blush" | "mint" | "peach" | "lavender";

export type ProductStatus = "draft" | "published";

export type CategoryGuideItem = { label: string; blurb: string; productSlugs: string[] };
export type CategoryGuideGroup = { title: string; items: CategoryGuideItem[] };
export type CategoryComparisonRow = {
  productSlug: string;
  // Vacío = se usan los tipos de piel guardados en el producto.
  skinType: string;
  texture: string;
  keyIngredient: string;
  moment: string;
};
export type CategoryEducationPoint = { title: string; text: string };

// Contenido editable desde el dashboard que se muestra debajo del grid de la categoría.
export type CategoryContent = {
  guide: { title: string; intro: string; groups: CategoryGuideGroup[] };
  comparison: { title: string; rows: CategoryComparisonRow[] };
  education: { title: string; intro: string; points: CategoryEducationPoint[] };
  showMiniBanners: boolean;
};

export type Category = {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  tone: AccentTone;
  artVariant: ProductArtVariant;
  imagePath?: string;
  // Foto ancha (≈1920×570) que reemplaza el banner de color en la página de la categoría y en los mini banners.
  bannerPath?: string;
  content: CategoryContent;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type Brand = { slug: string; name: string; origin: string; tagline: string; description: string; tone: AccentTone };

export type Product = {
  id: number;
  slug: string;
  name: string;
  brandSlug: string;
  categorySlug: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  size: string;
  shortDescription: string;
  description: string;
  howToUse: string[];
  ingredients: string;
  skinTypes: string[];
  badge?: "Bestseller" | "Nuevo" | "Últimas unidades";
  rating: number;
  reviewCount: number;
  artVariant: ProductArtVariant;
  tone: AccentTone;
  featured?: boolean;
  images: string[];
  stock: number;
  lowStockThreshold: number;
  sku?: string;
  status: ProductStatus;
  landing: ProductLanding;
  createdAt: string;
  updatedAt: string;
};

// Contenido de la parte "landing de ventas" de la ficha de producto. Toda sección vacía se oculta.
export type ProductLanding = {
  headline: string;
  // Foto al lado de los beneficios; vacía = primera foto del producto.
  benefitsImage: string;
  benefits: { title: string; text: string }[];
  results: { when: string; text: string }[];
  keyIngredients: { name: string; benefit: string; image: string }[];
  // Foto de textura/swatch junto a los pasos de uso.
  routineImage: string;
  // Banners a todo el ancho: el primero va después de los beneficios, el segundo antes de las reseñas.
  banners: { image: string; title: string; text: string }[];
  // Mini galería de fotos extra (texturas, detalles, lifestyle).
  gallery: string[];
  videos: string[];
  vsRows: { label: string; ours: boolean; others: boolean }[];
  moment: string;
  pairWith: string[];
  compareWith: string[];
  faq: { question: string; answer: string }[];
};

export type RoutineStep = {
  step: number;
  title: string;
  description: string;
  productSlug: string;
};

// Nivel de experiencia que pide la rutina: cuántos pasos/activos tiene que manejar quien la sigue.
export type RoutineLevel = "Iniciación" | "Intermedia" | "Avanzada";

// Vocabulario corto y fijo para el filtro "por tipo de piel" en /rutinas (distinto del texto libre de Product.skinTypes).
export type RoutineSkinType = "Grasa" | "Seca" | "Mixta" | "Sensible" | "Madura" | "Normal" | "Todo tipo de piel";

// Colección de /rutinas a la que pertenece la rutina (las mismas secciones del PDF interno); define el color de su tarjeta.
export type RoutineCollection = "iniciar" | "manana" | "noche" | "tipo-piel" | "clima" | "tendencias";

export type Routine = {
  collection: RoutineCollection;
  slug: string;
  name: string;
  tagline: string;
  skinConcern: string;
  // Para los filtros de /rutinas: nivel, tipo(s) de piel a los que aplica y si es una favorita de la comunidad.
  level: RoutineLevel;
  skinTypes: RoutineSkinType[];
  featured?: boolean;
  timeOfDay: "Mañana" | "Noche" | "Mañana y noche";
  description: string;
  tone: AccentTone;
  steps: RoutineStep[];
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  category: string;
  readTime: string;
  publishedAt: string;
  tone: AccentTone;
};

export type OrderStatus = "pendiente" | "procesando" | "enviado" | "entregado" | "cancelado";
export type PaymentStatus = "pendiente" | "pagado" | "fallido";

export type OrderItem = {
  id: number;
  productSlug: string;
  productName: string;
  unitPrice: number;
  quantity: number;
};

export type ShippingInfo = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  department: string;
  notes?: string;
};

export type Order = {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  department: string;
  notes?: string;
  subtotal: number;
  shippingCost: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  trackingNumber?: string;
  carrier?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
};

export type ReviewStatus = "pending" | "approved" | "rejected";

export type Review = {
  id: number;
  productSlug: string;
  authorName: string;
  authorCity: string | null;
  rating: number;
  comment: string;
  // Fotos que subió la clienta (/uploads/reviews/…webp).
  photos: string[];
  status: ReviewStatus;
  createdAt: string;
};

export type RoutineReview = {
  id: number;
  routineSlug: string;
  authorName: string;
  authorCity: string | null;
  rating: number;
  comment: string;
  status: ReviewStatus;
  createdAt: string;
};

export type RoutineRatingSummary = {
  average: number;
  count: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
};

export type ShippingSettings = {
  freeShippingThreshold: number;
  flatRate: number;
};

export type ConnectorSettings = {
  bold: { apiKey: string; secretKey: string; enabled: boolean };
  carrier: { name: string; apiKey: string; enabled: boolean };
};
