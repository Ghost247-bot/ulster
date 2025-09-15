-- Fix missing frozen_by_admin column in accounts table
-- This script adds the missing column that's causing the error

-- Add frozen_by_admin field to accounts table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'accounts' 
        AND column_name = 'frozen_by_admin'
    ) THEN
        ALTER TABLE accounts 
        ADD COLUMN frozen_by_admin BOOLEAN NOT NULL DEFAULT false;
        
        -- Add index for better performance when querying admin-frozen accounts
        CREATE INDEX IF NOT EXISTS idx_accounts_frozen_by_admin ON accounts(frozen_by_admin);
        
        -- Update existing frozen accounts to have frozen_by_admin = false
        -- This assumes existing frozen accounts were frozen by users, not admins
        UPDATE accounts 
        SET frozen_by_admin = false 
        WHERE is_frozen = true;
        
        -- Add comment to document the field purpose
        COMMENT ON COLUMN accounts.frozen_by_admin IS 'Indicates if the account was frozen by an admin. If true, only admins can unfreeze the account.';
        
        RAISE NOTICE 'Successfully added frozen_by_admin column to accounts table';
    ELSE
        RAISE NOTICE 'frozen_by_admin column already exists in accounts table';
    END IF;
END $$;
