Project: Hotel Booking Application (RBAC Edition)
Team: 4 members (2 Frontend, 2 Backend)
Stack: Java Spring Boot, PostgreSQL, Spring Security, JWT
Goal: Implement a robust backend API for hotel booking with Role-Based Access Control (RBAC) and analytics, adhering to defined entities, DTOs, and endpoints from context-rbac.md.

PHASE 1: Database Schema Initialization (Roles & Users)
Goal: Set up the PostgreSQL database and create the `roles`, `users`, and `user_roles` tables, including seeding default roles.
Tasks:
  - Create `roles` table.
  - Seed `USER`, `ADMIN`, `SUPER_ADMIN` roles into `roles` table.
  - Create `users` table (without role column).
  - Create `user_roles` join table.
Validation Command: `psql -U postgres -d hotel_booking_db -c "\dt && SELECT * FROM roles;"`
Exit Criteria: All three tables (`roles`, `users`, `user_roles`) are listed, and `roles` table contains USER, ADMIN, SUPER_ADMIN entries.
Failure Protocol: If validation fails, DO NOT rewrite previous phases or core architecture. Confine fixes strictly to the current phase's files. If unable to fix quickly, STOP and ask the human Lead for intervention.

PHASE 2: Core Database Schema Initialization (Hotels, Rooms, Bookings)
Goal: Create the remaining core application tables: `hotels`, `rooms`, and `bookings`.
Tasks:
  - Create `hotels` table.
  - Create `rooms` table with `hotel_id` FK.
  - Create `bookings` table with `user_id`, `hotel_id`, `room_id` FKs and `total_amount` column.
Validation Command: `psql -U postgres -d hotel_booking_db -c "\dt"`
Exit Criteria: All tables (`roles`, `users`, `user_roles`, `hotels`, `rooms`, `bookings`) are listed in the database.
Failure Protocol: If validation fails, DO NOT rewrite previous phases or core architecture. Confine fixes strictly to the current phase's files. If unable to fix quickly, STOP and ask the human Lead for intervention.

PHASE 3: Role and User Entities & Repositories
Goal: Implement Java entities for `Role` and `User` with their respective repositories, establishing the Many-to-Many relationship.
Tasks:
  - Create `Role` entity with `RoleName` enum.
  - Create `UserRepository` and `RoleRepository`.
  - Implement `User` entity with `Set<Role>` and `@ManyToMany` mapping to `user_roles`.
Validation Command: `mvn clean install` (ensure project compiles without errors after entity creation).
Exit Criteria: Project compiles successfully, and entities are correctly mapped (verified by Hibernate logs if enabled).
Failure Protocol: If validation fails, DO NOT rewrite previous phases or core architecture. Confine fixes strictly to the current phase's files. If unable to fix quickly, STOP and ask the human Lead for intervention.

PHASE 4: User Authentication Module (Register & Login)
Goal: Implement user registration and login functionality with JWT token generation, assigning default USER role on registration.
Tasks:
  - Implement `RegisterRequestDTO` and `LoginRequestDTO`.
  - Implement `AuthResponseDTO` (including `role` as highest role).
  - Develop `POST /api/auth/register` endpoint (assigns default USER role).
  - Develop `POST /api/auth/login` endpoint.
  - Implement JWT token generation logic, including `userId` and `highest role` in claims.

Entity: User (from Phase 3)
Entity: Role (from Phase 3)

RequestDTO: RegisterRequestDTO
  - name, email, password

RequestDTO: LoginRequestDTO
  - email, password

ResponseDTO: AuthResponseDTO
  - token: String
  - userId: Long
  - name: String
  - role: String (Highest role: USER | ADMIN | SUPER_ADMIN)

Endpoints:
  POST  /api/auth/register  → Register new user (PUBLIC)
  POST  /api/auth/login     → Login, returns JWT (PUBLIC)

Validation Command: `curl -X POST -H "Content-Type: application/json" -d '{"name": "Test User", "email": "test@example.com", "password": "Test@123"}' http://localhost:8080/api/auth/register && curl -X POST -H "Content-Type: application/json" -d '{"email": "test@example.com", "password": "Test@123"}' http://localhost:8080/api/auth/login`
Exit Criteria: Both commands return 201 (register) and 200 (login) with a valid JWT token and user details, `role` is "USER".
Failure Protocol: If validation fails, DO NOT rewrite previous phases or core architecture. Confine fixes strictly to the current phase's files. If unable to fix quickly, STOP and ask the human Lead for intervention.

