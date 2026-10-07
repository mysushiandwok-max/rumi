"use client";

import Link from "next/link";
import { useState } from "react";
import {
  LeafIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  InstagramIcon,
  FacebookIcon,
  TikTokIcon,
  ArrowRightIcon,
} from "@/components/icons";
import { useToast } from "@/lib/toast-context";
import { LEGAL_PAGES } from "@/data/legal";

export function Footer() {
  const [email, setEmail] = useState("");
  const { show } = useToast();

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    show("¡Gracias por suscribirte! Revisa tu correo pronto 🌿");
    setEmail("");
  }

  return (
    <footer className="mt-24 bg-blush-50/60">
      <div className="container-page grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_0.9fr_1.1fr_1.2fr] lg:gap-10">
        <div>
          <img src="/logo.png" alt="Rumí" width={600} height={333} className="h-10 w-auto" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink/65">
            Skincare coreano curado con cariño para tu piel: fórmulas suaves,
            ingredientes efectivos y una rutina que se siente bien de principio a fin.
          </p>
          <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-mint-700">
            <LeafIcon className="h-4 w-4" />
            Ingredientes seguros · Cruelty free
          </div>
          <div className="mt-6 flex items-center gap-3">
            {[InstagramIcon, TikTokIcon, FacebookIcon].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Síguenos en redes sociales"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-blush-600 transition-transform duration-150 ease-out-strong hover:scale-105 hover:bg-blush-100 active:scale-90"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wide text-ink">Tienda</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-ink/65">
            <li><Link href="/tienda" className="hover:text-blush-600">Todos los productos</Link></li>
            <li><Link href="/marcas" className="hover:text-blush-600">Marcas</Link></li>
            <li><Link href="/rutinas" className="hover:text-blush-600">Rutinas</Link></li>
            <li><Link href="/categoria/limpiadores" className="hover:text-blush-600">Limpiadores</Link></li>
            <li><Link href="/categoria/hidratantes" className="hover:text-blush-600">Hidratantes</Link></li>
            <li><Link href="/categoria/serums" className="hover:text-blush-600">Sérums</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wide text-ink">Ayuda</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-ink/65">
            <li><Link href="/sobre-nosotros" className="hover:text-blush-600">Sobre nosotros</Link></li>
            <li><Link href="/blog" className="hover:text-blush-600">Blog</Link></li>
            <li><Link href="/cuenta" className="hover:text-blush-600">Mi cuenta</Link></li>
            <li><Link href="/carrito" className="hover:text-blush-600">Carrito</Link></li>
          </ul>
          <ul className="mt-6 space-y-2.5 text-sm text-ink/65">
            <li className="flex items-center gap-2">
              <MailIcon className="h-4 w-4 shrink-0 text-blush-400" /> hola@rumiskincare.com
            </li>
            <li className="flex items-center gap-2">
              <PhoneIcon className="h-4 w-4 shrink-0 text-blush-400" /> +57 300 123 4567
            </li>
            <li className="flex items-center gap-2">
              <MapPinIcon className="h-4 w-4 shrink-0 text-blush-400" /> Bogotá, Colombia
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wide text-ink">Legal</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-ink/65">
            {LEGAL_PAGES.map((p) => (
              <li key={p.slug}>
                <Link href={`/legal/${p.slug}`} className="hover:text-blush-600">{p.title}</Link>
              </li>
            ))}
            <li>
              <a href="https://www.sic.gov.co" target="_blank" rel="noopener noreferrer" className="hover:text-blush-600">
                Superintendencia de Industria y Comercio
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wide text-ink">
            Únete a la comunidad Rumí
          </h3>
          <p className="mt-4 text-sm text-ink/65">
            Recibe tips de rutina y ofertas exclusivas directo en tu correo.
          </p>
          <form onSubmit={handleSubscribe} className="mt-4 flex items-center gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              className="w-full rounded-pill border border-border bg-white px-4 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:border-blush-400 focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Suscribirme"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blush-500 text-white transition-transform duration-150 ease-out-strong hover:bg-blush-600 active:scale-90"
            >
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          </form>
          <p className="mt-3 text-xs text-ink/50">
            Al suscribirte autorizas el tratamiento de tus datos según nuestra{" "}
            <Link href="/legal/politica-de-privacidad" className="underline hover:text-blush-600">
              política de privacidad
            </Link>
            .
          </p>
        </div>
      </div>

      <div className="border-t border-border/70">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-xs text-ink/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Rumí. Todos los derechos reservados.</p>
          <p>Hecho con 🌿 para la comunidad K-beauty en Colombia</p>
        </div>
      </div>
    </footer>
  );
}
