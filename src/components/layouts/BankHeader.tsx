import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMapPin, FiSearch, FiChevronDown, FiMenu, FiX, FiUser, FiBell } from 'react-icons/fi';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../lib/supabase';
import { BellRing } from 'lucide-react';
import { toast } from 'react-hot-toast';

const personalDropdownLinks = [
  {
    heading: 'Checking',
    links: [
      { name: 'Carefree Checking UT', path: '/carefree-checking-ut' },
      { name: 'Ulster Direct Checking', path: '/ulster-direct-checking' },
      { name: 'Premium Checking', path: '/premium-checking' },
    ],
  },
  {
    heading: 'Savings',
    links: [
      { name: 'Certificates of Deposit', path: '/certificates-of-deposit' },
      { name: 'Money Market Accounts', path: '/money-market-accounts' },
      { name: 'IRA', path: '/ira' },
      { name: 'Health Savings Account (HSA)', path: '/health-savings-account' },
    ],
  },
  {
    heading: 'Personal Loans',
    links: [
      { name: 'Lines of Credit', path: '/lines-of-credit' },
      { name: 'Loan Options', path: '/loan-options' },
      { name: 'Auto Insurance', path: '/auto-insurance' },
      { name: 'Home Insurance', path: '/home-insurance' },
    ],
  },
];

const businessDropdownLinks = [
  {
    heading: 'Business Accounts',
    links: [
      { name: 'Business Checking', path: '/business-checking' },
      { name: 'Business Savings', path: '/business-savings' },
      { name: 'Business Money Market', path: '/business-money-market' },
      { name: 'Business CDs', path: '/business-cds' },
    ],
  },
  {
    heading: 'Lending',
    links: [
      { name: 'Business Loans', path: '/business-loans' },
      { name: 'Lines of Credit', path: '/lines-of-credit' },
    ],
  },
];

const wealthDropdownLinks = [
  {
    heading: 'Wealth Management',
    links: [
      { name: 'Wealth Management', path: '/wealth-management' },
      { name: 'Trust Services', path: '/trust-services' },
      { name: 'Investment Services', path: '/investment-services' },
      { name: 'Insurance Services', path: '/insurance-services' },
      { name: 'Retirement Plan Consulting', path: '/retirement-plan-consulting' },
      { name: 'Asset Management', path: '/asset-management' },
      { name: 'Partner Solutions', path: '/partner-solutions' },
    ],
  },
];

const resourcesDropdownLinks = [
  {
    heading: 'Learning Center',
    links: [
      { name: 'Financial Education', path: '/financial-education' },
      { name: 'FAQs', path: '/faqs' },
    ],
  },
  {
    heading: 'Support',
    links: [
      { name: 'Contact Us', path: '/contact' },
      { name: 'Customer Service', path: '/customer-service' },
      { name: 'Security Center', path: '/security-center' },
    ],
  },
];

const PAGES = [
  { title: 'Home', path: '/' },
  { title: 'About Us', path: '/about' },
  { title: 'Contact', path: '/contact' },
  { title: 'Personal Banking', path: '/personal-banking' },
  { title: 'Business Banking', path: '/business-banking' },
  { title: 'Wealth Management', path: '/wealth-management' },
  { title: 'Loans & Mortgages', path: '/loans' },
  { title: 'Insurance', path: '/insurance' },
  { title: 'FAQs', path: '/faqs' },
  { title: 'Customer Service', path: '/customer-service' },
  { title: 'Security Center', path: '/security-center' },
  { title: 'Privacy Policy', path: '/privacy' },
  { title: 'Terms of Use', path: '/terms' },
  { title: 'Accessibility', path: '/accessibility' },
  { title: 'Financial Education', path: '/financial-education' },
];

// Add types for user and notification
interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}
interface Notification {
  id?: number;
  user_id: string;
  title: string;
  message: string;
  type: string;
  created_at?: string;
}

