import { NextRequest, NextResponse } from "next/server";
import { buildClearCookie } from "@/lib/auth";

export async function GET(_req: NextRequest) {
  const res = NextResponse.redirect(new URL("/admin/login", _req.url));
  res.headers.set("Set-Cookie", buildClearCookie());
  return res;
}

export async function POST(_req: NextRequest) {
  const res = NextResponse.redirect(new URL("/admin/login", _req.url));
  res.headers.set("Set-Cookie", buildClearCookie());
  return res;
}
