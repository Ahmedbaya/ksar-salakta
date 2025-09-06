import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Admin setup endpoint called")

    const db = await getDatabase()
    console.log("[v0] Connected to database")

    // Check if admin already exists
    const existingAdmin = await db.collection("admins").findOne({ email: "admin@ksarsalakta.com" })

    if (existingAdmin) {
      console.log("[v0] Admin already exists")
      return NextResponse.json({ message: "Admin already exists" }, { status: 200 })
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 12)
    console.log("[v0] Password hashed successfully")

    const admin = {
      email: "admin@ksarsalakta.com",
      password: hashedPassword,
      name: "Ksar Salakta Admin",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await db.collection("admins").insertOne(admin)
    console.log("[v0] Admin user created successfully")

    return NextResponse.json({
      message: "Admin user created successfully",
      credentials: {
        email: "admin@ksarsalakta.com",
        password: "admin123",
      },
    })
  } catch (error) {
    console.error("[v0] Error creating admin:", error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: "Failed to create admin user", details: errorMessage }, { status: 500 })
  }
}
