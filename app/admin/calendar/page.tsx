"use client"

import { useEffect, useState } from "react"
import { AuthGuard } from "@/components/admin/auth-guard"
import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react"

interface Reservation {
  _id: string
  name: string
  checkInDate: string
  checkOutDate: string
  roomType: string
  status: "pending" | "confirmed" | "declined"
  numberOfGuests: number
}

interface Room {
  _id: string
  name: string
  type: string
}

export default function CalendarPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [selectedRoom, setSelectedRoom] = useState<string>("all")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [reservationsRes, roomsRes] = await Promise.all([
        fetch("/api/admin/reservations"),
        fetch("/api/admin/rooms"),
      ])

      if (reservationsRes.ok && roomsRes.ok) {
        const reservationsData = await reservationsRes.json()
        const roomsData = await roomsRes.json()
        setReservations(reservationsData.filter((r: Reservation) => r.status === "confirmed"))
        setRooms(roomsData)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const getReservationsForDate = (date: Date) => {
    if (!date) return []

    return reservations.filter((reservation) => {
      const checkIn = new Date(reservation.checkInDate)
      const checkOut = new Date(reservation.checkOutDate)
      const currentDate = new Date(date)

      // Check if the date falls within the reservation period
      return (
        currentDate >= checkIn &&
        currentDate < checkOut &&
        (selectedRoom === "all" || reservation.roomType === selectedRoom)
      )
    })
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(newDate.getMonth() - 1)
      } else {
        newDate.setMonth(newDate.getMonth() + 1)
      }
      return newDate
    })
  }

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  const isToday = (date: Date | null) => {
    if (!date) return false
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const days = getDaysInMonth(currentDate)
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <AdminHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Booking Calendar</h1>
            <p className="text-muted-foreground">View room availability and manage bookings across all rooms.</p>
          </div>

          {/* Calendar Controls */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="icon" onClick={() => navigateMonth("prev")}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <h2 className="text-2xl font-semibold min-w-48 text-center">{formatMonthYear(currentDate)}</h2>
                  <Button variant="outline" size="icon" onClick={() => navigateMonth("next")}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-4">
                  <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by room" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Rooms</SelectItem>
                      {rooms.map((room) => (
                        <SelectItem key={room._id} value={room.type}>
                          {room.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Calendar Grid */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                {selectedRoom === "all" ? "All Rooms" : rooms.find((r) => r.type === selectedRoom)?.name || "Room"}{" "}
                Availability
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="animate-pulse">
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {weekDays.map((day) => (
                      <div key={day} className="h-8 bg-muted rounded"></div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {[...Array(35)].map((_, i) => (
                      <div key={i} className="h-24 bg-muted rounded"></div>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {/* Week Day Headers */}
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {weekDays.map((day) => (
                      <div key={day} className="text-center font-medium text-muted-foreground py-2">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Days */}
                  <div className="grid grid-cols-7 gap-2">
                    {days.map((date, index) => {
                      const dayReservations = date ? getReservationsForDate(date) : []

                      return (
                        <div
                          key={index}
                          className={`
                            min-h-24 p-2 border rounded-lg
                            ${date ? "bg-card hover:bg-muted/50 cursor-pointer" : "bg-muted/20"}
                            ${isToday(date) ? "ring-2 ring-primary" : ""}
                          `}
                        >
                          {date && (
                            <>
                              <div
                                className={`
                                text-sm font-medium mb-1
                                ${isToday(date) ? "text-primary" : "text-foreground"}
                              `}
                              >
                                {date.getDate()}
                              </div>

                              <div className="space-y-1">
                                {dayReservations.slice(0, 2).map((reservation, idx) => (
                                  <div
                                    key={idx}
                                    className="text-xs p-1 bg-primary/10 text-primary rounded truncate"
                                    title={`${reservation.name} - ${reservation.roomType}`}
                                  >
                                    {reservation.name}
                                  </div>
                                ))}
                                {dayReservations.length > 2 && (
                                  <div className="text-xs text-muted-foreground">
                                    +{dayReservations.length - 2} more
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Legend */}
          <Card className="mt-6">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Legend</h3>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-primary/10 border border-primary rounded"></div>
                  <span className="text-sm">Confirmed Booking</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary rounded"></div>
                  <span className="text-sm">Today</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-card border rounded"></div>
                  <span className="text-sm">Available</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </AuthGuard>
  )
}
