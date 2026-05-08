# Hotel Management API - Postman Collection

This folder contains the complete Postman collection for testing the Hotel Management System API.

## 📁 Files

- `Hotel-Management-API.postman_collection.json` - Complete API collection with all endpoints

## 🚀 How to Import

1. Open Postman
2. Click on **Import** button (top left)
3. Select the `Hotel-Management-API.postman_collection.json` file
4. Click **Import**

## 🔧 Configuration

### Collection Variables

The collection uses the following variables (automatically managed):

- `base_url` - API base URL (default: `http://localhost:8080`)
- `jwt_token` - JWT authentication token (auto-saved after login)
- `user_id` - Current user ID (auto-saved after login/register)
- `hotel_id` - Hotel ID for testing (auto-saved after creating hotel)
- `room_id` - Room ID for testing (auto-saved after creating room)
- `booking_id` - Booking ID for testing (auto-saved after creating booking)

### Update Base URL (if needed)

1. Click on the collection name
2. Go to **Variables** tab
3. Update `base_url` value if your backend runs on a different port

## 📝 Testing Workflow

### Step 1: Authentication

Start by authenticating to get a JWT token:

#### Option A: Register New User
1. Run **1. Authentication → Register User**
   - Creates a new user with USER role
   - Token is automatically saved

#### Option B: Login with Existing User
1. Run **1. Authentication → Login User**
   - Use credentials from registration
   - Token is automatically saved

#### Option C: Login as Admin
1. Run **1. Authentication → Login Admin**
   - Email: `admin@hotel.com`
   - Password: `admin123`
   - Token is automatically saved

#### Option D: Login as Super Admin
1. Run **1. Authentication → Login Super Admin**
   - Email: `superadmin@hotel.com`
   - Password: `superadmin123`
   - Token is automatically saved

### Step 2: Test Public Endpoints (No Auth Required)

These endpoints work without authentication:

1. **2. Hotels (Public) → Get All Hotels**
2. **2. Hotels (Public) → Get Hotel By ID**
3. **2. Hotels (Public) → Search Hotels by Location**

### Step 3: Test Admin Operations (Login as Admin First)

1. **Login as Admin** (see Step 1, Option C)
2. **3. Hotels (Admin) → Create Hotel**
   - Hotel ID is automatically saved
3. **4. Rooms → Add Room to Hotel**
   - Room ID is automatically saved
4. **4. Rooms → Update Room**
5. **3. Hotels (Admin) → Update Hotel**

### Step 4: Test User Bookings (Login as User)

1. **Login as User** (see Step 1, Option A or B)
2. Make sure you have a hotel and room created (from Step 3)
3. **5. Bookings (User) → Create Booking**
   - Update `userId` and `roomId` in the request body
   - Booking ID is automatically saved
4. **5. Bookings (User) → Get User Bookings**
5. **5. Bookings (User) → Cancel Booking**

### Step 5: Test Admin Booking Management

1. **Login as Admin** (see Step 1, Option C)
2. **6. Bookings (Admin) → Get All Bookings**
3. **6. Bookings (Admin) → Update Booking**
4. **6. Bookings (Admin) → Delete Booking**

### Step 6: Test Super Admin Analytics

1. **Login as Super Admin** (see Step 1, Option D)
2. **7. Super Admin Analytics → Get Revenue Analytics**
3. **7. Super Admin Analytics → Get System Analytics**

## 🔐 Authentication

The collection uses **Bearer Token** authentication. After logging in or registering, the JWT token is automatically:
- Saved to the `jwt_token` collection variable
- Applied to all subsequent requests that require authentication

### Manual Token Update (if needed)

1. Click on the collection name
2. Go to **Variables** tab
3. Update the `jwt_token` value

## 📋 API Endpoints Overview

### 1. Authentication (No Auth Required)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### 2. Hotels - Public (No Auth Required)
- `GET /api/hotels` - Get all hotels
- `GET /api/hotels/{id}` - Get hotel details
- `GET /api/hotels/search?location=` - Search hotels

### 3. Hotels - Admin (ADMIN/SUPER_ADMIN)
- `POST /api/hotels` - Create hotel
- `PUT /api/hotels/{id}` - Update hotel
- `DELETE /api/hotels/{id}` - Delete hotel

### 4. Rooms (Admin operations require ADMIN/SUPER_ADMIN)
- `GET /api/hotels/{hotelId}/rooms` - Get rooms (Public)
- `POST /api/hotels/{hotelId}/rooms` - Add room (Admin)
- `PUT /api/hotels/{hotelId}/rooms/{roomId}` - Update room (Admin)
- `DELETE /api/hotels/{hotelId}/rooms/{roomId}` - Delete room (Admin)

### 5. Bookings - User (USER/ADMIN/SUPER_ADMIN)
- `POST /api/bookings` - Create booking
- `GET /api/bookings/user/{userId}` - Get user bookings
- `PUT /api/bookings/{id}/cancel` - Cancel booking

### 6. Bookings - Admin (ADMIN/SUPER_ADMIN)
- `GET /api/admin/bookings` - Get all bookings
- `PUT /api/admin/bookings/{id}` - Update booking
- `DELETE /api/admin/bookings/{id}` - Delete booking

### 7. Super Admin Analytics (SUPER_ADMIN only)
- `GET /api/superadmin/revenue` - Get revenue analytics
- `GET /api/superadmin/analytics` - Get system analytics

## 🎯 Test Scenarios

### Scenario 1: Complete User Journey
1. Register as new user
2. Browse hotels (public)
3. Search hotels by location
4. View hotel details
5. Create a booking
6. View your bookings
7. Cancel a booking

### Scenario 2: Admin Hotel Management
1. Login as admin
2. Create a new hotel
3. Add rooms to the hotel
4. Update hotel information
5. Update room details
6. View all bookings
7. Update a booking

### Scenario 3: Super Admin Analytics
1. Login as super admin
2. View revenue analytics
3. View system analytics
4. Manage hotels and bookings (has admin privileges)

## 🔍 Response Status Codes

- `200 OK` - Successful GET, PUT requests
- `201 Created` - Successful POST requests (resource created)
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Missing or invalid JWT token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Duplicate resource (e.g., email already exists)

## 💡 Tips

1. **Auto-save Variables**: The collection automatically saves IDs and tokens after successful requests
2. **Test Scripts**: Each request has test scripts that extract and save relevant data
3. **Sequential Testing**: Follow the workflow steps for best results
4. **Role-based Testing**: Switch between user roles to test different permission levels
5. **Check Console**: Open Postman Console (View → Show Postman Console) to see saved variables

## 🐛 Troubleshooting

### Token Expired
- Re-run the login request to get a new token

### 403 Forbidden
- Make sure you're logged in with the correct role (USER/ADMIN/SUPER_ADMIN)
- Admin endpoints require ADMIN or SUPER_ADMIN role
- Super Admin endpoints require SUPER_ADMIN role only

### 404 Not Found
- Check if the resource ID exists
- Make sure you've created the resource first (hotel, room, booking)

### Variables Not Updating
- Check the **Tests** tab in each request
- Open Postman Console to see if variables are being saved
- Manually update variables in the collection Variables tab if needed

## 📞 Support

For issues or questions about the API, refer to the backend documentation or contact the development team.

---

**Happy Testing! 🚀**
