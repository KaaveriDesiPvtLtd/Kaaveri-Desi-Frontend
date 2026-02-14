"use client"

import { useEffect, useRef, useState } from "react"
import { ShoppingCart, Menu, X, User, LogOut, Heart, Package, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from "framer-motion"

// import "../public/Images/logo.png"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const router = useRouter();

  const toggleMenu = () => setIsOpen(!isOpen)

  const gotoSignIn = () => {
    router.push(`/Component/Auth/SignIn`);
  };

  const gotoCart = () => {
    router.push(`/Component/Cart`);
  };

  const gotoWishList = () => {
    router.push(`/Component/WishList`);
  };

  const gotoDashBoard = () => {
    router.push(`/Component/Admin/dashboard`);
  };

  const gotoMyOrders = () => {
    router.push(`/Component/Orders/MyOrdersPage`);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: { target: any; }) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsDropdownOpen(false);
    router.push('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-3 font-bold text-2xl text-gray-900 cursor-pointer"
            onClick={() => router.push('/')}
          >
            <img
              src="/Images/logo.png"
              alt="MilkBox Logo"
              className="w-14 h-14 object-contain"
            />
            {/* <div className="flex flex-col leading-tight" style={{justifyContent : "center" }}>
              <span className="text-2xl">KAAVERI</span>
              <span className="text-lg">देशी</span>
            </div> */}
          </motion.div>


          {/* Desktop Navigation */}
          {/* <div className="hidden md:flex items-center gap-8">
            <a href="/" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
              Home
            </a>
            <a href="#about" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
              About
            </a>
            <a href="#products" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
              Products
            </a>
            <a href="#contact" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
              Contact
            </a>
          </div> */}

          {/* Right Side - Icons */}
          <div className="flex items-center gap-2">
            {/* Cart */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={gotoCart}
              className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Cart</span>
            </motion.button>

            {/* My Orders */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={gotoMyOrders}
              className="hidden lg:flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
            >
              <Package className="w-4 h-4" />
              <span>Orders</span>
            </motion.button>

            {/* Dashboard */}
            {/* <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={gotoDashBoard}
              className="hidden lg:flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
            >
              <Package className="w-4 h-4" />
              <span>dashBoard</span>
            </motion.button> */}

            {/* Wishlist */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={gotoWishList}
              className="hidden lg:flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
            >
              <Heart className="w-4 h-4" />
              <span>Wishlist</span>
            </motion.button>

            {/* Dashboard - Only show for admin */}
            {user?.role === 'admin' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={gotoDashBoard}
                className="hidden lg:flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </motion.button>
            )}

            {/* User Profile / Login */}
            <div className="relative" ref={dropdownRef}>
              {user ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleProfileClick}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">{user.name}</span>
                  </motion.button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
                      >
                        <div className="px-4 py-3 border-b border-gray-200">
                          <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
                        </div>

                        {/* Mobile-only menu items */}
                        <div className="lg:hidden border-b border-gray-200">
                          <button
                            onClick={() => {
                              gotoMyOrders();
                              setIsDropdownOpen(false);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <Package className="w-4 h-4" />
                            My Orders
                          </button>
                          <button
                            onClick={() => {
                              gotoWishList();
                              setIsDropdownOpen(false);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <Heart className="w-4 h-4" />
                            Wishlist
                          </button>
                          {user?.role === 'admin' && (
                            <button
                              onClick={() => {
                                gotoDashBoard();
                                setIsDropdownOpen(false);
                              }}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <LayoutDashboard className="w-4 h-4" />
                              Dashboard
                            </button>
                          )}
                        </div>

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={gotoSignIn}
                  className="px-4 py-2 text-sm font-medium bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
                >
                  Login
                </motion.button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleMenu}
              className="md:hidden p-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden border-t border-gray-200"
            >
              <div className="py-3 space-y-1">
                {/* <a
                  href="/"
                  className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-md transition-colors"
                >
                  Home
                </a>
                <a
                  href="#about"
                  className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-md transition-colors"
                >
                  About
                </a>
                <a
                  href="#products"
                  className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-md transition-colors"
                >
                  Products
                </a>
                <a
                  href="#contact"
                  className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-md transition-colors"
                >
                  Contact
                </a> */}

                {/* Mobile Cart Button */}
                <div className="sm:hidden pt-2 border-t border-gray-200">
                  <button
                    onClick={() => {
                      gotoCart();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Cart
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
