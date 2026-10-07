"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ComponentType, type SVGProps } from "react";
import { signOutAdminAction } from "@/lib/admin/actions/auth";
import {
  HomeIcon,
  BagIcon,
  TagIcon,
  TruckIcon,
  StarIcon,
  ChartIcon,
  PlugIcon,
  LogOutIcon,
  MenuIcon,
  CloseIcon,
  SearchIcon,
  BellIcon,
  MailIcon,
} from "@/components/icons";

type NavItem = {
  href: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  exact?: boolean;
};
type NavSection = { group: string; items: NavItem[] };

const NAV: NavSection[] = [
  { group: "General", items: [{ href: "/admin", label: "Panel", icon: HomeIcon, exact: true }] },
  {
    group: "Catálogo",
    items: [
      { href: "/admin/productos", label: "Productos", icon: BagIcon },
      { href: "/admin/categorias", label: "Categorías", icon: TagIcon },
    ],
  },
  {
    group: "Ventas",
    items: [
      { href: "/admin/pedidos", label: "Pedidos", icon: TruckIcon },
      { href: "/admin/resenas", label: "Reseñas", icon: StarIcon },
    ],
  },
  {
    group: "Operaciones",
    items: [
      { href: "/admin/finanzas", label: "Finanzas", icon: ChartIcon },
      { href: "/admin/envios", label: "Envíos", icon: TruckIcon },
    ],
  },
  {
    group: "Sistema",
    items: [
      { href: "/admin/correos", label: "Correos", icon: MailIcon },
      { href: "/admin/conectores", label: "Conectores", icon: PlugIcon },
    ],
  },
];

function firstNameFromEmail(email: string) {
  const local = email.split("@")[0] ?? email;
  const first = local.split(/[.\-_]/)[0] ?? local;
  return first.charAt(0).toUpperCase() + first.slice(1);
}

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex flex-1 flex-col gap-5">
      {NAV.map((section) => (
        <div key={section.group}>
          <p className="mb-1.5 px-3.5 text-[10px] font-bold uppercase tracking-wider text-ink/35">{section.group}</p>
          <div className="flex flex-col gap-1">
            {section.items.map((item) => {
              const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={`flex items-center gap-3 rounded-pill px-3.5 py-2.5 text-sm font-semibold transition-colors ${
                    active ? "bg-blush-500 text-white shadow-pop" : "text-ink/65 hover:bg-blush-50 hover:text-blush-600"
                  }`}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

function SidebarFooter({ email }: { email: string }) {
  const initial = email.charAt(0).toUpperCase();
  return (
    <div className="mt-4 border-t border-border pt-4">
      <div className="flex items-center gap-3 px-2">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blush-100 font-display font-bold text-blush-600">
          {initial}
        </div>
        <p className="truncate text-xs text-ink/50">{email}</p>
      </div>
      <form action={signOutAdminAction}>
        <button
          type="submit"
          className="mt-2 flex w-full items-center gap-3 rounded-pill px-3.5 py-2.5 text-sm font-semibold text-ink/65 transition-colors hover:bg-blush-50 hover:text-blush-600"
        >
          <LogOutIcon className="h-4 w-4" />
          Cerrar sesión
        </button>
      </form>
    </div>
  );
}

export function AdminShell({
  email,
  notificationCount,
  children,
}: {
  email: string;
  notificationCount: number;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [navOpen, setNavOpen] = useState(false);
  const firstName = firstNameFromEmail(email);
  const today = new Date().toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" });
  const todayCapitalized = today.charAt(0).toUpperCase() + today.slice(1);

  return (
    <div className="flex min-h-screen bg-cream">
      {navOpen && (
        <div
          className="fixed inset-0 z-40 bg-ink/45 lg:hidden"
          onClick={() => setNavOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-border bg-white px-4 py-6 transition-transform duration-300 lg:static lg:translate-x-0 ${
          navOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-center justify-between px-2">
          <Link href="/admin" className="flex items-end gap-2" onClick={() => setNavOpen(false)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Rumí" width={600} height={333} className="h-11 w-auto" />
            <span className="mb-1 text-[10px] font-bold uppercase tracking-wider text-ink/40">Admin</span>
          </Link>
          <button
            type="button"
            onClick={() => setNavOpen(false)}
            className="rounded-pill p-1.5 text-ink/50 hover:bg-blush-50 lg:hidden"
            aria-label="Cerrar menú"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <NavLinks pathname={pathname} onNavigate={() => setNavOpen(false)} />
        <SidebarFooter email={email} />
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex items-center justify-between gap-3 border-b border-border bg-white px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setNavOpen(true)}
              className="rounded-pill p-1.5 text-ink/60 hover:bg-blush-50 lg:hidden"
              aria-label="Abrir menú"
            >
              <MenuIcon className="h-5 w-5" />
            </button>
            <div>
              <p className="font-display text-sm font-bold text-ink sm:text-base">Hola, {firstName}</p>
              <p className="hidden text-xs text-ink/45 sm:block">{todayCapitalized}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <form action="/admin/productos" method="GET" className="hidden md:block">
              <div className="relative">
                <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
                <input
                  type="text"
                  name="q"
                  placeholder="Buscar productos…"
                  className="w-56 rounded-pill border border-border bg-cream py-2 pl-9 pr-3 text-sm text-ink outline-none transition-colors focus:border-blush-400 focus:bg-white lg:w-72"
                />
              </div>
            </form>
            <Link
              href="/admin/pedidos?estado=pendiente"
              className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-pill text-ink/60 hover:bg-blush-50"
              aria-label="Notificaciones"
            >
              <BellIcon className="h-5 w-5" />
              {notificationCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-blush-500 px-1 text-[10px] font-bold text-white">
                  {notificationCount > 9 ? "9+" : notificationCount}
                </span>
              )}
            </Link>
          </div>
        </header>

        <main className="flex-1 p-5 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
