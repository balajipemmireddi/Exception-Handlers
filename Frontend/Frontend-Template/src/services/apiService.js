// ─────────────────────────────────────────────────────────────────────────────
// apiService.js  —  Centralized API layer for Hotel Booking App (RBAC Edition)
//
// ── PHASE 12: BACKEND INTEGRATION CHECKLIST ──────────────────────────────────
//
//  Step 1 — Set the toggle:
//    const USE_MOCKS = false;
//
//  Step 2 — Set the backend URL in .env:
//    VITE_API_BASE_URL=http://localhost:8080
//    (or your staging / production URL)
//
//  Step 3 — Start the Spring Boot backend on port 8080.
//
//  Step 4 — Run the frontend:
//    npm run dev
//
//  Step 5 — Open DevTools → Network tab and verify:
//    • Requests fire to http://localhost:8080/api/...
//    • Authorization: Bearer <token> header is present on protected routes
//    • Responses match the DTO shapes in hackothon_context.md §3
//
//  Step 6 — If CORS errors appear, either:
//    a) Add the Vite dev proxy in vite.config.js (already configured), OR
//    b) Add @CrossOrigin("http://localhost:5173") to Spring Boot controllers
//
// ── TOGGLE ────────────────────────────────────────────────────────────────────
//   true  → returns MOCK_DATA  (parallel frontend development — Phases 1–11)
//   false → fires real fetch() requests to VITE_API_BASE_URL (Phase 12+)
// ─────────────────────────────────────────────────────────────────────────────

const USE_MOCKS = true;

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
// Fields match backend ResponseDTOs exactly (see hackothon_context.md §6).
// Do NOT add or remove any field from these objects.

const MOCK_DATA = {
  // HotelSummaryDTO + HotelDetailDTO (rooms embedded for detail view)
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

  // BookingResponseDTO — current user's bookings (USER view)
  bookings: [
    {
      id: 101,
      userId: 1,
      userName: "John Doe",
      hotelName: "Grand Palace Hotel",
      roomType: "DOUBLE",
      checkIn: "2025-06-01",
      checkOut: "2025-06-05",
      status: "CONFIRMED",
      totalAmount: 16000.00,
      createdAt: "2025-05-08T10:30:00"
    },
    {
      id: 102,
      userId: 1,
      userName: "John Doe",
      hotelName: "Sea View Resort",
      roomType: "SUITE",
      checkIn: "2025-07-10",
      checkOut: "2025-07-14",
      status: "CANCELLED",
      totalAmount: 38000.00,
      createdAt: "2025-05-01T09:00:00"
    }
  ],

  // BookingResponseDTO — all bookings across all users (ADMIN view)
  allBookings: [
    {
      id: 101,
      userId: 1,
      userName: "John Doe",
      hotelName: "Grand Palace Hotel",
      roomType: "DOUBLE",
      checkIn: "2025-06-01",
      checkOut: "2025-06-05",
      status: "CONFIRMED",
      totalAmount: 16000.00,
      createdAt: "2025-05-08T10:30:00"
    },
    {
      id: 102,
      userId: 1,
      userName: "John Doe",
      hotelName: "Sea View Resort",
      roomType: "SUITE",
      checkIn: "2025-07-10",
      checkOut: "2025-07-14",
      status: "CANCELLED",
      totalAmount: 38000.00,
      createdAt: "2025-05-01T09:00:00"
    },
    {
      id: 103,
      userId: 2,
      userName: "Jane Smith",
      hotelName: "City Comforts Inn",
      roomType: "SINGLE",
      checkIn: "2025-06-15",
      checkOut: "2025-06-18",
      status: "CONFIRMED",
      totalAmount: 3600.00,
      createdAt: "2025-05-06T14:00:00"
    }
  ],

  // RevenueDTO (SUPER_ADMIN only)
  revenue: {
    totalRevenue: 1250000.00,
    monthlyRevenue: 186000.00,
    dailyRevenue: 22000.00,
    totalBookings: 348,
    confirmedBookings: 302,
    cancelledBookings: 46
  },

  // SystemAnalyticsDTO (SUPER_ADMIN only)
  analytics: {
    totalUsers: 512,
    totalHotels: 18,
    totalRooms: 124,
    totalBookings: 348,
    mostBookedHotel: "Grand Palace Hotel",
    topLocation: "Mumbai",
    occupancyRate: 72.4
  },

  // AuthResponseDTO — change role to "ADMIN" or "SUPER_ADMIN" to test those flows
  authResponse: {
    token: "mock-jwt-token-xyz",
    userId: 1,
    name: "John Doe",
    role: "USER"   // "USER" | "ADMIN" | "SUPER_ADMIN"
  }
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────

/** Simulate async network delay (ms) */
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

/** Build Authorization header from localStorage token */
const authHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/** Standardised error shape matching backend §8 */
const mockError = (status, message) => {
  const err = new Error(message);
  err.response = {
    status,
    data: {
      status,
      message,
      timestamp: new Date().toISOString()
    }
  };
  return err;
};

/**
 * handleResponse — Normalises real fetch() responses into the standardised
 * error shape { status, message, timestamp } (hackothon_context.md §8).
 *
 * Handles three failure modes:
 *   1. Backend returned JSON error body  → use its { status, message }
 *   2. Backend returned non-JSON (HTML)  → use HTTP status text
 *   3. Network failure (no response)     → "Network error" message
 *
 * On success (2xx) returns the parsed JSON body.
 *
 * @param {Response} res  — native fetch Response
 * @returns {Promise<any>}
 */
const handleResponse = async (res) => {
  if (res.ok) {
    // 204 No Content — return empty object
    if (res.status === 204) return {};
    return res.json();
  }

  // Try to parse the backend error body as JSON
  let errorData;
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    try {
      errorData = await res.json();
    } catch {
      errorData = null;
    }
  }

  // Build a normalised error matching backend §8 shape
  const err = new Error(errorData?.message || res.statusText || "Request failed");
  err.response = {
    status: res.status,
    data: {
      status:    errorData?.status    ?? res.status,
      message:   errorData?.message   ?? res.statusText ?? "An unexpected error occurred.",
      timestamp: errorData?.timestamp ?? new Date().toISOString(),
    },
  };
  throw err;
};

