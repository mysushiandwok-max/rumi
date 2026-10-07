import { EMAIL_LOGO_DATA_URI, EMAIL_LOGO_WIDTH, EMAIL_LOGO_HEIGHT } from "./logo";

const BRAND = {
  blush: "#E8688C",
  blushDark: "#D64C74",
  blushLight: "#FDF3F6",
  cream: "#FFFDFB",
  ink: "#2B2320",
  soft: "#6B625D",
  faint: "#A69C96",
  border: "#F3E6E9",
};

export const SUPPORT_EMAIL = "hola@rumiskincare.com";

// logoSrc por defecto = data URI: sirve para la vista previa del admin, que
// se renderiza en un iframe del navegador. Para el envío real por Resend,
// mailer.ts pasa "cid:..." + adjunta el logo inline, porque Gmail y otros
// clientes de correo no soportan de forma confiable imágenes "data:".
export function wrapEmailLayout(innerHtml: string, logoSrc: string = EMAIL_LOGO_DATA_URI) {
  const logoWidth = EMAIL_LOGO_WIDTH / 2;
  const logoHeight = EMAIL_LOGO_HEIGHT / 2;
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Rumí</title>
<style>
  body { margin:0; padding:0; background:${BRAND.blushLight}; }
  a { color:${BRAND.blushDark}; }
  .email-content h2 { font-size:21px; font-weight:800; color:${BRAND.ink}; margin:0 0 12px; letter-spacing:-.3px; }
  .email-content h3 { font-size:16px; font-weight:700; color:${BRAND.ink}; margin:18px 0 8px; }
  .email-content p { font-size:14.5px; line-height:1.65; color:${BRAND.soft}; margin:0 0 14px; }
  .email-content a { font-weight:700; text-decoration:underline; }
  .email-content ul, .email-content ol { margin:0 0 14px; padding-left:20px; color:${BRAND.soft}; font-size:14.5px; line-height:1.7; }
  .email-content li { margin-bottom:4px; }
  .email-content strong { color:${BRAND.ink}; }
  .email-content blockquote { margin:0 0 14px; padding:10px 16px; border-left:3px solid ${BRAND.blush}; color:${BRAND.soft}; font-style:italic; }
</style>
</head>
<body>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.blushLight};padding:32px 16px;">
  <tr>
    <td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(214,76,116,.08);">
        <tr>
          <td style="background:${BRAND.blush};background:linear-gradient(135deg,${BRAND.blush},${BRAND.blushDark});padding:40px 32px;text-align:center;">
            <img src="${logoSrc}" width="${logoWidth}" height="${logoHeight}" alt="Rumí" style="display:inline-block;width:${logoWidth}px;height:auto;" />
          </td>
        </tr>
        <tr>
          <td class="email-content" style="padding:36px 32px;font-family:Arial,Helvetica,sans-serif;">
            ${innerHtml}
          </td>
        </tr>
        <tr>
          <td style="padding:24px 32px;background:${BRAND.cream};border-top:1px solid ${BRAND.border};text-align:center;font-family:Arial,Helvetica,sans-serif;">
            <p style="margin:0 0 10px;font-size:12.5px;color:${BRAND.soft};">¿Necesitas ayuda? Responde este correo o escríbenos a <a href="mailto:${SUPPORT_EMAIL}" style="color:${BRAND.blushDark};font-weight:700;text-decoration:none;">${SUPPORT_EMAIL}</a>.</p>
            <p style="margin:0;font-size:11px;color:${BRAND.faint};">© ${new Date().getFullYear()} Rumí · Colombia</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}
