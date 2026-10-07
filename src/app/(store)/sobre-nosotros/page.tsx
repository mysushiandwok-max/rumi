import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import {
  LeafIcon,
  BunnyIcon,
  TruckIcon,
  ShieldIcon,
  ArrowRightIcon,
  HeartIcon,
} from "@/components/icons";

export const metadata: Metadata = { title: "Sobre nosotros" };

export default function SobreNosotrosPage() {
  return (
    <div className="py-10 sm:py-14">
      <div className="container-page">
        <Breadcrumbs items={[{ label: "Sobre nosotros" }]} />
      </div>

      <section className="container-page grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <span className="pill-badge bg-mint-100 text-mint-700">
            <LeafIcon className="h-3.5 w-3.5" /> NUESTRA HISTORIA
          </span>
          <h1 className="mt-5 font-display text-3xl font-bold leading-tight text-ink sm:text-4xl lg:text-5xl">
            Creemos que cuidar tu piel
            <br />
            <span className="text-blush-500">debería sentirse bien</span>
          </h1>
          <p className="mt-5 text-base leading-relaxed text-ink/65 sm:text-lg">
            Rumí nació de la obsesión con el skincare coreano: fórmulas honestas,
            ingredientes que realmente hacen algo por tu piel, y rutinas pensadas
            paso a paso en lugar de rutinas genéricas de diez pasos que nadie sigue.
          </p>
          <p className="mt-4 text-base leading-relaxed text-ink/65 sm:text-lg">
            Curamos cada marca que llega a nuestro catálogo: probamos, leemos
            ingredientes y solo traemos lo que creemos que vale la pena en tu
            neceser.
          </p>
        </div>

        <div className="relative aspect-square overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blush-100 via-mint-50 to-lavender-50">
          <div className="absolute left-8 top-10 h-20 w-20 rounded-full bg-blush-200/70" />
          <div className="absolute bottom-10 right-10 h-28 w-28 rounded-full bg-mint-200/60" />
          <div className="absolute left-1/2 top-1/2 flex h-40 w-40 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-soft">
            <span className="font-script text-5xl text-blush-500">Rumí</span>
          </div>
        </div>
      </section>

      <section className="container-page mt-20 sm:mt-28">
        <h2 className="text-center font-display text-2xl font-bold text-ink sm:text-3xl">
          Lo que nos guía
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: LeafIcon, tone: "mint", title: "Ingredientes seguros", copy: "Solo trabajamos con marcas que publican y respaldan sus fórmulas." },
            { icon: BunnyIcon, tone: "blush", title: "Cruelty free", copy: "Ninguna marca de nuestro catálogo prueba en animales." },
            { icon: TruckIcon, tone: "lavender", title: "Envíos rápidos", copy: "Despachamos desde Bogotá a todo el país en tiempo récord." },
            { icon: ShieldIcon, tone: "peach", title: "100% auténtico", copy: "Importamos directo, sin intermediarios ni falsificaciones." },
          ].map((item) => (
            <div key={item.title} className="card-surface p-6 text-center">
              <div
                className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${
                  item.tone === "mint"
                    ? "bg-mint-100 text-mint-600"
                    : item.tone === "blush"
                      ? "bg-blush-100 text-blush-600"
                      : item.tone === "lavender"
                        ? "bg-lavender-100 text-lavender-600"
                        : "bg-peach-100 text-peach-600"
                }`}
              >
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-base font-bold text-ink">{item.title}</h3>
              <p className="mt-1.5 text-sm text-ink/60">{item.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page mt-20 sm:mt-28">
        <div className="grid gap-10 rounded-[2.5rem] bg-blush-50/70 p-8 sm:p-12 lg:grid-cols-2 lg:gap-16 lg:p-16">
          <div>
            <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
              Cómo elegimos cada marca
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-ink/65 sm:text-base">
              Antes de sumar una marca a Rumí, revisamos su lista de ingredientes,
              su reputación en la comunidad K-beauty y probamos los productos
              nosotras mismas. Si no cumple con nuestro estándar de seguridad y
              efectividad, no entra al catálogo.
            </p>
          </div>
          <ol className="flex flex-col gap-4">
            {[
              { step: "01", title: "Investigamos", copy: "Revisamos ingredientes, certificaciones y trayectoria de la marca." },
              { step: "02", title: "Probamos", copy: "Testeamos cada producto antes de ofrecerlo a nuestra comunidad." },
              { step: "03", title: "Curamos", copy: "Organizamos el catálogo por rutina, no solo por categoría." },
            ].map((item) => (
              <li key={item.step} className="flex items-start gap-4 rounded-xl2 bg-white p-4">
                <span className="font-display text-lg font-bold text-blush-300">{item.step}</span>
                <div>
                  <p className="font-display text-sm font-bold text-ink">{item.title}</p>
                  <p className="mt-0.5 text-sm text-ink/60">{item.copy}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container-page mt-20 sm:mt-28 sm:mb-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <HeartIcon className="h-8 w-8 text-blush-400" />
          <h2 className="max-w-lg font-display text-2xl font-bold text-ink sm:text-3xl">
            ¿Tienes preguntas sobre tu piel o tu pedido?
          </h2>
          <p className="max-w-md text-sm text-ink/60">
            Escríbenos, nos encanta ayudar a encontrar la rutina correcta.
          </p>
          <Link href="/blog" className="btn-secondary mt-2 px-6 py-3 text-sm">
            Lee nuestras guías
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
