'use client'
import React from 'react'
import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-red-900 to-red-950 text-amber-50 py-16">
      <div className="container mx-auto px-4">
        {/* Top Section - Logo and Brand */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="/Images/logo.png" 
                alt="Kaaveri Desi Logo" 
                className="w-12 h-12 object-contain"
              />
              <div className="flex flex-col leading-tight">
                <span className="text-xl font-bold text-amber-100 tracking-wider">KAAVERI</span>
                <span className="text-sm font-semibold text-amber-100">देशी</span>
              </div>
            </div>
            <p className="text-amber-100 text-sm leading-relaxed">
              Pure, traditionally prepared ghee, achar, and jaggery. Experience authentic taste rooted in heritage.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-amber-100 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-amber-50 hover:text-amber-200 transition">Home</Link></li>
              <li><Link href="/about" className="text-amber-50 hover:text-amber-200 transition">About Us</Link></li>
              <li><Link href="/faq" className="text-amber-50 hover:text-amber-200 transition">FAQ</Link></li>
            </ul>
          </div>

          {/* Help & Support */}
          <div>
            <h4 className="text-lg font-bold text-amber-100 mb-4">Help & Support</h4>
            <ul className="space-y-2">
              <li><Link href="/shipping" className="text-amber-50 hover:text-amber-200 transition">Shipping & Returns</Link></li>
              <li><Link href="/privacy" className="text-amber-50 hover:text-amber-200 transition">Privacy Policy</Link></li>
              <li>
                <a 
                  href="https://wa.me/919289148411" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-amber-50 hover:text-amber-200 transition"
                >
                  WhatsApp Support
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold text-amber-100 mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-amber-200 mt-1 flex-shrink-0" />
                <div>
                  <a href="tel:+919289148411" className="text-amber-50 hover:text-amber-200 transition">
                    +91 92891 48411
                  </a>
                  <p className="text-amber-200 text-sm">Available 24/7</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-amber-200 mt-1 flex-shrink-0" />
                <a 
                  href="mailto:support@kaaveridesi.com" 
                  className="text-amber-50 hover:text-amber-200 transition break-all"
                >
                  support@kaaveridesi.com
                </a>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-200 mt-1 flex-shrink-0" />
                <p className="text-amber-50">Delhi NCR, India</p>
              </div>
            </div>
          </div>
        </div>


        {/* Social Media & Divider */}
        <div className="border-t border-red-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Social Icons */}
            <div className="flex gap-4">
              <a 
                href="https://facebook.com/kaaveridesi" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-red-800 hover:bg-amber-200 hover:text-red-900 text-amber-50 p-3 rounded-full transition"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://twitter.com/kaaveridesi" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-red-800 hover:bg-amber-200 hover:text-red-900 text-amber-50 p-3 rounded-full transition"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="https://instagram.com/kaaveridesi" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-red-800 hover:bg-amber-200 hover:text-red-900 text-amber-50 p-3 rounded-full transition"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://linkedin.com/company/kaaveridesi" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-red-800 hover:bg-amber-200 hover:text-red-900 text-amber-50 p-3 rounded-full transition"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>

            {/* Copyright & Legal */}
            <div className="text-center md:text-right">
              <p className="text-amber-200 text-sm mb-2">
                © 2026 Kaaveri Desi. All rights reserved.
              </p>
              <div className="flex flex-wrap justify-center md:justify-end gap-2 text-amber-300 text-xs">
                <Link href="/shipping" className="hover:text-amber-100 transition">
                  Shipping & Returns
                </Link>
                <span>•</span>
                <Link href="/privacy" className="hover:text-amber-100 transition">
                  Privacy Policy
                </Link>
                <span>•</span>
                <Link href="/faq" className="hover:text-amber-100 transition">
                  FAQ
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 pt-8 border-t border-red-700">
          <div className="flex flex-wrap justify-center gap-6 text-amber-200 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-amber-100">✓</span>
              <span>100% Authentic Products</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-amber-100">✓</span>
              <span>Traditional Methods</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-amber-100">✓</span>
              <span>Secure Payments</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-amber-100">✓</span>
              <span>Pan India Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
