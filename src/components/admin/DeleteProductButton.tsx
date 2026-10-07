"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteProductAction } from "@/lib/admin/actions/products";
import { TrashIcon } from "@/components/icons";

export function DeleteProductButton({ id, name }: { id: number; name: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (!window.confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) return;
        startTransition(async () => {
          await deleteProductAction(id);
          router.refresh();
        });
      }}
      className="text-sm font-semibold text-ink/50 transition-colors hover:text-blush-600 disabled:opacity-50"
      aria-label={`Eliminar ${name}`}
    >
      <TrashIcon className="h-4 w-4" />
    </button>
  );
}
