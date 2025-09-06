import { getDatabase } from "./mongodb"
import type { Reservation, Room, Admin } from "./models/reservation"
import { ObjectId } from "mongodb"

// Reservation operations
export async function createReservation(reservation: Omit<Reservation, "_id" | "createdAt" | "updatedAt">) {
  const db = await getDatabase()
  const now = new Date()

  const newReservation = {
    ...reservation,
    createdAt: now,
    updatedAt: now,
    status: "pending" as const,
  }

  const result = await db.collection<Reservation>("reservations").insertOne(newReservation)
  return result
}

export async function getReservations() {
  const db = await getDatabase()
  const reservations = await db.collection<Reservation>("reservations").find({}).sort({ createdAt: -1 }).toArray()
  return reservations
}

export async function updateReservationStatus(id: string, status: Reservation["status"]) {
  const db = await getDatabase()
  const result = await db.collection<Reservation>("reservations").updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        status,
        updatedAt: new Date(),
      },
    },
  )
  return result
}

// Room operations
export async function getRooms() {
  const db = await getDatabase()
  const rooms = await db.collection<Room>("rooms").find({}).toArray()
  return rooms
}

export async function updateRoomAvailability(id: string, isAvailable: boolean, unavailableDates?: Date[]) {
  const db = await getDatabase()
  const updateData: any = {
    isAvailable,
    updatedAt: new Date(),
  }

  if (unavailableDates) {
    updateData.unavailableDates = unavailableDates
  }

  const result = await db.collection<Room>("rooms").updateOne({ _id: new ObjectId(id) }, { $set: updateData })
  return result
}

// Admin operations
export async function getAdminByEmail(email: string) {
  try {
    console.log("Connecting to database...")
    const db = await getDatabase()
    console.log("Database connected, searching for admin with email:", email)

    const admin = await db.collection<Admin>("admins").findOne({ email })
    console.log("Admin query result:", admin ? "Found admin" : "No admin found")

    return admin
  } catch (error) {
    console.error("Error in getAdminByEmail:", error)
    throw error
  }
}

export async function createAdmin(admin: Omit<Admin, "_id" | "createdAt" | "updatedAt">) {
  const db = await getDatabase()
  const now = new Date()

  const newAdmin = {
    ...admin,
    createdAt: now,
    updatedAt: now,
  }

  const result = await db.collection<Admin>("admins").insertOne(newAdmin)
  return result
}