PHASE 5: Spring Security Configuration & JWT Filter
Goal: Configure Spring Security to protect endpoints, validate JWT tokens, and enforce role-based access control.
Tasks:
  - Set up `SecurityConfig` to disable CSRF, configure session management, and define authentication entry points.
  - Implement a custom `JwtAuthenticationFilter` to extract and validate JWT tokens.
  - Configure `AuthenticationManager` and `PasswordEncoder`.
  - Apply `@PreAuthorize` or similar annotations to secure endpoints based on `RoleName` (USER, ADMIN, SUPER_ADMIN).
  - Implement role hierarchy if chosen over direct multiple role assignment.
Validation Command: `curl -I http://localhost:8080/api/auth/register && curl -I -H "Authorization: Bearer invalid_token" http://localhost:8080/api/hotels`
Exit Criteria: The first command returns 200 (public endpoint), and the second returns 401 Unauthorized.
Failure Protocol: If validation fails, DO NOT rewrite previous phases or core architecture. Confine fixes strictly to the current phase's files. If unable to fix quickly, STOP and ask the human Lead for intervention.

PHASE 6: Hotel Management Module (Admin Operations)
Goal: Implement administrative functionalities for creating, updating, and deleting hotels, secured by the ADMIN role.
Tasks:
  - Create `Hotel` entity and `HotelRepository`.
  - Implement `HotelRequestDTO` for hotel creation/update.
  - Develop `POST /api/hotels` endpoint (ADMIN).
  - Develop `PUT /api/hotels/{id}` endpoint (ADMIN).
  - Develop `DELETE /api/hotels/{id}` endpoint (ADMIN).
  - Apply `@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")` to these endpoints.

Entity: Hotel
  - id: BIGSERIAL PRIMARY KEY
  - name: VARCHAR(150)
  - location: VARCHAR(150)
  - description: TEXT
  - image_url: VARCHAR(500)
  - star_rating: INT
  - created_at: TIMESTAMP

RequestDTO: HotelRequestDTO
  - name, location, description, imageUrl, starRating

ResponseDTO: HotelDetailDTO (used for creation/update response)
  - id: Long
  - name: String
  - location: String
  - description: String
  - imageUrl: String
  - starRating: Integer
  - rooms: List<RoomDTO>

Endpoints:
  POST   /api/hotels        → Create hotel (ADMIN)
  PUT    /api/hotels/{id}   → Update hotel details (ADMIN)
  DELETE /api/hotels/{id}   → Delete hotel (ADMIN)

Validation Command: `ADMIN_TOKEN=$(curl -s -X POST -H "Content-Type: application/json" -d '{"email": "admin@example.com", "password": "AdminPass123"}' http://localhost:8080/api/auth/login | jq -r .token); curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $ADMIN_TOKEN" -d '{"name": "New Hotel", "location": "Test City", "starRating": 3}' http://localhost:8080/api/hotels`
Exit Criteria: Command returns 201 with the newly created hotel details. (Assumes an admin user is seeded or created for testing).
Failure Protocol: If validation fails, DO NOT rewrite previous phases or core architecture. Confine fixes strictly to the current phase's files. If unable to fix quickly, STOP and ask the human Lead for intervention.

PHASE 7: Hotel Listing and Detail Module (Public Access)
Goal: Implement public-facing endpoints for viewing hotels and searching, ensuring `startingPrice` calculation.
Tasks:
  - Implement `HotelSummaryDTO` for listing hotels.
  - Implement `HotelDetailDTO` for single hotel view.
  - Develop `GET /api/hotels` endpoint (PUBLIC).
  - Develop `GET /api/hotels/{id}` endpoint (PUBLIC).
  - Develop `GET /api/hotels/search?location=&checkIn=&checkOut=` endpoint (PUBLIC).
  - Implement logic to calculate `startingPrice` for `HotelSummaryDTO`.

Entity: Hotel (from Phase 6)

ResponseDTO: HotelSummaryDTO
  - id: Long
  - name: String
  - location: String
  - imageUrl: String
  - starRating: Integer
  - startingPrice: Double

ResponseDTO: HotelDetailDTO
  - id: Long
  - name: String
  - location: String
  - description: String
  - imageUrl: String
  - starRating: Integer
  - rooms: List<RoomDTO>

