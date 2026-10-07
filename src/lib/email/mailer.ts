import "server-only";
import { Resend } from "resend";
import { db } from "@/lib/db/client";
import { wrapEmailLayout, SUPPORT_EMAIL } from "./layout";
import { fillVars } from "./template-vars";
import { EMAIL_LOGO_CID, EMAIL_LOGO_BASE64 } from "./logo";
import type { EmailEventKey } from "./events";

const FROM = process.env.EMAIL_FROM || "Rumí <onboarding@resend.dev>";

type TemplateRow = { subject: string; body_html: string; enabled: number };

function logEmail(event: string, to: string, subject: string, status: "SENT" | "FAILED", error?: string) {
  try {
    db.prepare("INSERT INTO email_logs (event, recipient, subject, status, error) VALUES (?, ?, ?, ?, ?)").run(
      event,
      to,
      subject,
      status,
      error ?? null
    );
  } catch {
    // el log es best-effort; nunca debe tumbar el flujo que disparó el correo
  }
}

// Nunca lanza: un correo que falla no debe romper el pedido/cambio de estado que lo disparó.
export async function sendTemplatedEmail(
  event: EmailEventKey,
  to: string,
  vars: Record<string, string>
): Promise<{ sent: boolean; reason?: string; error?: string }> {
  let subject = "";
  try {
    const template = db
      .prepare("SELECT subject, body_html, enabled FROM email_templates WHERE event = ?")
      .get(event) as TemplateRow | undefined;
    if (!template) return { sent: false, reason: "missing-template" };
    if (!template.enabled) return { sent: false, reason: "disabled" };
    subject = fillVars(template.subject, vars, { escape: false });
    if (!process.env.RESEND_API_KEY) throw new Error("RESEND_API_KEY no está configurado en .env.local");

    const html = wrapEmailLayout(fillVars(template.body_html, vars), `cid:${EMAIL_LOGO_CID}`);

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: FROM,
      to,
      replyTo: SUPPORT_EMAIL,
      subject,
      html,
      attachments: [{ filename: "rumi-logo.png", content: EMAIL_LOGO_BASE64, contentId: EMAIL_LOGO_CID }],
    });

    logEmail(event, to, subject, error ? "FAILED" : "SENT", error?.message);
    return error ? { sent: false, reason: "provider-error", error: error.message } : { sent: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    logEmail(event, to, subject, "FAILED", message);
    return { sent: false, reason: "exception", error: message };
  }
}
