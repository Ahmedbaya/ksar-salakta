"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Wifi, Coffee, Star } from "lucide-react"

interface Room {
  _id: string
  name: string
  type: string
  description: string
  price: number
  capacity: number
  amenities: string[]
  images: string[]
  isAvailable: boolean
}

export function RoomsSection() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRooms()
  }, [])

  const fetchRooms = async () => {
    try {
      const response = await fetch("/api/rooms")
      if (response.ok) {
        const data = await response.json()
        setRooms(data)
      }
    } catch (error) {
      console.error("Error fetching rooms:", error)
    } finally {
      setLoading(false)
    }
  }

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case "wifi":
        return <Wifi className="w-4 h-4" />
      case "air conditioning":
        return <Star className="w-4 h-4" />
      case "private bathroom":
        return <Users className="w-4 h-4" />
      default:
        return <Coffee className="w-4 h-4" />
    }
  }

  const scrollToBooking = () => {
    const element = document.getElementById("booking")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  if (loading) {
    return (
      <section id="rooms" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse">Loading rooms...</div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="rooms" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
            Our <span className="text-primary">Heritage Rooms</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            Each room at Ksar Salakta is uniquely designed to reflect different aspects of Tunisian culture, offering
            comfort and authenticity in perfect harmony.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {rooms.map((room) => (
            <Card key={room._id} className="overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative h-64">
                <img
                  src={
                    room.images[0] ||
                    `/placeholder.svg?height=300&width=500&query=${room.name.toLowerCase().replace(/\s+/g, "-")}-tunisian-room`
                  }
                  alt={room.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Badge variant={room.isAvailable ? "default" : "destructive"}>
                    {room.isAvailable ? "Available" : "Sold Out"}
                  </Badge>
                </div>
              </div>

              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-2xl">{room.name}</CardTitle>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">${room.price}</div>
                    <div className="text-sm text-muted-foreground">per night</div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-muted-foreground mb-4 text-pretty">{room.description}</p>

                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Up to {room.capacity} guests</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {room.amenities.slice(0, 4).map((amenity, index) => (
                    <div key={index} className="flex items-center gap-1 text-sm text-muted-foreground">
                      {getAmenityIcon(amenity)}
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>

                <Button className="w-full" disabled={!room.isAvailable} onClick={scrollToBooking}>
                  {room.isAvailable ? "Book This Room" : "Sold Out"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
