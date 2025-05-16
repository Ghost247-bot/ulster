import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FiHome, FiUser, FiPhone, FiBriefcase, FiShield, FiBookOpen, FiHelpCircle, FiLock, FiFileText, FiGlobe, FiDollarSign, FiCreditCard, FiSearch } from 'react-icons/fi';

const PAGES = [
  { title: 'Home', path: '/', icon: <FiHome />, description: 'Welcome to Ulster Delt Bank.' },
  { title: 'About Us', path: '/about', icon: <FiUser />, description: 'Learn more about our mission and values.' },
  { title: 'Contact', path: '/contact', icon: <FiPhone />, description: 'Get in touch with our team.' },
  { title: 'Personal Banking', path: '/personal-banking', icon: <FiUser />, description: 'Explore our personal banking solutions.' },
  { title: 'Business Banking', path: '/business-banking', icon: <FiBriefcase />, description: 'Business accounts, loans, and more.' },
  { title: 'Wealth Management', path: '/wealth-management', icon: <FiDollarSign />, description: 'Grow and manage your wealth.' },
  { title: 'Loans & Mortgages', path: '/loans', icon: <FiCreditCard />, description: 'Flexible loans and mortgage options.' },
  { title: 'Insurance', path: '/insurance', icon: <FiShield />, description: 'Protect what matters most.' },
  { title: 'FAQs', path: '/faqs', icon: <FiHelpCircle />, description: 'Frequently asked questions.' },
  { title: 'Customer Service', path: '/customer-service', icon: <FiPhone />, description: 'We are here to help you.' },
  { title: 'Security Center', path: '/security-center', icon: <FiLock />, description: 'Your security is our priority.' },
  { title: 'Privacy Policy', path: '/privacy', icon: <FiFileText />, description: 'How we protect your privacy.' },
  { title: 'Terms of Use', path: '/terms', icon: <FiFileText />, description: 'Our website terms and conditions.' },
  { title: 'Accessibility', path: '/accessibility', icon: <FiGlobe />, description: 'Our commitment to accessibility.' },
  { title: 'Financial Education', path: '/financial-education', icon: <FiBookOpen />, description: 'Learn more about managing your finances.' },
  // Add more as needed
];

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function highlight(text: string, query: string) {
  if (!query) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig');
  return text.split(regex).map((part, i) =>
    regex.test(part) ? <mark key={i} className="bg-yellow-200 px-1 rounded">{part}</mark> : part
  );
}

const NoResults = ({ query }: { query: string }) => (
  <div className="flex flex-col items-center text-center py-12 animate-fade-in">
    <FiSearch size={48} className="text-gray-300 mb-4" />
    <div className="text-xl font-semibold mb-2">No results found</div>
    <div className="text-gray-500 mb-4">We couldn't find anything for <span className="font-semibold">{query}</span>.</div>
    <div className="text-gray-400 text-sm">Try searching for another term or check out our <Link to="/faqs" className="text-[#1B4D3E] hover:underline">FAQs</Link>.</div>
  </div>
);

const SearchResults: React.FC = () => {
  const query = useQuery().get('q')?.toLowerCase() || '';
  const results = query
    ? PAGES.filter(page =>
        page.title.toLowerCase().includes(query) ||
        page.path.toLowerCase().includes(query) ||
        (page.description && page.description.toLowerCase().includes(query))
      )
    : [];

  return (
    <div className="min-h-screen bg-[#f5f5f5] px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-[#1B4D3E]">Search Results</h1>
        <p className="mb-6 text-gray-700">Showing results for: <span className="font-semibold">{query}</span></p>
        {results.length > 0 ? (
          <div className="grid gap-6 animate-fade-in" style={{animationDuration: '0.5s'}}>
            {results.map((page, idx) => (
              <Link to={page.path} key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg shadow hover:shadow-lg transition group border border-gray-200 hover:border-[#1B4D3E]">
                <span className="text-2xl text-[#1B4D3E] group-hover:scale-110 transition-transform">{page.icon}</span>
                <div className="flex-1">
                  <div className="text-lg font-semibold text-[#1B4D3E] group-hover:underline">{highlight(page.title, query)}</div>
                  <div className="text-gray-600 text-sm mt-1">{highlight(page.description, query)}</div>
                  <div className="text-xs text-gray-400 mt-1">{page.path}</div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <NoResults query={query} />
        )}
      </div>
    </div>
  );
};

export default SearchResults; 