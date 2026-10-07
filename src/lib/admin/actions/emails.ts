"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/client";
import { requireAdminSession } from "@/lib/admin/auth";
import { sendTemplatedEmail } from "@/lib/email/mailer";
import { getEmailEvent } from "@/lib/email/events";
import { DEFAULT_EMAIL_TEMPLATES } from "@/lib/email/template-defaults";

export type EmailTemplateFormState =
  | { errors?: { subject?: string; bodyHtml?: string }; message?: string; success?: boolean }
  | undefined;

function revalidateEmails(event: string) {
  revalidatePath("/admin/correos");
  revalidatePath(`/admin/correos/${event}`);
}

export async function updateEmailTemplateAction(
  _state: EmailTemplateFormState,
  formData: FormData
): Promise<EmailTemplateFormState> {
  await requireAdminSession();
  const def = getEmailEvent(String(formData.get("event") ?? ""));
  if (!def) return { message: "Evento de correo desconocido." };

  const subject = String(formData.get("subject") ?? "").trim();
  const bodyHtml = String(formData.get("bodyHtml") ?? "").trim();
  const enabled = formData.get("enabled") === "on";

  const errors: NonNullable<EmailTemplateFormState>["errors"] = {};
  if (!subject) errors.subject = "Escribe un asunto.";
  else if (subject.length > 200) errors.subject = "El asunto no puede superar 200 caracteres.";
  if (!bodyHtml || bodyHtml === "<p></p>") errors.bodyHtml = "El correo no puede estar vacío.";
  if (errors.subject || errors.bodyHtml) return { errors, message: "Revisa los campos marcados." };

  db.prepare(
    `INSERT INTO email_templates (event, subject, body_html, enabled) VALUES (?, ?, ?, ?)
     ON CONFLICT(event) DO UPDATE SET subject = excluded.subject, body_html = excluded.body_html,
       enabled = excluded.enabled, updated_at = datetime('now')`
  ).run(def.key, subject, bodyHtml, enabled ? 1 : 0);

  revalidateEmails(def.key);
  return { success: true };
}

export async function toggleEmailTemplateAction(event: string, enabled: boolean) {
  await requireAdminSession();
  if (!getEmailEvent(event)) return;
  db.prepare("UPDATE email_templates SET enabled = ?, updated_at = datetime('now') WHERE event = ?").run(enabled ? 1 : 0, event);
  revalidatePath("/admin/correos");
}

export async function resetEmailTemplateAction(event: string) {
  await requireAdminSession();
  const def = getEmailEvent(event);
  if (!def) return;

  const original = DEFAULT_EMAIL_TEMPLATES[def.key];
  db.prepare("UPDATE email_templates SET subject = ?, body_html = ?, updated_at = datetime('now') WHERE event = ?").run(
    original.subject,
    original.bodyHtml,
    def.key
  );
  revalidateEmails(def.key);
}

export async function sendTestEmailAction(
  _state: EmailTemplateFormState,
  formData: FormData
): Promise<EmailTemplateFormState> {
  const session = await requireAdminSession();
  const def = getEmailEvent(String(formData.get("event") ?? ""));
  if (!def) return { message: "Evento de correo desconocido." };

  const to = String(formData.get("to") ?? "").trim() || session.email;
  const result = await sendTemplatedEmail(def.key, to, def.sample);
  revalidateEmails(def.key);
  if (!result.sent) {
    const detail =
      result.reason === "missing-template"
        ? "No existe la plantilla para este evento."
        : result.reason === "disabled"
          ? "La plantilla está desactivada (revisa el checkbox 'Correo activo')."
          : result.error || "Error desconocido.";
    return { message: `No se pudo enviar la prueba: ${detail}` };
  }
  return { success: true, message: `Correo de prueba enviado a ${to}. Si no lo ves en unos minutos, revisa la carpeta de spam.` };
}
