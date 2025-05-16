import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const businessLoanFeatures = [
  [
    'Competitive interest rates',
    'Flexible terms',
    'Quick approval process',
    'No prepayment penalties',
    'Fixed and variable rate options',
  ],
  [
    'Equipment financing',
    'Working capital loans',
    'Commercial real estate loans',
    'Business line of credit',
    'SBA loans',
  ],
  [
    'Personalized service',
    'Local decision making',
    'Online application process',
    'Free thank-you gift for new loans',
    'Safe and secure',
  ],
];

const faqs = [
  { q: 'What types of business loans do you offer?', a: 'We offer equipment financing, working capital loans, commercial real estate loans, business lines of credit, and SBA loans.' },
  { q: 'How do I apply for a business loan?', a: 'You can apply online or visit any of our branches to speak with a business loan specialist.' },
  { q: 'What documentation do I need?', a: 'Required documentation includes business financial statements, tax returns, and business plan. Specific requirements vary by loan type.' },
  { q: 'How long does the approval process take?', a: 'Approval times vary by loan type, but we strive to provide quick decisions, often within 1-2 business days.' },
  { q: 'Are there any prepayment penalties?', a: 'No, we do not charge prepayment penalties on our business loans.' },
];

const BusinessLoans: React.FC = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="relative w-full h-64 md:h-80 bg-gray-100 flex items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1500&q=80"
          alt="Business Loans Hero"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-60"
        />
        <div className="absolute inset-0 bg-white opacity-60" />
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">business loans.</h1>
        </div>
      </div>

      {/* Breadcrumb and Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-xs text-[#C14F2B] mb-2 uppercase tracking-widest">
          HOME &gt; BUSINESS &gt; LENDING &gt; BUSINESS LOANS
        </div>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          {/* Main Info */}
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl md:text-3xl font-semibold mb-2">Business Loans</h2>
            <p className="mb-4 text-gray-700">Grow your business with our flexible financing solutions. From equipment financing to working capital loans, we have options to meet your needs.</p>
            <p className="mb-4 text-gray-700">Enjoy competitive rates, quick approvals, and personalized service from our experienced business lending team.</p>
          </div>
          {/* Promo Box */}
          <div className="flex-shrink-0 w-full md:w-1/3 bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center text-center border border-gray-200">
            <div className="uppercase text-xs tracking-widest mb-2">Get a Gift</div>
            <div className="text-5xl font-light mb-1">FREE<sup className="text-base align-super">*</sup></div>
            <div className="mb-4 text-sm">AFTER OPENING A LOAN</div>
            <Link to="/register" className="border border-black px-6 py-2 rounded font-semibold hover:bg-black hover:text-white transition mb-2 block text-center">APPLY NOW</Link>
          </div>
        </div>

        {/* Features Section */}
        <hr className="my-8 border-gray-300" />
        <div className="uppercase text-xs font-bold mb-4 tracking-widest">Features:</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {businessLoanFeatures.map((col, idx) => (
            <ul key={idx} className="list-disc list-inside space-y-2 text-gray-800 text-sm">
              {col.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          ))}
        </div>
        <div className="mt-4 text-xs text-gray-600">
          Already started an application? Check your status <a href="#" className="underline text-[#C14F2B]">here</a>.
        </div>

        {/* CTA Bar */}
        <div className="bg-[#C14F2B] text-white text-center text-lg md:text-2xl font-semibold py-6 rounded mb-10 mt-8">
          APPLY FOR YOUR BUSINESS LOAN TODAY AND GET A FREE GIFT!
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border-b border-gray-400 py-3">
                <button
                  className="flex items-center justify-between w-full text-base text-gray-900 focus:outline-none"
                  onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
                  aria-expanded={openFAQ === idx}
                >
                  <span>{faq.q}</span>
                  <span className="w-8 h-8 flex items-center justify-center border border-gray-400 rounded-full text-lg font-bold text-gray-700">
                    {openFAQ === idx ? '-' : '>'}
                  </span>
                </button>
                {openFAQ === idx && (
                  <div className="mt-2 text-gray-700 text-sm animate-fade-in">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessLoans; 