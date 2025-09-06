"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Check, X, Eye } from "lucide-react"
import Link from "next/link"

interface Reservation {
  _id: string
  name: string
  email: string
  checkInDate: string
  checkOutDate: string
  roomType: string
  status: "pending" | "confirmed" | "declined"
  totalPrice: number
  numberOfGuests: number
}

export function RecentReservations() {
  const { toast } = useToast()
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReservations()
  }, [])

  const fetchReservations = async () => {
    try {
      const response = await fetch("/api/admin/reservations?limit=5")
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
        fetchReservations() // Refresh the list
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

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Reservations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Reservations</CardTitle>
        <Link href="/admin/reservations">
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reservations.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No reservations yet</p>
          ) : (
            reservations.map((reservation) => (
              <div key={reservation._id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{reservation.name}</h4>
                    <Badge variant={getStatusColor(reservation.status)}>{reservation.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(reservation.checkInDate)} - {formatDate(reservation.checkOutDate)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {reservation.roomType} • {reservation.numberOfGuests} guests • ${reservation.totalPrice}
                  </p>
                </div>

                {reservation.status === "pending" && (
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => updateReservationStatus(reservation._id, "confirmed")}>
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateReservationStatus(reservation._id, "declined")}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
