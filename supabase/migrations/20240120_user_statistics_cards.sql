-- Create user_statistics_cards table
CREATE TABLE IF NOT EXISTS user_statistics_cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  value TEXT NOT NULL,
  change_value DECIMAL(10,2) NOT NULL DEFAULT 0,
  change_type TEXT CHECK (change_type IN ('positive', 'negative', 'neutral')) NOT NULL DEFAULT 'neutral',
  icon_name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT 'blue',
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_user_statistics_cards_user_id ON user_statistics_cards(user_id);
CREATE INDEX IF NOT EXISTS idx_user_statistics_cards_active ON user_statistics_cards(is_active);

-- Enable RLS
ALTER TABLE user_statistics_cards ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own statistics cards" ON user_statistics_cards
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all statistics cards" ON user_statistics_cards
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert statistics cards" ON user_statistics_cards
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update statistics cards" ON user_statistics_cards
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete statistics cards" ON user_statistics_cards
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_statistics_cards_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_user_statistics_cards_updated_at
  BEFORE UPDATE ON user_statistics_cards
  FOR EACH ROW
  EXECUTE FUNCTION update_user_statistics_cards_updated_at();

-- Insert default statistics cards for existing users
INSERT INTO user_statistics_cards (user_id, title, value, change_value, change_type, icon_name, color, display_order)
SELECT 
  u.id,
  'Monthly Income',
  '$8,500',
  5.2,
  'positive',
  'TrendingUp',
  'green',
  1
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM user_statistics_cards usc WHERE usc.user_id = u.id
);

INSERT INTO user_statistics_cards (user_id, title, value, change_value, change_type, icon_name, color, display_order)
SELECT 
  u.id,
  'Monthly Expenses',
  '$4,200',
  -2.1,
  'positive',
  'TrendingDown',
  'blue',
  2
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM user_statistics_cards usc WHERE usc.user_id = u.id AND usc.title = 'Monthly Expenses'
);

INSERT INTO user_statistics_cards (user_id, title, value, change_value, change_type, icon_name, color, display_order)
SELECT 
  u.id,
  'Savings Rate',
  '32%',
  3.5,
  'positive',
  'PiggyBank',
  'purple',
  3
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM user_statistics_cards usc WHERE usc.user_id = u.id AND usc.title = 'Savings Rate'
);

INSERT INTO user_statistics_cards (user_id, title, value, change_value, change_type, icon_name, color, display_order)
SELECT 
  u.id,
  'Credit Score',
  '785',
  12,
  'positive',
  'Award',
  'orange',
  4
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM user_statistics_cards usc WHERE usc.user_id = u.id AND usc.title = 'Credit Score'
);
