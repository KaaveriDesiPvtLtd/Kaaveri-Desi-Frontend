"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import apiClient from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  MapPin,
  CreditCard,
  Tag,
  Trash2,
  CheckCircle2,
  Info,
  Truck,
  Shield,
  Clock,
} from "lucide-react";

import Navbar from "@/components/navbar";

interface Product {
  productId: string;
  image: string;
  title: string;
  price: string;
  quantity: number;
  quantityType?: number;
}

interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [checkoutData, setCheckoutData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  const [errors, setErrors] = useState<Partial<ShippingAddress>>({});

  // Coupon states
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [isFirstOrder, setIsFirstOrder] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);
  const [showCouponHint, setShowCouponHint] = useState(false);

  useEffect(() => {
    loadRazorpay();
    loadCheckoutData();
  }, []);

  const loadRazorpay = () => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.head.appendChild(script);
  };

  const loadCheckoutData = async () => {
    try {
      const userData = localStorage.getItem("user");
      if (!userData) {
        router.push("/");
        return;
      }

      const parsedUser = JSON.parse(userData) as User;
      setUser(parsedUser);

      const storedCheckoutData = localStorage.getItem("checkoutData");
      const parsedCheckoutData = storedCheckoutData
        ? JSON.parse(storedCheckoutData)
        : null;
      setCheckoutData(parsedCheckoutData);
      const isBuyNow = parsedCheckoutData?.buyNow === true;

      let currentProducts: Product[] = [];
      if (isBuyNow) {
        const productData: Product = {
          productId: parsedCheckoutData.id || "",
          image: parsedCheckoutData.image || "",
          title: parsedCheckoutData.title || "",
          price: parsedCheckoutData.price || "0",
          quantity: parsedCheckoutData.quantity || 1,
          quantityType: parsedCheckoutData.quantityType,
        };
        currentProducts = [productData];
      } else {
        const response = await apiClient.get(`/getcart/${parsedUser._id}`);
        currentProducts = response.data.cart || [];
      }
      setProducts(currentProducts);

      // Calculate cart total
      const total = currentProducts.reduce(
        (sum, p) => sum + parseFloat(p.price) * (p.quantity || 1),
        0,
      );
      setCartTotal(total);

      // Check if first order
      const firstOrderResponse = await apiClient.get(
        `/check-first-order/${parsedUser._id}`,
      );
      setIsFirstOrder(firstOrderResponse.data.isFirstOrder);

      setLoading(false);
    } catch (error) {
      console.error("Error loading checkout data:", error);
      setLoading(false);
    }
  };

  const applyCoupon = async () => {
    if (!user || !couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    setCouponLoading(true);
    setCouponError("");

    try {
      const response = await apiClient.post(`/apply-coupon`, {
        userId: user._id,
        cartTotal: calculateSubtotal(),
        couponCode: couponCode.toUpperCase(),
      });

      if (response.data.success) {
        setCouponApplied(true);
        setCouponDiscount(response.data.discount);
        setCouponError("");
      } else {
        setCouponError(response.data.message);
        setCouponApplied(false);
        setCouponDiscount(0);
      }
    } catch (error: any) {
      setCouponError(error.response?.data?.message || "Invalid coupon code");
      setCouponApplied(false);
      setCouponDiscount(0);
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setCouponApplied(false);
    setCouponDiscount(0);
    setCouponCode("");
    setCouponError("");
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ShippingAddress> = {};

    if (!shippingAddress.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!shippingAddress.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(shippingAddress.phone)) {
      newErrors.phone = "Enter valid 10-digit mobile number";
    }

    if (!shippingAddress.addressLine1.trim()) {
      newErrors.addressLine1 = "Address is required";
    }

    if (!shippingAddress.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!shippingAddress.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!shippingAddress.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(shippingAddress.pincode)) {
      newErrors.pincode = "Enter valid 6-digit pincode";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      // Scroll to first error
      const firstErrorField = Object.keys(newErrors)[0];
      const element = document.getElementById(firstErrorField);
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = useCallback(
    (field: keyof ShippingAddress, value: string) => {
      setShippingAddress((prev) => ({
        ...prev,
        [field]: value,
      }));

      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: undefined,
        }));
      }
    },
    [errors],
  );

  const calculateSubtotal = useCallback((): number => {
    return products.reduce((total, product) => {
      return total + parseFloat(product.price) * product.quantity;
    }, 0);
  }, [products]);

  const calculateTotal = useCallback((): number => {
    const subtotal = calculateSubtotal();
    return Math.max(0, subtotal - couponDiscount);
  }, [calculateSubtotal, couponDiscount]);

  const getDiscountBadge = () => {
    if (!couponApplied || couponDiscount === 0) return null;

    if (isFirstOrder) {
      return {
        text: "FIRST10 Applied",
        subtitle: "First Order Special: 10% OFF",
        icon: "🎉",
      };
    } else if (cartTotal > 2000) {
      return {
        text: "BIG15 Applied",
        subtitle: "Big Shopper: 15% OFF",
        icon: "🛒",
      };
    }

    return {
      text: "Coupon Applied",
      subtitle: `Save ₹${couponDiscount.toFixed(2)}`,
      icon: "✨",
    };
  };

  const createRazorpayOrder = async (amount: number) => {
    try {
      const response = await apiClient.post(`/create-razorpay-order`, {
        amount: Math.round(amount * 100), // Convert to paise
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      });
      return response.data;
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
      throw error;
    }
  };

  const handleCODOrder = async () => {
    if (!validateForm() || !user) return;

    setSubmitting(true);

    try {
      const orderId = `ORD${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      const originalTotal = calculateSubtotal();

      const orderData = {
        userId: user._id,
        orderId,
        orderItems: products,
        subTotal: originalTotal,
        discountAmount: couponDiscount,
        totalAmount: calculateTotal(),
        orderStatus: "pending",
        paymentMethod: "cod",
        paymentStatus: "pending",
        shippingAddress,
        couponDiscount: couponDiscount,
      };

      const response = await apiClient.post(`/placeorder`, orderData);

      if (response.data.success) {
        const isBuyNow = checkoutData?.buyNow === true;
        if (!isBuyNow) {
          await apiClient.post(`/clearcart/${user._id}`);
        }
        localStorage.setItem("lastOrderId", orderId);
        router.push(`/orders/details`);
      } else {
        alert("Failed to place order. Please try again.");
      }
    } catch (error: any) {
      console.error("Error placing COD order:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to place order. Please try again.";
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRazorpayOrder = async () => {
    if (!validateForm() || !user || !razorpayLoaded) return;

    setSubmitting(true);

    try {
      // Step 1: Create Razorpay order on backend first
      const totalAmount = calculateTotal();
      const razorpayOrderData = await createRazorpayOrder(totalAmount);

      if (!razorpayOrderData?.id) {
        throw new Error("Failed to create payment order");
      }

      // Step 2: Generate our order ID
      const ourOrderId = `ORD${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      const originalTotal = calculateSubtotal();

      // Step 3: Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: Math.round(totalAmount * 100),
        currency: "INR",
        name: "KAAVERI देशी",
        description: `Pay ₹${totalAmount.toFixed(2)} for your order`,
        order_id: razorpayOrderData.id, // Use Razorpay order ID
        prefill: {
          name: user.name,
          email: user.email,
          contact: shippingAddress.phone || user.phone || "",
        },
        theme: {
          color: "#8B1F1F",
        },
        modal: {
          ondismiss: function () {
            setSubmitting(false);
          },
        },
        handler: async function (response: any) {
          console.log("Payment successful:", response);

          // Step 4: Create order in your database after successful payment
          const orderData = {
            userId: user._id,
            orderId: ourOrderId,
            orderItems: products,
            subTotal: originalTotal,
            discountAmount: couponDiscount,
            totalAmount: totalAmount,
            orderStatus: "confirmed",
            paymentMethod: "razorpay",
            paymentStatus: "paid",
            paymentDetails: {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            },
            shippingAddress,
            couponDiscount: couponDiscount,
          };

          try {
            console.log("Creating order with data:", orderData);

            const placeOrderResponse = await apiClient.post(
              `/placeorder`,
              orderData,
              {
                timeout: 10000, // 10 second timeout
              },
            );

            console.log("Order creation response:", placeOrderResponse.data);

            if (placeOrderResponse.data.success) {
              // Clear cart if not buy now
              const isBuyNow = checkoutData?.buyNow === true;
              if (!isBuyNow) {
                try {
                  await apiClient.post(`/clearcart/${user._id}`);
                } catch (cartError) {
                  console.error(
                    "Cart clearing failed (non-critical):",
                    cartError,
                  );
                }
              }

              localStorage.setItem("lastOrderId", ourOrderId);
              router.push(`/orders/details`);
            } else {
              throw new Error(
                placeOrderResponse.data.message || "Order creation failed",
              );
            }
          } catch (orderError: any) {
            console.error("Order creation failed:", orderError);

            const errorMsg =
              orderError.response?.data?.message ||
              orderError.message ||
              "Order creation failed";

            router.push(
              `/orders/failure?paymentId=${response.razorpay_payment_id}&error=${encodeURIComponent(errorMsg)}`,
            );

            // Optional: Send error to your backend for tracking
            try {
              await apiClient.post(`/log-payment-error`, {
                paymentId: response.razorpay_payment_id,
                orderId: ourOrderId,
                error: errorMsg,
                userId: user._id,
              });
            } catch (logError) {
              console.error("Error logging failed:", logError);
            }

            setSubmitting(false);
          }
        },
      };

      const rzp = new (window as any).Razorpay(options);

      // Add error event handler
      rzp.on("payment.failed", function (response: any) {
        console.error("Payment failed:", response.error);
        router.push(
          `/orders/failure?error=${encodeURIComponent(response.error.description)}`,
        );
        setSubmitting(false);
      });

      rzp.open();
    } catch (error: any) {
      console.error("Payment initialization error:", error);
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to initiate payment";
      router.push(`/orders/failure?error=${encodeURIComponent(errorMsg)}`);
      setSubmitting(false);
    }
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === "cod") {
      handleCODOrder();
    } else {
      handleRazorpayOrder();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-[#8B1F1F] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <ShoppingBag className="w-20 h-20 text-gray-300 mb-4" />
        <p className="text-xl font-semibold text-gray-700 mb-2">
          No items to checkout
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Add products to your cart to proceed
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/")}
          className="px-6 py-3 bg-gradient-to-r from-[#8B1F1F] to-[#6B1515] text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
        >
          Continue Shopping
        </motion.button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Secure Checkout
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Shield className="w-4 h-4 text-green-600" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-1">
              <Truck className="w-4 h-4 text-blue-600" />
              <span>Free Delivery</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-orange-600" />
              <span>Fast Processing</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <form
              onSubmit={handlePaymentSubmit}
              className="space-y-4 sm:space-y-6"
            >
              {/* COUPON SECTION - Enhanced */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200"
              >
                <div className="bg-gradient-to-r from-[#8B1F1F] to-[#6B1515] px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Tag className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-300" />
                    <h2 className="text-lg sm:text-xl font-semibold text-white">
                      Apply Coupon
                    </h2>
                  </div>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setShowCouponHint(!showCouponHint)}
                    className="text-yellow-200 hover:text-yellow-100 transition-colors"
                  >
                    <Info className="w-5 h-5" />
                  </motion.button>
                </div>

                <div className="p-4 sm:p-6">
                  <AnimatePresence>
                    {showCouponHint && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mb-4 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg overflow-hidden"
                      >
                        <p className="text-xs sm:text-sm font-semibold text-blue-900 mb-2">
                          Available Coupons:
                        </p>
                        <div className="space-y-2">
                          {isFirstOrder && (
                            <div className="flex items-start gap-2">
                              <span className="text-base sm:text-lg">🎉</span>
                              <div>
                                <p className="text-xs sm:text-sm font-medium text-blue-800">
                                  FIRST10
                                </p>
                                <p className="text-xs text-blue-600">
                                  Get 10% OFF on your first order
                                </p>
                              </div>
                            </div>
                          )}
                          {calculateSubtotal() > 2000 && (
                            <div className="flex items-start gap-2">
                              <span className="text-base sm:text-lg">🛒</span>
                              <div>
                                <p className="text-xs sm:text-sm font-medium text-blue-800">
                                  BIG15
                                </p>
                                <p className="text-xs text-blue-600">
                                  Get 15% OFF on orders above ₹2000
                                </p>
                              </div>
                            </div>
                          )}
                          {!isFirstOrder && calculateSubtotal() <= 2000 && (
                            <p className="text-xs text-blue-600">
                              Add ₹{(2001 - calculateSubtotal()).toFixed(2)}{" "}
                              more to unlock BIG15 coupon!
                            </p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {!couponApplied ? (
                    <div>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => {
                            setCouponCode(e.target.value.toUpperCase());
                            setCouponError("");
                          }}
                          placeholder="Enter coupon code (e.g., FIRST10)"
                          className="flex-1 px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1F1F] focus:border-transparent text-sm sm:text-base uppercase"
                          disabled={couponLoading}
                        />
                        <motion.button
                          type="button"
                          onClick={applyCoupon}
                          disabled={couponLoading || !couponCode.trim()}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full sm:w-auto px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-lg hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all shadow-md text-sm sm:text-base"
                        >
                          {couponLoading ? (
                            <span className="flex items-center gap-2 justify-center">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                              />
                              Applying...
                            </span>
                          ) : (
                            "Apply"
                          )}
                        </motion.button>
                      </div>

                      <AnimatePresence>
                        {couponError && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-red-600 text-xs sm:text-sm mt-2 flex items-center gap-1"
                          >
                            <span>⚠️</span> {couponError}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-sm sm:text-base text-green-900 flex items-center gap-2">
                            <span>{getDiscountBadge()?.icon}</span>
                            {getDiscountBadge()?.text}
                          </p>
                          <p className="text-xs sm:text-sm text-green-700 mt-0.5">
                            {getDiscountBadge()?.subtitle}
                          </p>
                          <p className="text-xs sm:text-sm font-semibold text-green-800 mt-1">
                            You saved ₹{couponDiscount.toFixed(2)}!
                          </p>
                        </div>
                      </div>
                      <motion.button
                        type="button"
                        onClick={removeCoupon}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-1 px-3 py-1.5 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-md transition-colors font-medium text-xs sm:text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </motion.button>
                    </motion.div>
                  )}

                  {/* Quick Apply Buttons */}
                  {!couponApplied && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {isFirstOrder && (
                        <motion.button
                          type="button"
                          onClick={() => {
                            setCouponCode("FIRST10");
                            setTimeout(applyCoupon, 100);
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium hover:bg-yellow-200 transition-colors"
                        >
                          🎉 Apply FIRST10
                        </motion.button>
                      )}
                      {calculateSubtotal() > 2000 && (
                        <motion.button
                          type="button"
                          onClick={() => {
                            setCouponCode("BIG15");
                            setTimeout(applyCoupon, 100);
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium hover:bg-blue-200 transition-colors"
                        >
                          🛒 Apply BIG15
                        </motion.button>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>

              {/* SHIPPING ADDRESS */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200"
              >
                <div className="bg-gradient-to-r from-[#8B1F1F] to-[#6B1515] px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-2 sm:gap-3">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-300" />
                  <h2 className="text-lg sm:text-xl font-semibold text-white">
                    Delivery Address
                  </h2>
                </div>

                <div className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="fullName"
                        className="block text-sm font-medium text-gray-700 mb-1.5"
                      >
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        value={shippingAddress.fullName}
                        onChange={(e) =>
                          handleInputChange("fullName", e.target.value)
                        }
                        className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                          errors.fullName
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-[#8B1F1F] focus:border-transparent"
                        }`}
                        placeholder="Enter your full name"
                      />
                      <AnimatePresence>
                        {errors.fullName && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-red-600 text-xs mt-1 flex items-center gap-1"
                          >
                            <span>⚠️</span> {errors.fullName}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Phone */}
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 mb-1.5"
                      >
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        value={shippingAddress.phone}
                        onChange={(e) =>
                          handleInputChange(
                            "phone",
                            e.target.value.replace(/\D/g, ""),
                          )
                        }
                        className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                          errors.phone
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-[#8B1F1F] focus:border-transparent"
                        }`}
                        placeholder="10-digit mobile number"
                        maxLength={10}
                      />
                      <AnimatePresence>
                        {errors.phone && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-red-600 text-xs mt-1 flex items-center gap-1"
                          >
                            <span>⚠️</span> {errors.phone}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Address Line 1 */}
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="addressLine1"
                        className="block text-sm font-medium text-gray-700 mb-1.5"
                      >
                        Address Line 1 <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="addressLine1"
                        type="text"
                        value={shippingAddress.addressLine1}
                        onChange={(e) =>
                          handleInputChange("addressLine1", e.target.value)
                        }
                        className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                          errors.addressLine1
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-[#8B1F1F] focus:border-transparent"
                        }`}
                        placeholder="House no., Building name, Street"
                      />
                      <AnimatePresence>
                        {errors.addressLine1 && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-red-600 text-xs mt-1 flex items-center gap-1"
                          >
                            <span>⚠️</span> {errors.addressLine1}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Address Line 2 */}
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="addressLine2"
                        className="block text-sm font-medium text-gray-700 mb-1.5"
                      >
                        Address Line 2{" "}
                        <span className="text-gray-400 text-xs">
                          (Optional)
                        </span>
                      </label>
                      <input
                        id="addressLine2"
                        type="text"
                        value={shippingAddress.addressLine2}
                        onChange={(e) =>
                          handleInputChange("addressLine2", e.target.value)
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1F1F] focus:border-transparent transition-all"
                        placeholder="Landmark, Area (Optional)"
                      />
                    </div>

                    {/* City */}
                    <div>
                      <label
                        htmlFor="city"
                        className="block text-sm font-medium text-gray-700 mb-1.5"
                      >
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="city"
                        type="text"
                        value={shippingAddress.city}
                        onChange={(e) =>
                          handleInputChange("city", e.target.value)
                        }
                        className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                          errors.city
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-[#8B1F1F] focus:border-transparent"
                        }`}
                        placeholder="City"
                      />
                      <AnimatePresence>
                        {errors.city && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-red-600 text-xs mt-1 flex items-center gap-1"
                          >
                            <span>⚠️</span> {errors.city}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* State */}
                    <div>
                      <label
                        htmlFor="state"
                        className="block text-sm font-medium text-gray-700 mb-1.5"
                      >
                        State <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="state"
                        type="text"
                        value={shippingAddress.state}
                        onChange={(e) =>
                          handleInputChange("state", e.target.value)
                        }
                        className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                          errors.state
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-[#8B1F1F] focus:border-transparent"
                        }`}
                        placeholder="State"
                      />
                      <AnimatePresence>
                        {errors.state && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-red-600 text-xs mt-1 flex items-center gap-1"
                          >
                            <span>⚠️</span> {errors.state}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Pincode */}
                    <div>
                      <label
                        htmlFor="pincode"
                        className="block text-sm font-medium text-gray-700 mb-1.5"
                      >
                        Pincode <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="pincode"
                        type="text"
                        value={shippingAddress.pincode}
                        onChange={(e) =>
                          handleInputChange(
                            "pincode",
                            e.target.value.replace(/\D/g, ""),
                          )
                        }
                        className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                          errors.pincode
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-[#8B1F1F] focus:border-transparent"
                        }`}
                        placeholder="6-digit pincode"
                        maxLength={6}
                      />
                      <AnimatePresence>
                        {errors.pincode && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-red-600 text-xs mt-1 flex items-center gap-1"
                          >
                            <span>⚠️</span> {errors.pincode}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Country */}
                    <div>
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium text-gray-700 mb-1.5"
                      >
                        Country
                      </label>
                      <input
                        id="country"
                        type="text"
                        value={shippingAddress.country}
                        disabled
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* PAYMENT METHOD */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200"
              >
                <div className="bg-gradient-to-r from-[#8B1F1F] to-[#6B1515] px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-2 sm:gap-3">
                  <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-300" />
                  <h2 className="text-lg sm:text-xl font-semibold text-white">
                    Payment Method
                  </h2>
                </div>

                <div className="p-4 sm:p-6 space-y-3">
                  <motion.label
                    whileHover={{ scale: 1.01 }}
                    className={`flex items-start sm:items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentMethod === "cod"
                        ? "border-[#8B1F1F] bg-red-50"
                        : "border-gray-300 hover:border-gray-400 bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={(e) =>
                        setPaymentMethod(e.target.value as "cod")
                      }
                      className="w-5 h-5 text-[#8B1F1F] mt-0.5 sm:mt-0"
                    />
                    <div className="flex-1">
                      <span className="font-semibold text-gray-900 text-sm sm:text-base">
                        Cash on Delivery (COD)
                      </span>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">
                        Pay when you receive your order
                      </p>
                    </div>
                  </motion.label>

                  <motion.label
                    whileHover={{ scale: 1.01 }}
                    className={`flex items-start sm:items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentMethod === "online"
                        ? "border-[#8B1F1F] bg-red-50"
                        : "border-gray-300 hover:border-gray-400 bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="online"
                      checked={paymentMethod === "online"}
                      onChange={(e) =>
                        setPaymentMethod(e.target.value as "online")
                      }
                      className="w-5 h-5 text-[#8B1F1F] mt-0.5 sm:mt-0"
                    />
                    <div className="flex-1">
                      <span className="font-semibold text-gray-900 text-sm sm:text-base">
                        Online Payment
                      </span>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">
                        Pay securely via Card/UPI/Netbanking
                      </p>
                    </div>
                  </motion.label>
                </div>
              </motion.div>

              {/* SUBMIT BUTTON */}
              <motion.button
                type="submit"
                disabled={submitting || !razorpayLoaded}
                whileHover={{ scale: submitting ? 1 : 1.02 }}
                whileTap={{ scale: submitting ? 1 : 0.98 }}
                className="w-full py-3.5 sm:py-4 bg-gradient-to-r from-[#8B1F1F] to-[#6B1515] text-white font-bold text-base sm:text-lg rounded-xl hover:from-[#6B1515] hover:to-[#8B1F1F] disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
              >
                {submitting ? (
                  <span className="flex items-center gap-2 justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-5 h-5 border-3 border-white border-t-transparent rounded-full"
                    />
                    Processing Order...
                  </span>
                ) : paymentMethod === "cod" ? (
                  `Place Order - ₹${calculateTotal().toFixed(2)}`
                ) : (
                  `Pay ₹${calculateTotal().toFixed(2)} Online`
                )}
              </motion.button>
            </form>
          </div>

          {/* RIGHT COLUMN - Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-xl shadow-md border border-gray-200 sticky top-4 overflow-hidden">
              <div className="bg-gradient-to-r from-[#8B1F1F] to-[#6B1515] px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-2 sm:gap-3">
                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-300" />
                <h2 className="text-lg sm:text-xl font-semibold text-white">
                  Order Summary
                </h2>
              </div>

              <div className="p-4 sm:p-6">
                {/* Product List */}
                <div className="space-y-3 sm:space-y-4 mb-4 max-h-64 overflow-y-auto">
                  {products.map((product, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-3 pb-3 border-b border-gray-200 last:border-0"
                    >
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg shadow-sm"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm sm:text-base text-gray-900 truncate">
                          {product.title}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">
                          Quantity: {product.quantity}
                        </p>
                        <p className="text-sm sm:text-base font-bold text-[#8B1F1F] mt-1">
                          ₹
                          {(
                            parseFloat(product.price) * product.quantity
                          ).toFixed(2)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2.5 pt-4 border-t-2 border-gray-200">
                  <div className="flex justify-between text-sm sm:text-base text-gray-700">
                    <span>
                      Subtotal ({products.length}{" "}
                      {products.length === 1 ? "item" : "items"})
                    </span>
                    <span className="font-semibold">
                      ₹{calculateSubtotal().toFixed(2)}
                    </span>
                  </div>

                  {couponApplied && couponDiscount > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-between text-sm sm:text-base text-green-600 font-semibold bg-green-50 px-3 py-2 rounded-lg"
                    >
                      <span className="flex items-center gap-1">
                        <Tag className="w-4 h-4" />
                        Coupon Discount
                      </span>
                      <span>-₹{couponDiscount.toFixed(2)}</span>
                    </motion.div>
                  )}

                  <div className="flex justify-between text-sm sm:text-base text-gray-700">
                    <span>Delivery Charges</span>
                    <span className="text-green-600 font-semibold">FREE</span>
                  </div>

                  <div className="flex justify-between text-lg sm:text-xl font-bold text-gray-900 pt-3 border-t-2 border-gray-200">
                    <span>Total Amount</span>
                    <span className="text-[#8B1F1F]">
                      ₹{calculateTotal().toFixed(2)}
                    </span>
                  </div>

                  {couponApplied && couponDiscount > 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-3"
                    >
                      <p className="text-xs sm:text-sm text-yellow-800 font-semibold flex items-center gap-1">
                        <span>🎉</span> You're saving ₹
                        {couponDiscount.toFixed(2)} on this order!
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-[#8B1F1F] border-t-transparent rounded-full"
          />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
