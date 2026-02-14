'use client';

import Navbar from '@/components/navbar';
import TestimonialCarousel from '@/components/testimonial-carousel';

export default function TestimonialsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-8">
        <TestimonialCarousel />
      </main>
    </div>
  );
}
