import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Users, Settings, BarChart3 } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  const actions = [
    {
      title: "View Calendar",
      description: "Check room availability and bookings",
      icon: Calendar,
      href: "/admin/calendar",
      color: "bg-blue-500",
    },
    {
      title: "Manage Rooms",
      description: "Update room details and availability",
      icon: Users,
      href: "/admin/rooms",
      color: "bg-green-500",
    },
    {
      title: "View Reports",
      description: "Analyze booking trends and revenue",
      icon: BarChart3,
      href: "/admin/reports",
      color: "bg-purple-500",
    },
    {
      title: "Settings",
      description: "Configure guest house settings",
      icon: Settings,
      href: "/admin/settings",
      color: "bg-orange-500",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action, index) => (
            <Link key={index} href={action.href}>
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2 hover:shadow-md transition-shadow bg-transparent"
              >
                <div className={`w-8 h-8 rounded-full ${action.color} flex items-center justify-center`}>
                  <action.icon className="w-4 h-4 text-white" />
                </div>
                <div className="text-center">
                  <div className="font-medium text-sm">{action.title}</div>
                  <div className="text-xs text-muted-foreground">{action.description}</div>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
