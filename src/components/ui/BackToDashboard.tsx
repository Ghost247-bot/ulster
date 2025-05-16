import { useNavigate, useLocation } from 'react-router-dom';

const BackToDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine route: /admin for admin pages, /dashboard for user
  const isAdmin = location.pathname.startsWith('/admin');
  const dashboardPath = isAdmin ? '/admin' : '/dashboard';

  // Hide on dashboard root
  const isDashboardRoot = location.pathname === dashboardPath;
  if (isDashboardRoot) return null;

  return (
    <button
      onClick={() => navigate(dashboardPath)}
      className="fixed bottom-6 left-6 z-50 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg p-3 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-400"
      aria-label="Back to dashboard"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7m-9 2v8m4-8v8m5 0a2 2 0 002-2V7a2 2 0 00-.586-1.414l-7-7a2 2 0 00-2.828 0l-7 7A2 2 0 003 7v11a2 2 0 002 2h3" />
      </svg>
    </button>
  );
};

export default BackToDashboard; 