-- Cleanup script to remove old admin users before reseeding
-- Run this manually in your PostgreSQL database if admin login fails

DELETE FROM user_roles WHERE user_id IN (
    SELECT id FROM users WHERE email IN ('admin@hotel.com', 'superadmin@hotel.com', 'admin@example.com', 'superadmin@example.com')
);

DELETE FROM users WHERE email IN ('admin@hotel.com', 'superadmin@hotel.com', 'admin@example.com', 'superadmin@example.com');
