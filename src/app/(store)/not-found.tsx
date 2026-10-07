import Link from "next/link";
import { LeafIcon, ArrowRightIcon } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="container-page flex flex-col items-center gap-4 py-24 text-center sm:py-32">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-mint-100">
        <LeafIcon className="h-9 w-9 text-mint-500" />
      </div>
      <span className="font-display text-6xl font-bold text-blush-200 sm:text-7xl">404</span>
      <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
        Esta página se perdió en la rutina
      </h1>
      <p className="max-w-sm text-sm text-ink/60">
        No encontramos lo que buscabas. Volvamos a algo que sí existe.
      </p>
      <Link href="/" className="btn-primary mt-2 px-6 py-3 text-sm">
        Volver al inicio
        <ArrowRightIcon className="h-4 w-4" />
      </Link>
    </div>
  );
}
