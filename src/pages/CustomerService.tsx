import React, { useState } from 'react';

// Add this at the top of the file for TypeScript support
declare global {
  interface Window {
    Tawk_API?: any;
  }
}

const CustomerService: React.FC = () => {
  // Feedback form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess(false);
    try {
      // Placeholder for API call
      // Replace with your actual API endpoint
      // await fetch('/api/feedback', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ name, email, message }),
      // });
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
      setSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Improved Tawk.to Live Chat Integration
  const openLiveChat = () => {
    const tawkToPropertyId = '6818d26aee59f1190ddb0650';
    const tawkToWidgetId = '1iqgfbssb';
    const scriptId = 'tawkto-script';
    setChatLoading(true);

    function tryOpenChat(retries = 10) {
      if (window.Tawk_API && window.Tawk_API.maximize) {
        window.Tawk_API.maximize();
        setChatLoading(false);
      } else if (retries > 0) {
        setTimeout(() => tryOpenChat(retries - 1), 300);
      } else {
        setChatLoading(false);
        alert('Live chat is currently unavailable. Please try again later.');
      }
    }

    if (!window.Tawk_API) {
      if (!document.getElementById(scriptId)) {
        const s1 = document.createElement('script');
        s1.id = scriptId;
        s1.async = true;
        s1.src = `https://embed.tawk.to/${tawkToPropertyId}/${tawkToWidgetId}`;
        s1.charset = 'UTF-8';
        s1.setAttribute('crossorigin', '*');
        document.body.appendChild(s1);
        s1.onload = () => tryOpenChat();
      } else {
        // Script is loading, wait and try
        tryOpenChat();
      }
    } else {
      tryOpenChat();
    }
  };

  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      {/* Hero Section */}
      <div className="relative w-full h-80 md:h-96 bg-gray-100 flex items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=1500&q=80"
          alt="Customer Service Hero"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-60"
        />
        <div className="absolute inset-0 bg-white opacity-60" />
        <div className="relative z-10 w-full flex justify-center">
          <div className="bg-white rounded-2xl shadow-lg max-w-3xl w-full mt-24 p-8">
            <div className="text-xs text-[#1B4D3E] mb-2 uppercase tracking-widest">HOME &gt; RESOURCES &gt; CUSTOMER SERVICE</div>
            <h1 className="text-3xl md:text-4xl font-semibold mb-4 text-gray-900">Customer Service</h1>
            <p className="mb-4 text-gray-700">We're here to help you with all your banking needs.</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h3 className="text-xl font-semibold mb-4">Phone Support</h3>
            <p className="text-gray-600 mb-4">Available 24/7</p>
            <p className="text-[#1B4D3E] font-semibold">1-800-XXX-XXXX</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h3 className="text-xl font-semibold mb-4">Email Support</h3>
            <p className="text-gray-600 mb-4">Response within 24 hours</p>
            <p className="text-[#1B4D3E] font-semibold">support@ulsterdelt.it.com</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h3 className="text-xl font-semibold mb-4">Live Chat</h3>
            <p className="text-gray-600 mb-4">Available 8 AM - 8 PM EST</p>
            <button
              className="bg-[#1B4D3E] text-white px-6 py-2 rounded hover:bg-[#a13d1d] transition-colors"
              onClick={openLiveChat}
              disabled={chatLoading}
            >
              {chatLoading ? 'Loading Chat...' : 'Start Chat'}
            </button>
          </div>
        </div>

        {/* Common Issues */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-2xl font-semibold mb-6">Common Issues</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Account Access</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Reset password</li>
                <li>• Unlock account</li>
                <li>• Update contact information</li>
                <li>• Report suspicious activity</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Card Services</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Report lost/stolen card</li>
                <li>• Request replacement card</li>
                <li>• Update card preferences</li>
                <li>• Dispute transactions</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Branch Locator */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold mb-4">Find a Branch Near You</h2>
          <p className="text-gray-600 mb-6">Visit us in person for personalized assistance</p>
          <button
            className="bg-[#1B4D3E] text-white px-8 py-3 rounded-lg hover:bg-[#a13d1d] transition-colors"
            onClick={() => window.open('https://www.google.com/maps/search/Ulster+Delt+Bank+branch+near+me', '_blank')}
          >
            Locate Branch
          </button>
        </div>

        {/* Feedback Form */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-6">Send Us Feedback</h2>
          {success && (
            <div className="mb-4 p-4 bg-green-100 text-green-800 rounded">Thank you for your feedback!</div>
          )}
          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-800 rounded">{error}</div>
          )}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-700 mb-2">Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#1B4D3E]"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#1B4D3E]"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Message</label>
              <textarea
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#1B4D3E] h-32"
                value={message}
                onChange={e => setMessage(e.target.value)}
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-[#1B4D3E] text-white px-8 py-3 rounded-lg hover:bg-[#a13d1d] transition-colors"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomerService; 