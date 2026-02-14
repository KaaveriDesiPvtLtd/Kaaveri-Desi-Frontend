'use client'
import React, { useState, useMemo } from 'react'
import { ChevronDown, ChevronUp, Search, HelpCircle, MessageCircle, Mail, Phone } from 'lucide-react'
import Navbar from "../../../components/navbar"

interface FAQItemProps {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
  index: number
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, isOpen, onToggle, index }) => {
  return (
    <div 
      className="bg-white rounded-xl shadow-md mb-4 overflow-hidden border-2 border-amber-200 hover:border-red-900 transition-all duration-300 transform hover:scale-[1.02]"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <button
        onClick={onToggle}
        className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-amber-50 transition-colors duration-200 group"
        aria-expanded={isOpen}
      >
        <div className="flex items-start gap-4 flex-1">
          <div className="bg-red-100 text-red-900 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold group-hover:bg-red-900 group-hover:text-amber-50 transition-colors duration-200">
            {index + 1}
          </div>
          <span className="font-semibold text-red-900 text-lg pr-4">{question}</span>
        </div>
        <div className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown className="w-6 h-6 text-red-900 flex-shrink-0" />
        </div>
      </button>
      
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 py-5 bg-amber-50 border-t-2 border-amber-200">
          <p className="text-gray-700 leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  )
}

function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  const faqs = [
    {
      category: "Orders",
      question: "How can I place an order?",
      answer: "Placing an order is simple! Browse our website, select the ghee, milk, or jaggery product you want, choose the quantity, and proceed to checkout."
    },
    {
      category: "Orders",
      question: "What details do I need to provide while ordering?",
      answer: "You only need to provide basic details such as delivery address, contact number, and any special instructions (if applicable). For bulk or customized orders, our team will contact you after order placement for further details."
    },
    {
      category: "Products",
      question: "Are your products fresh and traditionally made?",
      answer: "Yes, absolutely! Our ghee, milk, and jaggery are prepared using traditional methods, high-quality ingredients, and authentic recipes to ensure purity, taste, and freshness."
    },
    {
      category: "Products",
      question: "Can I preview or sample the product before delivery?",
      answer: "Since our products are food items, previews or samples are not available. However, detailed product descriptions and images are provided to help you make an informed choice."
    },
    {
      category: "Delivery",
      question: "How long does it take to process and deliver an order?",
      answer: "Orders are usually processed within 2-4 business days. Delivery generally takes 5-7 business days, depending on your location."
    },
    {
      category: "Delivery",
      question: "Can I track my order?",
      answer: "Yes. Once your order is dispatched, you will receive a tracking number via SMS or email to track your delivery."
    },
    {
      category: "Payment",
      question: "What payment methods do you accept?",
      answer: "We accept payments through credit/debit cards, net banking, and UPI."
    },
    {
      category: "Returns",
      question: "Do you offer refunds or replacements?",
      answer: "Due to the perishable nature of food products, refunds or replacements are not available. However, if you receive a damaged or incorrect product, please contact us within 24 hours of delivery, and we will assist you as per our policy. For more details, please refer to our Refunds & Replacements Policy."
    },
    {
      category: "Bulk Orders",
      question: "Do you offer bulk orders for events or corporate gifting?",
      answer: "Yes, we do! We accept bulk orders for festivals, corporate gifting, weddings, and special occasions. Please contact us for bulk pricing and customization options."
    },
    {
      category: "Support",
      question: "How can I contact customer support?",
      answer: "You can reach us via WhatsApp, email, or phone. Visit our Contact Us page for complete details."
    }
  ]

  const categories = ['All', ...Array.from(new Set(faqs.map(faq => faq.category)))]

  const filteredFAQs = useMemo(() => {
    return faqs.filter(faq => {
      const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div>
      <Navbar/>
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-amber-50">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-red-900 via-red-950 to-red-900 text-amber-50 py-24 overflow-hidden">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 border-4 border-amber-200 rounded-full animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-40 h-40 border-4 border-amber-200 rounded-full animate-pulse"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="flex items-center justify-center mb-6">
              <HelpCircle className="w-12 h-12 md:w-16 md:h-16 mr-4" />
              <h1 className="text-4xl md:text-6xl font-bold text-center">
                Frequently Asked Questions
              </h1>
            </div>
            <p className="text-lg md:text-2xl text-amber-100 text-center max-w-3xl mx-auto">
              Find answers to common questions about our products and services
            </p>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="container mx-auto px-4 -mt-8 relative z-20">
          <div className="max-w-4xl mx-auto">
            {/* Search Bar */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                <input
                  type="text"
                  placeholder="Search your question..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-4 py-4 text-lg border-2 border-amber-200 rounded-xl focus:outline-none focus:border-red-900 transition-colors"
                />
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-3 mt-6">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-red-900 to-red-950 text-amber-50 shadow-lg'
                        : 'bg-amber-100 text-red-900 hover:bg-amber-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Count */}
            <div className="text-center mb-6">
              <p className="text-gray-600 text-lg">
                Showing <span className="font-bold text-red-900">{filteredFAQs.length}</span> {filteredFAQs.length === 1 ? 'question' : 'questions'}
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Content */}
        <div className="container mx-auto px-4 py-8 pb-16">
          <div className="max-w-4xl mx-auto">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openIndex === index}
                  onToggle={() => handleToggle(index)}
                  index={index}
                />
              ))
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-red-900 mb-2">No results found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search or filter</p>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('All')
                  }}
                  className="bg-red-900 text-amber-50 px-8 py-3 rounded-full font-bold hover:bg-red-950 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          {/* Quick Actions Grid */}
          <div className="max-w-4xl mx-auto mt-16 grid md:grid-cols-3 gap-6">
            <a 
              href="mailto:support@kaaveridesi.com"
              className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-red-900 text-center"
            >
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-900 transition-colors duration-300">
                <Mail className="w-8 h-8 text-red-900 group-hover:text-amber-50 transition-colors duration-300" />
              </div>
              <h3 className="font-bold text-red-900 text-lg mb-2">Email Us</h3>
              <p className="text-gray-600 text-sm">support@kaaveridesi.com</p>
            </a>

            <a 
              href="https://wa.me/919289148411"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-green-500 text-center"
            >
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500 transition-colors duration-300">
                <MessageCircle className="w-8 h-8 text-green-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="font-bold text-red-900 text-lg mb-2">WhatsApp</h3>
              <p className="text-gray-600 text-sm">+91 92891 48411</p>
            </a>

            <a 
              href="tel:+919289148411"
              className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-amber-500 text-center"
            >
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-500 transition-colors duration-300">
                <Phone className="w-8 h-8 text-amber-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="font-bold text-red-900 text-lg mb-2">Call Us</h3>
              <p className="text-gray-600 text-sm">Available 24/7</p>
            </a>
          </div>

          {/* Contact Section */}
          <div className="max-w-4xl mx-auto mt-12">
            <div className="relative overflow-hidden rounded-3xl">
              <div className="absolute inset-0 bg-gradient-to-r from-red-900 via-red-950 to-red-900"></div>
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)'
              }}></div>
              
              <div className="relative z-10 p-10 md:p-12 text-center text-amber-50">
                <div className="text-5xl mb-4">💬</div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Still Have Questions?</h2>
                <p className="text-lg text-amber-100 mb-8 max-w-2xl mx-auto">
                  Our customer support team is here to help you. We're available 24/7 to answer any questions you might have.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="mailto:support@kaaveridesi.com" 
                    className="bg-amber-200 hover:bg-amber-300 text-red-900 font-bold px-8 py-4 rounded-full transition-all transform hover:scale-105 shadow-lg"
                  >
                    📧 Email Support
                  </a>
                  <a 
                    href="https://wa.me/919289148411" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white hover:bg-amber-50 text-red-900 font-bold px-8 py-4 rounded-full transition-all transform hover:scale-105 shadow-lg"
                  >
                    💬 WhatsApp Chat
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FAQPage
