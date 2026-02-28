"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  Phone,
  Mail,
  Home,
  ShoppingCart,
  ShieldAlert,
} from "lucide-react";
import Navbar from "@/components/navbar";

function OrderFailureContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("paymentId");
  const error = searchParams.get("error") || "Order creation failed";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Failure Receipt Card */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-red-100">
            {/* Header */}
            <div className="bg-red-50 px-6 py-8 text-center border-b border-red-100">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-4">
                <ShieldAlert className="w-10 h-10 text-red-600" />
              </div>
              <h1 className="text-3xl font-black text-gray-900 mb-2">
                Order Processing Issue
              </h1>
              <p className="text-red-600 font-medium">
                Payment Received, but Order sync failed
              </p>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="bg-orange-50 rounded-2xl p-6 mb-8 border border-orange-100">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <AlertCircle className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-orange-900 mb-1">
                      What happened?
                    </h3>
                    <p className="text-orange-800 text-sm leading-relaxed">
                      Your payment of was successful, but there was a technical
                      glitch while saving your order details.
                      <strong> Don't worry, your money is safe!</strong>
                    </p>
                  </div>
                </div>
              </div>

              {/* Reference Info */}
              <div className="space-y-6 mb-8">
                <div className="flex justify-between items-center py-4 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">Payment ID</span>
                  <span className="text-gray-900 font-bold font-mono">
                    {paymentId || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">
                    Error Details
                  </span>
                  <span className="text-red-600 font-semibold text-right max-w-[200px] truncate">
                    {error}
                  </span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">Status</span>
                  <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider">
                    Action Required
                  </span>
                </div>
              </div>

              {/* Support Info */}
              <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-widest">
                  Next Steps
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                      <Phone className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700 font-medium">
                      +91 9112001140
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Mail className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-gray-700 font-medium">
                      support@kaaveridesi.com
                    </span>
                  </div>
                </div>
                <p className="mt-4 text-xs text-gray-500">
                  Please quote your Payment ID while contacting us for immediate
                  resolution.
                </p>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => router.push("/")}
                  className="flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-gray-900 text-white font-bold hover:bg-gray-800 transition-all active:scale-95"
                >
                  <Home className="w-5 h-5" />
                  Home
                </button>
                <button
                  onClick={() => router.push("/Component/Orders/MyOrdersPage")}
                  className="flex items-center justify-center gap-2 py-4 px-6 rounded-2xl border-2 border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-all active:scale-95"
                >
                  <ShoppingCart className="w-5 h-5" />
                  My Orders
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderFailurePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
      }
    >
      <OrderFailureContent />
    </Suspense>
  );
}
