import React from 'react';

const SecurityCenter: React.FC = () => (
  <div className="min-h-screen bg-[#f5f5f5] px-4 py-8">
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
      <h1 className="text-3xl font-bold mb-6 text-[#1B4D3E]">Security Center</h1>
      <p className="text-gray-700 mb-8">Protecting your financial information is our top priority. Learn about our security measures and how to keep your accounts safe.</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-[#1B4D3E]">1. Account Security Features</h2>
        <div className="space-y-4 text-gray-700">
          <h3 className="font-medium">Multi-Factor Authentication (MFA)</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Two-step verification for all online transactions</li>
            <li>Biometric authentication options (fingerprint, face ID)</li>
            <li>Secure device registration</li>
            <li>One-time passcodes via SMS or authenticator app</li>
          </ul>

          <h3 className="font-medium mt-4">Encryption</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>256-bit SSL encryption for all online transactions</li>
            <li>End-to-end encryption for sensitive data</li>
            <li>Secure data storage and transmission</li>
            <li>Regular security audits and updates</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-[#1B4D3E]">2. Fraud Protection</h2>
        <div className="space-y-4 text-gray-700">
          <h3 className="font-medium">Real-Time Monitoring</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>24/7 transaction monitoring</li>
            <li>Unusual activity detection</li>
            <li>Location-based security alerts</li>
            <li>Automatic fraud detection systems</li>
          </ul>

          <h3 className="font-medium mt-4">Zero Liability Protection</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Protection against unauthorized transactions</li>
            <li>Quick resolution of fraud claims</li>
            <li>Automatic card replacement</li>
            <li>Fraud investigation support</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-[#1B4D3E]">3. Security Best Practices</h2>
        <div className="space-y-4 text-gray-700">
          <h3 className="font-medium">Password Security</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Use strong, unique passwords</li>
            <li>Change passwords regularly</li>
            <li>Never share passwords</li>
            <li>Use a password manager</li>
          </ul>

          <h3 className="font-medium mt-4">Device Security</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Keep devices updated</li>
            <li>Install security software</li>
            <li>Use secure networks</li>
            <li>Enable device encryption</li>
          </ul>

          <h3 className="font-medium mt-4">Online Safety</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Be cautious of phishing attempts</li>
            <li>Verify website security</li>
            <li>Monitor account activity</li>
            <li>Report suspicious activity</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-[#1B4D3E]">4. Security Alerts</h2>
        <div className="space-y-4 text-gray-700">
          <p>Set up security alerts to stay informed about your account activity:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Transaction notifications</li>
            <li>Login alerts</li>
            <li>Password change notifications</li>
            <li>Account balance alerts</li>
            <li>Security setting changes</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-[#1B4D3E]">5. Reporting Security Issues</h2>
        <div className="space-y-4 text-gray-700">
          <p>If you notice any suspicious activity or security concerns:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Contact our 24/7 Security Hotline: 1-833-233-6333</li>
            <li>Report through our mobile app</li>
            <li>Visit your nearest branch</li>
            <li>Email: security@ulsterdelt.it.com</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-[#1B4D3E]">6. Security Resources</h2>
        <div className="space-y-4 text-gray-700">
          <ul className="list-disc pl-6 space-y-2">
            <li>Security awareness training</li>
            <li>Monthly security newsletters</li>
            <li>Security blog and updates</li>
            <li>Educational materials</li>
            <li>Security webinars</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-[#1B4D3E]">7. Emergency Contact</h2>
        <div className="text-gray-700">
          <p>For immediate security assistance:</p>
          <p className="mt-2">
            Ulster Delt Bank Security Department<br />
            6/8, College Green,<br />
            Dublin 2 Dublin, Ireland<br />
            Emergency Hotline: 1-833-233-6333<br />
            Email: security@ulsterdelt.it.com
          </p>
        </div>
      </section>
    </div>
  </div>
);

export default SecurityCenter; 