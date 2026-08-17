import { NextRequest, NextResponse } from "next/server";

const ADMIN_COOKIE = "admin_session";
const LOGIN_PATH = "/admin/login";

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes (but not /admin/login itself)
  if (!pathname.startsWith("/admin") || pathname.startsWith(LOGIN_PATH)) {
    return NextResponse.next();
  }

  const session = request.cookies.get(ADMIN_COOKIE);
  const secret = process.env.ADMIN_SESSION_SECRET || "idealdryfruit_cms_secret_2024_change_me";
  if (session?.value && session.value === secret) {
    return NextResponse.next();
  }

  // Redirect to login
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = LOGIN_PATH;
  loginUrl.searchParams.set("from", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*"],
};
