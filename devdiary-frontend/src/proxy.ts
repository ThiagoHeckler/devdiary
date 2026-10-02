import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE } from "@/lib/admin-cookie";

/**
 * Manda quem não fez login para /admin/login. A validade do token é conferida
 * pela API em cada chamada; aqui só se olha se o cookie existe.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin/login" || request.cookies.has(ADMIN_COOKIE)) {
    return NextResponse.next();
  }
  return NextResponse.redirect(new URL("/admin/login", request.url));
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
