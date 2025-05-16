import React from 'react';

const Terms: React.FC = () => (
  <div className="min-h-screen bg-[#f5f5f5] px-4 py-8">
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
      <h1 className="text-3xl font-bold mb-6 text-[#1B4D3E]">Terms of Use</h1>
      <p className="text-gray-700 mb-6">Last updated: July 2024</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-[#1B4D3E]">1. Agreement to Terms</h2>
        <p className="text-gray-700 mb-4">
          By accessing or using Ulster Delt Bank's services, you agree to be bound by these Terms of Use. If you disagree with any part of these terms, you may not access our services.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-[#1B4D3E]">2. Account Registration</h2>
        <div className="space-y-4 text-gray-700">
          <p>To use our services, you must:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Be at least 18 years old</li>
            <li>Provide accurate and complete information</li>
            <li>Maintain the security of your account credentials</li>
            <li>Notify us immediately of any unauthorized access</li>
            <li>Comply with all applicable laws and regulations</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-[#1B4D3E]">3. Banking Services</h2>
        <div className="space-y-4 text-gray-700">
          <p>Our banking services include:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Checking and savings accounts</li>
            <li>Online and mobile banking</li>
            <li>Bill payment and transfers</li>
            <li>Credit and debit cards</li>
            <li>Loans and mortgages</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-[#1B4D3E]">4. Fees and Charges</h2>
        <div className="space-y-4 text-gray-700">
          <p>You agree to pay all applicable fees and charges, including:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Account maintenance fees</li>
            <li>Transaction fees</li>
            <li>Overdraft charges</li>
            <li>Late payment penalties</li>
            <li>Service charges</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-[#1B4D3E]">5. Electronic Communications</h2>
        <div className="space-y-4 text-gray-700">
          <p>By using our services, you consent to receive electronic communications, including:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Account statements</li>
            <li>Transaction notifications</li>
            <li>Security alerts</li>
            <li>Marketing communications (with opt-out option)</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-[#1B4D3E]">6. Prohibited Activities</h2>
        <div className="space-y-4 text-gray-700">
          <p>You agree not to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Use our services for illegal purposes</li>
            <li>Attempt to gain unauthorized access</li>
            <li>Interfere with service operation</li>
            <li>Share account credentials</li>
            <li>Engage in fraudulent activities</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-[#1B4D3E]">7. Intellectual Property</h2>
        <p className="text-gray-700">
          All content, trademarks, and intellectual property on our website and services are owned by Ulster Delt Bank and protected by applicable laws.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-[#1B4D3E]">8. Limitation of Liability</h2>
        <p className="text-gray-700">
          Ulster Delt Bank shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-[#1B4D3E]">9. Changes to Terms</h2>
        <p className="text-gray-700">
          We reserve the right to modify these terms at any time. We will notify you of any material changes through our website or other communication channels.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-[#1B4D3E]">10. Governing Law</h2>
        <p className="text-gray-700">
          These terms shall be governed by and construed in accordance with the laws of the State of New York, without regard to its conflict of law provisions.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-[#1B4D3E]">11. Contact Information</h2>
        <div className="text-gray-700">
          <p>For questions about these terms, please contact us at:</p>
          <p className="mt-2">
            Ulster Delt Bank<br />
            6/8, College Green,<br />
            Dublin 2 Dublin, Ireland<br />
            Email: legal@ulsterdelt.it.com<br />
            Phone: 1-833-233-6333
          </p>
        </div>
      </section>
    </div>
  </div>
);

export default Terms; 