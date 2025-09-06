"use client"

import { useEffect, useState } from "react"
import { AuthGuard } from "@/components/admin/auth-guard"
import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Check, X, Search, Filter } from "lucide-react"

interface Reservation {
  _id: string
  name: string
  email: string
  phone: string
  checkInDate: string
  checkOutDate: string
  roomType: string
  status: "pending" | "confirmed" | "declined"
  totalPrice: number
  numberOfGuests: number
  specialRequests?: string
  createdAt: string
}

export default function ReservationsPage() {
  const { toast } = useToast()
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    fetchReservations()
  }, [])

  const fetchReservations = async () => {
    try {
      const response = await fetch("/api/admin/reservations")
      if (response.ok) {
        const data = await response.json()
        setReservations(data)
      }
    } catch (error) {
      console.error("Error fetching reservations:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateReservationStatus = async (id: string, status: "confirmed" | "declined") => {
    try {
      const response = await fetch(`/api/admin/reservations/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        toast({
          title: "Status Updated",
          description: `Reservation ${status} successfully.`,
        })
        fetchReservations()
      }
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update reservation status.",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "default"
      case "pending":
        return "secondary"
      case "declined":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const filteredReservations = reservations.filter((reservation) => {
    const matchesSearch =
      reservation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || reservation.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <AdminHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Reservations</h1>
            <p className="text-muted-foreground">Manage all guest reservations and booking requests.</p>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="w-full md:w-48">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="declined">Declined</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reservations List */}
          <Card>
            <CardHeader>
              <CardTitle>All Reservations ({filteredReservations.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse p-4 border rounded-lg">
                      <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : filteredReservations.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No reservations found</p>
              ) : (
                <div className="space-y-4">
                  {filteredReservations.map((reservation) => (
                    <div key={reservation._id} className="p-4 border rounded-lg">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{reservation.name}</h4>
                            <Badge variant={getStatusColor(reservation.status)}>{reservation.status}</Badge>
                          </div>
                          <div className="grid md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                            <p>Email: {reservation.email}</p>
                            <p>Phone: {reservation.phone}</p>
                            <p>Check-in: {formatDate(reservation.checkInDate)}</p>
                            <p>Check-out: {formatDate(reservation.checkOutDate)}</p>
                            <p>Room: {reservation.roomType}</p>
                            <p>Guests: {reservation.numberOfGuests}</p>
                            <p>Total: ${reservation.totalPrice}</p>
                            <p>Booked: {formatDate(reservation.createdAt)}</p>
                          </div>
                          {reservation.specialRequests && (
                            <div className="mt-2">
                              <p className="text-sm font-medium">Special Requests:</p>
                              <p className="text-sm text-muted-foreground">{reservation.specialRequests}</p>
                            </div>
                          )}
                        </div>

                        {reservation.status === "pending" && (
                          <div className="flex gap-2">
                            <Button onClick={() => updateReservationStatus(reservation._id, "confirmed")}>
                              <Check className="w-4 h-4 mr-2" />
                              Confirm
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => updateReservationStatus(reservation._id, "declined")}
                            >
                              <X className="w-4 h-4 mr-2" />
                              Decline
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </AuthGuard>
  )
}
