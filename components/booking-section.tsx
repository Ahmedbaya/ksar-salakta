"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AvailabilityCalendar } from "@/components/availability-calendar"
import { useToast } from "@/hooks/use-toast"
import { Users, Phone, Mail } from "lucide-react"

export function BookingSection() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [selectedCheckIn, setSelectedCheckIn] = useState<Date | null>(null)
  const [selectedCheckOut, setSelectedCheckOut] = useState<Date | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    numberOfGuests: "1",
    roomType: "",
    specialRequests: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleDateSelect = (checkIn: Date | null, checkOut: Date | null) => {
    setSelectedCheckIn(checkIn)
    setSelectedCheckOut(checkOut)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedCheckIn || !selectedCheckOut) {
      toast({
        title: "Please select dates",
        description: "Please select both check-in and check-out dates.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const reservationData = {
        ...formData,
        checkInDate: selectedCheckIn.toISOString().split("T")[0],
        checkOutDate: selectedCheckOut.toISOString().split("T")[0],
      }

      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservationData),
      })

      if (response.ok) {
        toast({
          title: "Reservation Submitted!",
          description: "Thank you for your booking request. We'll confirm your reservation within 24 hours.",
        })

        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          numberOfGuests: "1",
          roomType: "",
          specialRequests: "",
        })
        setSelectedCheckIn(null)
        setSelectedCheckOut(null)
      } else {
        throw new Error("Failed to submit reservation")
      }
    } catch (error) {
      toast({
        title: "Booking Error",
        description: "There was an error submitting your reservation. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="booking" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
            Book Your <span className="text-primary">Authentic Stay</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            Ready to experience the warmth of Tunisian hospitality? Select your dates and fill out the form below.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            <AvailabilityCalendar
              onDateSelect={handleDateSelect}
              selectedCheckIn={selectedCheckIn}
              selectedCheckOut={selectedCheckOut}
            />

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Reservation Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="guests">Number of Guests</Label>
                      <Select
                        value={formData.numberOfGuests}
                        onValueChange={(value) => handleInputChange("numberOfGuests", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select guests" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Guest</SelectItem>
                          <SelectItem value="2">2 Guests</SelectItem>
                          <SelectItem value="3">3 Guests</SelectItem>
                          <SelectItem value="4">4 Guests</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="roomType">Preferred Room Type</Label>
                      <Select value={formData.roomType} onValueChange={(value) => handleInputChange("roomType", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select room type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Heritage Room</SelectItem>
                          <SelectItem value="suite">Traditional Suite</SelectItem>
                          <SelectItem value="family">Family Courtyard Room</SelectItem>
                          <SelectItem value="deluxe">Deluxe Desert View</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {selectedCheckIn && selectedCheckOut && (
                    <div className="p-4 bg-primary/10 rounded-lg">
                      <h4 className="font-medium text-primary mb-2">Selected Dates</h4>
                      <p className="text-sm">
                        <strong>Check-in:</strong>{" "}
                        {selectedCheckIn.toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-sm">
                        <strong>Check-out:</strong>{" "}
                        {selectedCheckOut.toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-sm mt-2">
                        <strong>Duration:</strong>{" "}
                        {Math.ceil((selectedCheckOut.getTime() - selectedCheckIn.getTime()) / (1000 * 60 * 60 * 24))}{" "}
                        nights
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="requests">Special Requests (Optional)</Label>
                    <Textarea
                      id="requests"
                      placeholder="Any special requests or dietary requirements..."
                      value={formData.specialRequests}
                      onChange={(e) => handleInputChange("specialRequests", e.target.value)}
                      rows={3}
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? "Submitting..." : "Submit Reservation Request"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
