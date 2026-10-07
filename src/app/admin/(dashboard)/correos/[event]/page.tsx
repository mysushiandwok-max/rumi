import Link from "next/link";
import { notFound } from "next/navigation";
import { getEmailEvent } from "@/lib/email/events";
import { DEFAULT_EMAIL_TEMPLATES } from "@/lib/email/template-defaults";
import { getEmailTemplateDetail } from "@/lib/admin/emails";
import { requireAdminPage } from "@/lib/admin/auth";
import { EmailTemplateForm } from "@/components/admin/EmailTemplateForm";

export const metadata = { title: "Editar correo" };
export const dynamic = "force-dynamic";

export default async function AdminEmailDetailPage({ params }: { params: Promise<{ event: string }> }) {
  const { event } = await params;
  const def = getEmailEvent(event);
  if (!def) notFound();

  const session = await requireAdminPage();
  const { template, logs } = getEmailTemplateDetail(def.key);
  const fallback = DEFAULT_EMAIL_TEMPLATES[def.key];

  return (
    <div className="flex max-w-6xl flex-col gap-6">
      <div>
        <Link href="/admin/correos" className="text-xs font-semibold text-ink/45 hover:text-blush-600">
          ← Correos
        </Link>
        <h1 className="mt-1 font-display text-2xl font-bold text-ink">{def.name}</h1>
        <p className="mt-1 text-sm text-ink/60">{def.trigger}</p>
      </div>

      <EmailTemplateForm
        def={def}
        subject={template?.subject ?? fallback.subject}
        bodyHtml={template?.bodyHtml ?? fallback.bodyHtml}
        enabled={template?.enabled ?? true}
        logs={logs}
        adminEmail={session.email}
      />
    </div>
  );
}
