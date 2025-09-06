"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"

export function HeroSection() {
  const scrollToBooking = () => {
    const element = document.getElementById("booking")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image src="/placeholder-bww0r.png" alt="Ksar Salakta Guest House" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance">
          Welcome to <span className="text-primary">Ksar Salakta</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-pretty leading-relaxed">
          Experience authentic Tunisian hospitality in our traditional guest house, where heritage meets comfort in the
          heart of Tunisia's cultural landscape.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="text-lg px-8 py-6" onClick={scrollToBooking}>
            Book Your Stay
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="text-lg px-8 py-6 bg-white/10 border-white/30 text-white hover:bg-white/20"
            onClick={() => {
              const element = document.getElementById("about")
              if (element) {
                element.scrollIntoView({ behavior: "smooth" })
              }
            }}
          >
            Discover Our Story
          </Button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  )
}
