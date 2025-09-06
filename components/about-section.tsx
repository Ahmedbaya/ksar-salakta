import { Card, CardContent } from "@/components/ui/card"
import { Star, MapPin, Users, Calendar } from "lucide-react"

export function AboutSection() {
  const features = [
    {
      icon: Star,
      title: "Authentic Heritage",
      description:
        "Experience traditional Tunisian architecture and cultural immersion in our carefully preserved guest house.",
    },
    {
      icon: MapPin,
      title: "Prime Location",
      description:
        "Strategically located to explore Tunisia's rich history, from ancient ruins to vibrant local markets.",
    },
    {
      icon: Users,
      title: "Warm Hospitality",
      description: "Our dedicated team ensures every guest feels the genuine warmth of Tunisian hospitality.",
    },
    {
      icon: Calendar,
      title: "Year-Round Comfort",
      description: "Modern amenities seamlessly integrated with traditional design for comfort in every season.",
    },
  ]

  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
            A Journey Through <span className="text-primary">Tunisian Heritage</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            Ksar Salakta is more than a guest house—it's a gateway to Tunisia's soul. Our traditional architecture, warm
            hospitality, and authentic experiences create memories that last a lifetime.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="text-center border-border/50 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-pretty">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-bold mb-6">Our Story</h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Built in the traditional ksar style, our guest house has been lovingly restored to preserve its authentic
              character while providing modern comfort. Each room tells a story of Tunisia's rich cultural tapestry.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              From the intricate geometric patterns adorning our walls to the peaceful courtyard where guests gather for
              traditional mint tea, every detail reflects our commitment to authentic Tunisian hospitality.
            </p>
          </div>
          <div className="relative h-96 rounded-lg overflow-hidden">
            <img
              src="/placeholder-oy336.png"
              alt="Traditional Tunisian Courtyard"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
