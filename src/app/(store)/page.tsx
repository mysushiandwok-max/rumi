import Link from "next/link";
import { HeroPodium } from "@/components/HeroPodium";
import { CategoryCard, type CardPalette } from "@/components/CategoryCard";
import { ProductCarousel } from "@/components/ProductCarousel";
import { BrandCarousel } from "@/components/BrandCarousel";
import { SectionHeading } from "@/components/SectionHeading";
import { RatingStars } from "@/components/RatingStars";
import { AccordionItem } from "@/components/Accordion";
import { ClimateRoutineFinder } from "@/components/ClimateRoutineFinder";
import { RoutineStarterTiles } from "@/components/RoutineStarterTiles";
import { matchesSkinType, SKIN_TYPE_SLUGS } from "@/components/routines/skin-types";
import {
  ArrowRightIcon,
  LeafIcon,
  HeartIcon,
  SparkleIcon,
  StarIcon,
  TikTokIcon,
  DropletIcon,
  SunIcon,
  EyeIcon,
  RefreshIcon,
  TrendUpIcon,
  SpotIcon,
  SearchIcon,
  HourglassIcon,
  ScrubIcon,
} from "@/components/icons";
import { getAllCategories } from "@/data/categories";
import { getAllProducts, getFeaturedProducts, getProductBySlug, getProductsByCategory } from "@/data/products";
import { BannerProductChip } from "@/components/BannerProductChip";
import { getFeaturedReviews } from "@/data/reviews";
import { TikTokVideosSection, type TikTokVideo } from "@/components/TikTokVideosSection";
import { TestimonialsCarousel } from "@/components/TestimonialsCarousel";
import { brands } from "@/data/brands";
import { CLIMATE_INFO } from "@/data/climate";
import { getRoutineBySlug, routines } from "@/data/routines";
import type { Product } from "@/lib/types";
import { getRoutinePreviewProducts } from "@/lib/routine-previews";
import { getFiveStarPhotoReviews } from "@/lib/admin/reviews";
import { ReviewWall } from "@/components/product/ReviewWall";

// Productos tendencia en TikTok: el video va en /public/uploads/tiktok (vacío = "Video próximamente").
const TIKTOK_VIDEOS = [
  { slug: "relief-sun-rice-probiotics", video: "" },
  { slug: "birch-juice-moisturizing-sun-cream", video: "" },
  { slug: "anua-pdrn-100-moisturizing-cream", video: "" },
  { slug: "vt-cica-reedle-shot-lifting-eye-cream", video: "" },
];

const CONCERN_TILE_STYLES: Record<string, { bg: string; text: string }> = {
  mint: { bg: "bg-mint-100", text: "text-mint-600" },
  peach: { bg: "bg-peach-100", text: "text-peach-600" },
  lavender: { bg: "bg-lavender-100", text: "text-lavender-600" },
  blush: { bg: "bg-blush-100", text: "text-blush-600" },
};

const SKIN_CONCERNS = [
  { label: "Hidratación", icon: DropletIcon, tone: "mint", query: "hidrat" },
  { label: "Luminosidad", icon: SparkleIcon, tone: "peach", query: "lumin" },
  { label: "Manchas", icon: StarIcon, tone: "lavender", query: "manchas" },
  { label: "Acné", icon: SpotIcon, tone: "blush", query: "imperfecciones" },
  { label: "Poros", icon: SearchIcon, tone: "mint", query: "poros" },
  { label: "Firmeza", icon: TrendUpIcon, tone: "peach", query: "firm" },
  { label: "Antiedad", icon: HourglassIcon, tone: "lavender", query: "retin" },
  { label: "Sensibilidad", icon: LeafIcon, tone: "blush", query: "sensible" },
  { label: "Protección solar", icon: SunIcon, tone: "mint", query: "protector" },
  { label: "Limpieza", icon: RefreshIcon, tone: "peach", query: "limpi" },
  { label: "Exfoliación", icon: ScrubIcon, tone: "lavender", query: "exfoliación" },
  { label: "Contorno de ojos", icon: EyeIcon, tone: "blush", query: "contorno de ojos" },
] as const;

