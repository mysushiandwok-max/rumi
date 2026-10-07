"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { CartDrawer } from "@/components/CartDrawer";
import { BrandLogo } from "@/components/BrandLogo";
import { ProductArt } from "@/components/illustrations/ProductArt";
import { formatCOP } from "@/lib/format";
import type { AccentTone, Brand, ProductArtVariant } from "@/lib/types";
import {
  SearchIcon,
  UserIcon,
  MenuIcon,
  CloseIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  SparkleIcon,
  LeafIcon,
  StarIcon,
  HeartIcon,
} from "@/components/icons";

// Todo lo que el mega menú necesita, resuelto en el servidor (este componente es cliente y no
// puede tocar @/data/products ni @/data/categories: usan better-sqlite3 / revalidatePath).
export type MegaMenuData = {
  categories: {
    slug: string;
    name: string;
    tagline: string;
    tone: AccentTone;
    artVariant: ProductArtVariant;
    hasProducts: boolean;
  }[];
  topBrands: Brand[];
  totalBrands: number;
  featuredProducts: {
    slug: string;
    name: string;
    price: number;
    image?: string;
    tone: AccentTone;
    artVariant: ProductArtVariant;
  }[];
  featuredRoutines: {
    slug: string;
    name: string;
    tagline: string;
    tone: AccentTone;
    artVariant: ProductArtVariant;
    image?: string;
  }[];
};

type MegaMenuId = "tienda" | "marcas" | "rutinas";

// Mismo orden que tenía la nav siempre (Inicio primero); Tienda/Marcas/Rutinas llevan su mega menú.
const NAV_ITEMS: { href: string; label: string; megaId?: MegaMenuId }[] = [
  { href: "/", label: "Inicio" },
  { href: "/tienda", label: "Tienda", megaId: "tienda" },
  { href: "/marcas", label: "Marcas", megaId: "marcas" },
  { href: "/rutinas", label: "Rutinas", megaId: "rutinas" },
  { href: "/blog", label: "Blog" },
  { href: "/sobre-nosotros", label: "Sobre nosotros" },
];

// Mismos 4 conceptos, iconos y tonos que ya usan el inicio y /rutinas — para que el mega menú
// se sienta como parte del mismo sistema, no como una pieza aparte. Cada uno lleva a /rutinas con su
// filtro activo; los que necesitan una elección (tipo de piel, mañana/noche) muestran sus opciones.
const ROUTINE_FACETS: {
  label: string;
  icon: ComponentType<{ className?: string }>;
  tone: AccentTone;
  href?: string;
  options?: { label: string; href: string }[];
}[] = [
  { label: "Para iniciar", icon: SparkleIcon, tone: "mint", href: "/rutinas?coleccion=iniciar" },
  {
    label: "Por tipo de piel",
    icon: LeafIcon,
    tone: "peach",
    options: [
      { label: "Grasa", href: "/rutinas?piel=grasa" },
      { label: "Seca", href: "/rutinas?piel=seca" },
      { label: "Mixta", href: "/rutinas?piel=mixta" },
      { label: "Sensible", href: "/rutinas?piel=sensible" },
      { label: "Madura", href: "/rutinas?piel=madura" },
      { label: "Normal", href: "/rutinas?piel=normal" },
    ],
  },
  {
    label: "AM y PM",
    icon: StarIcon,
    tone: "lavender",
    options: [
      { label: "☀ Mañana", href: "/rutinas?coleccion=manana" },
      { label: "☾ Noche", href: "/rutinas?coleccion=noche" },
    ],
  },
  { label: "Favoritas", icon: HeartIcon, tone: "blush", href: "/rutinas?favoritas=1" },
];

const FACET_CHIP: Record<AccentTone, string> = {
  blush: "hover:bg-blush-100 hover:text-blush-700",
  mint: "hover:bg-mint-100 hover:text-mint-700",
  peach: "hover:bg-peach-100 hover:text-peach-600",
  lavender: "hover:bg-lavender-100 hover:text-lavender-600",
};

const TONE_DOT: Record<AccentTone, string> = {
  blush: "bg-blush-400",
  mint: "bg-mint-400",
  peach: "bg-peach-400",
  lavender: "bg-lavender-400",
};

const TONE_ICON: Record<AccentTone, string> = {
  blush: "bg-blush-100 text-blush-600",
  mint: "bg-mint-100 text-mint-600",
  peach: "bg-peach-100 text-peach-600",
  lavender: "bg-lavender-100 text-lavender-600",
};

const PRODUCT_TONE_BG: Record<AccentTone, string> = {
  blush: "bg-blush-50",
  mint: "bg-mint-50",
  peach: "bg-peach-50",
  lavender: "bg-lavender-50",
};

