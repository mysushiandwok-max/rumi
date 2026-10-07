import Link from "next/link";
import type { CSSProperties } from "react";
import { AccordionItem } from "@/components/Accordion";
import { ProductArt } from "@/components/illustrations/ProductArt";
import { RatingStars } from "@/components/RatingStars";
import { SoftHearts } from "@/components/product/SoftHearts";
import { Reveal } from "@/components/category/Reveal";
import { CheckIcon, CloseIcon, DropletIcon, HeartIcon, LeafIcon, MoonIcon, SunIcon } from "@/components/icons";
import { formatCOP } from "@/lib/format";
import { videoEmbed } from "@/lib/product-landing";
import type { AccentTone, Product, ProductLanding } from "@/lib/types";

// Clases completas por tono (Tailwind no ve clases armadas con plantillas).
const TONE = {
  blush: { band: "bg-blush-50", soft: "bg-blush-100", accent: "text-blush-500", strong: "bg-blush-500" },
  mint: { band: "bg-mint-50", soft: "bg-mint-100", accent: "text-mint-500", strong: "bg-mint-500" },
  peach: { band: "bg-peach-50", soft: "bg-peach-100", accent: "text-peach-500", strong: "bg-peach-500" },
  lavender: { band: "bg-lavender-50", soft: "bg-lavender-100", accent: "text-lavender-500", strong: "bg-lavender-500" },
} satisfies Record<AccentTone, Record<string, string>>;

const toneOf = (product: Product) => TONE[product.tone] ?? TONE.blush;

// Giro de cada foto de la mini galería, para que se vea como fotos sueltas sobre una mesa.
const GALLERY_TILT = ["-3deg", "2deg", "-1.5deg", "3deg", "-2.5deg", "1.5deg"];

// Ícono de respaldo para ingredientes sin foto, rotando para que no se repita.
const INGREDIENT_ICONS = [LeafIcon, DropletIcon, HeartIcon];

