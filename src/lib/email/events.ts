export type EmailEventKey =
  | "REGISTRO"
  | "COMPRA"
  | "PAGO_CONFIRMADO"
  | "PAGO_RECHAZADO"
  | "PREPARACION"
  | "ENVIO"
  | "ENTREGA"
  | "CANCELACION"
  | "REEMBOLSO"
  | "CONTRASENA"
  | "CONTACTO"
  | "ADMIN_VENTA";

export type EmailEventGroup = "Cliente" | "Pedido" | "Pagos" | "Interno";

export type EmailEventDef = {
  key: EmailEventKey;
  name: string;
  group: EmailEventGroup;
  recipient: "Cliente" | "Tu equipo";
  trigger: string;
  wired: boolean; // si ya existe un disparador automático conectado
  variables: { key: string; label: string }[];
  sample: Record<string, string>;
};

// Mismo formato que buildOrderItemsHtml (order-email.ts), para que la vista previa sea fiel.
const SAMPLE_ITEM_ROW = (name: string, price: string) =>
  `<tr><td style="padding:8px 0;font-size:14px;color:#2B2320;">${name}</td>` +
  `<td style="padding:8px 0;text-align:right;font-size:14px;font-weight:700;color:#2B2320;white-space:nowrap;">${price}</td></tr>`;

