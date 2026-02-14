'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import TestimonialCarousel from "@/components/testimonial-carousel"
import Navbar from "@/components/navbar"
import apiClient from '@/lib/api'
import { useEffect, useState, useRef } from 'react'
import {
  Sparkles,
  Award,
  Truck,
  Shield,
  Star,
  ArrowRight,
  Play,
  ChevronDown,
  Heart,
  ShoppingCart,
  Leaf,
  Zap,
  Check,
  CheckCircle2,
  AlertCircle,
  X
} from 'lucide-react'

// Toast Notification Component
const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      className={`fixed top-20 right-4 z-50 ${type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 max-w-md`}
    >
      {type === 'success' ? (
        <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
      ) : (
        <AlertCircle className="w-6 h-6 flex-shrink-0" />
      )}
      <span className="font-medium text-sm sm:text-base">{message}</span>
      <button onClick={onClose} className="ml-2">
        <X className="w-5 h-5 hover:scale-110 transition-transform" />
      </button>
    </motion.div>
  )
}

export default function DairyPage() {
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [activeVideo, setActiveVideo] = useState<string | null>(null)
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [loadingWishlist, setLoadingWishlist] = useState<string | null>(null)
  const [loadingCart, setLoadingCart] = useState<string | null>(null)
  const heroRef = useRef<HTMLDivElement>(null)

  // Advanced scroll animations
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  // Parallax effects
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const [products, setProducts] = useState<any[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true)
        const response = await apiClient.get(`/allproducts`)
        const data = response.data
        if (data.success) {
          setProducts(data.products)
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoadingProducts(false)
      }
    }

    fetchProducts()
  }, [])

  // Show toast notification
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
  }

  // Add to Wishlist Handler
  const handleAddToWishlist = async (product: any) => {
    try {
      setLoadingWishlist(product.id)

      const userString = localStorage.getItem('user')
      if (!userString) {
        showToast('Please login first to add items to wishlist', 'error')
        setTimeout(() => router.push('/Component/Auth/SignIn'), 1500)
        return
      }

      const user = JSON.parse(userString)

      const response = await apiClient.post(`/addtowishlist`, {
        userId: user._id,
        productId: product.id,
        image: product.image,
        title: product.name,
        price: product.price,
      })

      const data = response.data

      if (response.status !== 200) {
        throw new Error(data.message || 'Failed to add to wishlist')
      }

      if (data.success) {
        showToast(`${product.name} added to wishlist! 💝`, 'success')
      }
    } catch (error: any) {
      showToast(error.message || 'Failed to add to wishlist', 'error')
    } finally {
      setLoadingWishlist(null)
    }
  }

  // Add to Cart Handler
  const handleAddToCart = async (product: any) => {
    try {
      setLoadingCart(product.id)

      const userString = localStorage.getItem('user')
      if (!userString) {
        showToast('Please login first to add items to cart', 'error')
        setTimeout(() => router.push('/Component/Auth/SignIn'), 1500)
        return
      }

      const user = JSON.parse(userString)

      const response = await apiClient.post(`/addtocart`, {
        userId: user._id,
        productId: product.id,
        image: product.image,
        title: product.name,
        price: product.price,
        quantityType: 500, // ✅ Send as Number, not "500ml"
      })

      const data = response.data

      if (response.status !== 200) {
        // Check if the error is about item already in cart
        if (data.message && data.message.includes('already in cart')) {
          showToast(`${product.name} is already in your cart! 🛒`, 'error')
        } else {
          throw new Error(data.message || 'Failed to add to cart')
        }
        return
      }

      if (data.success) {
        // Check if quantity was incremented or new item added
        if (data.message && data.message.includes('incremented')) {
          showToast(`${product.name} quantity updated in cart! ➕`, 'success')
        } else {
          showToast(`${product.name} added to cart! 🛒`, 'success')
        }
      }
    } catch (error: any) {
      showToast(error.message || 'Failed to add to cart', 'error')
    } finally {
      setLoadingCart(null)
    }
  }



  const handleNavigation = (product: any) => {
    localStorage.setItem('selectedProduct', JSON.stringify({
      id: product.id,
      image: product.image,
      image2: product.image2,
      title: product.name,
      basePrice: product.basePrice || product.price,
      price: (product.basePrice || product.price) + ' Rs',
      description: product.description,
      videoUrl: product.videoUrl,
      variants: product.variants,
      benefits: product.benefits
    }))

    const path = product.id.startsWith('jag') ? 'ParticularProductKg' : 'ParticularProduct2'
    router.push(`/Component/${path}`)
  }

  const features = [
    { icon: Shield, text: '100% Pure & Natural', color: 'text-green-600' },
    { icon: Truck, text: 'Free Home Delivery', color: 'text-blue-600' },
    { icon: Award, text: 'Premium Quality', color: 'text-amber-600' },
    { icon: Leaf, text: 'Farm Fresh Daily', color: 'text-emerald-600' }
  ]

  return (
    <div className="relative overflow-hidden">
      <Navbar />

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>

      {/* Animated Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            x: mousePosition.x / 50,
            y: mousePosition.y / 50,
          }}
          transition={{ type: "spring", stiffness: 50 }}
          className="absolute top-20 -left-40 w-96 h-96 bg-[#8B1F1F]/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: -mousePosition.x / 30,
            y: -mousePosition.y / 30,
          }}
          transition={{ type: "spring", stiffness: 50 }}
          className="absolute bottom-20 -right-40 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl"
        />
      </div>

      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#8B1F1F] via-amber-500 to-[#8B1F1F] origin-left z-50 shadow-lg"
        style={{ scaleX }}
      />

      <main className="relative min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">

        {/* === HERO SECTION === */}
        <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
          {/* Video Background */}
          <motion.div
            style={{ y }}
            className="absolute inset-0 z-0"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover scale-110"
            >
              <source src="/Vdos/hero.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />

            {/* Animated Overlay Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)]" />
            </div>
          </motion.div>

          {/* Hero Content */}
          <motion.div
            style={{ opacity }}
            className="container relative z-20 text-center px-4 max-w-6xl"
          >
            {/* Floating Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="mb-6 sm:mb-8"
            >
              <span className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-white/20 border-2 border-white/30 text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2 backdrop-blur-xl shadow-2xl">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-amber-300" />
                Pure. Organic. Local.
              </span>
            </motion.div>

            {/* Main Title */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-white mb-4 sm:mb-6 tracking-tight leading-tight">
                Kaaveri{' '}
                <motion.span
                  className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300"
                  animate={{
                    backgroundPosition: ['0%', '100%', '0%'],
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                  style={{ backgroundSize: '200%' }}
                >
                  देशी
                </motion.span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-white/95 max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed font-light px-4"
            >
              Bringing the authentic taste of the countryside directly to your doorstep.
            </motion.p>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-10 sm:mt-16 flex flex-wrap justify-center gap-3 sm:gap-6 md:gap-8 text-white/80 px-4"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                  whileHover={{ scale: 1.1, y: -5 }}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full"
                >
                  <feature.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${feature.color}`} />
                  <span className="text-xs sm:text-sm font-medium">{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 10, 0] }}
            transition={{ delay: 1.5, y: { duration: 2, repeat: Infinity } }}
            className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-30"
          >
            <div
              className="flex flex-col items-center gap-2 text-white/60 cursor-pointer hover:text-white/80 transition-colors"
              onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            >
              <span className="text-xs font-medium uppercase tracking-wider hidden sm:block">Scroll to explore</span>
              <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </motion.div>
        </section>

        {/* === PRODUCTS SECTION === */}
        <section className="py-16 sm:py-24 px-4 bg-gradient-to-b from-white to-orange-50">
          <div className="container mx-auto max-w-7xl">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16 sm:mb-20 text-center"
            >
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#8B1F1F]/10 text-[#8B1F1F] rounded-full font-semibold text-sm mb-4"
              >
                <Sparkles className="w-4 h-4" />
                Premium Collection
              </motion.span>
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-gray-900 mb-4">
                Our Finest Products
              </h2>
              <div className="h-2 w-24 bg-gradient-to-r from-[#8B1F1F] to-amber-500 mx-auto rounded-full" />
            </motion.div>

            {/* Products Grid */}
            <div className="grid gap-12 sm:gap-20">
              {loadingProducts ? (
                // Loading Skeleton
                [1, 2, 3].map((n) => (
                  <div key={n} className="h-[400px] bg-gray-100 animate-pulse rounded-3xl" />
                ))
              ) : products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  <Card className="border-none shadow-2xl overflow-hidden rounded-3xl group hover:shadow-3xl transition-all duration-500">
                    <CardContent className="p-0">
                      <div className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-stretch`}>
                        {/* Video/Image Side */}
                        <div className="w-full lg:w-1/2 relative h-[350px] sm:h-[400px] lg:h-auto overflow-hidden">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.6 }}
                            className="absolute inset-0"
                          >
                            <video
                              autoPlay
                              loop
                              muted
                              playsInline
                              className="w-full h-full object-cover"
                            >
                              <source src={product.videoUrl} type="video/mp4" />
                            </video>
                          </motion.div>

                          {/* Gradient Overlay */}
                          <div className={`absolute inset-0 bg-gradient-to-t ${hoveredProduct === product.id ? 'from-black/60' : 'from-black/30'} to-transparent transition-all duration-500`} />

                          {/* Floating Badge */}
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className="absolute top-6 left-6"
                          >
                            <span className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-gray-900 shadow-lg">
                              {product.badge}
                            </span>
                          </motion.div>

                          {/* Quick Actions */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{
                              opacity: hoveredProduct === product.id ? 1 : 0,
                              y: hoveredProduct === product.id ? 0 : 20
                            }}
                            transition={{ duration: 0.3 }}
                            className="absolute bottom-6 right-6 flex gap-3"
                          >
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleAddToWishlist(product)}
                              disabled={loadingWishlist === product.id}
                              className="p-3 bg-white rounded-full shadow-lg hover:bg-[#8B1F1F] hover:text-white transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                              {loadingWishlist === product.id ? (
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                  className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full"
                                />
                              ) : (
                                <Heart className="w-5 h-5" />
                              )}
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleAddToCart(product)}
                              disabled={loadingCart === product.id}
                              className="p-3 bg-white rounded-full shadow-lg hover:bg-[#8B1F1F] hover:text-white transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                              {loadingCart === product.id ? (
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                  className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full"
                                />
                              ) : (
                                <ShoppingCart className="w-5 h-5" />
                              )}
                            </motion.button>
                          </motion.div>
                        </div>

                        {/* Content Side */}
                        <div className="w-full lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-white relative overflow-hidden">
                          {/* Background Decoration */}
                          <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${product.color} opacity-5 rounded-full blur-3xl`} />

                          <div className="relative z-10">
                            <motion.span
                              initial={{ opacity: 0, x: -20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              className="text-[#8B1F1F] font-bold uppercase tracking-widest text-xs mb-3 inline-block"
                            >
                              {product.badge}
                            </motion.span>

                            <motion.h3
                              initial={{ opacity: 0, x: -20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: 0.1 }}
                              className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6 text-gray-900"
                            >
                              {product.name}
                            </motion.h3>

                            <motion.p
                              initial={{ opacity: 0, x: -20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: 0.2 }}
                              className="text-gray-600 text-base sm:text-lg mb-8 leading-relaxed"
                            >
                              {product.description}
                            </motion.p>

                            {/* Benefits List */}
                            <motion.div
                              initial={{ opacity: 0 }}
                              whileInView={{ opacity: 1 }}
                              viewport={{ once: true }}
                              transition={{ delay: 0.3 }}
                              className="grid grid-cols-2 gap-3 mb-8"
                            >
                              {product.benefits.map((benefit: string, i: number) => (
                                <motion.div
                                  key={i}
                                  initial={{ opacity: 0, x: -20 }}
                                  whileInView={{ opacity: 1, x: 0 }}
                                  viewport={{ once: true }}
                                  transition={{ delay: 0.4 + i * 0.1 }}
                                  className="flex items-center gap-2 text-sm"
                                >
                                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                    <Check className="w-3 h-3 text-green-600" />
                                  </div>
                                  <span className="text-gray-700 font-medium">{benefit}</span>
                                </motion.div>
                              ))}
                            </motion.div>

                            {/* Price & CTA */}
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: 0.5 }}
                              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                            >
                              <div>
                                <p className="text-gray-500 text-sm mb-1">Starting from</p>
                                <div className="flex items-baseline gap-2">
                                  <p className="text-4xl sm:text-5xl font-black text-gray-900">₹{product.basePrice || product.price}</p>
                                  <span className="text-gray-400 line-through text-xl">₹{Math.round(parseInt(product.basePrice || product.price) * 1.2)}</span>
                                </div>
                              </div>

                              <motion.button
                                whileHover={{ scale: 1.05, x: 5 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleNavigation(product)}
                                className="group bg-gradient-to-r from-[#8B1F1F] to-[#6B1515] text-white hover:from-[#6B1515] hover:to-[#8B1F1F] rounded-full px-8 py-4 font-bold transition-all shadow-lg hover:shadow-xl flex items-center gap-2 w-full sm:w-auto justify-center"
                              >
                                View Details
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                              </motion.button>
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* === TESTIMONIALS === */}
        <div className="bg-gradient-to-b from-orange-50 to-white py-20">
          <TestimonialCarousel />
        </div>

      </main>
    </div>
  )
}
