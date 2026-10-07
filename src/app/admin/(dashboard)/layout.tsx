import { requireAdminPage } from "@/lib/admin/auth";
import { getAdminNotificationCount } from "@/lib/admin/metrics";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdminPage();
  const notificationCount = getAdminNotificationCount();

  return (
    <AdminShell email={session.email} notificationCount={notificationCount}>
      {children}
    </AdminShell>
  );
}
