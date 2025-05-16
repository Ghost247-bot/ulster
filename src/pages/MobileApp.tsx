import React from 'react';
import { Smartphone, Shield, DollarSign, Download } from 'lucide-react';

const MobileApp: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-[#1B4D3E] text-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-4 sm:space-y-6">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                Bank on the go with our mobile app
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-200">
                Manage your accounts, transfer money, and more - all from your smartphone.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-white text-[#1B4D3E] px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center">
                  <Download className="mr-2" />
                  Download for iOS
                </button>
                <button className="bg-white text-[#1B4D3E] px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center">
                  <Download className="mr-2" />
                  Download for Android
                </button>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80"
                alt="Mobile Banking App"
                className="w-full h-auto rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12">
            Everything you need in one app
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Smartphone className="w-12 h-12 text-[#1B4D3E] mb-4" />
              <h3 className="text-xl font-semibold mb-3">Mobile Banking</h3>
              <p className="text-gray-600 mb-4">Bank anywhere, anytime with our secure mobile app.</p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[#1B4D3E] rounded-full mr-2"></span>
                  Check balances
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[#1B4D3E] rounded-full mr-2"></span>
                  Transfer funds
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[#1B4D3E] rounded-full mr-2"></span>
                  Pay bills
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[#1B4D3E] rounded-full mr-2"></span>
                  Mobile deposits
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <Shield className="w-12 h-12 text-[#1B4D3E] mb-4" />
              <h3 className="text-xl font-semibold mb-3">Security Features</h3>
              <p className="text-gray-600 mb-4">Bank with confidence using our advanced security features.</p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[#1B4D3E] rounded-full mr-2"></span>
                  Biometric login
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[#1B4D3E] rounded-full mr-2"></span>
                  Secure messaging
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[#1B4D3E] rounded-full mr-2"></span>
                  Fraud alerts
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[#1B4D3E] rounded-full mr-2"></span>
                  Device management
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <DollarSign className="w-12 h-12 text-[#1B4D3E] mb-4" />
              <h3 className="text-xl font-semibold mb-3">Financial Tools</h3>
              <p className="text-gray-600 mb-4">Take control of your finances with our powerful tools.</p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[#1B4D3E] rounded-full mr-2"></span>
                  Budget tracking
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[#1B4D3E] rounded-full mr-2"></span>
                  Spending insights
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[#1B4D3E] rounded-full mr-2"></span>
                  Savings goals
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[#1B4D3E] rounded-full mr-2"></span>
                  Investment tracking
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section className="bg-gray-100 py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
              Ready to get started?
            </h2>
            <p className="text-gray-600 mb-8 sm:mb-12 text-base sm:text-lg">
              Download our mobile app today and experience banking at your fingertips.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-[#1B4D3E] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#153d32] transition-colors duration-200 flex items-center justify-center">
                <Download className="mr-2" />
                Download for iOS
              </button>
              <button className="bg-[#1B4D3E] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#153d32] transition-colors duration-200 flex items-center justify-center">
                <Download className="mr-2" />
                Download for Android
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MobileApp; 