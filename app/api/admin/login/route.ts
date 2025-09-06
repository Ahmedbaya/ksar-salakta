import { type NextRequest, NextResponse } from "next/server"
import { getAdminByEmail } from "@/lib/db-operations"
import { verifyPassword, generateToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    console.log("[v0] Login attempt for email:", email)

    if (!email || !password) {
      console.log("[v0] Missing email or password")
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Find admin user
    console.log("[v0] Looking for admin with email:", email)
    const admin = await getAdminByEmail(email)
    console.log("[v0] Admin found:", admin ? "Yes" : "No")

    if (!admin) {
      console.log("[v0] No admin found with email:", email)
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Verify password
    console.log("[v0] Verifying password...")
    const isValidPassword = await verifyPassword(password, admin.password)
    console.log("[v0] Password valid:", isValidPassword)

    if (!isValidPassword) {
      console.log("[v0] Invalid password for admin:", email)
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = generateToken({
      id: admin._id!.toString(),
      email: admin.email,
      name: admin.name,
      role: admin.role,
    })

    console.log("[v0] Login successful for:", admin.email)

    // Create response with cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: admin._id!.toString(),
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    })

    // Set HTTP-only cookie
    response.cookies.set("admin-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })

    return response

  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json(
      { error: "An error occurred during login" },
      { status: 500 }
    )
  }
}
