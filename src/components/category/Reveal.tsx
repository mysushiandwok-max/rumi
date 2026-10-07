"use client";

import { useEffect, useRef, useState } from "react";

// Muestra su contenido con una entrada suave la primera vez que entra en pantalla.
// El estado oculto vive en CSS y solo aplica con JS activo (ver .reveal en globals.css).
export function Reveal({
  children,
  className = "",
  delay = 0,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    // Sin IntersectionObserver tampoco aplica el estado oculto del CSS, así que el contenido ya se ve.
    if (!element || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const Tag = as as "div";
  return (
    <Tag
      ref={ref}
      data-visible={visible}
      style={{ transitionDelay: visible && delay ? `${delay}ms` : undefined }}
      className={`reveal ${className}`}
    >
      {children}
    </Tag>
  );
}
