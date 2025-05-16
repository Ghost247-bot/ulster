import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const checkingProducts = [
  {
    title: 'Carefree Business Checking*',
    features: [
      'No monthly service charge',
      'No minimum balance',
      '350 FREE monthly transaction items¹',
      'Each item over 350 is $0.35 per item',
      'Free VISA® Business Debit Card with text-alert fraud prevention²',
      'Free Mobile Banking and Mobile Deposit',
      'Secure Online Banking and Bill Pay',
      'Monitor your credit score with ULSTER Credit CompanionSM',
    ],
  },
  {
    title: 'Commercial Checking*',
    features: [
      'Earnings credit allowance on deposit balances may offset activity fees',
      'Only $15 monthly service charge',
      'Only $0.19 each for transaction items¹',
      'Coin and currency deposit charges based on average monthly volume',
      'Free VISA® Business Debit Card with text-alert fraud prevention²',
      'Free Mobile Banking and Mobile Deposit',
      'Secure Online Banking and Bill Pay',
      'Monitor your credit score with ULSTER Credit CompanionSM',
    ],
  },
  {
    title: 'Business Interest Checking*',
    features: [
      'Interest-bearing account for sole proprietorship',
      '350 FREE monthly transaction items¹',
      'Each item over 350 is $0.35 per item',
      '$1,500 minimum balance to avoid a low monthly fee of $6',
      'Free VISA® Business Debit Card with text-alert fraud prevention²',
      'Free Mobile Banking and Mobile Deposit',
      'Secure Online Banking and Bill Pay',
      'Monitor your credit score with ULSTER Credit CompanionSM',
    ],
  },
];

const faqs = [
  { q: 'How do I open a business account?', a: 'You can open a business account online or by visiting your nearest branch with the required documentation.' },
  { q: 'Do you offer business accounts for non-profits?', a: 'Yes, we offer business accounts for non-profits and other organizations.' },
  { q: 'Do you offer business accounts?', a: 'Yes, we offer a variety of business checking and savings accounts.' },
  { q: 'What features are available for Business Checking accounts?', a: 'Features include free online banking, mobile deposit, debit cards, and more.' },
  { q: 'What features are available for Business Savings accounts?', a: 'Business savings accounts offer competitive rates, online access, and more.' },
  { q: 'What documents are required to open a Business Account?', a: 'Typically, you will need your business formation documents, EIN, and personal identification.' },
];

const BusinessChecking: React.FC = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      {/* Hero Section with Card */}
      <div className="relative w-full h-80 md:h-96 bg-gray-100 flex items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1500&q=80"
          alt="Business Checking Hero"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-60"
        />
        <div className="absolute inset-0 bg-white opacity-60" />
        <div className="relative z-10 w-full flex justify-center">
          <div className="bg-white rounded-2xl shadow-lg max-w-3xl w-full mt-24 p-8">
            <div className="text-xs text-[#C14F2B] mb-2 uppercase tracking-widest">HOME &gt; BUSINESS &gt; CHECKING PRODUCTS</div>
            <h1 className="text-3xl md:text-4xl font-semibold mb-4 text-gray-900">Checking Products</h1>
            <p className="mb-4 text-gray-700">Whatever your business, no matter the size, we have convenient, flexible checking options to help you manage your finances easily and economically.</p>
            <p className="mb-4 text-gray-700">Get a free gift for opening a business checking account. To check out our 2025 in-branch gifts, <a href="#" className="text-[#C14F2B] underline">click here.</a></p>
          </div>
        </div>
      </div>

      {/* Product Comparison Section */}
      <div className="bg-[#ededed] py-12">
        <div className="text-center text-lg font-semibold tracking-widest mb-10 uppercase">Business Checking Options</div>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 px-4">
          {checkingProducts.map((product, idx) => (
            <div key={idx}>
              <div className="font-bold text-base mb-4 tracking-widest uppercase">{product.title}</div>
              <ul className="list-disc list-inside space-y-2 text-gray-800 text-sm">
                {product.features.map((item, i) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: item.replace('Mobile Banking', '<a href=\"#\" class=\"underline\">Mobile Banking</a>') }} />
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
        CONTACT YOUR BUSINESS BANKER TODAY
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
                <span className="w-8 h-8 flex items-center justify-center border border-gray-400 rounded-full text-lg font-bold text-gray-700 transition-transform duration-200">
                  {openFAQ === idx ? '-' : '>'}
                </span>
              </button>
              <div 
                className={`mt-2 text-gray-700 text-base overflow-hidden transition-all duration-200 ease-in-out ${
                  openFAQ === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                {faq.a}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-10">
          <button className="border-2 border-[#C14F2B] text-[#C14F2B] px-8 py-3 rounded transition hover:bg-[#C14F2B] hover:text-white font-semibold text-lg">Browse More</button>
        </div>
      </div>

      {/* Additional Info Section */}
      <div className="max-w-6xl mx-auto py-16 px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <img src="https://images.unsplash.com/photo-1515168833906-d2a3b82b1e2e?auto=format&fit=crop&w=800&q=80" alt="Business Team" className="rounded-lg w-full object-cover mb-6 md:mb-0" />
        </div>
        <div>
          <div className="uppercase text-xs text-[#C14F2B] font-bold mb-2 tracking-widest">Business</div>
          <h3 className="text-3xl font-semibold mb-4">Stay on top of your cash</h3>
          <p className="mb-6 text-gray-700">Our treasury management solutions can help you improve efficiency, save time and speed up your cash flow and receivables. From remote deposit capture to secure online access and much more, we'll help you get a solid handle on all your treasury management solutions needs.</p>
          <button className="border-2 border-black px-6 py-2 rounded font-semibold hover:bg-black hover:text-white transition">LEARN MORE</button>
        </div>
      </div>
      <div className="max-w-6xl mx-auto py-16 px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1">
          <div className="uppercase text-xs text-[#C14F2B] font-bold mb-2 tracking-widest">Business Loans</div>
          <h3 className="text-3xl font-semibold mb-4">A loan for businesses of all types</h3>
          <p className="mb-6 text-gray-700">From short- and long-term business loans to commercial mortgages and agricultural programs, we'll help you find the right loan for your company.</p>
          <button className="border-2 border-black px-6 py-2 rounded font-semibold hover:bg-black hover:text-white transition">LEARN MORE</button>
        </div>
        <div className="order-1 md:order-2">
          <img src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80" alt="Business Loans" className="rounded-lg w-full object-cover mb-6 md:mb-0" />
        </div>
      </div>
      <div className="text-xs text-gray-600 text-center py-8 max-w-4xl mx-auto">
        The minimum opening deposit is only $50. Bank rules and regulations apply. Please contact a Community Bank, N.A. representative for details. * Customers depositing more than $10,000 currency monthly may be subject to a cash deposit fee of $1.50 per $1,000 deposited. ¹ Transaction items include checks paid, checks deposited, deposits, ATM and ACH debits, and ACH credits. ² Enrollment required for service activation.
      </div>
    </div>
  );
};

export default BusinessChecking; 