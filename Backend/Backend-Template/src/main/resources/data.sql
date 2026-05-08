-- ============================================================
-- PHASE 1: Database Schema Initialization (Roles & Users)
-- Uses IF NOT EXISTS so re-runs are safe
-- ============================================================

-- Roles table (separate table — not an enum column on users)
CREATE TABLE IF NOT EXISTS roles (
    id    BIGSERIAL PRIMARY KEY,
    name  VARCHAR(30) NOT NULL UNIQUE
);

-- Users table (no role column — role lives in user_roles join table)
CREATE TABLE IF NOT EXISTS users (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(150) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    created_at  TIMESTAMP DEFAULT NOW()
);

-- User <-> Role join table (Many-to-Many)
CREATE TABLE IF NOT EXISTS user_roles (
    user_id  BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id  BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- Seed default roles (idempotent — skip if already present)
INSERT INTO roles (name)
SELECT 'USER'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'USER');

INSERT INTO roles (name)
SELECT 'ADMIN'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'ADMIN');

INSERT INTO roles (name)
SELECT 'SUPER_ADMIN'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'SUPER_ADMIN');

-- ============================================================
-- PHASE 2: Core Database Schema Initialization (Hotels, Rooms, Bookings)
-- ============================================================

-- Hotels table
CREATE TABLE IF NOT EXISTS hotels (
    id           BIGSERIAL PRIMARY KEY,
    name         VARCHAR(150) NOT NULL,
    location     VARCHAR(150) NOT NULL,
    description  TEXT,
    image_url    VARCHAR(500),
    star_rating  INT CHECK (star_rating BETWEEN 1 AND 5),
    created_at   TIMESTAMP DEFAULT NOW()
);

-- Rooms table
CREATE TABLE IF NOT EXISTS rooms (
    id          BIGSERIAL PRIMARY KEY,
    hotel_id    BIGINT NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
    room_type   VARCHAR(50)   NOT NULL,
    price       DECIMAL(10,2) NOT NULL,
    capacity    INT           NOT NULL,
    available   BOOLEAN       DEFAULT TRUE
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id           BIGSERIAL PRIMARY KEY,
    user_id      BIGINT NOT NULL REFERENCES users(id),
    hotel_id     BIGINT NOT NULL REFERENCES hotels(id),
    room_id      BIGINT NOT NULL REFERENCES rooms(id),
    check_in     DATE   NOT NULL,
    check_out    DATE   NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status       VARCHAR(20) DEFAULT 'CONFIRMED',
    created_at   TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- PHASE 6: Seed Admin User for Testing
-- Email: admin@hotel.com
-- Password: password
-- BCrypt hash for "password" with strength 12
-- ============================================================

-- First, delete any existing admin users with old emails
DELETE FROM user_roles WHERE user_id IN (
    SELECT id FROM users WHERE email IN ('admin@hotel.com', 'admin@example.com')
);
DELETE FROM users WHERE email IN ('admin@hotel.com', 'admin@example.com');

-- Now insert fresh admin user
INSERT INTO users (name, email, password, created_at)
VALUES ('Admin User', 'admin@hotel.com', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NOW());

-- Assign ADMIN role to admin user
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.email = 'admin@hotel.com' AND r.name = 'ADMIN';
-- ============================================================
-- PHASE 11: Seed Super Admin User for Testing
-- Email: superadmin@hotel.com
-- Password: password
-- BCrypt hash for "password" with strength 12
-- ============================================================

-- First, delete any existing superadmin users with old emails
DELETE FROM user_roles WHERE user_id IN (
    SELECT id FROM users WHERE email IN ('superadmin@hotel.com', 'superadmin@example.com')
);
DELETE FROM users WHERE email IN ('superadmin@hotel.com', 'superadmin@example.com');

-- Now insert fresh superadmin user
INSERT INTO users (name, email, password, created_at)
VALUES ('Super Admin User', 'superadmin@hotel.com', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NOW());

-- Assign SUPER_ADMIN role to super admin user
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.email = 'superadmin@hotel.com' AND r.name = 'SUPER_ADMIN';

-- ============================================================
-- PHASE 11: Seed Sample Data for Analytics Testing
-- ============================================================

-- Sample hotels for analytics
INSERT INTO hotels (name, location, description, image_url, star_rating, created_at)
SELECT 'Grand Palace Hotel', 'Mumbai', 'Luxury hotel in the heart of Mumbai', 'https://placehold.co/400x300', 4, NOW()
WHERE NOT EXISTS (SELECT 1 FROM hotels WHERE name = 'Grand Palace Hotel');

INSERT INTO hotels (name, location, description, image_url, star_rating, created_at)
SELECT 'Sea View Resort', 'Goa', 'Beachfront resort with stunning sea views', 'https://placehold.co/400x300', 5, NOW()
WHERE NOT EXISTS (SELECT 1 FROM hotels WHERE name = 'Sea View Resort');

-- Sample rooms for analytics
INSERT INTO rooms (hotel_id, room_type, price, capacity, available)
SELECT h.id, 'SINGLE', 2500.00, 1, true
FROM hotels h
WHERE h.name = 'Grand Palace Hotel'
AND NOT EXISTS (SELECT 1 FROM rooms r WHERE r.hotel_id = h.id AND r.room_type = 'SINGLE');

INSERT INTO rooms (hotel_id, room_type, price, capacity, available)
SELECT h.id, 'DOUBLE', 4000.00, 2, true
FROM hotels h
WHERE h.name = 'Grand Palace Hotel'
AND NOT EXISTS (SELECT 1 FROM rooms r WHERE r.hotel_id = h.id AND r.room_type = 'DOUBLE');

INSERT INTO rooms (hotel_id, room_type, price, capacity, available)
SELECT h.id, 'SUITE', 8000.00, 4, false
FROM hotels h
WHERE h.name = 'Grand Palace Hotel'
AND NOT EXISTS (SELECT 1 FROM rooms r WHERE r.hotel_id = h.id AND r.room_type = 'SUITE');