import DashboardLayoutWrapper from "@/components/layout/DashboardLayoutWrapper";
import { cookies } from "next/headers";
import { COOKIES, ROLES, MOCK_TENANTS } from "@/lib/constants";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const role = cookieStore.get(COOKIES.USER_ROLE)?.value || ROLES.TENANT;

  // Super Admin đang xem tenant nào? Mặc định là tenant đầu tiên trong danh sách
  const viewingTenantId =
    cookieStore.get(COOKIES.VIEWING_TENANT_ID)?.value || MOCK_TENANTS[0].id;

  return (
    <DashboardLayoutWrapper role={role} viewingTenantId={viewingTenantId}>
      {children}
    </DashboardLayoutWrapper>
  );
}
