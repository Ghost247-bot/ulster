import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FAQs: React.FC = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const navigate = useNavigate();

  const faqs = [
    {
      question: "What services does Ulster Delt Bank offer?",
      answer: "Ulster Delt Bank offers a comprehensive range of banking services including personal and business accounts, loans, credit cards, investment services, and wealth management solutions. We also provide online and mobile banking services for convenient account management."
    },
    {
      question: "How do I open a new account?",
      answer: "You can open a new account in several ways: visit any of our branches, apply online through our website, or call our customer service. You'll need to provide valid identification, proof of address, and other required documentation."
    },
    {
      question: "What are your banking hours?",
      answer: "Our branch hours are Monday through Friday, 9:00 AM to 5:00 PM, and Saturday from 9:00 AM to 1:00 PM. Our online and mobile banking services are available 24/7."
    },
    {
      question: "How do I report a lost or stolen card?",
      answer: "If your card is lost or stolen, please call our 24/7 customer service immediately at 1-800-XXX-XXXX. We'll help you block the card and issue a replacement."
    },
    {
      question: "What security measures do you have in place?",
      answer: "We employ multiple layers of security including encryption, fraud monitoring, two-factor authentication, and secure login procedures. We also provide security alerts and regular security updates to our customers."
    },
    {
      question: "How can I access my account online?",
      answer: "You can access your account through our website or mobile app. Simply register for online banking, create your login credentials, and you'll have access to your accounts, statements, and banking services."
    }
  ];

  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      {/* Hero Section */}
      <div className="relative w-full h-80 md:h-96 bg-gray-100 flex items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=1500&q=80"
          alt="FAQs Hero"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-60"
        />
        <div className="absolute inset-0 bg-white opacity-60" />
        <div className="relative z-10 w-full flex justify-center">
          <div className="bg-white rounded-2xl shadow-lg max-w-3xl w-full mt-24 p-8">
            <div className="text-xs text-[#1B4D3E] mb-2 uppercase tracking-widest">HOME &gt; RESOURCES &gt; FAQs</div>
            <h1 className="text-3xl md:text-4xl font-semibold mb-4 text-gray-900">Frequently Asked Questions</h1>
            <p className="mb-4 text-gray-700">Find answers to common questions about our banking services and solutions.</p>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md">
              <button
                className="w-full text-left px-6 py-4 focus:outline-none"
                onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">{faq.question}</h3>
                  <span className="text-[#1B4D3E] text-2xl">
                    {openFAQ === index ? '−' : '+'}
                  </span>
                </div>
              </button>
              {openFAQ === index && (
                <div className="px-6 pb-4 text-gray-600">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold mb-4">Still Have Questions?</h2>
          <p className="text-gray-600 mb-6">Our customer service team is here to help you with any additional questions.</p>
          <button
            className="bg-[#1B4D3E] text-white px-8 py-3 rounded-lg hover:bg-[#153d32] transition-colors"
            onClick={() => navigate('/contact')}
          >
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
};

export default FAQs; 