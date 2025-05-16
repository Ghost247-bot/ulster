import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const [modal, setModal] = useState<'learnMore' | 'getDetails' | 'applyOnline' | null>(null);
  const navigate = useNavigate();

  const closeModal = () => {
    setModal(null);
  };

  const modalContent = {
    learnMore: (
      <div className="space-y-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-[#1B4D3E] bg-opacity-10 flex items-center justify-center">
            <svg className="w-6 h-6 text-[#1B4D3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold">Free Credit Score & Report</h3>
        </div>
        <p className="text-sm sm:text-base text-gray-600">
          Get your free credit score and report with Ulster Credit Companion. Monitor your credit health and get personalized recommendations to improve your score.
        </p>
        <button
          onClick={() => {
            closeModal();
            navigate('/credit-score');
          }}
          className="w-full bg-[#1B4D3E] text-white px-4 py-2 rounded-lg hover:bg-[#153d32] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          Get Started
        </button>
      </div>
    ),
    getDetails: (
      <div className="space-y-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-[#1B4D3E] bg-opacity-10 flex items-center justify-center">
            <svg className="w-6 h-6 text-[#1B4D3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold">No Closing Cost Mortgages</h3>
        </div>
        <p className="text-sm sm:text-base text-gray-600">
          *Terms and conditions apply. Available for qualified borrowers. Contact a mortgage specialist for details.
        </p>
        <button
          onClick={() => {
            closeModal();
            navigate('/mortgages');
          }}
          className="w-full bg-[#1B4D3E] text-white px-4 py-2 rounded-lg hover:bg-[#153d32] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          Learn More
        </button>
      </div>
    ),
    applyOnline: (
      <div className="space-y-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-[#1B4D3E] bg-opacity-10 flex items-center justify-center">
            <svg className="w-6 h-6 text-[#1B4D3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold">Secured Personal Loan Rate Special</h3>
        </div>
        <p className="text-sm sm:text-base text-gray-600">
          **6.69% APR with auto pay. Rate may vary based on creditworthiness and other factors. Minimum loan amount $5,000.
        </p>
        <button
          onClick={() => {
            closeModal();
            navigate('/personal-loans');
          }}
          className="w-full bg-[#1B4D3E] text-white px-4 py-2 rounded-lg hover:bg-[#153d32] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          Apply Now
        </button>
      </div>
    ),
  };

  return (
    <section className="relative w-full min-h-[300px] sm:min-h-[400px] md:min-h-[500px] lg:min-h-[600px] bg-[#1B4D3E] overflow-hidden">
      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-md relative animate-fade-in-up">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl font-bold transition-colors duration-200"
              onClick={closeModal}
              aria-label="Close"
            >
              ×
            </button>
            {modalContent[modal]}
          </div>
        </div>
      )}
      
      {/* Background image with gradient overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1500&q=80"
          alt="Family banking"
          className="w-full h-full object-cover object-center opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1B4D3E] via-[#1B4D3E]/80 to-[#1B4D3E]/60" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-10 md:py-16">
        <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-4 sm:p-6 flex flex-col items-center text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="w-12 h-12 rounded-full bg-[#1B4D3E] bg-opacity-10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#1B4D3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xs tracking-widest text-gray-500 mb-2">ULSTER CREDIT COMPANION</span>
            <h2 className="text-base sm:text-lg md:text-xl font-light mb-2">Free credit score & report</h2>
            <button onClick={() => setModal('learnMore')} className="border border-black px-4 py-2 mt-2 text-xs sm:text-sm hover:bg-gray-100 w-full sm:w-auto transition-all duration-200 rounded-lg hover:shadow-md">LEARN MORE</button>
          </div>
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-4 sm:p-6 flex flex-col items-center text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="w-12 h-12 rounded-full bg-[#1B4D3E] bg-opacity-10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#1B4D3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xs tracking-widest text-gray-500 mb-2">NO CLOSING COST MORTGAGES</span>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2">$0.00<sup className="text-xs">*</sup></h2>
            <span className="text-xs text-gray-500 mb-2">IN CLOSING COSTS</span>
            <button onClick={() => setModal('getDetails')} className="text-[#1B4D3E] underline text-xs sm:text-sm font-medium hover:text-[#153d32] transition-colors duration-200">GET DETAILS</button>
          </div>
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-4 sm:p-6 flex flex-col items-center text-center sm:col-span-2 lg:col-span-1 transform transition-all duration-300 hover:scale-105 hover:shadow-xl animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="w-12 h-12 rounded-full bg-[#1B4D3E] bg-opacity-10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#1B4D3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span className="text-xs tracking-widest text-gray-500 mb-2">SECURED PERSONAL LOAN RATE SPECIAL</span>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2">6.69%<sup className="text-xs">**</sup></h2>
            <span className="text-xs text-gray-500 mb-2">FIXED APR WITH AUTO PAY</span>
            <button onClick={() => setModal('applyOnline')} className="text-[#1B4D3E] underline text-xs sm:text-sm font-medium hover:text-[#153d32] transition-colors duration-200">APPLY ONLINE</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 