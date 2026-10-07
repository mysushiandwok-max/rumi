"use client";

import { useState, type ReactNode } from "react";
import { PlusIcon, MinusIcon } from "@/components/icons";

export function AccordionItem({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border/70 py-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="font-display text-base font-bold text-ink">{title}</span>
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blush-50 text-blush-600">
          {open ? <MinusIcon className="h-3.5 w-3.5" /> : <PlusIcon className="h-3.5 w-3.5" />}
        </span>
      </button>
      <div
        className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out-strong ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="pt-3 text-sm leading-relaxed text-ink/65">{children}</div>
        </div>
      </div>
    </div>
  );
}
