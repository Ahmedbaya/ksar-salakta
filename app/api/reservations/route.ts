import { type NextRequest, NextResponse } from "next/server"
import { createReservation, getReservations } from "@/lib/db-operations"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { name, email, phone, checkInDate, checkOutDate, numberOfGuests, roomType, specialRequests } = body

    // Basic validation
    if (!name || !email || !phone || !checkInDate || !checkOutDate || !numberOfGuests || !roomType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Calculate total price (simplified - in production, this would be more complex)
    const roomPrices = {
      standard: 80,
      suite: 120,
      family: 150,
      deluxe: 200,
    }

    const nights = Math.ceil(
      (new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24),
    )

    const totalPrice = (roomPrices[roomType as keyof typeof roomPrices] || 80) * nights

    const reservation = {
      name,
      email,
      phone,
      checkInDate: new Date(checkInDate),
      checkOutDate: new Date(checkOutDate),
      numberOfGuests: Number.parseInt(numberOfGuests),
      roomType,
      totalPrice,
      specialRequests: specialRequests || "",
      status: "pending" as const,
    }

    const result = await createReservation(reservation)

    return NextResponse.json({
      success: true,
      reservationId: result.insertedId,
    })
  } catch (error) {
    console.error("Error creating reservation:", error)
    return NextResponse.json({ error: "Failed to create reservation" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const reservations = await getReservations()
    return NextResponse.json(reservations)
  } catch (error) {
    console.error("Error fetching reservations:", error)
    return NextResponse.json({ error: "Failed to fetch reservations" }, { status: 500 })
  }
}
