import Link from "next/link";
import { ArrowRightIcon, SparkleIcon } from "@/components/icons";
import { formatCOP } from "@/lib/format";
import type { Product } from "@/lib/types";

const BG_IMAGE = "/uploads/banners/tiktok-trend-bg.webp";

function TrendTag({ product, index = 0, className = "" }: { product: Product; index?: number; className?: string }) {
  return (
    <Link
      href={`/producto/${product.slug}`}
      style={{ animationDelay: `${index * 90}ms` }}
      className={`group relative aspect-square animate-pop-in overflow-hidden rounded-2xl ring-1 ring-white/20 transition-transform duration-200 ease-out-strong hover:-translate-y-1 ${className}`}
    >
      {product.images[0] && (
        <img
          src={product.images[0]}
          alt={product.name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 ease-out-strong group-hover:scale-110"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-transparent" />
      <span className="absolute inset-x-1.5 bottom-1.5 truncate rounded-full bg-black/60 px-2 py-1 text-center text-[11px] font-bold text-white backdrop-blur-sm">
        {formatCOP(product.price)}
      </span>
    </Link>
  );
}

export function TikTokTrendBanner({ products }: { products: Product[] }) {
  const tags = products.slice(0, 4);

  const heading = (
    <>
      <span className="pill-badge mb-3 bg-white/10 text-white ring-1 ring-white/15">
        <SparkleIcon className="h-3 w-3 text-[#25F4EE]" />
        VIRAL EN TIKTOK
      </span>
      <h2 className="font-display text-2xl font-bold leading-tight text-white sm:text-3xl">
        Lo que está{" "}
        <span className="bg-gradient-to-r from-[#25F4EE] to-[#FE2C55] bg-clip-text text-transparent">en tendencia</span>
      </h2>
      <p className="mt-2 max-w-sm text-sm text-white/70 sm:text-base">
        Los productos K-beauty de los que todos hablan en redes sociales
      </p>
      <Link
        href="/tienda"
        className="group mt-4 inline-flex items-center gap-1.5 rounded-pill bg-white px-5 py-2.5 text-sm font-bold text-black transition-all duration-150 ease-out-strong hover:translate-x-1 hover:bg-white/90"
      >
        Ver todos los productos
        <ArrowRightIcon className="h-4 w-4" />
      </Link>
    </>
  );

  return (
    <section className="container-page mt-20 sm:mt-28">
      {/* Mobile / tablet: photo strip, dark panel with heading + scrollable tags */}
      <div className="overflow-hidden rounded-[2.5rem] lg:hidden">
        <div
          className="h-40 w-full bg-[#141018] bg-cover bg-center sm:h-48"
          style={{ backgroundImage: `url(${BG_IMAGE})` }}
        />
        <div className="bg-[#0a0a0d] p-6 sm:p-8">
          {heading}
          {tags.length > 0 && (
            <div className="-mx-6 mt-6 flex gap-3 overflow-x-auto px-6 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:-mx-8 sm:px-8 [&::-webkit-scrollbar]:hidden">
              {tags.map((product, i) => (
                <TrendTag key={product.slug} product={product} index={i} className="w-24 shrink-0" />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Desktop: full-bleed photo, heading top-left, small trend tags bottom-right */}
      <div className="relative hidden overflow-hidden rounded-[2.5rem] bg-[#0a0a0d] lg:block lg:h-[30rem] xl:h-[34rem] 2xl:aspect-[1600/700] 2xl:h-auto">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${BG_IMAGE})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/10" />
        <div className="pointer-events-none absolute -left-10 top-0 h-72 w-72 rounded-full bg-[#25F4EE]/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-10 bottom-0 h-72 w-72 rounded-full bg-[#FE2C55]/20 blur-3xl" />

        <div className="relative flex h-full flex-col justify-between p-7 xl:p-10">
          <div className="max-w-md">{heading}</div>

          {tags.length > 0 && (
            <div className="grid w-48 grid-cols-2 gap-2.5 self-end xl:w-56 xl:gap-3">
              {tags.map((product, i) => (
                <TrendTag key={product.slug} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
