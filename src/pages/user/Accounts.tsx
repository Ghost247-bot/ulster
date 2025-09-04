import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import { DollarSign, PlusCircle, Download, Lock, Unlock, Search, X, ArrowRightLeft, MinusCircle } from 'lucide-react';
import AccountCard from '../../components/ui/AccountCard';
import Loading from '../../components/ui/Loading';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

interface Account {
  id: number;
  account_type: string;
  account_number: string;
  routing_number: string;
  balance: number;
  is_frozen: boolean;
}

interface Transaction {
  id: number;
  account_id: number;
  amount: number;
  description: string;
  transaction_type: string;
  created_at: string;
  note?: string;
  category?: string;
  reversed: boolean;
}

const UserAccounts = () => {
  const { user } = useAuthStore();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalBalance, setTotalBalance] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [freezeLoading, setFreezeLoading] = useState(false);
  const [actionModal, setActionModal] = useState<null | 'transfer' | 'deposit' | 'withdraw'>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionAmount, setActionAmount] = useState('');
  const [transferTo, setTransferTo] = useState('');
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [statementLoading, setStatementLoading] = useState(false);
  const [statementStart, setStatementStart] = useState('');
  const [statementEnd, setStatementEnd] = useState('');
  const [showStatementModal, setShowStatementModal] = useState(false);
  const [actionNote, setActionNote] = useState('');
  const [actionCategory, setActionCategory] = useState('');
  const categories = ['General', 'Bills', 'Shopping', 'Food', 'Salary', 'Transfer', 'Other'];
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingAction, setPendingAction] = useState<null | (() => void)>(null);
  const [password, setPassword] = useState('');
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    const fetchAccounts = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('accounts')
          .select('*')
          .eq('user_id', user.id)
          .order('account_type', { ascending: true });

        if (error) throw error;
        
        setAccounts(data || []);
        
        // Calculate total balance
        const total = (data || []).reduce((sum, account) => sum + account.balance, 0);
        setTotalBalance(total);
      } catch (error) {
        console.error('Error fetching accounts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccounts();
  }, [user]);

  // Filter accounts by search term
  const filteredAccounts = accounts.filter(
    (account) =>
      account.account_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.account_number.includes(searchTerm)
  );

  // Fetch recent transactions when modal opens
  useEffect(() => {
    const fetchRecentTransactions = async () => {
      if (!selectedAccount) return;
      setIsModalLoading(true);
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('account_id', selectedAccount.id)
          .order('created_at', { ascending: false })
          .limit(5);
        if (error) throw error;
        setRecentTransactions(data || []);
      } catch (err) {
        setRecentTransactions([]);
      } finally {
        setIsModalLoading(false);
      }
    };
    if (selectedAccount) fetchRecentTransactions();
  }, [selectedAccount]);

  // Fetch all transactions for statement download
  const fetchAllTransactions = async () => {
    if (!selectedAccount) return;
    setStatementLoading(true);
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('account_id', selectedAccount.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setAllTransactions(data || []);
    } catch (err) {
      setAllTransactions([]);
    } finally {
      setStatementLoading(false);
    }
  };

  // Download statement with date range
  const handleDownloadStatement = async () => {
    if (!selectedAccount) return;
    setShowStatementModal(true);
  };

  const handleStatementDownloadConfirm = async () => {
    if (!selectedAccount) return;
    setStatementLoading(true);
    try {
      let query = supabase
        .from('transactions')
        .select('*')
        .eq('account_id', selectedAccount.id)
        .order('created_at', { ascending: false });
      if (statementStart) query = query.gte('created_at', statementStart);
      if (statementEnd) query = query.lte('created_at', statementEnd + 'T23:59:59');
      const { data, error } = await query;
      if (error) throw error;
      if (!data || data.length === 0) {
        toast.error('No transactions in selected range');
        setStatementLoading(false);
        return;
      }
      const csvRows = [
        'Date,Description,Type,Amount',
        ...data.map(tx =>
          `${format(new Date(tx.created_at), 'yyyy-MM-dd')},"${tx.description}",${tx.transaction_type},${tx.amount}`
        ),
      ];
      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `statement_${selectedAccount.account_number}_${statementStart || 'all'}_${statementEnd || 'all'}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Statement downloaded');
      setShowStatementModal(false);
    } catch (err: any) {
      toast.error(err.message || 'Download failed');
    } finally {
      setStatementLoading(false);
    }
  };

  // Handle Deposit, Withdraw, Transfer
  const handleActionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccount) return;

    // Check if account is frozen
    if (selectedAccount.is_frozen) {
      toast.error('This account is frozen. Please contact customer support for assistance.');
      return;
    }

    const amount = parseFloat(actionAmount);
    if (isNaN(amount) || amount <= 0) return toast.error('Enter a valid amount');
    if (actionModal === 'withdraw' && amount > selectedAccount.balance) {
      return toast.error('Insufficient funds');
    }
    if (actionModal === 'transfer') {
      if (!transferTo) return toast.error('Select a destination account');
      if (parseInt(transferTo) === selectedAccount.id) return toast.error('Cannot transfer to the same account');
      if (amount > selectedAccount.balance) return toast.error('Insufficient funds');
    }
    // Confirmation for large transactions
    if (amount > 1000) {
      setShowConfirm(true);
      setPendingAction(() => () => doAction(amount));
      return;
    }
    // Password for large withdrawals
    if (actionModal === 'withdraw' && amount > 2000) {
      setPasswordRequired(true);
      setPendingAction(() => () => doAction(amount));
      return;
    }
    await doAction(amount);
  };

  const doAction = async (amount: number) => {
    if (!selectedAccount) return;
    setActionLoading(true);
    try {
      if (actionModal === 'deposit') {
        await supabase.from('transactions').insert({
          account_id: selectedAccount.id,
          amount,
          description: 'Deposit',
          transaction_type: 'deposit',
          note: actionNote,
          category: actionCategory,
        });
        await supabase.from('accounts').update({ balance: selectedAccount.balance + amount }).eq('id', selectedAccount.id);
        toast.success('Deposit successful');
      } else if (actionModal === 'withdraw') {
        await supabase.from('transactions').insert({
          account_id: selectedAccount.id,
          amount: -amount,
          description: 'Withdrawal',
          transaction_type: 'withdrawal',
          note: actionNote,
          category: actionCategory,
        });
        await supabase.from('accounts').update({ balance: selectedAccount.balance - amount }).eq('id', selectedAccount.id);
        toast.success('Withdrawal successful');
      } else if (actionModal === 'transfer') {
        await supabase.from('transactions').insert({
          account_id: selectedAccount.id,
          amount: -amount,
          description: `Transfer to ${transferTo}`,
          transaction_type: 'transfer',
          note: actionNote,
          category: actionCategory,
        });
        await supabase.from('accounts').update({ balance: selectedAccount.balance - amount }).eq('id', selectedAccount.id);
        await supabase.from('transactions').insert({
          account_id: parseInt(transferTo),
          amount,
          description: `Transfer from ${selectedAccount.account_number}`,
          transaction_type: 'transfer',
          note: actionNote,
          category: actionCategory,
        });
        const dest = accounts.find(a => a.id === parseInt(transferTo));
        if (dest) {
          await supabase.from('accounts').update({ balance: dest.balance + amount }).eq('id', dest.id);
        }
        toast.success('Transfer successful');
      }
      setActionModal(null);
      setActionAmount('');
      setTransferTo('');
      setActionNote('');
      setActionCategory('');
      setShowConfirm(false);
      setPasswordRequired(false);
      setPassword('');
      // Refresh accounts and transactions
      const { data } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', user.id)
        .order('account_type', { ascending: true });
      setAccounts(data || []);
      setSelectedAccount(data?.find(a => selectedAccount && a.id === selectedAccount.id) || null);
    } catch (err: any) {
      toast.error(err.message || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  // Password check stub (replace with real check if needed)
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setTimeout(async () => {
      setPasswordLoading(false);
      if (password !== 'password123') {
        toast.error('Incorrect password');
        return;
      }
      setPasswordRequired(false);
      setPassword('');
      if (pendingAction) pendingAction();
    }, 1000);
  };

  // Freeze/Unfreeze account stub
  const handleToggleFreeze = async () => {
    if (!selectedAccount) return;
    setFreezeLoading(true);
    // This is a stub. Replace with actual API call if needed.
    setTimeout(() => {
      setAccounts(prev =>
        prev.map(acc =>
          acc.id === selectedAccount.id
            ? { ...acc, is_frozen: !acc.is_frozen }
            : acc
        )
      );
      setSelectedAccount(prev =>
        prev ? { ...prev, is_frozen: !prev.is_frozen } : prev
      );
      setFreezeLoading(false);
    }, 1000);
  };

  const handleUndoTransaction = async (tx: Transaction) => {
    if (!selectedAccount) return;
    if (tx.reversed) return toast.error('Transaction already reversed');
    try {
      // Create reversing transaction
      await supabase.from('transactions').insert({
        account_id: tx.account_id,
        amount: -tx.amount,
        description: `Undo: ${tx.description}`,
        transaction_type: tx.transaction_type,
        note: `Undo of transaction ${tx.id}`,
        category: tx.category,
        reversed: false,
      });
      // Mark original as reversed
      await supabase.from('transactions').update({ reversed: true }).eq('id', tx.id);
      // Update account balance
      const newBalance = selectedAccount ? selectedAccount.balance - tx.amount : 0;
      if (selectedAccount) {
        await supabase.from('accounts').update({ balance: newBalance }).eq('id', selectedAccount.id);
      }
      toast.success('Transaction undone');
      // Refresh transactions and account
      if (selectedAccount) {
        const { data: updatedAccount } = await supabase
          .from('accounts')
          .select('*')
          .eq('id', selectedAccount.id)
          .single();
        setSelectedAccount(updatedAccount);
        // Refetch recent transactions
        const { data: txs } = await supabase
          .from('transactions')
          .select('*')
          .eq('account_id', selectedAccount.id)
          .order('created_at', { ascending: false })
          .limit(5);
        setRecentTransactions(txs || []);
      }
    } catch (err: any) {
      toast.error(err.message || 'Undo failed');
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-4 sm:px-6 lg:px-8 max-w-[2000px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 sm:pt-6 animate-slide-in-up">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 animate-fade-in">Your Accounts</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1 animate-fade-in-delay">Manage your accounts and view transactions</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto animate-slide-in-right">
          <Link
            to="/accounts/new"
            className="btn btn-primary flex items-center w-full sm:w-auto justify-center transform hover:scale-105 transition-all duration-200 hover:shadow-lg"
          >
            <PlusCircle className="w-4 h-4 mr-1" />
            New Account
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 xs:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 hover:shadow-lg transition-all duration-300 transform hover:scale-105 animate-slide-in-up group" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-500">Total Balance</p>
              <p className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 animate-count-up break-all">
                ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 hover:shadow-lg transition-all duration-300 transform hover:scale-105 animate-slide-in-up group" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-success-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
              <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5 text-success-600" />
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-500">Active Accounts</p>
              <p className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 animate-count-up">
                {accounts.filter(a => !a.is_frozen).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 hover:shadow-lg transition-all duration-300 transform hover:scale-105 animate-slide-in-up group" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-error-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
              <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-error-600" />
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-500">Frozen Accounts</p>
              <p className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 animate-count-up">
                {accounts.filter(a => a.is_frozen).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 hover:shadow-lg transition-all duration-300 transform hover:scale-105 animate-slide-in-up group" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
              <Download className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-500">Recent Transactions</p>
              <p className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 animate-count-up">
                {recentTransactions.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 animate-slide-in-up hover:shadow-lg transition-all duration-300">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          <button 
            onClick={() => {
              if (accounts.length === 0) {
                toast.error('You need at least one account to make transfers');
                return;
              }
              if (accounts.length === 1) {
                toast.error('You need at least two accounts to make transfers');
                return;
              }
              const activeAccounts = accounts.filter(a => !a.is_frozen);
              if (activeAccounts.length < 2) {
                toast.error('You need at least two active accounts to make transfers');
                return;
              }
              setSelectedAccount(activeAccounts[0]);
              setActionModal('transfer');
            }}
            className="group flex flex-col items-center justify-center p-3 sm:p-4 rounded-lg border border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 animate-slide-in-up"
            style={{ animationDelay: '0.1s' }}
            disabled={accounts.length < 2}
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary-100 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
              <ArrowRightLeft className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-gray-900 group-hover:text-primary-700 transition-colors duration-300 text-center">Transfer</span>
            <span className="text-[10px] sm:text-xs text-gray-500 mt-1 text-center">Between accounts</span>
          </button>
          <button 
            onClick={() => {
              if (accounts.length === 0) {
                toast.error('You need at least one account to make deposits');
                return;
              }
              const activeAccounts = accounts.filter(a => !a.is_frozen);
              if (activeAccounts.length === 0) {
                toast.error('You need at least one active account to make deposits');
                return;
              }
              setSelectedAccount(activeAccounts[0]);
              setActionModal('deposit');
            }}
            className="group flex flex-col items-center justify-center p-3 sm:p-4 rounded-lg border border-gray-200 hover:border-success-500 hover:bg-success-50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 animate-slide-in-up"
            style={{ animationDelay: '0.2s' }}
            disabled={accounts.length === 0}
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-success-100 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
              <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5 text-success-600" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-gray-900 group-hover:text-success-700 transition-colors duration-300 text-center">Deposit</span>
            <span className="text-[10px] sm:text-xs text-gray-500 mt-1 text-center">Add funds</span>
          </button>
          <button 
            onClick={() => {
              if (accounts.length === 0) {
                toast.error('You need at least one account to make withdrawals');
                return;
              }
              const activeAccounts = accounts.filter(a => !a.is_frozen);
              if (activeAccounts.length === 0) {
                toast.error('You need at least one active account to make withdrawals');
                return;
              }
              setSelectedAccount(activeAccounts[0]);
              setActionModal('withdraw');
            }}
            className="group flex flex-col items-center justify-center p-3 sm:p-4 rounded-lg border border-gray-200 hover:border-error-500 hover:bg-error-50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 animate-slide-in-up"
            style={{ animationDelay: '0.3s' }}
            disabled={accounts.length === 0}
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-error-100 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
              <MinusCircle className="w-4 h-4 sm:w-5 sm:h-5 text-error-600" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-gray-900 group-hover:text-error-700 transition-colors duration-300 text-center">Withdraw</span>
            <span className="text-[10px] sm:text-xs text-gray-500 mt-1 text-center">Remove funds</span>
          </button>
          <button 
            onClick={() => {
              if (accounts.length === 0) {
                toast.error('You need at least one account to download statements');
                return;
              }
              const activeAccounts = accounts.filter(a => !a.is_frozen);
              if (activeAccounts.length === 0) {
                toast.error('You need at least one active account to download statements');
                return;
              }
              setSelectedAccount(activeAccounts[0]);
              handleDownloadStatement();
            }}
            className="group flex flex-col items-center justify-center p-3 sm:p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 animate-slide-in-up"
            style={{ animationDelay: '0.4s' }}
            disabled={accounts.length === 0}
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
              <Download className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-gray-900 group-hover:text-blue-700 transition-colors duration-300 text-center">Statement</span>
            <span className="text-[10px] sm:text-xs text-gray-500 mt-1 text-center">Download PDF</span>
          </button>
        </div>
      </div>

      {/* Search/Filter Bar */}
      <div className="mb-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="relative w-full sm:max-w-xs">
          <span className="absolute left-3 top-2.5 text-gray-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            className="form-input pl-9 pr-3 py-2 w-full rounded text-sm sm:text-base"
            placeholder="Search by type or account number..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Accounts List */}
      <div className="max-w-[2000px] mx-auto">
        {filteredAccounts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary-100 text-primary-600 mb-4">
              <DollarSign className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900">No accounts yet</h3>
            <p className="mt-1 text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
              You don't have any accounts yet. Please contact our customer support to open an account.
            </p>
            <button className="mt-4 btn btn-primary flex items-center mx-auto text-sm sm:text-base">
              <PlusCircle className="w-4 h-4 mr-2" />
              Contact Support
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {/* Individual Account Cards */}
            {filteredAccounts.map((account) => (
              <AccountCard
                key={account.id}
                id={account.id}
                type={account.account_type}
                accountNumber={account.account_number}
                balance={account.balance}
                isFrozen={account.is_frozen}
                onClick={() => setSelectedAccount(account)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Account Details Modal */}
      {selectedAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-4 sm:p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={() => setSelectedAccount(null)}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg sm:text-xl font-bold mb-2 pr-8">{selectedAccount.account_type} Account</h2>
            <p className="text-sm sm:text-base text-gray-500 mb-2 break-all">Account #: {selectedAccount.account_number}</p>
            <p className="text-sm sm:text-base text-gray-500 mb-2 break-all">Routing #: {selectedAccount.routing_number}</p>
            <p className="text-sm sm:text-base text-gray-900 font-semibold mb-4 break-all">Balance: ${selectedAccount.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            {/* Actions */}
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 mb-4">
              <button className="btn btn-primary btn-sm" onClick={() => setActionModal('transfer')}>Transfer</button>
              <button className="btn btn-primary btn-sm" onClick={() => setActionModal('deposit')}>Deposit</button>
              <button className="btn btn-primary btn-sm" onClick={() => setActionModal('withdraw')}>Withdraw</button>
              <button className="btn btn-outline btn-sm flex items-center justify-center" onClick={handleDownloadStatement}>
                <Download className="w-4 h-4 mr-1" /> <span className="hidden xs:inline">Download Statement</span><span className="xs:hidden">Statement</span>
              </button>
              <button
                className={`btn btn-outline btn-sm flex items-center justify-center xs:col-span-2 ${selectedAccount.is_frozen ? 'text-green-600' : 'text-red-600'}`}
                onClick={handleToggleFreeze}
                disabled={freezeLoading}
              >
                {selectedAccount.is_frozen ? (
                  <Unlock className="w-4 h-4 mr-1" />
                ) : (
                  <Lock className="w-4 h-4 mr-1" />
                )}
                {freezeLoading
                  ? 'Processing...'
                  : selectedAccount.is_frozen
                  ? 'Unfreeze'
                  : 'Freeze'}
              </button>
            </div>
            {/* Recent Transactions */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-2">Recent Transactions</h3>
              {isModalLoading ? (
                <div className="text-gray-500 text-sm">Loading...</div>
              ) : recentTransactions.length === 0 ? (
                <div className="text-gray-500 text-sm">No recent transactions.</div>
              ) : (
                <div className="divide-y">
                  {recentTransactions.map(tx => (
                    <div key={tx.id} className="py-2 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm sm:text-base truncate">{tx.description}</div>
                        <div className="text-xs text-gray-500">{format(new Date(tx.created_at), 'MMM d, yyyy')}</div>
                        {tx.category && <div className="text-xs text-blue-600">Category: {tx.category}</div>}
                        {tx.note && <div className="text-xs text-gray-600 italic truncate">Note: {tx.note}</div>}
                        {tx.reversed && <div className="text-xs text-red-500 font-semibold">Reversed</div>}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className={`font-semibold text-sm sm:text-base ${tx.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>{tx.amount < 0 ? '-' : '+'}${Math.abs(tx.amount).toFixed(2)}</div>
                        {!tx.reversed && (
                          <button
                            className="btn btn-outline btn-xs text-xs"
                            onClick={() => handleUndoTransaction(tx)}
                          >
                            Undo
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Action Modals */}
      {selectedAccount && actionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-4 sm:p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={() => setActionModal(null)}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-base sm:text-lg font-bold mb-4 capitalize pr-8">{actionModal} {actionModal === 'transfer' ? 'Funds' : ''}</h2>
            <form onSubmit={handleActionSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Amount</label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  className="form-input w-full text-sm sm:text-base"
                  value={actionAmount}
                  onChange={e => setActionAmount(e.target.value)}
                  required
                />
              </div>
              {actionModal === 'transfer' && (
                <div>
                  <label className="block text-sm font-medium mb-1">To Account</label>
                  <select
                    className="form-input w-full text-sm sm:text-base"
                    value={transferTo}
                    onChange={e => setTransferTo(e.target.value)}
                    required
                  >
                    <option value="">Select account</option>
                    {accounts.filter(a => a.id !== selectedAccount.id).map(a => (
                      <option key={a.id} value={a.id}>
                        {a.account_type} ({a.account_number.slice(-4)})
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  className="form-input w-full text-sm sm:text-base"
                  value={actionCategory}
                  onChange={e => setActionCategory(e.target.value)}
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Note (optional)</label>
                <input
                  type="text"
                  className="form-input w-full text-sm sm:text-base"
                  value={actionNote}
                  onChange={e => setActionNote(e.target.value)}
                  maxLength={100}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary w-full text-sm sm:text-base"
                disabled={actionLoading}
              >
                {actionLoading ? 'Processing...' : 'Submit'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Statement Download Modal */}
      {selectedAccount && showStatementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-4 sm:p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={() => setShowStatementModal(false)}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-base sm:text-lg font-bold mb-4 pr-8">Download Statement</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input
                type="date"
                className="form-input w-full text-sm sm:text-base"
                value={statementStart}
                onChange={e => setStatementStart(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input
                type="date"
                className="form-input w-full text-sm sm:text-base"
                value={statementEnd}
                onChange={e => setStatementEnd(e.target.value)}
              />
            </div>
            <button
              className="btn btn-primary w-full text-sm sm:text-base"
              onClick={handleStatementDownloadConfirm}
              disabled={statementLoading}
            >
              {statementLoading ? 'Downloading...' : 'Download'}
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Dialog for Large Transactions */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-xs w-full p-4 sm:p-6 relative">
            <h2 className="text-base sm:text-lg font-bold mb-4">Confirm Transaction</h2>
            <p className="mb-4 text-sm sm:text-base">Are you sure you want to proceed with this large transaction?</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <button className="btn btn-primary flex-1 text-sm sm:text-base" onClick={() => { setShowConfirm(false); if (pendingAction) pendingAction(); }}>Yes</button>
              <button className="btn btn-outline flex-1 text-sm sm:text-base" onClick={() => setShowConfirm(false)}>No</button>
            </div>
          </div>
        </div>
      )}

      {/* Password Dialog for Large Withdrawals */}
      {passwordRequired && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-xs w-full p-4 sm:p-6 relative">
            <h2 className="text-base sm:text-lg font-bold mb-4">Re-enter Password</h2>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <input
                type="password"
                className="form-input w-full text-sm sm:text-base"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button className="btn btn-primary w-full text-sm sm:text-base" type="submit" disabled={passwordLoading}>
                {passwordLoading ? 'Checking...' : 'Confirm'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAccounts;