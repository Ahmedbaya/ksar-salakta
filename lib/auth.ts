import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"
import type { NextRequest } from "next/server"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

export interface AdminUser {
  id: string
  email: string
  name: string
  role: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(user: AdminUser): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "7d" },
  )
}

export function verifyToken(token: string): AdminUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AdminUser
    return decoded
  } catch (error) {
    return null
  }
}

export async function getAuthUser(): Promise<AdminUser | null> {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("admin-token")?.value

    if (!token) {
      return null
    }

    return verifyToken(token)
  } catch (error) {
    return null
  }
}

export function getAuthUserFromRequest(request: NextRequest): AdminUser | null {
  try {
    const token = request.cookies.get("admin-token")?.value
    console.log("[v0] Auth - Checking token:", token ? "Present" : "Not present")

    if (!token) {
      return null
    }

    const user = verifyToken(token)
    console.log("[v0] Auth - Token verification:", user ? "Valid" : "Invalid")
    return user
  } catch (error) {
    console.error("[v0] Auth - Error verifying token:", error)
    return null
  }
}
