"use client";

import { useEffect, useMemo, useState, type ComponentType } from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Reveal } from "@/components/category/Reveal";
import {
  ArrowRightIcon,
  CloseIcon,
  ChevronDownIcon,
  HeartIcon,
  LeafIcon,
  MoonIcon,
  SparkleIcon,
  SunIcon,
} from "@/components/icons";
import { ROUTINE_COLLECTION_ORDER, ROUTINE_COLLECTIONS } from "@/components/routines/collections";
import { RoutineCard } from "@/components/routines/RoutineCard";
import { isSpecificFor, matchesSkinType, skinTypeSlug } from "@/components/routines/skin-types";
import type { AccentTone, Product, Routine, RoutineCollection, RoutineLevel, RoutineSkinType } from "@/lib/types";

// Mismos 4 conceptos (y los mismos icono+tono) que ya prometen los tiles de "Encuentra tu rutina ideal" en el inicio,
// para que abrir /rutinas se sienta como continuar esa misma idea y no como aterrizar en otra página.
const LEVELS: RoutineLevel[] = ["Iniciación", "Intermedia", "Avanzada"];
const SKIN_TYPE_OPTIONS: RoutineSkinType[] = ["Grasa", "Seca", "Mixta", "Sensible", "Madura", "Normal", "Todo tipo de piel"];

const TONE_STYLES: Record<
  AccentTone,
  { bg: string; text: string; badge: string; iconBg: string; iconText: string }
> = {
  blush: {
    bg: "bg-blush-50",
    text: "text-blush-700",
    badge: "bg-blush-100 text-blush-700",
    iconBg: "bg-blush-100",
    iconText: "text-blush-600",
  },
  mint: {
    bg: "bg-mint-50",
    text: "text-mint-700",
    badge: "bg-mint-100 text-mint-700",
    iconBg: "bg-mint-100",
    iconText: "text-mint-600",
  },
  peach: {
    bg: "bg-peach-50",
    text: "text-peach-600",
    badge: "bg-peach-100 text-peach-600",
    iconBg: "bg-peach-100",
    iconText: "text-peach-600",
  },
  lavender: {
    bg: "bg-lavender-50",
    text: "text-lavender-600",
    badge: "bg-lavender-100 text-lavender-600",
    iconBg: "bg-lavender-100",
    iconText: "text-lavender-600",
  },
};

type FilterValue = "todas";

// "Mañana" y "Noche" filtran por el momento del día real de la rutina (incluidas las de "Mañana y noche"),
// no solo por su colección; el resto de colecciones filtra por pertenencia.
function matchesCollection(routine: Routine, key: RoutineCollection) {
  if (key === "manana") return routine.timeOfDay !== "Noche";
  if (key === "noche") return routine.timeOfDay !== "Mañana";
  return routine.collection === key;
}
const ALL: FilterValue = "todas";

