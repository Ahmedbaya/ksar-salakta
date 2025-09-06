import { type NextRequest, NextResponse } from "next/server"
import { getReservations } from "@/lib/db-operations"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get("limit")

    const reservations = await getReservations()

    // If limit is specified, return only that many
    if (limit) {
      const limitNum = Number.parseInt(limit)
      return NextResponse.json(reservations.slice(0, limitNum))
    }

    return NextResponse.json(reservations)
  } catch (error) {
    console.error("Error fetching reservations:", error)
    return NextResponse.json({ error: "Failed to fetch reservations" }, { status: 500 })
  }
}
