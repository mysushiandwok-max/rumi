import Link from "next/link";
import { getEmailTemplatesOverview } from "@/lib/admin/emails";
import { EMAIL_EVENTS, type EmailEventGroup } from "@/lib/email/events";
import { EmailToggle } from "@/components/admin/EmailToggle";
import { StatCard } from "@/components/admin/StatCard";
import { MailIcon, CheckCircleIcon, AlertTriangleIcon } from "@/components/icons";

export const metadata = { title: "Correos" };
export const dynamic = "force-dynamic";

const GROUP_ORDER: EmailEventGroup[] = ["Cliente", "Pedido", "Pagos", "Interno"];
const GROUP_LABEL: Record<EmailEventGroup, string> = {
  Cliente: "Cuenta y atención al cliente",
  Pedido: "Ciclo de vida del pedido",
  Pagos: "Pagos y reembolsos",
  Interno: "Notificaciones internas",
};

function timeAgo(iso: string | null) {
  if (!iso) return "Nunca enviado";
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "Hace instantes";
  if (mins < 60) return `Hace ${mins} min`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `Hace ${hours} h`;
  return `Hace ${Math.round(hours / 24)} d`;
}

export default function AdminEmailsPage() {
  const overview = getEmailTemplatesOverview();
  const byEvent = new Map(overview.map((o) => [o.event, o]));

  const activeCount = overview.filter((o) => o.enabled).length;
  const sent30d = overview.reduce((s, o) => s + o.sent30d, 0);
  const failed30d = overview.reduce((s, o) => s + o.failed30d, 0);
  const deliveryRate = sent30d + failed30d > 0 ? Math.round((sent30d / (sent30d + failed30d)) * 100) : 100;

  return (
    <div className="flex max-w-5xl flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Correos</h1>
        <p className="mt-1 text-sm text-ink/60">
          Administra los correos automáticos de la tienda: contenido y activación por evento.
        </p>
      </div>

      {!process.env.RESEND_API_KEY && (
        <p className="rounded-xl2 bg-peach-50 px-4 py-3 text-sm font-semibold text-peach-600">
          Falta configurar RESEND_API_KEY en .env.local: mientras tanto ningún correo sale (quedan como fallidos en el registro).
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Plantillas activas" value={`${activeCount}/${EMAIL_EVENTS.length}`} icon={MailIcon} tone="lavender" />
        <StatCard label="Enviados (30 días)" value={String(sent30d)} icon={CheckCircleIcon} tone="mint" />
        <StatCard
          label="Tasa de entrega"
          value={`${deliveryRate}%`}
          hint={failed30d > 0 ? `${failed30d} fallidos` : undefined}
          icon={AlertTriangleIcon}
          tone={failed30d > 0 ? "blush" : "ink"}
        />
      </div>

      {GROUP_ORDER.map((group) => (
        <div key={group} className="card-surface overflow-hidden p-0">
          <div className="border-b border-border bg-cream px-5 py-3.5">
            <h2 className="text-xs font-bold uppercase tracking-wide text-ink/50">{GROUP_LABEL[group]}</h2>
          </div>
          <div className="divide-y divide-border/70">
            {EMAIL_EVENTS.filter((e) => e.group === group).map((def) => {
              const stat = byEvent.get(def.key);
              return (
                <div key={def.key} className="flex items-center gap-4 px-5 py-4">
                  <EmailToggle event={def.key} enabled={stat?.enabled ?? true} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-ink">{def.name}</span>
                      <span className="rounded-pill bg-lavender-100 px-2 py-0.5 text-[11px] font-semibold text-lavender-600">
                        {def.recipient}
                      </span>
                      {!def.wired && (
                        <span className="rounded-pill bg-peach-100 px-2 py-0.5 text-[11px] font-semibold text-peach-600">
                          Sin disparador aún
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-xs text-ink/55">{def.trigger}</p>
                  </div>
                  <div className="hidden w-32 shrink-0 text-right text-xs text-ink/40 md:block">
                    {timeAgo(stat?.lastSentAt ?? null)}
                    {stat?.lastStatus === "FAILED" && <div className="font-semibold text-blush-700">Último falló</div>}
                  </div>
                  <Link href={`/admin/correos/${def.key}`} className="btn-secondary shrink-0 px-4 py-2 text-xs">
                    Editar
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
