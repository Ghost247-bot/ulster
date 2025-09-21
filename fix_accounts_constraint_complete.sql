-- Complete fix for accounts_account_type_check constraint
-- This script handles both the constraint and any existing invalid data

-- Step 1: Check what account_type values currently exist
SELECT 
    account_type,
    COUNT(*) as count
FROM accounts 
GROUP BY account_type
ORDER BY count DESC;

-- Step 2: Identify any invalid account_type values
-- (This will show any values that are not in our expected list)
SELECT 
    id,
    account_number,
    account_type,
    user_id
FROM accounts 
WHERE account_type NOT IN ('checking', 'savings', 'investment', 'escrow');

-- Step 3: Fix any invalid account_type values
-- Update any invalid values to 'checking' (you can change this to another valid type if needed)
UPDATE accounts 
SET account_type = 'checking'
WHERE account_type NOT IN ('checking', 'savings', 'investment', 'escrow');

-- Step 4: Drop the existing constraint if it exists
ALTER TABLE accounts DROP CONSTRAINT IF EXISTS accounts_account_type_check;

-- Step 5: Add the correct constraint
ALTER TABLE accounts ADD CONSTRAINT accounts_account_type_check 
CHECK (account_type IN ('checking', 'savings', 'investment', 'escrow'));

-- Step 6: Verify the constraint was created correctly
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conname = 'accounts_account_type_check';

-- Step 7: Verify all account_type values are now valid
SELECT 
    account_type,
    COUNT(*) as count
FROM accounts 
GROUP BY account_type
ORDER BY count DESC;

-- Step 8: Test the constraint by trying to insert an invalid value (this should fail)
-- Uncomment the next line to test (it should fail):
-- INSERT INTO accounts (user_id, account_number, routing_number, account_type, balance, is_frozen) 
-- VALUES ('00000000-0000-0000-0000-000000000000', 'TEST123', '123456789', 'invalid_type', 0, false);

-- Add a comment to document the constraint
COMMENT ON CONSTRAINT accounts_account_type_check ON accounts IS 
'Ensures account_type is one of: checking, savings, investment, escrow';
