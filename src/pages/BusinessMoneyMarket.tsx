import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const products = [
  {
    title: 'Business Money Market',
    features: [
      'Competitive tiered interest rates',
      'No monthly service charge with qualifying balance',
      'Limited check writing',
      'Free online and mobile banking',
      'FDIC insured',
      'Easy transfers between accounts',
      'Account alerts',
      'Free thank-you gift for opening an account',
    ],
  },
];

const faqs = [
  { q: 'What is a Business Money Market account?', a: 'A Business Money Market account offers higher interest rates and flexible access to your business funds.' },
  { q: 'Is there a minimum balance requirement?', a: 'Yes, a minimum balance is required to avoid the monthly service charge.' },
  { q: 'Are there transaction limits?', a: 'Yes, federal regulations limit certain types of withdrawals and transfers.' },
  { q: 'Does this account earn interest?', a: 'Yes, Business Money Market accounts earn competitive interest rates.' },
  { q: 'How do I access online banking?', a: 'You can enroll in online banking through our website after opening your account.' },
];

const BusinessMoneyMarket: React.FC = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      {/* Hero Section with Card */}
      <div className="relative w-full h-80 md:h-96 bg-gray-100 flex items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1500&q=80"
          alt="Business Money Market Hero"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-60"
        />
        <div className="absolute inset-0 bg-white opacity-60" />
        <div className="relative z-10 w-full flex justify-center">
          <div className="bg-white rounded-2xl shadow-lg max-w-3xl w-full mt-24 p-8">
            <div className="text-xs text-[#C14F2B] mb-2 uppercase tracking-widest">HOME &gt; BUSINESS &gt; MONEY MARKET</div>
            <h1 className="text-3xl md:text-4xl font-semibold mb-4 text-gray-900">Business Money Market</h1>
            <p className="mb-4 text-gray-700">Earn more on your business savings with competitive rates and flexible access to your funds.</p>
            <p className="mb-4 text-gray-700">Open a Business Money Market account and enjoy the benefits of both savings and checking for your business.</p>
          </div>
        </div>
      </div>
      {/* Product Comparison Section */}
      <div className="bg-[#ededed] py-12">
        <div className="text-center text-lg font-semibold tracking-widest mb-10 uppercase">Business Money Market Features</div>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-1 gap-12 px-4">
          {products.map((product, idx) => (
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
      </div>
      {/* CTA Bar */}
      <div className="bg-[#C14F2B] text-white text-center text-xl md:text-2xl font-semibold py-6">
        OPEN YOUR BUSINESS MONEY MARKET ACCOUNT TODAY
      </div>
      {/* FAQ Section */}
      <div className="bg-[#ededed] py-12">
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
      </div>
      {/* Additional Info Section */}
      <div className="max-w-6xl mx-auto py-16 px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <img src="https://images.unsplash.com/photo-1515168833906-d2a3b82b1e2e?auto=format&fit=crop&w=800&q=80" alt="Business Team" className="rounded-lg w-full object-cover mb-6 md:mb-0" />
        </div>
        <div>
          <div className="uppercase text-xs text-[#C14F2B] font-bold mb-2 tracking-widest">Business</div>
          <h3 className="text-3xl font-semibold mb-4">Grow your business savings</h3>
          <p className="mb-6 text-gray-700">Take advantage of higher rates and flexible access to your funds with our Business Money Market account. Perfect for businesses looking to maximize their savings potential.</p>
          <button className="border-2 border-black px-6 py-2 rounded font-semibold hover:bg-black hover:text-white transition">LEARN MORE</button>
        </div>
      </div>
      <div className="text-xs text-gray-600 text-center py-8 max-w-4xl mx-auto">
        Minimum balance requirements and transaction limits may apply. Please contact a representative for details.
      </div>
    </div>
  );
};

export default BusinessMoneyMarket; 