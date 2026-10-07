import type { EmailEventKey } from "./events";

// Contenido original de cada plantilla: se siembra en la base (seedEmailTemplatesIfMissing)
// y es lo que restaura el botón "Restaurar original" del admin.
export const DEFAULT_EMAIL_TEMPLATES: Record<EmailEventKey, { subject: string; bodyHtml: string }> = {
  REGISTRO: {
    subject: "¡Bienvenida a Rumí, {{nombre}}! 🌸",
    bodyHtml:
      "<h2>¡Qué alegría tenerte por aquí!</h2>" +
      "<p>Hola {{nombre}}, tu cuenta en Rumí ya está activa. Ahora puedes explorar lo mejor del K-beauty, guardar tus favoritos y hacer seguimiento a tus pedidos desde <strong>Mi cuenta</strong>.</p>" +
      "<p>Si tienes cualquier duda sobre tu rutina, aquí estamos para ayudarte.</p>" +
      "<p>Con cariño,<br><strong>El equipo de Rumí</strong></p>",
  },
  COMPRA: {
    subject: "Confirmamos tu pedido {{numero_pedido}} 🛍️",
    bodyHtml:
      "<h2>¡Gracias por tu compra, {{nombre}}!</h2>" +
      "<p>Ya recibimos tu pedido <strong>{{numero_pedido}}</strong> y lo estamos alistando. Aquí un resumen:</p>" +
      "{{items_html}}" +
      "<p><strong>Total: {{total}}</strong></p>" +
      "<p>Te avisaremos por correo en cada paso: preparación, envío y entrega.</p>",
  },
  PAGO_CONFIRMADO: {
    subject: "Pago confirmado para tu pedido {{numero_pedido}} ✅",
    bodyHtml:
      "<h2>Tu pago fue confirmado</h2>" +
      "<p>Hola {{nombre}}, confirmamos el pago de <strong>{{total}}</strong> para tu pedido <strong>{{numero_pedido}}</strong>. En breve comenzaremos a prepararlo.</p>",
  },
  PAGO_RECHAZADO: {
    subject: "Hubo un problema con el pago de tu pedido {{numero_pedido}}",
    bodyHtml:
      "<h2>No pudimos confirmar tu pago</h2>" +
      "<p>Hola {{nombre}}, tuvimos un inconveniente al procesar el pago de <strong>{{total}}</strong> para tu pedido <strong>{{numero_pedido}}</strong>.</p>" +
      "<p>No te preocupes: responde este correo y te ayudamos a resolverlo o a intentar con otro método de pago.</p>",
  },
  PREPARACION: {
    subject: "Tu pedido {{numero_pedido}} ya está en preparación 📦",
    bodyHtml:
      "<h2>¡Manos a la obra!</h2>" +
      "<p>Hola {{nombre}}, tu pedido <strong>{{numero_pedido}}</strong> pasó a preparación. Estamos empacando todo con mucho cuidado para que llegue perfecto.</p>",
  },
  ENVIO: {
    subject: "Tu pedido {{numero_pedido}} va en camino 🚚",
    bodyHtml:
      "<h2>¡Tu pedido ya salió!</h2>" +
      "<p>Hola {{nombre}}, tu pedido <strong>{{numero_pedido}}</strong> está en camino. Pronto lo tendrás en tus manos.</p>" +
      "{{guia_html}}",
  },
  ENTREGA: {
    subject: "Tu pedido {{numero_pedido}} fue entregado 🎉",
    bodyHtml:
      "<h2>¡Que lo disfrutes!</h2>" +
      "<p>Hola {{nombre}}, confirmamos que tu pedido <strong>{{numero_pedido}}</strong> fue entregado. Esperamos que ames tu nueva rutina.</p>" +
      "<p>Si algo no llegó como esperabas, responde este correo; queremos que tengas una gran experiencia.</p>",
  },
  CANCELACION: {
    subject: "Tu pedido {{numero_pedido}} fue cancelado",
    bodyHtml:
      "<h2>Cancelamos tu pedido</h2>" +
      "<p>Hola {{nombre}}, tu pedido <strong>{{numero_pedido}}</strong> fue cancelado. Si tienes dudas sobre esta cancelación o quieres hacer un nuevo pedido, responde este correo y te ayudamos con gusto.</p>",
  },
  REEMBOLSO: {
    subject: "Reembolso realizado para tu pedido {{numero_pedido}} 💸",
    bodyHtml:
      "<h2>Ya procesamos tu reembolso</h2>" +
      "<p>Hola {{nombre}}, realizamos el reembolso de <strong>{{total}}</strong> correspondiente a tu pedido <strong>{{numero_pedido}}</strong>. Dependiendo de tu banco, puede tardar unos días hábiles en reflejarse.</p>",
  },
  CONTRASENA: {
    subject: "Restablece tu contraseña de Rumí",
    bodyHtml:
      "<h2>¿Olvidaste tu contraseña?</h2>" +
      "<p>Hola {{nombre}}, recibimos una solicitud para restablecer tu contraseña. Haz clic en el siguiente enlace para crear una nueva:</p>" +
      '<p><a href="{{reset_url}}">Restablecer mi contraseña →</a></p>' +
      "<p>Si tú no solicitaste este cambio, puedes ignorar este correo con tranquilidad.</p>",
  },
  CONTACTO: {
    subject: "Recibimos tu mensaje, {{nombre}} 💬",
    bodyHtml:
      "<h2>¡Gracias por escribirnos!</h2>" +
      "<p>Hola {{nombre}}, ya recibimos tu mensaje y nuestro equipo te responderá muy pronto:</p>" +
      "<blockquote>{{mensaje}}</blockquote>",
  },
  ADMIN_VENTA: {
    subject: "🔔 Nueva venta: {{numero_pedido}} — {{total}}",
    bodyHtml:
      "<h2>¡Nueva venta recibida!</h2>" +
      "<p>Cliente: <strong>{{cliente}}</strong></p>" +
      "<p>Pedido: <strong>{{numero_pedido}}</strong></p>" +
      "<p>Total: <strong>{{total}}</strong></p>" +
      "<p>Ingresa al panel de administración para ver los detalles y comenzar a prepararlo.</p>",
  },
};
