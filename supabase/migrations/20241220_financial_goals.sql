-- Create user_financial_goals table
CREATE TABLE IF NOT EXISTS user_financial_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  target_amount DECIMAL(12,2) NOT NULL,
  current_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  deadline DATE,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'General',
  icon_name TEXT NOT NULL DEFAULT 'Target',
  color TEXT NOT NULL DEFAULT 'green',
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_user_financial_goals_user_id ON user_financial_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_user_financial_goals_active ON user_financial_goals(is_active);
CREATE INDEX IF NOT EXISTS idx_user_financial_goals_deadline ON user_financial_goals(deadline);

-- Enable RLS
ALTER TABLE user_financial_goals ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own financial goals" ON user_financial_goals
  FOR SELECT USING (auth.uid() = user_id);

-- Admin policies will be added later when profiles table is available
-- For now, only allow users to manage their own financial goals

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_financial_goals_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_user_financial_goals_updated_at
  BEFORE UPDATE ON user_financial_goals
  FOR EACH ROW
  EXECUTE FUNCTION update_user_financial_goals_updated_at();

-- Insert default financial goals for existing users
INSERT INTO user_financial_goals (user_id, title, target_amount, current_amount, deadline, category, icon_name, color, display_order)
SELECT 
  u.id,
  'Emergency Fund',
  10000.00,
  7500.00,
  '2024-12-31',
  'Emergency',
  'Target',
  'green',
  1
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM user_financial_goals ufg WHERE ufg.user_id = u.id AND ufg.title = 'Emergency Fund'
);

INSERT INTO user_financial_goals (user_id, title, target_amount, current_amount, deadline, category, icon_name, color, display_order)
SELECT 
  u.id,
  'New Car',
  25000.00,
  15000.00,
  '2025-06-30',
  'Transportation',
  'Car',
  'blue',
  2
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM user_financial_goals ufg WHERE ufg.user_id = u.id AND ufg.title = 'New Car'
);

INSERT INTO user_financial_goals (user_id, title, target_amount, current_amount, deadline, category, icon_name, color, display_order)
SELECT 
  u.id,
  'Home Down Payment',
  50000.00,
  12000.00,
  '2025-12-31',
  'Housing',
  'Home',
  'purple',
  3
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM user_financial_goals ufg WHERE ufg.user_id = u.id AND ufg.title = 'Home Down Payment'
);

INSERT INTO user_financial_goals (user_id, title, target_amount, current_amount, deadline, category, icon_name, color, display_order)
SELECT 
  u.id,
  'Vacation Fund',
  5000.00,
  2000.00,
  '2024-08-15',
  'Travel',
  'Plane',
  'orange',
  4
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM user_financial_goals ufg WHERE ufg.user_id = u.id AND ufg.title = 'Vacation Fund'
);
