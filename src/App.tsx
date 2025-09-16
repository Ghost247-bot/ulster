import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';

// Components
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import UserDashboard from './pages/user/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import UserAccounts from './pages/user/Accounts';
import UserCards from './pages/user/Cards';
import UserTransactions from './pages/user/Transactions';
import UserProfile from './pages/user/Profile';
import UserNotifications from './pages/user/Notifications';
import UserFinancialGoals from './pages/user/FinancialGoals';
import AdminUsers from './pages/admin/Users';
import AdminAccounts from './pages/admin/Accounts';
import AdminTransactions from './pages/admin/Transactions';
import AdminCards from './pages/admin/Cards';
import AdminFinancialGoals from './pages/admin/FinancialGoals';
import UserLayout from './components/layouts/UserLayout';
import AdminLayout from './components/layouts/AdminLayout';
import AuthLayout from './components/layouts/AuthLayout';
import MainLayout from './components/layouts/MainLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Loading from './components/ui/Loading';
import Contact from './pages/Contact';
import FinancialCalculators from './pages/FinancialCalculators';
import BudgetTools from './pages/BudgetTools';
import FinancialLiteracy from './pages/FinancialLiteracy';
import AccessEquity from './pages/AccessEquity';
import CarefreeCheckingUT from './pages/CarefreeCheckingUT';
import UlsterDirectChecking from './pages/UlsterDirectChecking';
import PremiumChecking from './pages/PremiumChecking';
import CertificatesOfDeposit from './pages/CertificatesOfDeposit';
import MoneyMarketAccounts from './pages/MoneyMarketAccounts';
import IRA from './pages/IRA';
import HealthSavingsAccount from './pages/HealthSavingsAccount';
import LinesOfCredit from './pages/LinesOfCredit';
import LoanOptions from './pages/LoanOptions';
import AutoInsurance from './pages/AutoInsurance';
import HomeInsurance from './pages/HomeInsurance';
import BusinessChecking from './pages/BusinessChecking';
import BusinessSavings from './pages/BusinessSavings';
import BusinessLoans from './pages/BusinessLoans';
import BusinessInsurance from './pages/BusinessInsurance';
import BusinessMoneyMarket from './pages/BusinessMoneyMarket';
import BusinessCDs from './pages/BusinessCDs';
import WealthManagement from './pages/WealthManagement';
import TrustServices from './pages/TrustServices';
import InvestmentServices from './pages/InvestmentServices';
import InsuranceServices from './pages/InsuranceServices';
import RetirementPlanConsulting from './pages/RetirementPlanConsulting';
import AssetManagement from './pages/AssetManagement';
import PartnerSolutions from './pages/PartnerSolutions';
import FinancialEducation from './pages/FinancialEducation';
import FAQs from './pages/FAQs';
import CustomerService from './pages/CustomerService';
import SecurityCenter from './pages/SecurityCenter';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Security from './pages/Security';
import Accessibility from './pages/Accessibility';
import SearchResults from './pages/SearchResults';
import CardsPage from './pages/user/CardsPage';
import PaymentsPage from './pages/user/PaymentsPage';
import SavingsPage from './pages/user/SavingsPage';
import InvestmentsPage from './pages/user/InvestmentsPage';
import AdminLogin from './pages/admin/Login';
import AdminNotifications from './pages/admin/Notifications';
import AdminBanner from './pages/admin/Banner';
import StatisticsCards from './pages/admin/StatisticsCards';
import UpcomingBills from './pages/admin/UpcomingBills';
import TableEditorPage from './pages/admin/TableEditor';
import CreateUser from './pages/CreateUser';
// Placeholder imports for not-yet-created pages
const CommercialRealEstate = () => <div>Commercial Real Estate Page Coming Soon</div>;
const SBALoans = () => <div>SBA Loans Page Coming Soon</div>;
const PaymentProcessing = () => <div>Payment Processing Page Coming Soon</div>;
const PayrollServices = () => <div>Payroll Services Page Coming Soon</div>;
const BusinessCreditCards = () => <div>Business Credit Cards Page Coming Soon</div>;
const BusinessOnlineBanking = () => <div>Business Online Banking Page Coming Soon</div>;
const CashManagement = () => <div>Cash Management Page Coming Soon</div>;
const BusinessResources = () => <div>Business Resources Page Coming Soon</div>;

