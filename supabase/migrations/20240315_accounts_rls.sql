-- Enable RLS on accounts table
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

-- Create policy for admin users to have full access
CREATE POLICY "Admin users have full access to accounts"
ON accounts
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- Create policy for regular users to view their own accounts
CREATE POLICY "Users can view their own accounts"
ON accounts
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid()
);

-- Create policy for regular users to insert their own accounts
CREATE POLICY "Users can insert their own accounts"
ON accounts
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid()
);

-- Create policy for regular users to update their own accounts
CREATE POLICY "Users can update their own accounts"
ON accounts
FOR UPDATE
TO authenticated
USING (
  user_id = auth.uid()
)
WITH CHECK (
  user_id = auth.uid()
);

-- Create policy for regular users to delete their own accounts
CREATE POLICY "Users can delete their own accounts"
ON accounts
FOR DELETE
TO authenticated
USING (
  user_id = auth.uid()
); 