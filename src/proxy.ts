import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIES, ROUTES } from "./lib/constants";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Lấy token đã lưu ở Cookie an toàn
  const token = request.cookies.get(COOKIES.AUTH_TOKEN)?.value;

  // Kiểm tra cấu trúc cơ bản của token (đây là mock, thực tế sẽ verify JWT signature)
  const isValidToken =
    token && (token.includes("token_xyz") || token.includes("token_abc"));

  // 2. Nếu người dùng đang ở trang đăng nhập mà đã có token hợp lệ -> Đẩy thẳng vào dashboard
  if (pathname === ROUTES.LOGIN) {
    if (isValidToken) {
      return NextResponse.redirect(new URL(ROUTES.DASHBOARD, request.url));
    }
    return NextResponse.next();
  }

  // 3. ÉP ĐĂNG NHẬP: Nếu không có token và cố tình vào các trang hệ thống bên trong
  if (!isValidToken) {
    const loginUrl = new URL(ROUTES.LOGIN, request.url);
    // Lưu callbackUrl để redirect sau khi login
    loginUrl.searchParams.set("callbackUrl", pathname);

    // Nếu token có mà không hợp lệ thì có thể là token rác, ta xóa luôn
    const response = NextResponse.redirect(loginUrl);
    if (token) {
      response.cookies.delete(COOKIES.AUTH_TOKEN);
      response.cookies.delete(COOKIES.USER_ROLE);
      response.cookies.delete(COOKIES.TENANT_ID);
    }
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg).*)",
  ],
};
