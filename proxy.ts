import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "pn_admin_session";

function getSecret(): Uint8Array {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("ADMIN_SESSION_SECRET env var must be set in production.");
    }
    return new TextEncoder().encode("dev-secret-change-me-in-production");
  }
  return new TextEncoder().encode(secret);
}

async function isAuthenticated(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, getSecret());
    return true;
  } catch {
    return false;
  }
}

// Paths that should bypass redirect rule matching
const BYPASS_PATTERNS = [/_next/, /^\/api\//, /favicon\.ico/, /robots\.txt/, /sitemap\.xml/];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // --- Admin protection ---
  if (pathname.startsWith("/admin")) {
    const isLoginPage = pathname === "/admin/login";

    if (!isLoginPage) {
      const authed = await isAuthenticated(req);
      if (!authed) {
        const loginUrl = req.nextUrl.clone();
        loginUrl.pathname = "/admin/login";
        loginUrl.search = `?next=${encodeURIComponent(pathname)}`;
        return NextResponse.redirect(loginUrl);
      }
    }
    return NextResponse.next();
  }

  // --- Redirect rules (skip bypass patterns) ---
  if (BYPASS_PATTERNS.some((p) => p.test(pathname))) {
    return NextResponse.next();
  }

  try {
    // Lazy import to avoid issues when DB not configured
    const { db } = await import("./db");
    const { redirects } = await import("./db/schema");
    const { eq, and } = await import("drizzle-orm");

    const rule = await db
      .select()
      .from(redirects)
      .where(and(eq(redirects.fromPath, pathname), eq(redirects.enabled, true)))
      .limit(1)
      .then((r) => r[0]);

    if (rule) {
      const dest = req.nextUrl.clone();
      dest.pathname = rule.toPath;
      dest.search = "";
      return NextResponse.redirect(dest, { status: rule.statusCode });
    }
  } catch {
    // DB not configured or query failed - continue normally
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/((?!_next|api|favicon.ico|robots.txt|sitemap.xml).*)"],
};
