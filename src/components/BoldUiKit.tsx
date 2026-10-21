"use client";

import { useEffect } from "react";

// Sello oficial de Bold con los logos de sus medios de pago. El script lee sus opciones de su propia URL y se
// ejecuta una sola vez por página, así que se reinicia al montar/desmontar para que funcione al volver a la vista.
export function BoldUiKit({ options, className = "" }: { options: string; className?: string }) {
  const id = "bold-ui-kit-target";
  useEffect(() => {
    (window as unknown as { boldUIKKitAlreadyProcessed?: boolean }).boldUIKKitAlreadyProcessed = false;
    const script = document.createElement("script");
    script.src = `https://bold.co/library/ui-kit.js?${options}&target=${id}`;
    document.body.appendChild(script);
    return () => {
      script.remove();
      document.getElementById(id)?.replaceChildren();
    };
  }, [options]);

  return <div id={id} className={className} />;
}
