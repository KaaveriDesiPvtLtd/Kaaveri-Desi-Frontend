'use client'
import React, { useState, useEffect } from 'react'
import { Leaf, Heart, Award, Package, ChevronDown, Sparkles, Star } from 'lucide-react'
import Navbar from "../../../components/navbar"

function AboutPage() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-amber-50">
        {/* Hero Section with Parallax Effect */}
        <div className="relative bg-gradient-to-r from-red-900 via-red-950 to-red-900 text-amber-50 py-32 overflow-hidden">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 border-4 border-amber-200 rounded-full animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-40 h-40 border-4 border-amber-200 rounded-full animate-pulse delay-75"></div>
            <div className="absolute top-1/2 left-1/3 w-24 h-24 border-4 border-amber-200 rounded-full animate-pulse delay-150"></div>
          </div>

          <div
            className="container mx-auto px-4 relative z-10"
            style={{ transform: `translateY(${scrollY * 0.3}px)` }}
          >
            {/* Decorative Badge */}
            <div className="flex justify-center mb-6">
              <div className="bg-amber-200 text-red-900 px-6 py-2 rounded-full font-bold text-sm flex items-center gap-2 animate-bounce">
                <Sparkles className="w-4 h-4" />
                Tradition Since Generations
                <Sparkles className="w-4 h-4" />
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-center mb-6 animate-fade-in">
              About <span className="text-amber-200">Kaaveri Desi</span>
            </h1>
            <p className="text-2xl text-amber-100 text-center max-w-3xl mx-auto mb-8 animate-fade-in-delay">
              Where Tradition Becomes Taste
            </p>

            {/* Hindi Text */}
            <p className="text-xl text-amber-200 text-center font-semibold animate-fade-in-delay-2">
              परंपरा का स्वाद • Authentic • Natural • Pure
            </p>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-8 h-8 text-amber-200" />
          </div>
        </div>

        {/* Stats Section */}
        <div className="container mx-auto px-4 -mt-16 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-8 text-center transform hover:scale-105 transition-transform duration-300 border-t-4 border-red-900">
              <div className="text-5xl font-bold text-red-900 mb-2">100%</div>
              <div className="text-gray-600 font-semibold">Pure & Natural</div>
            </div>
            <div className="bg-white rounded-2xl shadow-2xl p-8 text-center transform hover:scale-105 transition-transform duration-300 border-t-4 border-amber-500">
              <div className="text-5xl font-bold text-red-900 mb-2">3+</div>
              <div className="text-gray-600 font-semibold">Authentic Products</div>
            </div>
            <div className="bg-white rounded-2xl shadow-2xl p-8 text-center transform hover:scale-105 transition-transform duration-300 border-t-4 border-red-900">
              <div className="text-5xl font-bold text-red-900 mb-2">1000+</div>
              <div className="text-gray-600 font-semibold">Happy Families</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-20">
          {/* Introduction with Image */}
          <div className="max-w-6xl mx-auto mb-20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="inline-block bg-red-100 text-red-900 px-4 py-2 rounded-full text-sm font-bold mb-4">
                  Our Story
                </div>
                <h2 className="text-4xl font-bold text-red-900 mb-6">Rooted in Heritage</h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  We are a homegrown brand rooted in India's rich culinary heritage, dedicated to bringing you pure, authentic, and traditionally prepared ghee, jaggery, and achar (pickles). Every product we offer is a reflection of age-old wisdom, honest ingredients, and the love of homemade goodness.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  At Kaaveri Desi, we believe food is not just nourishment—it is culture, memory, and emotion passed down through generations. Our mission is to revive traditional methods of preparation and deliver flavours that remind you of home, festivals, and family kitchens.
                </p>

                {/* Decorative Quote */}
                <div className="mt-8 pl-6 border-l-4 border-red-900">
                  <p className="text-xl text-red-900 italic font-semibold">
                    "Food made the right way heals, nourishes, and connects."
                  </p>
                </div>
              </div>

              <div className="order-1 md:order-2">
                <div className="relative">
                  {/* Decorative Frame */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-red-900 to-amber-500 rounded-3xl opacity-20 blur-xl"></div>
                  <div className="relative bg-gradient-to-br from-amber-100 to-red-100 rounded-3xl p-12 shadow-2xl">
                    <div className="text-center">
                      <div className="text-8xl mb-4">🏺</div>
                      <h3 className="text-2xl font-bold text-red-900 mb-2">Traditional Craftsmanship</h3>
                      <p className="text-gray-700">Made with patience, love & respect</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Core Values with Hover Effects */}
          <div className="max-w-6xl mx-auto mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-red-900 mb-4">Our Core Values</h2>
              <p className="text-lg text-gray-600">What makes us different</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="group bg-white rounded-2xl shadow-lg p-8 border-t-4 border-red-900 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
                <div className="bg-gradient-to-br from-amber-100 to-amber-200 w-20 h-20 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Leaf className="w-10 h-10 text-red-900" />
                </div>
                <h3 className="text-xl font-bold text-red-900 text-center mb-3">Pure Ingredients</h3>
                <p className="text-gray-600 text-center">No compromise on quality and authenticity</p>
                <div className="mt-4 flex justify-center">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
                  ))}
                </div>
              </div>

              <div className="group bg-white rounded-2xl shadow-lg p-8 border-t-4 border-amber-500 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
                <div className="bg-gradient-to-br from-red-100 to-red-200 w-20 h-20 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Heart className="w-10 h-10 text-red-900" />
                </div>
                <h3 className="text-xl font-bold text-red-900 text-center mb-3">Traditional Methods</h3>
                <p className="text-gray-600 text-center">Age-old techniques passed through generations</p>
                <div className="mt-4 flex justify-center">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
                  ))}
                </div>
              </div>

              <div className="group bg-white rounded-2xl shadow-lg p-8 border-t-4 border-red-900 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
                <div className="bg-gradient-to-br from-amber-100 to-amber-200 w-20 h-20 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Award className="w-10 h-10 text-red-900" />
                </div>
                <h3 className="text-xl font-bold text-red-900 text-center mb-3">Authentic Taste</h3>
                <p className="text-gray-600 text-center">Rooted in heritage and cultural wisdom</p>
                <div className="mt-4 flex justify-center">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
                  ))}
                </div>
              </div>

              <div className="group bg-white rounded-2xl shadow-lg p-8 border-t-4 border-amber-500 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
                <div className="bg-gradient-to-br from-red-100 to-red-200 w-20 h-20 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Package className="w-10 h-10 text-red-900" />
                </div>
                <h3 className="text-xl font-bold text-red-900 text-center mb-3">Fresh Packaging</h3>
                <p className="text-gray-600 text-center">Carefully packed to preserve freshness</p>
                <div className="mt-4 flex justify-center">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tradition Section with Enhanced Design */}
          <div className="max-w-6xl mx-auto mb-20">
            <div className="relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-900 via-red-950 to-red-900 rounded-3xl"></div>
              <div className="absolute inset-0 opacity-5" style={{
                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)'
              }}></div>

              <div className="relative z-10 p-12 md:p-16 text-amber-50">
                <div className="text-center mb-8">
                  <div className="inline-block bg-amber-200 text-red-900 px-6 py-2 rounded-full font-bold mb-6">
                    Our Philosophy
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold mb-6">Where Tradition Becomes Taste</h2>
                </div>

                <div className="max-w-4xl mx-auto space-y-6">
                  <p className="text-lg text-amber-100 leading-relaxed text-center">
                    At Kaaveri Desi, we craft purity into flavour and heritage into every bite. From slow-churned desi ghee made using traditional techniques, to naturally prepared jaggery and handcrafted pickles bursting with authentic spices, each product is made with care, patience, and respect for tradition.
                  </p>
                  <p className="text-lg text-amber-100 leading-relaxed text-center">
                    We do not rush the process—because true taste takes time. Our recipes are inspired by regional kitchens, traditional practices, and the belief that food made the right way heals, nourishes, and connects.
                  </p>
                </div>

                {/* Timeline */}
                <div className="mt-12 grid md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="bg-amber-200 text-red-900 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
                    <h4 className="font-bold text-lg mb-2">Select</h4>
                    <p className="text-amber-200 text-sm">Premium quality ingredients</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-amber-200 text-red-900 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
                    <h4 className="font-bold text-lg mb-2">Prepare</h4>
                    <p className="text-amber-200 text-sm">Traditional methods with patience</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-amber-200 text-red-900 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
                    <h4 className="font-bold text-lg mb-2">Deliver</h4>
                    <p className="text-amber-200 text-sm">Authentic taste to your home</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Why Choose Us with Better Layout */}
          <div className="max-w-6xl mx-auto mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-red-900 mb-4">Why Choose Kaaveri Desi?</h2>
              <p className="text-xl text-gray-700 leading-relaxed">
                Because food is more than consumption—it is a <span className="text-red-900 font-bold">legacy</span>
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-amber-50 to-white rounded-2xl p-8 shadow-lg border-l-4 border-red-900">
                <ul className="space-y-6">
                  <li className="flex items-start gap-4 group">
                    <div className="bg-red-900 text-amber-50 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      ✓
                    </div>
                    <div>
                      <h4 className="font-bold text-red-900 text-lg mb-1">Age-old Techniques</h4>
                      <p className="text-gray-600">Made using traditional methods that have been perfected over generations</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4 group">
                    <div className="bg-red-900 text-amber-50 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      ✓
                    </div>
                    <div>
                      <h4 className="font-bold text-red-900 text-lg mb-1">No Additives</h4>
                      <p className="text-gray-600">Free from unnecessary preservatives and artificial ingredients</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-white rounded-2xl p-8 shadow-lg border-l-4 border-amber-500">
                <ul className="space-y-6">
                  <li className="flex items-start gap-4 group">
                    <div className="bg-amber-500 text-white w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      ✓
                    </div>
                    <div>
                      <h4 className="font-bold text-red-900 text-lg mb-1">Small Batch Quality</h4>
                      <p className="text-gray-600">Prepared in small batches to ensure premium quality and freshness</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4 group">
                    <div className="bg-amber-500 text-white w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      ✓
                    </div>
                    <div>
                      <h4 className="font-bold text-red-900 text-lg mb-1">Kitchen Inspired</h4>
                      <p className="text-gray-600">Inspired by traditional Indian kitchens and authentic recipes</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Products We Specialize In with Enhanced Design */}
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              {/* Header Section */}
              <div className="bg-gradient-to-r from-red-900 to-red-950 text-amber-50 p-12 text-center">
                <h2 className="text-4xl font-bold mb-4">We Specialize In</h2>
                <p className="text-amber-200 text-lg">Three authentic products, infinite traditions</p>
              </div>

              {/* Products Grid */}
              <div className="grid md:grid-cols-3 divide-x divide-gray-200">
                <div className="p-10 text-center group hover:bg-amber-50 transition-colors duration-300">
                  <div className="bg-gradient-to-br from-red-900 to-red-950 text-amber-50 text-4xl font-bold w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-xl">
                    घी
                  </div>
                  <h3 className="text-2xl font-bold text-red-900 mb-3">Pure Desi Ghee</h3>
                  <p className="text-gray-600 mb-4">Slow-churned using traditional methods</p>
                  <div className="inline-block bg-red-100 text-red-900 px-4 py-2 rounded-full text-sm font-semibold">
                    100% Natural
                  </div>
                </div>

                <div className="p-10 text-center group hover:bg-amber-50 transition-colors duration-300">
                  <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white text-4xl font-bold w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-xl">
                    दूध
                  </div>
                  <h3 className="text-2xl font-bold text-red-900 mb-3">Fresh Desi Milk</h3>
                  <p className="text-gray-600 mb-4">Pure, farm-fresh milk for your daily needs</p>
                  <div className="inline-block bg-amber-100 text-amber-900 px-4 py-2 rounded-full text-sm font-semibold">
                    Daily Fresh
                  </div>
                </div>


                <div className="p-10 text-center group hover:bg-amber-50 transition-colors duration-300">
                  <div className="bg-gradient-to-br from-red-900 to-red-950 text-amber-50 text-4xl font-bold w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-xl">
                    गुड़
                  </div>
                  <h3 className="text-2xl font-bold text-red-900 mb-3">Natural Jaggery</h3>
                  <p className="text-gray-600 mb-4">Naturally prepared with no additives</p>
                  <div className="inline-block bg-red-100 text-red-900 px-4 py-2 rounded-full text-sm font-semibold">
                    Chemical-Free
                  </div>
                </div>
              </div>

              {/* Footer Quote */}
              <div className="bg-gradient-to-r from-amber-50 to-red-50 p-10 text-center border-t-4 border-red-900">
                <p className="text-2xl text-red-900 font-bold italic mb-2">
                  Crafted with love. Rooted in tradition.
                </p>
                <p className="text-xl text-gray-700">
                  Made for your home.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="max-w-4xl mx-auto mt-20 text-center">
            <div className="bg-gradient-to-r from-red-900 to-red-950 rounded-3xl p-12 shadow-2xl">
              <h2 className="text-3xl font-bold text-amber-50 mb-4">Experience Authentic Taste Today</h2>
              <p className="text-amber-200 mb-8 text-lg">Join thousands of families who trust Kaaveri Desi for pure, traditional products</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/products"
                  className="bg-amber-200 hover:bg-amber-300 text-red-900 font-bold px-8 py-4 rounded-full transition-all transform hover:scale-105 shadow-lg"
                >
                  Shop Now
                </a>
                <a
                  href="https://wa.me/919289148411"
                  className="bg-white hover:bg-amber-50 text-red-900 font-bold px-8 py-4 rounded-full transition-all transform hover:scale-105 shadow-lg"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        .animate-fade-in-delay {
          animation: fade-in 0.8s ease-out 0.2s both;
        }
        .animate-fade-in-delay-2 {
          animation: fade-in 0.8s ease-out 0.4s both;
        }
        .delay-75 {
          animation-delay: 0.75s;
        }
        .delay-150 {
          animation-delay: 1.5s;
        }
      `}</style>
    </div>
  )
}

export default AboutPage
