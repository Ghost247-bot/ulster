# Fix Notifications Schema Cache Issue

## Problem
The error "Could not find the 'type' column of 'notifications' in the schema cache" occurs because of conflicting database migrations that corrupted the schema cache.

## Temporary Fix Applied
✅ Removed all `type` field references from notification operations to resolve the immediate error.

## Permanent Fix Required

### Step 1: Start Docker Desktop
1. Open Docker Desktop application
2. Wait for it to fully start (Docker icon should be green in system tray)

### Step 2: Apply the Database Migration
Run the following commands in your terminal:

```bash
# Navigate to project directory
cd "C:\Users\Believe\Desktop\ulster sep"

# Start Supabase local instance
npx supabase start

# Apply the schema fix migration
npx supabase db reset --local

# Or alternatively, just push the new migration
npx supabase db push --local
```

### Step 3: Restore Type Field in Code
Once the database migration is applied, you'll need to restore the `type` field in the notification operations. The files that need to be updated are:

1. `src/pages/admin/Notifications.tsx` - Add `type: form.type` back to insert and update operations
2. `src/pages/admin/Transactions.tsx` - Add `type: 'info'` back to notification creation
3. `src/pages/admin/Accounts.tsx` - Add appropriate type values back to all notification inserts
4. `src/pages/admin/Cards.tsx` - Add appropriate type values back to all notification inserts

### Step 4: Verify the Fix
1. Test creating notifications in the admin panel
2. Test updating notifications
3. Verify that notifications display correctly with type badges

## Migration Details
The migration `20241222_fix_notifications_schema_cache.sql` will:
- Ensure the notifications table exists with the correct structure
- Properly set up all RLS policies
- Create necessary indexes and triggers
- Fix the schema cache corruption

## Alternative: Manual Database Fix
If you have access to your production/remote database, you can run the migration SQL directly:

```sql
-- Run the contents of supabase/migrations/20241222_fix_notifications_schema_cache.sql
-- directly in your database management tool
```
