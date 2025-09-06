"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { LogOut, User, Home } from "lucide-react"
import Link from "next/link"

interface AdminHeaderProps {
  user?: {
    name: string
    email: string
  }
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)

    try {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
      })

      if (response.ok) {
        toast({
          title: "Logged Out",
          description: "You have been successfully logged out.",
        })
        router.push("/admin/login")
      }
    } catch (error) {
      toast({
        title: "Logout Error",
        description: "There was an error logging out.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <header className="bg-card border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin/dashboard" className="text-2xl font-bold text-primary">
              Ksar Salakta Admin
            </Link>
            <nav className="hidden md:flex items-center gap-4">
              <Link href="/admin/dashboard" className="text-foreground hover:text-primary transition-colors">
                Dashboard
              </Link>
              <Link href="/admin/reservations" className="text-foreground hover:text-primary transition-colors">
                Reservations
              </Link>
              <Link href="/admin/rooms" className="text-foreground hover:text-primary transition-colors">
                Rooms
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                <Home className="w-4 h-4 mr-2" />
                View Site
              </Button>
            </Link>

            {user && (
              <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                <span>{user.name}</span>
              </div>
            )}

            <Button variant="outline" size="sm" onClick={handleLogout} disabled={loading}>
              <LogOut className="w-4 h-4 mr-2" />
              {loading ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
