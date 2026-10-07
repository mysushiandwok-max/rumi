// La foto del producto sale de `from` y vuela en arco hasta su miniatura dentro del carrito
// ([data-cart-thumb]), que se oculta mientras tanto para que no se vea duplicada.
export function flyToCart(from: Element, imageSrc: string, productSlug: string) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const start = from.getBoundingClientRect();

  // Dos frames: el drawer se monta y la línea del producto ya tiene su posición final.
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      const target = document.querySelector<HTMLElement>(`[data-cart-thumb="${CSS.escape(productSlug)}"]`);
      if (!target) return;
      const end = target.getBoundingClientRect();

      const flyer = document.createElement("img");
      flyer.src = imageSrc;
      flyer.alt = "";
      Object.assign(flyer.style, {
        position: "fixed",
        left: `${end.left}px`,
        top: `${end.top}px`,
        width: `${end.width}px`,
        height: `${end.height}px`,
        objectFit: "cover",
        zIndex: "90",
        pointerEvents: "none",
        boxShadow: "0 18px 40px -12px rgba(214, 76, 116, 0.45)",
      });
      document.body.appendChild(flyer);
      target.style.visibility = "hidden";

      const scale = Math.max(start.width / end.width, 0.35);
      const dx = start.left + start.width / 2 - (end.left + end.width / 2);
      const dy = start.top + start.height / 2 - (end.top + end.height / 2);
      // Punto medio por encima de la recta: la foto sube un poco antes de caer en su lugar.
      const lift = Math.min(160, Math.abs(dy) * 0.35 + 60);

      const flight = flyer.animate(
        [
          { transform: `translate(${dx}px, ${dy}px) scale(${scale}) rotate(-8deg)`, borderRadius: "999px", opacity: 0.9 },
          {
            transform: `translate(${dx * 0.45}px, ${dy * 0.45 - lift}px) scale(1.15) rotate(4deg)`,
            borderRadius: "40%",
            opacity: 1,
            offset: 0.5,
          },
          { transform: "translate(0, 0) scale(1) rotate(0deg)", borderRadius: "16px", opacity: 1 },
        ],
        { duration: 760, easing: "cubic-bezier(0.45, 0, 0.2, 1)" }
      );
      const land = () => {
        flyer.remove();
        target.style.visibility = "";
        target.animate([{ transform: "scale(1.12)" }, { transform: "scale(1)" }], {
          duration: 420,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        });
      };
      flight.onfinish = land;
      flight.oncancel = land;
    })
  );
}
