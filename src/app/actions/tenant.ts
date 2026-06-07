"use server";

import { cookies } from "next/headers";
import { COOKIES } from "@/lib/constants";

export async function setViewingTenantAction(tenantId: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIES.VIEWING_TENANT_ID, tenantId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 86400,
    path: "/",
  });
}
