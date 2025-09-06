import { MapPin, Phone, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-primary mb-4">Ksar Salakta</h3>
            <p className="text-background/80 mb-4 text-pretty">
              Experience authentic Tunisian hospitality in our traditional guest house, where heritage meets comfort in
              the heart of Tunisia's cultural landscape.
            </p>
            <div className="flex items-center gap-2 text-background/80">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">Salakta, Mahdia, Tunisia</span>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-background/80">
              <li>
                <a href="#home" className="hover:text-primary transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-primary transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#rooms" className="hover:text-primary transition-colors">
                  Rooms
                </a>
              </li>
              <li>
                <a href="#booking" className="hover:text-primary transition-colors">
                  Booking
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-primary transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3 text-background/80">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span className="text-sm">+216 73 XXX XXX</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span className="text-sm">info@ksarsalakta.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 mt-8 pt-8 text-center text-background/60">
          <p>&copy; 2024 Ksar Salakta. All rights reserved. Built with authentic Tunisian hospitality.</p>
        </div>
      </div>
    </footer>
  )
}
