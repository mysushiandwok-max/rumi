import Link from "next/link";
import { ProductArt } from "@/components/illustrations/ProductArt";
import { MoonIcon, SunIcon } from "@/components/icons";
import { Reveal } from "@/components/category/Reveal";
import { TONE } from "@/components/category/tones";
import { formatCOP } from "@/lib/format";
import type { AccentTone, Product } from "@/lib/types";

export type ComparisonRowView = {
  product: Product;
  brandName?: string;
  skinType: string;
  texture: string;
  keyIngredient: string;
  moment: string;
};

const EMPTY = "—";

function MomentPill({ value }: { value: string }) {
  if (!value) return <span className="text-ink/35">{EMPTY}</span>;
  const lower = value.toLowerCase();
  const day = /d[ií]a|ma[ñn]ana/.test(lower);
  const night = /noche|nocturn/.test(lower);
  const tint = day && night ? "bg-mint-100" : night ? "bg-lavender-100" : day ? "bg-peach-100" : "bg-ink/5";
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-pill px-3 py-1 text-xs font-semibold text-ink/80 ${tint}`}
    >
      {day && <SunIcon className="h-3.5 w-3.5" aria-hidden="true" />}
      {night && <MoonIcon className="h-3.5 w-3.5" aria-hidden="true" />}
      {value}
    </span>
  );
}

function Thumb({ product, tone }: { product: Product; tone: AccentTone }) {
  return (
    <div className={`flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl ${TONE[tone].thumb}`}>
      {product.images[0] ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={product.images[0]} alt="" loading="lazy" className="h-full w-full object-cover" />
      ) : (
        <ProductArt
          variant={product.artVariant}
          tone={product.tone}
          label={product.name}
          className="h-[80%] w-auto"
        />
      )}
    </div>
  );
}

function ProductCell({ row, tone }: { row: ComparisonRowView; tone: AccentTone }) {
  return (
    <div className="flex items-center gap-3">
      <Thumb product={row.product} tone={tone} />
      <div className="min-w-0">
        {row.brandName && <p className="text-xs text-ink/50">{row.brandName}</p>}
        <Link
          href={`/producto/${row.product.slug}`}
          className="line-clamp-2 font-display text-sm font-bold text-ink transition-colors duration-150 hover:text-blush-600"
        >
          {row.product.name}
        </Link>
        <p className="mt-0.5 text-sm font-semibold tabular-nums text-blush-600">{formatCOP(row.product.price)}</p>
      </div>
    </div>
  );
}

export function CategoryComparison({
  title,
  tone,
  rows,
}: {
  title: string;
  tone: AccentTone;
  rows: ComparisonRowView[];
}) {
  const styles = TONE[tone];
  return (
    <section aria-labelledby="comparison-title">
      <h2 id="comparison-title" className="font-display text-2xl font-bold leading-tight text-ink sm:text-3xl">
        {title}
      </h2>

      <Reveal className="mt-8 overflow-hidden rounded-[1.75rem] bg-white shadow-card">
        {/* Escritorio: tabla */}
        <table className="hidden w-full text-left text-sm md:table">
          <caption className="sr-only">{title}</caption>
          <thead>
            <tr className="text-xs font-semibold text-ink/50">
              <th scope="col" className="px-6 py-4 font-semibold">
                Producto
              </th>
              <th scope="col" className="px-4 py-4 font-semibold">
                Tipo de piel ideal
              </th>
              <th scope="col" className="px-4 py-4 font-semibold">
                Textura
              </th>
              <th scope="col" className="px-4 py-4 font-semibold">
                Ingrediente clave
              </th>
              <th scope="col" className="px-6 py-4 font-semibold">
                Momento de uso
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.product.slug}
                className={`border-t border-border/70 transition-colors duration-150 ${styles.rowHover}`}
              >
                <th scope="row" className="w-[34%] px-6 py-4 font-normal">
                  <ProductCell row={row} tone={tone} />
                </th>
                <td className="px-4 py-4 text-ink/75">{row.skinType || EMPTY}</td>
                <td className="px-4 py-4 text-ink/75">{row.texture || EMPTY}</td>
                <td className="px-4 py-4 text-ink/75">{row.keyIngredient || EMPTY}</td>
                <td className="px-6 py-4">
                  <MomentPill value={row.moment} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Móvil: lista apilada */}
        <ul className="divide-y divide-border/70 md:hidden">
          {rows.map((row) => (
            <li key={row.product.slug} className="flex flex-col gap-4 p-5">
              <ProductCell row={row} tone={tone} />
              <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                <div>
                  <dt className="text-xs text-ink/45">Tipo de piel ideal</dt>
                  <dd className="mt-0.5 text-ink/80">{row.skinType || EMPTY}</dd>
                </div>
                <div>
                  <dt className="text-xs text-ink/45">Textura</dt>
                  <dd className="mt-0.5 text-ink/80">{row.texture || EMPTY}</dd>
                </div>
                <div>
                  <dt className="text-xs text-ink/45">Ingrediente clave</dt>
                  <dd className="mt-0.5 text-ink/80">{row.keyIngredient || EMPTY}</dd>
                </div>
                <div>
                  <dt className="text-xs text-ink/45">Momento de uso</dt>
                  <dd className="mt-1">
                    <MomentPill value={row.moment} />
                  </dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
