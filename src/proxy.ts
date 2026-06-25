import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // If visiting admin pages (except login) without session, redirect to login
  if (pathname.startsWith("/admin") && pathname !== "/admin/login" && !isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  // If already logged in and visiting login page, redirect to dashboard
  if (pathname === "/admin/login" && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
