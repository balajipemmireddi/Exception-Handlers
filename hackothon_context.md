# Hotel Booking Application — Context Document (RBAC Edition)
> **Purpose**: Shared contract between Backend and Frontend teams.  
> Both teams build in parallel. Backend implements real logic. Frontend uses Mock Data section until integration.  
> **⚠️ RBAC PIVOT**: This version introduces a separate `roles` table with `USER`, `ADMIN`, and `SUPER_ADMIN` roles. Every endpoint now has a required role specified. Read Section 5 carefully before implementing any endpoint.

---

## 1. DATABASE SCHEMA

```sql
-- Roles (separate table — not an enum column on users)
CREATE TABLE roles (
    id    BIGSERIAL PRIMARY KEY,
    name  VARCHAR(30) NOT NULL UNIQUE  -- USER | ADMIN | SUPER_ADMIN
);

-- Seed roles on first run
INSERT INTO roles (name) VALUES ('USER'), ('ADMIN'), ('SUPER_ADMIN');

-- Users (no role column — role lives in user_roles join table)
CREATE TABLE users (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(150) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    created_at  TIMESTAMP DEFAULT NOW()
);

-- User ↔ Role join table (Many-to-Many)
CREATE TABLE user_roles (
    user_id  BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id  BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- Hotels
CREATE TABLE hotels (
    id           BIGSERIAL PRIMARY KEY,
    name         VARCHAR(150) NOT NULL,
    location     VARCHAR(150) NOT NULL,
    description  TEXT,
    image_url    VARCHAR(500),
    star_rating  INT CHECK (star_rating BETWEEN 1 AND 5),
    created_at   TIMESTAMP DEFAULT NOW()
);

-- Rooms
CREATE TABLE rooms (
    id          BIGSERIAL PRIMARY KEY,
    hotel_id    BIGINT NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
    room_type   VARCHAR(50)   NOT NULL,  -- SINGLE | DOUBLE | SUITE
    price       DECIMAL(10,2) NOT NULL,
    capacity    INT           NOT NULL,
    available   BOOLEAN       DEFAULT TRUE
);

-- Bookings
CREATE TABLE bookings (
    id           BIGSERIAL PRIMARY KEY,
    user_id      BIGINT NOT NULL REFERENCES users(id),
    hotel_id     BIGINT NOT NULL REFERENCES hotels(id),
    room_id      BIGINT NOT NULL REFERENCES rooms(id),
    check_in     DATE   NOT NULL,
    check_out    DATE   NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status       VARCHAR(20) DEFAULT 'CONFIRMED',  -- CONFIRMED | CANCELLED
    created_at   TIMESTAMP DEFAULT NOW()
);
```

> **Why Many-to-Many?**  
> A user can theoretically hold multiple roles (e.g. SUPER_ADMIN also inherits ADMIN). Spring Security reads the full roles list from `user_roles` and grants access based on the highest privilege present.

---

## 2. ENTITIES

```java
// Role.java
@Entity
@Table(name = "roles")
public class Role {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(unique = true, nullable = false)
    private RoleName name;

    public enum RoleName {
        USER,
        ADMIN,
        SUPER_ADMIN
    }
}

// User.java
@Entity
@Table(name = "users")
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String password;
    private LocalDateTime createdAt;

    // Many-to-Many with roles via user_roles join table
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "user_roles",
        joinColumns        = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();
}

// Hotel.java
@Entity
@Table(name = "hotels")
public class Hotel {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String location;
    private String description;
    private String imageUrl;
    private Integer starRating;
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "hotel", cascade = CascadeType.ALL)
    private List<Room> rooms;
}

// Room.java
@Entity
@Table(name = "rooms")
public class Room {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "hotel_id")
    private Hotel hotel;

    private String roomType;    // SINGLE, DOUBLE, SUITE
    private Double price;
    private Integer capacity;
    private Boolean available;
}

// Booking.java
@Entity
@Table(name = "bookings")
public class Booking {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "hotel_id")
    private Hotel hotel;

    @ManyToOne
    @JoinColumn(name = "room_id")
    private Room room;

    private LocalDate checkIn;
    private LocalDate checkOut;
    private Double totalAmount;
    private String status;          // CONFIRMED, CANCELLED
    private LocalDateTime createdAt;
}
```

