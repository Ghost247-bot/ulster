import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import { CreditCard, PlusCircle, Eye, Lock, Unlock, Settings2, Download, Bell, BellOff, X } from 'lucide-react';
import Loading from '../../components/ui/Loading';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

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
}

interface CardTransaction {
  id: number;
  card_id: number;
  date: string;
  description: string;
  amount: number;
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

  useEffect(() => {
    const fetchCardsAndTransactions = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        // Fetch cards
        const { data: cardsData, error: cardsError } = await supabase
          .from('cards')
          .select('*')
          .eq('user_id', user.id);
        if (cardsError) throw cardsError;
        setCards(cardsData || []);

        // Fetch transactions for these cards
        if (cardsData && cardsData.length > 0) {
          const cardIds = cardsData.map((c: Card) => c.id);
          const { data: txData, error: txError } = await supabase
            .from('card_transactions')
            .select('*')
            .in('card_id', cardIds)
            .order('date', { ascending: false })
            .limit(10);
          if (txError) throw txError;
          setCardTransactions(txData || []);
        } else {
          setCardTransactions([]);
        }
      } catch (error) {
        console.error('Error fetching cards or transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCardsAndTransactions();
  }, [user]);

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

  // Block/Unblock Card
  const handleBlockUnblock = async (block: boolean) => {
    if (!selectedCard) return;
    setActionLoading(true);
    try {
      await supabase.from('cards').update({ is_active: !block }).eq('id', selectedCard.id);
      toast.success(block ? 'Card blocked' : 'Card unblocked');
      setSelectedCard({ ...selectedCard, is_active: !block });
      setCards(cards.map(c => c.id === selectedCard.id ? { ...c, is_active: !block } : c));
    } catch (err: any) {
      toast.error('Failed to update card status');
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

  // Freeze Card
  const handleFreeze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCard) return;
    setActionLoading(true);
    try {
      await supabase.from('cards').update({ is_frozen: true, freeze_until: freezeUntil || null }).eq('id', selectedCard.id);
      toast.success('Card frozen');
      setSelectedCard({ ...selectedCard, is_frozen: true, freeze_until: freezeUntil || null });
      setCards(cards.map(c => c.id === selectedCard.id ? { ...c, is_frozen: true, freeze_until: freezeUntil || null } : c));
      setFreezeModal(false);
    } catch (err: any) {
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

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen"><Loading /></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <CreditCard className="w-10 h-10 text-primary-600" />
            <h1 className="text-2xl font-bold">Cards</h1>
          </div>
          <button className="btn btn-primary flex items-center gap-1">
            <PlusCircle className="w-5 h-5" /> Add New Card
          </button>
        </div>

        {/* List of Cards */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Your Cards</h2>
          <div className="space-y-4">
            {cards.length === 0 ? (
              <div className="text-gray-500">No cards found.</div>
            ) : cards.map(card => (
              <div key={card.id} className="flex items-center justify-between bg-gray-100 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-7 h-7 text-primary-500" />
                  <div>
                    <div className="font-medium">{card.card_type.charAt(0).toUpperCase() + card.card_type.slice(1)} Card</div>
                    <div className="text-gray-500 text-sm">**** **** **** {card.card_number.slice(-4)}</div>
                    <div className={`text-xs mt-1 font-semibold ${card.is_active ? 'text-green-600' : 'text-red-500'}`}>{card.is_active ? 'Active' : 'Blocked'}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 rounded hover:bg-gray-200" title="View Details" onClick={() => handleViewDetails(card)}><Eye className="w-5 h-5" /></button>
                  {card.is_active ? (
                    <button className="p-2 rounded hover:bg-gray-200" title="Block Card"><Lock className="w-5 h-5 text-red-500" /></button>
                  ) : (
                    <button className="p-2 rounded hover:bg-gray-200" title="Unblock Card"><Unlock className="w-5 h-5 text-green-600" /></button>
                  )}
                  <button className="p-2 rounded hover:bg-gray-200" title="Set Limits"><Settings2 className="w-5 h-5" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Card Transactions */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Recent Card Transactions</h2>
          <div className="divide-y">
            {cardTransactions.length === 0 ? (
              <div className="text-gray-500">No recent transactions.</div>
            ) : cardTransactions.map(tx => (
              <div key={tx.id} className="flex justify-between items-center py-3">
                <div>
                  <div className="font-medium">{tx.description}</div>
                  <div className="text-xs text-gray-500">{tx.date}</div>
                </div>
                <div className="font-semibold text-red-600">${Math.abs(tx.amount).toFixed(2)}</div>
              </div>
            ))}
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
            <h2 className="text-xl font-bold mb-2">{selectedCard.card_type.charAt(0).toUpperCase() + selectedCard.card_type.slice(1)} Card</h2>
            <p className="text-gray-500 mb-2">Card Number: **** **** **** {selectedCard.card_number.slice(-4)}</p>
            <p className="text-gray-500 mb-2">Status: <span className={selectedCard.is_active ? 'text-green-600' : 'text-red-500'}>{selectedCard.is_active ? 'Active' : 'Blocked'}</span></p>
            {/* Actions: Block/Unblock, Set Limits, Freeze, Download Statement, Notifications */}
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedCard.is_active ? (
                <button className="btn btn-outline btn-sm text-red-600" onClick={() => handleBlockUnblock(true)} disabled={actionLoading}>Block</button>
              ) : (
                <button className="btn btn-outline btn-sm text-green-600" onClick={() => handleBlockUnblock(false)} disabled={actionLoading}>Unblock</button>
              )}
              <button className="btn btn-outline btn-sm" onClick={() => { setLimitDaily(selectedCard.daily_limit?.toString() || ''); setLimitTxn(selectedCard.transaction_limit?.toString() || ''); setLimitsModal(true); }}>Set Limits</button>
              <button className="btn btn-outline btn-sm" onClick={() => { setFreezeUntil(''); setFreezeModal(true); }}>Freeze</button>
              <button className="btn btn-outline btn-sm flex items-center" onClick={handleDownloadStatement}><Download className="w-4 h-4 mr-1" /> Download Statement</button>
              {selectedCard.notifications_enabled ? (
                <button className="btn btn-outline btn-sm flex items-center text-blue-600" onClick={handleToggleNotifications} disabled={actionLoading}><BellOff className="w-4 h-4 mr-1" /> Disable Notifications</button>
              ) : (
                <button className="btn btn-outline btn-sm flex items-center text-blue-600" onClick={handleToggleNotifications} disabled={actionLoading}><Bell className="w-4 h-4 mr-1" /> Enable Notifications</button>
              )}
            </div>
            {/* Card limits, freeze info, etc. will be shown here in future steps */}
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
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600" onClick={() => setFreezeModal(false)} aria-label="Close"><X className="w-5 h-5" /></button>
            <h2 className="text-lg font-bold mb-4">Freeze Card</h2>
            <form onSubmit={handleFreeze} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Freeze Until (optional)</label>
                <input type="date" className="form-input w-full" value={freezeUntil} onChange={e => setFreezeUntil(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-primary w-full" disabled={actionLoading}>{actionLoading ? 'Freezing...' : 'Freeze'}</button>
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