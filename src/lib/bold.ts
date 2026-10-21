import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { getConnectorSettings } from "@/lib/admin/settings";

export const BOLD_CURRENCY = "COP";

// Datos que el navegador necesita para abrir el checkout de Bold. La llave secreta nunca sale del servidor:
// solo viaja la firma de integridad SHA256(orderId + monto + moneda + secreta), que Bold recalcula.
export type BoldCheckoutParams = {
  apiKey: string;
  orderId: string;
  amount: number;
  currency: string;
  integritySignature: string;
  redirectionUrl: string;
  description: string;
};

export function getActiveBold() {
  const { bold } = getConnectorSettings();
  return bold.enabled && bold.apiKey && bold.secretKey ? bold : null;
}

export function buildBoldParams(orderNumber: string, amount: number, redirectionUrl: string): BoldCheckoutParams | null {
  const bold = getActiveBold();
  if (!bold) return null;
  const integritySignature = createHash("sha256")
    .update(`${orderNumber}${amount}${BOLD_CURRENCY}${bold.secretKey}`)
    .digest("hex");
  return {
    apiKey: bold.apiKey,
    orderId: orderNumber,
    amount,
    currency: BOLD_CURRENCY,
    integritySignature,
    redirectionUrl,
    description: `Pedido ${orderNumber} - Rumí`,
  };
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
