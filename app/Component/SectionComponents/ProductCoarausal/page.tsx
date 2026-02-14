'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface GiftCategory {
  id: number;
  title: string;
  image: string;
  route: string;
}

// import "../../../Component/Category/MemoryBook"

const giftCategories: GiftCategory[] = [
  { id: 1, title: 'Memory Books', image: '/dairy-product-.jpg', route: '/Component/Category/MemoryBook' },
  { id: 2, title: 'Creative Letters', image: '/dairy-product-.jpg', route: '/Component/Category/CreativeLetter' },
  { id: 3, title: 'Match Box', image: '/images/match-box.jpg', route: '/Component/Category/MatchBox/page' },
  { id: 4, title: 'Cards', image: '/images/cards.jpg', route: '/Component/Category/Cards/page' },
  { id: 5, title: 'Forever Flowers', image: '/images/forever-flowers.jpg', route: '/Component/Category/ForeverFlowers/page' },
  { id: 6, title: 'Pun Bouquets', image: '/images/pun-bouquets.jpg', route: '/Component/Category/PunBouquets/page' },
  { id: 7, title: 'Hampers', image: '/images/hampers.jpg', route: '/Component/Category/Hampers/page' },
  { id: 8, title: 'One of a Kind', image: '/images/one-of-a-kind.jpg', route: '/Component/Category/OneOfAKind/page' },
];

const GiftCategories: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const newScrollPosition =
        direction === 'left'
          ? scrollContainerRef.current.scrollLeft - scrollAmount
          : scrollContainerRef.current.scrollLeft + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth',
      });
    }
  };

  const handleCategoryClick = (route: string) => {
    router.push(route);
  };

  return (
    <div className="w-full py-12 px-4 bg-[#e8e4df]">
      <div className="max-w-7xl mx-auto relative">
        {/* Previous Button */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
          aria-label="Previous"
        >
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-8 overflow-x-auto scrollbar-hide pb-4 scroll-smooth px-12"
        >
          {giftCategories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.route)}
              className="flex flex-col items-center gap-4 min-w-fit cursor-pointer group"
            >
              {/* Circular Image Container - Seamless blend */}
              <div className="relative w-36 h-36 rounded-full overflow-hidden transition-transform duration-300 group-hover:scale-105">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  className="object-cover"
                  sizes="144px"
                />
              </div>

              {/* Category Title */}
              <h3 className="text-base font-normal text-gray-900 text-center max-w-[140px] leading-tight">
                {category.title}
              </h3>
            </div>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
          aria-label="Next"
        >
          <ChevronRight className="w-6 h-6 text-gray-800" />
        </button>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default GiftCategories;
