import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const db = await getDatabase()

    // Get total reservations
    const totalReservations = await db.collection("reservations").countDocuments()

    // Get pending reservations
    const pendingReservations = await db.collection("reservations").countDocuments({ status: "pending" })

    // Calculate total revenue from confirmed reservations
    const revenueResult = await db
      .collection("reservations")
      .aggregate([{ $match: { status: "confirmed" } }, { $group: { _id: null, total: { $sum: "$totalPrice" } } }])
      .toArray()

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0

    // Calculate occupancy rate (simplified - based on confirmed reservations this month)
    const currentMonth = new Date()
    currentMonth.setDate(1)
    currentMonth.setHours(0, 0, 0, 0)

    const nextMonth = new Date(currentMonth)
    nextMonth.setMonth(nextMonth.getMonth() + 1)

    const monthlyReservations = await db.collection("reservations").countDocuments({
      status: "confirmed",
      checkInDate: {
        $gte: currentMonth,
        $lt: nextMonth,
      },
    })

    // Simplified occupancy calculation (assuming 4 rooms, 30 days)
    const occupancyRate = Math.min(Math.round((monthlyReservations / (4 * 30)) * 100), 100)

    return NextResponse.json({
      totalReservations,
      pendingReservations,
      totalRevenue,
      occupancyRate,
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
