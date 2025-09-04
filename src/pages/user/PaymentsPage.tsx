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
  
  // New state for payment form
  const [paymentForm, setPaymentForm] = useState({
    recipient: '',
    amount: '',
    selectedPayee: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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

  const handlePaymentFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPaymentForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    if (!user) {
      setError('You must be logged in to make a payment');
      return;
    }

    const amount = parseFloat(paymentForm.amount);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!paymentForm.recipient) {
      setError('Please enter a recipient name');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create new payment record
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .insert([
          {
            user_id: user.id,
            recipient: paymentForm.recipient,
            amount: -amount, // Negative amount for outgoing payment
            date: new Date().toISOString(),
            status: 'Completed'
          }
        ])
        .select()
        .single();

      if (paymentError) throw paymentError;

      // Update payment history
      setPaymentHistory(prev => [payment, ...prev]);
      
      // Reset form
      setPaymentForm({
        recipient: '',
        amount: '',
        selectedPayee: ''
      });
      
      setSuccess('Payment sent successfully!');
    } catch (err) {
      console.error('Error making payment:', err);
      setError('Failed to process payment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen"><Loading /></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <Wallet className="w-8 h-8 sm:w-10 sm:h-10 text-primary-600" />
            <h1 className="text-xl sm:text-2xl font-bold">Payments</h1>
          </div>
          <button className="btn btn-primary flex items-center justify-center gap-1 w-full sm:w-auto text-sm sm:text-base">
            <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5" /> 
            <span className="hidden xs:inline">New Payment</span>
            <span className="xs:hidden">New</span>
          </button>
        </div>

        {/* Make a Payment Form */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-base sm:text-lg font-semibold mb-3">Make a Payment</h2>
          <form onSubmit={handlePaymentSubmit} className="flex flex-col gap-3">
            {savedPayees.length > 0 && (
              <select
                name="selectedPayee"
                value={paymentForm.selectedPayee}
                onChange={handlePaymentFormChange}
                className="select select-bordered text-sm sm:text-base"
              >
                <option value="">Select a saved payee</option>
                {savedPayees.map(payee => (
                  <option key={payee.id} value={payee.name}>
                    {payee.name} ({payee.account})
                  </option>
                ))}
              </select>
            )}
            <input
              name="recipient"
              value={paymentForm.recipient}
              onChange={handlePaymentFormChange}
              className="input input-bordered text-sm sm:text-base"
              placeholder="Recipient Name"
              required
            />
            <input
              name="amount"
              value={paymentForm.amount}
              onChange={handlePaymentFormChange}
              className="input input-bordered text-sm sm:text-base"
              placeholder="Amount"
              type="number"
              step="0.01"
              min="0.01"
              required
            />
            {error && <div className="text-red-500 text-xs sm:text-sm">{error}</div>}
            {success && <div className="text-green-500 text-xs sm:text-sm">{success}</div>}
            <button 
              type="submit" 
              className="btn btn-primary w-full sm:w-fit text-sm sm:text-base"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Send Payment'}
            </button>
          </form>
        </div>

        {/* Payment History */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-base sm:text-lg font-semibold mb-3">Payment History</h2>
          <div className="divide-y">
            {paymentHistory.length === 0 ? (
              <div className="text-gray-500 text-sm sm:text-base py-4">No payment history found.</div>
            ) : paymentHistory.map(ph => (
              <div key={ph.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 gap-2">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm sm:text-base truncate">{ph.recipient}</div>
                  <div className="text-xs text-gray-500">{ph.date}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`font-semibold text-sm sm:text-base ${ph.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>{ph.amount < 0 ? '-' : '+'}${Math.abs(ph.amount).toFixed(2)}</span>
                  <span className={`text-xs ${ph.status === 'Completed' ? 'text-green-600' : 'text-yellow-600'}`}>{ph.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Saved Payees */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-base sm:text-lg font-semibold mb-3">Saved Payees</h2>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {savedPayees.length === 0 ? (
              <div className="text-gray-500 text-sm sm:text-base">No saved payees.</div>
            ) : savedPayees.map(payee => (
              <div key={payee.id} className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 sm:px-4 py-2 flex-1 min-w-0">
                <User className="w-3 h-3 sm:w-4 sm:h-4 text-primary-600 flex-shrink-0" />
                <span className="font-medium text-xs sm:text-sm truncate">{payee.name}</span>
                <span className="text-xs text-gray-500 truncate">{payee.account}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scheduled Payments */}
        <div>
          <h2 className="text-base sm:text-lg font-semibold mb-3 flex items-center gap-2">
            <CalendarClock className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" /> 
            <span className="hidden xs:inline">Scheduled Payments</span>
            <span className="xs:hidden">Scheduled</span>
          </h2>
          <div className="divide-y">
            {scheduledPayments.length === 0 ? (
              <div className="text-gray-500 text-sm py-2">No scheduled payments</div>
            ) : scheduledPayments.map(sp => (
              <div key={sp.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 gap-2">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm sm:text-base truncate">{sp.recipient}</div>
                  <div className="text-xs text-gray-500">{sp.date}</div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-2">
                  <div className="font-semibold text-primary-700 text-sm sm:text-base">${sp.amount.toFixed(2)}</div>
                  <button className="p-2 rounded hover:bg-gray-200 flex-shrink-0" title="Send Now">
                    <Send className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage; 