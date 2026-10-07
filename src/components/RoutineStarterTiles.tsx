"use client";

import { useCallback, useEffect, useRef, useState, type ComponentType } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  ArrowRightIcon,
  CheckIcon,
  CloseIcon,
  DropletIcon,
  HeartIcon,
  HourglassIcon,
  LeafIcon,
  MoonIcon,
  RefreshIcon,
  SparkleIcon,
  StarIcon,
  SunIcon,
} from "@/components/icons";
import type { RoutineSkinType } from "@/lib/types";

const TILE_STYLES: Record<string, { iconBg: string; iconText: string }> = {
  mint: { iconBg: "bg-mint-100", iconText: "text-mint-600" },
  peach: { iconBg: "bg-peach-100", iconText: "text-peach-600" },
  lavender: { iconBg: "bg-lavender-100", iconText: "text-lavender-600" },
  blush: { iconBg: "bg-blush-100", iconText: "text-blush-600" },
};

type PopupKind = "starter" | "skin" | "time";

type Tile = {
  title: string;
  icon: ComponentType<{ className?: string }>;
  tone: keyof typeof TILE_STYLES;
  image: string;
  // Las tarjetas con popup abren un mensaje o una elección antes de llevar a /rutinas filtrado.
  popup?: PopupKind;
  // Las que no tienen popup van directo a este enlace.
  href?: string;
};

const TILES: Tile[] = [
  { title: "Para iniciar", icon: SparkleIcon, tone: "mint", image: "iniciar.webp", popup: "starter" },
  { title: "Por tipo de piel", icon: LeafIcon, tone: "peach", image: "tipo-de-piel.webp", popup: "skin" },
  { title: "AM y PM", icon: StarIcon, tone: "lavender", image: "am-pm.webp", popup: "time" },
  { title: "Favoritas de la comunidad", icon: HeartIcon, tone: "blush", image: "favoritas.webp", href: "/rutinas?favoritas=1" },
];

const tileImage = (image: string) => `url("/uploads/rutinas%20banners/${image}")`;

