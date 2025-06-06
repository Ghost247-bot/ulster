import React from 'react';
import { Link } from 'react-router-dom';

const TrustServices = () => {
  return (
    <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#C14F2B]/10 text-[#C14F2B] mb-4">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            TRUST SERVICES
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">Trust Services</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">Our trust services provide professional management and administration of trusts to help protect and grow your assets.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-12 h-12 rounded-xl bg-[#C14F2B]/10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#C14F2B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Trust Administration</h3>
            <p className="text-gray-600 mb-4">Professional administration of your trust with attention to detail and compliance.</p>
            <Link to="/contact" className="inline-flex items-center text-[#C14F2B] font-medium hover:text-[#C14F2B]/80 transition-colors duration-200">
              Learn More
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-12 h-12 rounded-xl bg-[#C14F2B]/10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#C14F2B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Trust Planning</h3>
            <p className="text-gray-600 mb-4">Strategic trust planning to protect your assets and provide for your beneficiaries.</p>
            <Link to="/contact" className="inline-flex items-center text-[#C14F2B] font-medium hover:text-[#C14F2B]/80 transition-colors duration-200">
              Learn More
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-12 h-12 rounded-xl bg-[#C14F2B]/10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#C14F2B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Trustee Services</h3>
            <p className="text-gray-600 mb-4">Professional trustee services to manage and distribute trust assets according to your wishes.</p>
            <Link to="/contact" className="inline-flex items-center text-[#C14F2B] font-medium hover:text-[#C14F2B]/80 transition-colors duration-200">
              Learn More
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Why Choose Our Trust Services?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-16 h-16 rounded-full bg-[#C14F2B]/10 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-[#C14F2B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Expert Trustees</h3>
              <p className="text-gray-600">Experienced professionals dedicated to managing your trust assets.</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-16 h-16 rounded-full bg-[#C14F2B]/10 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-[#C14F2B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Customized Solutions</h3>
              <p className="text-gray-600">Tailored trust structures to meet your specific needs and goals.</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-16 h-16 rounded-full bg-[#C14F2B]/10 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-[#C14F2B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Asset Protection</h3>
              <p className="text-gray-600">Robust strategies to safeguard your assets for future generations.</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-16 h-16 rounded-full bg-[#C14F2B]/10 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-[#C14F2B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Regular Reporting</h3>
              <p className="text-gray-600">Transparent communication and detailed trust performance updates.</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-[#C14F2B] rounded-3xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Secure Your Legacy?</h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">Take the first step towards protecting your assets and ensuring your wishes are carried out with our trust services.</p>
          <Link to="/contact" className="inline-flex items-center px-6 py-3 bg-white text-[#C14F2B] rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200">
            Get Started
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TrustServices; 