import React, { useState } from 'react';
import { FiMapPin, FiPhone, FiClock, FiSearch } from 'react-icons/fi';

const BranchLocator: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for branches
  const branches = [
    {
      id: 1,
      name: 'Main Branch',
      address: '123 Main Street, New York, NY 10001',
      phone: '(555) 123-4567',
      hours: 'Mon-Fri: 9:00 AM - 5:00 PM',
      type: 'Branch',
      services: ['Full Service', 'ATM', 'Drive-thru']
    },
    {
      id: 2,
      name: 'Downtown ATM',
      address: '456 Broadway, New York, NY 10013',
      phone: '(555) 234-5678',
      hours: '24/7',
      type: 'ATM',
      services: ['ATM Only']
    },
    {
      id: 3,
      name: 'Westside Branch',
      address: '789 West Avenue, New York, NY 10019',
      phone: '(555) 345-6789',
      hours: 'Mon-Fri: 9:00 AM - 5:00 PM',
      type: 'Branch',
      services: ['Full Service', 'ATM', 'Safe Deposit Boxes']
    }
  ];

  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      {/* Hero Section */}
      <div className="relative w-full h-80 md:h-96 bg-gray-100 flex items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1500&q=80"
          alt="Branch Locator Hero"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-60"
        />
        <div className="absolute inset-0 bg-white opacity-60" />
        <div className="relative z-10 w-full flex justify-center">
          <div className="bg-white rounded-2xl shadow-lg max-w-3xl w-full mt-24 p-8">
            <div className="text-xs text-[#C14F2B] mb-2 uppercase tracking-widest">HOME &gt; RESOURCES &gt; BRANCH & ATM LOCATOR</div>
            <h1 className="text-3xl md:text-4xl font-semibold mb-4 text-gray-900">Find a Branch or ATM</h1>
            <p className="mb-4 text-gray-700">Locate our branches and ATMs near you.</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter your address, city, or ZIP code"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C14F2B] focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <button className="bg-[#C14F2B] text-white px-8 py-3 rounded-md font-semibold hover:bg-[#a13d1d] transition-colors">
              Search
            </button>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {branches.map((branch) => (
            <div key={branch.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{branch.name}</h3>
                  <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                    {branch.type}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start">
                  <FiMapPin className="w-5 h-5 text-[#C14F2B] mt-1 mr-3" />
                  <p className="text-gray-600">{branch.address}</p>
                </div>
                <div className="flex items-start">
                  <FiPhone className="w-5 h-5 text-[#C14F2B] mt-1 mr-3" />
                  <p className="text-gray-600">{branch.phone}</p>
                </div>
                <div className="flex items-start">
                  <FiClock className="w-5 h-5 text-[#C14F2B] mt-1 mr-3" />
                  <p className="text-gray-600">{branch.hours}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="font-semibold mb-2">Available Services:</h4>
                <div className="flex flex-wrap gap-2">
                  {branch.services.map((service, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Map Placeholder */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-6">Interactive Map</h2>
          <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
            <p className="text-gray-600">Map integration will be implemented here</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-[#C14F2B] text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Need Help Finding a Location?</h2>
          <p className="mb-6">Our customer service team is here to assist you.</p>
          <button className="inline-block bg-white text-[#C14F2B] px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default BranchLocator; 