Endpoints:
  GET /api/hotels                                → Get all hotels (PUBLIC)
  GET /api/hotels/{id}                           → Get hotel detail with rooms (PUBLIC)
  GET /api/hotels/search?location=&checkIn=&checkOut= → Search hotels (PUBLIC)

Validation Command: `curl http://localhost:8080/api/hotels && curl http://localhost:8080/api/hotels/1 && curl http://localhost:8080/api/hotels/search?location=Mumbai`
Exit Criteria: All commands return 200 with appropriate hotel data, including `startingPrice` for summary and `rooms` for detail.
Failure Protocol: If validation fails, DO NOT rewrite previous phases or core architecture. Confine fixes strictly to the current phase's files. If unable to fix quickly, STOP and ask the human Lead for intervention.

PHASE 8: Room Module Integration
Goal: Integrate `Room` entity and DTOs with `Hotel`, ensuring rooms are correctly associated and displayed.
Tasks:
  - Create `Room` entity and `RoomRepository`.
  - Implement `RoomDTO`.
  - Ensure `HotelDetailDTO` correctly includes a list of `RoomDTO`s.
  - Implement endpoints for adding/updating rooms to a hotel (ADMIN).

Entity: Room
  - id: BIGSERIAL PRIMARY KEY
  - hotel_id: BIGINT FK
  - room_type: VARCHAR(50)
  - price: DECIMAL(10,2)
  - capacity: INT
  - available: BOOLEAN

ResponseDTO: RoomDTO
  - id: Long
  - roomType: String
  - price: Double
  - capacity: Integer
  - available: Boolean

Endpoints: (No new top-level endpoints, integrated into Hotel endpoints, or new sub-endpoints like `/api/hotels/{hotelId}/rooms` for ADMIN)

Validation Command: `curl http://localhost:8080/api/hotels/1`
Exit Criteria: The response for hotel ID 1 includes a `rooms` array with correct `RoomDTO` objects and `startingPrice` in `/api/hotels` is accurate.
Failure Protocol: If validation fails, DO NOT rewrite previous phases or core architecture. Confine fixes strictly to the current phase's files. If unable to fix quickly, STOP and ask the human Lead for intervention.

PHASE 9: Booking Module (User Operations)
Goal: Implement the functionality for users to create, view their own, and cancel their own bookings.
Tasks:
  - Create `Booking` entity and `BookingRepository`.
  - Implement `BookingRequestDTO`.
  - Implement `BookingResponseDTO` (including `userName`).
  - Develop `POST /api/bookings` endpoint (USER).
  - Develop `GET /api/bookings/user/{userId}` endpoint (USER, own only).
  - Develop `PUT /api/bookings/{id}/cancel` endpoint (USER, own only).
  - Implement logic for checking room availability, calculating `totalAmount`, and setting booking status.

Entity: Booking
  - id: BIGSERIAL PRIMARY KEY
  - user_id: BIGINT FK
  - hotel_id: BIGINT FK
  - room_id: BIGINT FK
  - check_in: DATE
  - check_out: DATE
  - total_amount: DECIMAL(10,2)
  - status: VARCHAR(20)
  - created_at: TIMESTAMP

RequestDTO: BookingRequestDTO
  - hotelId, roomId, checkIn, checkOut

ResponseDTO: BookingResponseDTO
  - id: Long
  - userId: Long
  - userName: String
  - hotelName: String
  - roomType: String
  - checkIn: String
  - checkOut: String
  - status: String
  - totalAmount: Double
  - createdAt: String

Endpoints:
  POST /api/bookings                 → Create a booking (USER)
  GET  /api/bookings/user/{userId}  → Get own bookings (USER)
  PUT  /api/bookings/{id}/cancel    → Cancel own booking (USER)

Validation Command: `USER_TOKEN=$(curl -s -X POST -H "Content-Type: application/json" -d '{"email": "user@example.com", "password": "UserPass123"}' http://localhost:8080/api/auth/login | jq -r .token); USER_ID=$(curl -s -X POST -H "Content-Type: application/json" -d '{"email": "user@example.com", "password": "UserPass123"}' http://localhost:8080/api/auth/login | jq -r .userId); BOOKING_ID=$(curl -s -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" -d '{"hotelId": 1, "roomId": 1, "checkIn": "2026-07-01", "checkOut": "2026-07-05"}' http://localhost:8080/api/bookings | jq -r .id); curl -H "Authorization: Bearer $USER_TOKEN" http://localhost:8080/api/bookings/user/$USER_ID && curl -X PUT -H "Authorization: Bearer $USER_TOKEN" http://localhost:8080/api/bookings/$BOOKING_ID/cancel`
Exit Criteria: The GET command returns a list of bookings for the user, and the PUT command returns the canceled booking with status 'CANCELLED'.
Failure Protocol: If validation fails, DO NOT rewrite previous phases or core architecture. Confine fixes strictly to the current phase's files. If unable to fix quickly, STOP and ask the human Lead for intervention.

