'use client'
import React, { useState, useEffect } from 'react'
import { Shield, Lock, Eye, FileText, UserCheck, Mail, Cookie, ExternalLink, AlertCircle, CheckCircle } from 'lucide-react'
import Navbar from "../../../components/navbar"

function PrivacyPage() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight
      const currentProgress = (window.scrollY / totalScroll) * 100
      setScrollProgress(currentProgress)

      // Detect active section
      const sections = document.querySelectorAll('[data-section]')
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect()
        if (rect.top <= 150 && rect.bottom >= 150) {
          setActiveSection(section.getAttribute('data-section') || '')
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offset = 100
      const elementPosition = element.getBoundingClientRect().top + window.scrollY
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      })
    }
  }

  const sections = [
    { id: 'introduction', label: 'Introduction', icon: FileText },
    { id: 'information-collect', label: 'Information We Collect', icon: UserCheck },
    { id: 'use-information', label: 'Use of Information', icon: Eye },
    { id: 'cookies', label: 'Cookies', icon: Cookie },
    { id: 'security', label: 'Data Security', icon: Lock },
    { id: 'rights', label: 'Your Rights', icon: CheckCircle },
    { id: 'contact', label: 'Contact Us', icon: Mail },
  ]

  return (
    <div>
      <Navbar/>
      
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div 
          className="h-full bg-gradient-to-r from-red-900 to-amber-500 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>

      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-amber-50">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-red-900 via-red-950 to-red-900 text-amber-50 py-24 md:py-32 overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 border-4 border-amber-200 rounded-full animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-40 h-40 border-4 border-amber-200 rounded-full animate-pulse delay-75"></div>
            <div className="absolute top-1/2 left-1/3 w-24 h-24 border-4 border-amber-200 rounded-full animate-pulse delay-150"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col items-center justify-center mb-8">
              <div className="bg-amber-200 w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center mb-6 animate-bounce">
                <Shield className="w-10 h-10 md:w-12 md:h-12 text-red-900" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-center mb-4">
                Privacy Policy
              </h1>
              <div className="bg-amber-200 text-red-900 px-6 py-2 rounded-full font-bold text-sm">
                Effective Date: January 11, 2026
              </div>
            </div>
            <p className="text-lg md:text-xl text-amber-100 text-center max-w-3xl mx-auto">
              Your privacy matters to us. Learn how we protect and use your information.
            </p>
          </div>
        </div>

        {/* Floating Navigation - Desktop */}
        <div className="hidden lg:block sticky top-24 z-40">
          <div className="container mx-auto px-4">
            <div className="absolute left-8 top-0">
              <div className="bg-white rounded-2xl shadow-xl p-4 max-w-xs">
                <h3 className="font-bold text-red-900 mb-4 text-sm">TABLE OF CONTENTS</h3>
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-all duration-200 ${
                        activeSection === section.id
                          ? 'bg-red-900 text-amber-50 font-bold'
                          : 'text-gray-700 hover:bg-amber-50'
                      }`}
                    >
                      <section.icon className="w-4 h-4 flex-shrink-0" />
                      <span className="text-xs">{section.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          {/* Introduction */}
          <div id="introduction" data-section="introduction" className="max-w-4xl mx-auto mb-16">
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10 border-t-4 border-red-900 transform hover:scale-[1.01] transition-transform duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-red-900" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-red-900">Introduction</h2>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                Kaaveri Desi ("we," "our," or "us") values your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or interact with us through our social media platforms.
              </p>
            </div>
          </div>

          {/* Information We Collect */}
          <div id="information-collect" data-section="information-collect" className="max-w-4xl mx-auto mb-16">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-[1.01] transition-transform duration-300">
              <div className="bg-gradient-to-r from-red-900 to-red-950 text-amber-50 px-6 md:px-8 py-6">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8" />
                  <h2 className="text-2xl md:text-3xl font-bold">Information We Collect</h2>
                </div>
              </div>
              <div className="p-6 md:p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Personal Information Card */}
                  <div className="bg-gradient-to-br from-red-50 to-amber-50 rounded-xl p-6 border-2 border-red-200 hover:border-red-900 transition-colors duration-300">
                    <div className="bg-red-900 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                      <UserCheck className="w-7 h-7 text-amber-50" />
                    </div>
                    <h3 className="text-xl font-bold text-red-900 mb-4">Personal Information</h3>
                    <p className="text-gray-700 leading-relaxed">
                      We may collect personal information such as your name, phone number, email address, delivery address, and other contact details when you voluntarily provide them while placing an order, filling out a form, or contacting us.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {['Name', 'Email', 'Phone', 'Address'].map((item) => (
                        <span key={item} className="bg-white text-red-900 px-3 py-1 rounded-full text-xs font-semibold">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Usage Data Card */}
                  <div className="bg-gradient-to-br from-amber-50 to-red-50 rounded-xl p-6 border-2 border-amber-200 hover:border-amber-500 transition-colors duration-300">
                    <div className="bg-amber-500 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                      <Eye className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-red-900 mb-4">Usage Data</h3>
                    <p className="text-gray-700 leading-relaxed">
                      We may collect information about how you interact with our website, including IP address, browser type, pages visited, time spent on pages, and other analytical data to help us improve our services.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {['IP Address', 'Browser', 'Analytics'].map((item) => (
                        <span key={item} className="bg-white text-amber-900 px-3 py-1 rounded-full text-xs font-semibold">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Use of Information */}
          <div id="use-information" data-section="use-information" className="max-w-4xl mx-auto mb-16">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-[1.01] transition-transform duration-300">
              <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 md:px-8 py-6">
                <h2 className="text-2xl md:text-3xl font-bold">Use of Information</h2>
              </div>
              <div className="p-6 md:p-8">
                <p className="text-gray-700 mb-6 text-lg">We use the collected information for the following purposes:</p>
                <div className="space-y-4">
                  {[
                    { text: "To process and deliver orders of ghee, milk, and jaggery", icon: "📦" },
                    { text: "To provide and maintain our website and services", icon: "🌐" },
                    { text: "To improve customer experience and personalize content", icon: "✨" },
                    { text: "To respond to your inquiries, feedback, or support requests", icon: "💬" },
                    { text: "To send order updates, promotional messages, or newsletters (if you opt in)", icon: "📧" }
                  ].map((item, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-4 p-4 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors duration-200 group"
                    >
                      <div className="text-3xl group-hover:scale-110 transition-transform duration-200">{item.icon}</div>
                      <span className="text-gray-700 flex-1 pt-1">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Sections Grid */}
          <div className="max-w-4xl mx-auto space-y-6 mb-16">
            {/* Cookies */}
            <div id="cookies" data-section="cookies" className="group bg-gradient-to-r from-amber-50 to-white rounded-2xl p-6 md:p-8 border-l-4 border-amber-500 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-x-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center group-hover:bg-amber-500 transition-colors duration-300">
                  <Cookie className="w-6 h-6 text-amber-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-red-900">Cookies and Tracking Technologies</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Our website may use cookies and similar tracking technologies to enhance user experience, analyze website traffic, and improve functionality. You can modify your browser settings to refuse cookies or receive alerts when cookies are being used.
              </p>
            </div>

            {/* Third-Party Links */}
            <div className="group bg-gradient-to-r from-red-50 to-white rounded-2xl p-6 md:p-8 border-l-4 border-red-900 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-x-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center group-hover:bg-red-900 transition-colors duration-300">
                  <ExternalLink className="w-6 h-6 text-red-600 group-hover:text-amber-50 transition-colors duration-300" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-red-900">Third-Party Links</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Our website may contain links to third-party websites. We are not responsible for the content, policies, or privacy practices of these external websites. We encourage you to review their privacy policies separately.
              </p>
            </div>

            {/* Data Security */}
            <div id="security" data-section="security" className="group bg-gradient-to-r from-green-50 to-white rounded-2xl p-6 md:p-8 border-l-4 border-green-600 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-x-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center group-hover:bg-green-600 transition-colors duration-300">
                  <Lock className="w-6 h-6 text-green-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-red-900">Data Security</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                We take reasonable precautions and follow industry standards to protect your personal information. However, please note that no method of transmission over the internet or electronic storage is completely secure.
              </p>
              <div className="mt-4 bg-green-100 border border-green-300 rounded-lg p-4 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-800">
                  <strong>256-bit SSL Encryption</strong> - Your data is transmitted securely
                </p>
              </div>
            </div>

            {/* Your Rights */}
            <div id="rights" data-section="rights" className="group bg-gradient-to-r from-blue-50 to-white rounded-2xl p-6 md:p-8 border-l-4 border-blue-600 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-x-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
                  <CheckCircle className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-red-900">Your Rights</h3>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                You have the right to access, update, or request deletion of your personal information. For any privacy-related questions or requests, please contact us at <a href="mailto:support@kaaveridesi.com" className="text-red-900 underline font-semibold hover:text-red-700">support@kaaveridesi.com</a> or call <a href="tel:+919289148411" className="text-red-900 font-bold hover:text-red-700">+91 92891 48411</a>.
              </p>
              <div className="grid sm:grid-cols-3 gap-3">
                <div className="bg-blue-100 p-3 rounded-lg text-center">
                  <p className="text-xs font-bold text-blue-900">ACCESS</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg text-center">
                  <p className="text-xs font-bold text-blue-900">UPDATE</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg text-center">
                  <p className="text-xs font-bold text-blue-900">DELETE</p>
                </div>
              </div>
            </div>

            {/* Policy Changes */}
            <div className="group bg-gradient-to-r from-purple-50 to-white rounded-2xl p-6 md:p-8 border-l-4 border-purple-600 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-x-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center group-hover:bg-purple-600 transition-colors duration-300">
                  <AlertCircle className="w-6 h-6 text-purple-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-red-900">Changes to This Privacy Policy</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                We may update this Privacy Policy from time to time. Any changes will be posted on this page along with the updated effective date.
              </p>
            </div>
          </div>

          {/* Contact Section */}
          <div id="contact" data-section="contact" className="max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-red-900 via-red-950 to-red-900"></div>
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)'
              }}></div>
              
              <div className="relative z-10 p-8 md:p-12 text-center text-amber-50">
                <div className="bg-amber-200 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                  <Mail className="w-8 h-8 md:w-10 md:h-10 text-red-900" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h2>
                <p className="text-lg text-amber-100 mb-8 max-w-2xl mx-auto">
                  If you have any questions, concerns, or requests regarding this Privacy Policy
                </p>
                <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  <a 
                    href="mailto:support@kaaveridesi.com"
                    className="bg-amber-200 hover:bg-amber-300 text-red-900 font-bold px-6 py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                  >
                    <Mail className="w-5 h-5" />
                    <span>support@kaaveridesi.com</span>
                  </a>
                  <a 
                    href="tel:+919289148411"
                    className="bg-white hover:bg-amber-50 text-red-900 font-bold px-6 py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                  >
                    <span>📱</span>
                    <span>+91 92891 48411</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Badge */}
          <div className="max-w-4xl mx-auto mt-12 text-center">
            <div className="inline-flex items-center gap-3 bg-green-100 text-green-800 px-6 py-3 rounded-full font-semibold">
              <Shield className="w-5 h-5" />
              <span>Your data is safe with us</span>
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .delay-75 { animation-delay: 0.75s; }
        .delay-150 { animation-delay: 1.5s; }
      `}</style>
    </div>
  )
}

export default PrivacyPage
