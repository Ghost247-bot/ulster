import { useState, useRef, useEffect } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, X, Download } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface TransactionData {
  account_id: number;
  amount: number;
  description: string;
  transaction_type: 'deposit' | 'withdrawal' | 'transfer';
  created_at: string;
}

interface ValidationError {
  row: number;
  field: string;
  message: string;
}

interface UploadResult {
  success: boolean;
  processed: number;
  errors: ValidationError[];
  message: string;
}

const BulkTransactionUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [previewData, setPreviewData] = useState<TransactionData[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [accounts, setAccounts] = useState<Array<{id: number, account_number: string, account_type: string, user_id: string}>>([]);
  const [users, setUsers] = useState<Array<{id: string, first_name: string, last_name: string, email: string}>>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);
  const [processingProgress, setProcessingProgress] = useState<{current: number, total: number}>({current: 0, total: 0});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load accounts and users data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [accountsRes, usersRes] = await Promise.all([
          supabase.from('accounts').select('id, account_number, account_type, user_id'),
          supabase.from('profiles').select('id, first_name, last_name, email')
        ]);

        if (accountsRes.error) throw accountsRes.error;
        if (usersRes.error) throw usersRes.error;

        setAccounts(accountsRes.data || []);
        setUsers(usersRes.data || []);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load accounts and users data');
      }
    };

    loadData();
  }, []);

  const getAccountsForUser = (userId: string) => {
    return accounts.filter(account => account.user_id === userId);
  };

  const parseCSV = (csvText: string): TransactionData[] => {
    const lines = csvText.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    const data: TransactionData[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const row: any = {};
      
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      
      // Map CSV columns to our transaction structure
      const transaction: TransactionData = {
        account_id: parseInt(row.account_id || row.accountid || selectedAccountId?.toString() || '0'),
        amount: parseFloat(row.amount || '0'),
        description: row.description || row.desc || '',
        transaction_type: (row.transaction_type || row.type || 'deposit').toLowerCase() as 'deposit' | 'withdrawal' | 'transfer',
        created_at: row.created_at || row.date || new Date().toISOString()
      };
      
      data.push(transaction);
    }
    
    return data;
  };

  const parseJSON = (jsonText: string): TransactionData[] => {
    try {
      const data = JSON.parse(jsonText);
      const transactions = Array.isArray(data) ? data : [data];
      
      // If account_id is not provided in JSON, use selected account
      return transactions.map(transaction => ({
        ...transaction,
        account_id: transaction.account_id || selectedAccountId || 0
      }));
    } catch (error) {
      throw new Error('Invalid JSON format');
    }
  };

  const validateTransaction = (transaction: TransactionData, index: number): ValidationError[] => {
    const errors: ValidationError[] = [];
    
    // Validate account_id
    if (!transaction.account_id || isNaN(transaction.account_id) || transaction.account_id === 0) {
      if (!selectedAccountId) {
        errors.push({
          row: index + 1,
          field: 'account_id',
          message: 'Account ID is required. Either specify it in the file or select a user account above.'
        });
      } else {
        // Use selected account if no account_id provided
        transaction.account_id = selectedAccountId;
      }
    } else {
      const accountExists = accounts.find(acc => acc.id === transaction.account_id);
      if (!accountExists) {
        errors.push({
          row: index + 1,
          field: 'account_id',
          message: `Account ID ${transaction.account_id} does not exist`
        });
      }
    }
    
    // Validate amount
    if (!transaction.amount || isNaN(transaction.amount) || transaction.amount <= 0) {
      errors.push({
        row: index + 1,
        field: 'amount',
        message: 'Amount is required and must be a positive number'
      });
    }
    
    // Validate description
    if (!transaction.description || transaction.description.trim() === '') {
      errors.push({
        row: index + 1,
        field: 'description',
        message: 'Description is required'
      });
    }
    
    // Validate transaction_type
    const validTypes = ['deposit', 'withdrawal', 'transfer'];
    if (!validTypes.includes(transaction.transaction_type)) {
      errors.push({
        row: index + 1,
        field: 'transaction_type',
        message: `Transaction type must be one of: ${validTypes.join(', ')}`
      });
    }
    
    // Validate created_at
    if (transaction.created_at) {
      const date = new Date(transaction.created_at);
      if (isNaN(date.getTime())) {
        errors.push({
          row: index + 1,
          field: 'created_at',
          message: 'Invalid date format'
        });
      }
    }
    
    return errors;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    if (!['csv', 'json', 'txt'].includes(fileExtension || '')) {
      toast.error('Please upload a CSV, JSON, or TXT file');
      return;
    }

    try {
      const text = await file.text();
      let parsedData: TransactionData[] = [];

      if (fileExtension === 'csv' || fileExtension === 'txt') {
        parsedData = parseCSV(text);
      } else if (fileExtension === 'json') {
        parsedData = parseJSON(text);
      }

      // Validate all transactions
      const allErrors: ValidationError[] = [];
      parsedData.forEach((transaction, index) => {
        const errors = validateTransaction(transaction, index);
        allErrors.push(...errors);
      });

      if (allErrors.length > 0) {
        setUploadResult({
          success: false,
          processed: 0,
          errors: allErrors,
          message: `Found ${allErrors.length} validation errors`
        });
        setPreviewData([]);
        setShowPreview(false);
        return;
      }

      setPreviewData(parsedData);
      setShowPreview(true);
      setUploadResult(null);
      toast.success(`Successfully parsed ${parsedData.length} transactions`);

    } catch (error) {
      console.error('Error parsing file:', error);
      toast.error('Error parsing file. Please check the format.');
    }
  };

  const processTransactions = async () => {
    if (previewData.length === 0) return;

    setIsUploading(true);
    setUploadResult(null);

    // Add timeout to prevent hanging
    const timeoutId = setTimeout(() => {
      console.error('Transaction processing timed out');
      setIsUploading(false);
      setUploadResult({
        success: false,
        processed: 0,
        errors: [{
          row: 0,
          field: 'general',
          message: 'Processing timed out. Please try again with a smaller batch.'
        }],
        message: 'Processing timed out'
      });
      toast.error('Processing timed out. Please try again.');
    }, 60000); // 60 second timeout

    try {
      // Check authentication
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        throw new Error('You must be logged in to perform this action');
      }

      // Check if user is admin
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', session.user.id)
        .single();

      if (profileError || !profile?.is_admin) {
        throw new Error('You do not have permission to perform this action');
      }

      console.log(`Starting to process ${previewData.length} transactions...`);

      let successCount = 0;
      const errors: ValidationError[] = [];

      // Initialize progress
      setProcessingProgress({current: 0, total: previewData.length});

      // Process transactions one by one with proper error handling
      for (let transactionIndex = 0; transactionIndex < previewData.length; transactionIndex++) {
        const transaction = previewData[transactionIndex];
        
        // Update progress
        setProcessingProgress({current: transactionIndex + 1, total: previewData.length});
        
        // Log progress every 10 transactions
        if (transactionIndex % 10 === 0) {
          console.log(`Processing transaction ${transactionIndex + 1} of ${previewData.length}...`);
        }
        
        try {
          // Get account info to update balance
          const { data: accountData, error: accountError } = await supabase
            .from('accounts')
            .select('balance, user_id, is_frozen')
            .eq('id', transaction.account_id)
            .single();
          
          if (accountError) {
            errors.push({
              row: transactionIndex + 1,
              field: 'account_id',
              message: `Account not found: ${accountError.message}`
            });
            continue;
          }

          // Check if account is frozen
          if (accountData.is_frozen) {
            errors.push({
              row: transactionIndex + 1,
              field: 'account_id',
              message: 'Cannot process transactions for a frozen account'
            });
            continue;
          }
          
          // Calculate new balance
          let newBalance = accountData.balance;
          if (transaction.transaction_type === 'deposit') {
            newBalance += transaction.amount;
          } else if (transaction.transaction_type === 'withdrawal') {
            newBalance -= transaction.amount;
          }
          
          // Create transaction
          const { error: insertError } = await supabase
            .from('transactions')
            .insert({
              ...transaction,
              created_at: transaction.created_at ? new Date(transaction.created_at).toISOString() : new Date().toISOString()
            });

          if (insertError) {
            errors.push({
              row: transactionIndex + 1,
              field: 'general',
              message: `Database error: ${insertError.message}`
            });
            continue;
          }
          
          // Update account balance
          const { error: updateError } = await supabase
            .from('accounts')
            .update({ balance: newBalance })
            .eq('id', transaction.account_id);
            
          if (updateError) {
            errors.push({
              row: transactionIndex + 1,
              field: 'balance',
              message: `Failed to update account balance: ${updateError.message}`
            });
            continue;
          }
          
          // Create notification (don't fail the transaction if this fails)
          try {
            await supabase.from('notifications').insert({
              user_id: accountData.user_id,
              title: `New ${transaction.transaction_type} Transaction`,
              message: `A ${transaction.transaction_type} of $${transaction.amount.toFixed(2)} has been applied to your account: ${transaction.description}`
            });
          } catch (notificationError) {
            console.warn('Failed to create notification:', notificationError);
            // Don't fail the transaction for notification errors
          }

          successCount++;
        } catch (error) {
          errors.push({
            row: transactionIndex + 1,
            field: 'general',
            message: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`
          });
        }

        // Small delay to prevent overwhelming the database and show progress
        if (transactionIndex < previewData.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay
        }
      }

      console.log(`Processing completed. Success: ${successCount}, Errors: ${errors.length}`);

      setUploadResult({
        success: errors.length === 0,
        processed: successCount,
        errors,
        message: `Processed ${successCount} transactions successfully${errors.length > 0 ? `, ${errors.length} failed` : ''}`
      });

      if (successCount > 0) {
        toast.success(`Successfully processed ${successCount} transactions`);
      }
      if (errors.length > 0) {
        toast.error(`${errors.length} transactions failed to process`);
      }

    } catch (error) {
      console.error('Error processing transactions:', error);
      setUploadResult({
        success: false,
        processed: 0,
        errors: [{
          row: 0,
          field: 'general',
          message: error instanceof Error ? error.message : 'Unknown error occurred'
        }],
        message: 'Failed to process transactions'
      });
      toast.error('Failed to process transactions');
    } finally {
      console.log('Setting isUploading to false');
      clearTimeout(timeoutId);
      setIsUploading(false);
    }
  };

  const downloadTemplate = () => {
    const template = [
      'account_id,amount,description,transaction_type,created_at',
      '1,100.00,Initial deposit,deposit,2024-01-15',
      ',50.00,ATM withdrawal,withdrawal,2024-01-16',
      ',250.00,Transfer from savings,transfer,2024-01-17'
    ].join('\n');

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transaction_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const resetUpload = () => {
    setPreviewData([]);
    setShowPreview(false);
    setUploadResult(null);
    setSelectedUserId('');
    setSelectedAccountId(null);
    setProcessingProgress({current: 0, total: 0});
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getAccountInfo = (accountId: number) => {
    const account = accounts.find(acc => acc.id === accountId);
    if (!account) return 'Unknown Account';
    
    const user = users.find(u => u.id === account.user_id);
    const userName = user ? `${user.first_name} ${user.last_name}` : 'Unknown User';
    
    return `${account.account_type} (${account.account_number.slice(-4)}) - ${userName}`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Bulk Transaction Upload</h2>
            <p className="text-gray-600 mt-1">Upload CSV or JSON files to create multiple transactions</p>
          </div>
          <button
            onClick={downloadTemplate}
            className="btn btn-outline flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Template
          </button>
        </div>

        {/* User and Account Selection */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Select User Account (Optional)</h3>
          <p className="text-sm text-gray-600 mb-4">
            Select a user and account to apply to all transactions. If you don't select an account, 
            you must include account_id in your CSV/JSON file.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="user-select" className="form-label">
                Select User
              </label>
              <select
                id="user-select"
                value={selectedUserId}
                onChange={(e) => {
                  setSelectedUserId(e.target.value);
                  setSelectedAccountId(null); // Reset account selection when user changes
                }}
                className="form-input"
              >
                <option value="">Choose a user...</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.first_name} {user.last_name} ({user.email})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="account-select" className="form-label">
                Select Account
              </label>
              <select
                id="account-select"
                value={selectedAccountId || ''}
                onChange={(e) => setSelectedAccountId(e.target.value ? Number(e.target.value) : null)}
                className="form-input"
                disabled={!selectedUserId}
              >
                <option value="">Choose an account...</option>
                {selectedUserId && getAccountsForUser(selectedUserId).map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.account_type} ({account.account_number.slice(-4)})
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {selectedAccountId && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-700">
                <strong>Selected Account:</strong> {getAccountInfo(selectedAccountId)}
              </p>
            </div>
          )}
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-900">Upload Transaction File</p>
            <p className="text-sm text-gray-500">
              Supports CSV, JSON, and TXT files. Maximum file size: 10MB
            </p>
            <div className="mt-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.json,.txt"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="btn btn-primary cursor-pointer"
              >
                <FileText className="w-4 h-4 mr-2" />
                Choose File
              </label>
            </div>
          </div>
        </div>

        {/* File Format Instructions */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">File Format Requirements:</h3>
          <div className="text-sm text-blue-700 space-y-1">
            <p><strong>CSV Format:</strong> account_id (optional), amount, description, transaction_type, created_at</p>
            <p><strong>JSON Format:</strong> Array of objects with the same fields</p>
            <p><strong>Transaction Types:</strong> deposit, withdrawal, transfer</p>
            <p><strong>Date Format:</strong> YYYY-MM-DD or ISO 8601</p>
            <p><strong>Note:</strong> If account_id is not provided in the file, you must select a user account above.</p>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      {showPreview && previewData.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">
              Preview ({previewData.length} transactions)
            </h3>
            <div className="space-x-2">
              <button
                onClick={resetUpload}
                className="btn btn-outline"
                disabled={isUploading}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </button>
              <button
                onClick={processTransactions}
                disabled={isUploading}
                className="btn btn-primary"
              >
                {isUploading ? 'Processing...' : 'Process Transactions'}
              </button>
            </div>
          </div>

          {/* Progress Indicator */}
          {isUploading && (
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Processing transactions...</span>
                <span>{processingProgress.current} of {processingProgress.total}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${processingProgress.total > 0 ? (processingProgress.current / processingProgress.total) * 100 : 0}%` 
                  }}
                ></div>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Account
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {previewData.map((transaction, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getAccountInfo(transaction.account_id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span className={
                        transaction.transaction_type === 'deposit'
                          ? 'text-success-600'
                          : transaction.transaction_type === 'withdrawal'
                            ? 'text-error-600'
                            : 'text-primary-600'
                      }>
                        {transaction.transaction_type === 'deposit' ? '+' : transaction.transaction_type === 'withdrawal' ? '-' : '↔'}
                        ${transaction.amount.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.transaction_type === 'deposit'
                          ? 'bg-success-100 text-success-800'
                          : transaction.transaction_type === 'withdrawal'
                            ? 'bg-error-100 text-error-800'
                            : 'bg-primary-100 text-primary-800'
                      }`}>
                        {transaction.transaction_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {transaction.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Results Section */}
      {uploadResult && (
        <div className={`rounded-lg shadow-md p-6 ${
          uploadResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center mb-4">
            {uploadResult.success ? (
              <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
            ) : (
              <AlertCircle className="w-6 h-6 text-red-600 mr-2" />
            )}
            <h3 className={`text-lg font-bold ${
              uploadResult.success ? 'text-green-800' : 'text-red-800'
            }`}>
              Upload Results
            </h3>
          </div>
          
          <p className={`mb-4 ${
            uploadResult.success ? 'text-green-700' : 'text-red-700'
          }`}>
            {uploadResult.message}
          </p>

          {uploadResult.errors.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-red-800">Errors:</h4>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {uploadResult.errors.map((error, index) => (
                  <div key={index} className="text-sm text-red-700 bg-red-100 p-2 rounded">
                    <strong>Row {error.row}:</strong> {error.field} - {error.message}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4">
            <button
              onClick={resetUpload}
              className="btn btn-outline"
            >
              Upload Another File
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkTransactionUpload;
