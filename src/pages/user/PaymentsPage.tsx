import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import { Wallet, PlusCircle, User, CalendarClock, Send } from 'lucide-react';
import Loading from '../../components/ui/Loading';

interface Payment {
  id: number;
  user_id: string;
  date: string;
  recipient: string;
  amount: number;
  status: string;
}

interface Payee {
  id: number;
  user_id: string;
  name: string;
  account: string;
}

interface ScheduledPayment {
  id: number;
  user_id: string;
  date: string;
  recipient: string;
  amount: number;
}

const PaymentsPage = () => {
  const { user } = useAuthStore();
  const [paymentHistory, setPaymentHistory] = useState<Payment[]>([]);
  const [savedPayees, setSavedPayees] = useState<Payee[]>([]);
  const [scheduledPayments, setScheduledPayments] = useState<ScheduledPayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentsData = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        // Fetch payment history
        const { data: paymentsData, error: paymentsError } = await supabase
          .from('payments')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false });
        if (paymentsError) throw paymentsError;
        setPaymentHistory(paymentsData || []);

        // Fetch saved payees
        const { data: payeesData, error: payeesError } = await supabase
          .from('payees')
          .select('*')
          .eq('user_id', user.id);
        if (payeesError) throw payeesError;
        setSavedPayees(payeesData || []);

        // Fetch scheduled payments
        const { data: scheduledData, error: scheduledError } = await supabase
          .from('scheduled_payments')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: true });
        if (scheduledError) throw scheduledError;
        setScheduledPayments(scheduledData || []);
      } catch (error) {
        console.error('Error fetching payments data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPaymentsData();
  }, [user]);

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen"><Loading /></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Wallet className="w-10 h-10 text-primary-600" />
            <h1 className="text-2xl font-bold">Payments</h1>
          </div>
          <button className="btn btn-primary flex items-center gap-1">
            <PlusCircle className="w-5 h-5" /> New Payment
          </button>
        </div>

        {/* Make a Payment (placeholder form) */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Make a Payment</h2>
          <form className="flex flex-col gap-3">
            <input className="input input-bordered" placeholder="Recipient Name" disabled />
            <input className="input input-bordered" placeholder="Amount" type="number" disabled />
            <button className="btn btn-primary w-fit" disabled>Send Payment</button>
          </form>
          <p className="text-xs text-gray-400 mt-2">(Feature coming soon)</p>
        </div>

        {/* Payment History */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Payment History</h2>
          <div className="divide-y">
            {paymentHistory.length === 0 ? (
              <div className="text-gray-500">No payment history found.</div>
            ) : paymentHistory.map(ph => (
              <div key={ph.id} className="flex justify-between items-center py-3">
                <div>
                  <div className="font-medium">{ph.recipient}</div>
                  <div className="text-xs text-gray-500">{ph.date}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-semibold ${ph.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>{ph.amount < 0 ? '-' : '+'}${Math.abs(ph.amount).toFixed(2)}</span>
                  <span className={`text-xs ${ph.status === 'Completed' ? 'text-green-600' : 'text-yellow-600'}`}>{ph.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Saved Payees */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Saved Payees</h2>
          <div className="flex flex-wrap gap-3">
            {savedPayees.length === 0 ? (
              <div className="text-gray-500">No saved payees.</div>
            ) : savedPayees.map(payee => (
              <div key={payee.id} className="flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2">
                <User className="w-4 h-4 text-primary-600" />
                <span className="font-medium">{payee.name}</span>
                <span className="text-xs text-gray-500">{payee.account}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scheduled Payments */}
        <div>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2"><CalendarClock className="w-5 h-5 text-primary-600" /> Scheduled Payments</h2>
          <div className="divide-y">
            {scheduledPayments.length === 0 ? (
              <div className="text-gray-500 text-sm py-2">No scheduled payments</div>
            ) : scheduledPayments.map(sp => (
              <div key={sp.id} className="flex justify-between items-center py-3">
                <div>
                  <div className="font-medium">{sp.recipient}</div>
                  <div className="text-xs text-gray-500">{sp.date}</div>
                </div>
                <div className="font-semibold text-primary-700">${sp.amount.toFixed(2)}</div>
                <button className="p-2 rounded hover:bg-gray-200" title="Send Now"><Send className="w-5 h-5 text-primary-600" /></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage; 