// Etiqueta de un grupo de filtro con el icono+tono que ya se usa para ese mismo concepto en el inicio.
function FacetLabel({ icon: Icon, tone, children }: { icon: ComponentType<{ className?: string }>; tone: AccentTone; children: React.ReactNode }) {
  const styles = TONE_STYLES[tone];
  return (
    <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-ink">
      <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${styles.iconBg} ${styles.iconText}`}>
        <Icon className="h-3.5 w-3.5" />
      </span>
      {children}
    </span>
  );
}

function FilterSelect({
  value,
  onChange,
  allLabel,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  allLabel: string;
  options: string[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-pill border border-border bg-white py-2.5 pl-4 pr-9 text-xs font-semibold text-ink focus:border-blush-400 focus:outline-none sm:w-auto"
      >
        <option value={ALL}>{allLabel}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink/40" />
    </div>
  );
}

export function RutinasClient({
  routines,
  productPreviews,
  initialCollection,
  initialSkinType,
  initialOnlyFeatured = false,
}: {
  initialOnlyFeatured?: boolean;
  initialSkinType?: RoutineSkinType;
  // Colección ya filtrada al entrar (viene de "?coleccion=" en la URL).
  initialCollection?: RoutineCollection;
  routines: Routine[];
  // Hasta 3 productos (con foto) por rutina, en orden de los pasos, resueltos en el servidor:
  // este componente es cliente y no puede tocar el módulo de productos (usa better-sqlite3/revalidatePath).
  productPreviews: Record<string, Product[]>;
}) {
  const [collection, setCollection] = useState<RoutineCollection | FilterValue>(initialCollection ?? ALL);

  const [level, setLevel] = useState<string>(ALL);
  const [skinType, setSkinType] = useState<string>(initialSkinType ?? ALL);
  const [onlyFeatured, setOnlyFeatured] = useState(initialOnlyFeatured);

  // Mantiene "?coleccion=", "?piel=" y "?favoritas=" al día para que el enlace se pueda compartir o recargar con el mismo filtro.
  useEffect(() => {
    const url = new URL(window.location.href);
    if (collection === ALL) url.searchParams.delete("coleccion");
    else url.searchParams.set("coleccion", collection);
    if (skinType === ALL) url.searchParams.delete("piel");
    else url.searchParams.set("piel", skinTypeSlug(skinType as RoutineSkinType));
    if (onlyFeatured) url.searchParams.set("favoritas", "1");
    else url.searchParams.delete("favoritas");
    window.history.replaceState(window.history.state, "", url);
  }, [collection, skinType, onlyFeatured]);

  const filtered = useMemo(() => {
    const matches = routines.filter((routine) => {
      if (collection !== ALL && !matchesCollection(routine, collection)) return false;
      if (level !== ALL && routine.level !== level) return false;
      if (skinType !== ALL && !matchesSkinType(routine, skinType as RoutineSkinType)) return false;
      if (onlyFeatured && !routine.featured) return false;
      return true;
    });
    if (skinType === ALL) return matches;
    // Con un tipo de piel elegido, primero las rutinas hechas para él y luego las de todo tipo de piel.
    const type = skinType as RoutineSkinType;
    return [...matches.filter((routine) => isSpecificFor(routine, type)), ...matches.filter((routine) => !isSpecificFor(routine, type))];
  }, [routines, collection, level, skinType, onlyFeatured]);

  const hasActiveFilters = collection !== ALL || level !== ALL || skinType !== ALL || onlyFeatured;

  const collectionCounts = useMemo(() => {
    const counts = {} as Record<RoutineCollection, number>;
    for (const key of ROUTINE_COLLECTION_ORDER) counts[key] = routines.filter((routine) => matchesCollection(routine, key)).length;
    return counts;
  }, [routines]);

  function clearFilters() {
    setCollection(ALL);
    setLevel(ALL);
    setSkinType(ALL);
    setOnlyFeatured(false);
  }

  return (
    <div className="container-page py-10 sm:py-14">
      <Breadcrumbs items={[{ label: "Rutinas" }]} />

      <div className="max-w-2xl">
        <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">Rutinas hechas para tu piel</h1>
        <p className="mt-3 text-base leading-relaxed text-ink/65">
          No adivines qué producto usar primero. Cada color es una colección: elige la tuya, afina por
          nivel o tipo de piel, y sigue los pasos en el orden correcto.
        </p>
      </div>

      {/* Colecciones: el color de cada tarjeta dice a cuál pertenece; también funcionan como filtro */}
      <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Colecciones">
        <button
          type="button"
          aria-pressed={collection === ALL}
          onClick={() => setCollection(ALL)}
          className={`rounded-pill px-4 py-2.5 text-sm font-semibold ring-1 transition-[background-color,color,box-shadow,transform] duration-200 ease-out-strong active:scale-[0.97] ${
            collection === ALL ? "bg-ink text-white ring-ink" : "bg-white text-ink/70 ring-border can-hover:hover:ring-ink/30"
          }`}
        >
          Todas
        </button>
        {ROUTINE_COLLECTION_ORDER.map((key) => {
          const entry = ROUTINE_COLLECTIONS[key];
          const Icon = entry.icon;
          const active = collection === key;
          return (
            <button
              key={key}
              type="button"
              aria-pressed={active}
              title={entry.blurb}
              onClick={() => setCollection(active ? ALL : key)}
              className={`flex items-center gap-2 rounded-pill py-2 pl-2 pr-4 text-sm font-semibold ring-1 transition-[background-color,color,box-shadow,transform] duration-200 ease-out-strong active:scale-[0.97] ${
                active ? `${entry.solid} ring-transparent` : `bg-white text-ink/75 ring-border ${entry.hoverRing}`
              }`}
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full transition-colors duration-200 ${
                  active ? "bg-white/25 text-white" : entry.chip
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
              </span>
              {entry.label}
              <span className={`text-xs ${active ? "text-white/75" : "text-ink/40"}`}>{collectionCounts[key] ?? 0}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <FacetLabel icon={SparkleIcon} tone="mint">
            Nivel
          </FacetLabel>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setLevel(ALL)}
              className={`rounded-pill px-4 py-2 text-xs font-semibold transition-colors ${
                level === ALL ? "bg-ink text-white" : "border border-border bg-white text-ink/70 hover:border-mint-300"
              }`}
            >
              Todas
            </button>
            {LEVELS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setLevel(option)}
                className={`rounded-pill px-4 py-2 text-xs font-semibold transition-colors ${
                  level === option ? "bg-ink text-white" : "border border-border bg-white text-ink/70 hover:border-mint-300"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div>
          <FacetLabel icon={LeafIcon} tone="peach">
            Tipo de piel
          </FacetLabel>
          <FilterSelect value={skinType} onChange={setSkinType} allLabel="Cualquier tipo de piel" options={SKIN_TYPE_OPTIONS} />
        </div>

        <div>
          <FacetLabel icon={HeartIcon} tone="blush">
            Comunidad
          </FacetLabel>
          <button
            type="button"
            onClick={() => setOnlyFeatured((v) => !v)}
            aria-pressed={onlyFeatured}
            className={`flex items-center gap-1.5 rounded-pill px-4 py-2.5 text-xs font-semibold transition-colors ${
              onlyFeatured ? "bg-blush-500 text-white" : "border border-border bg-white text-ink/70 hover:border-blush-300"
            }`}
          >
            <HeartIcon className={`h-3.5 w-3.5 ${onlyFeatured ? "fill-white" : ""}`} />
            Solo favoritas
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-5">
        <p className="text-sm text-ink/60">
          {filtered.length} rutina{filtered.length === 1 ? "" : "s"}
        </p>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="flex items-center gap-1.5 rounded-pill border border-border px-3.5 py-2 text-xs font-semibold text-ink/70 hover:border-blush-300 hover:text-blush-600"
          >
            Limpiar filtros
            <CloseIcon className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {filtered.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((routine, index) => (
            // Cada fila entra al hacer scroll, con un pequeño escalonado por columna.
            <Reveal key={routine.slug} delay={(index % 3) * 70} className="h-full">
              <RoutineCard routine={routine} previewProducts={productPreviews[routine.slug] ?? []} />
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="card-surface mt-6 flex flex-col items-center gap-2 px-6 py-16 text-center">
          <p className="font-display text-lg font-bold text-ink">No encontramos rutinas con esos filtros</p>
          <p className="text-sm text-ink/60">Prueba con otra colección, nivel o tipo de piel.</p>
          <button
            type="button"
            onClick={clearFilters}
            className="btn-secondary mt-4 px-5 py-2.5 text-sm"
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
}
