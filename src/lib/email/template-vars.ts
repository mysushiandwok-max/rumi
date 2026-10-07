export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// {{clave}} -> valor. Los valores se escapan por defecto porque casi siempre
// se insertan dentro de HTML; una clave que termina en "_html" ya viene como
// fragmento HTML de confianza (ej. la lista de productos) y se inserta tal
// cual. Para texto plano (el asunto del correo) pasa escape:false.
export function fillVars(template: string, vars: Record<string, string>, opts?: { escape?: boolean }) {
  const escape = opts?.escape ?? true;
  return template.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_match, key: string) => {
    const value = vars[key];
    if (value === undefined) return "";
    if (!escape) return value;
    return key.endsWith("_html") ? value : escapeHtml(value);
  });
}
