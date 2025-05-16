import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const payrollProducts = [
  {
    title: 'Full-Service Payroll',
    features: [
      'Automated payroll processing',
      'Direct deposit',
      'Tax filing and payments',
      'W-2 and 1099 preparation',
      'Employee self-service portal',
      'Time and attendance tracking',
      'Benefits administration',
      'Compliance management',
    ],
  },
  {
    title: 'HR Management',
    features: [
      'Employee onboarding',
      'Document management',
      'Benefits administration',
      'Time-off tracking',
      'Performance management',
      'Employee handbook',
      'Compliance reporting',
      'HR consulting services',
    ],
  },
  {
    title: 'Time & Attendance',
    features: [
      'Time clock software',
      'Mobile time tracking',
      'Scheduling tools',
      'Overtime management',
      'Leave tracking',
      'Automated reporting',
      'Integration with payroll',
      'Employee self-service',
    ],
  },
];

const faqs = [
  { q: 'How does the payroll process work?', a: 'Our full-service payroll handles everything from calculating wages to filing taxes. You simply approve the payroll, and we handle the rest.' },
  { q: 'What tax services are included?', a: 'We handle federal, state, and local tax calculations, filings, and payments, including quarterly and annual returns.' },
  { q: 'Can employees access their information online?', a: 'Yes, employees can access pay stubs, tax documents, and benefits information through our secure employee portal.' },
  { q: 'How do you handle direct deposit?', a: 'We process direct deposits to employee bank accounts, with funds typically available on payday.' },
  { q: 'What compliance features are included?', a: 'We stay current with federal, state, and local regulations, including minimum wage, overtime, and tax requirements.' },
  { q: 'Do you offer mobile access?', a: 'Yes, both employers and employees can access the system through our mobile app for iOS and Android devices.' },
];

const PayrollServices: React.FC = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      {/* Hero Section with Card */}
      <div className="relative w-full h-80 md:h-96 bg-gray-100 flex items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1500&q=80"
          alt="Payroll Services Hero"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-60"
        />
        <div className="absolute inset-0 bg-white opacity-60" />
        <div className="relative z-10 w-full flex justify-center">
          <div className="bg-white rounded-2xl shadow-lg max-w-3xl w-full mt-24 p-8">
            <div className="text-xs text-[#C14F2B] mb-2 uppercase tracking-widest">HOME &gt; BUSINESS &gt; PAYROLL SERVICES</div>
            <h1 className="text-3xl md:text-4xl font-semibold mb-4 text-gray-900">Payroll Services</h1>
            <p className="mb-4 text-gray-700">Simplify your payroll process with our comprehensive payroll and HR solutions.</p>
            <p className="mb-4 text-gray-700">From automated payroll processing to HR management, we have everything you need to manage your workforce efficiently.</p>
          </div>
        </div>
      </div>

      {/* Product Comparison Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center text-lg font-semibold tracking-widest mb-10 uppercase">Payroll & HR Solutions</div>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 px-4">
          {payrollProducts.map((product, idx) => (
            <div key={idx}>
              <div className="font-bold text-base mb-4 tracking-widest uppercase">{product.title}</div>
              <ul className="list-disc list-inside space-y-2 text-gray-800 text-sm">
                {product.features.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="text-center mt-10 text-base font-medium">
          For team members in your area, select your nearest ULSTER location.<br />
          <span className="text-[#C14F2B] cursor-pointer underline">Location <span role="img" aria-label="location">📍</span></span>
        </div>
      </div>

      {/* CTA Bar */}
      <div className="bg-[#C14F2B] text-white text-center text-xl md:text-2xl font-semibold py-6">
        CONTACT YOUR PAYROLL SERVICES SPECIALIST TODAY
      </div>

      {/* FAQ Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-4xl font-semibold text-center mb-10">Frequently Asked Questions</h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
          {faqs.map((faq, idx) => (
            <div key={idx}>
              <button
                className="flex items-center justify-between w-full text-lg border-b border-gray-400 py-4 focus:outline-none"
                onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
                aria-expanded={openFAQ === idx}
              >
                <span>{faq.q}</span>
                <span className="w-8 h-8 flex items-center justify-center border border-gray-400 rounded-full text-lg font-bold text-gray-700">
                  {openFAQ === idx ? '-' : '>'}
                </span>
              </button>
              {openFAQ === idx && (
                <div className="mt-2 text-gray-700 text-base animate-fade-in">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-10">
          <button className="border-2 border-[#C14F2B] text-[#C14F2B] px-8 py-3 rounded transition hover:bg-[#C14F2B] hover:text-white font-semibold text-lg">Get Started</button>
        </div>
      </div>

      {/* Additional Info Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <img src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80" alt="Payroll Services" className="rounded-lg w-full object-cover mb-6 md:mb-0" />
          </div>
          <div>
            <div className="uppercase text-xs text-[#C14F2B] font-bold mb-2 tracking-widest">Payroll & HR</div>
            <h3 className="text-3xl font-semibold mb-4">Streamline Your Workforce Management</h3>
            <p className="mb-6 text-gray-700">Our comprehensive payroll and HR solutions help you manage your workforce efficiently while ensuring compliance. From automated payroll processing to HR management, we have everything you need to focus on growing your business.</p>
            <button className="border-2 border-black px-6 py-2 rounded font-semibold hover:bg-black hover:text-white transition">LEARN MORE</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollServices; 