import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomeBody: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-gradient-to-b from-white to-gray-50">
      {/* Homebuying Journey Section */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-12 sm:py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center relative">
        <div className="animate-fade-in-right space-y-6">
          <div className="inline-block">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#C14F2B]/10 text-[#C14F2B]">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              HOMEBUYING JOURNEY
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight">Buying a home? We'll walk you through it all.</h2>
          <div className="space-y-4">
            <p className="text-gray-700 text-base md:text-lg lg:text-xl leading-relaxed">Homebuying may seem like a daunting process, but it doesn't have to be. With the right partner by your side, you can take it on with ease.</p>
            <p className="text-gray-700 text-base md:text-lg lg:text-xl leading-relaxed">Get a comprehensive look at the homebuying process and get your questions answered along the way.</p>
          </div>
          <button 
            onClick={() => navigate('/home-journey')} 
            className="group inline-flex items-center px-6 py-3 border-2 border-[#C14F2B] text-[#C14F2B] font-medium text-base rounded-lg hover:bg-[#C14F2B] hover:text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            START YOUR JOURNEY
            <svg className="w-5 h-5 ml-2 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
        <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] animate-fade-in-left group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#C14F2B]/20 to-transparent rounded-2xl transform transition-transform duration-500 group-hover:scale-105"></div>
          <img
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80"
            alt="Home buying journey"
            className="w-full h-full object-cover rounded-2xl shadow-xl transform transition-all duration-500 group-hover:scale-105"
          />
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-12 sm:py-16 md:py-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col justify-between hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up group" style={{ animationDelay: '0.1s' }}>
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#C14F2B]/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#C14F2B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold mb-3">Invest & Insure</h4>
              <p className="text-gray-600 mb-6">Get the right financial strategy to help you grow your money and save for the future.</p>
            </div>
            <button 
              onClick={() => navigate('/invest-insure')} 
              className="inline-flex items-center text-[#C14F2B] font-medium hover:text-[#C14F2B]/80 transition-colors duration-200 group-hover:underline"
            >
              LEARN MORE
              <svg className="w-5 h-5 ml-2 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col justify-between hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up group" style={{ animationDelay: '0.2s' }}>
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#C14F2B]/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#C14F2B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold mb-3">Financial Calculators</h4>
              <p className="text-gray-600 mb-6">Estimate your mortgage, compare rates, and much more with our financial calculators.</p>
            </div>
            <button 
              onClick={() => navigate('/financial-calculators')} 
              className="inline-flex items-center text-[#C14F2B] font-medium hover:text-[#C14F2B]/80 transition-colors duration-200 group-hover:underline"
            >
              DO THE MATH
              <svg className="w-5 h-5 ml-2 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col justify-between hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up group" style={{ animationDelay: '0.3s' }}>
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#C14F2B]/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#C14F2B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold mb-3">Access Your Equity</h4>
              <p className="text-gray-600 mb-6">Ready to use your home's value? Access your equity with our easy process.</p>
            </div>
            <button 
              onClick={() => navigate('/access-equity')} 
              className="inline-flex items-center text-[#C14F2B] font-medium hover:text-[#C14F2B]/80 transition-colors duration-200 group-hover:underline"
            >
              ACCESS YOUR EQUITY
              <svg className="w-5 h-5 ml-2 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Wide Promo Section */}
      <section className="relative w-full py-12 sm:py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1500&q=80"
            alt="Promo"
            className="w-full h-full object-cover object-center opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#C14F2B] via-[#C14F2B]/90 to-[#C14F2B]/80" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 flex flex-col items-center justify-center w-full py-12 sm:py-16 md:py-24 animate-fade-in">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white mb-4">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            REWARDS. LOW INTRO. BONUS OFFER.
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-white mb-8 text-center max-w-3xl leading-tight">Everything you want. All in one credit card.</h2>
          <button
            onClick={() => navigate('/credit-card')}
            className="group inline-flex items-center px-8 py-4 border-2 border-white text-white font-medium text-lg rounded-xl hover:bg-white hover:text-[#C14F2B] transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
          >
            LEARN MORE
            <svg className="w-5 h-5 ml-2 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </section>

      {/* Latest News/Blog Section */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-12 sm:py-16 md:py-24">
        <div className="text-center mb-12">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#C14F2B]/10 text-[#C14F2B] mb-4">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            LATEST NEWS
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 animate-fade-in">There's plenty to know about banking. Here's the latest.</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up group" style={{ animationDelay: '0.1s' }}>
            <div className="relative overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80" 
                alt="Rescue Vehicles" 
                className="w-full h-48 sm:h-56 md:h-64 object-cover transform transition-transform duration-500 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="p-6 sm:p-8">
              <h3 className="text-xl font-semibold mb-3 group-hover:text-[#C14F2B] transition-colors duration-200">The right response: Driving growth for North Eastern Rescue Vehicles</h3>
              <p className="text-gray-600 mb-6">The right moment is everything for North Eastern Rescue Vehicles. Our responsive banking partnership helps this business rise to the occasion and provide a life-saving service.</p>
              <button className="inline-flex items-center text-[#C14F2B] font-medium hover:text-[#C14F2B]/80 transition-colors duration-200 group-hover:underline">
                READ MORE
                <svg className="w-5 h-5 ml-2 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up group" style={{ animationDelay: '0.2s' }}>
            <div className="relative overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80" 
                alt="Tax refund" 
                className="w-full h-48 sm:h-56 md:h-64 object-cover transform transition-transform duration-500 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="p-6 sm:p-8">
              <h3 className="text-xl font-semibold mb-3 group-hover:text-[#C14F2B] transition-colors duration-200">Make the most of your tax refund: 6 smart money moves</h3>
              <p className="text-gray-600 mb-6">A tax refund can be a chance to get ahead financially. Instead of spending it all right away, think about where your money would be most useful for you.</p>
              <button className="inline-flex items-center text-[#C14F2B] font-medium hover:text-[#C14F2B]/80 transition-colors duration-200 group-hover:underline">
                READ MORE
                <svg className="w-5 h-5 ml-2 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up group" style={{ animationDelay: '0.3s' }}>
            <div className="relative overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=400&q=80" 
                alt="Digital banking" 
                className="w-full h-48 sm:h-56 md:h-64 object-cover transform transition-transform duration-500 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="p-6 sm:p-8">
              <h3 className="text-xl font-semibold mb-3 group-hover:text-[#C14F2B] transition-colors duration-200">Digital banking made simple: Tips for managing your money online</h3>
              <p className="text-gray-600 mb-6">Learn how to make the most of our digital banking tools and services to manage your finances more effectively.</p>
              <button className="inline-flex items-center text-[#C14F2B] font-medium hover:text-[#C14F2B]/80 transition-colors duration-200 group-hover:underline">
                READ MORE
                <svg className="w-5 h-5 ml-2 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeBody; 