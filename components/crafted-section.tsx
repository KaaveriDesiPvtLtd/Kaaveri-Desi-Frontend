export default function CraftedSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">Our Commitment to Excellence</h2>
          <p className="text-muted-foreground mt-4">Dedicated to bringing you the finest dairy products</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <img
                src={`/dairy-product-.jpg?height=300&width=400&query=dairy product ${item}`}
                alt={`Dairy product ${item}`}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-lg font-serif font-bold text-foreground">Premium Quality</h3>
                <p className="text-muted-foreground text-sm mt-2">
                  Crafted with the finest ingredients and traditional methods.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
