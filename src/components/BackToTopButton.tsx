"use client";

import { useEffect, useState } from "react";
import { ArrowUpIcon } from "@/components/icons";

export function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 480);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Volver arriba"
      className={`group fixed bottom-8 right-8 z-50 hidden h-12 w-12 items-center justify-center lg:flex ${
        visible ? "pointer-events-auto animate-bob-sm" : "pointer-events-none"
      }`}
    >
      <span
        className={`absolute inset-0 rounded-full bg-blush-400 transition-opacity duration-300 ${
          visible ? "animate-pulse-ring opacity-100" : "opacity-0"
        }`}
      />
      <span
        className={`absolute inset-0 flex items-center justify-center rounded-full bg-gradient-to-br from-blush-400 to-blush-600 shadow-pop transition-all duration-500 ease-out-strong group-hover:scale-110 group-hover:shadow-soft group-active:scale-90 ${
          visible ? "scale-100 opacity-100" : "scale-50 opacity-0"
        }`}
      >
        <ArrowUpIcon
          className="h-5 w-5 text-white transition-transform duration-300 ease-out-strong group-hover:-translate-y-1"
          strokeWidth={2.25}
        />
      </span>
    </button>
  );
}