---

## 3. DTOs

### Auth DTOs

```java
// RegisterRequestDTO.java
public class RegisterRequestDTO {
    private String name;
    private String email;
    private String password;
    // Role defaults to USER on backend — not sent by client
}

// LoginRequestDTO.java
public class LoginRequestDTO {
    private String email;
    private String password;
}

// AuthResponseDTO.java  ← returned after login AND register
public class AuthResponseDTO {
    private String token;
    private Long userId;
    private String name;
    private String role;    // Highest role: "USER" | "ADMIN" | "SUPER_ADMIN"
}
```

### Hotel DTOs

```java
// HotelSummaryDTO.java  ← hotel listing page
public class HotelSummaryDTO {
    private Long id;
    private String name;
    private String location;
    private String imageUrl;
    private Integer starRating;
    private Double startingPrice;
}

// HotelDetailDTO.java  ← hotel detail page
public class HotelDetailDTO {
    private Long id;
    private String name;
    private String location;
    private String description;
    private String imageUrl;
    private Integer starRating;
    private List<RoomDTO> rooms;
}

// HotelRequestDTO.java  ← ADMIN creates/updates hotel
public class HotelRequestDTO {
    private String name;
    private String location;
    private String description;
    private String imageUrl;
    private Integer starRating;
}
```

### Room DTOs

```java
// RoomDTO.java
public class RoomDTO {
    private Long id;
    private String roomType;    // SINGLE, DOUBLE, SUITE
    private Double price;
    private Integer capacity;
    private Boolean available;
}
```

### Booking DTOs

```java
// BookingRequestDTO.java  ← USER creates booking
public class BookingRequestDTO {
    private Long hotelId;
    private Long roomId;
    private String checkIn;    // "YYYY-MM-DD"
    private String checkOut;   // "YYYY-MM-DD"
}

// BookingUpdateDTO.java  ← ADMIN edits a booking
public class BookingUpdateDTO {
    private String checkIn;    // "YYYY-MM-DD" — optional
    private String checkOut;   // "YYYY-MM-DD" — optional
    private String status;     // "CONFIRMED" | "CANCELLED" — optional
}

// BookingResponseDTO.java  ← returned for all booking reads
public class BookingResponseDTO {
    private Long id;
    private Long userId;
    private String userName;    // included for Admin views
    private String hotelName;
    private String roomType;
    private String checkIn;
    private String checkOut;
    private String status;      // CONFIRMED | CANCELLED
    private Double totalAmount;
    private String createdAt;
}
```

### Analytics DTOs _(SUPER_ADMIN only)_

```java
// RevenueDTO.java
public class RevenueDTO {
    private Double totalRevenue;
    private Double monthlyRevenue;   // current month
    private Double dailyRevenue;     // today
    private Long totalBookings;
    private Long confirmedBookings;
    private Long cancelledBookings;
}

// SystemAnalyticsDTO.java
public class SystemAnalyticsDTO {
    private Long totalUsers;
    private Long totalHotels;
    private Long totalRooms;
    private Long totalBookings;
    private String mostBookedHotel;
    private String topLocation;
    private Double occupancyRate;    // percentage
}
```

---

## 4. RELATIONSHIPS

```
Role        ──< user_roles >──  User     (Many-to-Many via join table)
User        ──<  Booking        (One user → many bookings)
Hotel       ──<  Room           (One hotel → many rooms, CASCADE DELETE)
Hotel       ──<  Booking        (One hotel → many bookings)
Room        ──<  Booking        (One room → many bookings over time)

Join Table:  user_roles ( user_id FK, role_id FK )

FKs in bookings:
  bookings.user_id   → users.id
  bookings.hotel_id  → hotels.id
  bookings.room_id   → rooms.id
```

### Role Inheritance Rule
```
SUPER_ADMIN  inherits  ADMIN  +  USER  privileges
ADMIN        inherits  USER   privileges
USER         base level only
```
> Implement this in Spring Security by assigning multiple roles to SUPER_ADMIN users in `user_roles`, OR by using a role hierarchy bean — both approaches are valid.