const BankHeader: React.FC = () => {
  const [loginDropdown, setLoginDropdown] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [personalOpen, setPersonalOpen] = useState(false);
  const [businessOpen, setBusinessOpen] = useState(false);
  const [wealthOpen, setWealthOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const loginRef = useRef<HTMLDivElement>(null);
  const personalRef = useRef<HTMLDivElement>(null);
  const businessRef = useRef<HTMLDivElement>(null);
  const wealthRef = useRef<HTMLDivElement>(null);
  const resourcesRef = useRef<HTMLDivElement>(null);
  const [closeTimeout, setCloseTimeout] = useState<any>(null);
  const [modal, setModal] = useState<null | string>(null);
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState<{title: string, path: string}[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const [recent, setRecent] = useState<string[]>([]);
  const searchRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const { user, profile, signOut } = useAuthStore();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [form, setForm] = useState<Omit<Notification, 'id' | 'created_at'>>({ user_id: '', title: '', message: '', type: 'info' });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (loginRef.current && !loginRef.current.contains(event.target as Node)) {
        setLoginDropdown(false);
      }
      if (personalRef.current && !personalRef.current.contains(event.target as Node)) {
        setPersonalOpen(false);
      }
      if (businessRef.current && !businessRef.current.contains(event.target as Node)) {
        setBusinessOpen(false);
      }
      if (wealthRef.current && !wealthRef.current.contains(event.target as Node)) {
        setWealthOpen(false);
      }
      if (resourcesRef.current && !resourcesRef.current.contains(event.target as Node)) {
        setResourcesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setRecent(JSON.parse(localStorage.getItem('recent_searches') || '[]'));
  }, []);

  useEffect(() => {
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      setSuggestions(PAGES.filter(page =>
        page.title.toLowerCase().includes(q) || page.path.toLowerCase().includes(q)
      ).slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [search]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        !searchRef.current?.contains(e.target as Node) &&
        !suggestionsRef.current?.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
        setHighlighted(-1);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    supabase.from('profiles').select('id, email, first_name, last_name').then(({ data }) => {
      setUsers(data || []);
    });
    supabase.from('notifications').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setNotifications(data || []);
    });
  }, []);

  // Only one mega menu open at a time
  const handleMegaMenu = (menu: string) => {
    clearTimeout(closeTimeout);
    setPersonalOpen(menu === 'personal');
    setBusinessOpen(menu === 'business');
    setWealthOpen(menu === 'wealth');
    setResourcesOpen(menu === 'resources');
  };

  // Delayed close handler
  const handleMouseLeave = (menu: string) => {
    const timeout = setTimeout(() => {
      if (menu === 'personal') setPersonalOpen(false);
      if (menu === 'business') setBusinessOpen(false);
      if (menu === 'wealth') setWealthOpen(false);
      if (menu === 'resources') setResourcesOpen(false);
    }, 300); // 300ms delay
    setCloseTimeout(timeout);
  };

  // Modal content map
  const modalContent: Record<string, JSX.Element> = {
    appointment: (
      <div>
        <h2 className="text-xl font-bold mb-4">Schedule Appointment</h2>
        <p>Appointment scheduling form coming soon.</p>
      </div>
    ),
    open: (
      <div>
        <h2 className="text-xl font-bold mb-4">Open/Apply</h2>
        <p>Account opening and application functionality coming soon.</p>
      </div>
    ),
    investor: (
      <div>
        <h2 className="text-xl font-bold mb-4">Investor Relations</h2>
        <p>Investor relations information coming soon.</p>
      </div>
    ),
    careers: (
      <div>
        <h2 className="text-xl font-bold mb-4">Careers</h2>
        <p>Careers and job opportunities coming soon.</p>
      </div>
    ),
    location: (
      <div>
        <h2 className="text-xl font-bold mb-4">Location</h2>
        <p>Location picker functionality coming soon.</p>
      </div>
    ),
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      addRecent(search.trim());
      navigate(`/search?q=${encodeURIComponent(search.trim())}`);
      setShowSuggestions(false);
      setHighlighted(-1);
    }
  };

  const addRecent = (q: string) => {
    let rec = JSON.parse(localStorage.getItem('recent_searches') || '[]');
    rec = [q, ...rec.filter((item: string) => item !== q)].slice(0, 5);
    localStorage.setItem('recent_searches', JSON.stringify(rec));
    setRecent(rec);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setShowSuggestions(true);
    setHighlighted(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) return;
    if (e.key === 'ArrowDown') {
      setHighlighted(h => Math.min(h + 1, (suggestions.length || recent.length) - 1));
    } else if (e.key === 'ArrowUp') {
      setHighlighted(h => Math.max(h - 1, 0));
    } else if (e.key === 'Enter') {
      if (highlighted >= 0) {
        if (suggestions.length > 0) {
          addRecent(suggestions[highlighted].title);
          navigate(`/search?q=${encodeURIComponent(suggestions[highlighted].title)}`);
        } else if (recent.length > 0) {
          setSearch(recent[highlighted]);
          addRecent(recent[highlighted]);
          navigate(`/search?q=${encodeURIComponent(recent[highlighted])}`);
        }
        setShowSuggestions(false);
        setHighlighted(-1);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setHighlighted(-1);
    }
  };

  const handleSuggestionClick = (s: {title: string, path: string}) => {
    setSearch(s.title);
    addRecent(s.title);
    navigate(`/search?q=${encodeURIComponent(s.title)}`);
    setShowSuggestions(false);
    setHighlighted(-1);
  };

  const handleRecentClick = (q: string) => {
    setSearch(q);
    addRecent(q);
    navigate(`/search?q=${encodeURIComponent(q)}`);
    setShowSuggestions(false);
    setHighlighted(-1);
  };

  // Sign out handler
  const handleSignOut = async () => {
    setLoginDropdown(false);
    setMobileNav(false);
    await signOut();
    navigate('/login');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate required fields
    if (!form.user_id || !form.title || !form.message || !form.type) {
      console.error('Missing required fields:', form);
      return;
    }

    setLoading(true);
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      if (!profileData?.is_admin) {
        toast.error('You do not have permission to manage cards');
        return;
      }

      const { error } = await supabase
        .from('notifications')
        .insert([{
          user_id: form.user_id,
          title: form.title,
          message: form.message,
          type: form.type,
          is_read: false
        }]);

      if (error) {
        console.error('Error creating notification:', error);
        return;
      }

      // Refresh notifications list
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });
      
      setNotifications(data || []);
      setForm({ user_id: '', title: '', message: '', type: 'info' });
    } catch (err) {
      console.error('Error in notification submission:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-[#1B4D3E] text-white py-2 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <a href="tel:+1234567890" className="text-sm hover:text-gray-200 flex items-center">
              <FiMapPin className="mr-1" /> Contact Us: (123) 456-7890
            </a>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/locations" className="text-sm hover:text-gray-200">Find a Branch</Link>
            <Link to="/contact" className="text-sm hover:text-gray-200">Contact Us</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img src="/logo.png" alt="Bank Logo" className="h-12 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <div className="relative group" ref={personalRef}>
              <button
                className="flex items-center text-gray-700 hover:text-[#1B4D3E] font-medium"
                onMouseEnter={() => handleMegaMenu('personal')}
                onMouseLeave={() => handleMouseLeave('personal')}
              >
                Personal Banking
                <FiChevronDown className="ml-1" />
              </button>
              {/* Personal Banking Dropdown */}
              {personalOpen && (
                <div className="absolute top-full left-0 w-screen max-w-6xl bg-white shadow-lg rounded-lg p-6 grid grid-cols-3 gap-8">
                  {personalDropdownLinks.map((section) => (
                    <div key={section.heading}>
                      <h3 className="font-semibold text-gray-900 mb-4">{section.heading}</h3>
                      <ul className="space-y-3">
                        {section.links.map((link) => (
                          <li key={link.name}>
                            <Link
                              to={link.path}
                              className="text-gray-600 hover:text-[#1B4D3E] block"
                            >
                              {link.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Similar structure for Business, Wealth, and Resources dropdowns */}
          </nav>

          {/* Search and User Actions */}
          <div className="flex items-center space-x-4">
            <div className="relative" ref={searchRef}>
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                onFocus={() => setShowSuggestions(true)}
                className="hidden md:block w-64 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B4D3E] focus:border-transparent"
              />
              <button className="md:hidden text-gray-600 hover:text-[#1B4D3E]">
                <FiSearch className="w-6 h-6" />
              </button>
              {/* Search Suggestions */}
              {showSuggestions && (search.trim() || recent.length > 0) && (
                <div
                  ref={suggestionsRef}
                  className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 z-50"
                >
                  {/* Suggestions content */}
                </div>
              )}
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="relative" ref={loginRef}>
                  <button
                    onClick={() => setLoginDropdown(!loginDropdown)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-[#1B4D3E]"
                  >
                    <FiUser className="w-6 h-6" />
                    <span className="hidden md:inline">{profile?.first_name || 'Account'}</span>
                  </button>
                  {/* User Dropdown */}
                  {loginDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                      {/* Dropdown content */}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden md:inline-block bg-[#1B4D3E] text-white px-6 py-2 rounded-full hover:bg-[#153d32] transition-colors"
                >
                  Login
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileNav(!mobileNav)}
              className="lg:hidden text-gray-600 hover:text-[#1B4D3E]"
            >
              {mobileNav ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileNav && (
        <div className="lg:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-4">
            <nav className="space-y-4">
              {/* Mobile Navigation Items */}
              <div className="space-y-2">
                <button
                  onClick={() => setPersonalOpen(!personalOpen)}
                  className="w-full flex items-center justify-between text-gray-700 hover:text-[#1B4D3E] font-medium py-2"
                >
                  Personal Banking
                  <FiChevronDown className={`transform transition-transform ${personalOpen ? 'rotate-180' : ''}`} />
                </button>
                {personalOpen && (
                  <div className="pl-4 space-y-2">
                    {personalDropdownLinks.map((section) => (
                      <div key={section.heading}>
                        <h3 className="font-semibold text-gray-900 py-2">{section.heading}</h3>
                        <ul className="space-y-2">
                          {section.links.map((link) => (
                            <li key={link.name}>
                              <Link
                                to={link.path}
                                className="text-gray-600 hover:text-[#1B4D3E] block py-1"
                                onClick={() => setMobileNav(false)}
                              >
                                {link.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Similar structure for other mobile navigation sections */}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default BankHeader; 