export const EMAIL_EVENTS: EmailEventDef[] = [
  {
    key: "REGISTRO",
    name: "Bienvenida",
    group: "Cliente",
    recipient: "Cliente",
    trigger: "Pendiente: la tienda aún no tiene registro de clientes. Esta plantilla queda lista para cuando se construya.",
    wired: false,
    variables: [{ key: "nombre", label: "Nombre del cliente" }],
    sample: { nombre: "Valentina Ríos" },
  },
  {
    key: "COMPRA",
    name: "Confirmación de pedido",
    group: "Pedido",
    recipient: "Cliente",
    trigger: "Cuando marcas el pago del pedido como Pagado, no al crear el pedido.",
    wired: true,
    variables: [
      { key: "nombre", label: "Nombre del cliente" },
      { key: "numero_pedido", label: "Número de pedido" },
      { key: "total", label: "Total (formateado en COP)" },
      { key: "items_html", label: "Lista de productos (HTML)" },
    ],
    sample: {
      nombre: "Valentina Ríos",
      numero_pedido: "RUMI-482913",
      total: "$186.500",
      items_html:
        '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;margin:0 0 14px;">' +
        SAMPLE_ITEM_ROW("2× Relief Sun Rice + Probiotics", "$116.000") +
        SAMPLE_ITEM_ROW("1× Sérum de niacinamida", "$70.500") +
        "</table>",
    },
  },
  {
    key: "PAGO_CONFIRMADO",
    name: "Pago confirmado",
    group: "Pagos",
    recipient: "Cliente",
    trigger: "Cuando marcas el pago de un pedido como Pagado.",
    wired: true,
    variables: [
      { key: "nombre", label: "Nombre del cliente" },
      { key: "numero_pedido", label: "Número de pedido" },
      { key: "total", label: "Total (formateado en COP)" },
    ],
    sample: { nombre: "Valentina Ríos", numero_pedido: "RUMI-482913", total: "$186.500" },
  },
  {
    key: "PAGO_RECHAZADO",
    name: "Problema con el pago",
    group: "Pagos",
    recipient: "Cliente",
    trigger: "Cuando marcas el pago de un pedido como Fallido.",
    wired: true,
    variables: [
      { key: "nombre", label: "Nombre del cliente" },
      { key: "numero_pedido", label: "Número de pedido" },
      { key: "total", label: "Total (formateado en COP)" },
    ],
    sample: { nombre: "Valentina Ríos", numero_pedido: "RUMI-482913", total: "$186.500" },
  },
  {
    key: "PREPARACION",
    name: "Pedido en preparación",
    group: "Pedido",
    recipient: "Cliente",
    trigger: "Cuando cambias el estado del pedido a Procesando.",
    wired: true,
    variables: [
      { key: "nombre", label: "Nombre del cliente" },
      { key: "numero_pedido", label: "Número de pedido" },
    ],
    sample: { nombre: "Valentina Ríos", numero_pedido: "RUMI-482913" },
  },
  {
    key: "ENVIO",
    name: "Pedido enviado + guía",
    group: "Pedido",
    recipient: "Cliente",
    trigger:
      "Cuando cambias el estado del pedido a Enviado, o cuando guardas una guía nueva en un pedido que ya está Enviado y Pagado.",
    wired: true,
    variables: [
      { key: "nombre", label: "Nombre del cliente" },
      { key: "numero_pedido", label: "Número de pedido" },
      { key: "guia_html", label: "Bloque con transportadora y guía (ya armado en HTML, vacío si aún no hay guía)" },
    ],
    sample: {
      nombre: "Valentina Ríos",
      numero_pedido: "RUMI-482913",
      guia_html:
        '<p style="margin:12px 0 0;padding:12px 14px;background:#FDF3F6;border-radius:10px;">' +
        "Transportadora: <strong>Servientrega</strong><br>" +
        "Número de guía: <strong>123456789</strong></p>",
    },
  },
  {
    key: "ENTREGA",
    name: "Pedido entregado",
    group: "Pedido",
    recipient: "Cliente",
    trigger: "Cuando cambias el estado del pedido a Entregado.",
    wired: true,
    variables: [
      { key: "nombre", label: "Nombre del cliente" },
      { key: "numero_pedido", label: "Número de pedido" },
    ],
    sample: { nombre: "Valentina Ríos", numero_pedido: "RUMI-482913" },
  },
  {
    key: "CANCELACION",
    name: "Pedido cancelado",
    group: "Pedido",
    recipient: "Cliente",
    trigger: "Cuando cambias el estado del pedido a Cancelado.",
    wired: true,
    variables: [
      { key: "nombre", label: "Nombre del cliente" },
      { key: "numero_pedido", label: "Número de pedido" },
    ],
    sample: { nombre: "Valentina Ríos", numero_pedido: "RUMI-482913" },
  },
  {
    key: "REEMBOLSO",
    name: "Reembolso realizado",
    group: "Pagos",
    recipient: "Cliente",
    trigger: "Pendiente: los pedidos aún no tienen estado Reembolsado. Esta plantilla queda lista para cuando se agregue.",
    wired: false,
    variables: [
      { key: "nombre", label: "Nombre del cliente" },
      { key: "numero_pedido", label: "Número de pedido" },
      { key: "total", label: "Total (formateado en COP)" },
    ],
    sample: { nombre: "Valentina Ríos", numero_pedido: "RUMI-482913", total: "$186.500" },
  },
  {
    key: "CONTRASENA",
    name: "Recuperación de contraseña",
    group: "Cliente",
    recipient: "Cliente",
    trigger: 'Pendiente: la tienda aún no tiene un flujo de "olvidé mi contraseña". Esta plantilla queda lista para cuando se construya.',
    wired: false,
    variables: [
      { key: "nombre", label: "Nombre del cliente" },
      { key: "reset_url", label: "Enlace para restablecer" },
    ],
    sample: { nombre: "Valentina Ríos", reset_url: "https://rumiskincare.com/restablecer/abc123" },
  },
  {
    key: "CONTACTO",
    name: "Confirmación de mensaje",
    group: "Cliente",
    recipient: "Cliente",
    trigger: "Pendiente: la tienda aún no tiene formulario de contacto. Esta plantilla queda lista para cuando se construya.",
    wired: false,
    variables: [
      { key: "nombre", label: "Nombre de quien escribió" },
      { key: "mensaje", label: "Mensaje enviado" },
    ],
    sample: { nombre: "Valentina Ríos", mensaje: "Hola, ¿el protector Relief Sun sirve para piel grasa?" },
  },
  {
    key: "ADMIN_VENTA",
    name: "Nueva venta recibida",
    group: "Interno",
    recipient: "Tu equipo",
    trigger: "Justo después de crear un pedido: te avisa a ti (ADMIN_EMAIL), no al cliente.",
    wired: true,
    variables: [
      { key: "numero_pedido", label: "Número de pedido" },
      { key: "cliente", label: "Nombre del cliente" },
      { key: "total", label: "Total (formateado en COP)" },
    ],
    sample: { numero_pedido: "RUMI-482913", cliente: "Valentina Ríos", total: "$186.500" },
  },
];

export function getEmailEvent(key: string): EmailEventDef | undefined {
  return EMAIL_EVENTS.find((e) => e.key === key);
}
