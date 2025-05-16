-- Enable RLS on transactions table
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Admin users have full access to transactions" ON transactions;
DROP POLICY IF EXISTS "Users can view their own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can insert their own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can update their own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can delete their own transactions" ON transactions;

-- Create policy for admin users to have full access
CREATE POLICY "Admin users can select transactions"
ON transactions
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

CREATE POLICY "Admin users can insert transactions"
ON transactions
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

CREATE POLICY "Admin users can update transactions"
ON transactions
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

CREATE POLICY "Admin users can delete transactions"
ON transactions
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- Create policy for regular users to view their own transactions
CREATE POLICY "Users can view their own transactions"
ON transactions
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM accounts
    WHERE accounts.id = transactions.account_id
    AND accounts.user_id = auth.uid()
  )
);

-- Create policy for regular users to insert their own transactions
CREATE POLICY "Users can insert their own transactions"
ON transactions
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM accounts
    WHERE accounts.id = transactions.account_id
    AND accounts.user_id = auth.uid()
  )
);

-- Create policy for regular users to update their own transactions
CREATE POLICY "Users can update their own transactions"
ON transactions
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM accounts
    WHERE accounts.id = transactions.account_id
    AND accounts.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM accounts
    WHERE accounts.id = transactions.account_id
    AND accounts.user_id = auth.uid()
  )
);

-- Create policy for regular users to delete their own transactions
CREATE POLICY "Users can delete their own transactions"
ON transactions
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM accounts
    WHERE accounts.id = transactions.account_id
    AND accounts.user_id = auth.uid()
  )
); 