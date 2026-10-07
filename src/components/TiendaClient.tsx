"use client";

import { useMemo, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductGrid } from "@/components/ProductGrid";
import { ChevronDownIcon, CloseIcon } from "@/components/icons";
import type { Brand, Category, Product } from "@/lib/types";

type SortKey = "relevancia" | "precio-asc" | "precio-desc" | "rating";

const SORT_LABELS: Record<SortKey, string> = {
  relevancia: "Relevancia",
  "precio-asc": "Precio: menor a mayor",
  "precio-desc": "Precio: mayor a menor",
  rating: "Mejor calificados",
};

function TiendaContent({
  products,
  categories,
  brands,
}: {
  products: Product[];
  categories: Category[];
  brands: Brand[];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q")?.toLowerCase() ?? "";

  const [category, setCategory] = useState<string>("todas");
  const [brand, setBrand] = useState<string>("todas");
  const [sort, setSort] = useState<SortKey>("relevancia");

  const filtered = useMemo(() => {
    let list = products.filter((product) => {
      const matchesQuery =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.shortDescription.toLowerCase().includes(query);
      const matchesCategory = category === "todas" || product.categorySlug === category;
      const matchesBrand = brand === "todas" || product.brandSlug === brand;
      return matchesQuery && matchesCategory && matchesBrand;
    });

    list = [...list].sort((a, b) => {
      if (sort === "precio-asc") return a.price - b.price;
      if (sort === "precio-desc") return b.price - a.price;
      if (sort === "rating") return b.rating - a.rating;
      return 0;
    });

    return list;
  }, [products, query, category, brand, sort]);

  return (
    <div className="container-page py-10 sm:py-14">
      <Breadcrumbs items={[{ label: "Tienda" }]} />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">Tienda</h1>
          <p className="mt-2 text-sm text-ink/60">
            {filtered.length} producto{filtered.length === 1 ? "" : "s"}
            {query && (
              <>
                {" "}
                para <span className="font-semibold text-ink">&ldquo;{searchParams.get("q")}&rdquo;</span>
              </>
            )}
          </p>
        </div>

        {query && (
          <button
            type="button"
            onClick={() => router.push("/tienda")}
            className="flex items-center gap-1.5 rounded-pill border border-border px-3.5 py-2 text-xs font-semibold text-ink/70 hover:border-blush-300 hover:text-blush-600"
          >
            Limpiar búsqueda
            <CloseIcon className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setCategory("todas")}
          className={`rounded-pill px-4 py-2 text-xs font-semibold transition-colors ${
            category === "todas" ? "bg-ink text-white" : "bg-white text-ink/70 border border-border hover:border-blush-300"
          }`}
        >
          Todas
        </button>
        {categories.map((cat) => (
          <button
            key={cat.slug}
            type="button"
            onClick={() => setCategory(cat.slug)}
            className={`rounded-pill px-4 py-2 text-xs font-semibold transition-colors ${
              category === cat.slug
                ? "bg-ink text-white"
                : "bg-white text-ink/70 border border-border hover:border-blush-300"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className="relative">
          <select
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="appearance-none rounded-pill border border-border bg-white py-2.5 pl-4 pr-9 text-xs font-semibold text-ink focus:border-blush-400 focus:outline-none"
          >
            <option value="todas">Todas las marcas</option>
            {brands.map((b) => (
              <option key={b.slug} value={b.slug}>
                {b.name}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink/40" />
        </div>

        <div className="relative">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="appearance-none rounded-pill border border-border bg-white py-2.5 pl-4 pr-9 text-xs font-semibold text-ink focus:border-blush-400 focus:outline-none"
          >
            {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
              <option key={key} value={key}>
                {SORT_LABELS[key]}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink/40" />
        </div>
      </div>

      <div className="mt-8">
        <ProductGrid products={filtered} />
      </div>
    </div>
  );
}

export function TiendaClient(props: { products: Product[]; categories: Category[]; brands: Brand[] }) {
  return (
    <Suspense fallback={null}>
      <TiendaContent {...props} />
    </Suspense>
  );
}
