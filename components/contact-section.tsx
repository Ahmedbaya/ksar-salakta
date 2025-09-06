import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export function ContactSection() {
  const contactInfo = [
    {
      icon: MapPin,
      title: "Location",
      details: ["Salakta, Mahdia Governorate", "Tunisia, North Africa"],
    },
    {
      icon: Phone,
      title: "Phone",
      details: ["+216 73 XXX XXX", "+216 XX XXX XXX"],
    },
    {
      icon: Mail,
      title: "Email",
      details: ["info@ksarsalakta.com", "reservations@ksarsalakta.com"],
    },
    {
      icon: Clock,
      title: "Reception Hours",
      details: ["24/7 Available", "Check-in: 2:00 PM", "Check-out: 11:00 AM"],
    },
  ]

  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
            Get in <span className="text-primary">Touch</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            Have questions about your stay or need assistance with your booking? Our friendly team is here to help make
            your Tunisian experience unforgettable.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {contactInfo.map((info, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <info.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{info.title}</h3>
                <div className="space-y-1">
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-muted-foreground text-sm">
                      {detail}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16">
          <Card>
            <CardContent className="p-0">
              <div className="relative h-96 rounded-lg overflow-hidden">
                <img
                  src="/map-of-salakta-tunisia-with-traditional-architectu.jpg"
                  alt="Ksar Salakta Location Map"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Find Us in Salakta</h3>
                  <p className="text-white/90">
                    Located in the historic town of Salakta, perfectly positioned to explore Tunisia's coastal beauty
                    and cultural treasures.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
