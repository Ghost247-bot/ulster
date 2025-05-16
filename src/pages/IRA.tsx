import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const iraFeatures = [
  [
    'Traditional and Roth IRA options',
    'Tax-advantaged savings for retirement',
    'Flexible contribution options',
    'No setup or annual maintenance fees',
    'FDIC insured',
  ],
  [
    'Competitive interest rates',
    'Automatic transfers available',
    'Online and mobile account management',
    'Personalized retirement planning support',
    'Flexible withdrawal options (subject to IRS rules)',
  ],
  [
    'Great for long-term savings goals',
    'Can be funded with rollovers or transfers',
    'Free thank-you gift for opening an IRA',
    'Safe and secure savings',
    'Required minimum distributions for Traditional IRAs',
  ],
];

const faqs = [
  { q: 'What is an IRA?', a: 'An IRA (Individual Retirement Account) is a tax-advantaged account designed to help you save for retirement.' },
  { q: 'What types of IRAs are available?', a: 'We offer both Traditional and Roth IRAs.' },
  { q: 'Are there contribution limits?', a: 'Yes, annual contribution limits are set by the IRS.' },
  { q: 'Can I roll over funds from another retirement account?', a: 'Yes, you can roll over or transfer funds from other qualified accounts.' },
  { q: 'How do I open an IRA?', a: 'You can open an IRA online or at any branch.' },
];

const IRA: React.FC = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="relative w-full h-64 md:h-80 bg-gray-100 flex items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1500&q=80"
          alt="IRA Hero"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-60"
        />
        <div className="absolute inset-0 bg-white opacity-60" />
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">bank for retirement.</h1>
        </div>
      </div>

      {/* Breadcrumb and Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-xs text-[#C14F2B] mb-2 uppercase tracking-widest">
          HOME &gt; PERSONAL &gt; RETIREMENT &gt; IRA
        </div>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          {/* Main Info */}
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl md:text-3xl font-semibold mb-2">IRA (Individual Retirement Account)</h2>
            <p className="mb-4 text-gray-700">Save for your future with a tax-advantaged IRA. Choose from Traditional or Roth options to fit your retirement goals.</p>
            <p className="mb-4 text-gray-700">Enjoy competitive rates, flexible contributions, and peace of mind with FDIC insurance.</p>
          </div>
          {/* Promo Box */}
          <div className="flex-shrink-0 w-full md:w-1/3 bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center text-center border border-gray-200">
            <div className="uppercase text-xs tracking-widest mb-2">Get a Gift</div>
            <div className="text-5xl font-light mb-1">FREE<sup className="text-base align-super">*</sup></div>
            <div className="mb-4 text-sm">AFTER OPENING AN ACCOUNT</div>
            <Link to="/register" className="border border-black px-6 py-2 rounded font-semibold hover:bg-black hover:text-white transition mb-2 block text-center">OPEN ONLINE</Link>
          </div>
        </div>

        {/* Features Section */}
        <hr className="my-8 border-gray-300" />
        <div className="uppercase text-xs font-bold mb-4 tracking-widest">Features:</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {iraFeatures.map((col, idx) => (
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
          OPEN YOUR ACCOUNT ONLINE TODAY AND GET A FREE GIFT!
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

export default IRA; 