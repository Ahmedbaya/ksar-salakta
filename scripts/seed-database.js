// MongoDB seed script for Ksar Salakta
// Run this script to populate the database with initial data

const { MongoClient } = require("mongodb")

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017"
const dbName = "ksar-salakta"

async function seedDatabase() {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db(dbName)

    // Clear existing collections
    await db.collection("rooms").deleteMany({})
    await db.collection("admins").deleteMany({})

    // Seed rooms
    const rooms = [
      {
        name: "Traditional Suite",
        type: "suite",
        description:
          "A spacious suite with traditional Tunisian decor, featuring a private terrace overlooking the courtyard.",
        price: 120,
        capacity: 2,
        amenities: ["Private Bathroom", "Air Conditioning", "Traditional Decor", "Terrace", "WiFi"],
        images: ["/traditional-tunisian-suite-with-terrace.jpg"],
        isAvailable: true,
        unavailableDates: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Heritage Room",
        type: "standard",
        description: "Comfortable room with authentic Tunisian furnishings and modern amenities.",
        price: 80,
        capacity: 2,
        amenities: ["Private Bathroom", "Air Conditioning", "Traditional Furnishings", "WiFi"],
        images: ["/heritage-room-with-tunisian-furnishings.jpg"],
        isAvailable: true,
        unavailableDates: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Family Courtyard Room",
        type: "family",
        description: "Spacious family room accommodating up to 4 guests with courtyard access.",
        price: 150,
        capacity: 4,
        amenities: ["Private Bathroom", "Air Conditioning", "Courtyard Access", "Family Friendly", "WiFi"],
        images: ["/family-room-with-courtyard-access-tunisia.jpg"],
        isAvailable: true,
        unavailableDates: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Deluxe Desert View",
        type: "deluxe",
        description: "Premium room with panoramic desert views and luxury amenities.",
        price: 200,
        capacity: 2,
        amenities: ["Private Bathroom", "Air Conditioning", "Desert View", "Luxury Amenities", "Mini Bar", "WiFi"],
        images: ["/luxury-room-with-desert-view-tunisia.jpg"],
        isAvailable: true,
        unavailableDates: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    await db.collection("rooms").insertMany(rooms)
    console.log("Rooms seeded successfully")

    // Seed admin user (password should be hashed in production)
    const bcrypt = require("bcryptjs")
    const hashedPassword = await bcrypt.hash("admin123", 12)

    const admin = {
      email: "admin@ksarsalakta.com",
      password: hashedPassword,
      name: "Ksar Salakta Admin",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await db.collection("admins").insertOne(admin)
    console.log("Admin user created successfully")
    console.log("Login credentials: admin@ksarsalakta.com / admin123")
  } catch (error) {
    console.error("Error seeding database:", error)
  } finally {
    await client.close()
  }
}

seedDatabase()
