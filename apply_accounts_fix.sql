-- Apply the accounts constraint fix directly
-- This script fixes the accounts_account_type_check constraint

-- Step 1: Check current constraint
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conname = 'accounts_account_type_check';

-- Step 2: Check current account_type values
SELECT 
    account_type,
    COUNT(*) as count
FROM accounts 
GROUP BY account_type
ORDER BY count DESC;

-- Step 3: Fix any invalid account_type values
UPDATE accounts 
SET account_type = 'checking'
WHERE account_type NOT IN ('checking', 'savings', 'investment', 'escrow');

-- Step 4: Drop and recreate the constraint
ALTER TABLE accounts DROP CONSTRAINT IF EXISTS accounts_account_type_check;

ALTER TABLE accounts ADD CONSTRAINT accounts_account_type_check 
CHECK (account_type IN ('checking', 'savings', 'investment', 'escrow'));

-- Step 5: Verify the fix
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conname = 'accounts_account_type_check';

-- Step 6: Verify all account_type values are now valid
SELECT 
    account_type,
    COUNT(*) as count
FROM accounts 
GROUP BY account_type
ORDER BY count DESC;
