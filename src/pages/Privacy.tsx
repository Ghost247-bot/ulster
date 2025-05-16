import React from 'react';

const Privacy: React.FC = () => (
  <div className="min-h-screen bg-[#f5f5f5] px-4 py-8">
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
      <h1 className="text-3xl font-bold mb-6 text-[#1B4D3E]">Privacy Policy</h1>
      <p className="text-gray-700 mb-6">Last updated: July 2024</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-[#1B4D3E]">1. Information We Collect</h2>
        <div className="space-y-4 text-gray-700">
          <h3 className="font-medium">Personal Information</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Name, address, and contact information</li>
            <li>Social Security number and date of birth</li>
            <li>Financial information and account details</li>
            <li>Transaction history and banking activities</li>
            <li>Device and browser information</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-[#1B4D3E]">2. How We Use Your Information</h2>
        <div className="space-y-4 text-gray-700">
          <ul className="list-disc pl-6 space-y-2">
            <li>Process your transactions and maintain your accounts</li>
            <li>Provide customer service and support</li>
            <li>Detect and prevent fraud</li>
            <li>Comply with legal obligations</li>
            <li>Improve our services and develop new features</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-[#1B4D3E]">3. Information Sharing</h2>
        <div className="space-y-4 text-gray-700">
          <p>We may share your information with:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Service providers and business partners</li>
            <li>Financial institutions and payment processors</li>
            <li>Legal and regulatory authorities</li>
            <li>Credit reporting agencies</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-[#1B4D3E]">4. Your Rights</h2>
        <div className="space-y-4 text-gray-700">
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access your personal information</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Opt-out of marketing communications</li>
            <li>File a complaint with regulatory authorities</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-[#1B4D3E]">5. Data Security</h2>
        <div className="space-y-4 text-gray-700">
          <p>We implement robust security measures to protect your information, including:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Encryption of sensitive data</li>
            <li>Multi-factor authentication</li>
            <li>Regular security audits</li>
            <li>Employee training and awareness</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-[#1B4D3E]">6. Cookies and Tracking</h2>
        <div className="space-y-4 text-gray-700">
          <p>We use cookies and similar technologies to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Remember your preferences</li>
            <li>Analyze website usage</li>
            <li>Enhance security</li>
            <li>Improve user experience</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-[#1B4D3E]">7. Children's Privacy</h2>
        <p className="text-gray-700">Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal information from children.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-[#1B4D3E]">8. Changes to This Policy</h2>
        <p className="text-gray-700">We may update this privacy policy periodically. We will notify you of any material changes through our website or other communication channels.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-[#1B4D3E]">9. Contact Us</h2>
        <div className="text-gray-700">
          <p>If you have questions about this privacy policy, please contact us at:</p>
          <p className="mt-2">
            Ulster Delt Bank<br />
            6/8, College Green,<br />
            Dublin 2 Dublin, Ireland<br />
            Email: privacy@ulsterdelt.it.com<br />
            Phone: 1-833-233-6333
          </p>
        </div>
      </section>
    </div>
  </div>
);

export default Privacy; 