import React from 'react';
import { useNavigate } from 'react-router-dom';

const FinancialEducation: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      {/* Hero Section */}
      <div className="relative w-full h-80 md:h-96 bg-gray-100 flex items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=1500&q=80"
          alt="Financial Education Hero"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-60"
        />
        <div className="absolute inset-0 bg-white opacity-60" />
        <div className="relative z-10 w-full flex justify-center">
          <div className="bg-white rounded-2xl shadow-lg max-w-3xl w-full mt-24 p-8">
            <div className="text-xs text-[#C14F2B] mb-2 uppercase tracking-widest">HOME &gt; RESOURCES &gt; FINANCIAL EDUCATION</div>
            <h1 className="text-3xl md:text-4xl font-semibold mb-4 text-gray-900">Financial Education</h1>
            <p className="mb-4 text-gray-700">Empower yourself with financial knowledge and make informed decisions.</p>
            <p className="mb-4 text-gray-700">Access our comprehensive library of educational resources and tools.</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Financial Basics */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Financial Basics</h2>
            <ul className="space-y-2">
              <li>• Understanding Credit Scores</li>
              <li>• Budgeting Fundamentals</li>
              <li>• Saving Strategies</li>
              <li>• Debt Management</li>
            </ul>
          </div>

          {/* Investment Education */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Investment Education</h2>
            <ul className="space-y-2">
              <li>• Investment Basics</li>
              <li>• Retirement Planning</li>
              <li>• Market Fundamentals</li>
              <li>• Risk Management</li>
            </ul>
          </div>

          {/* Digital Banking */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Digital Banking</h2>
            <ul className="space-y-2">
              <li>• Online Banking Security</li>
              <li>• Mobile Banking Tips</li>
              <li>• Digital Payment Methods</li>
              <li>• Fraud Prevention</li>
            </ul>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold mb-4">Ready to Learn More?</h2>
          <p className="text-gray-600 mb-6">Explore our comprehensive financial education resources and take control of your financial future.</p>
          <button
            className="bg-[#C14F2B] text-white px-8 py-3 rounded-lg hover:bg-[#a13d1d] transition-colors"
            onClick={() => navigate('/contact')}
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinancialEducation; 