// ─── AUTH ─────────────────────────────────────────────────────────────────────

/**
 * POST /api/auth/login
 * Returns AuthResponseDTO: { token, userId, name, role }
 */
export const login = async (credentials) => {
  if (USE_MOCKS) {
    await delay();
    // Simulate invalid-credentials error for empty payload
    if (!credentials.email || !credentials.password) {
      throw mockError(401, "Invalid credentials");
    }
    return { ...MOCK_DATA.authResponse };
  }

  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials)
  });
  return handleResponse(res);
};

/**
 * POST /api/auth/register
 * Returns AuthResponseDTO: { token, userId, name, role }
 *
 * Mock error simulation:
 *   - Missing fields          → 400 "All fields are required"
 *   - email already registered → 409 "Email already exists"
 *     (simulate by using the same email as the mock authResponse)
 */
export const register = async (userData) => {
  if (USE_MOCKS) {
    await delay();
    if (!userData.name || !userData.email || !userData.password) {
      throw mockError(400, "All fields are required");
    }
    // Simulate duplicate-email error — triggers when the submitted email
    // matches the mock user's email so the error path can be tested in the UI.
    if (userData.email === "taken@example.com") {
      throw mockError(409, "Email already exists. Please use a different email or sign in.");
    }
    return { ...MOCK_DATA.authResponse, name: userData.name };
  }

  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData)
  });
  return handleResponse(res);
};

// ─── HOTELS ───────────────────────────────────────────────────────────────────

/**
 * GET /api/hotels
 * Returns HotelSummaryDTO[]
 */
export const getHotels = async () => {
  if (USE_MOCKS) {
    await delay();
    return MOCK_DATA.hotels.map(({ id, name, location, imageUrl, starRating, startingPrice }) => ({
      id, name, location, imageUrl, starRating, startingPrice
    }));
  }

  const res = await fetch(`${BASE_URL}/api/hotels`);
  return handleResponse(res);
};

