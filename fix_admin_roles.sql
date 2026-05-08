-- Fix admin roles - Run this in PostgreSQL

-- First, check current roles
SELECT u.email, u.name, r.name as role
FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN roles r ON ur.role_id = r.id
WHERE u.email IN ('admin@hotel.com', 'superadmin@hotel.com')
ORDER BY u.email, r.name;

-- Add ADMIN role to admin@hotel.com
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u
CROSS JOIN roles r
WHERE u.email = 'admin@hotel.com' 
  AND r.name = 'ADMIN'
  AND NOT EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = u.id AND ur.role_id = r.id
  );

-- Add SUPER_ADMIN role to superadmin@hotel.com
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u
CROSS JOIN roles r
WHERE u.email = 'superadmin@hotel.com' 
  AND r.name = 'SUPER_ADMIN'
  AND NOT EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = u.id AND ur.role_id = r.id
  );

-- Verify the roles were added
SELECT u.email, u.name, r.name as role
FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN roles r ON ur.role_id = r.id
WHERE u.email IN ('admin@hotel.com', 'superadmin@hotel.com')
ORDER BY u.email, r.name;
