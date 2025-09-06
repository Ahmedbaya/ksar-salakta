import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getAuthUserFromRequest } from "@/lib/auth"

export function middleware(request: NextRequest) {
  // Check if the request is for admin routes or admin API
  const isAdminPage = request.nextUrl.pathname.startsWith("/admin")
  const isAdminApi = request.nextUrl.pathname.startsWith("/api/admin")
  const isLoginPage = request.nextUrl.pathname === "/admin/login"
  const isLoginApi = request.nextUrl.pathname === "/api/admin/login"

  console.log("[v0] Middleware - Path:", request.nextUrl.pathname)
  console.log("[v0] Middleware - Cookies:", request.cookies.getAll())

  // Skip auth check for login, setup, and test routes
  if (
    isLoginPage ||
    isLoginApi ||
    request.nextUrl.pathname.startsWith("/admin/setup") ||
    request.nextUrl.pathname.startsWith("/admin/test")
  ) {
    console.log("[v0] Middleware - Skipping auth check for:", request.nextUrl.pathname)
    return NextResponse.next()
  }

  // Check authentication for admin pages and API routes
  if (isAdminPage || isAdminApi) {
    const user = getAuthUserFromRequest(request)
    console.log("[v0] Middleware - Auth check result:", user ? "Authenticated" : "Not authenticated")

    if (!user) {
      // Return 401 for API requests
      if (isAdminApi) {
        console.log("[v0] Middleware - Returning 401 for API request")
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      // Redirect to login for page requests
      console.log("[v0] Middleware - Redirecting to login page")
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
}
