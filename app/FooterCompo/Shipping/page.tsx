'use client'
import React, { useState } from 'react'
import { Package, Clock, Truck, RefreshCw, AlertCircle, Globe, CheckCircle, XCircle, Video, Mail, MessageCircle, MapPin } from 'lucide-react'
import Navbar from "../../../components/navbar"

function ShippingPage() {
  const [activeTab, setActiveTab] = useState<'cancellation' | 'replacement' | 'shipping'>('shipping')
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  return (
    <div>
      <Navbar/>
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-amber-50">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-red-900 via-red-950 to-red-900 text-amber-50 py-24 md:py-32 overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 border-4 border-amber-200 rounded-full animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-40 h-40 border-4 border-amber-200 rounded-full animate-pulse"></div>
            <div className="absolute top-1/2 right-1/4 w-24 h-24 border-4 border-amber-200 rounded-full animate-pulse delay-75"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col items-center justify-center">
              <div className="bg-amber-200 w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center mb-6 animate-bounce">
                <Truck className="w-10 h-10 md:w-12 md:h-12 text-red-900" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-center mb-4">
                Shipping & Returns Policy
              </h1>
              <div className="bg-amber-200 text-red-900 px-6 py-2 rounded-full font-bold text-sm mb-6">
                Effective Date: January 11, 2026
              </div>
              <p className="text-lg md:text-xl text-amber-100 text-center max-w-3xl">
                Fast delivery, transparent policies, and customer satisfaction guaranteed
              </p>
            </div>
          </div>
        </div>

        {/* Quick Navigation Tabs */}
        <div className="container mx-auto px-4 -mt-8 relative z-20">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-2">
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setActiveTab('shipping')}
                className={`flex flex-col sm:flex-row items-center justify-center gap-2 px-4 py-4 rounded-xl font-bold transition-all duration-300 ${
                  activeTab === 'shipping'
                    ? 'bg-gradient-to-r from-red-900 to-red-950 text-amber-50 shadow-lg'
                    : 'text-gray-600 hover:bg-amber-50'
                }`}
              >
                <Truck className="w-5 h-5" />
                <span className="text-xs sm:text-base">Shipping</span>
              </button>
              <button
                onClick={() => setActiveTab('replacement')}
                className={`flex flex-col sm:flex-row items-center justify-center gap-2 px-4 py-4 rounded-xl font-bold transition-all duration-300 ${
                  activeTab === 'replacement'
                    ? 'bg-gradient-to-r from-red-900 to-red-950 text-amber-50 shadow-lg'
                    : 'text-gray-600 hover:bg-amber-50'
                }`}
              >
                <RefreshCw className="w-5 h-5" />
                <span className="text-xs sm:text-base">Returns</span>
              </button>
              <button
                onClick={() => setActiveTab('cancellation')}
                className={`flex flex-col sm:flex-row items-center justify-center gap-2 px-4 py-4 rounded-xl font-bold transition-all duration-300 ${
                  activeTab === 'cancellation'
                    ? 'bg-gradient-to-r from-red-900 to-red-950 text-amber-50 shadow-lg'
                    : 'text-gray-600 hover:bg-amber-50'
                }`}
              >
                <AlertCircle className="w-5 h-5" />
                <span className="text-xs sm:text-base">Cancellation</span>
              </button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          {/* Introduction */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="bg-gradient-to-r from-amber-100 to-red-100 rounded-2xl p-6 md:p-8 text-center shadow-lg">
              <p className="text-lg md:text-xl text-gray-800 leading-relaxed font-medium">
                We are committed to providing high-quality, traditionally prepared ghee, milk, and jaggery. Please read our policy carefully before placing an order.
              </p>
            </div>
          </div>

          {/* Shipping Policy Tab */}
          {activeTab === 'shipping' && (
            <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
              {/* Processing Time Card */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-[1.01] transition-transform duration-300">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 md:px-8 py-6">
                  <div className="flex items-center gap-3">
                    <Clock className="w-8 h-8" />
                    <h2 className="text-2xl md:text-3xl font-bold">Order Processing Time</h2>
                  </div>
                </div>
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-4 bg-blue-50 rounded-xl p-6">
                    <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-900 mb-1">2-4 Business Days</p>
                      <p className="text-gray-600">Orders are processed and carefully packed after confirmation</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Timelines */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-red-900 to-red-950 text-amber-50 px-6 md:px-8 py-6">
                  <div className="flex items-center gap-3">
                    <Package className="w-8 h-8" />
                    <h2 className="text-2xl md:text-3xl font-bold">Shipping Timelines</h2>
                  </div>
                </div>
                <div className="p-6 md:p-8">
                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    {/* Express Shipping */}
                    <div className="group bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 text-center border-2 border-green-200 hover:border-green-500 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl">
                      <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <Truck className="w-8 h-8 text-white" />
                      </div>
                      <p className="font-bold text-green-900 mb-2 text-lg">Express Shipping</p>
                      <p className="text-gray-600 text-sm mb-3">Metro & Tier-1 Cities</p>
                      <div className="bg-white rounded-lg py-3 px-4">
                        <p className="text-4xl font-bold text-green-600">2-4</p>
                        <p className="text-gray-600 text-sm">days</p>
                      </div>
                      <div className="mt-4">
                        <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-xs font-bold">⚡ Fastest</span>
                      </div>
                    </div>

                    {/* Standard Shipping */}
                    <div className="group bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl">
                      <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <MapPin className="w-8 h-8 text-white" />
                      </div>
                      <p className="font-bold text-blue-900 mb-2 text-lg">Standard Shipping</p>
                      <p className="text-gray-600 text-sm mb-3">PAN India</p>
                      <div className="bg-white rounded-lg py-3 px-4">
                        <p className="text-4xl font-bold text-blue-600">4-9</p>
                        <p className="text-gray-600 text-sm">days</p>
                      </div>
                      <div className="mt-4">
                        <span className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-xs font-bold">🇮🇳 Nationwide</span>
                      </div>
                    </div>

                    {/* International Shipping */}
                    <div className="group bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 text-center border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl">
                      <div className="bg-purple-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <Globe className="w-8 h-8 text-white" />
                      </div>
                      <p className="font-bold text-purple-900 mb-2 text-lg">International</p>
                      <p className="text-gray-600 text-sm mb-3">Global Delivery</p>
                      <div className="bg-white rounded-lg py-3 px-4">
                        <p className="text-4xl font-bold text-purple-600">10-12</p>
                        <p className="text-gray-600 text-sm">days</p>
                      </div>
                      <div className="mt-4">
                        <span className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-xs font-bold">🌍 Worldwide</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg">
                    <p className="text-gray-700 text-sm italic flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      Delivery timelines are estimates and may vary due to logistics delays, weather conditions, or customs clearance.
                    </p>
                  </div>
                </div>
              </div>

              {/* Tracking Information */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 md:p-8 shadow-lg border-2 border-green-200">
                <h3 className="text-2xl font-bold text-green-900 mb-6 flex items-center gap-3">
                  <CheckCircle className="w-7 h-7" />
                  Dispatch & Tracking
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl p-5 text-center shadow-md">
                    <div className="text-4xl mb-3">📧</div>
                    <p className="font-bold text-green-900 mb-1">Step 1</p>
                    <p className="text-sm text-gray-600">Dispatch notification sent</p>
                  </div>
                  <div className="bg-white rounded-xl p-5 text-center shadow-md">
                    <div className="text-4xl mb-3">📲</div>
                    <p className="font-bold text-green-900 mb-1">Step 2</p>
                    <p className="text-sm text-gray-600">Tracking ID via SMS/Email</p>
                  </div>
                  <div className="bg-white rounded-xl p-5 text-center shadow-md">
                    <div className="text-4xl mb-3">📦</div>
                    <p className="font-bold text-green-900 mb-1">Step 3</p>
                    <p className="text-sm text-gray-600">Real-time order tracking</p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm mt-4 text-center">
                  ⏱️ Tracking details become active within 24-48 hours
                </p>
              </div>

              {/* International Orders */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 md:px-8 py-6">
                  <div className="flex items-center gap-3">
                    <Globe className="w-8 h-8" />
                    <h2 className="text-2xl md:text-3xl font-bold">International Orders</h2>
                  </div>
                </div>
                <div className="p-6 md:p-8">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 bg-purple-50 rounded-xl p-5">
                      <AlertCircle className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-bold text-purple-900 mb-1">Customs & Duties</p>
                        <p className="text-gray-700">Applicable customs duties, taxes, or import charges must be borne by the customer</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 bg-purple-50 rounded-xl p-5">
                      <AlertCircle className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-bold text-purple-900 mb-1">Customs Delays</p>
                        <p className="text-gray-700">We are not responsible for delays caused by customs procedures or country-specific regulations</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Replacement Policy Tab */}
          {activeTab === 'replacement' && (
            <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 md:px-8 py-6">
                  <div className="flex items-center gap-3">
                    <RefreshCw className="w-8 h-8" />
                    <h2 className="text-2xl md:text-3xl font-bold">Replacement Policy</h2>
                  </div>
                </div>
                <div className="p-6 md:p-8">
                  <div className="bg-amber-50 border-l-4 border-amber-500 p-6 mb-6 rounded-lg">
                    <p className="text-gray-700 text-lg leading-relaxed">
                      Replacement requests will be considered only in cases where the product is received in a <strong className="text-amber-900">damaged, leaked, expired, or incorrect</strong> condition.
                    </p>
                  </div>

                  {/* Requirements */}
                  <h3 className="text-2xl font-bold text-red-900 mb-6">Requirements for Replacement:</h3>
                  <div className="space-y-4 mb-8">
                    <div className="bg-gradient-to-r from-red-50 to-amber-50 rounded-xl p-5 flex items-start gap-4 border-2 border-red-200">
                      <div className="bg-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold">1</div>
                      <div className="flex-1">
                        <p className="font-bold text-red-900 mb-1">Notify Within 2 Days</p>
                        <p className="text-gray-700">Contact us within 2 days of receiving the order</p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-red-50 to-amber-50 rounded-xl p-5 flex items-start gap-4 border-2 border-red-200">
                      <div className="bg-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold">2</div>
                      <div className="flex-1">
                        <p className="font-bold text-red-900 mb-1 flex items-center gap-2">
                          <Video className="w-5 h-5" />
                          Unboxing Video Required
                        </p>
                        <p className="text-gray-700">Provide an unedited unboxing video clearly showing the package, seal, and product condition</p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-red-50 to-amber-50 rounded-xl p-5 flex items-start gap-4 border-2 border-red-200">
                      <div className="bg-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold">3</div>
                      <div className="flex-1">
                        <p className="font-bold text-red-900 mb-2">Submit Evidence</p>
                        <p className="text-gray-700 mb-3">Share the complete video via:</p>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <a href="mailto:support@kaaveridesi.com" className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg text-red-900 font-semibold hover:bg-red-100 transition-colors">
                            <Mail className="w-4 h-4" />
                            Email
                          </a>
                          <a href="https://wa.me/919289148411" className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg text-green-600 font-semibold hover:bg-green-50 transition-colors">
                            <MessageCircle className="w-4 h-4" />
                            WhatsApp
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
                    <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
                      <Clock className="w-6 h-6" />
                      Processing Timeline
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <p className="text-gray-700">Review of submitted evidence</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <p className="text-gray-700">Approval/rejection notification sent</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <p className="text-gray-700"><strong>Approved replacements processed within 24-48 hours</strong></p>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <p className="text-gray-700">Store credit may be issued if replacement is not feasible</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cancellation Policy Tab */}
          {activeTab === 'cancellation' && (
            <div className="max-w-4xl mx-auto animate-fade-in">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 md:px-8 py-6">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-8 h-8" />
                    <h2 className="text-2xl md:text-3xl font-bold">Cancellation Policy</h2>
                  </div>
                </div>
                <div className="p-6 md:p-8">
                  {/* Important Notice */}
                  <div className="bg-gradient-to-r from-red-100 to-red-200 border-l-4 border-red-600 p-8 mb-6 rounded-xl">
                    <div className="flex items-start gap-4">
                      <XCircle className="w-12 h-12 text-red-600 flex-shrink-0" />
                      <div>
                        <p className="text-red-900 font-bold text-xl mb-3">⚠️ Important Notice</p>
                        <p className="text-gray-800 text-lg leading-relaxed">
                          Once an order has been placed, it <strong className="text-red-700">cannot be cancelled, modified, or refunded</strong> under any circumstances.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Explanation */}
                  <div className="bg-amber-50 rounded-xl p-6">
                    <h3 className="font-bold text-red-900 text-lg mb-3 flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      Why This Policy?
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      As our products are food items and are prepared, packed, and dispatched with care, we request customers to review their order details carefully before completing the purchase.
                    </p>
                  </div>

                  {/* Checklist */}
                  <div className="mt-8 bg-green-50 rounded-xl p-6 border-2 border-green-200">
                    <h3 className="font-bold text-green-900 text-lg mb-4">✅ Before Placing Your Order:</h3>
                    <div className="space-y-3">
                      {[
                        'Double-check product selection',
                        'Verify quantity and variants',
                        'Confirm delivery address',
                        'Review total amount and payment details'
                      ].map((item, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="bg-green-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </div>
                          <p className="text-gray-700">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contact Section */}
          <div className="max-w-4xl mx-auto mt-16">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-red-900 via-red-950 to-red-900"></div>
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)'
              }}></div>
              
              <div className="relative z-10 p-8 md:p-12">
                <div className="text-center mb-8">
                  <div className="text-5xl mb-4">📞</div>
                  <h2 className="text-3xl md:text-4xl font-bold text-amber-50 mb-3">Questions About Your Order?</h2>
                  <p className="text-lg text-amber-100">
                    Contact us for any clarifications regarding shipping or replacements
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  <a 
                    href="mailto:support@kaaveridesi.com"
                    className="bg-amber-200 hover:bg-amber-300 text-red-900 font-bold px-6 py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
                  >
                    <Mail className="w-6 h-6" />
                    <span>Email Support</span>
                  </a>
                  <a 
                    href="https://wa.me/919289148411"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white hover:bg-amber-50 text-red-900 font-bold px-6 py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
                  >
                    <MessageCircle className="w-6 h-6" />
                    <span>WhatsApp Chat</span>
                  </a>
                </div>

                <div className="text-center mt-6 text-amber-100">
                  <p>📱 +91 92891 48411</p>
                </div>
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
          animation: fade-in 0.5s ease-out;
        }
        .delay-75 {
          animation-delay: 0.75s;
        }
      `}</style>
    </div>
  )
}

export default ShippingPage
