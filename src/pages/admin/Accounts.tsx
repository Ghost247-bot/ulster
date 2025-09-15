import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { accountService } from '../../lib/databaseService';
import { AlertTriangle, Check, ChevronDown, DollarSign, Edit, Lock, Lock as LockOpen, Plus, Search, Trash2, Bell, Users, X } from 'lucide-react';
import Loading from '../../components/ui/Loading';
import toast from 'react-hot-toast';

interface Account {
  id: number;
  user_id: string;
  account_type: 'checking' | 'savings' | 'investment' | 'escrow';
  account_number: string;
  routing_number: string;
  balance: number;
  is_frozen: boolean;
  created_at: string;
}

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

const AdminAccounts = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<Account[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [accountTypeFilter, setAccountTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Account>>({});
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [isCreating, setIsCreating] = useState(false);
  
  // Notification management state
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [notificationData, setNotificationData] = useState({
    title: '',
    message: '',
    type: 'info' as 'info' | 'warning' | 'success' | 'error'
  });
  
  // Bulk operations state
  const [selectedAccounts, setSelectedAccounts] = useState<number[]>([]);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkAction, setBulkAction] = useState<'freeze' | 'unfreeze' | 'notify' | 'delete'>('freeze');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch accounts
        const { data: accountsData, error: accountsError } = await supabase
          .from('accounts')
          .select('*')
          .order('created_at', { ascending: false });

        if (accountsError) throw accountsError;
        setAccounts(accountsData || []);
        setFilteredAccounts(accountsData || []);

        // Fetch users for reference
        const { data: usersData, error: usersError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, email');

        if (usersError) throw usersError;
        setUsers(usersData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load accounts data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = [...accounts];
    
    // Search term filter
    if (searchTerm) {
      filtered = filtered.filter(
        (account) =>
          account.account_number.includes(searchTerm) ||
          account.routing_number.includes(searchTerm) ||
          getUserName(account.user_id).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Account type filter
    if (accountTypeFilter !== 'all') {
      filtered = filtered.filter((account) => account.account_type === accountTypeFilter);
    }
    
    // Status filter
    if (statusFilter !== 'all') {
      const isFrozen = statusFilter === 'frozen';
      filtered = filtered.filter((account) => account.is_frozen === isFrozen);
    }
    
    setFilteredAccounts(filtered);
  }, [searchTerm, accountTypeFilter, statusFilter, accounts]);

  const getUserName = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    return user ? `${user.first_name} ${user.last_name}` : 'Unknown User';
  };

  const getUserEmail = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.email : '';
  };

  const handleFreezeToggle = async (account: Account) => {
    try {
      const newStatus = !account.is_frozen;
      
      if (newStatus) {
        // Freezing account - use admin freeze method
        await accountService.freezeByAdmin(account.id);
      } else {
        // Unfreezing account - use admin unfreeze method
        await accountService.unfreezeByAdmin(account.id);
      }
      
      // Update local state
      setAccounts(
        accounts.map((a) =>
          a.id === account.id ? { 
            ...a, 
            is_frozen: newStatus
          } : a
        )
      );
      
      // Add notification for the user
      await supabase.from('notifications').insert({
        user_id: account.user_id,
        title: newStatus ? 'Account Frozen by Admin' : 'Account Unfrozen by Admin',
        message: newStatus
          ? `Your ${account.account_type} account ending in ${account.account_number.slice(-4)} has been frozen by an administrator. Please contact customer support for assistance.`
          : `Your ${account.account_type} account ending in ${account.account_number.slice(-4)} has been unfrozen by an administrator and is now active.`
      });
      
      toast.success(newStatus ? 'Account frozen by admin successfully' : 'Account unfrozen by admin successfully');
    } catch (error) {
      console.error('Error toggling account status:', error);
      // Log more detailed error information
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      } else if (typeof error === 'object' && error !== null) {
        console.error('Error details:', JSON.stringify(error, null, 2));
      }
      
      // Provide more specific error message to user
      let errorMessage = 'Failed to update account status';
      if (error instanceof Error) {
        errorMessage = `Failed to update account status: ${error.message}`;
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = `Failed to update account status: ${(error as any).message}`;
      }
      
      toast.error(errorMessage);
    }
  };

  const openEditModal = (account: Account) => {
    setSelectedAccount(account);
    setFormData(account);
    setSelectedUserId(account.user_id);
    setIsModalOpen(true);
    setIsCreating(false);
  };

  const openCreateModal = () => {
    setSelectedAccount(null);
    setFormData({
      account_type: 'checking',
      account_number: '',
      routing_number: '',
      balance: 0,
      is_frozen: false,
    });
    setSelectedUserId(users.length > 0 ? users[0].id : '');
    setIsModalOpen(true);
    setIsCreating(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAccount(null);
    setFormData({});
    setSelectedUserId('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      if (name === 'is_frozen' && !checked) {
        setFormData({ ...formData, [name]: checked });
      } else {
        setFormData({ ...formData, [name]: checked });
      }
    } else if (name === 'balance') {
      setFormData({ ...formData, [name]: parseFloat(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (isCreating && !selectedUserId) {
      toast.error('Please select a customer');
      return;
    }
    
    if (!formData.account_type) {
      toast.error('Please select an account type');
      return;
    }
    
    if (formData.balance === undefined || formData.balance === null) {
      toast.error('Please enter a valid balance');
      return;
    }
    
    if (formData.balance < 0) {
      toast.error('Balance cannot be negative');
      return;
    }
    
    try {
      if (isCreating) {
        // Generate a unique account number if not provided
        const accountNumber = formData.account_number || Math.floor(Math.random() * 10000000000).toString().padStart(10, '0');
        const routingNumber = formData.routing_number || '074000078';
        
        const newAccount = {
          ...formData,
          user_id: selectedUserId,
          account_number: accountNumber,
          routing_number: routingNumber,
        };
        
        const { data, error } = await supabase
          .from('accounts')
          .insert(newAccount)
          .select();

        if (error) throw error;
        
        // Add notification for the user
        await supabase.from('notifications').insert({
          user_id: selectedUserId,
          title: 'New Account Created',
          message: `A new ${formData.account_type} account has been created for you with an initial balance of $${formData.balance}.`
        });
        
        // Update local state
        setAccounts([data![0], ...accounts]);
        
        toast.success('Account created successfully');
      } else if (selectedAccount) {
        // Check if balance changed
        const balanceChanged = formData.balance !== selectedAccount.balance;
        const prevBalance = selectedAccount.balance;
        
        const { error } = await supabase
          .from('accounts')
          .update(formData)
          .eq('id', selectedAccount.id);

        if (error) throw error;
        
        // Update local state
        setAccounts(
          accounts.map((a) =>
            a.id === selectedAccount.id ? { ...a, ...formData } as Account : a
          )
        );
        
        // If balance changed, create transaction record and notification
        if (balanceChanged && formData.balance !== undefined) {
          const balanceDiff = formData.balance - prevBalance;
          const transactionType = balanceDiff > 0 ? 'deposit' : 'withdrawal';
          
          // Create transaction record
          await supabase.from('transactions').insert({
            account_id: selectedAccount.id,
            amount: Math.abs(balanceDiff),
            description: `Admin ${transactionType} adjustment`,
            transaction_type: transactionType,
          });
          
          // Create notification
          await supabase.from('notifications').insert({
            user_id: selectedAccount.user_id,
            title: 'Balance Adjustment',
            message: `Your ${selectedAccount.account_type} account ending in ${selectedAccount.account_number.slice(-4)} had a ${balanceDiff > 0 ? 'deposit' : 'withdrawal'} of $${Math.abs(balanceDiff).toFixed(2)} by an administrator.`
          });
        }
        
        toast.success('Account updated successfully');
      }
      
      closeModal();
    } catch (error) {
      console.error('Error saving account:', error);
      // Log more detailed error information
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      } else if (typeof error === 'object' && error !== null) {
        console.error('Error details:', JSON.stringify(error, null, 2));
      }
      
      // Provide more specific error message to user
      let errorMessage = 'Failed to save account';
      if (error instanceof Error) {
        errorMessage = `Failed to save account: ${error.message}`;
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = `Failed to save account: ${(error as any).message}`;
      }
      
      toast.error(errorMessage);
    }
  };

  const handleDelete = async () => {
    if (!selectedAccount) return;
    
    try {
      const { error } = await supabase
        .from('accounts')
        .delete()
        .eq('id', selectedAccount.id);

      if (error) throw error;
      
      // Update local state
      setAccounts(accounts.filter((a) => a.id !== selectedAccount.id));
      
      // Add notification for the user
      await supabase.from('notifications').insert({
        user_id: selectedAccount.user_id,
        title: 'Account Closed',
        message: `Your ${selectedAccount.account_type} account ending in ${selectedAccount.account_number.slice(-4)} has been closed.`
      });
      
      toast.success('Account deleted successfully');
      closeModal();
    } catch (error) {
      console.error('Error deleting account:', error);
      // Log more detailed error information
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      } else if (typeof error === 'object' && error !== null) {
        console.error('Error details:', JSON.stringify(error, null, 2));
      }
      
      // Provide more specific error message to user
      let errorMessage = 'Failed to delete account';
      if (error instanceof Error) {
        errorMessage = `Failed to delete account: ${error.message}`;
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = `Failed to delete account: ${(error as any).message}`;
      }
      
      toast.error(errorMessage);
    }
  };

  // Notification management functions
  const openNotificationModal = (account: Account) => {
    setSelectedAccount(account);
    setNotificationData({
      title: '',
      message: '',
      type: 'info'
    });
    setIsNotificationModalOpen(true);
  };

  const closeNotificationModal = () => {
    setIsNotificationModalOpen(false);
    setSelectedAccount(null);
    setNotificationData({
      title: '',
      message: '',
      type: 'info'
    });
  };

  const handleSendNotification = async () => {
    if (!selectedAccount || !notificationData.title || !notificationData.message) {
      toast.error('Please fill in all notification fields');
      return;
    }

    try {
      await supabase.from('notifications').insert({
        user_id: selectedAccount.user_id,
        title: notificationData.title,
        message: notificationData.message,
        type: notificationData.type
      });

      toast.success('Notification sent successfully');
      closeNotificationModal();
    } catch (error) {
      console.error('Error sending notification:', error);
      // Log more detailed error information
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      } else if (typeof error === 'object' && error !== null) {
        console.error('Error details:', JSON.stringify(error, null, 2));
      }
      
      // Provide more specific error message to user
      let errorMessage = 'Failed to send notification';
      if (error instanceof Error) {
        errorMessage = `Failed to send notification: ${error.message}`;
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = `Failed to send notification: ${(error as any).message}`;
      }
      
      toast.error(errorMessage);
    }
  };

  // Bulk operations functions
  const handleAccountSelection = (accountId: number, checked: boolean) => {
    if (checked) {
      setSelectedAccounts([...selectedAccounts, accountId]);
    } else {
      setSelectedAccounts(selectedAccounts.filter(id => id !== accountId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAccounts(filteredAccounts.map(account => account.id));
    } else {
      setSelectedAccounts([]);
    }
  };

  const openBulkModal = (action: 'freeze' | 'unfreeze' | 'notify' | 'delete') => {
    if (selectedAccounts.length === 0) {
      toast.error('Please select at least one account');
      return;
    }
    setBulkAction(action);
    setIsBulkModalOpen(true);
  };

  const closeBulkModal = () => {
    setIsBulkModalOpen(false);
    setSelectedAccounts([]);
  };

  const handleBulkAction = async () => {
    try {
      const selectedAccountsData = accounts.filter(account => 
        selectedAccounts.includes(account.id)
      );

      switch (bulkAction) {
        case 'freeze':
          for (const account of selectedAccountsData) {
            await accountService.freezeByAdmin(account.id);
            // Add notification
            await supabase.from('notifications').insert({
              user_id: account.user_id,
              title: 'Account Frozen by Admin',
              message: `Your ${account.account_type} account ending in ${account.account_number.slice(-4)} has been frozen by an administrator. Please contact customer support for assistance.`
            });
          }
          // Update local state
          setAccounts(accounts.map(account => 
            selectedAccounts.includes(account.id) 
              ? { ...account, is_frozen: true }
              : account
          ));
          toast.success(`${selectedAccounts.length} accounts frozen successfully`);
          break;

        case 'unfreeze':
          for (const account of selectedAccountsData) {
            await accountService.unfreezeByAdmin(account.id);
            // Add notification
            await supabase.from('notifications').insert({
              user_id: account.user_id,
              title: 'Account Unfrozen by Admin',
              message: `Your ${account.account_type} account ending in ${account.account_number.slice(-4)} has been unfrozen by an administrator and is now active.`
            });
          }
          // Update local state
          setAccounts(accounts.map(account => 
            selectedAccounts.includes(account.id) 
              ? { ...account, is_frozen: false }
              : account
          ));
          toast.success(`${selectedAccounts.length} accounts unfrozen successfully`);
          break;

        case 'delete':
          for (const account of selectedAccountsData) {
            await supabase.from('accounts').delete().eq('id', account.id);
            // Add notification
            await supabase.from('notifications').insert({
              user_id: account.user_id,
              title: 'Account Closed',
              message: `Your ${account.account_type} account ending in ${account.account_number.slice(-4)} has been closed.`
            });
          }
          // Update local state
          setAccounts(accounts.filter(account => 
            !selectedAccounts.includes(account.id)
          ));
          toast.success(`${selectedAccounts.length} accounts deleted successfully`);
          break;

        case 'notify':
          if (!notificationData.title || !notificationData.message) {
            toast.error('Please fill in notification details');
            return;
          }
          for (const account of selectedAccountsData) {
            await supabase.from('notifications').insert({
              user_id: account.user_id,
              title: notificationData.title,
              message: notificationData.message,
              type: notificationData.type
            });
          }
          toast.success(`Notification sent to ${selectedAccounts.length} accounts`);
          break;
      }

      closeBulkModal();
    } catch (error) {
      console.error('Error performing bulk action:', error);
      // Log more detailed error information
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      } else if (typeof error === 'object' && error !== null) {
        console.error('Error details:', JSON.stringify(error, null, 2));
      }
      
      // Provide more specific error message to user
      let errorMessage = 'Failed to perform bulk action';
      if (error instanceof Error) {
        errorMessage = `Failed to perform bulk action: ${error.message}`;
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = `Failed to perform bulk action: ${(error as any).message}`;
      }
      
      toast.error(errorMessage);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Accounts</h1>
          <p className="text-gray-600 mt-1">Manage customer accounts</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={openCreateModal}
            className="btn btn-primary flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Account
          </button>
        </div>
      </div>

      {/* Bulk Operations Toolbar */}
      {selectedAccounts.length > 0 && (
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-800">
                {selectedAccounts.length} account{selectedAccounts.length > 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => openBulkModal('freeze')}
                className="btn btn-sm bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
              >
                <Lock className="w-4 h-4 mr-1" />
                Freeze
              </button>
              <button
                onClick={() => openBulkModal('unfreeze')}
                className="btn btn-sm bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
              >
                <LockOpen className="w-4 h-4 mr-1" />
                Unfreeze
              </button>
              <button
                onClick={() => openBulkModal('notify')}
                className="btn btn-sm bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
              >
                <Bell className="w-4 h-4 mr-1" />
                Notify
              </button>
              <button
                onClick={() => openBulkModal('delete')}
                className="btn btn-sm bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </button>
              <button
                onClick={() => setSelectedAccounts([])}
                className="btn btn-sm btn-outline"
              >
                <X className="w-4 h-4 mr-1" />
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by account number, routing number, or customer name..."
              className="form-input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="w-full md:w-48">
            <div className="relative">
              <select
                className="form-input appearance-none pr-10"
                value={accountTypeFilter}
                onChange={(e) => setAccountTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="checking">Checking</option>
                <option value="savings">Savings</option>
                <option value="investment">Investment</option>
                <option value="escrow">Escrow</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-48">
            <div className="relative">
              <select
                className="form-input appearance-none pr-10"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="frozen">Frozen</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Accounts List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedAccounts.length === filteredAccounts.length && filteredAccounts.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Account Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Account Number
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Routing Number
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Balance
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAccounts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    No accounts found
                  </td>
                </tr>
              ) : (
                filteredAccounts.map((account) => (
                  <tr key={account.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedAccounts.includes(account.id)}
                        onChange={(e) => handleAccountSelection(account.id, e.target.checked)}
                        className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {getUserName(account.user_id)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {getUserEmail(account.user_id)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900 capitalize">
                        {account.account_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      •••• {account.account_number.slice(-4)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {account.routing_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        account.is_frozen
                          ? 'bg-error-100 text-error-800'
                          : 'bg-success-100 text-success-800'
                      }`}>
                        {account.is_frozen ? 'Frozen' : 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => openNotificationModal(account)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Send Notification"
                        >
                          <Bell className="h-4 w-4" />
                          <span className="sr-only">Send Notification</span>
                        </button>
                        <button
                          onClick={() => handleFreezeToggle(account)}
                          className={`${
                            account.is_frozen ? 'text-success-600 hover:text-success-900' : 'text-error-600 hover:text-error-900'
                          }`}
                          title={account.is_frozen ? 'Unfreeze' : 'Freeze'}
                        >
                          {account.is_frozen ? <LockOpen className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                          <span className="sr-only">
                            {account.is_frozen ? 'Unfreeze' : 'Freeze'}
                          </span>
                        </button>
                        <button
                          onClick={() => openEditModal(account)}
                          className="text-primary-600 hover:text-primary-900"
                          title="Edit Account"
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Account Edit/Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {isCreating ? 'Create New Account' : 'Edit Account'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isCreating && (
                <div>
                  <label htmlFor="user_id" className="form-label">
                    Customer
                  </label>
                  <select
                    id="user_id"
                    name="user_id"
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className="form-input"
                    required
                  >
                    <option value="">Select a customer</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.first_name} {user.last_name} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label htmlFor="account_type" className="form-label">
                  Account Type
                </label>
                <select
                  id="account_type"
                  name="account_type"
                  value={formData.account_type || 'checking'}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                >
                  <option value="checking">Checking</option>
                  <option value="savings">Savings</option>
                  <option value="investment">Investment</option>
                  <option value="escrow">Escrow</option>
                </select>
              </div>

              <div>
                <label htmlFor="account_number" className="form-label">
                  Account Number
                </label>
                <input
                  id="account_number"
                  name="account_number"
                  type="text"
                  value={formData.account_number || ''}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder={isCreating ? 'Will be auto-generated if left blank' : ''}
                />
              </div>

              <div>
                <label htmlFor="routing_number" className="form-label">
                  Routing Number
                </label>
                <input
                  id="routing_number"
                  name="routing_number"
                  type="text"
                  value={formData.routing_number || ''}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder={isCreating ? 'Default: 074000078' : ''}
                />
              </div>

              <div>
                <label htmlFor="balance" className="form-label">
                  Balance
                </label>
                <input
                  id="balance"
                  name="balance"
                  type="number"
                  step="0.01"
                  value={formData.balance !== undefined ? formData.balance : ''}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    id="is_frozen"
                    name="is_frozen"
                    type="checkbox"
                    checked={formData.is_frozen || false}
                    onChange={(e) => setFormData({ ...formData, is_frozen: e.target.checked })}
                    className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="is_frozen" className="ml-2 block text-sm text-gray-900">
                    Freeze Account
                  </label>
                </div>
                
              </div>

              {!isCreating && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mt-4">
                  <div className="flex">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                    <div>
                      <h3 className="text-sm font-medium text-yellow-800">Important Information</h3>
                      <div className="mt-1 text-sm text-yellow-700">
                        <p>Changing the balance will create a transaction record and notify the customer.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-4 border-t border-gray-200">
                {!isCreating && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="btn bg-error-50 text-error-700 hover:bg-error-100 border border-error-200 flex items-center"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                )}
                <div className="flex space-x-3 ml-auto">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary flex items-center">
                    <Check className="w-4 h-4 mr-2" />
                    {isCreating ? 'Create Account' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notification Modal */}
      {isNotificationModalOpen && selectedAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Send Notification</h2>
              <button
                onClick={closeNotificationModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>To:</strong> {getUserName(selectedAccount.user_id)} ({getUserEmail(selectedAccount.user_id)})
              </p>
              <p className="text-sm text-gray-600">
                <strong>Account:</strong> {selectedAccount.account_type} ending in {selectedAccount.account_number.slice(-4)}
              </p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSendNotification(); }} className="space-y-4">
              <div>
                <label htmlFor="notification_title" className="form-label">
                  Title
                </label>
                <input
                  id="notification_title"
                  type="text"
                  value={notificationData.title}
                  onChange={(e) => setNotificationData({ ...notificationData, title: e.target.value })}
                  className="form-input"
                  required
                  placeholder="Notification title"
                />
              </div>

              <div>
                <label htmlFor="notification_type" className="form-label">
                  Type
                </label>
                <select
                  id="notification_type"
                  value={notificationData.type}
                  onChange={(e) => setNotificationData({ ...notificationData, type: e.target.value as any })}
                  className="form-input"
                >
                  <option value="info">Information</option>
                  <option value="warning">Warning</option>
                  <option value="success">Success</option>
                  <option value="error">Error</option>
                </select>
              </div>

              <div>
                <label htmlFor="notification_message" className="form-label">
                  Message
                </label>
                <textarea
                  id="notification_message"
                  value={notificationData.message}
                  onChange={(e) => setNotificationData({ ...notificationData, message: e.target.value })}
                  className="form-input"
                  rows={4}
                  required
                  placeholder="Notification message"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeNotificationModal}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary flex items-center">
                  <Bell className="w-4 h-4 mr-2" />
                  Send Notification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Operations Modal */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {bulkAction === 'freeze' && 'Freeze Accounts'}
                {bulkAction === 'unfreeze' && 'Unfreeze Accounts'}
                {bulkAction === 'delete' && 'Delete Accounts'}
                {bulkAction === 'notify' && 'Send Notifications'}
              </h2>
              <button
                onClick={closeBulkModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                <div>
                  <h3 className="text-sm font-medium text-yellow-800">Confirm Action</h3>
                  <div className="mt-1 text-sm text-yellow-700">
                    {bulkAction === 'freeze' && `This will freeze ${selectedAccounts.length} account(s). Users will not be able to unfreeze these accounts.`}
                    {bulkAction === 'unfreeze' && `This will unfreeze ${selectedAccounts.length} account(s).`}
                    {bulkAction === 'delete' && `This will permanently delete ${selectedAccounts.length} account(s). This action cannot be undone.`}
                    {bulkAction === 'notify' && `This will send a notification to ${selectedAccounts.length} account holder(s).`}
                  </div>
                </div>
              </div>
            </div>

            {bulkAction === 'notify' && (
              <div className="space-y-4 mb-4">
                <div>
                  <label htmlFor="bulk_notification_title" className="form-label">
                    Title
                  </label>
                  <input
                    id="bulk_notification_title"
                    type="text"
                    value={notificationData.title}
                    onChange={(e) => setNotificationData({ ...notificationData, title: e.target.value })}
                    className="form-input"
                    required
                    placeholder="Notification title"
                  />
                </div>

                <div>
                  <label htmlFor="bulk_notification_type" className="form-label">
                    Type
                  </label>
                  <select
                    id="bulk_notification_type"
                    value={notificationData.type}
                    onChange={(e) => setNotificationData({ ...notificationData, type: e.target.value as any })}
                    className="form-input"
                  >
                    <option value="info">Information</option>
                    <option value="warning">Warning</option>
                    <option value="success">Success</option>
                    <option value="error">Error</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="bulk_notification_message" className="form-label">
                    Message
                  </label>
                  <textarea
                    id="bulk_notification_message"
                    value={notificationData.message}
                    onChange={(e) => setNotificationData({ ...notificationData, message: e.target.value })}
                    className="form-input"
                    rows={4}
                    required
                    placeholder="Notification message"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={closeBulkModal}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkAction}
                className={`btn flex items-center ${
                  bulkAction === 'delete' 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'btn-primary'
                }`}
              >
                {bulkAction === 'freeze' && <Lock className="w-4 h-4 mr-2" />}
                {bulkAction === 'unfreeze' && <LockOpen className="w-4 h-4 mr-2" />}
                {bulkAction === 'delete' && <Trash2 className="w-4 h-4 mr-2" />}
                {bulkAction === 'notify' && <Bell className="w-4 h-4 mr-2" />}
                {bulkAction === 'freeze' && 'Freeze Accounts'}
                {bulkAction === 'unfreeze' && 'Unfreeze Accounts'}
                {bulkAction === 'delete' && 'Delete Accounts'}
                {bulkAction === 'notify' && 'Send Notifications'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAccounts;