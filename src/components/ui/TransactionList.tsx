import { format } from 'date-fns';
import { DollarSign, ArrowUp, ArrowDown } from 'lucide-react';

interface Transaction {
  id: number;
  account_id: number;
  amount: number;
  description: string;
  transaction_type: string;
  created_at: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  accountMap?: Record<number, string>;
  showAccountName?: boolean;
  onSort?: (key: keyof Transaction) => void;
  sortConfig?: {
    key: keyof Transaction;
    direction: 'asc' | 'desc';
  };
}

const TransactionList = ({ 
  transactions, 
  accountMap = {}, 
  showAccountName = false,
  onSort,
  sortConfig
}: TransactionListProps) => {
  const renderSortIcon = (key: keyof Transaction) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? 
      <ArrowUp className="w-4 h-4 ml-1" /> : 
      <ArrowDown className="w-4 h-4 ml-1" />;
  };

  const handleSort = (key: keyof Transaction) => {
    if (onSort) onSort(key);
  };

  return (
    <div className="divide-y divide-gray-200">
      {/* Header Row */}
      <div className="py-3 px-6 bg-gray-50 grid grid-cols-12 gap-4 text-sm font-medium text-gray-500">
        <div className="col-span-5 flex items-center cursor-pointer" onClick={() => handleSort('description')}>
          Description
          {renderSortIcon('description')}
        </div>
        <div className="col-span-3 flex items-center cursor-pointer" onClick={() => handleSort('created_at')}>
          Date
          {renderSortIcon('created_at')}
        </div>
        <div className="col-span-2 flex items-center cursor-pointer" onClick={() => handleSort('transaction_type')}>
          Type
          {renderSortIcon('transaction_type')}
        </div>
        <div className="col-span-2 text-right flex items-center justify-end cursor-pointer" onClick={() => handleSort('amount')}>
          Amount
          {renderSortIcon('amount')}
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="py-6 text-center text-gray-500">
          No transactions to display
        </div>
      ) : (
        transactions.map((transaction) => {
          const isDeposit = transaction.transaction_type === 'deposit';
          const isTransfer = transaction.transaction_type === 'transfer';
          const formattedDate = format(new Date(transaction.created_at), 'MMM d, yyyy');
          const formattedTime = format(new Date(transaction.created_at), 'h:mm a');
          
          return (
            <div key={transaction.id} className="py-4 px-6 grid grid-cols-12 gap-4 items-center hover:bg-gray-50">
              <div className="col-span-5">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isDeposit 
                      ? 'bg-success-100' 
                      : isTransfer 
                        ? 'bg-primary-100' 
                        : 'bg-error-100'
                  }`}>
                    <DollarSign className={`w-5 h-5 ${
                      isDeposit 
                        ? 'text-success-600' 
                        : isTransfer 
                          ? 'text-primary-600' 
                          : 'text-error-600'
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    {showAccountName && accountMap[transaction.account_id] && (
                      <p className="text-sm text-gray-500 capitalize">
                        {accountMap[transaction.account_id]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-span-3">
                <div className="text-sm text-gray-500">
                  <div>{formattedDate}</div>
                  <div>{formattedTime}</div>
                </div>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500 capitalize">
                  {transaction.transaction_type}
                </p>
              </div>
              <div className="col-span-2 text-right">
                <p className={`font-semibold ${
                  isDeposit 
                    ? 'text-success-600' 
                    : isTransfer 
                      ? 'text-primary-600' 
                      : 'text-error-600'
                }`}>
                  {isDeposit ? '+' : isTransfer ? '↔' : '-'}
                  ${Math.abs(transaction.amount).toLocaleString('en-US', { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })}
                </p>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default TransactionList;