const FAQ_ITEMS = [
  {
    question: "¿Envían a todo Colombia?",
    answer:
      "Sí, a todo el país. El costo y el tiempo dependen de tu ciudad, y los ves en el checkout antes de pagar.",
  },
  {
    question: "¿Cuánto tarda en llegar mi pedido?",
    answer:
      "Entre 1 y 5 días hábiles, según tu ciudad. Apenas lo despachamos te mandamos el número de guía para que lo sigas.",
  },
  {
    question: "¿Puedo cambiar o devolver un producto?",
    answer: "Sí. Tienes 5 días hábiles para retractarte de la compra y 30 días para cambiar el producto, siempre que siga sellado. Si te llega defectuoso, lo resolvemos con la garantía legal.",
  },
  {
    question: "¿Los productos son 100% originales?",
    answer:
      "Sí, todos. Trabajamos directo con las marcas coreanas, así que lo que te llega es original e importado.",
  },
  {
    question: "¿Qué métodos de pago aceptan?",
    answer: "Pagas con Bold: tarjeta de crédito o débito (Visa, Mastercard, American Express y Diners Club), PSE, Nequi o Botón Bancolombia.",
  },
] as const;

// Segunda tanda de categorías, debajo del carrusel de "Lo más amado". Se elige por slug (no por slice)
// para controlar el orden exacto sin depender del sort_order que usan el admin y el resto del sitio.
const MORE_CATEGORIES_SLUGS = ["tonicos", "exfoliantes", "contorno-de-ojos", "cuidado-de-labios"];
// Mismos colores y orden que las tarjetas de las categorías principales (rosa, menta, durazno, lavanda).
const MORE_CATEGORIES_PALETTES: CardPalette[] = ["blush", "mint", "peach", "lavender"];

