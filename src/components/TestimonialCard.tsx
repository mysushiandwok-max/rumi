import Link from "next/link";
import { StarIcon, PlayIcon, MapPinIcon, ArrowRightIcon } from "@/components/icons";
import { formatCOP } from "@/lib/format";
import type { FeaturedReview } from "@/data/reviews";

const TONE_BG: Record<string, string> = {
  blush: "bg-blush-50",
  mint: "bg-mint-50",
  peach: "bg-peach-50",
  lavender: "bg-lavender-50",
};

const TONE_BUBBLE: Record<string, string> = {
  blush: "bg-blush-100 text-blush-700",
  mint: "bg-mint-100 text-mint-700",
  peach: "bg-peach-100 text-peach-700",
  lavender: "bg-lavender-100 text-lavender-700",
};

const TONE_CHIP_BG: Record<string, string> = {
  blush: "bg-blush-50",
  mint: "bg-mint-50",
  peach: "bg-peach-50",
  lavender: "bg-lavender-50",
};

const TONE_BUTTON: Record<string, string> = {
  blush: "bg-blush-500 group-hover/chip:bg-blush-600",
  mint: "bg-mint-500 group-hover/chip:bg-mint-600",
  peach: "bg-peach-500 group-hover/chip:bg-peach-600",
  lavender: "bg-lavender-500 group-hover/chip:bg-lavender-600",
};

const AVATAR_BG: Record<string, string> = {
  blush: "bg-blush-100 text-blush-600",
  mint: "bg-mint-100 text-mint-700",
  peach: "bg-peach-100 text-peach-600",
  lavender: "bg-lavender-100 text-lavender-600",
};

export function TestimonialCard({
  review,
  index,
  onPlay,
}: {
  review: FeaturedReview;
  index: number;
  onPlay?: () => void;
}) {
  const initials = review.authorName
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const hasVideo = Boolean(review.videoUrl);
  const reaction = review.comment.length > 42 ? `${review.comment.slice(0, 42)}…` : review.comment;

  const mediaClassName = `relative block aspect-[4/5] w-full overflow-hidden rounded-2xl text-left ${TONE_BG[review.tone]}`;

  const mediaContent = (
    <>
      {review.productImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={review.productImage}
          alt={review.productName}
          className="absolute inset-0 h-full w-full object-contain p-9 transition-transform duration-500 ease-out-strong group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0" />
      )}

      <span
        className={`absolute right-3 top-3 max-w-[70%] rotate-2 rounded-2xl rounded-tr-sm px-3 py-2 text-[11px] font-semibold leading-snug shadow-sm ${TONE_BUBBLE[review.tone]}`}
      >
        &ldquo;{reaction}&rdquo;
      </span>

      {hasVideo ? (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-ink shadow-lg transition-transform duration-200 ease-out-strong group-hover:scale-110">
            <PlayIcon className="ml-0.5 h-5 w-5" />
          </span>
        </span>
      ) : null}
    </>
  );

  return (
    <article
      style={{ animationDelay: `${index * 90}ms` }}
      className="group flex h-full animate-pop-in flex-col overflow-hidden rounded-3xl bg-white p-3 shadow-card ring-1 ring-border/40 transition-all duration-300 ease-out-strong hover:-translate-y-1 hover:shadow-[0_24px_48px_-20px_rgba(43,35,32,0.28)]"
    >
      {hasVideo ? (
        <button
          type="button"
          onClick={onPlay}
          aria-label={`Reproducir video de ${review.authorName}`}
          className={mediaClassName}
        >
          {mediaContent}
        </button>
      ) : (
        <div className={mediaClassName}>{mediaContent}</div>
      )}

      <div className="flex flex-1 flex-col gap-2.5 px-1 pt-3">
        <div className="flex items-center gap-2.5">
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-display text-xs font-bold ${AVATAR_BG[review.tone]}`}
          >
            {initials}
          </span>
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-bold text-ink">{review.authorName}</p>
            {review.authorCity && (
              <p className="flex items-center gap-1 truncate text-xs text-ink/50">
                <MapPinIcon className="h-3 w-3 shrink-0" />
                {review.authorCity}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-0.5 text-peach-400">
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon
              key={i}
              className={`h-3.5 w-3.5 ${i < Math.round(review.rating) ? "opacity-100" : "opacity-25"}`}
            />
          ))}
        </div>

        <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-ink/70">&ldquo;{review.comment}&rdquo;</p>

        <Link
          href={`/producto/${review.productSlug}`}
          className={`group/chip mt-1 flex items-center gap-2.5 rounded-2xl p-2 transition-colors ${TONE_CHIP_BG[review.tone]}`}
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white">
            {review.productImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={review.productImage} alt="" className="h-full w-full object-contain p-1.5" />
            )}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[11px] font-semibold uppercase tracking-wide text-ink/45">
              {review.brandName}
            </span>
            <span className="block truncate text-sm font-bold text-ink">{review.productName}</span>
            <span className="block text-xs font-bold text-ink/60">{formatCOP(review.productPrice)}</span>
          </span>
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white transition-transform duration-150 ease-out-strong group-hover/chip:scale-110 ${TONE_BUTTON[review.tone]}`}
          >
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </span>
        </Link>
      </div>
    </article>
  );
}
