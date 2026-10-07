"use client";

import { useActionState } from "react";
import { signInAdminAction } from "@/lib/admin/actions/auth";

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(signInAdminAction, undefined);

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Rumí" width={600} height={333} className="mx-auto h-20 w-auto" />
          <p className="mt-2 text-sm text-ink/60">Panel de administración</p>
        </div>

        <form action={formAction} className="card-surface flex flex-col gap-4 p-7">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-semibold text-ink">
              Correo
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoFocus
              className="input-field"
              placeholder="admin@rumi.com"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-semibold text-ink">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="input-field"
              placeholder="••••••••"
            />
          </div>

          {state?.error && (
            <p className="rounded-xl2 bg-blush-50 px-3 py-2.5 text-sm font-semibold text-blush-700">
              {state.error}
            </p>
          )}

          <button type="submit" disabled={isPending} className="btn-primary mt-2 w-full py-3 text-sm disabled:opacity-60">
            {isPending ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}
