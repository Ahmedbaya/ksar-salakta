# Ksar Salakta - Authentic Tunisian Guest House Booking System

A full-stack web application for managing bookings at Ksar Salakta, an authentic Tunisian guest house. Built with Next.js, MongoDB, and featuring a beautiful heritage-inspired design that captures the warmth of traditional Tunisian hospitality.

## 🏛️ Features

### Guest Experience
- **Heritage Design**: Authentic Tunisian color palette with terracotta, sandstone, and earth tones
- **Room Showcase**: Interactive gallery of available rooms with detailed descriptions
- **Smart Booking**: Real-time availability calendar with date validation
- **Cultural Immersion**: Rich content highlighting Tunisian heritage and traditions
- **Responsive Design**: Mobile-first approach ensuring great experience on all devices

### Admin Management
- **Secure Authentication**: JWT-based login system with password hashing
- **Dashboard Overview**: Real-time statistics and recent reservations
- **Reservation Management**: View, confirm, decline, and manage all bookings
- **Room Control**: Update availability, pricing, and room details
- **Calendar View**: Interactive calendar showing all bookings and availability
- **Mobile Admin**: Fully responsive admin interface

## 🚀 Technology Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Backend**: Next.js API Routes, MongoDB
- **Authentication**: JWT tokens with HTTP-only cookies
- **Database**: MongoDB Atlas with native driver
- **Deployment**: Vercel-ready configuration

## 📦 Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd ksar-salakta
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   \`\`\`env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ksar-salakta
   JWT_SECRET=your-super-secret-jwt-key-here
   \`\`\`

4. **Initialize the database**
   Run the seed script to create sample data and admin user:
   \`\`\`bash
   npm run dev
   # Then visit http://localhost:3000/admin/setup to create the admin user
   \`\`\`

5. **Start the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

   Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT token signing | Yes |

### Database Setup

The application uses MongoDB with the following collections:
- `rooms` - Room information and availability
- `reservations` - Guest bookings and status
- `admins` - Admin user accounts

## 👨‍💼 Admin Access

1. **Initial Setup**: Visit `/admin/setup` to create the first admin user
2. **Login**: Access the admin panel at `/admin/login`
3. **Default Credentials** (after running setup):
   - Email: `admin@ksarsalakta.com`
   - Password: `admin123`

### Admin Features
- `/admin/dashboard` - Overview and statistics
- `/admin/reservations` - Manage all bookings
- `/admin/rooms` - Room availability and pricing
- `/admin/calendar` - Calendar view of bookings

## 🏗️ Project Structure

\`\`\`
ksar-salakta/
├── app/
│   ├── admin/           # Admin panel pages
│   ├── api/             # API routes
│   ├── globals.css      # Global styles and theme
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Homepage
├── components/
│   ├── admin/           # Admin-specific components
│   ├── ui/              # shadcn/ui components
│   └── [feature]/       # Feature-specific components
├── lib/
│   ├── mongodb.ts       # Database connection
│   ├── auth.ts          # Authentication utilities
│   └── db-operations.ts # Database operations
├── scripts/
│   └── seed-database.js # Database initialization
└── public/              # Static assets
\`\`\`

## 🔌 API Endpoints

### Public APIs
- `GET /api/rooms` - Get available rooms
- `POST /api/reservations` - Create new reservation
- `GET /api/availability` - Check room availability

### Admin APIs
- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/me` - Get current admin user
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/reservations` - Manage reservations
- `PUT /api/admin/reservations/[id]` - Update reservation status
- `GET /api/admin/rooms` - Manage rooms
- `PUT /api/admin/rooms/[id]` - Update room details

## 🎨 Design System

The application uses a custom Tunisian heritage-inspired design system:

### Color Palette
- **Primary**: Warm terracotta (`#D69A6D`)
- **Secondary**: Muted warm copper (`#A76D45`)
- **Background**: Pure white / Dark sandstone
- **Accent**: Deep earthy brown (`#7D4A2A`)
- **Muted**: Soft sandstone (`#EAE2D7`)

### Typography
- **Headings**: Geist Sans with balanced line breaks
- **Body**: Geist Sans with relaxed line height
- **Monospace**: Geist Mono for code elements

### Environment Setup
Ensure these environment variables are set in your deployment:
- `MONGODB_URI`
- `JWT_SECRET`

## 🛠️ Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Database Operations
- Visit `/admin/test` for database diagnostics
- Use `/admin/setup` for initial admin user creation
- Run `scripts/seed-database.js` for sample data

## 📝 License

This project is built for Ksar Salakta guest house. All rights reserved.

## 🤝 Support

For technical support or questions about the booking system, please contact the development team or visit the admin panel for system diagnostics.

---

**Built with ❤️ for authentic Tunisian hospitality**
