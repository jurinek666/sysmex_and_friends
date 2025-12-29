import { NextRequest, NextResponse } from "next/server";

/**
 * Minimal HTTP Basic Auth for /admin routes.
 *
 * Set ADMIN_USER + ADMIN_PASSWORD in environment variables.
 * If not set, access is allowed (useful for local dev).
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  const user = process.env.ADMIN_USER;
  const pass = process.env.ADMIN_PASSWORD;

  // If creds not configured, don't block (dev-friendly).
  if (!user || !pass) return NextResponse.next();

  const authHeader = req.headers.get("authorization") || "";
  const [scheme, encoded] = authHeader.split(" ");

  if (scheme?.toLowerCase() === "basic" && encoded) {
    try {
      const decoded = Buffer.from(encoded, "base64").toString("utf8");
      const [u, p] = decoded.split(":");
      if (u === user && p === pass) return NextResponse.next();
    } catch {
      // fallthrough
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Admin", charset="UTF-8"',
    },
  });
}

export const config = {
  matcher: ["/admin/:path*"],
};