export function ProductLandingSections({ product, pairProducts }: { product: Product; pairProducts: Product[] }) {
  const { landing } = product;
  const tone = toneOf(product);

  return (
    <div className="container-page">
      <BenefitsBand product={product} />

      {landing.banners[0] && (
        <div className="mt-24 sm:mt-32">
          <ProductBanner banner={landing.banners[0]} tone={product.tone} />
        </div>
      )}

      {landing.keyIngredients.length > 0 && (
        <section className="mt-24 sm:mt-32">
          <Heading title="Lo que hay adentro, explicado simple" />
          <ul className="border-t border-ink/10">
            {landing.keyIngredients.map((ingredient, i) => (
              <Reveal
                as="li"
                key={ingredient.name}
                delay={i * 70}
                className="group grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-5 gap-y-2 border-b border-ink/10 py-7 sm:grid-cols-[auto_minmax(0,1fr)_minmax(0,1.3fr)] sm:gap-x-10"
              >
                <span
                  className={`relative row-span-2 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full sm:row-span-1 sm:h-24 sm:w-24 ${tone.soft}`}
                >
                  {ingredient.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={ingredient.image}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-500 ease-out-strong can-hover:group-hover:scale-110"
                    />
                  ) : (
                    (() => {
                      const Icon = INGREDIENT_ICONS[i % INGREDIENT_ICONS.length];
                      return (
                        <Icon
                          className={`h-8 w-8 transition-transform duration-500 ease-out-strong can-hover:group-hover:rotate-12 ${tone.accent}`}
                        />
                      );
                    })()
                  )}
                </span>
                <h3 className="font-display text-2xl font-bold leading-tight text-ink sm:text-3xl">{ingredient.name}</h3>
                {ingredient.benefit && (
                  <p className="max-w-prose text-sm leading-relaxed text-ink/65 sm:text-base">{ingredient.benefit}</p>
                )}
              </Reveal>
            ))}
          </ul>
        </section>
      )}

      {landing.gallery.length > 0 && (
        <section className="mt-24 sm:mt-32">
          <Heading title="Míralo de cerca" />
          <ul className="-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-8 pt-4 sm:-mx-8 sm:px-8 lg:mx-0 lg:justify-center lg:overflow-visible lg:px-0">
            {landing.gallery.map((url, i) => (
              <li
                key={url}
                style={{ "--r": GALLERY_TILT[i % GALLERY_TILT.length] } as CSSProperties}
                className="w-[62%] max-w-[240px] shrink-0 snap-center transition-transform duration-300 ease-out-strong can-hover:hover:-translate-y-2 sm:w-[240px]"
              >
                <Reveal
                  delay={i * 90}
                  className="reveal-photo rounded-[1.5rem] bg-white p-2.5 pb-8 shadow-card"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`${product.name}, foto ${i + 1}`}
                    loading="lazy"
                    className="aspect-[4/5] w-full rounded-[1.1rem] object-cover"
                  />
                </Reveal>
              </li>
            ))}
          </ul>
        </section>
      )}

      {landing.videos.length > 0 && (
        <section className="mt-24 sm:mt-32">
          <Heading title="Míralo en la piel real" />
          <div className="-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 sm:-mx-8 sm:px-8 lg:mx-0 lg:px-0">
            {landing.videos.map((url, i) => {
              const embed = videoEmbed(url);
              if (!embed) return null;
              return (
                <Reveal
                  key={url}
                  delay={i * 70}
                  className={`w-[78%] max-w-[320px] shrink-0 snap-center overflow-hidden rounded-[1.75rem] bg-ink shadow-card sm:w-[300px] ${
                    embed.source === "tiktok" ? "aspect-[9/16]" : "h-[640px] bg-white"
                  }`}
                >
                  <iframe
                    src={embed.src}
                    title={`Video ${i + 1} de ${product.name}`}
                    loading="lazy"
                    allow="encrypted-media; picture-in-picture; fullscreen"
                    allowFullScreen
                    className="h-full w-full border-0"
                  />
                </Reveal>
              );
            })}
          </div>
        </section>
      )}

      {landing.vsRows.length > 0 && (
        <section className="mt-24 sm:mt-32">
          <Heading title="¿Qué tiene este que no tengan otros?" />
          <Reveal className="overflow-hidden rounded-[2rem] bg-white shadow-card">
            <table className="w-full text-left text-sm sm:text-base">
              <thead>
                <tr>
                  <th scope="col" className="p-4 sm:p-6">
                    <span className="sr-only">Característica</span>
                  </th>
                  <th
                    scope="col"
                    className={`w-28 p-4 text-center font-display font-bold text-ink sm:w-44 sm:p-6 ${tone.soft}`}
                  >
                    <HeartIcon className={`mx-auto mb-1 h-5 w-5 fill-current ${tone.accent}`} />
                    Este producto
                  </th>
                  <th scope="col" className="w-24 p-4 text-center font-display font-semibold text-ink/50 sm:w-40 sm:p-6">
                    Otros
                  </th>
                </tr>
              </thead>
              <tbody>
                {landing.vsRows.map((row) => (
                  <tr key={row.label} className="border-t border-border/60">
                    <th scope="row" className="p-4 font-semibold text-ink/80 sm:px-6">
                      {row.label}
                    </th>
                    <td className={`p-4 text-center ${tone.soft}`}>
                      <Mark yes={row.ours} strong />
                    </td>
                    <td className="p-4 text-center">
                      <Mark yes={row.others} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </section>
      )}

      {product.howToUse.length > 0 && (
        <section
          className={`mt-24 grid grid-cols-[minmax(0,1fr)] items-center gap-10 sm:mt-32 lg:gap-16 ${
            landing.routineImage ? "lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]" : ""
          }`}
        >
          {landing.routineImage && (
            <div style={{ "--r": "-2deg" } as CSSProperties} className="mx-auto w-full max-w-md">
              <Reveal className="reveal-photo relative">
                <div className="overflow-hidden rounded-[2.5rem] shadow-soft">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={landing.routineImage}
                    alt={`Textura de ${product.name}`}
                    className="aspect-[4/5] w-full object-cover"
                  />
                </div>
                <span className="absolute -right-4 -top-4 animate-float">
                  <HeartIcon className={`h-12 w-12 fill-current drop-shadow-sm ${tone.accent}`} />
                </span>
              </Reveal>
            </div>
          )}
          <div>
            <Heading title="Cómo usarlo, paso a paso" />
            {landing.moment && (
              <p className="-mt-4 mb-8 inline-flex items-center gap-2 rounded-pill bg-white px-4 py-2 text-sm font-semibold text-ink/70 shadow-card">
                {/noche/i.test(landing.moment) && <MoonIcon className="h-4 w-4 text-lavender-500" />}
                {/ma[ñn]ana|d[ií]a/i.test(landing.moment) && <SunIcon className="h-4 w-4 text-peach-500" />}
                {landing.moment}
              </p>
            )}
            <ol className="flex flex-col">
              {product.howToUse.map((step, i) => (
                <Reveal
                  as="li"
                  key={i}
                  delay={i * 70}
                  className="flex gap-5 border-t border-border/70 py-5 first:border-t-0 first:pt-0"
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-display text-base font-bold text-white ${tone.strong}`}
                  >
                    {i + 1}
                  </span>
                  <p className="pt-2 text-base leading-relaxed text-ink/75">{step}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>
      )}

      {pairProducts.length > 0 && (
        <section className={`relative mt-16 overflow-hidden rounded-[2.5rem] ${tone.soft}`}>
          <SoftHearts tone={product.tone} strip />
          <div className="relative z-10 grid gap-8 p-6 sm:p-10 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:items-center lg:p-12">
            <div>
              <h2 className="font-display text-2xl font-bold leading-tight text-ink sm:text-3xl">Combínalo con</h2>
              <p className="mt-2 text-sm text-ink/65 sm:text-base">Van bien juntos en la misma rutina.</p>
            </div>
            <ul className={`grid gap-3 ${pairProducts.length > 1 ? "sm:grid-cols-2" : ""}`}>
              {pairProducts.map((pair, i) => (
                <Reveal as="li" key={pair.slug} delay={i * 70}>
                  <MiniProduct product={pair} />
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}

function BenefitsBand({ product }: { product: Product }) {
  const { landing } = product;
  if (!landing.headline && landing.benefits.length === 0 && landing.results.length === 0) return null;
  const tone = toneOf(product);
  const photo = landing.benefitsImage || product.images[1] || product.images[0];

  return (
    <section className={`relative mt-24 overflow-hidden rounded-[3rem] sm:mt-32 ${tone.soft}`}>
      <SoftHearts tone={product.tone} />
      <div className="relative z-10 px-6 py-14 sm:px-12 sm:py-20 lg:px-20">
        <div
          className={`grid items-center gap-14 ${photo ? "lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-20" : ""}`}
        >
          <div>
            <h2 className="max-w-3xl text-balance font-display text-3xl font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl">
              {landing.headline || product.shortDescription}
            </h2>
            {landing.benefits.length > 0 && (
              <ul className="mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:mt-12">
                {landing.benefits.map((benefit, i) => (
                  <Reveal as="li" key={benefit.title} delay={i * 80} className="flex gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white shadow-card">
                      <HeartIcon className={`h-5 w-5 fill-current ${tone.accent}`} />
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-bold text-ink">{benefit.title}</h3>
                      {benefit.text && <p className="mt-1 text-sm leading-relaxed text-ink/70">{benefit.text}</p>}
                    </div>
                  </Reveal>
                ))}
              </ul>
            )}
          </div>

          {photo && (
            <div style={{ "--r": "3deg" } as CSSProperties} className="mx-auto w-full max-w-sm">
              <Reveal className="reveal-photo relative rounded-[2rem] bg-white p-3 pb-14 shadow-soft">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo} alt={product.name} className="aspect-[4/5] w-full rounded-[1.5rem] object-cover" />
                <p className="absolute inset-x-0 bottom-4 truncate px-6 text-center font-display text-sm font-semibold text-ink/60">
                  {product.name}
                </p>
                <span className="absolute -right-5 -top-5 animate-float">
                  <HeartIcon className={`h-14 w-14 -rotate-12 fill-current drop-shadow-sm ${tone.accent}`} />
                </span>
              </Reveal>
            </div>
          )}
        </div>

        {landing.results.length > 0 && (
          <Reveal className="mt-14 rounded-[2rem] bg-white/85 p-6 shadow-card sm:p-10">
            <h3 className="font-display text-lg font-bold text-ink sm:text-xl">Lo que vas a notar</h3>
            <ol className="relative mt-8 grid gap-8 sm:auto-cols-fr sm:grid-flow-col sm:gap-6">
              <span
                aria-hidden
                className="absolute left-[9px] top-2 h-[calc(100%-1rem)] w-px bg-ink/10 sm:left-2 sm:right-2 sm:top-[9px] sm:h-px sm:w-auto"
              />
              {landing.results.map((result) => (
                <li key={result.when} className="relative pl-9 sm:pl-0 sm:pt-9">
                  <span
                    aria-hidden
                    className={`absolute left-0 top-0.5 h-[19px] w-[19px] rounded-full ring-4 ring-white sm:top-0 ${tone.strong}`}
                  />
                  <p className="font-display text-sm font-bold uppercase tracking-wide text-ink">{result.when}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink/70 sm:text-base">{result.text}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        )}
      </div>
    </section>
  );
}

// En celular el texto va debajo de la foto (sobre el pastel del producto); desde sm, encima a la izquierda.
export function ProductBanner({ banner, tone }: { banner: ProductLanding["banners"][number]; tone: AccentTone }) {
  const hasText = Boolean(banner.title || banner.text);
  return (
    <Reveal
      className={`reveal-banner relative overflow-hidden rounded-[2.5rem] sm:aspect-[16/7] ${TONE[tone]?.soft ?? TONE.blush.soft}`}
    >
      <div className={`relative overflow-hidden sm:absolute sm:inset-0 ${hasText ? "aspect-[4/3]" : "aspect-[4/5]"} sm:aspect-auto`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={banner.image}
          alt={banner.title}
          className="absolute inset-0 h-full w-full object-cover object-[78%_center] sm:object-center"
        />
      </div>
      {hasText && (
        <div className="relative max-w-xl p-7 pt-6 sm:absolute sm:inset-y-0 sm:left-0 sm:flex sm:flex-col sm:justify-center sm:p-14">
          {banner.title && (
            <p className="text-balance font-display text-3xl font-bold leading-tight text-ink sm:text-5xl">{banner.title}</p>
          )}
          {banner.text && <p className="mt-3 text-base text-ink/70 sm:text-lg">{banner.text}</p>}
          <a href="#comprar" className="btn-primary mt-6 w-fit px-6 py-3 text-sm">
            Lo quiero
          </a>
        </div>
      )}
    </Reveal>
  );
}

export function ProductCompareSection({ product, others }: { product: Product; others: Product[] }) {
  if (others.length === 0) return null;
  const columns = [product, ...others];
  const tone = toneOf(product);
  const rows: { label: string; value: (p: Product) => React.ReactNode }[] = [
    { label: "Precio", value: (p) => <span className="font-bold tabular-nums text-ink">{formatCOP(p.price)}</span> },
    { label: "Tamaño", value: (p) => p.size },
    { label: "Ideal para", value: (p) => p.skinTypes.join(", ") || "Todo tipo de piel" },
    {
      label: "Calificación",
      value: (p) =>
        p.reviewCount > 0 ? (
          <RatingStars rating={p.rating} reviewCount={p.reviewCount} />
        ) : (
          <span className="text-ink/40">Sin reseñas</span>
        ),
    },
  ];

  return (
    <section className="container-page mt-24 sm:mt-32">
      <Heading title="¿Dudas entre varios? Míralos lado a lado" />
      <Reveal className="-mx-5 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0">
        <table className="w-full min-w-[640px] table-fixed text-left text-sm">
          <thead>
            <tr>
              <th scope="col" className="w-24 sm:w-40">
                <span className="sr-only">Característica</span>
              </th>
              {columns.map((p, i) => (
                <th
                  key={p.slug}
                  scope="col"
                  className={`rounded-t-[1.75rem] p-4 align-top font-normal ${i === 0 ? tone.band : ""}`}
                >
                  <span
                    className={`mb-2 block text-xs font-bold uppercase tracking-wide ${i === 0 ? tone.accent : "invisible"}`}
                  >
                    Estás viendo
                  </span>
                  <Thumb product={p} className="h-24 w-24" />
                  <span className="mt-3 block font-display text-base font-bold leading-snug text-ink">{p.name}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <th
                  scope="row"
                  className="border-t border-border/70 py-4 pr-4 text-xs font-bold uppercase tracking-wide text-ink/45"
                >
                  {row.label}
                </th>
                {columns.map((p, i) => (
                  <td key={p.slug} className={`border-t border-border/70 p-4 text-ink/70 ${i === 0 ? tone.band : ""}`}>
                    {row.value(p)}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td />
              {columns.map((p, i) => (
                <td key={p.slug} className={`rounded-b-[1.75rem] p-4 ${i === 0 ? tone.band : ""}`}>
                  {i > 0 && (
                    <Link href={`/producto/${p.slug}`} className="btn-secondary px-4 py-2 text-xs">
                      Ver producto
                    </Link>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </Reveal>
    </section>
  );
}

export function ProductFaqSection({ product }: { product: Product }) {
  if (product.landing.faq.length === 0) return null;
  return (
    <section className="container-page mt-24 grid gap-8 sm:mt-32 lg:grid-cols-[2fr_3fr] lg:gap-16">
      <div>
        <h2 className="text-balance font-display text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
          Lo que nos preguntan de este
        </h2>
        <p className="mt-3 text-sm text-ink/60 sm:text-base">¿Te quedó alguna duda? Escríbenos y te asesoramos.</p>
      </div>
      <div>
        {product.landing.faq.map((item, i) => (
          <AccordionItem key={item.question} title={item.question} defaultOpen={i === 0}>
            {item.answer}
          </AccordionItem>
        ))}
      </div>
    </section>
  );
}

function Heading({ title }: { title: string }) {
  return (
    <h2 className="mb-10 max-w-3xl text-balance font-display text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl lg:text-5xl">
      {title}
    </h2>
  );
}

function Mark({ yes, strong }: { yes: boolean; strong?: boolean }) {
  return yes ? (
    <span
      className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${
        strong ? "bg-mint-500 text-white" : "bg-mint-100 text-mint-700"
      }`}
    >
      <CheckIcon className="h-4 w-4" />
      <span className="sr-only">Sí</span>
    </span>
  ) : (
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-ink/5 text-ink/35">
      <CloseIcon className="h-4 w-4" />
      <span className="sr-only">No</span>
    </span>
  );
}

function Thumb({ product, className }: { product: Product; className: string }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-2xl ${toneOf(product).soft} ${className}`}
    >
      {product.images[0] ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={product.images[0]} alt="" className="h-full w-full object-cover" />
      ) : (
        <ProductArt variant={product.artVariant} tone={product.tone} label={product.name} className="h-3/4 w-auto" />
      )}
    </span>
  );
}

function MiniProduct({ product }: { product: Product }) {
  return (
    <Link
      href={`/producto/${product.slug}`}
      className="group flex items-center gap-4 rounded-2xl bg-white/90 p-3 shadow-card transition-transform duration-200 ease-out-strong active:scale-[0.98] can-hover:hover:-translate-y-0.5"
    >
      <Thumb product={product} className="h-16 w-16" />
      <span className="min-w-0 flex-1">
        <span className="block truncate font-display text-sm font-bold text-ink group-hover:text-blush-600">
          {product.name}
        </span>
        <span className="text-sm tabular-nums text-ink/60">{formatCOP(product.price)}</span>
      </span>
    </Link>
  );
}
