import { format } from 'date-fns';
import { DollarSign } from 'lucide-react';

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
}

const TransactionList = ({ 
  transactions, 
  accountMap = {}, 
  showAccountName = false 
}: TransactionListProps) => {
  return (
    <div className="divide-y divide-gray-200">
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
            <div key={transaction.id} className="py-4 px-6 flex items-center justify-between hover:bg-gray-50">
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
                  <div className="flex text-sm text-gray-500 space-x-2">
                    <span>{formattedDate}</span>
                    <span>•</span>
                    <span>{formattedTime}</span>
                    {showAccountName && accountMap[transaction.account_id] && (
                      <>
                        <span>•</span>
                        <span className="capitalize">{accountMap[transaction.account_id]}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
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
                <p className="text-xs text-gray-500 capitalize">
                  {transaction.transaction_type}
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