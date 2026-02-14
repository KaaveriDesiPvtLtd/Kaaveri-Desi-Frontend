import { Button } from "@/components/ui/button"
import ProductCarausal from '../app/Component/SectionComponents/ProductCoarausal/page'

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-b from-muted to-background py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground leading-tight">
              Welcome to The Milk Shop — Your Dairy Destination
            </h1>
            <p className="text-lg text-muted-foreground">
              Experience the finest dairy products crafted with care and tradition.
            </p>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-8 py-3">
              Shop Now
            </Button>
          </div>

          {/* Right Image */}
          <div className="relative h-96 md:h-full">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hero.JPG-SO5neqzVjl3aNJqFPGuCIZzuNLRuXl.jpeg"
              alt="Fresh milk bottle with dairy products"
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
