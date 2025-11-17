import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  console.log(`[SIMPLE MIDDLEWARE] ${request.nextUrl.pathname}`);
  
  const pathname = request.nextUrl.pathname;
  
  // 🚫 SKIP LOCALE LOGIC FOR TENANT SITES
  if (pathname.startsWith("/sites")) {
    return NextResponse.next();
  }
  
  // [MODAL LOGIN] redirect login attempts to homepage since we use modal
  if (pathname === "/login" || pathname.startsWith("/en/login") || pathname.match(/^\/[a-z]{2}\/login/)) {
    const locale = pathname.match(/^\/([a-z]{2})\//)?.[1] || "en";
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }
  
  // [LOCALE] ensure dashboard has locale - redirect bare paths to default locale  
  if (pathname === "/dashboard") {
    return NextResponse.redirect(new URL("/en/dashboard", request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|api|sites|.*\\..*).*)",
  ],
};