export default function HomePage() {
  const categories = getAllCategories();
  const moreCategories = MORE_CATEGORIES_SLUGS.map((slug) => categories.find((category) => category.slug === slug)).filter(
    (category): category is (typeof categories)[number] => Boolean(category)
  );
  const featured = getFeaturedProducts();
  const newProducts = getAllProducts()
    .filter((product) => product.images.length > 0)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);
  const reviews = getFeaturedReviews(10);
  const photoReviews = getFiveStarPhotoReviews(4);
  const tiktokVideos = TIKTOK_VIDEOS.flatMap(({ slug, video }) => {
    const product = getProductBySlug(slug);
    return product ? [{ product, video } satisfies TikTokVideo] : [];
  });
  const maskProducts = getProductsByCategory("mascarillas")
    .slice()
    .sort((a, b) => Number(b.images.length > 0) - Number(a.images.length > 0))
    .slice(0, 3);
  // Productos de cada rutina del buscador por clima, para su collage.
  const climateRoutineProducts: Record<string, Product[]> = {};
  for (const { routineSlugs } of Object.values(CLIMATE_INFO)) {
    for (const routineSlug of routineSlugs) {
      const routine = getRoutineBySlug(routineSlug);
      if (routine) climateRoutineProducts[routineSlug] = getRoutinePreviewProducts(routine);
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="container-page pt-10 sm:pt-14">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="animate-fade-up">
            <h1 className="font-display text-3xl font-bold leading-[1.1] text-ink sm:text-4xl lg:text-[2.75rem]">
              Skincare coreano original en Colombia
              <span className="text-blush-500"> con envío a todo el país</span>
            </h1>
            <p className="mt-3 font-display text-xl font-semibold text-ink sm:text-2xl">
              Rutinas K-Beauty para tu tipo de piel
            </p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-ink/60">
              Fórmulas suaves, con ingredientes que hacen su trabajo. Y si no
              sabes qué usar ni en qué orden, te ayudamos a armar tu rutina.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/tienda" className="btn-primary px-7 py-3.5 text-sm sm:text-base">
                Comprar ahora
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link href="/rutinas" className="btn-ghost px-6 py-3.5 text-sm sm:text-base">
                Arma tu rutina
              </Link>
            </div>

            <div className="mt-8">
              <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-4">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/uploads/icons/corea.svg" alt="" className="h-9 w-9 shrink-0" />
                  <span className="font-display text-sm font-bold leading-tight text-ink">
                    Productos originales
                    <br /> desde Corea
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/uploads/icons/colombia.svg" alt="" className="h-9 w-9 shrink-0" />
                  <span className="font-display text-sm font-bold leading-tight text-ink">
                    Cobertura
                    <br /> nacional
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/uploads/icons/pagos.svg" alt="" className="h-9 w-9 shrink-0" />
                  <span className="font-display text-sm font-bold leading-tight text-ink">
                    Pagos seguros
                  </span>
                </div>
              </div>
              <div className="mt-6 flex justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/uploads/icons/bold.svg" alt="" className="h-auto w-72 shrink-0" />
              </div>
            </div>
          </div>

          <div className="animate-fade-up [animation-delay:80ms]">
            <HeroPodium />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container-page mt-16 sm:mt-24">
        <SectionHeading
          kicker="CATEGORÍAS"
          title="Explora por"
          highlight="categoría"
          subtitle="¿Qué paso le falta a tu rutina? Empieza por ahí."
        />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.slice(0, 4).map((category) => (
            <div key={category.slug} className="h-56">
              <CategoryCard category={category} />
            </div>
          ))}
        </div>
      </section>

      {/* Marcas */}
      <section className="container-page mt-20 sm:mt-28">
        <SectionHeading
          kicker="MARCAS"
          title="Marcas que"
          highlight="amamos"
          subtitle="Las marcas coreanas que más nos piden, y otras que te vamos a hacer querer"
          linkHref="/marcas"
          linkLabel="Ver todas las marcas"
        />
        <BrandCarousel brands={brands} />
      </section>

      {/* Lo más amado */}
      <section className="container-page mt-20 sm:mt-28">
        <SectionHeading
          kicker="PRODUCTOS DESTACADOS"
          title="Lo más"
          highlight="amado"
          icon={<HeartIcon className="h-5 w-5 text-blush-500" />}
          subtitle="Los que más se llevan nuestras clientas"
          linkHref="/tienda"
          linkLabel="Ver todos los productos"
        />
        <ProductCarousel products={featured} />
      </section>

      {/* Más categorías */}
      {moreCategories.length > 0 && (
        <section className="container-page mt-20 sm:mt-28">
          <SectionHeading
            kicker="MÁS CATEGORÍAS"
            title="Sigue completando"
            highlight="tu rutina"
            subtitle="Tónico, exfoliante, contorno de ojos y labios: los pasos que solemos saltarnos"
          />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {moreCategories.map((category, index) => (
              <div key={category.slug} className="h-56">
                <CategoryCard category={category} palette={MORE_CATEGORIES_PALETTES[index % MORE_CATEGORIES_PALETTES.length]} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tendencia en TikTok */}
      {tiktokVideos.length > 0 && (
        <section className="relative mt-20 overflow-hidden bg-blush-50/70 py-16 sm:mt-28 sm:py-20">
          <HeartIcon fill="currentColor" className="pointer-events-none absolute left-[6%] top-16 h-10 w-10 -rotate-12 text-blush-200" />
          <HeartIcon fill="currentColor" className="pointer-events-none absolute right-[8%] top-24 h-7 w-7 rotate-12 text-lavender-200" />
          <HeartIcon className="pointer-events-none absolute bottom-16 left-[45%] h-6 w-6 text-blush-200" />
          <div className="container-page relative">
            <SectionHeading
              kicker={
                <>
                  <TikTokIcon className="h-3 w-3" /> TENDENCIA EN TIKTOK
                </>
              }
              title="Lo que está"
              highlight="arrasando en TikTok"
              icon={<HeartIcon className="h-5 w-5 text-blush-500" />}
              subtitle="Seguro ya te salieron en el For You. Dale play y míralos en uso."
            />
            <TikTokVideosSection items={tiktokVideos} />
          </div>
        </section>
      )}

      {/* Rutinas */}
      <section className="relative overflow-hidden py-16 sm:py-20">
        <div
          className="absolute inset-0 bg-blush-100 bg-cover bg-center"
          style={{ backgroundImage: "url(/uploads/banners/rutinas-bg.webp)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cream/85 via-cream/70 to-cream/90" />
        <div className="container-page relative">
          <SectionHeading
            kicker="RUTINAS"
            title="Encuentra tu"
            highlight="rutina ideal"
            subtitle="¿Primera rutina o ya vas por el paso diez? Elige por nivel, tipo de piel, mañana o noche, o copia la favorita de la comunidad."
            linkHref="/rutinas"
            linkLabel="Ver todas las rutinas"
          />
          <RoutineStarterTiles
            starterCount={routines.filter((routine) => routine.collection === "iniciar").length}
            timeCounts={{
              manana: routines.filter((routine) => routine.timeOfDay !== "Noche").length,
              noche: routines.filter((routine) => routine.timeOfDay !== "Mañana").length,
            }}
            skinCounts={Object.fromEntries(
              Object.entries(SKIN_TYPE_SLUGS).map(([slug, type]) => [
                slug,
                routines.filter((routine) => matchesSkinType(routine, type)).length,
              ])
            )}
          />
        </div>
      </section>

      {/* Banner mascarillas */}
      <section className="container-page mt-20 sm:mt-28">
        {/* Mobile / tablet: short photo strip, content flows below */}
        <div className="overflow-hidden rounded-[2.5rem] lg:hidden">
          <div
            className="h-36 w-full bg-blush-100 bg-cover sm:h-44"
            style={{ backgroundImage: "url(/uploads/banners/mascarillas-bg.webp)", backgroundPosition: "65% 25%" }}
          />
          <div className="bg-white p-6 sm:p-8">
            <span className="pill-badge bg-blush-100 text-blush-600">MASCARILLAS</span>
            <h2 className="mt-3 font-display text-2xl font-bold text-ink sm:text-3xl">
              Tu día de spa, sin salir de casa
            </h2>
            <p className="mt-2 text-sm text-ink/70 sm:text-base">
              De tela, en gel o para dormir con ellas puestas. Para esos días en que tu piel amanece opaca o tirante.
            </p>
            <Link
              href="/categoria/mascarillas"
              className="group mt-5 inline-flex items-center gap-1.5 rounded-pill bg-blush-500 px-5 py-2.5 text-sm font-bold text-white transition-all duration-150 ease-out-strong hover:translate-x-1 hover:bg-blush-600"
            >
              Ver mascarillas
              <ArrowRightIcon className="h-4 w-4" />
            </Link>

            {maskProducts.length > 0 && (
              <div className="-mx-6 mt-6 flex gap-3 overflow-x-auto px-6 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:-mx-8 sm:px-8 [&::-webkit-scrollbar]:hidden">
                {maskProducts.map((product, i) => (
                  <BannerProductChip key={product.slug} product={product} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Desktop: full-bleed photo with floating content */}
        <div className="relative hidden overflow-hidden rounded-[2.5rem] lg:block lg:min-h-[22rem]">
          <div
            className="absolute inset-0 bg-blush-100 bg-cover"
            style={{ backgroundImage: "url(/uploads/banners/mascarillas-bg.webp)", backgroundPosition: "65% center" }}
          />

          <div className="relative flex h-full items-center justify-between gap-10 p-10">
            <div className="max-w-sm rounded-[1.75rem] bg-white/90 p-6 ring-1 ring-white/60 backdrop-blur-md">
              <span className="pill-badge bg-blush-100 text-blush-600">MASCARILLAS</span>
              <h2 className="mt-3 font-display text-3xl font-bold text-ink">
                Tu día de spa, sin salir de casa
              </h2>
              <p className="mt-2 text-base text-ink/70">
                De tela, en gel o para dormir con ellas puestas. Para esos días en que tu piel amanece opaca o tirante.
              </p>
              <Link
                href="/categoria/mascarillas"
                className="group mt-5 inline-flex items-center gap-1.5 rounded-pill bg-blush-500 px-5 py-2.5 text-sm font-bold text-white transition-all duration-150 ease-out-strong hover:translate-x-1 hover:bg-blush-600"
              >
                Ver mascarillas
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>

            {maskProducts.length > 0 && (
              <div className="flex w-64 shrink-0 flex-col gap-3">
                {maskProducts.map((product, i) => (
                  <BannerProductChip key={product.slug} product={product} index={i} className="w-full" />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Inquietudes de piel */}
      <section className="container-page mt-20 sm:mt-28">
        <SectionHeading
          kicker="PARA TU PIEL"
          title="Empieza por lo que"
          highlight="te preocupa"
          subtitle="Toca lo que quieres mejorar y te mostramos qué usar"
        />
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {SKIN_CONCERNS.map((concern) => {
            const styles = CONCERN_TILE_STYLES[concern.tone];
            return (
              <Link
                key={concern.label}
                href={`/tienda?q=${encodeURIComponent(concern.query)}`}
                className={`group inline-flex items-center gap-2.5 rounded-pill ${styles.bg} px-5 py-3.5 text-sm font-bold ${styles.text} transition-all duration-150 ease-out-strong hover:-translate-y-1 hover:shadow-pop active:translate-y-0 active:scale-95`}
              >
                <concern.icon className="h-4 w-4 shrink-0 transition-transform duration-150 ease-out-strong group-hover:scale-110" />
                {concern.label}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Preguntas frecuentes */}
      <section className="container-page mt-20 sm:mt-28">
        <SectionHeading
          kicker="PREGUNTAS FRECUENTES"
          title="Resolvemos tus"
          highlight="dudas"
          subtitle="Lo que más nos preguntan antes de la primera compra"
        />
        <div className="mx-auto max-w-2xl rounded-[2rem] bg-white p-6 shadow-card sm:p-8">
          {FAQ_ITEMS.map((item, i) => (
            <AccordionItem key={item.question} title={item.question} defaultOpen={i === 0}>
              {item.answer}
            </AccordionItem>
          ))}
        </div>
      </section>

      {/* Reseñas con fotos reales */}
      {photoReviews.length > 0 && (
        <section className="container-page mt-20 sm:mt-28">
          <SectionHeading
            kicker="RESEÑAS"
            title="Lo que dicen"
            highlight="nuestras clientas"
            icon={<HeartIcon className="h-5 w-5 text-blush-500" />}
            subtitle="Cinco estrellas y la foto de cómo les fue. Toca una reseña para leerla completa."
          />
          <ReviewWall reviews={photoReviews} />
        </section>
      )}

      {/* Nuevos productos */}
      {newProducts.length > 0 && (
        <section className="container-page mt-20 sm:mt-28">
          <SectionHeading
            kicker="RECIÉN LLEGADOS"
            title="Nuevos"
            highlight="productos"
            icon={<SparkleIcon className="h-5 w-5 text-blush-500" />}
            subtitle="Recién desempacados"
            linkHref="/tienda"
            linkLabel="Ver todos los productos"
          />
          <ProductCarousel products={newProducts} />
        </section>
      )}

      {/* Clima */}
      <section className="container-page mt-20 sm:mt-28">
        <div className="grid items-center gap-10 lg:grid-cols-[3fr_2fr] lg:gap-12">
          <div>
            <SectionHeading
              kicker="CLIMA"
              title="Skincare hecho para"
              highlight="el clima de tu ciudad"
              subtitle="Tu piel en Bogotá pide cosas distintas que en Barranquilla. Elige tu ciudad y te recomendamos una rutina."
            />
            <ClimateRoutineFinder routineProducts={climateRoutineProducts} />
          </div>
          <div
            className="relative hidden aspect-[3/4] w-full overflow-hidden rounded-[2.5rem] bg-blush-50 bg-cover bg-center shadow-soft lg:block lg:max-w-sm lg:justify-self-end"
            style={{ backgroundImage: "url(/uploads/banners/clima-bg.webp)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/uploads/logos/LOGOSVG%20BLANCO.svg"
              alt="Rumí"
              className="absolute left-7 top-7 w-20 drop-shadow-sm"
            />
          </div>
        </div>
      </section>

      {/* Testimonios */}
      {reviews.length > 0 && (
        <section className="container-page mt-20 sm:mt-28">
          <SectionHeading
            kicker="TESTIMONIOS"
            title="Historias de"
            highlight="piel real"
            icon={<HeartIcon className="h-5 w-5 text-blush-500" />}
            subtitle="Contado por nuestras clientas, con sus palabras"
          />
          <TestimonialsCarousel reviews={reviews} />
        </section>
      )}

      {/* Closing CTA */}
      <section className="container-page mt-20 sm:mt-28">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-blush-500 px-8 py-14 text-center sm:px-16 sm:py-20">
          <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
          <div className="absolute -bottom-14 -right-6 h-52 w-52 rounded-full bg-white/10" />
          <RatingStars rating={5} size="md" />
          <h2 className="relative mx-auto mt-4 max-w-xl font-display text-3xl font-bold text-white sm:text-4xl">
            ¿Primera compra? Te damos 10% de descuento
          </h2>
          <p className="relative mx-auto mt-3 max-w-md text-sm text-white/85 sm:text-base">
            Escribe el código <span className="font-bold">RUMI10</span> al pagar.
          </p>
          <Link
            href="/tienda"
            className="relative mt-7 inline-flex items-center gap-2 rounded-pill bg-white px-7 py-3.5 text-sm font-bold text-blush-600 transition-transform duration-150 ease-out-strong active:scale-[0.97] sm:text-base"
          >
            Comprar ahora
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
