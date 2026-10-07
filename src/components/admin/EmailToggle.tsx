"use client";

import { useTransition } from "react";
import { toggleEmailTemplateAction } from "@/lib/admin/actions/emails";

export function EmailToggle({ event, enabled }: { event: string; enabled: boolean }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => startTransition(() => toggleEmailTemplateAction(event, !enabled))}
      disabled={pending}
      aria-pressed={enabled}
      aria-label={enabled ? "Desactivar correo" : "Activar correo"}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 disabled:opacity-50 ${
        enabled ? "bg-mint-500" : "bg-ink/15"
      }`}
    >
      <span
        className={`inline-block h-[18px] w-[18px] rounded-full bg-white shadow transition-transform duration-200 ${
          enabled ? "translate-x-[22px]" : "translate-x-[3px]"
        }`}
      />
    </button>
  );
}
