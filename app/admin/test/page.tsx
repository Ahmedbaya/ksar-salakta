"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DatabaseTestPage() {
  const [testResult, setTestResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testDatabase = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/test-db")
      const result = await response.json()
      setTestResult(result)
    } catch (error) {
      setTestResult({
        success: false,
        error: "Failed to connect to test endpoint",
        details: error instanceof Error ? error.message : "Unknown error",
      })
    }
    setLoading(false)
  }

  const createAdmin = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/setup", { method: "POST" })
      const result = await response.json()
      setTestResult(result)
    } catch (error) {
      setTestResult({
        success: false,
        error: "Failed to create admin user",
        details: error instanceof Error ? error.message : "Unknown error",
      })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-amber-900">Database Diagnostics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button onClick={testDatabase} disabled={loading} className="bg-amber-700 hover:bg-amber-800">
                {loading ? "Testing..." : "Test Database Connection"}
              </Button>

              <Button
                onClick={createAdmin}
                disabled={loading}
                variant="outline"
                className="border-amber-700 text-amber-700 hover:bg-amber-50 bg-transparent"
              >
                {loading ? "Creating..." : "Create Admin User"}
              </Button>
            </div>

            {testResult && (
              <Card className={`${testResult.success ? "border-green-500" : "border-red-500"}`}>
                <CardContent className="pt-6">
                  <pre className="text-sm overflow-auto">{JSON.stringify(testResult, null, 2)}</pre>
                </CardContent>
              </Card>
            )}

            <div className="text-sm text-gray-600 space-y-2">
              <p>
                <strong>Instructions:</strong>
              </p>
              <ol className="list-decimal list-inside space-y-1">
                <li>First, click "Test Database Connection" to check if MongoDB is connected</li>
                <li>If the test fails, make sure you have set the MONGODB_URI environment variable</li>
                <li>If the test passes, click "Create Admin User" to set up the admin account</li>
                <li>
                  Once created, you can login at <code>/admin/login</code> with:
                </li>
                <ul className="list-disc list-inside ml-4">
                  <li>Email: admin@ksarsalakta.com</li>
                  <li>Password: admin123</li>
                </ul>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
