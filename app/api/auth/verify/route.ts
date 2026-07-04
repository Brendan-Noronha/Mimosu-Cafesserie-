import { NextResponse } from "next/server";
import { createToken, verifyToken } from "@/lib/auth/magicLink";

const THIRTY_DAYS = 30 * 24 * 60 * 60;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) return NextResponse.redirect(new URL("/login?error=missing", url));

  const payload = verifyToken(token);
  if (!payload) return NextResponse.redirect(new URL("/login?error=expired", url));

  const sessionToken = createToken({ ...payload, exp: Date.now() + THIRTY_DAYS * 1000 });

  const response = NextResponse.redirect(new URL("/client", url));
  response.cookies.set("mimosu_session", sessionToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: THIRTY_DAYS,
    path: "/",
  });
  return response;
}