/**
 * GET /api/hotels/search?location=&checkIn=&checkOut=
 * Returns HotelSummaryDTO[] filtered by location (case-insensitive) and date
 */
export const searchHotels = async ({ location = "", checkIn = "", checkOut = "" } = {}) => {
  if (USE_MOCKS) {
    await delay();
    const results = MOCK_DATA.hotels.filter((hotel) => {
      const locationMatch = location
        ? hotel.location.toLowerCase().includes(location.toLowerCase())
        : true;
      // Mock date filtering: return hotels that have at least one available room
      const hasAvailableRoom = hotel.rooms.some((r) => r.available);
      const dateFilter = checkIn && checkOut ? hasAvailableRoom : true;
      return locationMatch && dateFilter;
    });
    return results.map(({ id, name, location: loc, imageUrl, starRating, startingPrice }) => ({
      id, name, location: loc, imageUrl, starRating, startingPrice
    }));
  }

  const params = new URLSearchParams({ location, checkIn, checkOut }).toString();
  const res = await fetch(`${BASE_URL}/api/hotels/search?${params}`);
  return handleResponse(res);
};

/**
 * GET /api/hotels/:id
 * Returns HotelDetailDTO: { id, name, location, description, imageUrl, starRating, rooms[] }
 */
export const getHotelById = async (id) => {
  if (USE_MOCKS) {
    await delay();
    const hotel = MOCK_DATA.hotels.find((h) => h.id === Number(id));
    if (!hotel) throw mockError(404, "Hotel not found");
    const { id: hId, name, location, description, imageUrl, starRating, rooms } = hotel;
    return { id: hId, name, location, description, imageUrl, starRating, rooms };
  }

  const res = await fetch(`${BASE_URL}/api/hotels/${id}`);
  return handleResponse(res);
};

/**
 * POST /api/hotels  (ADMIN)
 * Returns created HotelDetailDTO
 */
export const createHotel = async (hotelData) => {
  if (USE_MOCKS) {
    await delay();
    const newHotel = { id: Date.now(), ...hotelData, rooms: [] };
    return newHotel;
  }

  const res = await fetch(`${BASE_URL}/api/hotels`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(hotelData)
  });
  return handleResponse(res);
};

/**
 * PUT /api/hotels/:id  (ADMIN)
 * Returns updated HotelDetailDTO
 */
export const updateHotel = async (id, hotelData) => {
  if (USE_MOCKS) {
    await delay();
    const hotel = MOCK_DATA.hotels.find((h) => h.id === Number(id));
    if (!hotel) throw mockError(404, "Hotel not found");
    return { ...hotel, ...hotelData };
  }

  const res = await fetch(`${BASE_URL}/api/hotels/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(hotelData)
  });
  return handleResponse(res);
};

/**
 * DELETE /api/hotels/:id  (ADMIN)
 */
export const deleteHotel = async (id) => {
  if (USE_MOCKS) {
    await delay();
    return { message: "Hotel deleted successfully" };
  }

  const res = await fetch(`${BASE_URL}/api/hotels/${id}`, {
    method: "DELETE",
    headers: { ...authHeader() }
  });
  return handleResponse(res);
};

// ─── BOOKINGS — USER ──────────────────────────────────────────────────────────

/**
 * POST /api/bookings  (USER)
 * Returns BookingResponseDTO
 */
export const createBooking = async (bookingRequest) => {
  if (USE_MOCKS) {
    await delay();
    const hotel = MOCK_DATA.hotels.find((h) => h.id === Number(bookingRequest.hotelId));
    const room  = hotel?.rooms.find((r) => r.id === Number(bookingRequest.roomId));
    if (!hotel || !room) throw mockError(404, "Hotel or room not found");

    const checkInDate  = new Date(bookingRequest.checkIn);
    const checkOutDate = new Date(bookingRequest.checkOut);
    const nights = Math.max(1, Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)));

    return {
      id: Date.now(),
      userId: MOCK_DATA.authResponse.userId,
      userName: MOCK_DATA.authResponse.name,
      hotelName: hotel.name,
      roomType: room.roomType,
      checkIn: bookingRequest.checkIn,
      checkOut: bookingRequest.checkOut,
      status: "CONFIRMED",
      totalAmount: room.price * nights,
      createdAt: new Date().toISOString()
    };
  }

  const res = await fetch(`${BASE_URL}/api/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(bookingRequest)
  });
  return handleResponse(res);
};