---

## 5. API ENDPOINTS

### Base URL: `http://localhost:8080`
### Auth header (all protected routes): `Authorization: Bearer <token>`

### Role Legend
| Badge | Meaning |
|-------|---------|
| `PUBLIC` | No token required |
| `USER` | Any authenticated user |
| `ADMIN` | Requires ADMIN or SUPER_ADMIN role |
| `SUPER_ADMIN` | Requires SUPER_ADMIN role only |

---

### AUTH

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | PUBLIC | Register, defaults to USER role |
| POST | `/api/auth/login` | PUBLIC | Login, returns JWT with role |

**POST /api/auth/register**
```
Request:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Test@123"
}

Response 201:
{
  "token": "eyJhbGci...",
  "userId": 1,
  "name": "John Doe",
  "role": "USER"
}
```

**POST /api/auth/login**
```
Request:
{
  "email": "john@example.com",
  "password": "Test@123"
}

Response 200:
{
  "token": "eyJhbGci...",
  "userId": 1,
  "name": "John Doe",
  "role": "USER"
}
```

---

### HOTELS

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/hotels` | PUBLIC | Get all hotels (summary list) |
| GET | `/api/hotels/search?location=&checkIn=&checkOut=` | PUBLIC | Search hotels |
| GET | `/api/hotels/{id}` | PUBLIC | Get hotel detail with rooms |
| POST | `/api/hotels` | `ADMIN` | Create hotel |
| PUT | `/api/hotels/{id}` | `ADMIN` | Update hotel details |
| DELETE | `/api/hotels/{id}` | `ADMIN` | Delete hotel |

**GET /api/hotels**
```
Response 200:
[
  {
    "id": 1,
    "name": "Grand Palace Hotel",
    "location": "Mumbai",
    "imageUrl": "https://placehold.co/400x300/1a1a2e/ffffff?text=Grand+Palace",
    "starRating": 4,
    "startingPrice": 2500.00
  }
]
```

**GET /api/hotels/{id}**
```
Response 200:
{
  "id": 1,
  "name": "Grand Palace Hotel",
  "location": "Mumbai",
  "description": "Luxury hotel in the heart of Mumbai.",
  "imageUrl": "https://placehold.co/400x300/1a1a2e/ffffff?text=Grand+Palace",
  "starRating": 4,
  "rooms": [
    { "id": 1, "roomType": "SINGLE", "price": 2500.00, "capacity": 1, "available": true },
    { "id": 2, "roomType": "DOUBLE", "price": 4000.00, "capacity": 2, "available": true },
    { "id": 3, "roomType": "SUITE",  "price": 8000.00, "capacity": 4, "available": false }
  ]
}
```

**POST /api/hotels** _(ADMIN only)_
```
Request:
{
  "name": "Grand Palace Hotel",
  "location": "Mumbai",
  "description": "Luxury hotel in the heart of Mumbai.",
  "imageUrl": "https://placehold.co/400x300/1a1a2e/ffffff?text=Grand+Palace",
  "starRating": 4
}

Response 201:
{
  "id": 3,
  "name": "Grand Palace Hotel",
  "location": "Mumbai",
  "description": "Luxury hotel in the heart of Mumbai.",
  "imageUrl": "https://placehold.co/400x300/1a1a2e/ffffff?text=Grand+Palace",
  "starRating": 4,
  "rooms": []
}
```

**PUT /api/hotels/{id}** _(ADMIN only)_
```
Request: (any subset of fields to update)
{
  "name": "Grand Palace Hotel Deluxe",
  "starRating": 5
}

Response 200: (full updated hotel)
{
  "id": 1,
  "name": "Grand Palace Hotel Deluxe",
  "location": "Mumbai",
  "description": "Luxury hotel in the heart of Mumbai.",
  "imageUrl": "https://placehold.co/400x300/1a1a2e/ffffff?text=Grand+Palace",
  "starRating": 5,
  "rooms": [ ... ]
}
```

---

### BOOKINGS — USER

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/api/bookings` | `USER` | Create a booking |
| GET | `/api/bookings/user/{userId}` | `USER` | Get own bookings |
| PUT | `/api/bookings/{id}/cancel` | `USER` | Cancel own booking |

