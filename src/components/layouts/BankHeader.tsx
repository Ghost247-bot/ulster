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
    <header className="w-full">
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
      {/* Top Bar */}
      <div className="bg-[#1B4D3E] text-white text-xs flex flex-col sm:flex-row justify-between items-center px-3 sm:px-8 py-2 space-y-2 sm:space-y-0 transition-all duration-300">
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 sm:space-x-6">
          <button onClick={() => navigate('/contact')} className="hover:underline focus:outline-none bg-transparent text-white transition-colors duration-200 hover:text-gray-200 text-[11px] sm:text-xs">Schedule Appointment</button>
          <button onClick={() => navigate('/register')} className="hover:underline focus:outline-none bg-transparent text-white transition-colors duration-200 hover:text-gray-200 text-[11px] sm:text-xs">Open/Apply</button>
          <button onClick={() => navigate('/financial-education')} className="hover:underline focus:outline-none bg-transparent text-white transition-colors duration-200 hover:text-gray-200 text-[11px] sm:text-xs">Investor Relations</button>
          <button onClick={() => navigate('/contact')} className="hover:underline focus:outline-none bg-transparent text-white transition-colors duration-200 hover:text-gray-200 text-[11px] sm:text-xs">Careers</button>
          <button onClick={() => navigate('/contact')} className="flex items-center hover:underline focus:outline-none bg-transparent text-white transition-colors duration-200 hover:text-gray-200 text-[11px] sm:text-xs">Location <FiMapPin className="ml-1" size={12} /></button>
        </div>
        <div className="relative w-full max-w-xs mt-2 sm:mt-0">
          <form onSubmit={handleSearch} autoComplete="off" className="relative">
            <input
              ref={searchRef}
              type="text"
              placeholder="Search"
              className="w-full py-1.5 sm:py-2 pl-3 pr-10 border border-gray-300 text-black rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1B4D3E] focus:border-transparent text-xs sm:text-sm transition-all duration-200"
              value={search}
              onChange={handleInput}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={handleKeyDown}
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-[#1B4D3E] hover:text-[#0F2E24] transition-colors duration-200">
              <FiSearch size={16} className="sm:w-5 sm:h-5" />
            </button>
          </form>
          {showSuggestions && (suggestions.length > 0 || (!search && recent.length > 0)) && (
            <div ref={suggestionsRef} className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-50 animate-fade-in max-h-[300px] overflow-y-auto">
              {search && suggestions.length > 0 ? (
                suggestions.map((s, i) => (
                  <div
                    key={s.path}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 cursor-pointer hover:bg-[#f5f5f5] transition-colors duration-200 ${highlighted === i ? 'bg-[#e0f2f1]' : ''}`}
                    onMouseDown={() => handleSuggestionClick(s)}
                    onMouseEnter={() => setHighlighted(i)}
                  >
                    <span className="font-medium text-[#1B4D3E] text-xs sm:text-sm">{s.title}</span>
                    <span className="ml-2 text-[10px] sm:text-xs text-gray-400">{s.path}</span>
                  </div>
                ))
              ) : (
                <>
                  <div className="px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs text-gray-400">Recent searches</div>
                  {recent.map((q, i) => (
                    <div
                      key={q}
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 cursor-pointer hover:bg-[#f5f5f5] transition-colors duration-200 ${highlighted === i ? 'bg-[#e0f2f1]' : ''}`}
                      onMouseDown={() => handleRecentClick(q)}
                      onMouseEnter={() => setHighlighted(i)}
                    >
                      <span className="font-medium text-[#1B4D3E] text-xs sm:text-sm">{q}</span>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Main Logo/Title */}
      <div className="bg-[#1B4D3E] flex flex-col sm:flex-row items-center px-3 sm:px-8 py-3 sm:py-4 shadow-md">
        <div className="flex items-center w-full justify-between">
          <Link to="/" className="flex items-center group transition-transform duration-200 hover:scale-105">
            <svg className="h-8 w-8 sm:h-12 sm:w-12 text-white mr-2 sm:mr-3 group-hover:opacity-80 transition-all duration-200" fill="none" viewBox="0 0 40 40" stroke="currentColor">
              <circle cx="20" cy="20" r="18" strokeWidth="3" />
              <path d="M10 20c5-10 15-10 20 0" strokeWidth="2" />
            </svg>
            <span className="text-xl sm:text-2xl md:text-4xl font-light text-white font-sans tracking-tight group-hover:underline transition-all duration-200">Ulster Delt Bank</span>
          </Link>
          <button className="sm:hidden text-white hover:text-gray-200 transition-colors duration-200 p-1" onClick={() => setMobileNav(!mobileNav)}>
            {mobileNav ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>
      {/* Nav Bar */}
      <div className="bg-gray-100 px-3 sm:px-8 h-12 sm:h-14 flex items-center relative shadow-sm">
        {/* Desktop Nav */}
        <nav className="hidden sm:flex space-x-4 md:space-x-8 lg:space-x-10 text-sm md:text-base lg:text-lg font-medium text-black">
          {/* Personal Mega Dropdown */}
          <div
            className="relative flex flex-col justify-center"
            ref={personalRef}
            onMouseEnter={() => handleMegaMenu('personal')}
            onMouseLeave={() => handleMouseLeave('personal')}
          >
            <button
              className={`px-1 pt-1 border-b-2 transition-all duration-200 ${personalOpen ? 'border-[#1B4D3E] font-bold text-[#1B4D3E]' : 'border-transparent hover:border-gray-300'} focus:outline-none flex items-center`}
              onClick={() => handleMegaMenu('personal')}
              type="button"
            >
              Personal
            </button>
            {personalOpen && (
              <div className="absolute left-0 top-full mt-2 w-screen max-w-5xl bg-white shadow-lg border-t-2 border-[#1B4D3E] z-30 p-4 sm:p-8 flex flex-wrap gap-4 sm:gap-8 animate-fade-in rounded-b-lg">
                {personalDropdownLinks.map((col, idx) => (
                  <div key={idx} className="min-w-[140px] sm:min-w-[160px] mb-4">
                    {col.heading && <div className="font-bold mb-2 text-xs sm:text-sm md:text-base text-[#1B4D3E]">{col.heading}</div>}
                    <ul className="space-y-1">
                      {col.links.map((link, i) => (
                        <li key={i}>
                          <Link 
                            to={link.path}
                            className="text-xs sm:text-sm md:text-base text-gray-700 hover:text-[#1B4D3E] hover:underline cursor-pointer whitespace-nowrap transition-colors duration-200"
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
          {/* Business Mega Dropdown */}
          <div
            className="relative flex flex-col justify-center"
            ref={businessRef}
            onMouseEnter={() => handleMegaMenu('business')}
            onMouseLeave={() => handleMouseLeave('business')}
          >
            <button
              className={`px-1 pt-1 border-b-2 ${businessOpen ? 'border-[#1B4D3E] font-bold' : 'border-transparent'} focus:outline-none flex items-center`}
              onClick={() => handleMegaMenu('business')}
              type="button"
            >
              Business
            </button>
            {businessOpen && (
              <div className="absolute left-0 top-full mt-2 w-screen max-w-5xl bg-gray-100 shadow-lg border-t-2 border-[#1B4D3E] z-30 p-8 flex flex-wrap gap-8 animate-fade-in">
                {businessDropdownLinks.map((col, idx) => (
                  <div key={idx} className="min-w-[160px] mb-4">
                    {col.heading && <div className="font-bold mb-2 text-sm md:text-base">{col.heading}</div>}
                    <ul className="space-y-1">
                      {col.links.map((link, i) => (
                        <li key={i}>
                          <Link 
                            to={link.path}
                            className="text-sm md:text-base text-black hover:underline cursor-pointer whitespace-nowrap"
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
          {/* Wealth Management Mega Dropdown */}
          <div
            className="relative flex flex-col justify-center"
            ref={wealthRef}
            onMouseEnter={() => handleMegaMenu('wealth')}
            onMouseLeave={() => handleMouseLeave('wealth')}
          >
            <button
              className={`px-1 pt-1 border-b-2 ${wealthOpen ? 'border-[#1B4D3E] font-bold' : 'border-transparent'} focus:outline-none flex items-center`}
              onClick={() => handleMegaMenu('wealth')}
              type="button"
            >
              Wealth Management
            </button>
            {wealthOpen && (
              <div className="absolute left-0 top-full mt-2 w-screen max-w-5xl bg-gray-100 shadow-lg border-t-2 border-[#1B4D3E] z-30 p-8 flex flex-wrap gap-8 animate-fade-in">
                {wealthDropdownLinks.map((col, idx) => (
                  <div key={idx} className="min-w-[160px] mb-4">
                    {col.heading && <div className="font-bold mb-2 text-sm md:text-base">{col.heading}</div>}
                    <ul className="space-y-1">
                      {col.links.map((link, i) => (
                        <li key={i}>
                          <Link 
                            to={link.path}
                            className="text-sm md:text-base text-black hover:underline cursor-pointer whitespace-nowrap"
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
          {/* Resources Mega Dropdown */}
          <div
            className="relative flex flex-col justify-center"
            ref={resourcesRef}
            onMouseEnter={() => handleMegaMenu('resources')}
            onMouseLeave={() => handleMouseLeave('resources')}
          >
            <button
              className={`px-1 pt-1 border-b-2 ${resourcesOpen ? 'border-[#1B4D3E] font-bold' : 'border-transparent'} focus:outline-none flex items-center`}
              onClick={() => handleMegaMenu('resources')}
              type="button"
            >
              Resources
            </button>
            {resourcesOpen && (
              <div className="absolute left-0 top-full mt-2 w-screen max-w-5xl bg-gray-100 shadow-lg border-t-2 border-[#1B4D3E] z-30 p-8 flex flex-wrap gap-8 animate-fade-in">
                {resourcesDropdownLinks.map((col, idx) => (
                  <div key={idx} className="min-w-[160px] mb-4">
                    {col.heading && <div className="font-bold mb-2 text-sm md:text-base">{col.heading}</div>}
                    <ul className="space-y-1">
                      {col.links.map((link, i) => (
                        <li key={i}>
                          <Link 
                            to={link.path}
                            className="text-sm md:text-base text-black hover:underline cursor-pointer whitespace-nowrap"
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
          <Link to="/contact" className="hover:underline">Contact</Link>
        </nav>
        {/* Auth/Profile Dropdown Desktop */}
        <div className="ml-auto hidden sm:block relative" ref={loginRef}>
          {!user ? (
            <>
              <button
                className="bg-white px-6 py-2 text-base md:text-lg font-semibold text-black shadow-sm border border-gray-200 flex items-center focus:outline-none"
                onClick={() => setLoginDropdown((v) => !v)}
              >
                LOG IN <FiChevronDown className="ml-2" />
              </button>
              {loginDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg z-20">
                  <Link to="/login" className="block px-4 py-2 hover:bg-gray-100" onClick={()=>setLoginDropdown(false)}>Personal Login</Link>
                  <Link to="/login" className="block px-4 py-2 hover:bg-gray-100" onClick={()=>setLoginDropdown(false)}>Business Login</Link>
                  <Link to="/register" className="block px-4 py-2 hover:bg-gray-100" onClick={()=>setLoginDropdown(false)}>Open Account</Link>
                </div>
              )}
            </>
          ) : (
            <>
              <button
                className="bg-white px-6 py-2 text-base md:text-lg font-semibold text-black shadow-sm border border-gray-200 flex items-center focus:outline-none"
                onClick={() => setLoginDropdown((v) => !v)}
              >
                {profile?.first_name ? `${profile.first_name} ${profile.last_name}` : user.email}
                <FiChevronDown className="ml-2" />
              </button>
              {loginDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 shadow-lg z-20">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">{user.email}</div>
                  <Link to={profile?.is_admin ? "/admin" : "/dashboard"} className="block px-4 py-2 hover:bg-gray-100" onClick={()=>setLoginDropdown(false)}>Dashboard</Link>
                  <Link to="/accounts" className="block px-4 py-2 hover:bg-gray-100" onClick={()=>setLoginDropdown(false)}>Accounts</Link>
                  <Link to="/cards" className="block px-4 py-2 hover:bg-gray-100" onClick={()=>setLoginDropdown(false)}>Cards</Link>
                  <Link to="/transactions" className="block px-4 py-2 hover:bg-gray-100" onClick={()=>setLoginDropdown(false)}>Transactions</Link>
                  <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100" onClick={()=>setLoginDropdown(false)}>Your Profile</Link>
                  <Link 
                    to="/admin/notifications" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" 
                    onClick={() => {
                      setLoginDropdown(false);
                      setMobileNav(false);
                    }}
                  >
                    <FiBell className="inline-block mr-2" />
                    Notifications
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        {/* Mobile Auth/Profile Dropdown */}
        {mobileNav && (
          <div className="fixed inset-0 z-50 bg-white">
            <div className="h-full flex flex-col">
              {/* Mobile Menu Header */}
              <div className="bg-[#1B4D3E] px-4 py-3 flex items-center justify-between">
                <Link to="/" className="flex items-center" onClick={() => setMobileNav(false)}>
                  <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 40 40" stroke="currentColor">
                    <circle cx="20" cy="20" r="18" strokeWidth="3" />
                    <path d="M10 20c5-10 15-10 20 0" strokeWidth="2" />
                  </svg>
                  <span className="ml-2 text-xl font-light text-white">Ulster Delt Bank</span>
                </Link>
                <button 
                  className="text-white p-2 hover:bg-white/10 rounded-full transition-colors duration-200" 
                  onClick={() => setMobileNav(false)}
                >
                  <FiX size={24} />
                </button>
              </div>

              {/* Mobile Menu Content */}
              <div className="flex-1 overflow-y-auto bg-gray-50">
                {/* Mobile Search */}
                <div className="p-4 border-b border-gray-200 bg-white">
                  <form onSubmit={handleSearch} autoComplete="off" className="relative">
                    <input
                      ref={searchRef}
                      type="text"
                      placeholder="Search"
                      className="w-full py-2 pl-3 pr-10 border border-gray-300 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4D3E] focus:border-transparent text-sm transition-all duration-200"
                      value={search}
                      onChange={handleInput}
                      onFocus={() => setShowSuggestions(true)}
                      onKeyDown={handleKeyDown}
                    />
                    <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-[#1B4D3E] hover:text-[#0F2E24] transition-colors duration-200">
                      <FiSearch size={18} />
                    </button>
                  </form>
                </div>

                {/* Mobile Navigation */}
                <nav className="divide-y divide-gray-200">
                  {/* Personal Banking Mobile Dropdown */}
                  <div className="relative" ref={personalRef}>
                    <button
                      className={`w-full text-left px-4 py-3 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors duration-200 ${personalOpen ? 'text-[#1B4D3E]' : 'text-gray-900'}`}
                      onClick={() => setPersonalOpen((v) => !v)}
                      type="button"
                    >
                      <span className="font-medium">Personal Banking</span>
                      <FiChevronDown className={`ml-2 transition-transform duration-200 ${personalOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {personalOpen && (
                      <div className="bg-gray-50 border-t border-gray-200 animate-fade-in">
                        {personalDropdownLinks.map((col, idx) => (
                          <div key={idx} className="px-4 py-3">
                            {col.heading && (
                              <div className="font-semibold text-sm text-[#1B4D3E] mb-2">{col.heading}</div>
                            )}
                            <ul className="space-y-1">
                              {col.links.map((link, i) => (
                                <li key={i}>
                                  <Link 
                                    to={link.path}
                                    className="block py-2 px-2 text-sm text-gray-700 hover:text-[#1B4D3E] hover:bg-gray-100 rounded-md transition-colors duration-200"
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

                  {/* Business Mobile Dropdown */}
                  <div className="relative" ref={businessRef}>
                    <button
                      className={`w-full text-left px-4 py-3 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors duration-200 ${businessOpen ? 'text-[#1B4D3E]' : 'text-gray-900'}`}
                      onClick={() => setBusinessOpen((v) => !v)}
                      type="button"
                    >
                      <span className="font-medium">Business</span>
                      <FiChevronDown className={`ml-2 transition-transform duration-200 ${businessOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {businessOpen && (
                      <div className="bg-gray-50 border-t border-gray-200 animate-fade-in">
                        {businessDropdownLinks.map((col, idx) => (
                          <div key={idx} className="px-4 py-3">
                            {col.heading && (
                              <div className="font-semibold text-sm text-[#1B4D3E] mb-2">{col.heading}</div>
                            )}
                            <ul className="space-y-1">
                              {col.links.map((link, i) => (
                                <li key={i}>
                                  <Link 
                                    to={link.path}
                                    className="block py-2 px-2 text-sm text-gray-700 hover:text-[#1B4D3E] hover:bg-gray-100 rounded-md transition-colors duration-200"
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

                  {/* Wealth Management Mobile Dropdown */}
                  <div className="relative" ref={wealthRef}>
                    <button
                      className={`w-full text-left px-4 py-3 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors duration-200 ${wealthOpen ? 'text-[#1B4D3E]' : 'text-gray-900'}`}
                      onClick={() => setWealthOpen((v) => !v)}
                      type="button"
                    >
                      <span className="font-medium">Wealth Management</span>
                      <FiChevronDown className={`ml-2 transition-transform duration-200 ${wealthOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {wealthOpen && (
                      <div className="bg-gray-50 border-t border-gray-200 animate-fade-in">
                        {wealthDropdownLinks.map((col, idx) => (
                          <div key={idx} className="px-4 py-3">
                            {col.heading && (
                              <div className="font-semibold text-sm text-[#1B4D3E] mb-2">{col.heading}</div>
                            )}
                            <ul className="space-y-1">
                              {col.links.map((link, i) => (
                                <li key={i}>
                                  <Link 
                                    to={link.path}
                                    className="block py-2 px-2 text-sm text-gray-700 hover:text-[#1B4D3E] hover:bg-gray-100 rounded-md transition-colors duration-200"
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

                  {/* Resources Mobile Dropdown */}
                  <div className="relative" ref={resourcesRef}>
                    <button
                      className={`w-full text-left px-4 py-3 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors duration-200 ${resourcesOpen ? 'text-[#1B4D3E]' : 'text-gray-900'}`}
                      onClick={() => setResourcesOpen((v) => !v)}
                      type="button"
                    >
                      <span className="font-medium">Resources</span>
                      <FiChevronDown className={`ml-2 transition-transform duration-200 ${resourcesOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {resourcesOpen && (
                      <div className="bg-gray-50 border-t border-gray-200 animate-fade-in">
                        {resourcesDropdownLinks.map((col, idx) => (
                          <div key={idx} className="px-4 py-3">
                            {col.heading && (
                              <div className="font-semibold text-sm text-[#1B4D3E] mb-2">{col.heading}</div>
                            )}
                            <ul className="space-y-1">
                              {col.links.map((link, i) => (
                                <li key={i}>
                                  <Link 
                                    to={link.path}
                                    className="block py-2 px-2 text-sm text-gray-700 hover:text-[#1B4D3E] hover:bg-gray-100 rounded-md transition-colors duration-200"
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

                  {/* Contact Link */}
                  <div className="bg-white">
                    <Link
                      to="/contact"
                      className="block px-4 py-3 text-gray-900 hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => setMobileNav(false)}
                    >
                      Contact Us
                    </Link>
                  </div>
                </nav>
                {/* Mobile Auth Section */}
                <div className="border-t border-gray-200 bg-white p-4">
                  {!user ? (
                    <div className="flex flex-col gap-2">
                      <Link
                        to="/login"
                        className="w-full text-center bg-[#1B4D3E] text-white py-2 rounded-md font-semibold hover:bg-[#153d32] transition-colors duration-200"
                        onClick={() => setMobileNav(false)}
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        className="w-full text-center bg-white border border-[#1B4D3E] text-[#1B4D3E] py-2 rounded-md font-semibold hover:bg-gray-100 transition-colors duration-200"
                        onClick={() => setMobileNav(false)}
                      >
                        Open Account
                      </Link>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Link
                        to={profile?.is_admin ? "/admin" : "/dashboard"}
                        className="w-full text-center bg-[#1B4D3E] text-white py-2 rounded-md font-semibold hover:bg-[#153d32] transition-colors duration-200"
                        onClick={() => setMobileNav(false)}
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={() => { setMobileNav(false); handleSignOut(); }}
                        className="w-full text-center bg-white border border-[#1B4D3E] text-[#1B4D3E] py-2 rounded-md font-semibold hover:bg-gray-100 transition-colors duration-200"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default BankHeader; 