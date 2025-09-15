import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { ChevronDown, CreditCard, Edit, Plus, Search, Trash2 } from 'lucide-react';
import BankCard from '../../components/ui/BankCard';
import Loading from '../../components/ui/Loading';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';

interface Card {
  id: number;
  user_id: string;
  account_id: number;
  card_number: string;
  card_type: 'debit' | 'credit';
  expiry_date: string;
  cvv: string;
  card_holder_name: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

interface Account {
  id: number;
  user_id: string;
  account_type: string;
  account_number: string;
}

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

const AdminCards = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [filteredCards, setFilteredCards] = useState<Card[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [cardTypeFilter, setCardTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Card>>({});
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [userAccounts, setUserAccounts] = useState<Account[]>([]);
  const { user, profile } = useAuthStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users
        const { data: usersData, error: usersError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, email');

        if (usersError) throw usersError;
        setUsers(usersData || []);

        // Fetch accounts
        const { data: accountsData, error: accountsError } = await supabase
          .from('accounts')
          .select('id, user_id, account_type, account_number');

        if (accountsError) throw accountsError;
        setAccounts(accountsData || []);

        // Fetch cards
        const { data: cardsData, error: cardsError } = await supabase
          .from('cards')
          .select('*');

        if (cardsError) throw cardsError;
        setCards(cardsData || []);
        setFilteredCards(cardsData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load cards data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = [...cards];
    
    // Search term filter
    if (searchTerm) {
      filtered = filtered.filter(
        (card) =>
          card.card_number.includes(searchTerm) ||
          card.card_holder_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Card type filter
    if (cardTypeFilter !== 'all') {
      filtered = filtered.filter((card) => card.card_type === cardTypeFilter);
    }
    
    // Status filter
    if (statusFilter !== 'all') {
      const isActive = statusFilter === 'active';
      filtered = filtered.filter((card) => card.is_active === isActive);
    }
    
    setFilteredCards(filtered);
  }, [searchTerm, cardTypeFilter, statusFilter, cards]);

  // Effect to update available accounts when user changes
  useEffect(() => {
    if (selectedUserId) {
      const userAccountsList = accounts.filter(account => account.user_id === selectedUserId);
      setUserAccounts(userAccountsList);
      setSelectedAccountId(userAccountsList.length > 0 ? userAccountsList[0].id : null);
    } else {
      setUserAccounts([]);
      setSelectedAccountId(null);
    }
  }, [selectedUserId, accounts]);

  const getUserName = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    return user ? `${user.first_name} ${user.last_name}` : 'Unknown User';
  };

  const getAccountName = (accountId: number) => {
    const account = accounts.find((a) => a.id === accountId);
    return account ? `${account.account_type} (${account.account_number.slice(-4)})` : 'Unknown Account';
  };

  const generateCardDetails = () => {
    // Generate random card number (16 digits)
    const cardNumber = Array(16).fill(0).map(() => Math.floor(Math.random() * 10)).join('');
    
    // Generate expiry date (2 years from now)
    const today = new Date();
    const expiryMonth = String(today.getMonth() + 1).padStart(2, '0');
    const expiryYear = String((today.getFullYear() + 2) % 100).padStart(2, '0');
    const expiryDate = `${expiryMonth}/${expiryYear}`;
    
    // Generate CVV (3 digits)
    const cvv = Array(3).fill(0).map(() => Math.floor(Math.random() * 10)).join('');
    
    return { cardNumber, expiryDate, cvv };
  };

  const toggleCardStatus = async (card: Card) => {
    try {
      const newStatus = !card.is_active;
      
      const { error } = await supabase
        .from('cards')
        .update({ is_active: newStatus })
        .eq('id', card.id);

      if (error) throw error;
      
      // Update local state
      setCards(
        cards.map((c) =>
          c.id === card.id ? { ...c, is_active: newStatus } : c
        )
      );
      
      // Add notification for the user
      await supabase.from('notifications').insert({
        user_id: card.user_id,
        title: newStatus ? 'Card Activated' : 'Card Deactivated',
        message: newStatus
          ? `Your card ending in ${card.card_number.slice(-4)} has been activated.`
          : `Your card ending in ${card.card_number.slice(-4)} has been deactivated for security reasons.`
      });
      
      toast.success(newStatus ? 'Card activated successfully' : 'Card deactivated successfully');
    } catch (error) {
      console.error('Error toggling card status:', error);
      toast.error('Failed to update card status');
    }
  };

  const openEditModal = (card: Card) => {
    setSelectedCard(card);
    setFormData(card);
    setSelectedUserId(card.user_id);
    setSelectedAccountId(card.account_id);
    setIsModalOpen(true);
    setIsCreating(false);
  };

  const openCreateModal = () => {
    setSelectedCard(null);
    const { cardNumber, expiryDate, cvv } = generateCardDetails();
    
    setFormData({
      card_number: cardNumber,
      card_type: 'debit',
      expiry_date: expiryDate,
      cvv: cvv,
      card_holder_name: '',
      is_active: true,
    });
    
    setSelectedUserId(users.length > 0 ? users[0].id : '');
    setIsModalOpen(true);
    setIsCreating(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCard(null);
    setFormData({});
    setSelectedUserId('');
    setSelectedAccountId(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUserId || !selectedAccountId) {
      toast.error('Please select a user and account');
      return;
    }
    
    try {
      // Debug logging
      console.log('Current user:', user);
      console.log('Current profile:', profile);
      console.log('Selected user ID:', selectedUserId);
      console.log('Selected account ID:', selectedAccountId);
      
      // Check if user is admin using the profile from auth store
      if (!profile) {
        console.error('Profile is null');
        toast.error('User profile not loaded. Please try again.');
        return;
      }

      if (!profile.is_admin) {
        console.error('User is not admin:', profile);
        toast.error('You do not have permission to manage cards');
        return;
      }

      if (isCreating) {
        // Set card holder name if not provided
        if (!formData.card_holder_name) {
          const userObj = users.find(u => u.id === selectedUserId);
          if (userObj) {
            formData.card_holder_name = `${userObj.first_name} ${userObj.last_name}`;
          }
        }
        
        const newCard = {
          ...formData,
          user_id: selectedUserId,
          account_id: selectedAccountId,
        };
        
        console.log('Creating new card:', newCard);
        
        // First check if we can access the cards table
        const { data: testData, error: testError } = await supabase
          .from('cards')
          .select('id')
          .limit(1);

        if (testError) {
          console.error('Error accessing cards table:', testError);
          throw testError;
        }

        console.log('Successfully accessed cards table');
        
        const { data, error } = await supabase
          .from('cards')
          .insert(newCard)
          .select();

        if (error) {
          console.error('Error creating card:', error);
          throw error;
        }
        
        console.log('Card created successfully:', data);
        
        // Add notification for the user
        const { error: notificationError } = await supabase.from('notifications').insert({
          user_id: selectedUserId,
          title: 'New Card Added',
          message: `A new ${formData.card_type} card has been added to your account. The card ends in ${formData.card_number?.slice(-4)}.`
        });

        if (notificationError) {
          console.error('Error creating notification:', notificationError);
        }
        
        // Update local state
        setCards([data![0], ...cards]);
        
        toast.success('Card created successfully');
        closeModal();
      } else if (selectedCard) {
        // Only include the fields we want to update
        const updateData = {
          card_type: formData.card_type,
          expiry_date: formData.expiry_date,
          cvv: formData.cvv,
          card_holder_name: formData.card_holder_name,
          is_active: formData.is_active
        };

        const { error } = await supabase
          .from('cards')
          .update(updateData)
          .eq('id', selectedCard.id);

        if (error) throw error;
        
        // Update local state
        setCards(
          cards.map((c) =>
            c.id === selectedCard.id ? { ...c, ...updateData } as Card : c
          )
        );
        
        toast.success('Card updated successfully');
        closeModal();
      }
    } catch (error: any) {
      console.error('Error saving card:', error);
      if (error.code === '42501') {
        toast.error('Permission denied. Please check if you have admin access.');
      } else {
        toast.error(`Failed to save card: ${error.message || 'Unknown error'}`);
      }
    }
  };

  const handleDelete = async () => {
    if (!selectedCard) return;
    
    try {
      const { error } = await supabase
        .from('cards')
        .delete()
        .eq('id', selectedCard.id);

      if (error) throw error;
      
      // Update local state
      setCards(cards.filter((c) => c.id !== selectedCard.id));
      
      // Add notification for the user
      await supabase.from('notifications').insert({
        user_id: selectedCard.user_id,
        title: 'Card Removed',
        message: `Your ${selectedCard.card_type} card ending in ${selectedCard.card_number.slice(-4)} has been removed from your account.`
      });
      
      toast.success('Card deleted successfully');
      closeModal();
    } catch (error) {
      console.error('Error deleting card:', error);
      toast.error('Failed to delete card');
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cards</h1>
          <p className="text-gray-600 mt-1">Manage customer debit and credit cards</p>
        </div>
        <button
          onClick={openCreateModal}
          className="btn btn-primary flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Issue New Card
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by card number or cardholder name..."
              className="form-input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="w-full md:w-48">
            <div className="relative">
              <select
                className="form-input appearance-none pr-10"
                value={cardTypeFilter}
                onChange={(e) => setCardTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="debit">Debit</option>
                <option value="credit">Credit</option>
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
                <option value="inactive">Inactive</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cards List */}
      {filteredCards.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-600 mb-4">
            <CreditCard className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No cards found</h3>
          <p className="mt-1 text-sm text-gray-500 max-w-md mx-auto">
            No cards match your search criteria or there are no cards in the system yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCards.map((card) => (
            <div key={card.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4">
                {/* Card Preview */}
                <BankCard
                  cardNumber={card.card_number}
                  cardHolderName={card.card_holder_name}
                  expiryDate={card.expiry_date}
                  cardType={card.card_type}
                  isActive={card.is_active}
                />
                
                {/* Card Details */}
                <div className="mt-4 space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Customer</p>
                    <p className="font-medium">{getUserName(card.user_id)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Linked Account</p>
                    <p className="font-medium">{getAccountName(card.account_id)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Card Status</p>
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      card.is_active
                        ? 'bg-success-100 text-success-800'
                        : 'bg-error-100 text-error-800'
                    }`}>
                      {card.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="mt-4 pt-4 border-t border-gray-200 flex space-x-2">
                  <button
                    onClick={() => toggleCardStatus(card)}
                    className={`flex-1 btn ${
                      card.is_active 
                        ? 'bg-error-50 text-error-700 hover:bg-error-100 border border-error-200'
                        : 'bg-success-50 text-success-700 hover:bg-success-100 border border-success-200'
                    }`}
                  >
                    {card.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => openEditModal(card)}
                    className="flex-1 btn btn-outline flex items-center justify-center"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Card Edit/Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {isCreating ? 'Issue New Card' : 'Edit Card'}
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
                  disabled={!isCreating}
                >
                  <option value="">Select a customer</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.first_name} {user.last_name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="account_id" className="form-label">
                  Linked Account
                </label>
                <select
                  id="account_id"
                  name="account_id"
                  value={selectedAccountId || ''}
                  onChange={(e) => setSelectedAccountId(Number(e.target.value))}
                  className="form-input"
                  required
                  disabled={!isCreating}
                >
                  <option value="">Select an account</option>
                  {userAccounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.account_type} (ending in {account.account_number.slice(-4)})
                    </option>
                  ))}
                </select>
                {userAccounts.length === 0 && selectedUserId && (
                  <p className="text-xs text-error-600 mt-1">
                    This customer has no accounts. Please create an account first.
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="card_type" className="form-label">
                  Card Type
                </label>
                <select
                  id="card_type"
                  name="card_type"
                  value={formData.card_type || 'debit'}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                >
                  <option value="debit">Debit</option>
                  <option value="credit">Credit</option>
                </select>
              </div>

              <div>
                <label htmlFor="card_number" className="form-label">
                  Card Number
                </label>
                <input
                  id="card_number"
                  name="card_number"
                  type="text"
                  value={formData.card_number || ''}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                  maxLength={16}
                  disabled={!isCreating}
                />
                {isCreating && (
                  <p className="text-xs text-gray-500 mt-1">
                    Auto-generated for security
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expiry_date" className="form-label">
                    Expiry Date (MM/YY)
                  </label>
                  <input
                    id="expiry_date"
                    name="expiry_date"
                    type="text"
                    value={formData.expiry_date || ''}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                </div>
                <div>
                  <label htmlFor="cvv" className="form-label">
                    CVV
                  </label>
                  <input
                    id="cvv"
                    name="cvv"
                    type="text"
                    value={formData.cvv || ''}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                    maxLength={3}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="card_holder_name" className="form-label">
                  Cardholder Name
                </label>
                <input
                  id="card_holder_name"
                  name="card_holder_name"
                  type="text"
                  value={formData.card_holder_name || ''}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
                {isCreating && (
                  <p className="text-xs text-gray-500 mt-1">
                    Defaults to customer's name if left blank
                  </p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  id="is_active"
                  name="is_active"
                  type="checkbox"
                  checked={formData.is_active || false}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                  Card Active
                </label>
              </div>

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
                  <button type="submit" className="btn btn-primary">
                    {isCreating ? 'Issue Card' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCards;