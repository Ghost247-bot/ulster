import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const businessResources = [
  {
    title: 'Business Planning',
    features: [
      'Business plan templates',
      'Financial projections',
      'Market research tools',
      'Industry analysis',
      'Growth strategies',
      'Risk assessment',
      'Competitive analysis',
      'SWOT analysis tools',
    ],
  },
  {
    title: 'Financial Education',
    features: [
      'Cash flow management',
      'Budgeting tools',
      'Tax planning guides',
      'Investment strategies',
      'Retirement planning',
      'Insurance options',
      'Credit management',
      'Financial calculators',
    ],
  },
  {
    title: 'Business Tools',
    features: [
      'Document templates',
      'Financial calculators',
      'Business checklists',
      'Compliance guides',
      'HR resources',
      'Marketing tools',
      'Legal resources',
      'Technology guides',
    ],
  },
];

const faqs = [
  { q: 'What resources are available for new businesses?', a: 'We offer comprehensive resources for new businesses including business plan templates, financial projections, market research tools, and startup guides.' },
  { q: 'How can I access these resources?', a: 'All resources are available through our online portal. Simply log in to your business account to access the full library of tools and guides.' },
  { q: 'Are there any costs associated with these resources?', a: 'Most resources are available at no cost to our business customers. Some specialized tools may require a subscription.' },
  { q: 'Do you offer personalized business advice?', a: 'Yes, our business specialists are available to provide personalized guidance and help you make the most of our resources.' },
  { q: 'Are the resources updated regularly?', a: 'Yes, we regularly update our resources to ensure they reflect current best practices and regulatory requirements.' },
  { q: 'Can I share these resources with my team?', a: 'Yes, you can share most resources with your team members through our secure business portal.' },
];

const BusinessResources: React.FC = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      {/* Hero Section with Card */}
      <div className="relative w-full h-80 md:h-96 bg-gray-100 flex items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1500&q=80"
          alt="Business Resources Hero"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-60"
        />
        <div className="absolute inset-0 bg-white opacity-60" />
        <div className="relative z-10 w-full flex justify-center">
          <div className="bg-white rounded-2xl shadow-lg max-w-3xl w-full mt-24 p-8">
            <div className="text-xs text-[#C14F2B] mb-2 uppercase tracking-widest">HOME &gt; BUSINESS &gt; RESOURCES</div>
            <h1 className="text-3xl md:text-4xl font-semibold mb-4 text-gray-900">Business Resources</h1>
            <p className="mb-4 text-gray-700">Access tools, guides, and resources to help your business grow and succeed.</p>
            <p className="mb-4 text-gray-700">From planning to execution, we provide the knowledge and tools you need to make informed business decisions.</p>
          </div>
        </div>
      </div>

      {/* Resource Categories Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center text-lg font-semibold tracking-widest mb-10 uppercase">Business Resource Categories</div>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 px-4">
          {businessResources.map((resource, idx) => (
            <div key={idx}>
              <div className="font-bold text-base mb-4 tracking-widest uppercase">{resource.title}</div>
              <ul className="list-disc list-inside space-y-2 text-gray-800 text-sm">
                {resource.features.map((item, i) => (
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
        ACCESS OUR COMPREHENSIVE BUSINESS RESOURCES TODAY
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
            <img src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80" alt="Business Resources" className="rounded-lg w-full object-cover mb-6 md:mb-0" />
          </div>
          <div>
            <div className="uppercase text-xs text-[#C14F2B] font-bold mb-2 tracking-widest">Business Resources</div>
            <h3 className="text-3xl font-semibold mb-4">Tools for Business Success</h3>
            <p className="mb-6 text-gray-700">Our comprehensive business resources provide you with the tools, knowledge, and guidance needed to make informed decisions and drive your business forward. From planning to execution, we're here to support your success.</p>
            <button className="border-2 border-black px-6 py-2 rounded font-semibold hover:bg-black hover:text-white transition">LEARN MORE</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessResources; 