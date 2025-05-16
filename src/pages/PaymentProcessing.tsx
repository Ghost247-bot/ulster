import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const paymentProcessingProducts = [
  {
    title: 'Credit Card Processing',
    features: [
      'Competitive processing rates',
      'Accept all major credit cards',
      'Next-day funding available',
      'Secure payment processing',
      '24/7 customer support',
      'Mobile payment solutions',
      'Online payment gateway',
      'Detailed reporting tools',
    ],
  },
  {
    title: 'Point of Sale Solutions',
    features: [
      'Modern POS systems',
      'Inventory management',
      'Employee management',
      'Sales reporting',
      'Customer loyalty programs',
      'Mobile POS options',
      'Cloud-based solutions',
      'Hardware leasing available',
    ],
  },
  {
    title: 'Online Payment Solutions',
    features: [
      'Secure payment gateway',
      'Shopping cart integration',
      'Recurring billing',
      'Multiple payment methods',
      'Fraud protection',
      'Real-time reporting',
      'Mobile-friendly checkout',
      'API integration options',
    ],
  },
];

const faqs = [
  { q: 'What types of payments can I accept?', a: 'You can accept all major credit cards, debit cards, and digital payments including Apple Pay, Google Pay, and more.' },
  { q: 'How quickly will I receive my funds?', a: 'Most transactions are funded the next business day, with options for same-day funding available.' },
  { q: 'What equipment do I need?', a: 'We offer a range of solutions from traditional terminals to mobile readers and POS systems, depending on your business needs.' },
  { q: 'Are there setup fees?', a: 'Setup fees vary by solution. We offer competitive rates and transparent pricing with no hidden fees.' },
  { q: 'Is my payment processing secure?', a: 'Yes, we use industry-leading security measures including encryption and tokenization to protect your transactions.' },
  { q: 'Do you offer mobile payment solutions?', a: 'Yes, we offer mobile payment solutions that allow you to accept payments anywhere using your smartphone or tablet.' },
];

const PaymentProcessing: React.FC = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      {/* Hero Section with Card */}
      <div className="relative w-full h-80 md:h-96 bg-gray-100 flex items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1500&q=80"
          alt="Payment Processing Hero"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-60"
        />
        <div className="absolute inset-0 bg-white opacity-60" />
        <div className="relative z-10 w-full flex justify-center">
          <div className="bg-white rounded-2xl shadow-lg max-w-3xl w-full mt-24 p-8">
            <div className="text-xs text-[#C14F2B] mb-2 uppercase tracking-widest">HOME &gt; BUSINESS &gt; PAYMENT PROCESSING</div>
            <h1 className="text-3xl md:text-4xl font-semibold mb-4 text-gray-900">Payment Processing Solutions</h1>
            <p className="mb-4 text-gray-700">Accept payments anywhere, anytime with our secure and reliable payment processing solutions.</p>
            <p className="mb-4 text-gray-700">From traditional terminals to mobile payments, we have the right solution for your business.</p>
          </div>
        </div>
      </div>

      {/* Product Comparison Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center text-lg font-semibold tracking-widest mb-10 uppercase">Payment Solutions</div>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 px-4">
          {paymentProcessingProducts.map((product, idx) => (
            <div key={idx}>
              <div className="font-bold text-base mb-4 tracking-widest uppercase">{product.title}</div>
              <ul className="list-disc list-inside space-y-2 text-gray-800 text-sm">
                {product.features.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="text-center mt-10 text-base font-medium">
          For team members in your area, select your nearest ULSTER location.<br />
          <span className="text-[#C14F2B] cursor-pointer underline">Location <span role="img" aria-label="location">📍</span></span>
        </div>
      </div>

      {/* CTA Bar */}
      <div className="bg-[#C14F2B] text-white text-center text-xl md:text-2xl font-semibold py-6">
        CONTACT YOUR PAYMENT PROCESSING SPECIALIST TODAY
      </div>

      {/* FAQ Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-4xl font-semibold text-center mb-10">Frequently Asked Questions</h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
          {faqs.map((faq, idx) => (
            <div key={idx}>
              <button
                className="flex items-center justify-between w-full text-lg border-b border-gray-400 py-4 focus:outline-none"
                onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
                aria-expanded={openFAQ === idx}
              >
                <span>{faq.q}</span>
                <span className="w-8 h-8 flex items-center justify-center border border-gray-400 rounded-full text-lg font-bold text-gray-700">
                  {openFAQ === idx ? '-' : '>'}
                </span>
              </button>
              {openFAQ === idx && (
                <div className="mt-2 text-gray-700 text-base animate-fade-in">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-10">
          <button className="border-2 border-[#C14F2B] text-[#C14F2B] px-8 py-3 rounded transition hover:bg-[#C14F2B] hover:text-white font-semibold text-lg">Get Started</button>
        </div>
      </div>

      {/* Additional Info Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80" alt="Payment Processing" className="rounded-lg w-full object-cover mb-6 md:mb-0" />
          </div>
          <div>
            <div className="uppercase text-xs text-[#C14F2B] font-bold mb-2 tracking-widest">Payment Solutions</div>
            <h3 className="text-3xl font-semibold mb-4">Secure and Reliable Payment Processing</h3>
            <p className="mb-6 text-gray-700">Our payment processing solutions are designed to help your business accept payments securely and efficiently. With competitive rates and 24/7 support, we're here to help your business succeed.</p>
            <button className="border-2 border-black px-6 py-2 rounded font-semibold hover:bg-black hover:text-white transition">LEARN MORE</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentProcessing; 