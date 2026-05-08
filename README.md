# 🏨 StayEase — Hotel Booking Application (RBAC Edition)

> A full-stack hotel booking platform with Role-Based Access Control, built during a hackathon. Separate dashboards for Users, Admins, and Super Admins — all powered by a React frontend and a Spring Boot backend.

---

## 📌 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Role-Based Access Control](#role-based-access-control)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Mock Data & Development Mode](#mock-data--development-mode)
- [Deployment](#deployment)
- [Team](#team)

---

## Overview

StayEase is a responsive hotel booking web application that allows users to browse hotels, search by location and dates, book rooms, and manage their reservations. The application implements a three-tier Role-Based Access Control (RBAC) system:

- **Users** can browse hotels, make bookings, and manage their own reservations.
- **Admins** can manage all bookings system-wide and maintain hotel listings.
- **Super Admins** have full access including revenue analytics and system-wide metrics.

The frontend is decoupled from the backend via a centralized `apiService.js` with a `USE_MOCKS` toggle, enabling parallel team development.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), JavaScript (.js / .jsx) |
| Styling | Bootstrap|
| Routing | React Router DOM |
| State Management | React Context API |
| Backend | Spring Boot, Java |
| Database | PostgreSQL |
| Auth | JWT (JSON Web Tokens) |
| Build Tool | Vite |
| Deployment | Vercel / Netlify / S3 + Nginx |

---

## Features

### 🔐 Authentication
- User registration and login
- JWT-based authentication with role claims
- Persistent sessions via `localStorage`
- Role-aware navigation bar

### 🏩 Hotel Browsing
- Hotel listing page with cards (name, location, star rating, starting price)
- Search by location and check-in / check-out dates
- Hotel detail page with room listings and availability

### 📅 Booking Management (User)
- Book available rooms from the hotel detail page
- View personal booking history on the User Dashboard
- Cancel existing bookings

### 🛠️ Admin Dashboard
- View all bookings system-wide in a table
- Edit booking details (dates, status)
- Delete bookings

### 📊 Super Admin Dashboard
- Revenue metrics: total, monthly, and daily revenue
- System analytics: total users, hotels, rooms, bookings
- Occupancy rate, top location, most booked hotel

### 🔔 Global UX
- Toast notification system for success and error messages
- Standardized error response handling
- Fully responsive design across mobile and desktop

---

## Role-Based Access Control

The application uses a many-to-many `user_roles` join table. Each user can hold multiple roles; the **highest role** is encoded in the JWT and used for access decisions on the frontend.

| Role | Access Level |
|---|---|
| `USER` | Browse hotels, manage own bookings |
| `ADMIN` | All USER access + manage all bookings + hotel CRUD |
| `SUPER_ADMIN` | All ADMIN access + revenue and analytics dashboards |

### Role Gate Pattern (Frontend)

```js
const role = localStorage.getItem("role");

const isUser       = role === "USER" || role === "ADMIN" || role === "SUPER_ADMIN";
const isAdmin      = role === "ADMIN" || role === "SUPER_ADMIN";
const isSuperAdmin = role === "SUPER_ADMIN";
```

Protected routes redirect unauthenticated users to `/login` and show an **Access Denied** page for insufficient roles.

---

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.jsx
│   │   │   └── Toast.jsx
│   │   ├── hotel/
│   │   │   ├── HotelCard.jsx
│   │   │   └── RoomCard.jsx
│   │   ├── booking/
│   │   │   └── BookingForm.jsx
│   │   └── admin/
│   │       ├── AdminBookingTable.jsx
│   │       └── SuperAdminAnalytics.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── HotelDetail.jsx
│   │   ├── UserDashboard.jsx
│   │   ├── AdminDashboard.jsx
│   │   └── SuperAdminDashboard.jsx
│   ├── services/
│   │   └── apiService.js        ← Central API layer with USE_MOCKS toggle
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── hooks/
│   │   └── useAuth.js
│   ├── App.jsx
│   └── main.jsx
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/stayease-frontend.git
cd stayease-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Running with Mock Data

By default, the app runs with mock data — no backend required.

In `src/services/apiService.js`:

```js
const USE_MOCKS = true;  // Set to false to connect to the real backend
```

To test different roles, change the `role` field in `MOCK_DATA.authResponse`:

```js
authResponse: {
  token: "mock-jwt-token-xyz",
  userId: 1,
  name: "John Doe",
  role: "SUPER_ADMIN"  // "USER" | "ADMIN" | "SUPER_ADMIN"
}
```

---

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:8080
```

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Base URL of the Spring Boot backend API |

---

## API Reference

All protected endpoints require the `Authorization: Bearer <token>` header.

### Auth

| Method | Endpoint | Role | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login and receive JWT |

### Hotels

| Method | Endpoint | Role | Description |
|---|---|---|---|
| GET | `/api/hotels` | All | List all hotels |
| GET | `/api/hotels/{id}` | All | Hotel detail with rooms |
| GET | `/api/hotels/search` | All | Search by location and dates |
| POST | `/api/hotels` | ADMIN+ | Create a hotel |
| PUT | `/api/hotels/{id}` | ADMIN+ | Update a hotel |
| DELETE | `/api/hotels/{id}` | ADMIN+ | Delete a hotel |

### Bookings

| Method | Endpoint | Role | Description |
|---|---|---|---|
| POST | `/api/bookings` | USER+ | Create a booking |
| GET | `/api/bookings/user/{userId}` | USER (own) | Get user's bookings |
| PUT | `/api/bookings/{id}/cancel` | USER (own) | Cancel a booking |

### Admin

| Method | Endpoint | Role | Description |
|---|---|---|---|
| GET | `/api/admin/bookings` | ADMIN+ | View all bookings |
| PUT | `/api/admin/bookings/{id}` | ADMIN+ | Edit a booking |
| DELETE | `/api/admin/bookings/{id}` | ADMIN+ | Delete a booking |

### Super Admin Analytics

| Method | Endpoint | Role | Description |
|---|---|---|---|
| GET | `/api/superadmin/revenue` | SUPER_ADMIN | Revenue and booking stats |
| GET | `/api/superadmin/analytics` | SUPER_ADMIN | System-wide analytics |

### Error Response Format

All `4xx` / `5xx` responses return:

```json
{
  "status": 403,
  "message": "Access denied — insufficient role",
  "timestamp": "2025-05-08T10:30:00"
}
```

---

## Database Schema

```sql
-- Roles
CREATE TABLE roles (
    id    BIGSERIAL PRIMARY KEY,
    name  VARCHAR(30) NOT NULL UNIQUE  -- USER | ADMIN | SUPER_ADMIN
);

-- Users
CREATE TABLE users (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(150) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    created_at  TIMESTAMP DEFAULT NOW()
);

-- User <-> Role (Many-to-Many)
CREATE TABLE user_roles (
    user_id  BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id  BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- Hotels, Rooms, Bookings (see context-rbac.md for full schema)
```

The many-to-many `user_roles` design allows a user to hold multiple roles. The backend encodes only the **highest role** into the JWT claim.

---

## Mock Data & Development Mode

The frontend ships with a complete set of mock data in `apiService.js` that mirrors real backend DTOs exactly. This allows the frontend team to build and test all UI flows without a running backend.

Sample mock data includes:

- 3 hotels (Mumbai, Goa, Hyderabad) with rooms
- User and admin booking records
- Revenue stats: ₹12,50,000 total revenue, 348 total bookings
- Analytics: 512 users, 18 hotels, 72.4% occupancy rate

Switch to real API calls by setting `USE_MOCKS = false` in `apiService.js` and providing the `VITE_API_BASE_URL` environment variable.

---

## Deployment

### CI/CD Pipeline

```bash
npm install        # Install dependencies
npm run lint       # Run linter
npm run build      # Build production bundle → dist/
```

Deploy the `dist/` folder to **Vercel**, **Netlify**, or **AWS S3**.

### Nginx Configuration (Self-Hosted)

```nginx
server {
    listen 80;
    root /var/www/stayease/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;  # React Router fallback
    }
}
```

---

## Team

| Name | Role |
|---|---|
| Member 1 | Frontend Developer |
| Member 2 | Frontend Developer |
| Member 3 | Backend Developer |
| Member 4 | Backend Developer |

---

> Built with ❤️ at Hackathon 2025
