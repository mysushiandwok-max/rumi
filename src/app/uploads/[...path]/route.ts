import fs from "node:fs/promises";
import path from "node:path";
import { DATA_ROOT } from "@/lib/paths";

const UPLOADS_ROOT = path.join(DATA_ROOT, "public", "uploads");

// Las fotos subidas desde el panel llevan nombre uuid y nunca cambian de contenido; las copiadas a mano sí pueden cambiar.
const UUID_NAME = /[\\/][0-9a-f-]{36}\.\w+$/;

const TYPES: Record<string, string> = {
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
};

// En producción Next no sirve archivos nuevos de /public, así que las fotos subidas desde el dashboard se sirven aquí.
// ponytail: sin soporte de Range, los videos largos no se pueden adelantar; añadir si hace falta.
export async function GET(_req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: parts } = await params;
  const file = path.resolve(UPLOADS_ROOT, ...parts);
  const type = TYPES[path.extname(file).toLowerCase()];
  if (!type || !file.startsWith(UPLOADS_ROOT + path.sep)) return new Response("Not found", { status: 404 });
  try {
    const data = await fs.readFile(file);
    return new Response(new Uint8Array(data), {
      headers: { "Content-Type": type, "Cache-Control": UUID_NAME.test(file)
          ? "public, max-age=31536000, immutable"
          : "public, max-age=86400, stale-while-revalidate=604800" },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
