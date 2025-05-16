import { DollarSign, Lock } from 'lucide-react';

interface AccountCardProps {
  id: number;
  type: string;
  accountNumber: string;
  balance: number;
  isFrozen: boolean;
  onClick?: () => void;
}

const AccountCard = ({ id, type, accountNumber, balance, isFrozen, onClick }: AccountCardProps) => {
  return (
    <div
      className={`card card-hover transition-all duration-300 cursor-pointer ${isFrozen ? 'opacity-70' : ''}`}
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${type} account ending in ${accountNumber.slice(-4)}`}
      onKeyPress={e => { if (e.key === 'Enter' || e.key === ' ') onClick && onClick(); }}
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isFrozen ? 'bg-gray-200' : 'bg-primary-100'}`}>
              <DollarSign className={`w-6 h-6 ${isFrozen ? 'text-gray-500' : 'text-primary-600'}`} />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 capitalize flex items-center">
                {type} Account
                {isFrozen && (
                  <Lock className="w-4 h-4 ml-2 text-error-500" />
                )}
              </h3>
              <p className="text-sm text-gray-500">
                Account ending in {accountNumber.slice(-4)}
              </p>
            </div>
          </div>
          
          <div className={`text-right ${isFrozen ? 'text-gray-500' : 'text-gray-900'}`}>
            <p className="text-2xl font-bold">
              ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-gray-500">Available balance</p>
          </div>
        </div>
        
        {isFrozen && (
          <div className="mt-4 bg-error-50 text-error-700 text-sm p-2 rounded border border-error-200 flex items-center">
            <Lock className="w-4 h-4 mr-2" />
            This account is currently frozen
          </div>
        )}
        <div className="mt-4 flex justify-end">
          <button
            className="btn btn-outline btn-sm"
            onClick={e => { e.stopPropagation(); onClick && onClick(); }}
          >
            Actions
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountCard;