'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Star, Verified, TrendingUp, Heart } from 'lucide-react';

interface Testimonial {
  _id: string;
  name: string;
  image: string;
  rating: number;
  category: string;
  text: string;
  location?: string;
  verified?: boolean;
}

export default function TestimonialCarousel() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await apiClient.get(`/api/testimonials`);
        setTestimonials(response.data);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || testimonials.length === 0) return;
    
    const interval = setInterval(() => {
      paginate(1);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const paginate = (newDirection: number) => {
    if (testimonials.length === 0) return;
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let newIndex = prevIndex + newDirection;
      if (newIndex < 0) newIndex = testimonials.length - 1;
      if (newIndex >= testimonials.length) newIndex = 0;
      return newIndex;
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <motion.div
        key={i}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: i * 0.1, type: "spring", stiffness: 500 }}
      >
        <Star 
          className={`w-5 h-5 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
        />
      </motion.div>
    ));
  };

  const getVisibleCards = () => {
    if (testimonials.length === 0) return [];
    const cards = [];
    const numToShow = Math.min(testimonials.length, 3);
    const range = numToShow === 1 ? [0] : numToShow === 2 ? [0, 1] : [-1, 0, 1];

    for (const i of range) {
      let index = currentIndex + i;
      if (index < 0) index = testimonials.length + index;
      if (index >= testimonials.length) index = index - testimonials.length;
      cards.push({
        testimonial: testimonials[index],
        position: i,
        index: index
      });
    }
    return cards;
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.5,
      rotateY: direction > 0 ? 90 : -90,
    }),
    center: (position: number) => ({
      x: position * 420,
      opacity: position === 0 ? 1 : 0.3,
      scale: position === 0 ? 1 : 0.7,
      rotateY: 0,
      zIndex: position === 0 ? 20 : 1,
    }),
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.5,
      rotateY: direction < 0 ? 90 : -90,
    })
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-12 h-12 border-4 border-[#8B1F1F] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full py-12 sm:py-16 lg:py-20 px-4 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 relative overflow-hidden rounded-3xl">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-10 left-10 w-64 h-64 bg-[#8B1F1F]/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute bottom-10 right-10 w-64 h-64 bg-amber-400/5 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#8B1F1F]/10 text-[#8B1F1F] rounded-full font-semibold text-sm mb-4"
          >
            <TrendingUp className="w-4 h-4" />
            Trusted by Thousands
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4 sm:mb-6"
          >
            Reviews from our{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B1F1F] to-amber-600">
              Happy Customers
            </span>
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          >
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
              <span className="text-gray-900 text-xl sm:text-2xl font-black">4.9</span>
              <span className="text-gray-600 text-sm">/ 5.0</span>
            </div>
            <div className="flex gap-1">{renderStars(5)}</div>
            <span className="text-gray-600 text-sm font-medium">Based on 1,200+ reviews</span>
          </motion.div>
        </div>

        {/* Carousel Container */}
        {testimonials.length > 0 ? (
          <div className="relative">
            <div 
              className="flex items-center justify-center min-h-[550px] sm:min-h-[600px] px-4 md:px-24"
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
            >
              <AnimatePresence initial={false} custom={direction}>
                {getVisibleCards().map(({ testimonial, position, index }) => {
                  const isCenter = position === 0;
                  
                  return (
                    <motion.div
                      key={`${index}-${currentIndex}`}
                      custom={position}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.5 },
                        scale: { duration: 0.5 },
                        rotateY: { duration: 0.5 }
                      }}
                      style={{ 
                        perspective: 1000,
                        transformStyle: 'preserve-3d'
                      }}
                      className={`absolute bg-white rounded-3xl p-6 sm:p-8 lg:p-10 w-full max-w-[400px] sm:max-w-[450px] ${
                        isCenter 
                          ? 'shadow-[0_20px_80px_rgba(139,31,31,0.25)] ring-2 ring-[#8B1F1F]/20' 
                          : 'pointer-events-none shadow-lg'
                      }`}
                    >
                      {/* Decorative Elements */}
                      <motion.div
                        initial={{ rotate: 0, scale: 1 }}
                        animate={{ 
                          rotate: isCenter ? [0, 10, -10, 0] : 0,
                          scale: isCenter ? [1, 1.05, 1] : 0.8
                        }}
                        transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                        className="absolute -top-4 -right-4 bg-gradient-to-br from-[#8B1F1F] to-[#6B1515] p-4 rounded-full shadow-xl"
                      >
                        <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                      </motion.div>

                      {/* Heart Badge */}
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        className="absolute -top-3 -left-3 bg-gradient-to-br from-pink-500 to-red-500 p-3 rounded-full shadow-lg cursor-pointer"
                      >
                        <Heart className="w-5 h-5 text-white fill-white" />
                      </motion.div>

                      {/* Category Badge */}
                      <div className="mb-6">
                        <motion.span
                          className="inline-flex items-center gap-2 text-xs font-bold text-[#8B1F1F] uppercase tracking-widest bg-[#8B1F1F]/10 px-4 py-2 rounded-full"
                          animate={isCenter ? { scale: [1, 1.05, 1] } : {}}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                        >
                          <Star className="w-3 h-3 fill-[#8B1F1F]" />
                          {testimonial.category}
                        </motion.span>
                      </div>

                      {/* Review Text */}
                      <p className="text-gray-700 text-base sm:text-lg leading-relaxed min-h-[160px] sm:min-h-[180px] font-medium mb-6">
                        "{testimonial.text}"
                      </p>

                      {/* Divider */}
                      <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t-2 border-gray-100"></div>
                        </div>
                        <div className="relative flex justify-center">
                          <div className="bg-white px-4">
                            <div className="flex gap-1">{renderStars(testimonial.rating)}</div>
                          </div>
                        </div>
                      </div>

                      {/* User Info */}
                      <div className="flex items-center gap-4">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className="relative flex-shrink-0"
                        >
                          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden ring-4 ring-white shadow-lg">
                            <img
                              src={testimonial.image}
                              alt={testimonial.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.currentTarget;
                                if (target.src !== '/placeholder-user.jpg') {
                                  target.src = '/placeholder-user.jpg';
                                }
                              }}
                            />
                          </div>
                          {testimonial.verified && (
                            <motion.div
                              className="absolute -bottom-1 -right-1 bg-gradient-to-br from-blue-500 to-blue-600 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center shadow-lg"
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <Verified className="w-3 h-3 text-white" />
                            </motion.div>
                          )}
                        </motion.div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-gray-900 text-base sm:text-lg truncate">
                              {testimonial.name}
                            </h4>
                            {testimonial.verified && (
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                                Verified
                              </span>
                            )}
                          </div>
                          {testimonial.location && (
                            <p className="text-gray-500 text-xs sm:text-sm mt-1 truncate">
                              📍 {testimonial.location}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-[#8B1F1F]/5 rounded-3xl pointer-events-none" />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <motion.button
              whileHover={{ scale: 1.1, x: -5, backgroundColor: '#8B1F1F' }}
              whileTap={{ scale: 0.9 }}
              onClick={() => paginate(-1)}
              className="absolute left-2 sm:left-4 lg:left-8 top-1/2 -translate-y-1/2 bg-white hover:text-white p-3 sm:p-4 rounded-full shadow-2xl transition-all duration-300 z-30 ring-2 ring-white/50 group"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-[#8B1F1F] group-hover:text-white transition-colors" strokeWidth={2.5} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1, x: 5, backgroundColor: '#8B1F1F' }}
              whileTap={{ scale: 0.9 }}
              onClick={() => paginate(1)}
              className="absolute right-2 sm:right-4 lg:right-8 top-1/2 -translate-y-1/2 bg-white hover:text-white p-3 sm:p-4 rounded-full shadow-2xl transition-all duration-300 z-30 ring-2 ring-white/50 group"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-[#8B1F1F] group-hover:text-white transition-colors" strokeWidth={2.5} />
            </motion.button>
          </div>
        ) : (
          <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl">
            <p className="text-gray-500">No testimonials found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