// Store
import { useAuthStore } from './store/authStore';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { user, setUser, setProfile, profile } = useAuthStore();

  useEffect(() => {
    let mounted = true;

    const fetchUserAndProfile = async (sessionUser: any) => {
      try {
        console.log('Starting profile fetch for user:', sessionUser.id);
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', sessionUser.id)
          .single();
          
        if (!mounted) {
          console.log('Component unmounted during profile fetch');
          return;
        }
        
        console.log('Profile fetch result:', { profileData, profileError });
          
        if (profileError) {
          console.error('Error fetching profile:', profileError);
          // Create profile if it doesn't exist
          if (profileError.code === 'PGRST116') {
            console.log('Creating new profile for user:', sessionUser.id);
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert({
                id: sessionUser.id,
                email: sessionUser.email,
                first_name: '',
                last_name: '',
                phone: '',
                address: '',
                city: '',
                state: '',
                zip: '',
                date_of_birth: '',
                ssn: '',
                mothers_maiden_name: '',
                referral_source: '',
                is_admin: false,
                role: 'user',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })
              .select()
              .single();
            
            if (!mounted) {
              console.log('Component unmounted during profile creation');
              return;
            }
            
            console.log('Profile creation result:', { newProfile, createError });
            
            if (createError) {
              console.error('Error creating profile:', createError);
              setIsLoading(false);
            } else if (newProfile) {
              console.log('Successfully created and set profile:', newProfile);
              setProfile(newProfile);
              setIsLoading(false);
            } else {
              console.error('No profile data returned after creation');
              setIsLoading(false);
            }
          } else {
            console.error('Unexpected profile error:', profileError);
            setIsLoading(false);
          }
        } else if (profileData) {
          console.log('Successfully fetched existing profile:', profileData);
          setProfile(profileData);
          setIsLoading(false);
        } else {
          console.error('No profile data returned from fetch');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error during profile fetch/creation:', error);
        setIsLoading(false);
      }
    };

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Session:', session);
        
        if (!mounted) return;
        
        if (session?.user) {
          setUser(session.user);
          await fetchUserAndProfile(session.user);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Auth error:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        
        if (!mounted) return;
        
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          await fetchUserAndProfile(session.user);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
          setIsLoading(false);
        } else if (event === 'INITIAL_SESSION') {
          if (session?.user) {
            setUser(session.user);
            await fetchUserAndProfile(session.user);
          } else {
            setIsLoading(false);
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [setUser, setProfile]);

  useEffect(() => {
    console.log('User:', user);
    console.log('Profile:', profile);
    console.log('isLoading:', isLoading);
  }, [user, profile, isLoading]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Routes>
      {/* Main Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/create-user" element={<CreateUser />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/financial-calculators" element={<FinancialCalculators />} />
        <Route path="/about" element={<div>About Page</div>} />
        <Route path="/business" element={<div>Business Page</div>} />
        <Route path="/personal" element={<div>Personal Page</div>} />
        <Route path="/financial-literacy" element={<FinancialLiteracy />} />
        <Route path="/access-equity" element={<AccessEquity />} />
        <Route path="/carefree-checking-ut" element={<CarefreeCheckingUT />} />
        <Route path="/ulster-direct-checking" element={<UlsterDirectChecking />} />
        <Route path="/premium-checking" element={<PremiumChecking />} />
        <Route path="/certificates-of-deposit" element={<CertificatesOfDeposit />} />
        <Route path="/money-market-accounts" element={<MoneyMarketAccounts />} />
        <Route path="/ira" element={<IRA />} />
        <Route path="/health-savings-account" element={<HealthSavingsAccount />} />
        <Route path="/lines-of-credit" element={<LinesOfCredit />} />
        <Route path="/loan-options" element={<LoanOptions />} />
        <Route path="/auto-insurance" element={<AutoInsurance />} />
        <Route path="/home-insurance" element={<HomeInsurance />} />
        <Route path="/business-checking" element={<BusinessChecking />} />
        <Route path="/business-savings" element={<BusinessSavings />} />
        <Route path="/business-loans" element={<BusinessLoans />} />
        <Route path="/business-insurance" element={<BusinessInsurance />} />
        <Route path="/business-money-market" element={<BusinessMoneyMarket />} />
        <Route path="/business-cds" element={<BusinessCDs />} />
        <Route path="/wealth-management" element={<WealthManagement />} />
        <Route path="/trust-services" element={<TrustServices />} />
        <Route path="/investment-services" element={<InvestmentServices />} />
        <Route path="/insurance-services" element={<InsuranceServices />} />
        <Route path="/retirement-plan-consulting" element={<RetirementPlanConsulting />} />
        <Route path="/asset-management" element={<AssetManagement />} />
        <Route path="/partner-solutions" element={<PartnerSolutions />} />
        <Route path="/commercial-real-estate" element={<CommercialRealEstate />} />
        <Route path="/sba-loans" element={<SBALoans />} />
        <Route path="/payment-processing" element={<PaymentProcessing />} />
        <Route path="/payroll-services" element={<PayrollServices />} />
        <Route path="/business-credit-cards" element={<BusinessCreditCards />} />
        <Route path="/business-online-banking" element={<BusinessOnlineBanking />} />
        <Route path="/cash-management" element={<CashManagement />} />
        <Route path="/business-resources" element={<BusinessResources />} />
        <Route path="/financial-education" element={<FinancialEducation />} />
        <Route path="/faqs" element={<FAQs />} />
        <Route path="/customer-service" element={<CustomerService />} />
        <Route path="/security-center" element={<SecurityCenter />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/security" element={<Security />} />
        <Route path="/accessibility" element={<Accessibility />} />
        <Route path="/search" element={<SearchResults />} />
      </Route>

      {/* User Routes */}
      <Route element={<ProtectedRoute allowedRole="user" />}>
        <Route element={<UserLayout />}>
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/accounts" element={<UserAccounts />} />
          <Route path="/cards" element={<CardsPage />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/savings" element={<SavingsPage />} />
          <Route path="/Investment" element={<InvestmentsPage />} />
          <Route path="/transactions" element={<UserTransactions />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/notifications" element={<UserNotifications />} />
          <Route path="/goals" element={<UserFinancialGoals />} />
        </Route>
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedRoute allowedRole="admin" />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/accounts" element={<AdminAccounts />} />
          <Route path="/admin/cards" element={<AdminCards />} />
          <Route path="/admin/transactions" element={<AdminTransactions />} />
          <Route path="/admin/notifications" element={<AdminNotifications />} />
          <Route path="/admin/statistics-cards" element={<StatisticsCards />} />
          <Route path="/admin/upcoming-bills" element={<UpcomingBills />} />
          <Route path="/admin/financial-goals" element={<AdminFinancialGoals />} />
          <Route path="/admin/banner" element={<AdminBanner />} />
        </Route>
      </Route>

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;