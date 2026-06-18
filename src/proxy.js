import { NextResponse } from "next/server";
import { auth } from "@/lib/auth"; // আপনার auth ফাইলের সঠিক পাথ দিন

// 💡 'export function proxy' এর জায়গায় 'export default async function' ব্যবহার করুন
export default async function proxy(req) {
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

  if (isAdminRoute) {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }

    if (session.user.role !== "admin") {
      return NextResponse.redirect(new URL("/403", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};