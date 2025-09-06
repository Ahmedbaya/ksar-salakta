import { type NextRequest, NextResponse } from "next/server"
import { updateReservationStatus } from "@/lib/db-operations"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { status } = await request.json()
    const { id } = params

    if (!status || !["confirmed", "declined", "pending"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const result = await updateReservationStatus(id, status)

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating reservation:", error)
    return NextResponse.json({ error: "Failed to update reservation" }, { status: 500 })
  }
}
