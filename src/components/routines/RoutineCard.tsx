import Link from "next/link";
import { ArrowRightIcon, HeartIcon, MoonIcon, SparkleIcon, SunIcon } from "@/components/icons";
import { ROUTINE_COLLECTIONS } from "@/components/routines/collections";
import { ProductCollage } from "@/components/routines/ProductCollage";
import type { Product, Routine, RoutineCollection } from "@/lib/types";

// Tarjeta de rutina con collage de productos y el pastel de su colección (en /rutinas y en "Rutinas sugeridas").
// Garabatos del fondo de la tarjeta, pegados a los bordes de la zona de texto para no pisar el contenido.
function CardDecor({ collection }: { collection: RoutineCollection }) {
  const styles = ROUTINE_COLLECTIONS[collection];
  const Icon = styles.icon;
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      <div className={`absolute -bottom-20 -right-16 h-56 w-56 rounded-full blur-3xl ${styles.blob}`} />
      <div className={`absolute -left-12 top-1/2 h-40 w-40 rounded-full blur-3xl ${styles.blob}`} />
      <div className={styles.doodle}>
        <Icon className="absolute -bottom-6 -right-6 h-32 w-32 rotate-12 opacity-60 transition-transform duration-500 ease-out-strong can-hover:group-hover:rotate-[20deg] can-hover:group-hover:scale-105" />
        <svg
          viewBox="0 0 160 40"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          className="absolute bottom-4 left-[38%] w-20 opacity-70"
        >
          <path d="M4 20c12-16 24-16 36 0s24 16 36 0 24-16 36 0 24 16 36 0" />
        </svg>
        <HeartIcon className="absolute right-6 top-[62%] h-4 w-4 -rotate-12 fill-current" />
        <SparkleIcon className="absolute right-[30%] top-[58%] h-4 w-4 rotate-6" />
      </div>
    </div>
  );
}

export function RoutineCard({ routine, previewProducts }: { routine: Routine; previewProducts: Product[] }) {
  const styles = ROUTINE_COLLECTIONS[routine.collection];
  const CollectionIcon = styles.icon;
  const TimeIcon = routine.timeOfDay === "Noche" ? MoonIcon : SunIcon;

  return (
    <Link
      href={`/rutinas/${routine.slug}`}
      className={`group relative isolate flex h-full flex-col overflow-hidden rounded-[2rem] p-3 ring-1 transition-[transform,box-shadow] duration-300 ease-out-strong active:scale-[0.985] can-hover:hover:-translate-y-1.5 can-hover:hover:shadow-card ${styles.card}`}
    >
      <CardDecor collection={routine.collection} />

      {/* Collage con todos los productos de la rutina */}
      <div className="relative aspect-[5/4] overflow-hidden rounded-[1.5rem] bg-white/70 p-1.5 ring-1 ring-white/80">
        {previewProducts.length > 0 ? (
          <ProductCollage products={previewProducts} />
        ) : (
          <div className={`flex h-full items-center justify-center ${styles.text}`}>
            <CollectionIcon className="h-16 w-16 opacity-40" />
          </div>
        )}

        <span className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-pill bg-white/90 px-3 py-1.5 text-xs font-bold text-ink shadow-sm backdrop-blur-sm">
          <CollectionIcon className={`h-3.5 w-3.5 ${styles.text}`} />
          {styles.label}
        </span>

        {routine.featured && (
          <span
            className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-blush-500 text-white shadow-sm"
            title="Favorita de la comunidad"
          >
            <HeartIcon className="h-4 w-4 fill-white" />
            <span className="sr-only">Favorita de la comunidad</span>
          </span>
        )}
      </div>

      {/* Info */}
      <div className="relative flex flex-1 flex-col px-3 pb-3 pt-5">
        <p className={`text-xs font-bold uppercase tracking-wide ${styles.text}`}>{routine.skinConcern}</p>
        <h2 className="mt-1.5 font-display text-xl font-bold leading-tight text-ink sm:text-[1.35rem]">{routine.name}</h2>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink/65">{routine.description}</p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          <span className="rounded-pill bg-white/80 px-2.5 py-1 text-xs font-semibold text-ink/70">
            {routine.steps.length} pasos
          </span>
          <span className="flex items-center gap-1 rounded-pill bg-white/80 px-2.5 py-1 text-xs font-semibold text-ink/70">
            <TimeIcon className="h-3 w-3" />
            {routine.timeOfDay}
          </span>
          <span className="rounded-pill bg-white/80 px-2.5 py-1 text-xs font-semibold text-ink/70">{routine.level}</span>
        </div>

        <div className="mt-auto flex items-center justify-between pt-6">
          <span className={`text-sm font-bold ${styles.text}`}>Ver rutina</span>
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-full shadow-sm transition-transform duration-200 ease-out-strong can-hover:group-hover:translate-x-1 ${styles.solid}`}
          >
            <ArrowRightIcon className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
