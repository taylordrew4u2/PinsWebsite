import { NextRequest, NextResponse } from "next/server";
import { checkPassword, checkRateLimit, hashIp } from "@/lib/password";
import { buildSessionCookie, signAdminToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";
  const ipHash = hashIp(ip);

  const { allowed } = checkRateLimit(ipHash);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many login attempts. Try again in 15 minutes." },
      { status: 429 }
    );
  }

  let password: string;
  try {
    const body = await req.json();
    password = String(body.password ?? "");
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!checkPassword(password)) {
    console.warn(`[admin] Failed login attempt from IP hash: ${ipHash}`);
    return NextResponse.json({ error: "Invalid password." }, { status: 401 });
  }

  const token = await signAdminToken();
  const cookie = buildSessionCookie(token);

  const nextParam = req.nextUrl.searchParams.get("next") ?? "/admin";
  const redirectTo = nextParam.startsWith("/admin") ? nextParam : "/admin";

  const response = NextResponse.json({ ok: true, redirect: redirectTo });
  response.headers.set("Set-Cookie", cookie);
  return response;
}
