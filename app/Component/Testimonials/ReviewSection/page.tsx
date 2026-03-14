'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '@/lib/api';
import { 
  Star, 
  Send, 
  User, 
  Mail, 
  MessageSquare, 
  ThumbsUp,
  ChevronLeft,
  ChevronRight,
  Filter,
  TrendingUp,
  Award,
  CheckCircle2
} from 'lucide-react';

interface Review {
  _id: string;
  name: string;
  userEmail: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalReviews: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface User {
  name: string;
  email: string;
}

function ReviewSection() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pid = searchParams.get('id');
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalReviews: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);
  
  const [formData, setFormData] = useState({
    name: '',
    userEmail: '',
    rating: 5,
    comment: ''
  });

  // Calculate average rating
  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  // Rating distribution
  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      
      if (!userData) {
        setIsLoggedIn(false);
        return;
      }

      try {
        const user: User = JSON.parse(userData);
        setFormData(prev => ({
          ...prev,
          name: user.name || '',
          userEmail: user.email || ''
        }));
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        setIsLoggedIn(false);
      }
    }
  }, []);

  const fetchReviews = async (page: number) => {
    if (!pid) return;
    
    setLoading(true);
    try {
      const response = await apiClient.get(`/reviews/${pid}?page=${page}&limit=5`);
      const data = response.data;
      
      if (data.success) {
        setReviews(data.reviews);
        setPagination(data.pagination);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(1);
  }, [pid]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      
      if (!userData) {
        alert('Please login first');
        router.push('/');
        return;
      }
    }
    
    if (!pid) {
      alert('Product ID not found');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const response = await apiClient.post(`/reviews/${pid}`, formData);
      const data = response.data;
      
      if (data.success) {
        setFormData(prev => ({
          ...prev,
          rating: 5,
          comment: ''
        }));
        setShowForm(false);
        fetchReviews(1);
      } else {
        alert(data.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchReviews(page);
      window.scrollTo({ top: document.getElementById('reviews-section')?.offsetTop || 0, behavior: 'smooth' });
    }
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    };
    
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'fill-gray-200 text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const renderInteractiveStars = () => {
    return (
      <div className="flex gap-1 sm:gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            type="button"
            onClick={() => setFormData({ ...formData, rating: star })}
            onMouseEnter={() => setHoveredStar(star)}
            onMouseLeave={() => setHoveredStar(0)}
            whileHover={{ scale: 1.2, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
            className="focus:outline-none"
          >
            <Star
              className={`w-8 h-8 sm:w-10 sm:h-10 transition-all ${
                star <= (hoveredStar || formData.rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'fill-gray-200 text-gray-300'
              }`}
            />
          </motion.button>
        ))}
      </div>
    );
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const maxButtons = isMobile ? 3 : 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(pagination.totalPages, startPage + maxButtons - 1);
    
    if (endPage - startPage < maxButtons - 1) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }
    
    buttons.push(
      <motion.button
        key="prev"
        onClick={() => goToPage(currentPage - 1)}
        disabled={!pagination.hasPrevPage}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="p-2 sm:px-4 sm:py-2 rounded-lg bg-gradient-to-r from-[#8B1F1F] to-[#6B1515] text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center gap-1 text-sm"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Prev</span>
      </motion.button>
    );
    
    if (startPage > 1 && !isMobile) {
      buttons.push(
        <motion.button
          key={1}
          onClick={() => goToPage(1)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="px-3 py-2 sm:px-4 rounded-lg bg-white border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 shadow-md text-sm"
        >
          1
        </motion.button>
      );
      if (startPage > 2) {
        buttons.push(<span key="dots1" className="px-1 text-gray-400">...</span>);
      }
    }
    
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <motion.button
          key={i}
          onClick={() => goToPage(i)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`px-3 py-2 sm:px-4 rounded-lg font-semibold shadow-md text-sm ${
            currentPage === i
              ? 'bg-gradient-to-r from-[#8B1F1F] to-[#6B1515] text-white'
              : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {i}
        </motion.button>
      );
    }
    
    if (endPage < pagination.totalPages && !isMobile) {
      if (endPage < pagination.totalPages - 1) {
        buttons.push(<span key="dots2" className="px-1 text-gray-400">...</span>);
      }
      buttons.push(
        <motion.button
          key={pagination.totalPages}
          onClick={() => goToPage(pagination.totalPages)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="px-3 py-2 sm:px-4 rounded-lg bg-white border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 shadow-md text-sm"
        >
          {pagination.totalPages}
        </motion.button>
      );
    }
    
    buttons.push(
      <motion.button
        key="next"
        onClick={() => goToPage(currentPage + 1)}
        disabled={!pagination.hasNextPage}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="p-2 sm:px-4 sm:py-2 rounded-lg bg-gradient-to-r from-[#8B1F1F] to-[#6B1515] text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center gap-1 text-sm"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="w-4 h-4" />
      </motion.button>
    );
    
    return buttons;
  };

  const distribution = getRatingDistribution();

  return (
    <div id="reviews-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Statistics Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12"
      >
        {/* Average Rating Card */}
        <motion.div
          whileHover={{ scale: 1.02, y: -5 }}
          className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl shadow-lg p-4 sm:p-6 border-2 border-yellow-200"
        >
          <div className="flex items-center gap-3 sm:gap-4 mb-3">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-yellow-400 rounded-full flex items-center justify-center">
              <Star className="w-6 h-6 sm:w-8 sm:h-8 fill-white text-white" />
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-gray-900">{averageRating}</div>
              <div className="text-xs sm:text-sm text-gray-600">Average Rating</div>
            </div>
          </div>
          {renderStars(Math.round(parseFloat(averageRating)), 'md')}
        </motion.div>

        {/* Total Reviews Card */}
        <motion.div
          whileHover={{ scale: 1.02, y: -5 }}
          className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-4 sm:p-6 border-2 border-blue-200"
        >
          <div className="flex items-center gap-3 sm:gap-4 mb-3">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-500 rounded-full flex items-center justify-center">
              <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-gray-900">{pagination.totalReviews}</div>
              <div className="text-xs sm:text-sm text-gray-600">Total Reviews</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-blue-600 font-medium">
            <TrendingUp className="w-4 h-4" />
            Verified purchases only
          </div>
        </motion.div>

        {/* Customer Satisfaction */}
    



      </motion.div>

      {/* Write Review Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 mb-8 sm:mb-12 border border-gray-200"
      >
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-[#8B1F1F]" />
            Share Your Experience
          </h2>
          {isLoggedIn && !showForm && (
            <motion.button
              onClick={() => setShowForm(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-[#8B1F1F] to-[#6B1515] text-white rounded-xl font-semibold shadow-lg flex items-center gap-2 text-sm sm:text-base"
            >
              <Send className="w-4 h-4" />
              Write Review
            </motion.button>
          )}
        </div>
        
        <AnimatePresence mode="wait">
          {!isLoggedIn ? (
            <motion.div
              key="login-prompt"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-8 sm:py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-4xl sm:text-6xl mb-4"
              >
                🔒
              </motion.div>
              <p className="text-gray-700 text-base sm:text-lg mb-4 sm:mb-6 font-medium px-4">
                Sign in to share your thoughts about this product
              </p>
              <motion.button
                onClick={() => router.push('/Component/Auth/SignIn')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-[#8B1F1F] to-[#6B1515] text-white px-6 py-3 sm:px-8 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-shadow text-sm sm:text-base"
              >
                Login to Review
              </motion.button>
            </motion.div>
          ) : showForm ? (
            <motion.form
              key="review-form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 sm:space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    readOnly
                    className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl bg-gray-50 cursor-not-allowed font-medium text-sm sm:text-base"
                  />
                  <p className="text-xs text-green-600 mt-1.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified from your account
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Your Email
                  </label>
                  <input
                    type="email"
                    value={formData.userEmail}
                    readOnly
                    className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl bg-gray-50 cursor-not-allowed font-medium text-sm sm:text-base"
                  />
                  <p className="text-xs text-green-600 mt-1.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified from your account
                  </p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-3 text-gray-700">
                  Rate this product
                </label>
                <div className="flex items-center gap-4">
                  {renderInteractiveStars()}
                  <span className="text-lg sm:text-xl font-bold text-gray-900">
                    {formData.rating} {formData.rating === 1 ? 'Star' : 'Stars'}
                  </span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Your Review
                </label>
                <textarea
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  required
                  maxLength={500}
                  rows={5}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#8B1F1F]/20 focus:border-[#8B1F1F] transition-all resize-none text-sm sm:text-base"
                  placeholder="Tell us about your experience with this product... ✨"
                />
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-2">
                  <p className="text-sm text-gray-600 font-medium">
                    {formData.comment.length}/500 characters
                  </p>
                  <div className="w-full sm:w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(formData.comment.length / 500) * 100}%` }}
                      className={`h-full ${
                        formData.comment.length < 50 
                          ? 'bg-red-500' 
                          : formData.comment.length < 100 
                          ? 'bg-yellow-500' 
                          : 'bg-green-500'
                      }`}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <motion.button
                  type="button"
                  onClick={() => setShowForm(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 sm:flex-none px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors text-sm sm:text-base"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-gradient-to-r from-[#8B1F1F] to-[#6B1515] text-white py-3 rounded-xl font-bold shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  {submitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="w-5 h-5 border-3 border-white border-t-transparent rounded-full"
                      />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Review
                    </>
                  )}
                </motion.button>
              </div>
            </motion.form>
          ) : (
            <motion.div
              key="write-prompt"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-gray-600"
            >
              Click "Write Review" to share your experience
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Reviews Display Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-200"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-[#8B1F1F]" />
            Customer Reviews
          </h2>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="bg-gradient-to-r from-[#8B1F1F]/10 to-[#6B1515]/10 text-[#8B1F1F] px-4 py-2 rounded-full font-bold text-sm sm:text-base"
          >
            {pagination.totalReviews} {pagination.totalReviews === 1 ? 'Review' : 'Reviews'}
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 sm:py-16"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="inline-block w-12 h-12 sm:w-16 sm:h-16 border-4 border-gray-200 border-t-[#8B1F1F] rounded-full"
              />
              <p className="mt-4 text-gray-600 font-medium text-sm sm:text-base">Loading reviews...</p>
            </motion.div>
          ) : reviews.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-12 sm:py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl"
            >
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-6xl sm:text-8xl mb-4"
              >
                📝
              </motion.div>
              <p className="text-xl sm:text-2xl font-bold text-gray-700">No reviews yet</p>
              <p className="mt-2 text-sm sm:text-base text-gray-600">Be the first to review this product!</p>
            </motion.div>
          ) : (
            <>
              <motion.div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
                {reviews.map((review, index) => (
                  <motion.div
                    key={review._id}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.01, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                    className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 sm:p-6 border-l-4 border-[#8B1F1F] hover:border-[#6B1515] transition-all"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-[#8B1F1F] to-[#6B1515] rounded-full flex items-center justify-center text-white font-bold">
                            {review.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div>
                            <h3 className="font-bold text-base sm:text-lg text-gray-900">
                              {review.name || 'Anonymous User'}
                            </h3>
                            <p className="text-xs text-gray-500">{review.userEmail}</p>
                          </div>
                        </div>
                        {renderStars(review.rating, 'sm')}
                      </div>
                      <span className="text-xs sm:text-sm text-gray-500 bg-white px-3 py-1.5 rounded-full font-medium whitespace-nowrap">
                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-gray-700 leading-relaxed text-sm sm:text-base"
                    >
                      {review.comment}
                    </motion.p>
                  </motion.div>
                ))}
              </motion.div>

              {pagination.totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center items-center gap-2 sm:gap-3 mt-6 sm:mt-8 flex-wrap"
                >
                  {renderPaginationButtons()}
                </motion.div>
              )}

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-xs sm:text-sm text-gray-600 mt-4 sm:mt-6 font-medium"
              >
                Page {currentPage} of {pagination.totalPages}
              </motion.p>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default function ReviewPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-[#8B1F1F] border-t-transparent rounded-full"
        />
      </div>
    }>
      <ReviewSection />
    </Suspense>
  );
}
