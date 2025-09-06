"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { AdminUser } from "@/lib/auth"

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const router = useRouter()
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      console.log("[v0] AuthGuard: Checking authentication...")
      const response = await fetch("/api/admin/me")
      console.log("[v0] AuthGuard: /api/admin/me response status:", response.status)

      if (response.ok) {
        const data = await response.json()
        console.log("[v0] AuthGuard: User authenticated successfully")
        setUser(data.user)
      } else {
        console.log("[v0] AuthGuard: Authentication failed, redirecting to login")
        router.push("/admin/login")
      }
    } catch (error) {
      console.error("[v0] AuthGuard: Auth check failed:", error)
      router.push("/admin/login")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      fallback || (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Checking authentication...</p>
          </div>
        </div>
      )
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  return <>{children}</>
}
