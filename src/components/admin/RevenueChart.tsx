"use client";

import { useState } from "react";
import { formatCOP } from "@/lib/format";

export function RevenueChart({ data }: { data: { date: string; total: number }[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const max = Math.max(...data.map((d) => d.total), 1);
  const CHART_HEIGHT = 120;
  const MIN_BAR_HEIGHT = 3;

  return (
    <div className="flex items-end gap-1.5 sm:gap-2" style={{ height: CHART_HEIGHT + 28 }}>
      {data.map((d, i) => {
        const barHeight = d.total > 0 ? Math.max(MIN_BAR_HEIGHT, Math.round((d.total / max) * CHART_HEIGHT)) : MIN_BAR_HEIGHT;
        const isHovered = hovered === i;
        const dayLabel = new Date(d.date + "T00:00:00Z").toLocaleDateString("es-CO", { day: "numeric" });
        const fullLabel = new Date(d.date + "T00:00:00Z").toLocaleDateString("es-CO", {
          day: "numeric",
          month: "short",
        });
        const showLabel = i === 0 || i === data.length - 1 || i % 3 === 0;

        return (
          <div
            key={d.date}
            className="relative flex flex-1 flex-col items-center justify-end"
            style={{ height: CHART_HEIGHT }}
          >
            {isHovered && (
              <div className="pointer-events-none absolute bottom-full z-10 mb-2 whitespace-nowrap rounded-lg bg-ink px-2.5 py-1.5 text-xs font-semibold text-white shadow-card">
                {fullLabel}: {formatCOP(d.total)}
                <div className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-4 border-transparent border-t-ink" />
              </div>
            )}
            <button
              type="button"
              tabIndex={0}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered(null)}
              className={`w-full max-w-[22px] cursor-default self-end rounded-t-md transition-colors ${
                isHovered ? "bg-blush-600" : d.total > 0 ? "bg-blush-400" : "bg-blush-100"
              }`}
              style={{ height: barHeight }}
            />
            <span className="mt-2 text-[10px] text-ink/40">{showLabel ? dayLabel : ""}</span>
          </div>
        );
      })}
    </div>
  );
}
