'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  ShoppingCart, 
  Trash2, 
  AlertCircle, 
  CheckCircle2,
  Package,
  ArrowLeft,
  Plus,
  ShoppingBag
} from 'lucide-react';
import Navbar from "@/components/navbar";
import apiClient from '@/lib/api';

interface WishlistItem {
  productId: string;
  image: string;
  title: string;
  price: string;
  addedAt: string;
  _id: string;
}

interface WishlistProps {
  userId?: string;
}

export default function Wishlist({ userId }: WishlistProps) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [removingItemId, setRemovingItemId] = useState<string | null>(null);
  const [addingToCartId, setAddingToCartId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchWishlist();
  }, [userId]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError(null);

      const userString = localStorage.getItem('user');
      if (!userString) {
        router.push('/');
        return;
      }
      const user = JSON.parse(userString);
      const response = await apiClient.get(`/getwishlist/${user._id}`);
      const data = response.data;

      if (data.success) {
        setWishlist(data.wishlist || []);
      } else {
        throw new Error('Failed to load wishlist');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string, itemId: string) => {
    try {
      setRemovingItemId(itemId);
      setError(null);

      const userString = localStorage.getItem('user');
      if (!userString) {
        alert('Please login first');
        return;
      }
      const user = JSON.parse(userString);
      const id = user._id;

      const response = await apiClient.post(`/removefromwishlist`, {
        userId: id,
        productId: productId,
      });

      const data = response.data;

      if (data.success) {
        setWishlist(data.wishlist || []);
        setSuccessMessage('Item removed from wishlist');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove item');
      console.error('Error removing from wishlist:', err);
    } finally {
      setRemovingItemId(null);
    }
  };

  const addToCart = async (item: WishlistItem) => {
    try {
      setAddingToCartId(item._id);
      setError(null);

      const userString = localStorage.getItem('user');
      if (!userString) {
        alert('Please login first');
        return;
      }
      const user = JSON.parse(userString);
      const id = user._id;

      const response = await apiClient.post(`/addtocart`, {
        userId: id,
        productId: item.productId,
        image: item.image,
        title: item.title,
        price: item.price,
      });

      const data = response.data;

      if (data.success) {
        setSuccessMessage('Item added to cart successfully!');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add to cart');
      console.error('Error adding to cart:', err);
    } finally {
      setAddingToCartId(null);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-br from-gray-50 to-gray-100">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-[#8B1F1F] border-t-transparent rounded-full mb-4"
          />
          <p className="text-gray-600 text-lg font-medium">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && wishlist.length === 0) {
    return (
      <div>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen p-4 sm:p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full bg-red-50 border-2 border-red-200 rounded-2xl p-6"
          >
            <div className="flex items-center mb-4">
              <AlertCircle className="w-6 h-6 text-red-600 mr-2" />
              <h3 className="text-lg font-bold text-red-800">Error Loading Wishlist</h3>
            </div>
            <p className="text-red-600 mb-4">{error}</p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => fetchWishlist()}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-xl hover:bg-red-700 transition-colors font-semibold"
            >
              Try Again
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Empty state
  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4 sm:p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-pink-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-[#8B1F1F]" />
            </motion.div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">Your Wishlist is Empty</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-6">Start adding items to your wishlist to see them here!</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/')}
              className="bg-gradient-to-r from-[#8B1F1F] to-[#6B1515] text-white py-3 px-6 sm:px-8 rounded-xl hover:shadow-xl transition-all font-semibold text-sm sm:text-base inline-flex items-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              Browse Products
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Success Message */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-20 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                {successMessage}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setError(null)}
                  className="text-red-700 hover:text-red-900"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-[#8B1F1F] fill-[#8B1F1F]" />
              My Wishlist
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/')}
            className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-[#8B1F1F] to-[#6B1515] text-white rounded-xl hover:shadow-xl transition-all font-semibold text-sm sm:text-base flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </motion.button>
        </motion.div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          <AnimatePresence>
            {wishlist.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              >
                {/* Image Container */}
                <div className="relative pb-[100%] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden group">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.src !== '/placeholder-user.jpg') {
                        target.src = '/placeholder-user.jpg';
                      }
                    }}
                  />
                  
                  {/* Floating Heart Badge */}
                  <div className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-lg">
                    <Heart className="w-5 h-5 text-[#8B1F1F] fill-[#8B1F1F]" />
                  </div>

                  {/* Quick Remove on Hover */}
                  <motion.button
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    onClick={() => removeFromWishlist(item.productId, item._id)}
                    disabled={removingItemId === item._id}
                    className="absolute top-3 left-3 bg-red-500 text-white rounded-full p-2 shadow-lg hover:bg-red-600 transition-colors disabled:bg-gray-400"
                  >
                    {removingItemId === item._id ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
                  </motion.button>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">
                    {item.title}
                  </h3>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-[#8B1F1F]">₹{item.price}</span>
                  </div>

                  <p className="text-xs text-gray-500 mb-4 flex items-center gap-1">
                    <Package className="w-3 h-3" />
                    Added on {new Date(item.addedAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 bg-gradient-to-r from-[#8B1F1F] to-[#6B1515] text-white py-2.5 px-4 rounded-lg hover:shadow-lg transition-all text-sm font-semibold disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      onClick={() => addToCart(item)}
                      disabled={addingToCartId === item._id}
                    >
                      {addingToCartId === item._id ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                          />
                          <span className="hidden sm:inline">Adding...</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4" />
                          <span className="hidden sm:inline">Add to Cart</span>
                          <Plus className="w-4 h-4 sm:hidden" />
                        </>
                      )}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2.5 border-2 border-gray-300 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                      onClick={() => removeFromWishlist(item.productId, item._id)}
                      disabled={removingItemId === item._id}
                      title="Remove from wishlist"
                    >
                      {removingItemId === item._id ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full"
                        />
                      ) : (
                        <Trash2 className="w-5 h-5 text-gray-600" />
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
