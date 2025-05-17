import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import { 
  CreditCard, 
  PlusCircle, 
  Eye, 
  Lock, 
  Unlock, 
  Settings2, 
  Download, 
  Bell, 
  BellOff, 
  X,
  BarChart3,
  Shield,
  AlertTriangle,
  ChevronDown,
  Search,
  Filter,
  Check,
  TrendingUp,
  AlertCircle,
  Calendar,
  DollarSign,
  Clock
} from 'lucide-react';
import Loading from '../../components/ui/Loading';
import { format, subDays, isWithinInterval, parseISO } from 'date-fns';
import { toast } from 'react-hot-toast';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface Card {
  id: number;
  user_id: string;
  card_type: string;
  card_number: string;
  is_active: boolean;
  daily_limit?: number;
  transaction_limit?: number;
  is_frozen?: boolean;
  freeze_until?: string | null;
  notifications_enabled?: boolean;
  expiry_date?: string;
  cvv?: string;
  card_holder_name?: string;
}

interface CardTransaction {
  id: number;
  card_id: number;
  date: string;
  description: string;
  amount: number;
  category?: string;
  merchant?: string;
  location?: string;
}

interface CardAnalytics {
  totalSpent: number;
  averageTransaction: number;
  topCategories: { category: string; amount: number }[];
  recentActivity: { date: string; count: number }[];
  spendingTrend: { date: string; amount: number }[];
  categoryDistribution: { category: string; percentage: number }[];
}

interface SpendingAlert {
  id: number;
  card_id: number;
  type: 'daily_limit' | 'transaction_limit' | 'unusual_activity';
  message: string;
  created_at: string;
  is_read: boolean;
}

