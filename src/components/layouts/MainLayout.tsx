import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import BankHeader from './BankHeader';
import Footer from './Footer';

function LiveChatButton() {
  const [loading, setLoading] = useState(false);

  const openLiveChat = () => {
    const tawkToPropertyId = '6818d26aee59f1190ddb0650';
    const tawkToWidgetId = '1iqgfbssb';
    const scriptId = 'tawkto-script';
    setLoading(true);

    function tryOpenChat(retries = 10) {
      if (window.Tawk_API && window.Tawk_API.maximize) {
        window.Tawk_API.maximize();
        setLoading(false);
      } else if (retries > 0) {
        setTimeout(() => tryOpenChat(retries - 1), 300);
      } else {
        setLoading(false);
        alert('Live chat is currently unavailable. Please try again later.');
      }
    }

    if (!window.Tawk_API) {
      if (!document.getElementById(scriptId)) {
        const s = document.createElement('script');
        s.id = scriptId;
        s.async = true;
        s.src = `https://embed.tawk.to/${tawkToPropertyId}/${tawkToWidgetId}`;
        s.charset = 'UTF-8';
        s.setAttribute('crossorigin', '*');
        document.body.appendChild(s);
        s.onload = () => tryOpenChat();
      } else {
        setTimeout(() => tryOpenChat(), 500);
      }
    } else {
      tryOpenChat();
    }
  };

  return (
    <button
      onClick={openLiveChat}
      aria-label="Live Chat"
      className="fixed z-50 right-0 top-1/2 -translate-y-1/2 transition-all duration-300 group hidden md:block"
      style={{ width: '154px', height: '39px' }}
    >
      <div
        className="flex items-center h-full bg-[#1B4D3E] text-white rounded-l-full shadow-lg cursor-pointer transition-all duration-300"
        style={{
          width: '154px',
          transform: 'translateX(108px)', // 70% hidden (154*0.7=108)
        }}
      >
        <span
          className="pl-3 pr-4 py-1 font-semibold text-base whitespace-nowrap transition-all duration-300 group-hover:pr-8"
          style={{
            opacity: 0.7,
            transition: 'opacity 0.3s',
          }}
        >
          {loading ? 'Loading...' : 'Live Chat'}
        </span>
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.8L3 20l.8-3.2A7.96 7.96 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </div>
      <style>{`
        .group:hover > div {
          transform: translateX(62px) !important; /* 40% hidden (154*0.4=62) */
        }
        .group:hover span {
          opacity: 1 !important;
        }
      `}</style>
    </button>
  );
}

const MainLayout: React.FC = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <BankHeader />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Outlet />
      </main>
      {showButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 sm:bottom-8 right-4 sm:right-8 z-50 bg-[#1B4D3E] text-white p-2 sm:px-4 sm:py-2 rounded-full shadow-lg hover:bg-[#153d32] transition-colors"
          aria-label="Back to Top"
        >
          <span className="hidden sm:inline">↑ Back to Top</span>
          <span className="sm:hidden">↑</span>
        </button>
      )}
      <LiveChatButton />
      <Footer />
    </div>
  );
};

export default MainLayout; 