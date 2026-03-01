/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    const backendUrl = (process.env.NEXT_PUBLIC_API_URL || 'https://api-kaaveri-desi.vercel.app').replace(/\/$/, '');
    return [
      // Unified list of backend prefixes
      { source: '/otp/:path*', destination: `${backendUrl}/otp/:path*` },
      { source: '/auth/:path*', destination: `${backendUrl}/auth/:path*` },
      { source: '/features/:path*', destination: `${backendUrl}/features/:path*` },
      { source: '/placeorder/:path*', destination: `${backendUrl}/placeorder/:path*` },
      { source: '/clearcart/:path*', destination: `${backendUrl}/clearcart/:path*` },
      { source: '/getorder/:path*', destination: `${backendUrl}/getorder/:path*` },
      { source: '/getorders/:path*', destination: `${backendUrl}/getorders/:path*` },
      { source: '/checkcart/:path*', destination: `${backendUrl}/checkcart/:path*` },
      { source: '/checkwishlist/:path*', destination: `${backendUrl}/checkwishlist/:path*` },
      { source: '/check-first-order/:path*', destination: `${backendUrl}/check-first-order/:path*` },
      { source: '/apply-coupon/:path*', destination: `${backendUrl}/apply-coupon/:path*` },
      { source: '/create-razorpay-order/:path*', destination: `${backendUrl}/create-razorpay-order/:path*` },
      { source: '/users/:path*', destination: `${backendUrl}/users/:path*` },
      { source: '/orders/:path*', destination: `${backendUrl}/orders/:path*` },
      { source: '/stats/:path*', destination: `${backendUrl}/stats/:path*` },
      { source: '/allproducts/:path*', destination: `${backendUrl}/allproducts/:path*` },
      { source: '/products/:path*', destination: `${backendUrl}/products/:path*` },
      { source: '/reviews/:path*', destination: `${backendUrl}/reviews/:path*` },
      { source: '/testimonials/:path*', destination: `${backendUrl}/testimonials/:path*` },
      { source: '/addtocart/:path*', destination: `${backendUrl}/addtocart/:path*` },
      { source: '/getcart/:path*', destination: `${backendUrl}/getcart/:path*` },
      { source: '/api/crm/:path*', destination: `${backendUrl}/api/crm/:path*` },
    ];
  },
}

export default nextConfig
