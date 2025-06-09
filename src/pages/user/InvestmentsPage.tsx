import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import { TrendingUp, PlusCircle, PieChart } from 'lucide-react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import Loading from '../../components/ui/Loading';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Investment {
  id: number;
  user_id: string;
  name: string;
  value: number;
}

interface InvestmentTransaction {
  id: number;
  user_id: string;
  date: string;
  description: string;
  amount: number;
}

const InvestmentsPage = () => {
  const { user } = useAuthStore();
  const [portfolio, setPortfolio] = useState<Investment[]>([]);
  const [recentActivity, setRecentActivity] = useState<InvestmentTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInvestmentsData = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        // Fetch investments
        const { data: investmentsData, error: investmentsError } = await supabase
          .from('investments')
          .select('*')
          .eq('user_id', user.id);
        if (investmentsError) throw investmentsError;
        setPortfolio(investmentsData || []);

        // Fetch investment transactions
        const { data: txData, error: txError } = await supabase
          .from('investment_transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false })
          .limit(10);
        if (txError) throw txError;
        setRecentActivity(txData || []);
      } catch (error) {
        console.error('Error fetching investments data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInvestmentsData();
  }, [user]);

  const allocationData = {
    labels: portfolio.map(p => p.name),
    datasets: [
      {
        data: portfolio.map(p => p.value),
        backgroundColor: [
          '#3A5FAA',
          '#4CAF50',
          '#FFC107',
          '#F44336',
        ],
        borderWidth: 0,
      },
    ],
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen"><Loading /></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      <div className="w-full bg-yellow-400 text-black text-center py-1 text-sm font-semibold">
        🚨 This is your admin dashboard banner! 🚨
      </div>
      <div className="w-full max-w-2xl bg-white rounded-xl shadow p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-10 h-10 text-primary-600" />
            <h1 className="text-2xl font-bold">Investments</h1>
          </div>
          <button className="btn btn-primary flex items-center gap-1">
            <PlusCircle className="w-5 h-5" /> Add Investment
          </button>
        </div>

        {/* Portfolio Overview */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Portfolio Overview</h2>
          <div className="space-y-3">
            {portfolio.length === 0 ? (
              <div className="text-gray-500">No investments found.</div>
            ) : portfolio.map(asset => (
              <div key={asset.id} className="flex items-center justify-between bg-gray-100 rounded-lg p-4">
                <div className="font-medium">{asset.name}</div>
                <div className="font-semibold text-primary-700">${asset.value.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Portfolio Allocation Chart */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2"><PieChart className="w-5 h-5 text-primary-600" /> Allocation</h2>
          <div className="h-48 w-48 mx-auto">
            {portfolio.length === 0 ? (
              <div className="text-gray-500 text-center pt-12">No data</div>
            ) : (
              <Doughnut data={allocationData} options={{ plugins: { legend: { position: 'bottom' } }, cutout: '70%' }} />
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Recent Activity</h2>
          <div className="divide-y">
            {recentActivity.length === 0 ? (
              <div className="text-gray-500">No recent activity.</div>
            ) : recentActivity.map(act => (
              <div key={act.id} className="flex justify-between items-center py-3">
                <div>
                  <div className="font-medium">{act.description}</div>
                  <div className="text-xs text-gray-500">{act.date}</div>
                </div>
                <div className={`font-semibold ${act.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>{act.amount < 0 ? '-' : '+'}${Math.abs(act.amount).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentsPage; 