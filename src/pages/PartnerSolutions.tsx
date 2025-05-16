import React from 'react';
import { Link } from 'react-router-dom';

const PartnerSolutions = () => {
  return (
    <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#C14F2B]/10 text-[#C14F2B] mb-4">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            PARTNER SOLUTIONS
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">Partner Solutions</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">Comprehensive business solutions and partnerships to help your organization thrive in today's competitive market.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-12 h-12 rounded-xl bg-[#C14F2B]/10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#C14F2B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Business Banking</h3>
            <p className="text-gray-600 mb-4">Tailored banking solutions to support your business operations and growth.</p>
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Merchant Services</h3>
            <p className="text-gray-600 mb-4">Advanced payment processing and merchant solutions for your business.</p>
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
            <h3 className="text-xl font-semibold mb-3">Business Growth</h3>
            <p className="text-gray-600 mb-4">Strategic solutions and resources to help your business expand and succeed.</p>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Why Choose Our Partner Solutions?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-16 h-16 rounded-full bg-[#C14F2B]/10 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-[#C14F2B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Dedicated Support</h3>
              <p className="text-gray-600">Personalized assistance and guidance for your business needs.</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-16 h-16 rounded-full bg-[#C14F2B]/10 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-[#C14F2B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Innovative Solutions</h3>
              <p className="text-gray-600">Cutting-edge technology and modern business tools.</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-16 h-16 rounded-full bg-[#C14F2B]/10 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-[#C14F2B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Flexible Options</h3>
              <p className="text-gray-600">Customizable solutions to match your business requirements.</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-16 h-16 rounded-full bg-[#C14F2B]/10 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-[#C14F2B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Quick Implementation</h3>
              <p className="text-gray-600">Fast and efficient setup of business solutions.</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-[#C14F2B] rounded-3xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Grow Your Business?</h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">Partner with us to access comprehensive business solutions and take your organization to the next level.</p>
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

export default PartnerSolutions; 