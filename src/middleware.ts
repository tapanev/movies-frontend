import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const protectedRoutes = ["/movies", "/add-movie"];
const authRoutes = ["/login"];

export default function middleware(req: NextRequest) {
  const cookieStore = cookies();
  let sessionTokenCookie = cookieStore.get("user");

  if (!sessionTokenCookie && protectedRoutes.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (sessionTokenCookie && authRoutes.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/movies", req.url));
  }

}
