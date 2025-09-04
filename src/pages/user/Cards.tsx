import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import { CreditCard, PlusCircle, Download, Lock, Unlock, Search, X } from 'lucide-react';
import BankCard from '../../components/ui/BankCard';
import Loading from '../../components/ui/Loading';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import DashboardLayout from '../../components/layout/DashboardLayout';

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
}

interface Account {
  id: number;
  account_type: string;
  account_number: string;
}

const UserCards = () => {
  const { user } = useAuthStore();
  const [cards, setCards] = useState<Card[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCards = async () => {
      if (!user) return;

      try {
        // Fetch cards
        const { data: cardsData, error: cardsError } = await supabase
          .from('cards')
          .select('*')
          .eq('user_id', user.id);

        if (cardsError) throw cardsError;
        setCards(cardsData || []);

        // Fetch accounts for reference
        const { data: accountsData, error: accountsError } = await supabase
          .from('accounts')
          .select('id, account_type, account_number')
          .eq('user_id', user.id);

        if (accountsError) throw accountsError;
        setAccounts(accountsData || []);
      } catch (error) {
        console.error('Error fetching cards:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCards();
  }, [user]);

  const getAccountName = (accountId: number) => {
    const account = accounts.find((a) => a.id === accountId);
    return account ? `${account.account_type} (${account.account_number.slice(-4)})` : 'Unknown Account';
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Enhanced Header Section */}
        <div className="bg-white shadow-sm mb-4 sm:mb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">My Cards</h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1">Manage your debit and credit cards</p>
              </div>
              <div className="w-full sm:w-auto">
                <button className="btn btn-primary flex items-center justify-center w-full sm:w-auto text-sm sm:text-base">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  <span className="hidden xs:inline">Request New Card</span>
                  <span className="xs:hidden">New Card</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {cards.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary-100 text-primary-600 mb-4">
                <CreditCard className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900">No cards yet</h3>
              <p className="mt-1 text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
                You don't have any cards yet. Please contact our customer support to request a card for your account.
              </p>
              <button className="mt-4 btn btn-primary flex items-center mx-auto text-sm sm:text-base">
                <PlusCircle className="w-4 h-4 mr-2" />
                Contact Support
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {cards.map((card) => (
                <div key={card.id} className="space-y-4">
                  <BankCard
                    cardNumber={card.card_number}
                    cardHolderName={card.card_holder_name}
                    expiryDate={card.expiry_date}
                    cardType={card.card_type}
                    isActive={card.is_active}
                  />
                  <div className="bg-white rounded-lg shadow-md p-3 sm:p-4">
                    <h3 className="font-medium text-gray-900 capitalize text-sm sm:text-base">{card.card_type} Card</h3>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1 break-all">
                      Linked to {getAccountName(card.account_id)}
                    </p>
                    
                    {!card.is_active && (
                      <div className="mt-2 bg-error-50 border border-error-100 rounded p-2 text-xs sm:text-sm text-error-800">
                        This card is currently deactivated. Please contact support to reactivate it.
                      </div>
                    )}
                    
                    <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col xs:flex-row gap-2">
                      <button className="btn btn-outline text-xs sm:text-sm py-1 hover:bg-primary-50 hover:text-primary-600 flex-1">
                        View Details
                      </button>
                      {card.is_active && (
                        <button className="btn text-xs sm:text-sm py-1 bg-error-50 text-error-700 hover:bg-error-100 border border-error-200 flex-1">
                          Report Lost
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserCards;