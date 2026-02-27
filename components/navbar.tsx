"use client"

import { useEffect, useRef, useState } from "react"
import { ShoppingCart, Menu, X, User, LogOut, Heart, Package, LayoutDashboard } from "lucide-react"
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from "framer-motion"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [user, setUser] = useState<any>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const router = useRouter()

  // Scroll effect for navbar shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleMenu = () => setIsOpen(!isOpen)

  const navigationItems = [
    { label: 'Cart', icon: ShoppingCart, onClick: () => router.push('/cart'), showOn: 'mobile' },
    { label: 'Orders', icon: Package, onClick: () => router.push('/orders'), showOn: 'desktop' },
    { label: 'Wishlist', icon: Heart, onClick: () => router.push('/wishlist'), showOn: 'desktop' },
  ]

  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    setIsDropdownOpen(false)
    router.push('/')
  }

  return (
    <nav 
      className={`sticky top-0 z-50 bg-gradient-to-r from-[#8B1F1F] to-[#6B1515] transition-all duration-300 ${
        scrolled ? 'shadow-lg' : 'shadow-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => router.push('/')}
          >
            <motion.img
              src="/Images/logo.png"
              alt="KAAVERI Logo"
              className="w-12 h-12 sm:w-14 sm:h-14 object-contain drop-shadow-lg"
              initial={{ rotate: 0 }}
              whileHover={{ rotate: [0, -5, 5, 0], transition: { duration: 0.5 } }}
            />
            <div className="flex flex-col leading-tight">
              <span className="text-xl sm:text-2xl font-bold text-white tracking-wide">KAAVERI</span>
              <span className="text-sm sm:text-base font-semibold text-yellow-100">देशी</span>
            </div>
          </motion.div>

          <div className="hidden md:flex items-center gap-2">
            {/* Authenticated Links (Cart, Orders, Wishlist) */}
            {user && (
              <>
                {/* Cart */}
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/cart')}
                  className="relative flex items-center gap-2 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 rounded-lg transition-all duration-200 backdrop-blur-sm"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Cart</span>
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 text-[#8B1F1F] text-xs font-bold rounded-full flex items-center justify-center"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </motion.button>

                {/* Orders */}
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/orders')}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                >
                  <Package className="w-4 h-4" />
                  <span>Orders</span>
                </motion.button>

                {/* Wishlist */}
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/wishlist')}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                >
                  <Heart className="w-4 h-4" />
                  <span>Wishlist</span>
                </motion.button>
              </>
            )}

            {/* Dashboard - Admin Only */}
            {/* {user?.role === 'admin' && (
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/admin/dashboard')}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg transition-all duration-200 border border-yellow-400/30"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </motion.button>
            )} */}


             {/* Dashboard */}
            {/* <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/Component/Admin/dashboard')}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg transition-all duration-200 border border-yellow-400/30"
            >
              <Package className="w-4 h-4" />
              <span>Dashboard</span>
            </motion.button> */}

            {/* User Profile / Login */}
            <div className="relative ml-2" ref={dropdownRef}>
              {user ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleProfileClick}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white text-[#8B1F1F] rounded-lg hover:bg-yellow-50 transition-all duration-200 shadow-md"
                  >
                    <User className="w-4 h-4" />
                    <span className="max-w-[100px] truncate">{user.name}</span>
                  </motion.button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50"
                      >
                        {/* User Info */}
                        <div className="px-4 py-3 bg-gradient-to-r from-[#8B1F1F] to-[#6B1515] text-white">
                          <p className="text-sm font-semibold truncate">{user.name}</p>
                          <p className="text-xs opacity-90 mt-0.5 truncate">{user.email}</p>
                        </div>

                        {/* Menu Items */}
                        <div className="py-1">
                          <button
                            onClick={() => {
                              router.push('/orders')
                              setIsDropdownOpen(false)
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <Package className="w-4 h-4 text-[#8B1F1F]" />
                            My Orders
                          </button>
                          <button
                            onClick={() => {
                              router.push('/wishlist')
                              setIsDropdownOpen(false)
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <Heart className="w-4 h-4 text-[#8B1F1F]" />
                            Wishlist
                          </button>
                          {user?.role === 'admin' && (
                            <button
                              onClick={() => {
                                router.push('/admin/dashboard')
                                setIsDropdownOpen(false)
                              }}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <LayoutDashboard className="w-4 h-4 text-[#8B1F1F]" />
                              Dashboard
                            </button>
                          )}
                        </div>

                        {/* Logout */}
                        <div className="border-t border-gray-200">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                          >
                            <LogOut className="w-4 h-4" />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/signin')}
                  className="px-5 py-2 text-sm font-medium bg-white text-[#8B1F1F] rounded-lg hover:bg-yellow-50 transition-all duration-200 shadow-md"
                >
                  Login
                </motion.button>
              )}
            </div>
          </div>

          {/* Mobile Menu Button & Cart */}
          <div className="flex md:hidden items-center gap-2">
            {/* Mobile Cart */}
            {user && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => router.push('/cart')}
                className="relative p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 text-[#8B1F1F] text-xs font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </motion.button>
            )}

            {/* Hamburger Menu */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleMenu}
              className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-3 space-y-1 border-t border-white/20">
                {/* Logged in mobile links */}
                {user && (
                  <>
                    {/* Orders */}
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        router.push('/orders')
                        setIsOpen(false)
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <Package className="w-5 h-5" />
                      My Orders
                    </motion.button>

                    {/* Wishlist */}
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        router.push('/wishlist')
                        setIsOpen(false)
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <Heart className="w-5 h-5" />
                      Wishlist
                    </motion.button>
                  </>
                )}

                {/* Dashboard - Admin Only */}
                {user?.role === 'admin' && (
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      router.push('/Component/Admin/dashboard')
                      setIsOpen(false)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-yellow-200 bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-yellow-400/30"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    Dashboard
                  </motion.button>
                )}

                {/* User Section */}
                {user ? (
                  <div className="pt-3 mt-3 border-t border-white/20">
                    <div className="px-4 py-2 mb-2">
                      <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                      <p className="text-xs text-white/70 mt-0.5 truncate">{user.email}</p>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-300 hover:bg-red-900/30 rounded-lg transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      Logout
                    </motion.button>
                  </div>
                ) : (
                  <div className="pt-3 mt-3 border-t border-white/20">
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        router.push('/signin')
                        setIsOpen(false)
                      }}
                      className="w-full px-4 py-3 text-sm font-medium bg-white text-[#8B1F1F] rounded-lg hover:bg-yellow-50 transition-colors"
                    >
                      Login
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
