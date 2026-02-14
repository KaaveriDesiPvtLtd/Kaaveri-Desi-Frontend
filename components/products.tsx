import { Button } from "@/components/ui/button"

export default function Products() {
  return (
    <section className="py-16 md:py-24 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">Crafted with Care</h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Experience the essence of dairy. Our dairy products are carefully crafted using time-honored techniques and
            the finest ingredients.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
          <div className="bg-card rounded-lg overflow-hidden shadow-md">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3.JPG-WdjVwZ32qbEsUQNE9VeIf3IhZdM678.jpeg"
              alt="Premium dairy jar"
              className="w-full h-96 object-cover"
            />
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-serif font-bold text-foreground">Premium Quality Guaranteed</h3>
            <p className="text-muted-foreground leading-relaxed">
              Every product is made with the highest standards of quality and care. We source only the finest
              ingredients to ensure your satisfaction.
            </p>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-8 py-3">
              Explore More
            </Button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-card rounded-lg overflow-hidden shadow-md">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3.JPG-WdjVwZ32qbEsUQNE9VeIf3IhZdM678.jpeg"
              alt="Dairy collection"
              className="w-full h-64 object-cover"
            />
          </div>
          <div className="bg-card rounded-lg overflow-hidden shadow-md">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3.JPG-WdjVwZ32qbEsUQNE9VeIf3IhZdM678.jpeg"
              alt="Premium jar"
              className="w-full h-64 object-cover"
            />
          </div>
        </div>

        <div className="text-center mt-12">
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-8 py-3">
            Shop the Collection
          </Button>
        </div>
      </div>
    </section>
  )
}
