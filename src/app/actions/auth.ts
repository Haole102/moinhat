"use server";

import { cookies } from "next/headers";
import { COOKIES, ROLES } from "@/lib/constants";

export async function loginAction(username: string, password: string, roleType?: "super" | "tenant") {
  const cookieStore = await cookies();
  
  // Thời gian hết hạn: 1 ngày
  const maxAge = 86400; 

  const setAuthCookies = (token: string, role: string, tenantId?: string) => {
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      maxAge,
      path: "/",
    };

    cookieStore.set(COOKIES.AUTH_TOKEN, token, options);
    // User role và Tenant ID có thể để httpOnly = false nếu cần đọc bằng JS ở client,
    // nhưng tốt nhất đọc ở Server rồi truyền xuống Client via props.
    // Nếu thiết kế an toàn: httpOnly = true. Mình để true luôn để an toàn tuyệt đối.
    cookieStore.set(COOKIES.USER_ROLE, role, options);
    
    if (tenantId) {
      cookieStore.set(COOKIES.TENANT_ID, tenantId, options);
    } else {
      cookieStore.delete(COOKIES.TENANT_ID);
    }
  };

  // MOCK LOGIC TỪ YÊU CẦU CỦA USER
  if (roleType === "super" || (username === "admin" && password === "admin123")) {
    setAuthCookies("super_admin_token_xyz", ROLES.SUPER_ADMIN);
    return { success: true, message: "Đăng nhập thành công với quyền: SUPER ADMIN", role: ROLES.SUPER_ADMIN };
  } 
  
  if (roleType === "tenant" || (username === "tenant_user" && password === "tenant123")) {
    setAuthCookies("tenant_123_token_abc", ROLES.TENANT, "tenant_123");
    return { success: true, message: "Đăng nhập thành công với quyền: KHÁCH HÀNG (tenant_123)", role: ROLES.TENANT };
  }

  return { success: false, message: "Tài khoản hoặc mật khẩu test không chính xác!" };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIES.AUTH_TOKEN);
  cookieStore.delete(COOKIES.USER_ROLE);
  cookieStore.delete(COOKIES.TENANT_ID);
  return { success: true };
}
