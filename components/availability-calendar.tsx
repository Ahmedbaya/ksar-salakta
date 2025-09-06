"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface AvailabilityCalendarProps {
  onDateSelect?: (checkIn: Date | null, checkOut: Date | null) => void
  selectedCheckIn?: Date | null
  selectedCheckOut?: Date | null
}

interface Reservation {
  checkInDate: string
  checkOutDate: string
  status: string
}

export function AvailabilityCalendar({ onDateSelect, selectedCheckIn, selectedCheckOut }: AvailabilityCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [selectingCheckOut, setSelectingCheckOut] = useState(false)

  useEffect(() => {
    fetchReservations()
  }, [])

  const fetchReservations = async () => {
    try {
      const response = await fetch("/api/reservations")
      if (response.ok) {
        const data = await response.json()
        setReservations(data.filter((r: Reservation) => r.status === "confirmed"))
      }
    } catch (error) {
      console.error("Error fetching reservations:", error)
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

  const isDateUnavailable = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Past dates are unavailable
    if (date < today) return true

    // Check if date conflicts with existing reservations
    return reservations.some((reservation) => {
      const checkIn = new Date(reservation.checkInDate)
      const checkOut = new Date(reservation.checkOutDate)
      return date >= checkIn && date < checkOut
    })
  }

  const isDateInRange = (date: Date) => {
    if (!selectedCheckIn || !selectedCheckOut) return false
    return date >= selectedCheckIn && date <= selectedCheckOut
  }

  const isDateSelected = (date: Date) => {
    if (selectedCheckIn && date.getTime() === selectedCheckIn.getTime()) return true
    if (selectedCheckOut && date.getTime() === selectedCheckOut.getTime()) return true
    return false
  }

  const handleDateClick = (date: Date) => {
    if (isDateUnavailable(date)) return

    if (!selectingCheckOut && !selectedCheckIn) {
      // First selection - check-in date
      onDateSelect?.(date, null)
      setSelectingCheckOut(true)
    } else if (selectingCheckOut && selectedCheckIn) {
      // Second selection - check-out date
      if (date <= selectedCheckIn) {
        // If selected date is before check-in, reset and start over
        onDateSelect?.(date, null)
      } else {
        // Valid check-out date
        onDateSelect?.(selectedCheckIn, date)
        setSelectingCheckOut(false)
      }
    } else {
      // Reset selection
      onDateSelect?.(date, null)
      setSelectingCheckOut(true)
    }
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Select Dates</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => navigateMonth("prev")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-lg font-medium min-w-48 text-center">{formatMonthYear(currentDate)}</span>
            <Button variant="outline" size="icon" onClick={() => navigateMonth("next")}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Week Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day) => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((date, index) => {
            const unavailable = date ? isDateUnavailable(date) : true
            const selected = date ? isDateSelected(date) : false
            const inRange = date ? isDateInRange(date) : false
            const today = date ? isToday(date) : false

            return (
              <button
                key={index}
                onClick={() => date && handleDateClick(date)}
                disabled={unavailable}
                className={`
                  aspect-square p-2 text-sm rounded-md transition-colors
                  ${!date ? "invisible" : ""}
                  ${unavailable ? "text-muted-foreground cursor-not-allowed" : "hover:bg-muted cursor-pointer"}
                  ${selected ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}
                  ${inRange && !selected ? "bg-primary/20 text-primary" : ""}
                  ${today && !selected ? "ring-2 ring-primary ring-offset-2" : ""}
                `}
              >
                {date?.getDate()}
              </button>
            )
          })}
        </div>

        {/* Instructions */}
        <div className="mt-4 text-sm text-muted-foreground">
          {!selectedCheckIn && <p>Select your check-in date</p>}
          {selectedCheckIn && !selectedCheckOut && <p>Select your check-out date</p>}
          {selectedCheckIn && selectedCheckOut && (
            <p>
              {selectedCheckIn.toLocaleDateString()} - {selectedCheckOut.toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-primary rounded"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-primary/20 rounded"></div>
            <span>Date Range</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-muted-foreground/30 rounded"></div>
            <span>Unavailable</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
