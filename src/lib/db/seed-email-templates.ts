import type Database from "better-sqlite3";
import { DEFAULT_EMAIL_TEMPLATES } from "../email/template-defaults";

// INSERT OR IGNORE por evento: no pisa plantillas ya editadas y sí agrega las de eventos nuevos.
export function seedEmailTemplatesIfMissing(db: Database.Database) {
  const insert = db.prepare("INSERT OR IGNORE INTO email_templates (event, subject, body_html) VALUES (?, ?, ?)");
  db.transaction(() => {
    for (const [event, template] of Object.entries(DEFAULT_EMAIL_TEMPLATES)) {
      insert.run(event, template.subject, template.bodyHtml);
    }
  })();
}
