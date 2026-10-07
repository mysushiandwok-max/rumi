import "server-only";
import { db } from "@/lib/db/client";
import { EMAIL_EVENTS, type EmailEventKey } from "@/lib/email/events";

export type EmailLog = { id: number; to: string; status: "SENT" | "FAILED"; error: string | null; createdAt: string };

export type EmailTemplateOverviewRow = {
  event: EmailEventKey;
  enabled: boolean;
  lastSentAt: string | null;
  lastStatus: "SENT" | "FAILED" | null;
  sent30d: number;
  failed30d: number;
};

type TemplateRow = { event: string; subject: string; body_html: string; enabled: number; updated_at: string };
type LogRow = { id: number; event: string; recipient: string; status: "SENT" | "FAILED"; error: string | null; created_at: string };

// SQLite guarda datetime('now') en UTC sin zona: se agrega la Z para que el navegador no lo lea como hora local.
const toIso = (value: string) => new Date(value.replace(" ", "T") + "Z").toISOString();

export function getEmailTemplatesOverview(): EmailTemplateOverviewRow[] {
  const templates = db.prepare("SELECT event, enabled FROM email_templates").all() as Pick<TemplateRow, "event" | "enabled">[];
  const stats = db
    .prepare(
      `SELECT event,
        SUM(status = 'SENT' AND created_at >= datetime('now', '-30 days')) AS sent30d,
        SUM(status = 'FAILED' AND created_at >= datetime('now', '-30 days')) AS failed30d,
        MAX(created_at) AS lastSentAt
      FROM email_logs GROUP BY event`
    )
    .all() as { event: string; sent30d: number; failed30d: number; lastSentAt: string }[];
  const lastStatus = db
    .prepare("SELECT status FROM email_logs WHERE event = ? ORDER BY id DESC LIMIT 1")
    .pluck();

  const enabledByEvent = new Map(templates.map((t) => [t.event, Boolean(t.enabled)]));
  const statsByEvent = new Map(stats.map((s) => [s.event, s]));

  return EMAIL_EVENTS.map((def) => {
    const stat = statsByEvent.get(def.key);
    return {
      event: def.key,
      enabled: enabledByEvent.get(def.key) ?? true,
      lastSentAt: stat ? toIso(stat.lastSentAt) : null,
      lastStatus: stat ? (lastStatus.get(def.key) as "SENT" | "FAILED") : null,
      sent30d: stat?.sent30d ?? 0,
      failed30d: stat?.failed30d ?? 0,
    };
  });
}

export function getEmailTemplateDetail(event: EmailEventKey) {
  const row = db.prepare("SELECT * FROM email_templates WHERE event = ?").get(event) as TemplateRow | undefined;
  const logs = db
    .prepare("SELECT * FROM email_logs WHERE event = ? ORDER BY id DESC LIMIT 20")
    .all(event) as LogRow[];
  return {
    template: row ? { subject: row.subject, bodyHtml: row.body_html, enabled: Boolean(row.enabled) } : null,
    logs: logs.map((l): EmailLog => ({ id: l.id, to: l.recipient, status: l.status, error: l.error, createdAt: toIso(l.created_at) })),
  };
}
