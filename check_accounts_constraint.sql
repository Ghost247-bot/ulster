-- Check the accounts_account_type_check constraint
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conname = 'accounts_account_type_check';

-- Check what account_type values currently exist in the accounts table
SELECT 
    account_type,
    COUNT(*) as count
FROM accounts 
GROUP BY account_type
ORDER BY count DESC;

-- Check the table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'accounts' 
AND column_name = 'account_type';

-- Check all constraints on the accounts table
SELECT 
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'accounts'::regclass;
