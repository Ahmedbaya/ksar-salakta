"use client"

import { useEffect, useState } from "react"
import { AuthGuard } from "@/components/admin/auth-guard"
import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Users, DollarSign, Settings } from "lucide-react"

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

export default function RoomsPage() {
  const { toast } = useToast()
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRooms()
  }, [])

  const fetchRooms = async () => {
    try {
      const response = await fetch("/api/admin/rooms")
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

  const toggleRoomAvailability = async (roomId: string, isAvailable: boolean) => {
    try {
      const response = await fetch(`/api/admin/rooms/${roomId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isAvailable }),
      })

      if (response.ok) {
        toast({
          title: "Room Updated",
          description: `Room availability ${isAvailable ? "enabled" : "disabled"}.`,
        })
        fetchRooms()
      }
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update room availability.",
        variant: "destructive",
      })
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <AdminHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Room Management</h1>
            <p className="text-muted-foreground">Manage room availability, pricing, and details.</p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="animate-pulse">
                      <div className="h-48 bg-muted rounded mb-4"></div>
                      <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {rooms.map((room) => (
                <Card key={room._id}>
                  <div className="relative h-48">
                    <img
                      src={
                        room.images[0] ||
                        `/placeholder.svg?height=200&width=400&query=${room.name.toLowerCase().replace(/\s+/g, "-")}-room`
                      }
                      alt={room.name}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge variant={room.isAvailable ? "default" : "destructive"}>
                        {room.isAvailable ? "Available" : "Unavailable"}
                      </Badge>
                    </div>
                  </div>

                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {room.name}
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Available</span>
                        <Switch
                          checked={room.isAvailable}
                          onCheckedChange={(checked) => toggleRoomAvailability(room._id, checked)}
                        />
                      </div>
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <p className="text-muted-foreground mb-4 text-sm">{room.description}</p>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span className="font-semibold">${room.price}/night</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>Up to {room.capacity} guests</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-2">Amenities:</h4>
                      <div className="flex flex-wrap gap-1">
                        {room.amenities.slice(0, 3).map((amenity, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                        {room.amenities.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{room.amenities.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <Button variant="outline" className="w-full bg-transparent">
                      <Settings className="w-4 h-4 mr-2" />
                      Edit Room Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </AuthGuard>
  )
}
