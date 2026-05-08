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
