import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Footer from "@/components/footer";

// import "../public/Images/logo.png"

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kaaveri Desi - Fresh Milk Delivery",
  description:
    "Order fresh, pure milk delivered to your doorstep. Experience authentic dairy excellence with Kaaveri Desi.",
  generator: "Shubh",
  icons: {
    icon: "/Images/logo.png",
  },
  openGraph: {
    title: "Kaaveri Desi - Fresh Milk Delivery",
    description:
      "Order fresh, pure milk delivered to your doorstep. Experience authentic dairy excellence with Kaaveri Desi.",
    // url: 'https://kaaveridesi.com',
    siteName: "Kaaveri Desi",
    images: [
      {
        url: "/Images/logo.png",
        width: 1200,
        height: 1200,
        alt: "Kaaveri Desi Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kaaveri Desi - Fresh Milk Delivery",
    description: "Order fresh, pure milk delivered to your doorstep.",
    images: ["/Images/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />

        <Footer />
      </body>
    </html>
  );
}
