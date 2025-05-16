import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const creditCardProducts = [
  {
    title: 'Business Rewards Card',
    features: [
      'Earn points on every purchase',
      'No annual fee',
      'Employee cards at no cost',
      'Travel and purchase protection',
      'Expense management tools',
      'Detailed reporting',
      '24/7 customer service',
      'Fraud protection',
    ],
  },
  {
    title: 'Business Travel Card',
    features: [
      'Earn travel rewards',
      'Airport lounge access',
      'Travel insurance',
      'No foreign transaction fees',
      'Concierge service',
      'Employee cards available',
      'Expense tracking',
      'Travel alerts',
    ],
  },
  {
    title: 'Business Cash Back Card',
    features: [
      'Cash back on all purchases',
      'Higher rewards on business categories',
      'No annual fee',
      'Employee cards at no cost',
      'Expense management',
      'Detailed reporting',
      'Purchase protection',
      'Fraud monitoring',
    ],
  },
];

const faqs = [
  { q: 'What credit score is needed?', a: 'Credit score requirements vary by card type, but generally, a good to excellent credit score is recommended.' },
  { q: 'Can I get cards for employees?', a: 'Yes, you can request additional cards for employees at no cost, with customizable spending limits.' },
  { q: 'How do I track expenses?', a: 'Our online and mobile banking platforms provide detailed expense tracking and reporting tools.' },
  { q: 'What rewards programs are available?', a: 'We offer points, travel rewards, and cash back programs to suit different business needs.' },
  { q: 'Are there foreign transaction fees?', a: 'Some cards have no foreign transaction fees, while others may charge a small percentage.' },
  { q: 'How do I apply for a business card?', a: 'You can apply online, by phone, or visit any branch. You'll need your business information and personal identification.' },
];

const BusinessCreditCards: React.FC = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      {/* Hero Section with Card */}
      <div className="relative w-full h-80 md:h-96 bg-gray-100 flex items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1500&q=80"
          alt="Business Credit Cards Hero"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-60"
        />
        <div className="absolute inset-0 bg-white opacity-60" />
        <div className="relative z-10 w-full flex justify-center">
          <div className="bg-white rounded-2xl shadow-lg max-w-3xl w-full mt-24 p-8">
            <div className="text-xs text-[#C14F2B] mb-2 uppercase tracking-widest">HOME &gt; BUSINESS &gt; CREDIT CARDS</div>
            <h1 className="text-3xl md:text-4xl font-semibold mb-4 text-gray-900">Business Credit Cards</h1>
            <p className="mb-4 text-gray-700">Choose from our range of business credit cards designed to help you manage expenses and earn rewards.</p>
            <p className="mb-4 text-gray-700">From cash back to travel rewards, find the perfect card for your business needs.</p>
          </div>
        </div>
      </div>

      {/* Product Comparison Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center text-lg font-semibold tracking-widest mb-10 uppercase">Business Credit Card Options</div>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 px-4">
          {creditCardProducts.map((product, idx) => (
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
        APPLY FOR A BUSINESS CREDIT CARD TODAY
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
          <button className="border-2 border-[#C14F2B] text-[#C14F2B] px-8 py-3 rounded transition hover:bg-[#C14F2B] hover:text-white font-semibold text-lg">Apply Now</button>
        </div>
      </div>

      {/* Additional Info Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80" alt="Business Credit Cards" className="rounded-lg w-full object-cover mb-6 md:mb-0" />
          </div>
          <div>
            <div className="uppercase text-xs text-[#C14F2B] font-bold mb-2 tracking-widest">Business Credit</div>
            <h3 className="text-3xl font-semibold mb-4">Manage Your Business Expenses</h3>
            <p className="mb-6 text-gray-700">Our business credit cards offer powerful tools to help you manage expenses, track spending, and earn rewards. With features like employee cards and expense management, you can focus on growing your business.</p>
            <button className="border-2 border-black px-6 py-2 rounded font-semibold hover:bg-black hover:text-white transition">LEARN MORE</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessCreditCards; 