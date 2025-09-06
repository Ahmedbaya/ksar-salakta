import type { ObjectId } from "mongodb"

export interface Reservation {
  _id?: ObjectId
  name: string
  email: string
  phone: string
  checkInDate: Date
  checkOutDate: Date
  numberOfGuests: number
  roomType: string
  status: "pending" | "confirmed" | "declined" | "cancelled"
  totalPrice: number
  specialRequests?: string
  createdAt: Date
  updatedAt: Date
}

export interface Room {
  _id?: ObjectId
  name: string
  type: string
  description: string
  price: number
  capacity: number
  amenities: string[]
  images: string[]
  isAvailable: boolean
  unavailableDates: Date[]
  createdAt: Date
  updatedAt: Date
}

export interface Admin {
  _id?: ObjectId
  email: string
  password: string
  name: string
  role: "admin" | "super_admin"
  createdAt: Date
  updatedAt: Date
}
