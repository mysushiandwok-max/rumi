"use client";

import { useId } from "react";
import type { AccentTone, ProductArtVariant } from "@/lib/types";

type ToneColors = {
  light: string;
  mid: string;
  deep: string;
  ink: string;
};

const TONE_COLORS: Record<AccentTone, ToneColors> = {
  blush: { light: "#FCE8ED", mid: "#F5B4C6", deep: "#D64C74", ink: "#8F2C4B" },
  mint: { light: "#DFF2E4", mid: "#98D3A8", deep: "#3B8452", ink: "#2E6941" },
  peach: { light: "#FAE6CD", mid: "#EFB16E", deep: "#B4611F", ink: "#8A4C18" },
  lavender: { light: "#EAE2F7", mid: "#B79EE2", deep: "#654896", ink: "#4E3873" },
};

export function ProductArt({
  variant,
  tone,
  label,
  className,
}: {
  variant: ProductArtVariant;
  tone: AccentTone;
  label: string;
  className?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const c = TONE_COLORS[tone];
  const bodyGradId = `body-${uid}`;
  const capGradId = `cap-${uid}`;
  // Conectores cortos ("de", "la"...) no cuentan como palabra: "Contorno de ojos" debe dar "CO", no "CD"
  // (y así no choca con "Cuidado de labios", que también empieza con "C" seguido de "de").
  const STOPWORDS = new Set(["de", "del", "la", "el", "los", "las", "y"]);
  const initials = label
    .split(" ")
    .filter(Boolean)
    .filter((word) => !STOPWORDS.has(word.toLowerCase()))
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  return (
    <svg
      viewBox="0 0 200 280"
      className={className}
      role="img"
      aria-label={label}
    >
      <defs>
        <linearGradient id={bodyGradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="55%" stopColor={c.light} />
          <stop offset="100%" stopColor={c.mid} />
        </linearGradient>
        <linearGradient id={capGradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c.deep} />
          <stop offset="100%" stopColor={c.ink} />
        </linearGradient>
      </defs>

      <ellipse cx="100" cy="256" rx="52" ry="10" fill={c.deep} opacity="0.14" />

      {variant === "tube" && (
        <g>
          <rect x="86" y="20" width="28" height="22" rx="6" fill={`url(#${capGradId})`} />
          <path
            d="M62 46c0-6 4-10 10-10h56c6 0 10 4 10 10v150c0 24-18 44-38 44s-38-20-38-44z"
            fill={`url(#${bodyGradId})`}
            stroke={c.mid}
            strokeWidth="1.5"
          />
          <rect x="70" y="120" width="60" height="66" rx="16" fill="white" opacity="0.86" />
        </g>
      )}

      {variant === "dropper" && (
        <g>
          <rect x="82" y="16" width="36" height="16" rx="4" fill={`url(#${capGradId})`} />
          <rect x="94" y="4" width="12" height="16" rx="4" fill={c.ink} />
          <path
            d="M64 32h72v34c0 4-2 7-5 9-9 6-15 16-15 28v92c0 10-8 18-18 18h-16c-10 0-18-8-18-18v-92c0-12-6-22-15-28-3-2-5-5-5-9z"
            fill={`url(#${bodyGradId})`}
            stroke={c.mid}
            strokeWidth="1.5"
          />
          <rect x="76" y="150" width="48" height="58" rx="14" fill="white" opacity="0.86" />
        </g>
      )}

      {variant === "toner" && (
        <g>
          <rect x="82" y="14" width="36" height="18" rx="5" fill={`url(#${capGradId})`} />
          <rect x="90" y="32" width="20" height="14" fill={c.mid} />
          <path
            d="M68 46h64c4 0 6 3 6 6v170c0 8-6 14-14 14H76c-8 0-14-6-14-14V52c0-3 2-6 6-6z"
            fill={`url(#${bodyGradId})`}
            stroke={c.mid}
            strokeWidth="1.5"
          />
          <rect x="72" y="130" width="56" height="70" rx="14" fill="white" opacity="0.86" />
        </g>
      )}

      {variant === "jar" && (
        <g>
          <rect x="54" y="60" width="92" height="26" rx="10" fill={`url(#${capGradId})`} />
          <path
            d="M58 86h84c4 0 7 3 7 7v104c0 26-22 42-49 42s-49-16-49-42V93c0-4 3-7 7-7z"
            fill={`url(#${bodyGradId})`}
            stroke={c.mid}
            strokeWidth="1.5"
          />
          <rect x="66" y="150" width="68" height="60" rx="14" fill="white" opacity="0.86" />
        </g>
      )}

      {variant === "pump" && (
        <g>
          <rect x="88" y="14" width="24" height="10" rx="3" fill={c.ink} />
          <path d="M100 24v18" stroke={c.ink} strokeWidth="6" strokeLinecap="round" />
          <rect x="78" y="40" width="44" height="20" rx="8" fill={`url(#${capGradId})`} />
          <path
            d="M64 60c0-5 4-9 9-9h54c5 0 9 4 9 9v146c0 22-16 40-36 40s-36-18-36-40z"
            fill={`url(#${bodyGradId})`}
            stroke={c.mid}
            strokeWidth="1.5"
          />
          <rect x="72" y="128" width="56" height="66" rx="14" fill="white" opacity="0.86" />
        </g>
      )}

      {variant === "mist" && (
        <g>
          <rect x="120" y="26" width="30" height="12" rx="3" fill={c.ink} />
          <path d="M120 32h-16c-5 0-9 4-9 9v6h30z" fill={`url(#${capGradId})`} />
          <rect x="88" y="40" width="24" height="16" rx="4" fill={c.mid} />
          <path
            d="M70 56h60c4 0 7 3 7 7v130c0 12-10 22-22 22H85c-12 0-22-10-22-22V63c0-4 3-7 7-7z"
            fill={`url(#${bodyGradId})`}
            stroke={c.mid}
            strokeWidth="1.5"
          />
          <rect x="72" y="128" width="56" height="60" rx="14" fill="white" opacity="0.86" />
        </g>
      )}

      {variant === "stick" && (
        <g>
          <path
            d="M52 40h96c6 0 10 5 9 11l-14 176c-2 20-19 35-39 35h-8c-20 0-37-15-39-35L43 51c-1-6 3-11 9-11z"
            fill={`url(#${bodyGradId})`}
            stroke={c.mid}
            strokeWidth="1.5"
          />
          <path d="M52 40h96l-4 30H56z" fill={c.mid} opacity="0.6" />
          <rect x="68" y="110" width="64" height="66" rx="14" fill="white" opacity="0.86" />
        </g>
      )}

      <text
        x="100"
        y={variant === "jar" ? 190 : variant === "tube" ? 158 : 168}
        textAnchor="middle"
        fontFamily="var(--font-quicksand), sans-serif"
        fontWeight={700}
        fontSize="22"
        fill={c.ink}
      >
        {initials}
      </text>
    </svg>
  );
}
