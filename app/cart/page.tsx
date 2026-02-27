'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight,
  Package,
  Truck,
  ShieldCheck,
  Tag,
  Heart,
  X
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Navbar from "@/components/navbar";
import apiClient from '@/lib/api';

interface CartItem {
  _id: string;
  productId: string;
  image: string;
  title: string;
  price: string;
  quantity: number;
  quantityType?: number;
  addedAt?: string;
}

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [subTotal, setSubTotal] = useState('0.00');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [removingItem, setRemovingItem] = useState<string | null>(null);
  const router = useRouter();

  const handleCartCheckout = () => {
    router.push('/checkout');
  };

  // Fetch cart items
  const fetchCartItems = async () => {
    setLoading(true);
    try {
      const userString = localStorage.getItem('user');
      if (!userString) {
        router.push('/');
        return;
      }

      const user = JSON.parse(userString);
      const response = await apiClient.get(`/getcart/${user._id}`);
      const data = response.data;

      if (data.success) {
        setCartItems(data.cart);
        setTotalItems(data.totalItems);
        setSubTotal(data.subTotal);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update quantity
  const updateQuantity = async (productId: string, newQuantity: number) => {
    setUpdating(productId);
    try {
      const userString = localStorage.getItem('user');
      if (!userString) return;
      
      const user = JSON.parse(userString);
 
      const response = await apiClient.post(`/updatecartquantity`, {
        userId: user._id,
        productId: productId,
        quantity: newQuantity
      });
 
      const data = response.data;

      if (data.success) {
        setCartItems(data.cart);
        setTotalItems(data.totalItems);
        setSubTotal(data.subTotal);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setUpdating(null);
    }
  };

  const handleIncrement = (productId: string, currentQuantity: number) => {
    updateQuantity(productId, currentQuantity + 1);
  };

  const handleDecrement = (productId: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      updateQuantity(productId, currentQuantity - 1);
    }
  };

  const handleRemove = async (productId: string) => {
    setRemovingItem(productId);
    
    try {
      const userString = localStorage.getItem('user');
      if (!userString) return;
      
      const user = JSON.parse(userString);
 
      const response = await apiClient.post(`/removefromcart`, { 
        userId: user._id, 
        productId: productId 
      });
 
      const data = response.data;

      if (data.success) {
        setCartItems(data.cart);
        setTotalItems(data.totalItems);
        setSubTotal(data.subTotal);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setRemovingItem(null);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="flex flex-col items-center gap-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-[#8B1F1F] border-t-transparent rounded-full"
            />
            <p className="text-gray-600 font-medium">Loading your cart...</p>
          </div>
        </div>
      </div>
    );
  }

  const savings = (parseFloat(subTotal) * 0.17).toFixed(2);
  const originalTotal = (parseFloat(subTotal) * 1.17).toFixed(2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 flex items-center gap-2 sm:gap-3">
            <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10 text-[#8B1F1F]" />
            Shopping Cart
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
          </p>
        </motion.div>

        {cartItems.length === 0 ? (
          /* Empty Cart State */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 sm:py-20 bg-white rounded-2xl shadow-lg"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <ShoppingBag className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
            </motion.div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-6">Add some delicious KAAVERI products to get started</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/')}
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 bg-gradient-to-r from-[#8B1F1F] to-[#6B1515] text-white font-semibold rounded-xl hover:shadow-xl transition-all duration-200 shadow-lg text-sm sm:text-base"
            >
              Start Shopping
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-3 sm:space-y-4">
              <AnimatePresence>
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-4 sm:p-6 border border-gray-100 ${
                      removingItem === item.productId ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                      {/* Product Image */}
                      <div className="relative flex-shrink-0">
                        <motion.img
                          whileHover={{ scale: 1.05 }}
                          src={item.image}
                          alt={item.title}
                          className="w-full sm:w-28 md:w-32 h-28 md:h-32 object-cover rounded-lg sm:rounded-xl"
                        />
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-2 -right-2 bg-[#8B1F1F] text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg"
                        >
                          {item.quantity}
                        </motion.div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-1 line-clamp-2">
                            {item.title}
                          </h3>
                          <p className="text-xl sm:text-2xl font-bold text-[#8B1F1F] mb-2">
                            ₹{item.price}
                          </p>
                        </div>

                        {/* Quantity Controls & Actions */}
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-3 sm:mt-4">
                          {/* Quantity Controls */}
                          <div className="flex items-center bg-gray-100 rounded-lg sm:rounded-xl p-1">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDecrement(item.productId, item.quantity)}
                              disabled={updating === item.productId || item.quantity === 1}
                              className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {item.quantity === 1 ? (
                                <Trash2 className="w-4 h-4 text-red-500" />
                              ) : (
                                <Minus className="w-4 h-4 text-gray-700" />
                              )}
                            </motion.button>

                            <span className="w-10 sm:w-12 text-center font-bold text-gray-900 text-base sm:text-lg">
                              {updating === item.productId ? (
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                  className="w-4 h-4 border-2 border-[#8B1F1F] border-t-transparent rounded-full mx-auto"
                                />
                              ) : (
                                item.quantity
                              )}
                            </span>

                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleIncrement(item.productId, item.quantity)}
                              disabled={updating === item.productId}
                              className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Plus className="w-4 h-4 text-gray-700" />
                            </motion.button>
                          </div>

                          {/* Item Total */}
                          <div className="flex-1 min-w-[100px]">
                            <p className="text-xs sm:text-sm text-gray-600 mb-0.5">Item Total</p>
                            <p className="text-lg sm:text-xl font-bold text-gray-900">
                              ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
                            </p>
                          </div>

                          {/* Remove Button */}
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleRemove(item.productId)}
                            disabled={removingItem === item.productId}
                            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg sm:rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                          >
                            {removingItem === item.productId ? (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full"
                              />
                            ) : (
                              <>
                                <Trash2 className="w-4 h-4" />
                                <span className="hidden sm:inline">Remove</span>
                              </>
                            )}
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary - Sticky Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-[#8B1F1F] to-[#6B1515] rounded-2xl shadow-xl p-6 sm:p-8 text-white lg:sticky lg:top-8"
              >
                <h2 className="text-xl sm:text-2xl font-bold mb-6 flex items-center gap-2">
                  <Package className="w-6 h-6" />
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center pb-4 border-b border-white/20">
                    <span className="text-sm sm:text-base text-white/80">Subtotal ({totalItems} items)</span>
                    <span className="font-semibold text-base sm:text-lg">₹{subTotal}</span>
                  </div>

                  <div className="flex justify-between items-center pb-4 border-b border-white/20">
                    <span className="text-sm sm:text-base text-white/80">Discount (17%)</span>
                    <span className="font-semibold text-green-300 text-base sm:text-lg">-₹{savings}</span>
                  </div>

                  <div className="flex justify-between items-center pb-4 border-b border-white/20">
                    <span className="text-sm sm:text-base text-white/80">Shipping</span>
                    <span className="font-semibold text-green-300 flex items-center gap-1 text-base sm:text-lg">
                      <Truck className="w-4 h-4" />
                      FREE
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-lg sm:text-xl font-bold">Total</span>
                    <div className="text-right">
                      <span className="text-2xl sm:text-3xl font-bold block">₹{subTotal}</span>
                      <span className="text-xs sm:text-sm text-white/60 line-through">₹{originalTotal}</span>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-white text-[#8B1F1F] py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-2xl mb-3 sm:mb-4 flex items-center justify-center gap-2"
                  onClick={handleCartCheckout}
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push('/')}
                  className="w-full bg-white/10 backdrop-blur-sm text-white py-2.5 sm:py-3 rounded-xl font-semibold hover:bg-white/20 transition-all duration-200 text-sm sm:text-base"
                >
                  Continue Shopping
                </motion.button>

                {/* Trust Badges */}
                <div className="mt-6 space-y-3">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <ShieldCheck className="w-5 h-5 text-green-300" />
                      <span className="font-semibold text-sm sm:text-base">Secure Checkout</span>
                    </div>
                    <p className="text-xs sm:text-sm text-white/70">Your data is protected with SSL encryption</p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Truck className="w-5 h-5 text-blue-300" />
                      <span className="font-semibold text-sm sm:text-base">Free Shipping</span>
                    </div>
                    <p className="text-xs sm:text-sm text-white/70">On all orders with no minimum</p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 text-center">
                    <p className="text-xs sm:text-sm font-medium">
                      🎉 You're saving <span className="text-green-300 font-bold">₹{savings}</span> on this order!
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
