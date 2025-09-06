import { NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"

export async function GET() {
  try {
    console.log("[v0] Auth check: Starting /api/admin/me")
    const user = await getAuthUser()
    console.log("[v0] Auth check: getAuthUser result:", user ? "User found" : "No user")

    if (!user) {
      console.log("[v0] Auth check: Returning 401 - no user")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[v0] Auth check: Returning user data")
    return NextResponse.json({ user })
  } catch (error) {
    console.error("[v0] Auth check error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
