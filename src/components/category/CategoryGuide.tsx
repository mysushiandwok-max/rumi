"use client";

import { useId, useRef, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { PastelDoodles } from "@/components/category/PastelDoodles";
import { TONE } from "@/components/category/tones";
import type { AccentTone, Product } from "@/lib/types";

export type GuideGroupView = {
  title: string;
  items: { label: string; blurb: string; products: Product[] }[];
};

export function CategoryGuide({
  title,
  intro,
  tone,
  groups,
}: {
  title: string;
  intro: string;
  tone: AccentTone;
  groups: GuideGroupView[];
}) {
  const styles = TONE[tone];
  const baseId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [groupIndex, setGroupIndex] = useState(0);
  // Recuerda la opción elegida en cada grupo al cambiar de pestaña y volver.
  const [picked, setPicked] = useState<number[]>(() => groups.map(() => 0));

  const group = groups[groupIndex];
  const itemIndex = Math.min(picked[groupIndex] ?? 0, group.items.length - 1);
  const item = group.items[itemIndex];

  const selectGroup = (index: number) => {
    setGroupIndex(index);
    tabRefs.current[index]?.focus();
  };

  const onTabKeyDown = (event: React.KeyboardEvent, index: number) => {
    const last = groups.length - 1;
    const next =
      event.key === "ArrowRight" ? (index === last ? 0 : index + 1)
      : event.key === "ArrowLeft" ? (index === 0 ? last : index - 1)
      : event.key === "Home" ? 0
      : event.key === "End" ? last
      : null;
    if (next === null) return;
    event.preventDefault();
    selectGroup(next);
  };

  return (
    <section
      aria-labelledby={`${baseId}-title`}
      className={`relative isolate overflow-hidden rounded-[2rem] px-5 py-8 sm:px-10 sm:py-12 ${styles.panel}`}
    >
      <PastelDoodles tone={tone} />

      <div className="relative z-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <h2 id={`${baseId}-title`} className="font-display text-2xl font-bold leading-tight text-ink sm:text-3xl">
              {title}
            </h2>
            {intro && <p className="mt-2 text-sm text-ink/65 sm:text-base">{intro}</p>}
          </div>

          {groups.length > 1 && (
            <div
              role="tablist"
              aria-label={title}
              style={{ gridTemplateColumns: `repeat(${groups.length}, 1fr)` }}
              className="relative grid w-full rounded-pill bg-white p-1 shadow-card sm:inline-grid sm:w-auto"
            >
              <span
                aria-hidden="true"
                style={{
                  width: `calc((100% - 0.5rem) / ${groups.length})`,
                  transform: `translateX(${groupIndex * 100}%)`,
                }}
                className={`pointer-events-none absolute inset-y-1 left-1 rounded-pill transition-transform [transition-duration:280ms] ease-in-out-strong ${styles.solid}`}
              />
              {groups.map((entry, index) => {
                const active = index === groupIndex;
                return (
                  <button
                    key={entry.title}
                    ref={(element) => {
                      tabRefs.current[index] = element;
                    }}
                    type="button"
                    role="tab"
                    id={`${baseId}-tab-${index}`}
                    aria-selected={active}
                    aria-controls={`${baseId}-panel`}
                    tabIndex={active ? 0 : -1}
                    onClick={() => setGroupIndex(index)}
                    onKeyDown={(event) => onTabKeyDown(event, index)}
                    className={`relative z-10 whitespace-nowrap rounded-pill px-3 py-2.5 font-display text-[13px] font-semibold transition-[color,transform] duration-200 ease-out-strong active:scale-[0.97] sm:px-6 sm:text-sm ${
                      active ? "text-white" : "text-ink/65 hover:text-ink"
                    }`}
                  >
                    {entry.title}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div
          role={groups.length > 1 ? "tabpanel" : undefined}
          id={`${baseId}-panel`}
          aria-labelledby={groups.length > 1 ? `${baseId}-tab-${groupIndex}` : undefined}
          className="mt-8"
        >
          {group.items.length > 1 && (
            <div
              key={groupIndex}
              role="group"
              aria-label={group.title}
              className="flex animate-fade-up-fast flex-wrap gap-2"
            >
              {group.items.map((entry, index) => {
                const active = index === itemIndex;
                return (
                  <button
                    key={entry.label}
                    type="button"
                    aria-pressed={active}
                    onClick={() =>
                      setPicked((current) => current.map((value, position) => (position === groupIndex ? index : value)))
                    }
                    className={`rounded-pill px-4 py-2 font-display text-sm font-semibold transition-[background-color,color,box-shadow,transform] duration-200 ease-out-strong active:scale-[0.97] ${
                      active
                        ? `${styles.solid} text-white ring-1 ring-transparent`
                        : `bg-white text-ink/75 ring-1 ${styles.chip} hover:text-ink`
                    }`}
                  >
                    {entry.label}
                  </button>
                );
              })}
            </div>
          )}

          <div
            key={`${groupIndex}-${itemIndex}`}
            className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,8fr)] lg:gap-12"
          >
            <div className="animate-fade-up-fast">
              <h3 className="font-display text-2xl font-bold leading-tight text-ink sm:text-3xl">{item.label}</h3>
              {item.blurb && (
                <p className="mt-3 max-w-md text-base leading-relaxed text-ink/65">{item.blurb}</p>
              )}
              <p className="mt-5 text-sm text-ink/50" aria-live="polite">
                {item.products.length === 1 ? "1 producto recomendado" : `${item.products.length} productos recomendados`}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-[repeat(auto-fit,minmax(11rem,14rem))]">
              {item.products.map((product, index) => (
                <ProductCard key={product.slug} product={product} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
