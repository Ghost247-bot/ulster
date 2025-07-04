import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1B4D3E] text-white">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <p className="text-gray-300 text-sm mb-4">
              Ulster Delt Bank is committed to providing exceptional financial services and building lasting relationships with our customers.
            </p>
            <div className="flex justify-center sm:justify-start space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors" aria-label="Facebook">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors" aria-label="Twitter">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors" aria-label="LinkedIn">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Services */}
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/personal-banking" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Personal Banking
                </Link>
              </li>
              <li>
                <Link to="/business-banking" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Business Banking
                </Link>
              </li>
              <li>
                <Link to="/wealth-management" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Wealth Management
                </Link>
              </li>
              <li>
                <Link to="/loans" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Loans & Mortgages
                </Link>
              </li>
              <li>
                <Link to="/insurance" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Insurance
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="text-gray-300 text-sm">
                <span className="block font-medium text-white mb-1">Customer Service</span>
                <a href="tel:18332336333" className="hover:text-white transition-colors">1-833-233-6333</a>
              </li>
              <li className="text-gray-300 text-sm">
                <span className="block font-medium text-white mb-1">Email</span>
                <a href="mailto:support@ulsterdelt.it.com" className="hover:text-white transition-colors">
                  support@ulsterdelt.it.com
                </a>
              </li>
              <li className="text-gray-300 text-sm">
                <span className="block font-medium text-white mb-1">Headquarters</span>
                6/8, College Green,<br />
                Dublin 2 Dublin, Ireland
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link to="/security" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Security
                </Link>
              </li>
              <li>
                <Link to="/accessibility" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-gray-300 text-sm">
              © {new Date().getFullYear()} Ulster Delt Bank. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center sm:justify-end gap-4">
              <Link to="/privacy" className="text-gray-300 hover:text-white transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-300 hover:text-white transition-colors text-sm">
                Terms of Use
              </Link>
              <Link to="/security" className="text-gray-300 hover:text-white transition-colors text-sm">
                Security
              </Link>
              <Link to="/accessibility" className="text-gray-300 hover:text-white transition-colors text-sm">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 