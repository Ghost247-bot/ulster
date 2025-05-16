import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Contact: React.FC = () => {
  const [modal, setModal] = useState<null | string>(null);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const navigate = useNavigate();

  // Modal content map
  const modalContent: Record<string, JSX.Element> = {
    location: (
      <div>
        <h2 className="text-xl font-bold mb-4">Change Location</h2>
        <p>Location picker functionality coming soon.</p>
      </div>
    ),
    appointment: (
      <div>
        <h2 className="text-xl font-bold mb-4">Make an Appointment</h2>
        <p>Appointment scheduling form coming soon.</p>
      </div>
    ),
    call: (
      <div>
        <h2 className="text-xl font-bold mb-4">Request a Call</h2>
        <form className="space-y-4">
          <input className="w-full border px-3 py-2 rounded" placeholder="Your Name" />
          <input className="w-full border px-3 py-2 rounded" placeholder="Phone Number" />
          <button className="bg-[#1B4D3E] text-white px-4 py-2 rounded font-semibold w-full">Submit</button>
        </form>
      </div>
    ),
    addresses: (
      <div>
        <h2 className="text-xl font-bold mb-4">Addresses</h2>
        <p>Mailing addresses for loan payments, document processing, and more will be listed here.</p>
      </div>
    ),
    feedback: (
      <div>
        <h2 className="text-xl font-bold mb-4">Send Feedback</h2>
        <form className="space-y-4">
          <textarea className="w-full border px-3 py-2 rounded" placeholder="Your feedback" rows={4} />
          <button className="bg-[#1B4D3E] text-white px-4 py-2 rounded font-semibold w-full">Send</button>
        </form>
      </div>
    ),
    question: (
      <div>
        <h2 className="text-xl font-bold mb-4">Ask a Question</h2>
        <form className="space-y-4">
          <input className="w-full border px-3 py-2 rounded" placeholder="Your Email" />
          <textarea className="w-full border px-3 py-2 rounded" placeholder="Your question" rows={3} />
          <button className="bg-[#1B4D3E] text-white px-4 py-2 rounded font-semibold w-full">Submit</button>
        </form>
      </div>
    ),
  };

  // FAQ data
  const faqs = [
    { q: "I'm locked out of my account. How do I recover it?", a: "Please use the account recovery tool or contact customer support for assistance." },
    { q: "There are unauthorized charges on my account. What do I do?", a: "Contact our fraud department immediately using the numbers above." },
    { q: "I don't think I can afford a home. Can you help me?", a: "Our advisors can help you explore your options. Schedule an appointment for personalized advice." },
    { q: "How can I pay my mortgage loan?", a: "You can pay online, by phone, or at any branch location." },
    { q: "How can I make payments to my business loan or line of credit?", a: "Payments can be made online, by phone, or at a branch." },
    { q: "How do I enroll in eStatements?", a: "Log in to your online banking and select 'eStatements' from the menu." },
    { q: "What is the Community Bank routing number?", a: "Our routing number is 123456789." },
    { q: "I already own my home. Do you offer home equity options?", a: "Yes, we offer home equity loans and lines of credit." },
    { q: "Do I need to have an existing account with Community Bank to qualify for a business loan?", a: "No, but having an account may simplify the process." },
    { q: "How do I apply for a ULSTER personal loan?", a: "You can apply online, by phone, or at any branch location." },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative animate-fade-in">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-2xl font-bold"
              onClick={() => setModal(null)}
              aria-label="Close"
            >
              ×
            </button>
            {modalContent[modal]}
          </div>
        </div>
      )}
      {/* Hero Section */}
      <div className="relative w-full h-64 md:h-80 bg-gray-100 flex items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1500&q=80"
          alt="Contact Hero"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-60"
        />
        <div className="absolute inset-0 bg-white opacity-60" />
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">Contact Us</h1>
        </div>
      </div>

      {/* Breadcrumb and Intro */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-xs text-[#1B4D3E] mb-2 uppercase tracking-widest">
          HOME &gt; CONTACT US
        </div>
        <h2 className="text-2xl md:text-3xl font-semibold mb-2">Contact Us</h2>
        <p className="text-gray-700 mb-8 max-w-2xl">Need to get in touch? We're all ears. Here you'll find answers to common questions, self-service tools and contact information for anything else you need.</p>

        {/* Contact Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-100 rounded-lg p-6 flex flex-col justify-between">
            <div>
              <h3 className="font-bold mb-2">Visit a Branch</h3>
              <p className="text-gray-700 mb-4">Find your nearest branch and visit us in person.</p>
            </div>
            <button onClick={() => setModal('location')} className="bg-[#1B4D3E] text-white px-4 py-2 rounded font-semibold mt-2">CHANGE LOCATION</button>
          </div>
          <div className="bg-gray-100 rounded-lg p-6 flex flex-col justify-between">
            <div>
              <h3 className="font-bold mb-2">Schedule an appointment</h3>
              <p className="text-gray-700 mb-4">Need to talk to a branch manager in your area? Schedule an appointment online to speak one-on-one with a banker.</p>
            </div>
            <button onClick={() => setModal('appointment')} className="bg-[#1B4D3E] text-white px-4 py-2 rounded font-semibold mt-2">MAKE AN APPOINTMENT</button>
          </div>
          <div className="bg-gray-100 rounded-lg p-6 flex flex-col justify-between">
            <div>
              <h3 className="font-bold mb-2">Customer Care Center</h3>
              <p className="text-gray-700 mb-2">M-F 8am-6pm: <a href="tel: Chat us" className="text-[#1B4D3E] underline"> Chat us</a></p>
              <p className="text-gray-700 mb-2">International: <a href="tel:1-318-616-0228" className="text-[#1B4D3E] underline">1-318-616-0228</a></p>
              <p className="text-gray-700 mb-2">To request a call back, click below.</p>
            </div>
            <button onClick={() => setModal('call')} className="bg-[#1B4D3E] text-white px-4 py-2 rounded font-semibold mt-2">REQUEST A CALL</button>
          </div>
        </div>

        {/* More Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-100 rounded-lg p-6">
            <h3 className="font-bold mb-2">Report potential fraud</h3>
            <p className="text-gray-700 mb-2">Lost or stolen debit/ATM card? Notify your local branch immediately, call Customer Care or contact us through your online or mobile banking account.</p>
            <p className="text-gray-700 text-xs mb-1">Customer Care Center: <a href="tel: Chat us" className="text-[#1B4D3E] underline"> Chat us</a></p>
            <p className="text-gray-700 text-xs mb-1">Cancel card after hours: <a href="tel:1-318-616-0228" className="text-[#1B4D3E] underline">1-318-616-0228</a></p>
            <p className="text-gray-700 text-xs">International: <a href="tel: Chat us" className="text-[#1B4D3E] underline"> Chat us</a></p>
          </div>
          <div className="bg-gray-100 rounded-lg p-6">
            <h3 className="font-bold mb-2">Bank by phone</h3>
            <p className="text-gray-700 mb-2">Check your balance, transfer money, and make loan payments any time of the day.</p>
            <p className="text-[#1B4D3E] underline text-xs"><a href="tel:1-318-616-0228">1-318-616-0228</a></p>
          </div>
          <div className="bg-gray-100 rounded-lg p-6">
            <h3 className="font-bold mb-2">Loan center</h3>
            <p className="text-gray-700 mb-2">Trouble making your payment? Please call us.</p>
            <p className="text-gray-700 text-xs mb-1">Residential Loans: <a href="tel: Chat us" className="text-[#1B4D3E] underline"> Chat us</a></p>
            <p className="text-gray-700 text-xs">Consumer Loans: <a href="tel:1-318-616-0228" className="text-[#1B4D3E] underline">1-318-616-0228</a></p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-100 rounded-lg p-6 flex flex-col justify-between">
            <div>
              <h3 className="font-bold mb-2">Find an address</h3>
              <p className="text-gray-700 mb-4">Click to view our mailing addresses for loan payments, document processing and more.</p>
            </div>
            <button onClick={() => setModal('addresses')} className="bg-[#1B4D3E] text-white px-4 py-2 rounded font-semibold mt-2">SEE ADDRESSES</button>
          </div>
          <div className="bg-gray-100 rounded-lg p-6 flex flex-col justify-between">
            <div>
              <h3 className="font-bold mb-2">Share your feedback</h3>
              <p className="text-gray-700 mb-4">We want to know what you think. Drop us a note to let us know how we're doing so we can better serve you.</p>
            </div>
            <button onClick={() => setModal('feedback')} className="bg-[#1B4D3E] text-white px-4 py-2 rounded font-semibold mt-2">SEND FEEDBACK</button>
          </div>
          <div className="bg-gray-100 rounded-lg p-6 flex flex-col justify-between">
            <div>
              <h3 className="font-bold mb-2">General questions</h3>
              <p className="text-gray-700 mb-4">Email us at <a href="mailto:customerservices@ulsterdelt.it.com" className="text-[#1B4D3E] underline">customerservices@ulsterdelt.it.com</a> or click below to fill out the form.</p>
            </div>
            <button onClick={() => setModal('question')} className="bg-[#1B4D3E] text-white px-4 py-2 rounded font-semibold mt-2">ASK A QUESTION</button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 rounded-lg">
          <div className="max-w-3xl mx-auto">
            <form className="flex flex-col sm:flex-row items-center gap-4 mb-8">
              <input
                type="text"
                placeholder="What would you like to know?"
                className="flex-1 border border-gray-400 rounded px-4 py-2 focus:outline-none"
              />
              <button type="submit" className="border border-[#1B4D3E] text-[#1B4D3E] px-6 py-2 rounded font-semibold hover:bg-[#1B4D3E] hover:text-white transition">ASK</button>
            </form>
            <h2 className="text-3xl font-semibold text-center mb-8">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {faqs.map((faq, idx) => (
                <FAQItem
                  key={idx}
                  question={faq.q}
                  answer={faq.a}
                  open={openFAQ === idx}
                  onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
                />
              ))}
            </div>
            <div className="flex justify-center mt-8">
              <button className="border border-[#1B4D3E] text-[#1B4D3E] px-8 py-2 rounded font-semibold hover:bg-[#1B4D3E] hover:text-white transition">browse more</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// FAQ Item Component
const FAQItem: React.FC<{ question: string; answer?: string; open?: boolean; onClick?: () => void }> = ({ question, answer, open, onClick }) => (
  <div className="border-b border-gray-400 py-3">
    <button
      className="flex items-center justify-between w-full text-base text-gray-900 focus:outline-none"
      onClick={onClick}
      aria-expanded={open}
    >
      <span>{question}</span>
      <span className="w-8 h-8 flex items-center justify-center border border-gray-400 rounded-full text-lg font-bold text-gray-700">
        {open ? '-' : '>'}
      </span>
    </button>
    {open && answer && (
      <div className="mt-2 text-gray-700 text-sm animate-fade-in">{answer}</div>
    )}
  </div>
);

export default Contact; 