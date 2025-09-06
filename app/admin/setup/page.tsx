"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

export default function AdminSetupPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const setupAdmin = async () => {
    setStatus("loading")

    try {
      const response = await fetch("/api/admin/setup", {
        method: "POST",
      })

      const data = await response.json()

      if (response.ok) {
        setStatus("success")
        setMessage("Admin account created successfully!")
      } else {
        setStatus("error")
        setMessage(data.error || "Failed to create admin account")
      }
    } catch (error) {
      setStatus("error")
      setMessage("Network error occurred")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-amber-900">Ksar Salakta Setup</CardTitle>
          <CardDescription>Create the admin account to get started</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === "idle" && (
            <Button onClick={setupAdmin} className="w-full bg-amber-600 hover:bg-amber-700">
              Create Admin Account
            </Button>
          )}

          {status === "loading" && (
            <div className="flex items-center justify-center space-x-2 text-amber-700">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Creating admin account...</span>
            </div>
          )}

          {status === "success" && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-green-700">
                <CheckCircle className="h-5 w-5" />
                <span>{message}</span>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-800 mb-2">Login Credentials:</h3>
                <p className="text-sm text-green-700">
                  <strong>Email:</strong> admin@ksarsalakta.com
                  <br />
                  <strong>Password:</strong> admin123
                </p>
              </div>
              <Button
                onClick={() => (window.location.href = "/admin/login")}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Go to Login
              </Button>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-red-700">
                <AlertCircle className="h-5 w-5" />
                <span>{message}</span>
              </div>
              <Button onClick={setupAdmin} variant="outline" className="w-full bg-transparent">
                Try Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
