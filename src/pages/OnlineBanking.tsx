import React from 'react';
import { Link } from 'react-router-dom';
import { FiCreditCard, FiDollarSign, FiShield, FiClock } from 'react-icons/fi';

const OnlineBanking: React.FC = () => {
  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      {/* Hero Section */}
      <div className="relative w-full h-80 md:h-96 bg-gray-100 flex items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=1500&q=80"
          alt="Online Banking Hero"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-60"
        />
        <div className="absolute inset-0 bg-white opacity-60" />
        <div className="relative z-10 w-full flex justify-center">
          <div className="bg-white rounded-2xl shadow-lg max-w-3xl w-full mt-24 p-8">
            <div className="text-xs text-[#1B4D3E] mb-2 uppercase tracking-widest">HOME &gt; RESOURCES &gt; ONLINE BANKING</div>
            <h1 className="text-3xl md:text-4xl font-semibold mb-4 text-gray-900">Online Banking</h1>
            <p className="mb-4 text-gray-700">Bank securely from anywhere, anytime.</p>
            <p className="mb-4 text-gray-700">Manage your accounts, pay bills, and more with our online banking platform.</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <FiCreditCard className="w-12 h-12 text-[#1B4D3E] mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-4">Account Management</h3>
            <p className="text-gray-600 mb-4">Manage all your accounts in one place</p>
            <ul className="text-left space-y-2 text-gray-600">
              <li>• View balances</li>
              <li>• Transfer funds</li>
              <li>• Pay bills</li>
              <li>• Set up alerts</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <FiDollarSign className="w-12 h-12 text-[#1B4D3E] mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-4">Financial Tools</h3>
            <p className="text-gray-600 mb-4">Powerful tools for your finances</p>
            <ul className="text-left space-y-2 text-gray-600">
              <li>• Budget tracking</li>
              <li>• Spending analysis</li>
              <li>• Savings goals</li>
              <li>• Investment tracking</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <FiShield className="w-12 h-12 text-[#1B4D3E] mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-4">Security Features</h3>
            <p className="text-gray-600 mb-4">Bank with confidence</p>
            <ul className="text-left space-y-2 text-gray-600">
              <li>• Secure login</li>
              <li>• Fraud protection</li>
              <li>• Account alerts</li>
              <li>• Secure messaging</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <FiClock className="w-12 h-12 text-[#1B4D3E] mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-4">24/7 Access</h3>
            <p className="text-gray-600 mb-4">Bank on your schedule</p>
            <ul className="text-left space-y-2 text-gray-600">
              <li>• Anytime access</li>
              <li>• Mobile banking</li>
              <li>• Bill payments</li>
              <li>• Account alerts</li>
            </ul>
          </div>
        </div>

        {/* Login Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">Access Your Accounts</h2>
          <div className="flex flex-col md:flex-row justify-center items-center gap-6">
            <Link
              to="/login"
              className="inline-block bg-[#1B4D3E] text-white px-8 py-3 rounded-md font-semibold hover:bg-[#a13d1d] transition-colors"
            >
              Log In to Online Banking
            </Link>
            <Link
              to="/register"
              className="inline-block bg-white text-[#1B4D3E] border-2 border-[#1B4D3E] px-8 py-3 rounded-md font-semibold hover:bg-gray-50 transition-colors"
            >
              Enroll in Online Banking
            </Link>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-[#1B4D3E] text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Need Help with Online Banking?</h2>
          <p className="mb-6">Our support team is here to help you get started or resolve any issues.</p>
          <Link
            to="/contact"
            className="inline-block bg-white text-[#1B4D3E] px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
          >
            Get Support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OnlineBanking; 