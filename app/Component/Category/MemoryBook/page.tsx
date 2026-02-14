'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Heart, BookOpen, Gift } from 'lucide-react';

interface MemoryBook {
  id: string;
  title: string;
  price: string;
  description: string;
  image: string;
  image2: string;
}

const memoryBooks: MemoryBook[] = [
  {
    id: 'mb1',
    title: 'Vintage Love Story',
    price: '899',
    description: 'Capture your beautiful moments in this elegant vintage-style memory book with premium paper quality',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2.JPG-0armChhKLJsiMd0Ulzuy1i1DS5sIa8.jpeg',
    image2: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2.JPG-0armChhKLJsiMd0Ulzuy1i1DS5sIa8.jpeg',
  },
  {
    id: 'mb2',
    title: 'Adventure Chronicles',
    price: '1099',
    description: 'Document your travel adventures with this rugged and durable memory book featuring waterproof pages',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2.JPG-0armChhKLJsiMd0Ulzuy1i1DS5sIa8.jpeg',
    image2: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2.JPG-0armChhKLJsiMd0Ulzuy1i1DS5sIa8.jpeg',
  },
  {
    id: 'mb3',
    title: 'Baby Milestones',
    price: '799',
    description: 'Preserve precious baby moments with themed sections for first words, steps, and memorable milestones',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2.JPG-0armChhKLJsiMd0Ulzuy1i1DS5sIa8.jpeg',
    image2: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2.JPG-0armChhKLJsiMd0Ulzuy1i1DS5sIa8.jpeg',
  },
  {
    id: 'mb4',
    title: 'Wedding Memories',
    price: '1299',
    description: 'Luxurious wedding memory book with gold foil accents and silk ribbon bookmark',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2.JPG-0armChhKLJsiMd0Ulzuy1i1DS5sIa8.jpeg',
    image2: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2.JPG-0armChhKLJsiMd0Ulzuy1i1DS5sIa8.jpeg',
  },
  {
    id: 'mb5',
    title: 'Friendship Forever',
    price: '699',
    description: 'Celebrate your friendships with this colorful and fun memory book perfect for group photos',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2.JPG-0armChhKLJsiMd0Ulzuy1i1DS5sIa8.jpeg',
    image2: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2.JPG-0armChhKLJsiMd0Ulzuy1i1DS5sIa8.jpeg',
  },
];

export default function MemoryBooksPage() {
  const router = useRouter();

  const gotoParticularProduct = (book: MemoryBook) => {
    const query = new URLSearchParams({
      id: book.id,
      image: book.image,
      image2: book.image2,
      title: book.title,
      price: book.price,
      description: book.description,
    }).toString();

    router.push(`/Component/ParticularProduct2?${query}`);
  };

  return (
    <div className="min-h-screen bg-[#e8e4df]">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#d4cfc7] to-[#e8e4df] py-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Preserve Your
                <span className="block text-gray-700">Precious Moments</span>
              </h1>
              
              <p className="text-lg text-gray-600 leading-relaxed">
                Create timeless memories with our handcrafted memory books. 
                Each page tells a story, each moment becomes eternal.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <button className="bg-gray-900 text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl">
                  Explore Collection
                </button>
                
              </div>

              {/* Features */}
             
            </div>

            {/* Right Image */}
            <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2.JPG-0armChhKLJsiMd0Ulzuy1i1DS5sIa8.jpeg"
                alt="Memory Books Hero"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-white/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-white/20 rounded-full blur-3xl"></div>
      </section>

      {/* Products Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Collection</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our range of beautifully crafted memory books designed for every special occasion
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {memoryBooks.map((book) => (
              <div
                key={book.id}
                onClick={() => gotoParticularProduct(book)}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer group"
              >
                {/* Image Container */}
                <div className="relative h-80 overflow-hidden bg-gray-100">
                  <Image
                    src={book.image}
                    alt={book.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>

                {/* Content Section */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                    {book.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {book.description}
                  </p>

                  {/* Price and Button */}
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">
                      ₹{book.price}
                    </span>
                    <button className="bg-gray-900 text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors duration-200">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