**POST /api/bookings**
```
Request:
{
  "hotelId": 1,
  "roomId": 2,
  "checkIn": "2025-06-01",
  "checkOut": "2025-06-05"
}

Response 201:
{
  "id": 10,
  "userId": 1,
  "userName": "John Doe",
  "hotelName": "Grand Palace Hotel",
  "roomType": "DOUBLE",
  "checkIn": "2025-06-01",
  "checkOut": "2025-06-05",
  "status": "CONFIRMED",
  "totalAmount": 16000.00,
  "createdAt": "2025-05-08T10:30:00"
}
```

**GET /api/bookings/user/{userId}**
```
Response 200:
[
  {
    "id": 10,
    "userId": 1,
    "userName": "John Doe",
    "hotelName": "Grand Palace Hotel",
    "roomType": "DOUBLE",
    "checkIn": "2025-06-01",
    "checkOut": "2025-06-05",
    "status": "CONFIRMED",
    "totalAmount": 16000.00,
    "createdAt": "2025-05-08T10:30:00"
  }
]
```

**PUT /api/bookings/{id}/cancel**
```
Response 200:
{
  "id": 10,
  "userId": 1,
  "userName": "John Doe",
  "hotelName": "Grand Palace Hotel",
  "roomType": "DOUBLE",
  "checkIn": "2025-06-01",
  "checkOut": "2025-06-05",
  "status": "CANCELLED",
  "totalAmount": 16000.00,
  "createdAt": "2025-05-08T10:30:00"
}
```

---

### BOOKINGS — ADMIN

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/bookings` | `ADMIN` | View ALL system-wide bookings |
| PUT | `/api/admin/bookings/{id}` | `ADMIN` | Edit/update a booking |
| DELETE | `/api/admin/bookings/{id}` | `ADMIN` | Hard delete a booking |

**GET /api/admin/bookings** _(ADMIN only)_
```
Response 200:
[
  {
    "id": 10,
    "userId": 1,
    "userName": "John Doe",
    "hotelName": "Grand Palace Hotel",
    "roomType": "DOUBLE",
    "checkIn": "2025-06-01",
    "checkOut": "2025-06-05",
    "status": "CONFIRMED",
    "totalAmount": 16000.00,
    "createdAt": "2025-05-08T10:30:00"
  },
  {
    "id": 11,
    "userId": 2,
    "userName": "Jane Smith",
    "hotelName": "Sea View Resort",
    "roomType": "SUITE",
    "checkIn": "2025-07-10",
    "checkOut": "2025-07-14",
    "status": "CONFIRMED",
    "totalAmount": 38000.00,
    "createdAt": "2025-05-01T09:00:00"
  }
]
```

**PUT /api/admin/bookings/{id}** _(ADMIN only)_
```
Request: (send only fields to update)
{
  "checkIn": "2025-06-03",
  "checkOut": "2025-06-07",
  "status": "CONFIRMED"
}

Response 200: (full updated booking)
{
  "id": 10,
  "userId": 1,
  "userName": "John Doe",
  "hotelName": "Grand Palace Hotel",
  "roomType": "DOUBLE",
  "checkIn": "2025-06-03",
  "checkOut": "2025-06-07",
  "status": "CONFIRMED",
  "totalAmount": 16000.00,
  "createdAt": "2025-05-08T10:30:00"
}
```

**DELETE /api/admin/bookings/{id}** _(ADMIN only)_
```
Response 200:
{
  "message": "Booking deleted successfully"
}
```

---

### ANALYTICS — SUPER_ADMIN

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/superadmin/revenue` | `SUPER_ADMIN` | Financial earnings and revenue data |
| GET | `/api/superadmin/analytics` | `SUPER_ADMIN` | High-level system analytics |

