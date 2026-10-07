"use client";

import { useState } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { UserIcon, MailIcon, ShieldIcon, ArrowRightIcon } from "@/components/icons";
import { useToast } from "@/lib/toast-context";

type Tab = "login" | "register";

export default function CuentaPage() {
  const [tab, setTab] = useState<Tab>("login");
  const { show } = useToast();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    show(
      tab === "login"
        ? "El inicio de sesión estará disponible muy pronto"
        : "¡Gracias por registrarte! Estamos afinando esta función"
    );
  }

  return (
    <div className="container-page py-10 sm:py-14">
      <Breadcrumbs items={[{ label: "Mi cuenta" }]} />

      <div className="mx-auto max-w-md">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blush-100 text-blush-600">
            <UserIcon className="h-6 w-6" />
          </div>
          <h1 className="mt-4 font-display text-2xl font-bold text-ink sm:text-3xl">
            {tab === "login" ? "Bienvenida de nuevo" : "Crea tu cuenta"}
          </h1>
          <p className="mt-1.5 text-sm text-ink/60">
            {tab === "login"
              ? "Ingresa para ver tus pedidos y guardar tus favoritos"
              : "Guarda tus rutinas y agiliza tus próximas compras"}
          </p>
        </div>

        <div className="mt-8 flex rounded-pill bg-blush-50 p-1">
          <button
            type="button"
            onClick={() => setTab("login")}
            className={`flex-1 rounded-pill py-2.5 text-sm font-semibold transition-colors ${
              tab === "login" ? "bg-white text-ink shadow-sm" : "text-ink/50"
            }`}
          >
            Iniciar sesión
          </button>
          <button
            type="button"
            onClick={() => setTab("register")}
            className={`flex-1 rounded-pill py-2.5 text-sm font-semibold transition-colors ${
              tab === "register" ? "bg-white text-ink shadow-sm" : "text-ink/50"
            }`}
          >
            Crear cuenta
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          {tab === "register" && (
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-semibold text-ink">Nombre completo</span>
              <input required className="input-field" placeholder="Tu nombre" />
            </label>
          )}
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-semibold text-ink">Correo electrónico</span>
            <div className="relative">
              <MailIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
              <input required type="email" className="input-field pl-11" placeholder="tu@correo.com" />
            </div>
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-semibold text-ink">Contraseña</span>
            <div className="relative">
              <ShieldIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
              <input required type="password" className="input-field pl-11" placeholder="••••••••" minLength={6} />
            </div>
          </label>

          <button type="submit" className="btn-primary mt-2 w-full py-3.5 text-sm">
            {tab === "login" ? "Iniciar sesión" : "Crear cuenta"}
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-ink/45">
          Al continuar aceptas nuestros términos y política de privacidad.
        </p>
      </div>
    </div>
  );
}
