import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { getConnectorSettings } from "@/lib/admin/settings";

export const BOLD_CURRENCY = "COP";

const CIPHER_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.~=&";
const CIPHER_KEY = "BoldPaymentButton";

// Réplica de la función que usa boldPaymentButton.js para armar la URL de pago (verificada igual a la librería).
// Se genera en el servidor y el navegador solo redirige: no depende de cargar scripts de terceros.
function boldCheckoutUrl(config: Record<string, string | number>): string {
  const plain = Object.entries({ ...config, integrationType: "library" })
    .map(([k, v]) => `${k.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()}=${v}`)
    .join("<bold>");
  let out = "";
  for (let i = 0; i < plain.length; i++) {
    const idx = CIPHER_ALPHABET.indexOf(plain[i]);
    out += idx === -1 ? plain[i] : CIPHER_ALPHABET[(idx + CIPHER_KEY.charCodeAt(i % CIPHER_KEY.length) + 68) % 68];
  }
  return `https://checkout.bold.co/btn?${encodeURIComponent(out)}`;
}

export function getActiveBold() {
  const { bold } = getConnectorSettings();
  return bold.enabled && bold.apiKey && bold.secretKey ? bold : null;
}

// URL de pago de Bold para el pedido. La llave secreta nunca sale del servidor: solo viaja la firma de integridad
// SHA256(orderId + monto + moneda + secreta), que Bold recalcula.
export function buildBoldUrl(orderNumber: string, amount: number, origin: string): string | null {
  const bold = getActiveBold();
  if (!bold) return null;
  const integritySignature = createHash("sha256")
    .update(`${orderNumber}${amount}${BOLD_CURRENCY}${bold.secretKey}`)
    .digest("hex");
  return boldCheckoutUrl({
    apiKey: bold.apiKey,
    orderId: orderNumber,
    amount,
    currency: BOLD_CURRENCY,
    integritySignature,
    redirectionUrl: `${origin}/checkout/gracias`,
    description: `Pedido ${orderNumber} - Rumí`,
    originUrl: `${origin}/checkout`,
    openingTime: String(Date.now()),
  });
}

// Firma del webhook: HMAC-SHA256 (hex) del cuerpo crudo en base64. En sandbox Bold firma con llave vacía.
export function isValidBoldSignature(rawBody: string, signature: string | null): boolean {
  const { bold } = getConnectorSettings();
  if (!signature || !bold.secretKey) return false;
  const key = bold.sandbox ? "" : bold.secretKey;
  const expected = createHmac("sha256", key).update(Buffer.from(rawBody).toString("base64")).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && timingSafeEqual(a, b);
}