// Encabezado chico de cada bloque dentro del panel (no es un kicker decorativo: aquí sí ordena contenido real).
function PanelHeading({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-bold uppercase tracking-wide text-ink/40">{children}</p>;
}

function ThumbPhoto({
  image,
  tone,
  artVariant,
  label,
}: {
  image?: string;
  tone: AccentTone;
  artVariant: ProductArtVariant;
  label: string;
}) {
  return (
    <div className={`relative h-12 w-12 shrink-0 overflow-hidden rounded-xl ${PRODUCT_TONE_BG[tone]}`}>
      {image ? (
        <Image src={image} alt={label} fill sizes="48px" className="object-cover" />
      ) : (
        <ProductArt variant={artVariant} tone={tone} label={label} className="h-full w-full p-1" />
      )}
    </div>
  );
}

function TiendaPanel({ data }: { data: MegaMenuData }) {
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_15rem]">
      <div>
        <PanelHeading>Categorías</PanelHeading>
        <div className="mt-3 grid grid-cols-1 gap-x-8 gap-y-0.5 sm:grid-cols-2">
          {data.categories.map((category) => (
            <Link
              key={category.slug}
              href={`/categoria/${category.slug}`}
              className="group flex items-start gap-3 rounded-xl2 px-3 py-2.5 transition-colors duration-150 ease-out-strong hover:bg-blush-50/70"
            >
              <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${TONE_DOT[category.tone]}`} aria-hidden="true" />
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-ink group-hover:text-blush-600">{category.name}</span>
                  {!category.hasProducts && (
                    <span className="rounded-pill bg-ink/5 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink/40">
                      Pronto
                    </span>
                  )}
                </span>
                <span className="block text-xs text-ink/50">{category.tagline}</span>
              </span>
            </Link>
          ))}
        </div>
        <Link
          href="/tienda"
          className="mt-4 inline-flex items-center gap-1.5 px-3 text-sm font-semibold text-blush-600 transition-transform duration-150 ease-out-strong hover:translate-x-0.5"
        >
          Ver toda la tienda
          <ArrowRightIcon className="h-3.5 w-3.5" />
        </Link>
      </div>

      {data.featuredProducts.length > 0 && (
        <div className="border-t border-border/70 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <PanelHeading>Lo más amado</PanelHeading>
          <div className="mt-3 flex flex-col gap-1">
            {data.featuredProducts.map((product) => (
              <Link
                key={product.slug}
                href={`/producto/${product.slug}`}
                className="group flex items-center gap-3 rounded-xl2 p-2 transition-colors duration-150 ease-out-strong hover:bg-blush-50/70"
              >
                <ThumbPhoto image={product.image} tone={product.tone} artVariant={product.artVariant} label={product.name} />
                <span className="min-w-0 flex-1">
                  <span className="line-clamp-1 block text-sm font-semibold text-ink group-hover:text-blush-600">
                    {product.name}
                  </span>
                  <span className="block text-sm font-bold text-blush-600">{formatCOP(product.price)}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MarcasPanel({ data }: { data: MegaMenuData }) {
  return (
    <div>
      <PanelHeading>Marcas populares</PanelHeading>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {data.topBrands.map((brand) => (
          <Link
            key={brand.slug}
            href={`/marcas/${brand.slug}`}
            className="flex h-16 items-center justify-center rounded-xl2 border border-border/70 px-4 transition-colors duration-150 ease-out-strong hover:border-blush-200 hover:bg-blush-50/40"
          >
            <BrandLogo
              brand={brand}
              className="max-h-6 w-auto max-w-[85%] object-contain"
              fallbackClassName="font-display text-sm font-bold text-ink"
            />
          </Link>
        ))}
      </div>
      <Link
        href="/marcas"
        className="mt-5 inline-flex items-center gap-1.5 px-3 text-sm font-semibold text-blush-600 transition-transform duration-150 ease-out-strong hover:translate-x-0.5"
      >
        Ver las {data.totalBrands} marcas
        <ArrowRightIcon className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

// onNavigate cierra el panel al elegir: si ya estás en /rutinas y solo cambia el filtro, la ruta es la
// misma y el cierre automático por cambio de ruta no se dispara.
function RutinasPanel({ data, onNavigate }: { data: MegaMenuData; onNavigate: () => void }) {
  const facetBox = "flex items-center gap-3 rounded-xl2 border border-border/70 px-4 py-3";
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_16rem]">
      <div>
        <PanelHeading>Elige por dónde empezar</PanelHeading>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {ROUTINE_FACETS.map((facet) => {
            const icon = (
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${TONE_ICON[facet.tone]}`}>
                <facet.icon className="h-4 w-4" />
              </span>
            );
            return facet.options ? (
              <div key={facet.label} className={`${facetBox} flex-wrap`}>
                {icon}
                <span className="text-sm font-semibold text-ink">{facet.label}</span>
                <span className="flex w-full flex-wrap gap-1.5 pl-12">
                  {facet.options.map((option) => (
                    <Link
                      key={option.href}
                      href={option.href}
                      onClick={onNavigate}
                      className={`rounded-pill bg-cream px-3 py-1 text-xs font-semibold text-ink/70 ring-1 ring-border/70 transition-colors duration-150 active:scale-[0.97] ${FACET_CHIP[facet.tone]}`}
                    >
                      {option.label}
                    </Link>
                  ))}
                </span>
              </div>
            ) : (
              <Link
                key={facet.label}
                href={facet.href ?? "/rutinas"}
                onClick={onNavigate}
                className={`group ${facetBox} transition-colors duration-150 ease-out-strong hover:border-blush-200 hover:bg-blush-50/40`}
              >
                {icon}
                <span className="flex-1 text-sm font-semibold text-ink">{facet.label}</span>
                <ArrowRightIcon className="h-3.5 w-3.5 text-ink/30 transition-transform duration-150 ease-out-strong group-hover:translate-x-0.5" />
              </Link>
            );
          })}
        </div>
        <Link
          href="/rutinas"
          onClick={onNavigate}
          className="mt-4 inline-flex items-center gap-1.5 px-3 text-sm font-semibold text-blush-600 transition-transform duration-150 ease-out-strong hover:translate-x-0.5"
        >
          Ver todas las rutinas
          <ArrowRightIcon className="h-3.5 w-3.5" />
        </Link>
      </div>

      {data.featuredRoutines.length > 0 && (
        <div className="border-t border-border/70 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <PanelHeading>Favoritas de la comunidad</PanelHeading>
          <div className="mt-3 flex flex-col gap-1">
            {data.featuredRoutines.map((routine) => (
              <Link
                key={routine.slug}
                href={`/rutinas/${routine.slug}`}
                onClick={onNavigate}
                className="group flex items-center gap-3 rounded-xl2 p-2 transition-colors duration-150 ease-out-strong hover:bg-blush-50/70"
              >
                <ThumbPhoto image={routine.image} tone={routine.tone} artVariant={routine.artVariant} label={routine.name} />
                <span className="min-w-0 flex-1">
                  <span className="line-clamp-1 block text-sm font-semibold text-ink group-hover:text-blush-600">
                    {routine.name}
                  </span>
                  <span className="line-clamp-1 block text-xs text-ink/50">{routine.tagline}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Solo los 3 ítems de NAV_ITEMS que llevan mega menú, para pintar los paneles (uno por trigger).
const MEGA_TRIGGERS = NAV_ITEMS.filter(
  (item): item is { href: string; label: string; megaId: MegaMenuId } => item.megaId !== undefined
);

export function Header({ megaMenu }: { megaMenu: MegaMenuData }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const [activeMega, setActiveMega] = useState<MegaMenuId | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navAreaRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const activePath = usePathname();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- portal target (document.body) only exists client-side; flips once after hydration
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- close overlays on route change (external navigation event)
    setMenuOpen(false);
    setSearchOpen(false);
    setActiveMega(null);
  }, [activePath]);

  // Cierra el mega menú con Escape o al hacer click/foco fuera del área de nav+panel.
  useEffect(() => {
    if (!activeMega) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setActiveMega(null);
    }
    function onPointerDown(event: PointerEvent) {
      if (navAreaRef.current && !navAreaRef.current.contains(event.target as Node)) setActiveMega(null);
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [activeMega]);

  function openMega(id: MegaMenuId) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveMega(id);
  }

  function scheduleCloseMega() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setActiveMega(null), 150);
  }

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/tienda?q=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false);
  }

  return (
    <>
      <header
        className={`sticky top-0 z-50 bg-cream/95 backdrop-blur transition-shadow duration-200 ${
          scrolled ? "shadow-card" : ""
        }`}
      >
      <div className="container-page relative flex h-20 items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Abrir menú"
          className="flex h-10 w-10 items-center justify-center rounded-full lg:hidden"
        >
          <MenuIcon className="h-5 w-5" />
        </button>

        <div ref={navAreaRef} className="hidden lg:block" onMouseLeave={scheduleCloseMega}>
          <nav className="flex items-center gap-7">
            {NAV_ITEMS.map((item) => {
              const isActive = item.href === "/" ? activePath === "/" : activePath.startsWith(item.href);
              const isOpen = item.megaId !== undefined && activeMega === item.megaId;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onMouseEnter={() => {
                    if (item.megaId) {
                      openMega(item.megaId);
                    } else {
                      if (closeTimer.current) clearTimeout(closeTimer.current);
                      setActiveMega(null);
                    }
                  }}
                  onFocus={() => item.megaId && openMega(item.megaId)}
                  aria-expanded={item.megaId ? isOpen : undefined}
                  className={`relative flex items-center gap-1 pb-1 text-sm font-semibold transition-colors ${
                    isActive || isOpen ? "text-blush-600" : "text-ink/80 hover:text-blush-600"
                  }`}
                >
                  {item.label}
                  {item.megaId && (
                    <ChevronDownIcon
                      className={`h-3.5 w-3.5 transition-transform duration-200 ease-out-strong ${isOpen ? "-rotate-180" : ""}`}
                    />
                  )}
                  {isActive && <span className="absolute -bottom-0.5 left-0 h-0.5 w-full rounded-full bg-blush-500" />}
                </Link>
              );
            })}
          </nav>

          {/* Panel del mega menú: siempre montado (transición de entrada/salida real, sin popping),
              solo uno visible a la vez, alineado al ancho del container-page como el resto del sitio. */}
          {MEGA_TRIGGERS.map((trigger) => {
            const isOpen = activeMega === trigger.megaId;
            return (
              <div
                key={trigger.megaId}
                onMouseEnter={() => openMega(trigger.megaId)}
                className={`absolute left-0 right-0 top-full z-40 origin-top px-5 transition-all duration-200 ease-out-strong sm:px-8 lg:px-10 ${
                  isOpen ? "visible translate-y-2 scale-100 opacity-100" : "invisible -translate-y-1 scale-[0.98] opacity-0"
                }`}
                aria-hidden={!isOpen}
              >
                <div className="rounded-[1.75rem] border border-border/70 bg-white p-8 shadow-soft">
                  {trigger.megaId === "tienda" && <TiendaPanel data={megaMenu} />}
                  {trigger.megaId === "marcas" && <MarcasPanel data={megaMenu} />}
                  {trigger.megaId === "rutinas" && <RutinasPanel data={megaMenu} onNavigate={() => setActiveMega(null)} />}
                </div>
              </div>
            );
          })}
        </div>

        <Link href="/" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <img src="/logo.png" alt="Rumí" width={600} height={333} className="h-14 w-auto sm:h-16" />
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => setSearchOpen((v) => !v)}
            aria-label="Buscar"
            aria-expanded={searchOpen}
            className="hidden h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-blush-50 active:scale-90 sm:flex"
          >
            <SearchIcon className="h-5 w-5" />
          </button>
          <Link
            href="/cuenta"
            aria-label="Mi cuenta"
            className="hidden h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-blush-50 active:scale-90 sm:flex"
          >
            <UserIcon className="h-5 w-5" />
          </Link>
          <CartDrawer />
        </div>
      </div>

      <div
        className={`overflow-hidden border-t border-border/70 transition-[max-height,opacity] duration-300 ease-out-strong ${
          searchOpen ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <form onSubmit={submitSearch} className="container-page flex items-center gap-3 py-4">
          <SearchIcon className="h-4 w-4 shrink-0 text-ink/40" />
          <input
            ref={searchInputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Busca productos, marcas o rutinas..."
            className="w-full bg-transparent text-sm text-ink placeholder:text-ink/40 focus:outline-none"
          />
        </form>
      </div>

    </header>

      {mounted &&
        createPortal(
          <>
            <div
              className={`fixed inset-0 z-[90] bg-ink/40 transition-opacity duration-300 ease-out-strong lg:hidden ${
                menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Menú"
              className={`fixed inset-y-0 left-0 z-[95] flex w-[85%] max-w-xs flex-col bg-cream shadow-soft transition-transform duration-300 ease-out-strong lg:hidden ${
                menuOpen ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <div className="flex items-center justify-between px-6 py-5">
                <img src="/logo.png" alt="Rumí" width={600} height={333} className="h-9 w-auto" />
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Cerrar menú"
                  className="flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-150 ease-out-strong active:scale-90"
                >
                  <CloseIcon className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-2">
                {NAV_ITEMS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center justify-between rounded-xl2 px-3.5 py-3 text-base font-semibold transition-colors ${
                      activePath === link.href ? "bg-blush-50 text-blush-600" : "text-ink hover:bg-blush-50"
                    }`}
                  >
                    {link.label}
                    <ArrowRightIcon className="h-4 w-4 opacity-40" />
                  </Link>
                ))}
                <Link
                  href="/cuenta"
                  className="mt-2 flex items-center justify-between rounded-xl2 border border-border px-3.5 py-3 text-base font-semibold text-ink hover:bg-blush-50"
                >
                  Mi cuenta
                  <UserIcon className="h-4 w-4 opacity-50" />
                </Link>
              </nav>
            </div>
          </>,
          document.body
        )}
    </>
  );
}