/**
 * GET /api/bookings/user/:userId  (USER)
 * Returns BookingResponseDTO[]
 */
export const getUserBookings = async (userId) => {
  if (USE_MOCKS) {
    await delay();
    return MOCK_DATA.bookings.filter((b) => b.userId === Number(userId));
  }

  const res = await fetch(`${BASE_URL}/api/bookings/user/${userId}`, {
    headers: { ...authHeader() }
  });
  return handleResponse(res);
};

/**
 * PUT /api/bookings/:id/cancel  (USER)
 * Returns updated BookingResponseDTO with status "CANCELLED"
 */
export const cancelBooking = async (id) => {
  if (USE_MOCKS) {
    await delay();
    const booking = MOCK_DATA.bookings.find((b) => b.id === Number(id));
    if (!booking) throw mockError(404, "Booking not found");
    return { ...booking, status: "CANCELLED" };
  }

  const res = await fetch(`${BASE_URL}/api/bookings/${id}/cancel`, {
    method: "PUT",
    headers: { ...authHeader() }
  });
  return handleResponse(res);
};

// ─── BOOKINGS — ADMIN ─────────────────────────────────────────────────────────

/**
 * GET /api/admin/bookings  (ADMIN)
 * Returns BookingResponseDTO[] — all system-wide bookings
 */
export const getAllBookings = async () => {
  if (USE_MOCKS) {
    await delay();
    return [...MOCK_DATA.allBookings];
  }

  const res = await fetch(`${BASE_URL}/api/admin/bookings`, {
    headers: { ...authHeader() }
  });
  return handleResponse(res);
};

/**
 * PUT /api/admin/bookings/:id  (ADMIN)
 * Returns updated BookingResponseDTO
 */
export const adminUpdateBooking = async (id, updateData) => {
  if (USE_MOCKS) {
    await delay();
    const booking = MOCK_DATA.allBookings.find((b) => b.id === Number(id));
    if (!booking) throw mockError(404, "Booking not found");
    return { ...booking, ...updateData };
  }

  const res = await fetch(`${BASE_URL}/api/admin/bookings/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(updateData)
  });
  return handleResponse(res);
};

/**
 * DELETE /api/admin/bookings/:id  (ADMIN)
 * Returns { message: "Booking deleted successfully" }
 */
export const adminDeleteBooking = async (id) => {
  if (USE_MOCKS) {
    await delay();
    return { message: "Booking deleted successfully" };
  }

  const res = await fetch(`${BASE_URL}/api/admin/bookings/${id}`, {
    method: "DELETE",
    headers: { ...authHeader() }
  });
  return handleResponse(res);
};

// ─── ANALYTICS — SUPER_ADMIN ──────────────────────────────────────────────────

/**
 * GET /api/superadmin/revenue  (SUPER_ADMIN)
 * Returns RevenueDTO
 */
export const getRevenue = async () => {
  if (USE_MOCKS) {
    await delay();
    return { ...MOCK_DATA.revenue };
  }

  const res = await fetch(`${BASE_URL}/api/superadmin/revenue`, {
    headers: { ...authHeader() }
  });
  return handleResponse(res);
};

/**
 * GET /api/superadmin/analytics  (SUPER_ADMIN)
 * Returns SystemAnalyticsDTO
 */
export const getAnalytics = async () => {
  if (USE_MOCKS) {
    await delay();
    return { ...MOCK_DATA.analytics };
  }

  const res = await fetch(`${BASE_URL}/api/superadmin/analytics`, {
    headers: { ...authHeader() }
  });
  return handleResponse(res);
};

// ─── EXPORT TOGGLE (for debugging / Phase 12 verification) ───────────────────
export { USE_MOCKS };
