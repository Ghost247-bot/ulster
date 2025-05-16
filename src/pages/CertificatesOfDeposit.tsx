import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const cdFeatures = [
  [
    'Competitive fixed interest rates',
    'Flexible terms from 3 months to 5 years',
    'FDIC insured',
    'Automatic renewal options',
    'No monthly maintenance fees',
  ],
  [
    'Higher rates for larger deposits',
    'Interest paid monthly, quarterly, or at maturity',
    'Early withdrawal options (penalties may apply)',
    'Online and mobile account management',
    'Safe and secure savings',
  ],
  [
    'Great for long-term savings goals',
    'Can be used for IRAs',
    'Free thank-you gift for opening a CD',
    'Personalized service',
    'Flexible payout options',
  ],
];

const faqs = [
  { q: 'What is a Certificate of Deposit (CD)?', a: 'A CD is a savings product with a fixed term and interest rate, offering higher returns than regular savings accounts.' },
  { q: 'What terms are available?', a: 'Terms range from 3 months to 5 years.' },
  { q: 'Is my money safe in a CD?', a: 'Yes, CDs are FDIC insured up to the applicable limits.' },
  { q: 'Can I withdraw early?', a: 'Yes, but early withdrawal penalties may apply.' },
  { q: 'How do I open a CD?', a: 'You can open a CD online or at any branch.' },
];

const CertificatesOfDeposit: React.FC = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="relative w-full h-64 md:h-80 bg-gray-100 flex items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=1500&q=80"
          alt="Certificates of Deposit Hero"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-60"
        />
        <div className="absolute inset-0 bg-white opacity-60" />
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">bank secure.</h1>
        </div>
      </div>

      {/* Breadcrumb and Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-xs text-[#C14F2B] mb-2 uppercase tracking-widest">
          HOME &gt; PERSONAL &gt; SAVINGS &gt; CERTIFICATES OF DEPOSIT
        </div>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          {/* Main Info */}
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl md:text-3xl font-semibold mb-2">Certificates of Deposit (CDs)</h2>
            <p className="mb-4 text-gray-700">Lock in a great rate and watch your savings grow with our flexible Certificates of Deposit.</p>
            <p className="mb-4 text-gray-700">Choose the term that fits your goals and enjoy peace of mind with FDIC insurance.</p>
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
          {cdFeatures.map((col, idx) => (
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

export default CertificatesOfDeposit; 