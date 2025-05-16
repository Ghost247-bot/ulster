import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout';
import UserLayout from './components/layouts/UserLayout';
import AdminLayout from './components/layouts/AdminLayout';
import Home from './pages/Home';
import UserDashboard from './pages/user/Dashboard';
import UserAccounts from './pages/user/Accounts';
import UserCards from './pages/user/Cards';
import UserTransactions from './pages/user/Transactions';
import UserProfile from './pages/user/Profile';
import UserNotifications from './pages/user/Notifications';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminAccounts from './pages/admin/Accounts';
import AdminTransactions from './pages/admin/Transactions';
import AdminCards from './pages/admin/Cards';

const sbaLoanProducts = [
  {
    title: 'SBA 7(a) Loans',
    features: [
      'Loans up to $5 million',
      'Flexible terms up to 25 years',
      'Lower down payment requirements',
      'Competitive interest rates',
      'Working capital financing',
      'Equipment and inventory purchases',
      'Business acquisition',
      'Debt refinancing',
    ],
  },
  {
    title: 'SBA 504 Loans',
    features: [
      'Long-term, fixed-rate financing',
      'Up to $5 million per project',
      'Lower down payment requirements',
      'Fixed interest rates',
      'Financing for real estate',
      'Equipment purchases',
      'Business expansion',
      'Job creation support',
    ],
  },
  {
    title: 'SBA Express Loans',
    features: [
      'Quick approval process',
      'Loans up to $500,000',
      'Streamlined application',
      'Flexible use of proceeds',
      'Working capital needs',
      'Equipment purchases',
      'Business expansion',
      'Start-up financing',
    ],
  },
];

const faqs = [
  { q: 'What is an SBA loan?', a: 'SBA loans are government-guaranteed loans designed to help small businesses access financing with favorable terms and lower down payment requirements.' },
  { q: 'What can SBA loans be used for?', a: 'SBA loans can be used for working capital, equipment purchases, real estate, business acquisition, debt refinancing, and business expansion.' },
  { q: 'How long does the approval process take?', a: 'Approval times vary by loan type. SBA Express loans can be approved in as little as 36 hours, while standard SBA loans typically take 2-4 weeks.' },
  { q: 'What are the minimum requirements?', a: 'Requirements include good credit, sufficient cash flow, and a solid business plan. Specific requirements vary by loan type.' },
  { q: 'Do I need collateral?', a: 'Collateral requirements vary by loan type and amount. The SBA requires lenders to take available collateral, but will not decline a loan for lack of collateral.' },
  { q: 'What documentation is required?', a: 'Required documentation includes business financial statements, tax returns, business plan, and personal financial statements. Specific requirements vary by loan type.' },
];

const SBALoans: React.FC = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      {/* Hero Section with Card */}
      <div className="relative w-full h-80 md:h-96 bg-gray-100 flex items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1500&q=80"
          alt="SBA Loans Hero"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-60"
        />
        <div className="absolute inset-0 bg-white opacity-60" />
        <div className="relative z-10 w-full flex justify-center">
          <div className="bg-white rounded-2xl shadow-lg max-w-3xl w-full mt-24 p-8">
            <div className="text-xs text-[#C14F2B] mb-2 uppercase tracking-widest">HOME &gt; BUSINESS &gt; SBA LOANS</div>
            <h1 className="text-3xl md:text-4xl font-semibold mb-4 text-gray-900">SBA Loans</h1>
            <p className="mb-4 text-gray-700">Access government-guaranteed financing with favorable terms to help your business grow and succeed.</p>
            <p className="mb-4 text-gray-700">Our experienced SBA lending team will guide you through the process and help you find the right loan for your needs.</p>
          </div>
        </div>
      </div>

      {/* Product Comparison Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center text-lg font-semibold tracking-widest mb-10 uppercase">SBA Loan Programs</div>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 px-4">
          {sbaLoanProducts.map((product, idx) => (
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
        CONTACT YOUR SBA LENDING SPECIALIST TODAY
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
            <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80" alt="Small Business" className="rounded-lg w-full object-cover mb-6 md:mb-0" />
          </div>
          <div>
            <div className="uppercase text-xs text-[#C14F2B] font-bold mb-2 tracking-widest">SBA Lending</div>
            <h3 className="text-3xl font-semibold mb-4">Expert Guidance for Small Business Success</h3>
            <p className="mb-6 text-gray-700">Our experienced SBA lending team provides personalized service and expert guidance to help you navigate the SBA loan process. From application to closing, we're here to support your business growth.</p>
            <button className="border-2 border-black px-6 py-2 rounded font-semibold hover:bg-black hover:text-white transition">LEARN MORE</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SBALoans; 