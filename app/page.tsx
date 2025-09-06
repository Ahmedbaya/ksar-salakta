import { HeroSection } from "@/components/hero-section"
import { RoomsSection } from "@/components/rooms-section"
import { AboutSection } from "@/components/about-section"
import { BookingSection } from "@/components/booking-section"
import { ContactSection } from "@/components/contact-section"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <RoomsSection />
      <BookingSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
