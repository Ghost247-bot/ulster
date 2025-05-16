import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const cashManagementProducts = [
  {
    title: 'Treasury Management',
    features: [
      'Cash flow forecasting',
      'Account reconciliation',
      'Wire transfers',
      'ACH processing',
      'Positive pay',
      'Remote deposit capture',
      'Sweep accounts',
      'Investment services',
    ],
  },
  {
    title: 'Payment Solutions',
    features: [
      'Wire transfers',
      'ACH origination',
      'Bill payment',
      'Payroll processing',
      'Vendor payments',
      'International payments',
      'Payment scheduling',
      'Payment reporting',
    ],
  },
  {
    title: 'Receivables Management',
    features: [
      'Lockbox services',
      'Remote deposit capture',
      'Electronic invoicing',
      'Payment processing',
      'Account reconciliation',
      'Cash application',
      'Collection services',
      'Reporting tools',
    ],
  },
];

const faqs = [
  { q: 'What is Cash Management?', a: 'Cash Management is a comprehensive set of services designed to help businesses optimize their cash flow, manage payments and receivables, and make informed financial decisions.' },
  { q: 'How can Cash Management help my business?', a: 'Our Cash Management solutions can help you streamline operations, reduce costs, improve cash flow, and make better use of your funds.' },
  { q: 'What payment methods are available?', a: 'We offer wire transfers, ACH processing, bill payment, payroll processing, and international payment solutions.' },
  { q: 'How secure are the transactions?', a: 'We use industry-leading security measures including encryption, multi-factor authentication, and fraud detection to protect your transactions.' },
  { q: 'Can I access Cash Management online?', a: 'Yes, our Cash Management platform is available 24/7 through our secure online banking portal.' },
  { q: 'What reporting tools are available?', a: 'We offer comprehensive reporting tools for cash flow, payments, receivables, and account reconciliation.' },
];

const CashManagement: React.FC = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      {/* Hero Section with Card */}
      <div className="relative w-full h-80 md:h-96 bg-gray-100 flex items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1500&q=80"
          alt="Cash Management Hero"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-60"
        />
        <div className="absolute inset-0 bg-white opacity-60" />
        <div className="relative z-10 w-full flex justify-center">
          <div className="bg-white rounded-2xl shadow-lg max-w-3xl w-full mt-24 p-8">
            <div className="text-xs text-[#1B4D3E] mb-2 uppercase tracking-widest">HOME &gt; BUSINESS &gt; CASH MANAGEMENT</div>
            <h1 className="text-3xl md:text-4xl font-semibold mb-4 text-gray-900">Cash Management</h1>
            <p className="mb-4 text-gray-700">Optimize your business cash flow with our comprehensive treasury management solutions.</p>
            <p className="mb-4 text-gray-700">From payments to receivables, we have the tools you need to manage your business finances efficiently.</p>
          </div>
        </div>
      </div>

      {/* Product Comparison Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center text-lg font-semibold tracking-widest mb-10 uppercase">Cash Management Solutions</div>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 px-4">
          {cashManagementProducts.map((product, idx) => (
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
          <span className="text-[#1B4D3E] cursor-pointer underline">Location <span role="img" aria-label="location">📍</span></span>
        </div>
      </div>

      {/* CTA Bar */}
      <div className="bg-[#1B4D3E] text-white text-center text-xl md:text-2xl font-semibold py-6">
        CONTACT YOUR CASH MANAGEMENT SPECIALIST TODAY
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
          <button className="border-2 border-[#1B4D3E] text-[#1B4D3E] px-8 py-3 rounded transition hover:bg-[#1B4D3E] hover:text-white font-semibold text-lg">Get Started</button>
        </div>
      </div>

      {/* Additional Info Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80" alt="Cash Management" className="rounded-lg w-full object-cover mb-6 md:mb-0" />
          </div>
          <div>
            <div className="uppercase text-xs text-[#1B4D3E] font-bold mb-2 tracking-widest">Cash Management</div>
            <h3 className="text-3xl font-semibold mb-4">Optimize Your Business Cash Flow</h3>
            <p className="mb-6 text-gray-700">Our Cash Management solutions help you streamline operations, reduce costs, and make better use of your funds. With comprehensive tools for payments, receivables, and treasury management, we're here to help your business succeed.</p>
            <button className="border-2 border-black px-6 py-2 rounded font-semibold hover:bg-black hover:text-white transition">LEARN MORE</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashManagement; 