function TileContent({ tile }: { tile: Tile }) {
  const styles = TILE_STYLES[tile.tone];
  return (
    <>
      <div className={`absolute inset-0 ${styles.iconBg}`} />
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out-strong can-hover:group-hover:scale-110"
        style={{ backgroundImage: tileImage(tile.image) }}
      />

      <span className={`relative m-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/90 backdrop-blur-sm ${styles.iconText}`}>
        <tile.icon className="h-5 w-5" />
      </span>
      <div className="relative flex flex-col items-start gap-2 p-4">
        <span className="inline-flex items-center rounded-full bg-white/95 px-4 py-2 font-display text-sm font-bold text-ink backdrop-blur-sm sm:text-base">
          {tile.title}
        </span>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold backdrop-blur-sm ${styles.iconBg} ${styles.iconText}`}>
          Ver rutinas
          <ArrowRightIcon className="h-3 w-3 transition-transform duration-150 ease-out-strong can-hover:group-hover:translate-x-0.5" />
        </span>
      </div>
    </>
  );
}

const TILE_CLASS =
  "group relative flex aspect-[3/4] flex-col justify-between overflow-hidden rounded-3xl text-left ring-1 ring-white/60 transition-transform duration-300 ease-out-strong active:scale-[0.98] can-hover:hover:-translate-y-1.5";

// Estructura común de los popups: fondo, panel con la foto de la tarjeta como cabecera y botón de cerrar.
// Es un modal, así que aparece desde el centro (no desde la tarjeta). Entra en 260ms y sale más rápido (160ms).
function ModalShell({
  open,
  onClose,
  image,
  labelledBy,
  initialFocus,
  children,
}: {
  open: boolean;
  onClose: () => void;
  image: string;
  labelledBy: string;
  initialFocus: React.RefObject<HTMLElement | null>;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    // Al bloquear el scroll desaparece la barra y la página saltaría a la derecha: se compensa su ancho.
    const previousOverflow = document.body.style.overflow;
    const previousPadding = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
    // Foco en la acción principal para que con teclado baste un Enter.
    const focusTimer = window.setTimeout(() => initialFocus.current?.focus(), 50);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
      window.clearTimeout(focusTimer);
    };
  }, [open, onClose, initialFocus]);

  const timing = open ? "[transition-duration:260ms]" : "[transition-duration:160ms]";

  return (
    <div className={`fixed inset-0 z-[90] flex items-center justify-center p-4 ${open ? "" : "pointer-events-none"}`}>
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`absolute inset-0 bg-ink/40 backdrop-blur-[2px] transition-opacity ease-out-strong ${timing} ${open ? "opacity-100" : "opacity-0"}`}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-hidden={!open}
        className={`relative max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto overflow-x-hidden rounded-[2rem] bg-cream shadow-soft transition-[opacity,transform] ease-out-strong ${timing} ${
          open ? "translate-y-0 scale-100 opacity-100" : "translate-y-2 scale-[0.96] opacity-0"
        }`}
      >
        <div className="relative h-36 bg-cover bg-[center_30%] sm:h-40" style={{ backgroundImage: tileImage(image) }}>
          <div className="absolute inset-0 bg-gradient-to-t from-cream via-cream/10 to-transparent" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm backdrop-blur-sm transition-transform duration-150 ease-out-strong active:scale-90"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="relative -mt-8 px-6 pb-6 sm:px-8 sm:pb-8">{children}</div>
      </div>
    </div>
  );
}

// Popup amable para quien está empezando: explica qué va a encontrar y lleva a /rutinas con "Para iniciar" filtrado.
function StarterModal({ open, onClose, starterCount }: { open: boolean; onClose: () => void; starterCount: number }) {
  const ctaRef = useRef<HTMLAnchorElement>(null);

  return (
    <ModalShell open={open} onClose={onClose} image="iniciar.webp" labelledBy="starter-modal-title" initialFocus={ctaRef}>
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-mint-100 text-mint-600 shadow-sm ring-4 ring-cream">
        <SparkleIcon className="h-7 w-7" />
      </span>

      <h2 id="starter-modal-title" className="mt-4 font-display text-2xl font-bold leading-tight text-ink">
        ¡Qué bueno que empiezas!
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-ink/65 sm:text-base">
        Empezar es lo más difícil y ya diste el primer paso. Te preparamos rutinas cortas, con productos suaves y
        fáciles de usar, para que tu piel se acostumbre sin complicarte.
      </p>

      <ul className="mt-5 flex flex-col gap-2.5">
        {["Pocos pasos, de 2 a 4 productos", "Suaves, pensadas para todo tipo de piel", "Explicadas paso a paso y en orden"].map(
          (item) => (
            <li key={item} className="flex items-center gap-2.5 text-sm font-semibold text-ink/75">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-mint-100 text-mint-700">
                <CheckIcon className="h-3.5 w-3.5" />
              </span>
              {item}
            </li>
          )
        )}
      </ul>

      <div className="mt-7 flex flex-col-reverse gap-2.5 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={onClose}
          className="rounded-pill px-5 py-3 text-sm font-semibold text-ink/60 transition-colors duration-150 can-hover:hover:text-ink"
        >
          Ahora no
        </button>
        <Link
          ref={ctaRef}
          href="/rutinas?coleccion=iniciar"
          onClick={onClose}
          className="group flex flex-1 items-center justify-center gap-2 rounded-pill bg-mint-700 px-6 py-3.5 font-display text-sm font-bold text-white shadow-[0_10px_22px_-10px_rgba(46,105,65,0.6)] transition-[transform,background-color] duration-200 ease-out-strong active:scale-[0.97] can-hover:hover:-translate-y-0.5 can-hover:hover:bg-mint-600"
        >
          Ver {starterCount} rutinas para iniciar
          <ArrowRightIcon className="h-4 w-4 transition-transform duration-150 ease-out-strong can-hover:group-hover:translate-x-0.5" />
        </Link>
      </div>
    </ModalShell>
  );
}

// Opciones del popup de tipo de piel, con una pista corta para quien no está segura de cuál es la suya.
const SKIN_OPTIONS: { type: RoutineSkinType; slug: string; hint: string; icon: ComponentType<{ className?: string }> }[] = [
  { type: "Grasa", slug: "grasa", hint: "Brillo en todo el rostro y poros visibles", icon: DropletIcon },
  { type: "Seca", slug: "seca", hint: "Tirantez, aspereza o descamación", icon: SunIcon },
  { type: "Mixta", slug: "mixta", hint: "Grasa en la zona T, seca o normal en mejillas", icon: RefreshIcon },
  { type: "Sensible", slug: "sensible", hint: "Se enrojece o irrita con facilidad", icon: HeartIcon },
  { type: "Madura", slug: "madura", hint: "Buscas firmeza y suavizar líneas", icon: HourglassIcon },
  { type: "Normal", slug: "normal", hint: "Equilibrada, sin molestias frecuentes", icon: SparkleIcon },
];

// Popup para elegir el tipo de piel: cada opción lleva a /rutinas con ese filtro ya activo.
// Las opciones entran en cascada al abrir (es un momento puntual, no algo que se repita a cada rato).
function SkinTypeModal({
  open,
  onClose,
  skinCounts,
}: {
  open: boolean;
  onClose: () => void;
  skinCounts: Record<string, number>;
}) {
  const firstOptionRef = useRef<HTMLAnchorElement>(null);

  return (
    <ModalShell open={open} onClose={onClose} image="tipo-de-piel.webp" labelledBy="skin-modal-title" initialFocus={firstOptionRef}>
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-peach-100 text-peach-600 shadow-sm ring-4 ring-cream">
        <LeafIcon className="h-7 w-7" />
      </span>

      <h2 id="skin-modal-title" className="mt-4 font-display text-2xl font-bold leading-tight text-ink">
        ¿Cómo es tu piel?
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-ink/65">
        Elige la que más se parezca a la tuya y te mostramos las rutinas pensadas para ella.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-2.5">
        {SKIN_OPTIONS.map((option, i) => (
          <Link
            key={option.slug}
            ref={i === 0 ? firstOptionRef : undefined}
            href={`/rutinas?piel=${option.slug}`}
            onClick={onClose}
            style={{ transitionDelay: open ? `${100 + i * 35}ms` : "0ms" }}
            className={`group flex flex-col gap-2 rounded-2xl bg-white p-3.5 ring-1 ring-border/70 transition-[opacity,transform,box-shadow] ease-out-strong [transition-duration:260ms] active:scale-[0.97] can-hover:hover:shadow-card can-hover:hover:ring-peach-300 ${
              open ? "translate-y-0 opacity-100" : "translate-y-1.5 opacity-0"
            }`}
          >
            <span className="flex items-center justify-between">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-peach-100 text-peach-600 transition-transform duration-200 ease-out-strong can-hover:group-hover:scale-110">
                <option.icon className="h-4 w-4" />
              </span>
              <span className="text-[11px] font-semibold text-ink/40">{skinCounts[option.slug] ?? 0} rutinas</span>
            </span>
            <span className="font-display text-base font-bold text-ink">{option.type}</span>
            <span className="text-xs leading-snug text-ink/55">{option.hint}</span>
          </Link>
        ))}
      </div>

      <Link
        href="/rutinas?piel=todo"
        onClick={onClose}
        className="group mt-4 flex items-center justify-center gap-1.5 rounded-pill px-4 py-2.5 text-sm font-semibold text-peach-600 transition-colors duration-150 can-hover:hover:bg-peach-50"
      >
        No sé cuál es mi tipo de piel
        <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-150 ease-out-strong can-hover:group-hover:translate-x-0.5" />
      </Link>
    </ModalShell>
  );
}

// Las dos opciones del popup de "AM y PM": cada una con su pastel (los mismos de las colecciones Mañana y Noche).
const TIME_OPTIONS = [
  {
    key: "manana",
    label: "De día",
    kicker: "AM",
    text: "Limpieza suave, hidratación y protector solar para salir con la piel lista.",
    icon: SunIcon,
    card: "bg-gradient-to-br from-butter-100 via-butter-50 to-peach-100/70 ring-butter-200 can-hover:hover:ring-butter-300",
    iconWrap: "bg-white/80 text-butter-700",
    // El sol gira despacio al pasar el mouse; la luna se inclina.
    iconMotion: "can-hover:group-hover:rotate-45",
    accent: "text-butter-700",
    doodle: "text-butter-300",
    cta: "bg-butter-700",
  },
  {
    key: "noche",
    label: "De noche",
    kicker: "PM",
    text: "Limpieza a fondo y tratamiento para reparar la piel mientras duermes.",
    icon: MoonIcon,
    card: "bg-gradient-to-br from-lavender-100 via-lavender-50 to-blush-100/60 ring-lavender-200 can-hover:hover:ring-lavender-300",
    iconWrap: "bg-white/80 text-lavender-600",
    iconMotion: "can-hover:group-hover:-rotate-12",
    accent: "text-lavender-600",
    doodle: "text-lavender-300",
    cta: "bg-lavender-600",
  },
] as const;

// Popup para elegir entre rutinas de día o de noche; cada opción lleva a /rutinas con Mañana o Noche filtrado.
function TimeOfDayModal({
  open,
  onClose,
  timeCounts,
}: {
  open: boolean;
  onClose: () => void;
  timeCounts: Record<"manana" | "noche", number>;
}) {
  const firstOptionRef = useRef<HTMLAnchorElement>(null);

  return (
    <ModalShell open={open} onClose={onClose} image="am-pm.webp" labelledBy="time-modal-title" initialFocus={firstOptionRef}>
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lavender-100 text-lavender-600 shadow-sm ring-4 ring-cream">
        <StarIcon className="h-7 w-7" />
      </span>

      <h2 id="time-modal-title" className="mt-4 font-display text-2xl font-bold leading-tight text-ink">
        ¿Para qué momento del día?
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-ink/65">
        Tu piel necesita cosas distintas de día y de noche. ¿Por cuál empezamos?
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {TIME_OPTIONS.map((option, i) => (
          <Link
            key={option.key}
            ref={i === 0 ? firstOptionRef : undefined}
            href={`/rutinas?coleccion=${option.key}`}
            onClick={onClose}
            style={{ transitionDelay: open ? `${100 + i * 60}ms` : "0ms" }}
            className={`group relative isolate flex flex-col overflow-hidden rounded-[1.5rem] p-4 ring-1 transition-[opacity,transform,box-shadow] ease-out-strong [transition-duration:280ms] active:scale-[0.97] can-hover:hover:-translate-y-1 can-hover:hover:shadow-card ${option.card} ${
              open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            }`}
          >
            {/* Detalles de fondo: puntitos de estrella en la noche, rayos en el día */}
            <span aria-hidden="true" className={`pointer-events-none absolute inset-0 -z-10 ${option.doodle}`}>
              {option.key === "noche" ? (
                <>
                  <SparkleIcon className="absolute right-12 top-4 h-4 w-4" />
                  <SparkleIcon className="absolute right-[4.5rem] top-12 h-3 w-3" />
                  <StarIcon className="absolute right-6 top-[4.25rem] h-3 w-3 fill-current" />
                </>
              ) : (
                <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="absolute -right-1 -top-1 h-20 w-20">
                  <path d="M60 8v10M74 22H64M70 38l-8-4M44 4l2 10" />
                </svg>
              )}
            </span>

            <span className="flex items-start justify-between">
              <span className={`flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm ${option.iconWrap}`}>
                <option.icon className={`h-6 w-6 transition-transform duration-500 ease-out-strong ${option.iconMotion}`} />
              </span>
              <span className={`rounded-pill bg-white/70 px-2 py-0.5 text-[11px] font-bold ${option.accent}`}>{option.kicker}</span>
            </span>

            <span className="mt-4 font-display text-lg font-bold text-ink">{option.label}</span>
            <span className="mt-1 text-xs leading-snug text-ink/60">{option.text}</span>

            <span className="mt-4 flex items-center justify-between">
              <span className={`text-xs font-bold ${option.accent}`}>{timeCounts[option.key]} rutinas</span>
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-white shadow-sm transition-transform duration-200 ease-out-strong can-hover:group-hover:translate-x-0.5 ${option.cta}`}
              >
                <ArrowRightIcon className="h-3.5 w-3.5" />
              </span>
            </span>
          </Link>
        ))}
      </div>

      <Link
        href="/rutinas"
        onClick={onClose}
        className="group mt-4 flex items-center justify-center gap-1.5 rounded-pill px-4 py-2.5 text-sm font-semibold text-lavender-600 transition-colors duration-150 can-hover:hover:bg-lavender-50"
      >
        Quiero ver todas las rutinas
        <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-150 ease-out-strong can-hover:group-hover:translate-x-0.5" />
      </Link>
    </ModalShell>
  );
}

