"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Heart,
  Zap,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Check,
  Truck,
  Shield,
  Package,
  Star,
  Share2,
  RefreshCcw,
  Award,
  Clock,
  MapPin,
  BadgeCheck,
} from "lucide-react";
import Navbar from "@/components/navbar";
import ReviewSection from "../../Component/Testimonials/ReviewSection/page";
import apiClient from "@/lib/api";
import { convertToBaseUnit } from "@/lib/unitConversion";

interface MemoryBook {
  id: string;
  title: string;
  price: string;
  description: string;
  image: string;
}

function ProductContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [loading, setLoading] = useState(false);

  // Cart states
  const [isInCart, setIsInCart] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);

  // Wishlist states
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    const storedProduct = localStorage.getItem("selectedProduct");
    if (storedProduct) {
      setSelectedProduct(JSON.parse(storedProduct));
    }
  }, []);

  const title = selectedProduct?.title || searchParams.get("title");
  const description =
    selectedProduct?.description || searchParams.get("description");
  const image12 = selectedProduct?.image || searchParams.get("image");
  const pid = selectedProduct?.id || searchParams.get("id");
  // Build variants: include base variant as first entry, then additional variants
  const buildVariants = () => {
    const bv = selectedProduct?.baseVariant;
    const baseEntry = bv
      ? {
          label: bv.label,
          value: bv.quantity,
          unit: bv.unit,
          priceIncrement: 0,
        }
      : null;
    const additionalVariants =
      selectedProduct?.variants?.length > 0 ? selectedProduct.variants : [];
    if (baseEntry) {
      return [baseEntry, ...additionalVariants];
    }
    return additionalVariants.length > 0
      ? additionalVariants
      : [
          { label: "500 gm", value: 50, priceIncrement: 0 },
          { label: "1 Kg", value: 100, priceIncrement: 300 },
          { label: "2 Kg", value: 200, priceIncrement: 500 },
        ];
  };
  const variants = buildVariants();

  const basePriceString = (
    selectedProduct?.baseVariant?.price ||
    selectedProduct?.basePrice ||
    selectedProduct?.price ||
    searchParams.get("price") ||
    "699"
  ).toString();
  const basePrice = Number(basePriceString.replace(/[^0-9]/g, "")) || 699;

  const availableVariants = variants.filter((option: any) => {
    const requiredQuantity = convertToBaseUnit(
      option.value || 0,
      option.unit || selectedProduct?.unit || "",
      selectedProduct?.unit || "",
    );
    return (selectedProduct?.currentStock ?? 0) >= requiredQuantity;
  });

  const isOutOfStock = availableVariants.length === 0;

  // Safe initialization for selectedPages
  const [selectedPages, setSelectedPages] = useState<number>(0);

  // Update selectedPages when variants are loaded
  useEffect(() => {
    if (
      availableVariants &&
      availableVariants.length > 0 &&
      selectedPages === 0
    ) {
      setSelectedPages(availableVariants[0].value);
    }
  }, [availableVariants, selectedPages]);

  const getPriceByPages = () => {
    const variant = variants.find((v: any) => v.value === selectedPages);
    return basePrice + (variant?.priceIncrement || 0);
  };

  const finalPrice = getPriceByPages();

  // Compute discount
  const discountPercent = selectedProduct?.discountPercent || 0;
  const discountedPrice =
    discountPercent > 0
      ? Math.round(finalPrice * (1 - discountPercent / 100))
      : finalPrice;

  const getQuantityLabel = (val: number) => {
    const variant = variants.find((v: any) => v.value === val);
    return variant?.label || `${val} units`;
  };

  useEffect(() => {
    const checkCartStatus = async () => {
      if (!pid) return;
      try {
        setCartLoading(true);
        const userString = localStorage.getItem("user");
        if (!userString) {
          setCartLoading(false);
          return;
        }

        const user = JSON.parse(userString);
        const response = await apiClient.get(
          `/checkcart?userId=${user._id}&productId=${pid}&quantityType=${selectedPages}`,
        );
        const data = response.data;

        if (data.success) {
          setIsInCart(data.isInCart);
        }
      } catch (error) {
        console.error("Cart check error:", error);
      } finally {
        setCartLoading(false);
      }
    };

    checkCartStatus();
  }, [pid, selectedPages]);

  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!pid) return;
      try {
        setWishlistLoading(true);
        const userString = localStorage.getItem("user");
        if (!userString) {
          setWishlistLoading(false);
          return;
        }

        const user = JSON.parse(userString);
        const response = await apiClient.get(
          `/checkwishlist?userId=${user._id}&productId=${pid}`,
        );
        const data = response.data;

        if (data.success) {
          setIsInWishlist(data.isInWishlist);
        }
      } catch (error) {
        console.error("Wishlist check error:", error);
      } finally {
        setWishlistLoading(false);
      }
    };

    checkWishlistStatus();
  }, [pid]);

  const product: MemoryBook = {
    id: pid || "",
    title: title || "",
    price: basePrice.toString() + " Rs",
    description: description || "",
    image: image12 || "",
  };

  const handleBuyNow = () => {
    localStorage.setItem(
      "checkoutData",
      JSON.stringify({
        buyNow: true,
        id: product.id,
        image: product.image,
        title: `${product.title} - ${getQuantityLabel(selectedPages)}`,
        price: discountedPrice.toString(),
        description: product.description,
        quantity: 1,
        quantityType: selectedPages,
      }),
    );
    router.push(`/Component/CheckOut`);
  };

  const handleAddToCart = async () => {
    if (isInCart) {
      alert("Item already in cart!");
      return;
    }

    setLoading(true);
    try {
      const userString = localStorage.getItem("user");
      if (!userString) {
        alert("Please login to add items to cart");
        return;
      }

      const user = JSON.parse(userString);
      const userId = user._id;

      const response = await apiClient.post(`/addtocart`, {
        userId: userId,
        productId: pid,
        image: image12,
        title: `${title} - ${getQuantityLabel(selectedPages)}`,
        price: discountedPrice,
        quantityType: selectedPages,
      });

      const data = response.data;

      if (data.success) {
        setIsInCart(true);
        console.log("Added to cart successfully");
      } else {
        console.error("Failed to add to cart:", data.message);
        alert("Failed to add item to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Consolidate media from the new 'media' array OR legacy fields
  const getProductMedia = () => {
    let media = [];

    // 1. Try the new 'media' array first
    if (
      selectedProduct?.media &&
      Array.isArray(selectedProduct.media) &&
      selectedProduct.media.length > 0
    ) {
      media = selectedProduct.media.map((src: string) => ({
        type:
          src.startsWith("data:video") ||
          src.includes(".mp4") ||
          src.includes(".mov")
            ? "video"
            : "image",
        src,
      }));
    }
    // 2. Fallback to legacy fields if 'media' is empty
    else {
      if (selectedProduct?.image)
        media.push({ type: "image", src: selectedProduct.image });
      if (
        selectedProduct?.image2 &&
        selectedProduct.image2 !== selectedProduct.image
      )
        media.push({ type: "image", src: selectedProduct.image2 });
      if (selectedProduct?.videoUrl)
        media.push({ type: "video", src: selectedProduct.videoUrl });
    }

    // 3. Fallback to search params if still empty (for direct links)
    if (media.length === 0) {
      const paramImg = searchParams.get("image");
      const paramImg2 = searchParams.get("image2");
      const paramVid = searchParams.get("videoUrl");

      if (paramImg) media.push({ type: "image", src: paramImg });
      if (paramImg2 && paramImg2 !== paramImg)
        media.push({ type: "image", src: paramImg2 });
      if (paramVid) media.push({ type: "video", src: paramVid });
    }

    // Filter out any empty strings and ensure at least one placeholder exists
    const filteredMedia = media.filter(
      (m: { type: string; src: string }) => m.src && m.src.trim() !== "",
    );
    return filteredMedia.length > 0
      ? filteredMedia
      : [{ type: "image", src: "/placeholder.jpg" }];
  };

  const productMedia = getProductMedia();

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? productMedia.length - 1 : prev - 1,
    );
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) =>
      prev === productMedia.length - 1 ? 0 : prev + 1,
    );
  };

  const handleToggleWishlist = async () => {
    setLoading(true);
    try {
      const userString = localStorage.getItem("user");

      if (!userString) {
        alert("Please login to manage wishlist");
        return;
      }

      const user = JSON.parse(userString);
      const userId = user._id;

      if (isInWishlist) {
        const response = await apiClient.post(`/removefromwishlist`, {
          userId: userId,
          productId: pid,
        });

        const data = response.data;

        if (data.success) {
          setIsInWishlist(false);
        }
      } else {
        const response = await apiClient.post(`/addtowishlist`, {
          userId: userId,
          productId: pid,
          image: image12,
          title: title,
          price: discountedPrice,
        });

        const data = response.data;

        if (data.success) {
          setIsInWishlist(true);
        }
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6 flex items-center gap-2 overflow-x-auto whitespace-nowrap"
        >
          <button
            onClick={() => router.push("/")}
            className="hover:text-[#8B1F1F] transition-colors"
          >
            Home
          </button>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate">{title}</span>
        </motion.nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
          {/* Product Image Gallery Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 lg:sticky lg:top-8 h-fit"
          >
            {/* Main Display */}
            <div className="relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 mb-4 group">
              {productMedia[selectedImageIndex].type === "image" ? (
                <motion.img
                  key={selectedImageIndex}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: isZoomed ? 1.5 : 1 }}
                  transition={{ duration: 0.3 }}
                  src={productMedia[selectedImageIndex].src || ""}
                  alt={`${title} - View ${selectedImageIndex + 1}`}
                  className={`w-full h-full object-cover transition-transform duration-500 ${
                    isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
                  }`}
                  onClick={() => setIsZoomed(!isZoomed)}
                />
              ) : (
                <video
                  src={productMedia[selectedImageIndex].src || ""}
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls={false}
                  className="w-full h-full object-cover"
                  key={
                    productMedia[selectedImageIndex].src || selectedImageIndex
                  }
                />
              )}

              {/* Navigation Arrows */}
              <motion.button
                whileHover={{ scale: 1.1, x: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePrevImage}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 sm:p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1, x: 2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNextImage}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 sm:p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800" />
              </motion.button>

              {/* Zoom Indicator */}
              {!isZoomed && (
                <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-black/60 backdrop-blur-sm text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm flex items-center gap-1 sm:gap-2">
                  <ZoomIn className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Click to zoom</span>
                </div>
              )}

              {/* Counter */}
              <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 bg-black/60 backdrop-blur-sm text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                {selectedImageIndex + 1} / {productMedia.length}
              </div>

              {/* Badge */}
              <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-gradient-to-r from-[#8B1F1F] to-[#6B1515] text-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-lg">
                ⚡ Fresh Dairy
              </div>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
              {productMedia.map(
                (item: { type: string; src: string }, index: number) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index
                        ? "border-[#8B1F1F] shadow-lg"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {item.type === "image" ? (
                      <img
                        src={item.src || ""}
                        className="w-full h-full object-cover"
                        alt={`Thumbnail ${index + 1}`}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white text-xs sm:text-sm font-medium">
                        ▶ Video
                      </div>
                    )}
                  </motion.button>
                ),
              )}
            </div>
          </motion.div>

          {/* Product Details Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4 sm:space-y-6"
          >
            {/* Title, Rating and Price */}
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
              {/* Rating */}
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <span className="text-xs sm:text-sm text-gray-600">
                  (4.8 from 230 reviews)
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
                {title}
              </h1>

              <div className="flex flex-wrap items-center gap-3 mb-4 sm:mb-6">
                <span className="text-3xl sm:text-4xl font-bold text-gray-900">
                  ₹{discountedPrice}
                </span>
                {discountPercent > 0 && (
                  <>
                    <span className="text-lg sm:text-xl text-gray-500 line-through">
                      ₹{finalPrice}
                    </span>
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="px-3 py-1 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-bold rounded-full shadow-md"
                    >
                      Save {discountPercent}%
                    </motion.span>
                  </>
                )}
              </div>

              <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4 sm:mb-6">
                {description}
              </p>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="flex flex-col items-center p-2 sm:p-3 bg-blue-50 rounded-lg"
                >
                  <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mb-1" />
                  <span className="text-xs sm:text-sm font-medium text-blue-900 text-center">
                    Free Delivery
                  </span>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="flex flex-col items-center p-2 sm:p-3 bg-green-50 rounded-lg"
                >
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mb-1" />
                  <span className="text-xs sm:text-sm font-medium text-green-900 text-center">
                    100% Fresh
                  </span>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="flex flex-col items-center p-2 sm:p-3 bg-purple-50 rounded-lg"
                >
                  <RefreshCcw className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 mb-1" />
                  <span className="text-xs sm:text-sm font-medium text-purple-900 text-center">
                    7-Day Return
                  </span>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="flex flex-col items-center p-2 sm:p-3 bg-orange-50 rounded-lg"
                >
                  <Award className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 mb-1" />
                  <span className="text-xs sm:text-sm font-medium text-orange-900 text-center">
                    Premium Quality
                  </span>
                </motion.div>
              </div>

              {/* Quantity Selection */}
              {!isOutOfStock && (
                <div className="mb-6">
                  <label className="block text-base sm:text-lg font-semibold mb-3">
                    Select Quantity:
                  </label>
                  <div className="space-y-2 sm:space-y-3">
                    {availableVariants.map((option: any) => (
                      <motion.label
                        key={option.value}
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        className={`relative flex items-center gap-3 p-3 sm:p-4 border-2 rounded-xl transition-all cursor-pointer ${
                          selectedPages === option.value
                            ? "border-[#8B1F1F] bg-red-50 shadow-md"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                        }`}
                      >
                        <input
                          type="radio"
                          name="pages"
                          value={option.value}
                          checked={selectedPages === option.value}
                          onChange={() => setSelectedPages(option.value)}
                          className="w-4 h-4 sm:w-5 sm:h-5 accent-[#8B1F1F]"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm sm:text-base">
                              {option.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-gray-900 font-bold text-sm sm:text-base">
                              ₹{basePrice + (option.priceIncrement || 0)}
                            </span>
                            {option.priceIncrement > 0 && (
                              <span className="text-xs sm:text-sm text-green-600 font-medium">
                                (+₹{option.priceIncrement})
                              </span>
                            )}
                          </div>
                        </div>
                        {selectedPages === option.value && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-6 h-6 bg-[#8B1F1F] rounded-full flex items-center justify-center"
                          >
                            <Check className="w-4 h-4 text-white" />
                          </motion.div>
                        )}
                      </motion.label>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                {isOutOfStock ? (
                  <div className="w-full bg-red-100 border-2 border-red-300 text-red-700 font-bold py-3 sm:py-4 px-6 rounded-xl flex items-center justify-center gap-2 text-sm sm:text-base">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                    </svg>
                    Out of Stock
                  </div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleBuyNow}
                    className="w-full bg-gradient-to-r from-[#8B1F1F] to-[#6B1515] hover:from-[#6B1515] hover:to-[#8B1F1F] text-white font-bold py-3 sm:py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-red-900/30 hover:shadow-xl hover:shadow-red-900/40 text-sm sm:text-base"
                  >
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                    Buy Now - Fast Checkout
                  </motion.button>
                )}

                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {/* Add to Cart Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToCart}
                    disabled={
                      loading || cartLoading || isInCart || isOutOfStock
                    }
                    className={`font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl border-2 flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm ${
                      isInCart
                        ? "bg-green-50 border-green-400 text-green-800"
                        : "bg-white hover:bg-gray-50 text-gray-900 border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {cartLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                        <span className="hidden sm:inline">Checking</span>
                      </>
                    ) : isInCart ? (
                      <>
                        <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="hidden sm:inline">In Cart</span>
                      </>
                    ) : loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
                        <span className="hidden sm:inline">Adding</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="hidden sm:inline">Add to Cart</span>
                      </>
                    )}
                  </motion.button>

                  {/* Wishlist Toggle Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleToggleWishlist}
                    disabled={loading || wishlistLoading}
                    className={`font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl border-2 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm ${
                      isInWishlist
                        ? "bg-pink-50 border-pink-500 text-pink-600"
                        : "bg-white hover:bg-gray-50 border-gray-300 text-gray-900 hover:border-gray-400"
                    }`}
                  >
                    {wishlistLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
                        <span className="hidden sm:inline">Checking</span>
                      </>
                    ) : isInWishlist ? (
                      <>
                        <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-pink-600" />
                        <span className="hidden sm:inline">Saved</span>
                      </>
                    ) : loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
                        <span className="hidden sm:inline">Saving</span>
                      </>
                    ) : (
                      <>
                        <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="hidden sm:inline">Wishlist</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Product Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8"
            >
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 sm:w-6 sm:h-6 text-[#8B1F1F]" />
                What You Get
              </h2>
              <ul className="space-y-3">
                {[
                  {
                    icon: "🚚",
                    text: "Free delivery within 2-3 days",
                    highlight: "Fast shipping",
                  },
                  {
                    icon: "🔄",
                    text: "7-day hassle-free return policy",
                    highlight: "Easy returns",
                  },
                  {
                    icon: "💳",
                    text: "Cash on delivery available",
                    highlight: "COD available",
                  },
                  {
                    icon: "✅",
                    text: "100% authentic KAAVERI products",
                    highlight: "Authentic",
                  },
                  {
                    icon: "📞",
                    text: "24/7 customer support",
                    highlight: "Always here",
                  },
                ].map((feature, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-start gap-3 p-2 sm:p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <span className="text-xl sm:text-2xl flex-shrink-0">
                      {feature.icon}
                    </span>
                    <div>
                      <span className="text-sm sm:text-base text-gray-700">
                        {feature.text}
                      </span>
                      <span className="block text-xs text-gray-500 mt-0.5">
                        {feature.highlight}
                      </span>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </div>
      <ReviewSection />
    </div>
  );
}

function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-[#8B1F1F] border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-gray-600 font-medium text-lg">
              Loading product details...
            </p>
          </div>
        </div>
      }
    >
      <ProductContent />
    </Suspense>
  );
}

export default Page;
