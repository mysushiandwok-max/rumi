"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateReviewStatusAction, deleteReviewAction, removeReviewPhotoAction } from "@/lib/admin/actions/reviews";
import { deleteRoutineReviewAction, updateRoutineReviewStatusAction } from "@/lib/admin/actions/routine-reviews";
import { CloseIcon, TrashIcon } from "@/components/icons";
import type { ReviewStatus } from "@/lib/types";

// Lo que la fila necesita de una reseña, sea de producto o de rutina.
type ModeratedReview = {
  id: number;
  authorName: string;
  authorCity: string | null;
  rating: number;
  comment: string;
  photos?: string[];
  status: ReviewStatus;
  createdAt: string;
};

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-peach-100 text-peach-600",
  approved: "bg-mint-100 text-mint-700",
  rejected: "bg-ink/5 text-ink/50",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendiente",
  approved: "Publicada",
  rejected: "Rechazada",
};

export function ReviewModerationRow({
  review,
  subject,
  kind = "product",
}: {
  review: ModeratedReview;
  // Qué se reseñó (slug del producto o nombre de la rutina).
  subject: string;
  kind?: "product" | "routine";
}) {
  const updateStatus = kind === "routine" ? updateRoutineReviewStatusAction : updateReviewStatusAction;
  const remove = kind === "routine" ? deleteRoutineReviewAction : deleteReviewAction;
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function setStatus(status: "approved" | "rejected" | "pending") {
    startTransition(async () => {
      await updateStatus(review.id, status);
      router.refresh();
    });
  }

  return (
    <tr className="border-b border-border/60 last:border-0 align-top">
      <td className="px-5 py-3">
        <p className="font-semibold text-ink">{subject}</p>
      </td>
      <td className="px-5 py-3">
        <p className="font-semibold text-ink">
          {review.authorName}
          {review.authorCity ? <span className="font-normal text-ink/45"> · {review.authorCity}</span> : null}
        </p>
        <p className="text-xs text-ink/45">{new Date(review.createdAt).toLocaleDateString("es-CO")}</p>
      </td>
      <td className="px-5 py-3 text-ink/70">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</td>
      <td className="max-w-xs px-5 py-3 text-ink/70">
        <p className="whitespace-pre-line">{review.comment}</p>
        {review.photos && review.photos.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {review.photos.map((photo) => (
              <div key={photo} className="group relative h-16 w-16 overflow-hidden rounded-xl ring-1 ring-border">
                <a href={photo} target="_blank" rel="noreferrer" aria-label="Ver foto en grande">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo} alt="" className="h-full w-full object-cover" />
                </a>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => {
                    if (!window.confirm("¿Quitar esta foto de la reseña?")) return;
                    startTransition(async () => {
                      await removeReviewPhotoAction(review.id, photo);
                      router.refresh();
                    });
                  }}
                  aria-label="Quitar foto"
                  className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-white/90 text-ink opacity-0 shadow-sm transition-opacity focus-visible:opacity-100 group-hover:opacity-100"
                >
                  <CloseIcon className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </td>
      <td className="px-5 py-3">
        <span className={`pill-badge ${STATUS_STYLES[review.status]}`}>{STATUS_LABELS[review.status] ?? review.status}</span>
      </td>
      <td className="px-5 py-3">
        <div className="flex items-center justify-end gap-3">
          {review.status !== "approved" && (
            <button
              type="button"
              disabled={isPending}
              onClick={() => setStatus("approved")}
              className="text-sm font-semibold text-mint-700 hover:text-mint-600"
            >
              Aprobar
            </button>
          )}
          {review.status !== "rejected" && (
            <button
              type="button"
              disabled={isPending}
              onClick={() => setStatus("rejected")}
              className="text-sm font-semibold text-ink/50 hover:text-blush-600"
            >
              Rechazar
            </button>
          )}
          <button
            type="button"
            disabled={isPending}
            onClick={() => {
              if (!window.confirm("¿Eliminar esta reseña?")) return;
              startTransition(async () => {
                await remove(review.id);
                router.refresh();
              });
            }}
            aria-label="Eliminar reseña"
            className="text-ink/40 hover:text-blush-600"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
