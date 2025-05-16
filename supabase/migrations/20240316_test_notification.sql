-- Insert a test notification
-- Note: Replace 'your-user-id' with an actual user ID from your auth.users table
INSERT INTO notifications (user_id, title, message, type, is_read)
VALUES (
    'your-user-id',  -- Replace this with an actual user ID
    'Test Notification',
    'This is a test notification to verify the notifications system is working correctly.',
    'info',
    false
); 