PHASE 10: Booking Module (Admin Operations)
Goal: Implement admin functionalities for viewing all bookings, updating, and hard deleting any booking.
Tasks:
  - Implement `BookingUpdateDTO`.
  - Develop `GET /api/admin/bookings` endpoint (ADMIN).
  - Develop `PUT /api/admin/bookings/{id}` endpoint (ADMIN).
  - Develop `DELETE /api/admin/bookings/{id}` endpoint (ADMIN).
  - Apply `@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")` to these endpoints.

Entity: Booking (from Phase 9)

RequestDTO: BookingUpdateDTO
  - checkIn, checkOut, status (optional fields)

ResponseDTO: BookingResponseDTO (from Phase 9)

Endpoints:
  GET    /api/admin/bookings      → View ALL system-wide bookings (ADMIN)
  PUT    /api/admin/bookings/{id} → Edit/update a booking (ADMIN)
  DELETE /api/admin/bookings/{id} → Hard delete a booking (ADMIN)

Validation Command: `ADMIN_TOKEN=$(curl -s -X POST -H "Content-Type: application/json" -d '{"email": "admin@example.com", "password": "AdminPass123"}' http://localhost:8080/api/auth/login | jq -r .token); curl -H "Authorization: Bearer $ADMIN_TOKEN" http://localhost:8080/api/admin/bookings`
Exit Criteria: Command returns 200 with a list of all bookings in the system.
Failure Protocol: If validation fails, DO NOT rewrite previous phases or core architecture. Confine fixes strictly to the current phase's files. If unable to fix quickly, STOP and ask the human Lead for intervention.

PHASE 11: Analytics Module (Super Admin)
Goal: Implement financial and system analytics endpoints for SUPER_ADMIN.
Tasks:
  - Implement `RevenueDTO`.
  - Implement `SystemAnalyticsDTO`.
  - Develop `GET /api/superadmin/revenue` endpoint (SUPER_ADMIN).
  - Develop `GET /api/superadmin/analytics` endpoint (SUPER_ADMIN).
  - Implement logic to calculate all analytics metrics.
  - Apply `@PreAuthorize("hasRole('SUPER_ADMIN')")` to these endpoints.

ResponseDTO: RevenueDTO
  - totalRevenue: Double
  - monthlyRevenue: Double
  - dailyRevenue: Double
  - totalBookings: Long
  - confirmedBookings: Long
  - cancelledBookings: Long

ResponseDTO: SystemAnalyticsDTO
  - totalUsers: Long
  - totalHotels: Long
  - totalRooms: Long
  - totalBookings: Long
  - mostBookedHotel: String
  - topLocation: String
  - occupancyRate: Double

Endpoints:
  GET /api/superadmin/revenue   → Financial earnings and revenue data (SUPER_ADMIN)
  GET /api/superadmin/analytics → High-level system analytics (SUPER_ADMIN)

Validation Command: `SUPER_ADMIN_TOKEN=$(curl -s -X POST -H "Content-Type: application/json" -d '{"email": "superadmin@example.com", "password": "SuperAdminPass123"}' http://localhost:8080/api/auth/login | jq -r .token); curl -H "Authorization: Bearer $SUPER_ADMIN_TOKEN" http://localhost:8080/api/superadmin/revenue && curl -H "Authorization: Bearer $SUPER_ADMIN_TOKEN" http://localhost:8080/api/superadmin/analytics`
Exit Criteria: Both commands return 200 with valid `RevenueDTO` and `SystemAnalyticsDTO` data.
Failure Protocol: If validation fails, DO NOT rewrite previous phases or core architecture. Confine fixes strictly to the current phase's files. If unable to fix quickly, STOP and ask the human Lead for intervention.

