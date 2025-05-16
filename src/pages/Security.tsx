import React from 'react';

const Security: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5f5f5] px-4">
    <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl w-full text-left">
      <h1 className="text-3xl font-bold mb-4 text-[#1B4D3E]">Security</h1>
      <p className="mb-4 text-gray-700">
        Your security is our top priority. Learn how we protect your information and how you can stay safe online.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2 text-[#1B4D3E]">Our Security Measures</h2>
      <ul className="list-disc pl-6 text-gray-700 mb-4">
        <li>Encryption of all sensitive data</li>
        <li>Multi-factor authentication for account access</li>
        <li>Continuous fraud monitoring</li>
        <li>Regular security audits and updates</li>
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-2 text-[#1B4D3E]">How You Can Stay Safe</h2>
      <ul className="list-disc pl-6 text-gray-700 mb-4">
        <li>Never share your password or PIN</li>
        <li>Use strong, unique passwords</li>
        <li>Monitor your accounts regularly</li>
        <li>Contact us immediately if you notice suspicious activity</li>
      </ul>
      <p className="text-gray-500 text-sm mt-8">For more information, contact our security team at <a href="mailto:support@ulsterdelt.it.com" className="text-[#1B4D3E] underline">support@ulsterdelt.it.com</a>.</p>
      <p className="text-gray-500 text-sm mt-2">Last updated: July 2024</p>
    </div>
  </div>
);

export default Security; 