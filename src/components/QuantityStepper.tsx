"use client";

import { MinusIcon, PlusIcon } from "@/components/icons";

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="flex items-center gap-3 rounded-pill border border-border px-2 py-1.5">
      <button
        type="button"
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        aria-label="Reducir cantidad"
        className="flex h-8 w-8 items-center justify-center rounded-full text-ink transition-transform duration-150 ease-out-strong hover:bg-blush-50 active:scale-90 disabled:opacity-30 disabled:hover:bg-transparent"
      >
        <MinusIcon className="h-3.5 w-3.5" />
      </button>
      <span className="w-5 text-center text-sm font-bold text-ink">{value}</span>
      <button
        type="button"
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        aria-label="Aumentar cantidad"
        className="flex h-8 w-8 items-center justify-center rounded-full text-ink transition-transform duration-150 ease-out-strong hover:bg-blush-50 active:scale-90 disabled:opacity-30 disabled:hover:bg-transparent"
      >
        <PlusIcon className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
