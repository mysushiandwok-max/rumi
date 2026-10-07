"use client";

import { useRef, useState } from "react";
import { UploadIcon } from "@/components/icons";
import { uploadCategoryBannerAction } from "@/lib/admin/actions/categories";

// Proporción recomendada: 1920×570. En escritorio la página la recorta a 1280×300 anclada abajo.
const IDEAL_RATIO = 1920 / 570;
const RATIO_TOLERANCE = 0.12;

export function CategoryBannerField({ initial }: { initial?: string }) {
  const [path, setPath] = useState(initial ?? "");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFile(fileList: FileList | null) {
    const file = fileList?.[0];
    if (!file) return;
    setError("");
    setNotice("");
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.set("file", file);
      const result = await uploadCategoryBannerAction(formData);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      setPath(result.url);
      const ratio = result.width / Math.max(result.height, 1);
      if (Math.abs(ratio - IDEAL_RATIO) / IDEAL_RATIO > RATIO_TOLERANCE) {
        setNotice(
          `La foto mide ${result.width} × ${result.height} px (${ratio.toFixed(2)}:1). Lo ideal es 3.4:1, por ejemplo 2560 × 760: se recortará para ajustarse.`
        );
      } else if (result.width < 1920) {
        setNotice(`La foto mide ${result.width} px de ancho. Con menos de 1920 px puede verse borrosa en pantallas grandes.`);
      }
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div className="card-surface flex flex-col gap-4 p-6">
      <div>
        <h2 className="font-display text-lg font-bold text-ink">Foto del banner</h2>
        <p className="mt-1 max-w-2xl text-sm text-ink/55">
          Reemplaza el banner de color en la página de la categoría y aparece en sus mini banners. Recomendado: 2560 × 760
          px. En escritorio se muestra a 1280 × 300 px anclada abajo, así que deja el producto y la cara en la parte de
          abajo y a la derecha, y el texto de la categoría sobre el lado izquierdo liso.
        </p>
      </div>

      <input type="hidden" name="bannerPath" value={path} />

      {path ? (
        <div className="aspect-[1280/300] w-full max-w-3xl overflow-hidden rounded-[1.25rem] border border-border bg-blush-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={path} alt="Vista previa del banner" className="h-full w-full object-cover object-bottom" />
        </div>
      ) : (
        <p className="rounded-xl2 bg-blush-50/60 px-5 py-4 text-sm text-ink/60">
          Sin foto: se usa el banner de color con la ilustración de la categoría.
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          className="btn-secondary px-4 py-2.5 text-sm disabled:opacity-60"
        >
          <UploadIcon className="h-4 w-4" />
          {isUploading ? "Subiendo..." : path ? "Cambiar foto" : "Subir foto"}
        </button>
        {path && !isUploading && (
          <button
            type="button"
            onClick={() => {
              setPath("");
              setNotice("");
            }}
            className="btn-ghost px-4 py-2.5 text-sm"
          >
            Quitar foto
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => handleFile(event.target.files)}
        />
      </div>

      {error && <p className="text-xs font-semibold text-blush-600">{error}</p>}
      {notice && <p className="text-xs text-ink/60">{notice}</p>}
      <p className="text-xs text-ink/40">Los cambios se aplican al guardar la categoría.</p>
    </div>
  );
}