export function RoutineStarterTiles({
  starterCount,
  skinCounts,
  timeCounts,
}: {
  starterCount: number;
  // Cuántas rutinas hay de día (incluye "Mañana y noche") y de noche, igual que los filtros de /rutinas.
  timeCounts: Record<"manana" | "noche", number>;
  // Cuántas rutinas verá cada tipo de piel en /rutinas (por slug de "?piel=").
  skinCounts: Record<string, number>;
}) {
  const [openPopup, setOpenPopup] = useState<PopupKind | null>(null);
  const [mounted, setMounted] = useState(false);
  const triggerRefs = useRef<Partial<Record<PopupKind, HTMLButtonElement | null>>>({});

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- el portal (document.body) solo existe en el cliente
    setMounted(true);
  }, []);

  const openPopupRef = useRef<PopupKind | null>(null);
  useEffect(() => {
    openPopupRef.current = openPopup;
  }, [openPopup]);

  const close = useCallback(() => {
    const current = openPopupRef.current;
    setOpenPopup(null);
    // Devuelve el foco a la tarjeta que abrió el popup.
    if (current) triggerRefs.current[current]?.focus();
  }, []);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
        {TILES.map((tile) =>
          tile.popup ? (
            <button
              key={tile.title}
              ref={(element) => {
                triggerRefs.current[tile.popup!] = element;
              }}
              type="button"
              onClick={() => setOpenPopup(tile.popup!)}
              aria-haspopup="dialog"
              className={TILE_CLASS}
            >
              <TileContent tile={tile} />
            </button>
          ) : (
            <Link key={tile.title} href={tile.href ?? "/rutinas"} className={TILE_CLASS}>
              <TileContent tile={tile} />
            </Link>
          )
        )}
      </div>

      {mounted &&
        createPortal(
          <>
            <StarterModal open={openPopup === "starter"} onClose={close} starterCount={starterCount} />
            <SkinTypeModal open={openPopup === "skin"} onClose={close} skinCounts={skinCounts} />
            <TimeOfDayModal open={openPopup === "time"} onClose={close} timeCounts={timeCounts} />
          </>,
          document.body
        )}
    </>
  );
}
