"use client";

import { useActionState, useRef, useState, useTransition } from "react";
import {
  updateEmailTemplateAction,
  resetEmailTemplateAction,
  sendTestEmailAction,
  type EmailTemplateFormState,
} from "@/lib/admin/actions/emails";
import type { EmailEventDef } from "@/lib/email/events";
import type { EmailLog } from "@/lib/admin/emails";
import { fillVars } from "@/lib/email/template-vars";
import { wrapEmailLayout } from "@/lib/email/layout";
import { RichTextEditor, type RichTextEditorHandle } from "@/components/admin/RichTextEditor";

const VAR_CHIP =
  "rounded-lg bg-blush-50 px-2 py-1 font-mono text-[11px] font-semibold text-blush-600 transition-colors hover:bg-blush-500 hover:text-white";

export function EmailTemplateForm({
  def,
  subject,
  bodyHtml,
  enabled,
  logs,
  adminEmail,
}: {
  def: EmailEventDef;
  subject: string;
  bodyHtml: string;
  enabled: boolean;
  logs: EmailLog[];
  adminEmail: string;
}) {
  const [state, formAction, pending] = useActionState<EmailTemplateFormState, FormData>(updateEmailTemplateAction, undefined);
  const [testState, testAction, testPending] = useActionState<EmailTemplateFormState, FormData>(sendTestEmailAction, undefined);

  const [subjectValue, setSubjectValue] = useState(subject);
  const [bodyValue, setBodyValue] = useState(bodyHtml);
  const [enabledValue, setEnabledValue] = useState(enabled);
  const [testTo, setTestTo] = useState(adminEmail);
  const [resetting, startReset] = useTransition();
  const subjectRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<RichTextEditorHandle>(null);

  function insertIntoSubject(token: string) {
    const el = subjectRef.current;
    if (!el) return;
    const start = el.selectionStart ?? subjectValue.length;
    const end = el.selectionEnd ?? subjectValue.length;
    setSubjectValue(subjectValue.slice(0, start) + token + subjectValue.slice(end));
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + token.length, start + token.length);
    });
  }

  const previewSubject = fillVars(subjectValue, def.sample, { escape: false });
  const previewHtml = wrapEmailLayout(fillVars(bodyValue, def.sample));

  return (
    <div className="grid items-start gap-6 lg:grid-cols-5">
      <div className="flex flex-col gap-6 lg:col-span-3">
        <form action={formAction} className="flex flex-col gap-6">
          <input type="hidden" name="event" value={def.key} />

          <div className="card-surface flex flex-col gap-4 p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base font-bold text-ink">Contenido del correo</h2>
              <label className="flex cursor-pointer select-none items-center gap-2 text-sm font-semibold text-ink/60">
                <input
                  type="checkbox"
                  name="enabled"
                  checked={enabledValue}
                  onChange={(e) => setEnabledValue(e.target.checked)}
                  className="h-4 w-4 accent-mint-500"
                />
                Correo activo
              </label>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email-subject" className="text-sm font-semibold text-ink">
                Asunto
              </label>
              <input
                id="email-subject"
                ref={subjectRef}
                name="subject"
                value={subjectValue}
                onChange={(e) => setSubjectValue(e.target.value)}
                required
                maxLength={200}
                className="input-field"
              />
              {state?.errors?.subject && <p className="text-xs font-semibold text-blush-700">{state.errors.subject}</p>}
              <div className="mt-1 flex flex-wrap gap-1.5">
                {def.variables.map((v) => (
                  <button key={v.key} type="button" onClick={() => insertIntoSubject(`{{${v.key}}}`)} title={v.label} className={VAR_CHIP}>
                    {`{{${v.key}}}`}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-ink">Mensaje</span>
              <div className="mb-1 flex flex-wrap gap-1.5">
                {def.variables.map((v) => (
                  <button
                    key={v.key}
                    type="button"
                    onClick={() => editorRef.current?.insertText(`{{${v.key}}}`)}
                    title={v.label}
                    className={VAR_CHIP}
                  >
                    {`{{${v.key}}}`}
                  </button>
                ))}
              </div>
              <RichTextEditor
                ref={editorRef}
                name="bodyHtml"
                defaultValue={bodyHtml}
                placeholder="Escribe el contenido del correo…"
                onChangeHtml={setBodyValue}
              />
              {state?.errors?.bodyHtml && <p className="text-xs font-semibold text-blush-700">{state.errors.bodyHtml}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {state?.message && !state.success && (
              <p className="rounded-xl bg-blush-50 px-3 py-2 text-xs font-semibold text-blush-700">{state.message}</p>
            )}
            {state?.success && <p className="rounded-xl bg-mint-50 px-3 py-2 text-xs font-semibold text-mint-700">Guardado.</p>}
            <div className="flex flex-wrap gap-3">
              <button type="submit" disabled={pending} className="btn-primary px-6 py-2.5 text-sm disabled:opacity-60">
                {pending ? "Guardando…" : "Guardar cambios"}
              </button>
              <button
                type="button"
                disabled={resetting}
                className="btn-secondary px-6 py-2.5 text-sm disabled:opacity-60"
                onClick={() => {
                  if (!window.confirm("¿Restaurar el contenido original de esta plantilla? Se perderán los cambios guardados.")) return;
                  // Recarga completa: el editor no es controlado y debe arrancar de nuevo con el contenido original.
                  startReset(async () => {
                    await resetEmailTemplateAction(def.key);
                    window.location.reload();
                  });
                }}
              >
                {resetting ? "Restaurando…" : "Restaurar original"}
              </button>
            </div>
          </div>
        </form>

        <div className="card-surface p-6">
          <h2 className="mb-3 font-display text-base font-bold text-ink">Envíos recientes</h2>
          {logs.length === 0 ? (
            <p className="text-xs text-ink/45">Todavía no se ha enviado este correo.</p>
          ) : (
            <ul className="flex flex-col divide-y divide-border/70">
              {logs.map((log) => (
                <li key={log.id} className="py-2 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <span className="min-w-0 truncate text-ink/70">{log.to}</span>
                    <span className="flex shrink-0 items-center gap-2">
                      <span className="text-ink/40">
                        {new Date(log.createdAt).toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" })}
                      </span>
                      <span
                        className={`rounded-md px-1.5 py-0.5 font-semibold ${
                          log.status === "SENT" ? "bg-mint-100 text-mint-700" : "bg-blush-100 text-blush-700"
                        }`}
                      >
                        {log.status === "SENT" ? "Enviado" : "Falló"}
                      </span>
                    </span>
                  </div>
                  {log.error && <p className="mt-0.5 break-words text-[11px] text-blush-700">{log.error}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:sticky lg:top-6 lg:col-span-2">
        <div className="card-surface flex flex-col gap-3 p-6">
          <h2 className="font-display text-base font-bold text-ink">Vista previa</h2>
          <form action={testAction} className="flex gap-2">
            <input type="hidden" name="event" value={def.key} />
            <input
              type="email"
              name="to"
              value={testTo}
              onChange={(e) => setTestTo(e.target.value)}
              placeholder="correo@ejemplo.com"
              aria-label="Correo para la prueba"
              required
              className="input-field flex-1 py-2 text-xs"
            />
            <button type="submit" disabled={testPending} className="btn-primary shrink-0 px-4 py-2 text-xs disabled:opacity-60">
              {testPending ? "Enviando…" : "Enviar prueba"}
            </button>
          </form>
          {testState?.message && (
            <p
              className={`rounded-xl px-3 py-2 text-xs font-semibold ${
                testState.success ? "bg-mint-50 text-mint-700" : "bg-blush-50 text-blush-700"
              }`}
            >
              {testState.message}
            </p>
          )}
          <div className="overflow-hidden rounded-xl2 border border-border bg-cream">
            <div className="truncate border-b border-border bg-white px-3.5 py-2 text-xs text-ink/60">
              <strong className="text-ink">Asunto:</strong> {previewSubject || "(sin asunto)"}
            </div>
            <iframe title="Vista previa del correo" srcDoc={previewHtml} className="h-[520px] w-full bg-white" />
          </div>
          <p className="text-[11px] text-ink/45">
            La vista previa usa datos de ejemplo.{" "}
            {def.recipient === "Tu equipo" ? "Este correo llega a tu equipo, no al cliente." : "Este correo llega al cliente."}
          </p>
        </div>
      </div>
    </div>
  );
}
