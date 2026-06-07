import DashboardLayoutWrapper from "@/components/layout/DashboardLayoutWrapper";
import { cookies } from "next/headers";
import { COOKIES, ROLES } from "@/lib/constants";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const role = cookieStore.get(COOKIES.USER_ROLE)?.value || ROLES.TENANT;

  return <DashboardLayoutWrapper role={role}>{children}</DashboardLayoutWrapper>;
}
