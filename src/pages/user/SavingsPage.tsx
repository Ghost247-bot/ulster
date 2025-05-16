import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import { PiggyBank, PlusCircle, ArrowDownCircle, ArrowUpCircle, TrendingUp } from 'lucide-react';
import Loading from '../../components/ui/Loading';

interface SavingsAccount {
  id: number;
  user_id: string;
  account_type: string;
  account_number: string;
  balance: number;
}

interface SavingsGoal {
  id: number;
  user_id: string;
  name: string;
  target: number;
  current: number;
}

const SavingsPage = () => {
  const { user } = useAuthStore();
  const [savingsAccounts, setSavingsAccounts] = useState<SavingsAccount[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSavingsData = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        // Fetch savings accounts (filter by account_type = 'savings')
        const { data: accountsData, error: accountsError } = await supabase
          .from('accounts')
          .select('*')
          .eq('user_id', user.id)
          .eq('account_type', 'savings');
        if (accountsError) throw accountsError;
        setSavingsAccounts(accountsData || []);

        // Fetch savings goals
        const { data: goalsData, error: goalsError } = await supabase
          .from('savings_goals')
          .select('*')
          .eq('user_id', user.id);
        if (goalsError) throw goalsError;
        setSavingsGoals(goalsData || []);
      } catch (error) {
        console.error('Error fetching savings data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSavingsData();
  }, [user]);

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen"><Loading /></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <PiggyBank className="w-10 h-10 text-primary-600" />
            <h1 className="text-2xl font-bold">Savings</h1>
          </div>
          <button className="btn btn-primary flex items-center gap-1">
            <PlusCircle className="w-5 h-5" /> New Goal
          </button>
        </div>

        {/* Savings Accounts Overview */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Your Savings Accounts</h2>
          <div className="space-y-3">
            {savingsAccounts.length === 0 ? (
              <div className="text-gray-500">No savings accounts found.</div>
            ) : savingsAccounts.map(acc => (
              <div key={acc.id} className="flex items-center justify-between bg-gray-100 rounded-lg p-4">
                <div className="font-medium">{acc.account_type.charAt(0).toUpperCase() + acc.account_type.slice(1)} ({acc.account_number.slice(-4)})</div>
                <div className="font-semibold text-primary-700">${acc.balance.toLocaleString()}</div>
                <div className="flex gap-2">
                  <button className="p-2 rounded hover:bg-gray-200" title="Deposit"><ArrowDownCircle className="w-5 h-5 text-green-600" /></button>
                  <button className="p-2 rounded hover:bg-gray-200" title="Withdraw"><ArrowUpCircle className="w-5 h-5 text-red-500" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Savings Goals */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Savings Goals</h2>
          <div className="space-y-4">
            {savingsGoals.length === 0 ? (
              <div className="text-gray-500">No savings goals found.</div>
            ) : savingsGoals.map(goal => (
              <div key={goal.id} className="bg-gray-100 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-medium">{goal.name}</div>
                  <div className="text-sm text-gray-500">Target: ${goal.target.toLocaleString()}</div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full"
                    style={{ width: `${(goal.current / goal.target) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Saved: ${goal.current.toLocaleString()}</span>
                  <span>{Math.round((goal.current / goal.target) * 100)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Create Savings Goal (placeholder) */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Create a New Savings Goal</h2>
          <form className="flex flex-col gap-3">
            <input className="input input-bordered" placeholder="Goal Name" disabled />
            <input className="input input-bordered" placeholder="Target Amount" type="number" disabled />
            <button className="btn btn-primary w-fit" disabled>Save Goal</button>
          </form>
          <p className="text-xs text-gray-400 mt-2">(Feature coming soon)</p>
        </div>
      </div>
    </div>
  );
};

export default SavingsPage; 