import { NextResponse } from "next/server";
import { auth } from "@/lib/auth"; 

export default async function proxy(req) {
  const { pathname } = req.nextUrl;
  

  const isAdminRoute = pathname.startsWith("/admin/dashboard");
  const isDashboardRoute = pathname.startsWith("/dashboard"); 

  
  if (isAdminRoute || isDashboardRoute) {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

 
    if (!session) {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }

   
    if (session.user.isBlocked === true || session.user.isBlocked === "true") {
      const response = NextResponse.redirect(
        new URL("/auth/signin?error=Your+account+has+been+blocked+by+the+admin", req.url)
      );
      
      
      response.cookies.delete("better-auth.session_token");
      return response;
    }

    if (isAdminRoute && session.user.role !== "admin") {
      return NextResponse.redirect(new URL("/403", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {

  matcher: ["/admin/:path*", "/dashboard/:path*"],
};