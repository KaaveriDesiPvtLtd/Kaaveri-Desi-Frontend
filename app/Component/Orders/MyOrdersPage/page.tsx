'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  Calendar, 
  Truck, 
  Eye, 
  X,
  MapPin,
  Phone,
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowLeft,
  ShoppingBag
} from 'lucide-react';
import Navbar from "@/components/navbar";
import apiClient from '@/lib/api';

interface Order {
  orderId: string;
  orderDate: string;
  orderItems: Array<{
    productId: string;
    image: string;
    title: string;
    price: string;
    quantity: number;
  }>;
  totalAmount: number;
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  paymentStatus: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  trackingId?: string;
  deliveredAt?: string;
}

export default function MyOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const fetchOrders = async () => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        router.push('/');
        return;
      }

      const user = JSON.parse(userData);
      const response = await apiClient.get(`/getorders/${user._id}`);
      const data = response.data;

      if (data.success) {
        setOrders(data.orders);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
          icon: Clock,
          text: 'Pending'
        };
      case 'processing':
        return {
          color: 'bg-blue-100 text-blue-800 border-blue-300',
          icon: Package,
          text: 'Processing'
        };
      case 'confirmed':
        return {
          color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          icon: CheckCircle2,
          text: 'Confirmed'
        };
      case 'shipped':
        return {
          color: 'bg-purple-100 text-purple-800 border-purple-300',
          icon: Truck,
          text: 'Shipped'
        };
      case 'delivered':
        return {
          color: 'bg-green-100 text-green-800 border-green-300',
          icon: CheckCircle2,
          text: 'Delivered'
        };
      case 'cancelled':
        return {
          color: 'bg-red-100 text-red-800 border-red-300',
          icon: AlertCircle,
          text: 'Cancelled'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-300',
          icon: Package,
          text: 'Unknown'
        };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-[#8B1F1F] border-t-transparent rounded-full mb-4"
          />
          <p className="text-gray-600 font-medium">Loading your orders...</p>
        </div>
      </div>
    );
  }

  const StatusIcon = selectedOrder ? getStatusInfo(selectedOrder.orderStatus).icon : Package;

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

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 flex items-center gap-3">
              <Package className="w-8 h-8 sm:w-10 sm:h-10 text-[#8B1F1F]" />
              My Orders
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              {orders.length} {orders.length === 1 ? 'order' : 'orders'} placed
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

        {orders.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 text-center"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Package className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
            </motion.div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2">No Orders Yet</h2>
            <p className="text-sm sm:text-base text-gray-500 mb-6">Start shopping to see your orders here</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/')}
              className="px-6 sm:px-8 py-3 bg-gradient-to-r from-[#8B1F1F] to-[#6B1515] text-white rounded-xl hover:shadow-xl transition-all font-semibold text-sm sm:text-base inline-flex items-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              Start Shopping
            </motion.button>
          </motion.div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {orders.map((order, index) => {
              const statusInfo = getStatusInfo(order.orderStatus);
              const StatusIconComponent = statusInfo.icon;

              return (
                <motion.div
                  key={order.orderId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-lg transition-all overflow-hidden border border-gray-100"
                >
                  {/* Order Header */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 sm:px-6 py-4 border-b">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                        <div>
                          <p className="text-xs sm:text-sm text-gray-600">Order ID</p>
                          <p className="font-bold text-sm sm:text-base text-gray-800">{order.orderId}</p>
                        </div>
                        <div className="hidden sm:block w-px h-10 bg-gray-300"></div>
                        <div>
                          <p className="text-xs sm:text-sm text-gray-600">Order Date</p>
                          <p className="font-semibold text-sm sm:text-base text-gray-800 flex items-center gap-1">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                            {formatDate(order.orderDate)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <span className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold border-2 ${statusInfo.color} flex items-center gap-1.5`}>
                          <StatusIconComponent className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="capitalize">{order.paymentStatus}</span>
                          <span className="mx-0.5 opacity-50">|</span>
                          <span>{order.paymentMethod.toUpperCase()}</span>
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => viewOrderDetails(order)}
                          className="flex items-center gap-1 px-3 sm:px-4 py-2 bg-[#8B1F1F] text-white rounded-lg hover:bg-[#6B1515] transition text-xs sm:text-sm font-semibold"
                        >
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">View Details</span>
                          <span className="sm:hidden">View</span>
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="px-4 sm:px-6 py-4">
                    <div className="space-y-3">
                      {order.orderItems.slice(0, 2).map((item, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex gap-3 sm:gap-4 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm sm:text-base text-gray-800 line-clamp-1">{item.title}</p>
                            <p className="text-xs text-[#8B1F1F] font-mono mt-0.5">{item.productId}</p>
                            <p className="text-xs sm:text-sm text-gray-600">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-bold text-sm sm:text-base text-[#8B1F1F]">₹{item.price}</p>
                        </motion.div>
                      ))}
                      {order.orderItems.length > 2 && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          onClick={() => viewOrderDetails(order)}
                          className="text-xs sm:text-sm text-[#8B1F1F] font-semibold hover:underline"
                        >
                          +{order.orderItems.length - 2} more items
                        </motion.button>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div className="flex items-center text-gray-600 text-sm">
                        <Truck className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-[#8B1F1F]" />
                        <span>
                          {order.orderStatus === 'delivered'
                            ? `Delivered on ${order.deliveredAt ? formatDate(order.deliveredAt) : 'N/A'}`
                            : 'Expected delivery in 5-7 days'}
                        </span>
                      </div>
                      <div className="text-left sm:text-right w-full sm:w-auto">
                        <p className="text-xs sm:text-sm text-gray-600">Total Amount</p>
                        <p className="text-xl sm:text-2xl font-bold text-[#8B1F1F]">₹{order.totalAmount.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Order Details Modal */}
        <AnimatePresence>
          {showModal && selectedOrder && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowModal(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              >
                {/* Modal */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
                >
                  {/* Modal Header */}
                  <div className="sticky top-0 bg-gradient-to-r from-[#8B1F1F] to-[#6B1515] text-white px-4 sm:px-6 py-4 flex justify-between items-center z-10">
                    <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                      <Package className="w-6 h-6" />
                      Order Details
                    </h2>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowModal(false)}
                      className="p-2 hover:bg-white/20 rounded-full transition"
                    >
                      <X className="w-5 h-5 sm:w-6 sm:h-6" />
                    </motion.button>
                  </div>

                  {/* Modal Content */}
                  <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-4 sm:p-6">
                    {/* Order Info */}
                    <div className="mb-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-xs sm:text-sm text-gray-600 mb-1">Order ID</p>
                          <p className="font-bold text-sm sm:text-base">{selectedOrder.orderId}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-xs sm:text-sm text-gray-600 mb-1">Order Date</p>
                          <p className="font-bold text-sm sm:text-base flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(selectedOrder.orderDate)}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-xs sm:text-sm text-gray-600 mb-1">Status</p>
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold border-2 ${getStatusInfo(selectedOrder.orderStatus).color}`}>
                            <StatusIcon className="w-4 h-4" />
                            <span className="capitalize">{selectedOrder.paymentStatus}</span>
                            <span className="mx-0.5 opacity-50">|</span>
                            <span>{selectedOrder.paymentMethod.toUpperCase()}</span>
                          </span>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-xs sm:text-sm text-gray-600 mb-1">Payment Method</p>
                          <p className="font-bold text-sm sm:text-base uppercase flex items-center gap-1">
                            <CreditCard className="w-4 h-4" />
                            {selectedOrder.paymentMethod}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="mb-6">
                      <h3 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2 text-gray-900">
                        <ShoppingBag className="w-5 h-5 text-[#8B1F1F]" />
                        Order Items
                      </h3>
                      <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                        {selectedOrder.orderItems.map((item, index) => (
                          <div key={index} className="flex gap-3 sm:gap-4 pb-3 border-b last:border-b-0 bg-white p-3 rounded-lg">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm sm:text-base line-clamp-2">{item.title}</p>
                              <p className="text-xs text-[#8B1F1F] font-mono mt-0.5">{item.productId}</p>
                              <p className="text-xs sm:text-sm text-gray-600 mt-1">Quantity: {item.quantity}</p>
                              <p className="font-bold text-sm sm:text-base text-[#8B1F1F] mt-1">₹{item.price}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t-2 bg-gradient-to-r from-[#8B1F1F]/5 to-[#6B1515]/5 p-4 rounded-lg">
                        <div className="flex justify-between text-lg sm:text-xl font-bold">
                          <span>Total Amount</span>
                          <span className="text-[#8B1F1F]">₹{selectedOrder.totalAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2 text-gray-900">
                        <MapPin className="w-5 h-5 text-[#8B1F1F]" />
                        Shipping Address
                      </h3>
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-5 rounded-lg border-2 border-gray-200">
                        <p className="font-bold text-base sm:text-lg text-gray-900 mb-2">{selectedOrder.shippingAddress.fullName}</p>
                        <p className="text-sm sm:text-base text-gray-700 flex items-center gap-2 mb-2">
                          <Phone className="w-4 h-4 text-[#8B1F1F]" />
                          {selectedOrder.shippingAddress.phone}
                        </p>
                        <p className="text-sm sm:text-base text-gray-700 mt-3">
                          {selectedOrder.shippingAddress.addressLine1}
                          {selectedOrder.shippingAddress.addressLine2 && `, ${selectedOrder.shippingAddress.addressLine2}`}
                        </p>
                        <p className="text-sm sm:text-base text-gray-700">
                          {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}
                        </p>
                        <p className="text-sm sm:text-base text-gray-700 font-medium mt-1">{selectedOrder.shippingAddress.country}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
