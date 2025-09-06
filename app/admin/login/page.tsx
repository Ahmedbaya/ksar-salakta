"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

export default function AdminLoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  })

  const validateForm = () => {
    const newErrors = {
      email: "",
      password: "",
    }
    let isValid = true

    if (!formData.email) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
      isValid = false
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
      isValid = false
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    setErrors(prev => ({ ...prev, [field]: "" }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setLoading(true)

    try {
      console.log("[v0] Submitting login form with:", { email: formData.email })

      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      console.log("[v0] Login response status:", response.status)
      const data = await response.json()
      console.log("[v0] Login response data:", data)

      if (response.ok) {
        console.log("[v0] Login successful, attempting redirect to /admin/dashboard")
        
        // Show success message
        toast({
          title: "Login Successful",
          description: "Welcome back to Ksar Salakta admin panel.",
        })

        // Small delay to ensure cookie is set
        await new Promise(resolve => setTimeout(resolve, 100))

        // First try router.push
        try {
          await router.push("/admin/dashboard")
        } catch (e) {
          console.error("[v0] Router push failed, falling back to location.href", e)
          // If router.push fails, fall back to window.location
          window.location.href = "/admin/dashboard"
        }
      } else {
        console.log("[v0] Login failed with error:", data.error)
        toast({
          title: "Login Failed",
          description: data.error || "Invalid email or password.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.log("[v0] Login request failed:", error)
      toast({
        title: "Login Error",
        description: "There was an error logging in. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-primary hover:text-primary/80 transition-colors">
            Ksar Salakta
          </Link>
          <p className="text-muted-foreground mt-2">Admin Portal</p>
        </div>

        <Card className="border-border/50 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <p className="text-muted-foreground">Access the Ksar Salakta management dashboard</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Email Address</span>
                  {errors.email && (
                    <span className="text-sm text-destructive">{errors.email}</span>
                  )}
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                    aria-label="Email Address"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Password</span>
                  {errors.password && (
                    <span className="text-sm text-destructive">{errors.password}</span>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={`pl-10 pr-10 ${errors.password ? 'border-destructive' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                ← Back to Guest House
              </Link>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
