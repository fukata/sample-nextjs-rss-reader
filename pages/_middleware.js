import { NextResponse } from "next/server";

export default function middleware(req) {
  const { pathname } = req.nextUrl; // get pathname of request (e.g. /login)

  if (!pathname.includes(".") && !pathname.startsWith("/api")) {
    // ログイン画面かつ認証済み
    if (
      pathname === "/login" &&
      (req.cookies["next-auth.session-token"] ||
        req.cookies["__Secure-next-auth.session-token"])
    ) {
      return NextResponse.redirect("/");
    }
    return NextResponse.rewrite(`/app${pathname}`);
  }
}
