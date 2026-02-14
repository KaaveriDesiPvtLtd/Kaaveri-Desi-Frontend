'use client'


import { useRouter } from 'next/navigation';

// import "../app/Component/ParticularProduct2"

export default function Features() {

  const router = useRouter();

const gotoParticularProduct = () => {
  const query = new URLSearchParams({
    id: 'p1',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2.JPG-0armChhKLJsiMd0Ulzuy1i1DS5sIa8.jpeg',
    image2: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2.JPG-0armChhKLJsiMd0Ulzuy1i1DS5sIa8.jpeg',
    title: 'Artisanal',
    price: '1',
    description: 'Premium artisanal dairy products'
  }).toString();
  
  router.push(`/Component/ParticularProduct2?${query}`);
};




const gotoParticularProductp2 = () => {
  const query = new URLSearchParams({
    id: 'p2',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2.JPG-0armChhKLJsiMd0Ulzuy1i1DS5sIa8.jpeg',
    image2: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2.JPG-0armChhKLJsiMd0Ulzuy1i1DS5sIa8.jpeg',
    title: 'Artisanal2',
    price: '2',
    description: 'Premium artisanal dairy products2'
  }).toString();
  
  router.push(`/Component/ParticularProduct2?${query}`);
};


  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-primary uppercase tracking-wide">Discover Our Dairy Delights</p>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mt-2">Indulge in Dairy</h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Savor the freshness. Explore our wide range of premium dairy products, including creamy milk, rich yogurt,
            and delicious cheese.
          </p>
        </div>

        {/* Product Categories */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div onClick={() => { gotoParticularProduct() }} className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2.JPG-0armChhKLJsiMd0Ulzuy1i1DS5sIa8.jpeg"
              alt="Artisanal dairy products"
              className="w-full h-64 object-cover"
            />
            <div className="p-6 text-center">
              <h3 className="text-xl font-serif font-bold text-foreground">Artisanal</h3>
            </div>
          </div>

          <div onClick={() => { gotoParticularProductp2() }} className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2.JPG-0armChhKLJsiMd0Ulzuy1i1DS5sIa8.jpeg"
              alt="Dairy delights collection"
              className="w-full h-64 object-cover"
            />
            <div className="p-6 text-center">
              <h3 className="text-xl font-serif font-bold text-foreground">Dairy Delights</h3>
            </div>
          </div>
        </div>

        {/* Color Palette */}
        <div className="flex justify-center gap-8 flex-wrap">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 mx-auto mb-2 border-2 border-primary"></div>
            <p className="text-sm font-medium text-foreground">Nourishing</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary mx-auto mb-2 border-2 border-primary"></div>
            <p className="text-sm font-medium text-foreground">Nature's</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-accent mx-auto mb-2 border-2 border-accent"></div>
            <p className="text-sm font-medium text-foreground">Dairy</p>
          </div>
        </div>
      </div>
    </section>
  )
}
