import { type NextRequest, NextResponse } from "next/server"
import { updateRoomAvailability } from "@/lib/db-operations"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { isAvailable } = await request.json()
    const { id } = params

    if (typeof isAvailable !== "boolean") {
      return NextResponse.json({ error: "Invalid availability status" }, { status: 400 })
    }

    const result = await updateRoomAvailability(id, isAvailable)

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating room:", error)
    return NextResponse.json({ error: "Failed to update room" }, { status: 500 })
  }
}
