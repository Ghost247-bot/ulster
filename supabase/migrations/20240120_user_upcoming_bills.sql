-- Create user_upcoming_bills table
CREATE TABLE IF NOT EXISTS user_upcoming_bills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  due_date DATE NOT NULL,
  category TEXT NOT NULL,
  is_paid BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_user_upcoming_bills_user_id ON user_upcoming_bills(user_id);
CREATE INDEX IF NOT EXISTS idx_user_upcoming_bills_active ON user_upcoming_bills(is_active);
CREATE INDEX IF NOT EXISTS idx_user_upcoming_bills_due_date ON user_upcoming_bills(due_date);

-- Enable RLS
ALTER TABLE user_upcoming_bills ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own upcoming bills" ON user_upcoming_bills
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all upcoming bills" ON user_upcoming_bills
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert upcoming bills" ON user_upcoming_bills
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update upcoming bills" ON user_upcoming_bills
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete upcoming bills" ON user_upcoming_bills
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_upcoming_bills_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_user_upcoming_bills_updated_at
  BEFORE UPDATE ON user_upcoming_bills
  FOR EACH ROW
  EXECUTE FUNCTION update_user_upcoming_bills_updated_at();

-- Insert default upcoming bills for existing users
INSERT INTO user_upcoming_bills (user_id, name, amount, due_date, category, display_order)
SELECT 
  u.id,
  'Electric Bill',
  125.50,
  '2024-01-20',
  'Utilities',
  1
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM user_upcoming_bills uub WHERE uub.user_id = u.id
);

INSERT INTO user_upcoming_bills (user_id, name, amount, due_date, category, display_order)
SELECT 
  u.id,
  'Internet Bill',
  79.99,
  '2024-01-22',
  'Utilities',
  2
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM user_upcoming_bills uub WHERE uub.user_id = u.id AND uub.name = 'Internet Bill'
);

INSERT INTO user_upcoming_bills (user_id, name, amount, due_date, category, display_order)
SELECT 
  u.id,
  'Credit Card Payment',
  450.00,
  '2024-01-25',
  'Credit',
  3
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM user_upcoming_bills uub WHERE uub.user_id = u.id AND uub.name = 'Credit Card Payment'
);

INSERT INTO user_upcoming_bills (user_id, name, amount, due_date, category, display_order)
SELECT 
  u.id,
  'Insurance Premium',
  200.00,
  '2024-01-28',
  'Insurance',
  4
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM user_upcoming_bills uub WHERE uub.user_id = u.id AND uub.name = 'Insurance Premium'
);