**GET /api/superadmin/revenue** _(SUPER_ADMIN only)_
```
Response 200:
{
  "totalRevenue": 1250000.00,
  "monthlyRevenue": 186000.00,
  "dailyRevenue": 22000.00,
  "totalBookings": 348,
  "confirmedBookings": 302,
  "cancelledBookings": 46
}
```

**GET /api/superadmin/analytics** _(SUPER_ADMIN only)_
```
Response 200:
{
  "totalUsers": 512,
  "totalHotels": 18,
  "totalRooms": 124,
  "totalBookings": 348,
  "mostBookedHotel": "Grand Palace Hotel",
  "topLocation": "Mumbai",
  "occupancyRate": 72.4
}
```

---

## 6. MOCK DATA (Frontend Use Only)

> Paste inside `MOCK_DATA` in `apiService.js`. Fields match real DTOs exactly. Do not add or remove any field.

```js
hotels: [
  {
    id: 1,
    name: "Grand Palace Hotel",
    location: "Mumbai",
    imageUrl: "https://placehold.co/400x300/1a1a2e/ffffff?text=Grand+Palace",
    starRating: 4,
    startingPrice: 2500.00,
    description: "Luxury hotel in the heart of Mumbai.",
    rooms: [
      { id: 1, roomType: "SINGLE", price: 2500.00, capacity: 1, available: true  },
      { id: 2, roomType: "DOUBLE", price: 4000.00, capacity: 2, available: true  },
      { id: 3, roomType: "SUITE",  price: 8000.00, capacity: 4, available: false }
    ]
  },
  {
    id: 2,
    name: "Sea View Resort",
    location: "Goa",
    imageUrl: "https://placehold.co/400x300/0f3460/ffffff?text=Sea+View",
    starRating: 5,
    startingPrice: 5000.00,
    description: "Beachfront resort with stunning sea views.",
    rooms: [
      { id: 4, roomType: "DOUBLE", price: 5000.00, capacity: 2, available: true },
      { id: 5, roomType: "SUITE",  price: 9500.00, capacity: 3, available: true }
    ]
  },
  {
    id: 3,
    name: "City Comforts Inn",
    location: "Hyderabad",
    imageUrl: "https://placehold.co/400x300/16213e/ffffff?text=City+Comforts",
    starRating: 3,
    startingPrice: 1200.00,
    description: "Affordable and comfortable stay in Hyderabad.",
    rooms: [
      { id: 6, roomType: "SINGLE", price: 1200.00, capacity: 1, available: true  },
      { id: 7, roomType: "DOUBLE", price: 2000.00, capacity: 2, available: false }
    ]
  }
],

bookings: [
  {
    id: 101, userId: 1, userName: "John Doe",
    hotelName: "Grand Palace Hotel", roomType: "DOUBLE",
    checkIn: "2025-06-01", checkOut: "2025-06-05",
    status: "CONFIRMED", totalAmount: 16000.00,
    createdAt: "2025-05-08T10:30:00"
  },
  {
    id: 102, userId: 1, userName: "John Doe",
    hotelName: "Sea View Resort", roomType: "SUITE",
    checkIn: "2025-07-10", checkOut: "2025-07-14",
    status: "CANCELLED", totalAmount: 38000.00,
    createdAt: "2025-05-01T09:00:00"
  }
],

// Admin mock — all bookings across all users
allBookings: [
  {
    id: 101, userId: 1, userName: "John Doe",
    hotelName: "Grand Palace Hotel", roomType: "DOUBLE",
    checkIn: "2025-06-01", checkOut: "2025-06-05",
    status: "CONFIRMED", totalAmount: 16000.00,
    createdAt: "2025-05-08T10:30:00"
  },
  {
    id: 102, userId: 1, userName: "John Doe",
    hotelName: "Sea View Resort", roomType: "SUITE",
    checkIn: "2025-07-10", checkOut: "2025-07-14",
    status: "CANCELLED", totalAmount: 38000.00,
    createdAt: "2025-05-01T09:00:00"
  },
  {
    id: 103, userId: 2, userName: "Jane Smith",
    hotelName: "City Comforts Inn", roomType: "SINGLE",
    checkIn: "2025-06-15", checkOut: "2025-06-18",
    status: "CONFIRMED", totalAmount: 3600.00,
    createdAt: "2025-05-06T14:00:00"
  }
],

// Super Admin mock data
revenue: {
  totalRevenue: 1250000.00,
  monthlyRevenue: 186000.00,
  dailyRevenue: 22000.00,
  totalBookings: 348,
  confirmedBookings: 302,
  cancelledBookings: 46
},

analytics: {
  totalUsers: 512,
  totalHotels: 18,
  totalRooms: 124,
  totalBookings: 348,
  mostBookedHotel: "Grand Palace Hotel",
  topLocation: "Mumbai",
  occupancyRate: 72.4
},

authResponse: {
  token: "mock-jwt-token-xyz",
  userId: 1,
  name: "John Doe",
  role: "USER"   // Change to "ADMIN" or "SUPER_ADMIN" to test those flows
}
```

