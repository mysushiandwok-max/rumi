"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteCategoryAction } from "@/lib/admin/actions/categories";
import { TrashIcon } from "@/components/icons";

export function DeleteCategoryButton({ id, name }: { id: number; name: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (!window.confirm(`¿Eliminar la categoría "${name}"?`)) return;
        startTransition(async () => {
          await deleteCategoryAction(id);
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
