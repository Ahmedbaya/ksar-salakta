import { AuthGuard } from "@/components/admin/auth-guard"
import { AdminHeader } from "@/components/admin/admin-header"
import { DashboardStats } from "@/components/admin/dashboard-stats"
import { RecentReservations } from "@/components/admin/recent-reservations"
import { QuickActions } from "@/components/admin/quick-actions"
import { getAuthUser } from "@/lib/auth"

export default async function AdminDashboardPage() {
  const user = await getAuthUser()

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <AdminHeader user={user || undefined} />
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.name}! Here's what's happening at Ksar Salakta today.
            </p>
          </div>

          <div className="grid gap-8">
            <DashboardStats />

            <div className="grid lg:grid-cols-2 gap-8">
              <RecentReservations />
              <QuickActions />
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}