PHASE 12: Global Error Handling & Final Refinement
Goal: Implement a consistent error response format across all API endpoints and perform final code review.
Tasks:
  - Create a global exception handler to catch all 4xx/5xx errors.
  - Ensure all error responses adhere to the specified JSON format (`status`, `message`, `timestamp`).
  - Conduct comprehensive code review for security, performance, and maintainability.
  - Write integration tests for all endpoints, covering various roles and edge cases.

Validation Command: `curl -X POST -H "Content-Type: application/json" -d '{"email": "invalid", "password": "123"}' http://localhost:8080/api/auth/login`
Exit Criteria: Command returns a JSON object with `status`, `message`, and `timestamp` fields, and an appropriate HTTP status code (e.g., 400 Bad Request).
Failure Protocol: If validation fails, DO NOT rewrite previous phases or core architecture. Confine fixes strictly to the current phase's files. If unable to fix quickly, STOP and ask the human Lead for intervention.

## AGENTS.md Block

## Context
This project is a Hotel Booking Application with RBAC. The backend provides a RESTful API for user authentication, hotel management, booking functionalities, and analytics, enforcing roles: USER, ADMIN, SUPER_ADMIN.

## Current Phase
PHASE 12 — Global Error Handling & Final Refinement

## Stack
Java Spring Boot, PostgreSQL, Spring Security, JWT, Maven/Gradle

## Rules
- Don't touch files outside the scope of this phase.
- Prefix commits with PHASE-N:
- YOU MUST RUN THE VALIDATION COMMAND before proceeding.
- If validation fails, you are strictly forbidden from altering the DTOs, database schema, or architecture to force it to pass.

## File Structure Snapshot
```
backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── hotelbooking/
│   │   │           ├── HotelBookingApplication.java
│   │   │           ├── config/
│   │   │           │   └── SecurityConfig.java
│   │   │           ├── controller/
│   │   │           │   ├── AuthController.java
│   │   │           │   ├── HotelController.java
│   │   │           │   ├── BookingController.java
│   │   │           │   └── AdminController.java (for admin bookings)
│   │   │           │   └── SuperAdminController.java (for analytics)
│   │   │           ├── dto/
│   │   │           │   ├── AuthResponseDTO.java
│   │   │           │   ├── BookingRequestDTO.java
│   │   │           │   ├── BookingResponseDTO.java
│   │   │           │   ├── BookingUpdateDTO.java
│   │   │           │   ├── HotelDetailDTO.java
│   │   │           │   ├── HotelRequestDTO.java
│   │   │           │   ├── HotelSummaryDTO.java
│   │   │           │   ├── LoginRequestDTO.java
│   │   │           │   ├── RegisterRequestDTO.java
│   │   │           │   ├── RoomDTO.java
│   │   │           │   ├── RevenueDTO.java
│   │   │           │   └── SystemAnalyticsDTO.java
│   │   │           ├── entity/
│   │   │           │   ├── Booking.java
│   │   │           │   ├── Hotel.java
│   │   │           │   ├── Room.java
│   │   │           │   ├── User.java
│   │   │           │   └── Role.java
│   │   │           ├── exception/
│   │   │           │   └── GlobalExceptionHandler.java
│   │   │           ├── repository/
│   │   │           │   ├── BookingRepository.java
│   │   │           │   ├── HotelRepository.java
│   │   │           │   ├── RoomRepository.java
│   │   │           │   ├── UserRepository.java
│   │   │           │   └── RoleRepository.java
│   │   │           └── service/
│   │   │               ├── AuthService.java
│   │   │               ├── HotelService.java
│   │   │               ├── BookingService.java
│   │   │               └── AdminService.java (for admin bookings/analytics)
│   │   └── resources/
│   │       ├── application.properties
│   │       └── data.sql (for initial data/admin user)
│   └── test/
│       └── java/
│           └── com/
│               └── hotelbooking/
│                   └── ... (Test files)
├── pom.xml (or build.gradle)
└── Dockerfile
```

## Deployment Checklist
- Environment variables: `DATABASE_URL`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`, `JWT_SECRET`, `JWT_EXPIRATION_MS`
- CI/CD pipeline steps:
  1. Build Docker image.
  2. Run unit and integration tests.
  3. Push image to container registry.
  4. Deploy to Kubernetes/ECS.
- Docker/Nginx configuration:
  - Dockerfile for Spring Boot application.
  - Nginx configuration for reverse proxy and SSL termination (if applicable).
