import { StarIcon } from "@/components/icons";

export function RatingStars({
  rating,
  reviewCount,
  size = "sm",
}: {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md";
}) {
  const starSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5 text-peach-400">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon
            key={i}
            className={`${starSize} ${i < Math.round(rating) ? "opacity-100" : "opacity-25"}`}
          />
        ))}
      </div>
      {reviewCount !== undefined && (
        <span className="text-xs text-ink/60">({reviewCount})</span>
      )}
    </div>
  );
}