const CardsPage = () => {
  const { user } = useAuthStore();
  const [cards, setCards] = useState<Card[]>([]);
  const [cardTransactions, setCardTransactions] = useState<CardTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [showCardModal, setShowCardModal] = useState(false);
  const [limitsModal, setLimitsModal] = useState(false);
  const [freezeModal, setFreezeModal] = useState(false);
  const [limitDaily, setLimitDaily] = useState('');
  const [limitTxn, setLimitTxn] = useState('');
  const [freezeUntil, setFreezeUntil] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [showStatementModal, setShowStatementModal] = useState(false);
  const [statementStart, setStatementStart] = useState('');
  const [statementEnd, setStatementEnd] = useState('');
  const [statementLoading, setStatementLoading] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analytics, setAnalytics] = useState<CardAnalytics | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ start: string | null; end: string | null }>({
    start: null,
    end: null
  });
  const [spendingAlerts, setSpendingAlerts] = useState<SpendingAlert[]>([]);
  const [showAlerts, setShowAlerts] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true);

  // Update the initializeDatabase function to handle missing tables more gracefully
  const initializeDatabase = async () => {
    try {
      // Check if cards table exists
      const { error: cardsTableError } = await supabase
        .from('cards')
        .select('id')
        .limit(1);

      if (cardsTableError) {
        console.error('Cards table error:', cardsTableError);
        // If the error is not a 404, it's a different issue
        if (cardsTableError.code !== 'PGRST116') {
          toast.error('Error accessing cards table. Please contact support.');
          return false;
        }
      }

      // For now, we'll continue even if card_transactions table doesn't exist
      // This allows the cards functionality to work even without transactions
      const { error: transactionsTableError } = await supabase
        .from('card_transactions')
        .select('id')
        .limit(1);

      if (transactionsTableError) {
        console.log('Card transactions table not available:', transactionsTableError);
        // Don't show error to user, just log it
        // We'll handle this gracefully in the UI
      }

      return true;
    } catch (error) {
      console.error('Database initialization error:', error);
      toast.error('Error initializing database. Please contact support.');
      return false;
    }
  };

  // Update fetchCardsAndTransactions to handle missing transaction table
  const fetchCardsAndTransactions = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      // First check if tables exist
      const tablesExist = await initializeDatabase();
      if (!tablesExist) {
        setIsLoading(false);
        return;
      }

      // Fetch cards with all necessary fields
      const { data: cardsData, error: cardsError } = await supabase
        .from('cards')
        .select('*')
        .eq('user_id', user.id);

      if (cardsError) {
        console.error('Error fetching cards:', cardsError);
        throw cardsError;
      }

      // Ensure all card states are properly set
      const processedCards = (cardsData || []).map(card => ({
        ...card,
        is_active: Boolean(card.is_active),
        is_frozen: Boolean(card.is_frozen),
        daily_limit: card.daily_limit || null,
        transaction_limit: card.transaction_limit || null
      }));

      setCards(processedCards);

      // Try to fetch transactions, but don't fail if the table doesn't exist
      try {
        if (processedCards.length > 0) {
          const cardIds = processedCards.map(c => c.id);
          const { data: txData, error: txError } = await supabase
            .from('card_transactions')
            .select('*')
            .in('card_id', cardIds)
            .order('date', { ascending: false })
            .limit(10);

          if (txError) {
            console.log('Error fetching transactions:', txError);
            // Don't throw, just set empty transactions
            setCardTransactions([]);
          } else {
            setCardTransactions(txData || []);
          }
        } else {
          setCardTransactions([]);
        }
      } catch (txError) {
        console.log('Error accessing transactions:', txError);
        setCardTransactions([]);
      }
    } catch (error) {
      console.error('Error fetching cards or transactions:', error);
      toast.error('Failed to load cards and transactions');
      // Set empty states on error
      setCards([]);
      setCardTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Update useEffect to use the new fetchCardsAndTransactions function
  useEffect(() => {
    fetchCardsAndTransactions();
  }, [user]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!user || !isRealTimeEnabled) return;

    const cardsSubscription = supabase
      .channel('cards_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'cards',
          filter: `user_id=eq.${user.id}`
        }, 
        (payload) => {
          console.log('Cards change received:', payload);
          handleRealtimeUpdate(payload);
        }
      )
      .subscribe();

    const transactionsSubscription = supabase
      .channel('card_transactions_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'card_transactions',
          filter: `card_id=in.(${cards.map(c => c.id).join(',')})`
        }, 
        (payload) => {
          console.log('Transaction change received:', payload);
          handleTransactionUpdate(payload);
        }
      )
      .subscribe();

    return () => {
      cardsSubscription.unsubscribe();
      transactionsSubscription.unsubscribe();
    };
  }, [user, cards, isRealTimeEnabled]);

  // Handle real-time card updates
  const handleRealtimeUpdate = (payload: any) => {
    if (payload.eventType === 'UPDATE') {
      const updatedCard = payload.new;
      setCards(cards.map(card => 
        card.id === updatedCard.id ? { ...card, ...updatedCard } : card
      ));
      
      if (selectedCard?.id === updatedCard.id) {
        setSelectedCard({ ...selectedCard, ...updatedCard });
      }

      // Show toast notification for important changes
      if (updatedCard.is_active !== payload.old.is_active) {
        toast.success(`Card ${updatedCard.is_active ? 'activated' : 'blocked'}`);
      }
      if (updatedCard.is_frozen !== payload.old.is_frozen) {
        toast.success(`Card ${updatedCard.is_frozen ? 'frozen' : 'unfrozen'}`);
      }
    }
  };

  // Handle real-time transaction updates
  const handleTransactionUpdate = (payload: any) => {
    if (payload.eventType === 'INSERT') {
      const newTransaction = payload.new;
      setCardTransactions(prev => [newTransaction, ...prev]);
      
      // Check for spending alerts
      checkSpendingAlerts(newTransaction);
      
      // Update analytics
      updateAnalytics();
    }
  };

  // Check for spending alerts
  const checkSpendingAlerts = async (transaction: CardTransaction) => {
    const card = cards.find(c => c.id === transaction.card_id);
    if (!card) return;

    const alerts: SpendingAlert[] = [];

    // Check daily limit
    if (card.daily_limit) {
      const todayTransactions = cardTransactions.filter(tx => 
        tx.card_id === card.id && 
        format(parseISO(tx.date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
      );
      
      const dailyTotal = todayTransactions.reduce((sum, tx) => sum + tx.amount, 0);
      if (dailyTotal > card.daily_limit) {
        alerts.push({
          id: Date.now(),
          card_id: card.id,
          type: 'daily_limit',
          message: `Daily spending limit exceeded for card ending in ${card.card_number.slice(-4)}`,
          created_at: new Date().toISOString(),
          is_read: false
        });
      }
    }

    // Check transaction limit
    if (card.transaction_limit && transaction.amount > card.transaction_limit) {
      alerts.push({
        id: Date.now(),
        card_id: card.id,
        type: 'transaction_limit',
        message: `Transaction limit exceeded for card ending in ${card.card_number.slice(-4)}`,
        created_at: new Date().toISOString(),
        is_read: false
      });
    }

    // Check for unusual activity
    const averageTransaction = cardTransactions.reduce((sum, tx) => sum + tx.amount, 0) / cardTransactions.length;
    if (transaction.amount > averageTransaction * 3) {
      alerts.push({
        id: Date.now(),
        card_id: card.id,
        type: 'unusual_activity',
        message: `Unusual transaction amount detected for card ending in ${card.card_number.slice(-4)}`,
        created_at: new Date().toISOString(),
        is_read: false
      });
    }

    if (alerts.length > 0) {
      setSpendingAlerts(prev => [...alerts, ...prev]);
      toast.error(alerts[0].message);
    }
  };

  // Update analytics with new data
  const updateAnalytics = () => {
    const timeRange = {
      '7d': subDays(new Date(), 7),
      '30d': subDays(new Date(), 30),
      '90d': subDays(new Date(), 90)
    }[selectedTimeRange];

    const filteredTransactions = cardTransactions.filter(tx => 
      isWithinInterval(parseISO(tx.date), { start: timeRange, end: new Date() })
    );

    const newAnalytics = calculateAnalytics(filteredTransactions);
    setAnalytics(newAnalytics);
  };

  // Enhanced analytics calculation
  const calculateAnalytics = (transactions: CardTransaction[]): CardAnalytics => {
    const totalSpent = transactions.reduce((sum, tx) => sum + tx.amount, 0);
    const averageTransaction = totalSpent / transactions.length;

    // Calculate category distribution
    const categoryMap = transactions.reduce((acc, tx) => {
      const category = tx.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + tx.amount;
      return acc;
    }, {} as Record<string, number>);

    const totalAmount = Object.values(categoryMap).reduce((sum, amount) => sum + amount, 0);
    const categoryDistribution = Object.entries(categoryMap)
      .map(([category, amount]) => ({
        category,
        percentage: (amount / totalAmount) * 100
      }))
      .sort((a, b) => b.percentage - a.percentage);

    // Calculate spending trend
    const spendingTrend = transactions.reduce((acc, tx) => {
      const date = format(parseISO(tx.date), 'yyyy-MM-dd');
      acc[date] = (acc[date] || 0) + tx.amount;
      return acc;
    }, {} as Record<string, number>);

    const trendData = Object.entries(spendingTrend)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return {
      totalSpent,
      averageTransaction,
      topCategories: categoryDistribution.slice(0, 5).map(({ category, percentage }) => ({
        category,
        amount: (percentage / 100) * totalSpent
      })),
      recentActivity: trendData.map(({ date, amount }) => ({
        date,
        count: transactions.filter(tx => format(parseISO(tx.date), 'yyyy-MM-dd') === date).length
      })),
      spendingTrend: trendData,
      categoryDistribution
    };
  };

  // Render analytics charts
  const renderAnalyticsCharts = () => {
    if (!analytics) return null;

    const spendingTrendData = {
      labels: analytics.spendingTrend.map(item => format(parseISO(item.date), 'MMM d')),
      datasets: [
        {
          label: 'Daily Spending',
          data: analytics.spendingTrend.map(item => item.amount),
          borderColor: '#006400',
          backgroundColor: 'rgba(0, 100, 0, 0.1)',
          tension: 0.4,
          fill: true,
        },
      ],
    };

    const categoryDistributionData = {
      labels: analytics.categoryDistribution.map(item => item.category),
      datasets: [
        {
          data: analytics.categoryDistribution.map(item => item.percentage),
          backgroundColor: [
            '#006400',
            '#4CAF50',
            '#FFC107',
            '#F44336',
            '#9C27B0',
            '#607D8B',
          ],
          borderWidth: 0,
        },
      ],
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Spending Trend</h3>
          <Line
            data={spendingTrendData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: (value) => `$${value}`,
                  },
                },
              },
            }}
          />
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Category Distribution</h3>
          <Doughnut
            data={categoryDistributionData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'bottom',
                },
              },
            }}
          />
        </div>
      </div>
    );
  };

  // Handler to open modal
  const handleViewDetails = (card: Card) => {
    setSelectedCard(card);
    setShowCardModal(true);
  };

  // Handler to close modal
  const handleCloseModal = () => {
    setShowCardModal(false);
    setSelectedCard(null);
  };

  // Update the handleBlockUnblock function
  const handleBlockUnblock = async (block: boolean) => {
    if (!selectedCard) return;
    setActionLoading(true);
    try {
      // Update the card in the database
      const { error: updateError } = await supabase
        .from('cards')
        .update({ 
          is_active: !block,
          // If blocking, also set is_frozen to false since a blocked card can't be frozen
          ...(block && { is_frozen: false }),
          // Don't include updated_at, let the database handle it
        })
        .eq('id', selectedCard.id)
        .select() // Add this to get the updated record back
        .single();

      if (updateError) {
        console.error('Error updating card status:', updateError);
        throw updateError;
      }

      // Update the local state with the returned data
      const updatedCard = { 
        ...selectedCard, 
        is_active: !block,
        ...(block && { is_frozen: false })
      };
      
      setSelectedCard(updatedCard);
      setCards(cards.map(c => c.id === selectedCard.id ? updatedCard : c));
      
      // Show success message
      toast.success(block ? 'Card blocked successfully' : 'Card unblocked successfully');
      
      // Close the modal if blocking
      if (block) {
        setShowCardModal(false);
      }
    } catch (err: any) {
      console.error('Error updating card status:', err);
      toast.error(err.message || 'Failed to update card status');
    } finally {
      setActionLoading(false);
    }
  };

  // Set Limits
  const handleSetLimits = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCard) return;
    setActionLoading(true);
    try {
      await supabase.from('cards').update({
        daily_limit: limitDaily ? parseFloat(limitDaily) : null,
        transaction_limit: limitTxn ? parseFloat(limitTxn) : null,
      }).eq('id', selectedCard.id);
      toast.success('Limits updated');
      setSelectedCard({ ...selectedCard, daily_limit: limitDaily ? parseFloat(limitDaily) : undefined, transaction_limit: limitTxn ? parseFloat(limitTxn) : undefined });
      setCards(cards.map(c => c.id === selectedCard.id ? { ...c, daily_limit: limitDaily ? parseFloat(limitDaily) : undefined, transaction_limit: limitTxn ? parseFloat(limitTxn) : undefined } : c));
      setLimitsModal(false);
    } catch (err: any) {
      toast.error('Failed to update limits');
    } finally {
      setActionLoading(false);
    }
  };

  // Update the handleFreeze function to use the new state management
  const handleFreeze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCard) return;
    setActionLoading(true);
    try {
      const updates = {
        is_frozen: true,
        freeze_until: freezeUntil || null
      };

      const success = await handleCardStateChange(selectedCard.id, updates);
      
      if (success) {
        toast.success('Card frozen successfully');
        setFreezeModal(false);
      }
    } catch (err: any) {
      console.error('Error freezing card:', err);
      toast.error('Failed to freeze card');
    } finally {
      setActionLoading(false);
    }
  };

  // Download Card Statement with date range
  const handleDownloadStatement = () => {
    setShowStatementModal(true);
  };

  const handleStatementDownloadConfirm = async () => {
    if (!selectedCard) return;
    setStatementLoading(true);
    try {
      let txs = cardTransactions.filter(tx => tx.card_id === selectedCard.id);
      if (statementStart) txs = txs.filter(tx => tx.date >= statementStart);
      if (statementEnd) txs = txs.filter(tx => tx.date <= statementEnd);
      if (!txs.length) {
        toast.error('No transactions in selected range');
        setStatementLoading(false);
        return;
      }
      const csvRows = [
        'Date,Description,Amount',
        ...txs.map(tx => `${tx.date},"${tx.description}",${tx.amount}`),
      ];
      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `card_statement_${selectedCard.card_number.slice(-4)}_${statementStart || 'all'}_${statementEnd || 'all'}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Statement downloaded');
      setShowStatementModal(false);
    } catch (err: any) {
      toast.error('Download failed');
    } finally {
      setStatementLoading(false);
    }
  };

  // Toggle Notifications
  const handleToggleNotifications = async () => {
    if (!selectedCard) return;
    setActionLoading(true);
    try {
      await supabase.from('cards').update({ notifications_enabled: !selectedCard.notifications_enabled }).eq('id', selectedCard.id);
      toast.success(selectedCard.notifications_enabled ? 'Notifications disabled' : 'Notifications enabled');
      setSelectedCard({ ...selectedCard, notifications_enabled: !selectedCard.notifications_enabled });
      setCards(cards.map(c => c.id === selectedCard.id ? { ...c, notifications_enabled: !selectedCard.notifications_enabled } : c));
    } catch (err: any) {
      toast.error('Failed to update notifications');
    } finally {
      setActionLoading(false);
    }
  };

  // Filter transactions
  const filteredTransactions = cardTransactions.filter(tx => {
    const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tx.merchant?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tx.category === selectedCategory;
    const matchesDateRange = (!dateRange.start || tx.date >= dateRange.start) &&
                            (!dateRange.end || tx.date <= dateRange.end);
    return matchesSearch && matchesCategory && matchesDateRange;
  });

  // Get unique categories for filter
  const categories = Array.from(new Set(cardTransactions.map(tx => tx.category || 'Uncategorized')));

  // Update handleCardStateChange to handle errors better
  const handleCardStateChange = async (cardId: number, updates: Partial<Card>) => {
    try {
      const { error } = await supabase
        .from('cards')
        .update(updates)
        .eq('id', cardId);

      if (error) {
        console.error('Error updating card state:', error);
        throw error;
      }

      // Update local state
      setCards(cards.map(card => 
        card.id === cardId ? { ...card, ...updates } : card
      ));

      // Update selected card if it's the one being modified
      if (selectedCard?.id === cardId) {
        setSelectedCard({ ...selectedCard, ...updates });
      }

      return true;
    } catch (error) {
      console.error('Error updating card state:', error);
      toast.error('Failed to update card state. Please try again.');
      return false;
    }
  };

  // Update the UI to handle missing transaction data gracefully
  const renderTransactions = () => {
    if (cardTransactions.length === 0) {
      return (
        <div className="py-4 text-center text-gray-500">
          No transactions available
        </div>
      );
    }

    return filteredTransactions.map(tx => (
      <div key={tx.id} className="py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-gray-500" />
          </div>
          <div>
            <p className="font-medium">{tx.description}</p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{format(new Date(tx.date), 'MMM d, yyyy')}</span>
              {tx.category && (
                <>
                  <span>•</span>
                  <span className="capitalize">{tx.category}</span>
                </>
              )}
              {tx.merchant && (
                <>
                  <span>•</span>
                  <span>{tx.merchant}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="font-semibold text-red-600">
            ${Math.abs(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          {tx.location && (
            <p className="text-xs text-gray-500">{tx.location}</p>
          )}
        </div>
      </div>
    ));
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen"><Loading /></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <CreditCard className="w-10 h-10 text-primary-600" />
            <div>
              <h1 className="text-2xl font-bold">Cards</h1>
              <p className="text-gray-600">Manage your cards and view transactions</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              className="btn btn-outline flex items-center gap-1"
              onClick={() => setShowAnalytics(!showAnalytics)}
            >
              <BarChart3 className="w-5 h-5" />
              Analytics
            </button>
            <button 
              className="btn btn-outline flex items-center gap-1"
              onClick={() => setShowAlerts(!showAlerts)}
            >
              <AlertCircle className="w-5 h-5" />
              Alerts
              {spendingAlerts.length > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {spendingAlerts.length}
                </span>
              )}
            </button>
            <button className="btn btn-primary flex items-center gap-1">
              <PlusCircle className="w-5 h-5" /> Add New Card
            </button>
          </div>
        </div>

        {/* Alerts Section */}
        {showAlerts && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Spending Alerts</h2>
            <div className="space-y-4">
              {spendingAlerts.length === 0 ? (
                <p className="text-gray-500 text-center">No alerts</p>
              ) : (
                spendingAlerts.map(alert => (
                  <div key={alert.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-500 mt-1" />
                    <div className="flex-1">
                      <p className="font-medium">{alert.message}</p>
                      <p className="text-sm text-gray-500">
                        {format(parseISO(alert.created_at), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                    <button
                      className="text-gray-400 hover:text-gray-600"
                      onClick={() => setSpendingAlerts(alerts => alerts.filter(a => a.id !== alert.id))}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Analytics Section */}
        {showAnalytics && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Card Analytics</h2>
              <div className="flex gap-2">
                <button
                  className={`btn btn-sm ${selectedTimeRange === '7d' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setSelectedTimeRange('7d')}
                >
                  7D
                </button>
                <button
                  className={`btn btn-sm ${selectedTimeRange === '30d' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setSelectedTimeRange('30d')}
                >
                  30D
                </button>
                <button
                  className={`btn btn-sm ${selectedTimeRange === '90d' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setSelectedTimeRange('90d')}
                >
                  90D
                </button>
              </div>
            </div>
            
            {analytics && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl shadow-sm p-4">
                  <p className="text-sm text-gray-500">Total Spent</p>
                  <p className="text-2xl font-bold">${analytics.totalSpent.toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4">
                  <p className="text-sm text-gray-500">Average Transaction</p>
                  <p className="text-2xl font-bold">${analytics.averageTransaction.toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4">
                  <p className="text-sm text-gray-500">Top Category</p>
                  <p className="text-2xl font-bold capitalize">{analytics.topCategories[0]?.category}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4">
                  <p className="text-sm text-gray-500">Transactions</p>
                  <p className="text-2xl font-bold">{cardTransactions.length}</p>
                </div>
              </div>
            )}

            {renderAnalyticsCharts()}
          </div>
        )}

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {cards.map(card => (
            <div key={card.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium capitalize">{card.card_type} Card</h3>
                    <p className="text-gray-500 text-sm">**** **** **** {card.card_number.slice(-4)}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    card.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {card.is_active ? 'Active' : 'Blocked'}
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Daily Limit</span>
                    <span className="font-medium">${card.daily_limit?.toLocaleString() || 'No limit'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Transaction Limit</span>
                    <span className="font-medium">${card.transaction_limit?.toLocaleString() || 'No limit'}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    className="btn btn-outline btn-sm flex-1"
                    onClick={() => handleViewDetails(card)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Details
                  </button>
                  <button 
                    className="btn btn-outline btn-sm flex-1"
                    onClick={() => handleBlockUnblock(!card.is_active)}
                  >
                    {card.is_active ? (
                      <Lock className="w-4 h-4 mr-1" />
                    ) : (
                      <Unlock className="w-4 h-4 mr-1" />
                    )}
                    {card.is_active ? 'Block' : 'Unblock'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Transactions Section */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
            
            {/* Only show filters if we have transactions */}
            {cardTransactions.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search transactions..."
                      className="form-input pl-10 w-full"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="w-full sm:w-48">
                  <select
                    className="form-input w-full"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <input
                    type="date"
                    className="form-input"
                    value={dateRange.start || ''}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  />
                  <input
                    type="date"
                    className="form-input"
                    value={dateRange.end || ''}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  />
                </div>
              </div>
            )}

            {/* Transactions List */}
            <div className="divide-y">
              {renderTransactions()}
            </div>
          </div>
        </div>
      </div>

      {/* Card Details Modal */}
      {selectedCard && showCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={handleCloseModal}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            
            {/* Card Header */}
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2 capitalize">{selectedCard.card_type} Card</h2>
              <p className="text-gray-500">**** **** **** {selectedCard.card_number.slice(-4)}</p>
              <div className={`mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                selectedCard.is_active 
                  ? selectedCard.is_frozen 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {selectedCard.is_frozen ? (
                  <>
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    Frozen
                  </>
                ) : selectedCard.is_active ? (
                  <>
                    <Check className="w-4 h-4 mr-1" />
                    Active
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-1" />
                    Blocked
                  </>
                )}
              </div>
            </div>

            {/* Card Details */}
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Card Holder</p>
                  <p className="font-medium">{selectedCard.card_holder_name || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Expiry Date</p>
                  <p className="font-medium">{selectedCard.expiry_date || 'Not set'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Daily Limit</p>
                  <p className="font-medium">
                    ${selectedCard.daily_limit?.toLocaleString() || 'No limit'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Transaction Limit</p>
                  <p className="font-medium">
                    ${selectedCard.transaction_limit?.toLocaleString() || 'No limit'}
                  </p>
                </div>
              </div>
            </div>

            {/* Security Actions */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Security Actions</h3>
              
              {/* Block/Unblock Card */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {selectedCard.is_active ? (
                    <Lock className="w-5 h-5 text-red-500" />
                  ) : (
                    <Unlock className="w-5 h-5 text-green-600" />
                  )}
                  <div>
                    <p className="font-medium">
                      {selectedCard.is_active ? 'Block Card' : 'Unblock Card'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {selectedCard.is_active 
                        ? 'Temporarily block all transactions'
                        : 'Restore card functionality'}
                    </p>
                  </div>
                </div>
                <button
                  className={`btn btn-sm ${
                    selectedCard.is_active ? 'btn-outline text-red-600' : 'btn-outline text-green-600'
                  }`}
                  onClick={() => handleBlockUnblock(!selectedCard.is_active)}
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Processing...' : selectedCard.is_active ? 'Block' : 'Unblock'}
                </button>
              </div>

              {/* Freeze Card */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="font-medium">
                      {selectedCard.is_frozen ? 'Unfreeze Card' : 'Freeze Card'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {selectedCard.is_frozen 
                        ? 'Resume card usage'
                        : 'Temporarily suspend card usage'}
                    </p>
                  </div>
                </div>
                <button
                  className="btn btn-sm btn-outline text-blue-600"
                  onClick={() => {
                    setFreezeUntil('');
                    setFreezeModal(true);
                  }}
                  disabled={actionLoading}
                >
                  {selectedCard.is_frozen ? 'Unfreeze' : 'Freeze'}
                </button>
              </div>

              {/* Set Limits */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Settings2 className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Set Limits</p>
                    <p className="text-sm text-gray-500">Configure spending limits</p>
                  </div>
                </div>
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => {
                    setLimitDaily(selectedCard.daily_limit?.toString() || '');
                    setLimitTxn(selectedCard.transaction_limit?.toString() || '');
                    setLimitsModal(true);
                  }}
                >
                  Configure
                </button>
              </div>

              {/* Download Statement */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Download className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Download Statement</p>
                    <p className="text-sm text-gray-500">Get transaction history</p>
                  </div>
                </div>
                <button
                  className="btn btn-sm btn-outline"
                  onClick={handleDownloadStatement}
                >
                  Download
                </button>
              </div>

              {/* Notifications */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {selectedCard.notifications_enabled ? (
                    <Bell className="w-5 h-5 text-green-600" />
                  ) : (
                    <BellOff className="w-5 h-5 text-gray-500" />
                  )}
                  <div>
                    <p className="font-medium">Transaction Notifications</p>
                    <p className="text-sm text-gray-500">
                      {selectedCard.notifications_enabled 
                        ? 'Notifications are enabled'
                        : 'Notifications are disabled'}
                    </p>
                  </div>
                </div>
                <button
                  className={`btn btn-sm btn-outline ${
                    selectedCard.notifications_enabled ? 'text-green-600' : 'text-gray-600'
                  }`}
                  onClick={handleToggleNotifications}
                  disabled={actionLoading}
                >
                  {selectedCard.notifications_enabled ? 'Disable' : 'Enable'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Set Limits Modal */}
      {selectedCard && limitsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg max-w-xs w-full p-6 relative">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600" onClick={() => setLimitsModal(false)} aria-label="Close"><X className="w-5 h-5" /></button>
            <h2 className="text-lg font-bold mb-4">Set Card Limits</h2>
            <form onSubmit={handleSetLimits} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Daily Limit</label>
                <input type="number" min="0" className="form-input w-full" value={limitDaily} onChange={e => setLimitDaily(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Transaction Limit</label>
                <input type="number" min="0" className="form-input w-full" value={limitTxn} onChange={e => setLimitTxn(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-primary w-full" disabled={actionLoading}>{actionLoading ? 'Saving...' : 'Save'}</button>
            </form>
          </div>
        </div>
      )}

      {/* Freeze Modal */}
      {selectedCard && freezeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg max-w-xs w-full p-6 relative">
            <button 
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600" 
              onClick={() => setFreezeModal(false)}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="mb-4">
              <h2 className="text-lg font-bold mb-2">Freeze Card</h2>
              <p className="text-sm text-gray-500">
                Your card will be temporarily suspended until the specified date or until you unfreeze it.
              </p>
            </div>

            <form onSubmit={handleFreeze} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Freeze Until (optional)</label>
                <input
                  type="date"
                  className="form-input w-full"
                  value={freezeUntil}
                  onChange={(e) => setFreezeUntil(e.target.value)}
                  min={format(new Date(), 'yyyy-MM-dd')}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty to freeze indefinitely until manually unfrozen
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  className="btn btn-outline flex-1"
                  onClick={() => setFreezeModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex-1"
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Processing...' : 'Freeze Card'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Statement Download Modal */}
      {selectedCard && showStatementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg max-w-xs w-full p-6 relative">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600" onClick={() => setShowStatementModal(false)} aria-label="Close"><X className="w-5 h-5" /></button>
            <h2 className="text-lg font-bold mb-4">Download Statement</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input type="date" className="form-input w-full" value={statementStart} onChange={e => setStatementStart(e.target.value)} />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input type="date" className="form-input w-full" value={statementEnd} onChange={e => setStatementEnd(e.target.value)} />
            </div>
            <button className="btn btn-primary w-full" onClick={handleStatementDownloadConfirm} disabled={statementLoading}>{statementLoading ? 'Downloading...' : 'Download'}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardsPage; 