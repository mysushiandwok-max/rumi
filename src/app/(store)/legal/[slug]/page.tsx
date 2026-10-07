import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { LEGAL_ENTITY, LEGAL_PAGES, LEGAL_UPDATED, getLegalPage } from "@/data/legal";
import { getShippingSettings } from "@/lib/admin/settings";
import { getDispatchClasses } from "@/lib/admin/shipping";
import { formatCOP } from "@/lib/format";

export function generateStaticParams() {
  return LEGAL_PAGES.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = getLegalPage(slug);
  return { title: page?.title ?? "Legal", description: page?.summary };
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getLegalPage(slug);
  if (!page) notFound();

  const isShipping = slug === "envios";
  const { freeShippingThreshold } = getShippingSettings();
  const freeShipping =
    freeShippingThreshold > 0
      ? `Las compras desde ${formatCOP(freeShippingThreshold)} tienen envío gratis a cualquier destino.`
      : "";
  const dispatchClasses = isShipping ? getDispatchClasses() : [];

  return (
    <div className="container-page py-10 sm:py-14">
      <Breadcrumbs items={[{ label: "Legal" }, { label: page.title }]} />

      <div className="grid gap-10 lg:grid-cols-[240px_1fr] lg:gap-16">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">Información legal</p>
          <nav className="mt-4 flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0">
            {LEGAL_PAGES.map((p) => (
              <Link
                key={p.slug}
                href={`/legal/${p.slug}`}
                aria-current={p.slug === slug ? "page" : undefined}
                className={`shrink-0 rounded-pill px-4 py-2 text-sm transition-colors lg:rounded-xl2 ${
                  p.slug === slug
                    ? "bg-blush-100 font-semibold text-blush-700"
                    : "text-ink/65 hover:bg-blush-50 hover:text-blush-600"
                }`}
              >
                {p.title}
              </Link>
            ))}
          </nav>
        </aside>

        <article className="max-w-3xl">
          <h1 className="font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">{page.title}</h1>
          <p className="mt-3 text-base text-ink/65">{page.summary}</p>
          <p className="mt-2 text-xs text-ink/45">Última actualización: {LEGAL_UPDATED}</p>

          <div className="mt-10 flex flex-col gap-10">
            {page.sections.map((section) => (
              <section key={section.title}>
                <h2 className="font-display text-xl font-bold text-ink">{section.title}</h2>
                <div className="mt-3 flex flex-col gap-3 text-sm leading-relaxed text-ink/70 sm:text-base">
                  {section.blocks.map((block, i) =>
                    Array.isArray(block) ? (
                      <ul key={i} className="flex flex-col gap-2 pl-5 [list-style:disc] marker:text-blush-400">
                        {block.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p key={i}>{block.replace("{freeShipping}", freeShipping)}</p>
                    )
                  )}
                </div>
              </section>
            ))}

            {isShipping && dispatchClasses.length > 0 && (
              <section>
                <h2 className="font-display text-xl font-bold text-ink">Tarifas y tiempos por zona</h2>
                <div className="mt-4 overflow-hidden rounded-xl2 border border-border/70">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-blush-50 text-ink/70">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Zona</th>
                        <th className="px-4 py-3 font-semibold">Costo</th>
                        <th className="px-4 py-3 font-semibold">Tiempo estimado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dispatchClasses.map((dc) => (
                        <tr key={dc.id} className="border-t border-border/70 text-ink/70">
                          <td className="px-4 py-3">{dc.name}</td>
                          <td className="px-4 py-3">{formatCOP(dc.price)}</td>
                          <td className="px-4 py-3">
                            {dc.etaMinDays && dc.etaMaxDays
                              ? `${dc.etaMinDays} a ${dc.etaMaxDays} días hábiles`
                              : "Se confirma al despachar"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </div>

          <div className="mt-14 rounded-[2rem] bg-blush-50/70 p-6 text-sm leading-relaxed text-ink/70 sm:p-8">
            <p className="font-display text-base font-bold text-ink">¿Tienes dudas?</p>
            <p className="mt-2">
              Escríbenos a <a href={`mailto:${LEGAL_ENTITY.email}`} className="font-semibold text-blush-600 hover:underline">{LEGAL_ENTITY.email}</a>{" "}
              o al WhatsApp {LEGAL_ENTITY.phone}, {LEGAL_ENTITY.hours}.
            </p>
            <p className="mt-2">
              Autoridad de protección al consumidor:{" "}
              <a href="https://www.sic.gov.co" target="_blank" rel="noopener noreferrer" className="font-semibold text-blush-600 hover:underline">
                Superintendencia de Industria y Comercio
              </a>
              .
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}