---

## 7. JWT TOKEN — REQUIRED CLAIMS

Backend **must** include these exact claims in the token payload.

```json
{
  "sub": "john@example.com",
  "userId": 1,
  "role": "USER",
  "exp": 1234567890
}
```

> `role` must be the **highest role** the user holds.  
> If a user has both `ADMIN` and `USER` in `user_roles`, set `role: "ADMIN"` in the JWT.  
> If a user has `SUPER_ADMIN`, set `role: "SUPER_ADMIN"` — frontend uses this to show/hide panels.

**Frontend decode + store pattern:**
```js
const decoded = JSON.parse(atob(token.split(".")[1]));
localStorage.setItem("token",  token);
localStorage.setItem("userId", decoded.userId);
localStorage.setItem("role",   decoded.role);   // "USER" | "ADMIN" | "SUPER_ADMIN"
localStorage.setItem("name",   decoded.sub ?? "");
```

**Frontend role-gate pattern:**
```js
const role = localStorage.getItem("role");

const isUser       = role === "USER" || role === "ADMIN" || role === "SUPER_ADMIN";
const isAdmin      = role === "ADMIN" || role === "SUPER_ADMIN";
const isSuperAdmin = role === "SUPER_ADMIN";

// Usage in JSX (no custom hooks — keep it inline)
{isAdmin && <AdminPanel />}
{isSuperAdmin && <RevenuePanel />}
```

---

## 8. ERROR RESPONSE FORMAT

All 4xx/5xx responses follow this shape:

```json
{
  "status": 403,
  "message": "Access denied — insufficient role",
  "timestamp": "2025-05-08T10:30:00"
}
```

---

## 9. ROLE ACCESS MATRIX (Quick Reference)

| Endpoint | USER | ADMIN | SUPER_ADMIN |
|----------|------|-------|-------------|
| POST `/api/auth/register` | ✅ | ✅ | ✅ |
| POST `/api/auth/login` | ✅ | ✅ | ✅ |
| GET `/api/hotels` | ✅ | ✅ | ✅ |
| GET `/api/hotels/{id}` | ✅ | ✅ | ✅ |
| GET `/api/hotels/search` | ✅ | ✅ | ✅ |
| POST `/api/hotels` | ❌ | ✅ | ✅ |
| PUT `/api/hotels/{id}` | ❌ | ✅ | ✅ |
| DELETE `/api/hotels/{id}` | ❌ | ✅ | ✅ |
| POST `/api/bookings` | ✅ | ✅ | ✅ |
| GET `/api/bookings/user/{userId}` | ✅ own only | ✅ | ✅ |
| PUT `/api/bookings/{id}/cancel` | ✅ own only | ✅ | ✅ |
| GET `/api/admin/bookings` | ❌ | ✅ | ✅ |
| PUT `/api/admin/bookings/{id}` | ❌ | ✅ | ✅ |
| DELETE `/api/admin/bookings/{id}` | ❌ | ✅ | ✅ |
| GET `/api/superadmin/revenue` | ❌ | ❌ | ✅ |
| GET `/api/superadmin/analytics` | ❌ | ❌ | ✅ |

---

*Both teams align on this document before writing a single line of implementation code.*
