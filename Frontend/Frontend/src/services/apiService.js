// apiService.js — Mock toggle layer for Hotel Booking App (RBAC Edition)
//
// USE_MOCKS = true  → returns MOCK_DATA (parallel frontend development)
// USE_MOCKS = false → delegates to real service files (authService, hotelService, etc.)
//
// All pages import from this file. Switch USE_MOCKS to false when the backend is ready.

import { login as authLogin, register as authRegister } from "./authService";
import { getHotels as hotelGetAll, searchHotels as hotelSearch, getHotelById as hotelGetById, createHotel as hotelCreate, updateHotel as hotelUpdate, deleteHotel as hotelDelete } from "./hotelService";
import { getRoomsByHotel as roomGetByHotel, addRoom as roomAdd, updateRoom as roomUpdate, deleteRoom as roomDelete } from "./roomService";
import { createBooking as bookingCreate, getUserBookings as bookingGetUser, cancelBooking as bookingCancel } from "./bookingService";
import { getAllBookings as adminGetAll, adminUpdateBooking as adminSvcUpdate, adminDeleteBooking as adminSvcDelete } from "./adminService";
import { getRevenue as superGetRevenue, getAnalytics as superGetAnalytics } from "./superAdminService";

export const USE_MOCKS = false;

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const MOCK_DATA = {
  hotels: [
    {
      id: 1, name: "Grand Palace Hotel", location: "Mumbai",
      imageUrl: "https://placehold.co/400x300/1a1a2e/ffffff?text=Grand+Palace",
      starRating: 4, startingPrice: 2500.00,
      description: "Luxury hotel in the heart of Mumbai.",
      rooms: [
        { id: 1, roomType: "SINGLE", price: 2500.00, capacity: 1, available: true  },
        { id: 2, roomType: "DOUBLE", price: 4000.00, capacity: 2, available: true  },
        { id: 3, roomType: "SUITE",  price: 8000.00, capacity: 4, available: false }
      ]
    },
    {
      id: 2, name: "Sea View Resort", location: "Goa",
      imageUrl: "https://placehold.co/400x300/0f3460/ffffff?text=Sea+View",
      starRating: 5, startingPrice: 5000.00,
      description: "Beachfront resort with stunning sea views.",
      rooms: [
        { id: 4, roomType: "DOUBLE", price: 5000.00, capacity: 2, available: true },
        { id: 5, roomType: "SUITE",  price: 9500.00, capacity: 3, available: true }
      ]
    },
    {
      id: 3, name: "City Comforts Inn", location: "Hyderabad",
      imageUrl: "https://placehold.co/400x300/16213e/ffffff?text=City+Comforts",
      starRating: 3, startingPrice: 1200.00,
      description: "Affordable and comfortable stay in Hyderabad.",
      rooms: [
        { id: 6, roomType: "SINGLE", price: 1200.00, capacity: 1, available: true  },
        { id: 7, roomType: "DOUBLE", price: 2000.00, capacity: 2, available: false }
      ]
    }
  ],
  bookings: [
    { id: 101, userId: 1, userName: "John Doe", hotelName: "Grand Palace Hotel", roomType: "DOUBLE", checkIn: "2025-06-01", checkOut: "2025-06-05", status: "CONFIRMED", totalAmount: 16000.00, createdAt: "2025-05-08T10:30:00" },
    { id: 102, userId: 1, userName: "John Doe", hotelName: "Sea View Resort",    roomType: "SUITE",  checkIn: "2025-07-10", checkOut: "2025-07-14", status: "CANCELLED", totalAmount: 38000.00, createdAt: "2025-05-01T09:00:00" }
  ],
  allBookings: [
    { id: 101, userId: 1, userName: "John Doe",   hotelName: "Grand Palace Hotel", roomType: "DOUBLE",  checkIn: "2025-06-01", checkOut: "2025-06-05", status: "CONFIRMED", totalAmount: 16000.00, createdAt: "2025-05-08T10:30:00" },
    { id: 102, userId: 1, userName: "John Doe",   hotelName: "Sea View Resort",    roomType: "SUITE",   checkIn: "2025-07-10", checkOut: "2025-07-14", status: "CANCELLED", totalAmount: 38000.00, createdAt: "2025-05-01T09:00:00" },
    { id: 103, userId: 2, userName: "Jane Smith", hotelName: "City Comforts Inn",  roomType: "SINGLE",  checkIn: "2025-06-15", checkOut: "2025-06-18", status: "CONFIRMED", totalAmount: 3600.00,  createdAt: "2025-05-06T14:00:00" }
  ],
  revenue: { totalRevenue: 1250000.00, monthlyRevenue: 186000.00, dailyRevenue: 22000.00, totalBookings: 348, confirmedBookings: 302, cancelledBookings: 46 },
  analytics: { totalUsers: 512, totalHotels: 18, totalRooms: 124, totalBookings: 348, mostBookedHotel: "Grand Palace Hotel", topLocation: "Mumbai", occupancyRate: 72.4 },
  authResponse: { token: "mock-jwt-token-xyz", userId: 1, name: "John Doe", role: "USER" }
};

const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms));

const mockError = (status, message) => {
  const err = new Error(message);
  err.response = { status, data: { status, message, timestamp: new Date().toISOString() } };
  return err;
};

// ─── AUTH ─────────────────────────────────────────────────────────────────────

export const login = async (data) => {
  if (USE_MOCKS) {
    await delay();
    if (!data.email || !data.password) throw mockError(401, "Invalid credentials");
    return MOCK_DATA.authResponse;
  }
  const res = await authLogin(data);
  return res.data;
};

export const register = async (data) => {
  if (USE_MOCKS) {
    await delay();
    if (!data.name || !data.email || !data.password) throw mockError(400, "All fields are required");
    if (data.email === "taken@example.com") throw mockError(409, "Email already exists. Please use a different email or sign in.");
    return { ...MOCK_DATA.authResponse, name: data.name };
  }
  const res = await authRegister(data);
  return res.data;
};

// ─── HOTELS ───────────────────────────────────────────────────────────────────

export const getHotels = async () => {
  if (USE_MOCKS) {
    await delay();
    return MOCK_DATA.hotels.map(({ id, name, location, imageUrl, starRating, startingPrice }) => ({ id, name, location, imageUrl, starRating, startingPrice }));
  }
  const res = await hotelGetAll();
  return res.data;
};

export const searchHotels = async (params = {}) => {
  if (USE_MOCKS) {
    await delay();
    const { location = "", checkIn = "", checkOut = "" } = params;
    const results = MOCK_DATA.hotels.filter((h) => {
      const locMatch = location ? h.location.toLowerCase().includes(location.toLowerCase()) : true;
      const hasRoom  = h.rooms.some((r) => r.available);
      return locMatch && (checkIn && checkOut ? hasRoom : true);
    });
    return results.map(({ id, name, location: loc, imageUrl, starRating, startingPrice }) => ({ id, name, location: loc, imageUrl, starRating, startingPrice }));
  }
  const res = await hotelSearch(params);
  return res.data;
};

export const getHotelById = async (id) => {
  if (USE_MOCKS) {
    await delay();
    const h = MOCK_DATA.hotels.find((h) => h.id === Number(id));
    if (!h) throw mockError(404, "Hotel not found");
    const { id: hId, name, location, description, imageUrl, starRating, rooms } = h;
    return { id: hId, name, location, description, imageUrl, starRating, rooms };
  }
  const res = await hotelGetById(id);
  return res.data;
};

export const createHotel = async (data) => {
  if (USE_MOCKS) { await delay(); return { id: Date.now(), ...data, rooms: [] }; }
  const res = await hotelCreate(data);
  return res.data;
};

export const updateHotel = async (id, data) => {
  if (USE_MOCKS) {
    await delay();
    const h = MOCK_DATA.hotels.find((h) => h.id === Number(id));
    if (!h) throw mockError(404, "Hotel not found");
    return { ...h, ...data };
  }
  const res = await hotelUpdate(id, data);
  return res.data;
};

export const deleteHotel = async (id) => {
  if (USE_MOCKS) { await delay(); return { message: "Hotel deleted successfully" }; }
  const res = await hotelDelete(id);
  return res.data;
};

// ─── ROOMS ────────────────────────────────────────────────────────────────────

export const getRoomsByHotel = async (hotelId) => {
  if (USE_MOCKS) {
    await delay();
    const h = MOCK_DATA.hotels.find((h) => h.id === Number(hotelId));
    if (!h) throw mockError(404, "Hotel not found");
    return h.rooms || [];
  }
  const res = await roomGetByHotel(hotelId);
  return res.data;
};

export const addRoom = async (hotelId, data) => {
  if (USE_MOCKS) {
    await delay();
    const newRoom = { id: Date.now(), ...data, available: true };
    return newRoom;
  }
  const res = await roomAdd(hotelId, data);
  return res.data;
};

export const updateRoom = async (hotelId, roomId, data) => {
  if (USE_MOCKS) {
    await delay();
    const h = MOCK_DATA.hotels.find((h) => h.id === Number(hotelId));
    const r = h?.rooms.find((r) => r.id === Number(roomId));
    if (!r) throw mockError(404, "Room not found");
    return { ...r, ...data };
  }
  const res = await roomUpdate(hotelId, roomId, data);
  return res.data;
};

export const deleteRoom = async (hotelId, roomId) => {
  if (USE_MOCKS) { await delay(); return { message: "Room deleted successfully" }; }
  const res = await roomDelete(hotelId, roomId);
  return res.data;
};

// ─── BOOKINGS — USER ──────────────────────────────────────────────────────────

export const createBooking = async (data) => {
  if (USE_MOCKS) {
    await delay();
    const h = MOCK_DATA.hotels.find((h) => h.id === Number(data.hotelId));
    const r = h?.rooms.find((r) => r.id === Number(data.roomId));
    if (!h || !r) throw mockError(404, "Hotel or room not found");
    const nights = Math.max(1, Math.ceil((new Date(data.checkOut) - new Date(data.checkIn)) / 86400000));
    return { id: Date.now(), userId: MOCK_DATA.authResponse.userId, userName: MOCK_DATA.authResponse.name, hotelName: h.name, roomType: r.roomType, checkIn: data.checkIn, checkOut: data.checkOut, status: "CONFIRMED", totalAmount: r.price * nights, createdAt: new Date().toISOString() };
  }
  const res = await bookingCreate(data);
  return res.data;
};

export const getUserBookings = async (userId) => {
  if (USE_MOCKS) { await delay(); return MOCK_DATA.bookings.filter((b) => b.userId === Number(userId)); }
  const res = await bookingGetUser(userId);
  return res.data;
};

export const cancelBooking = async (id) => {
  if (USE_MOCKS) {
    await delay();
    const b = MOCK_DATA.bookings.find((b) => b.id === Number(id));
    if (!b) throw mockError(404, "Booking not found");
    return { ...b, status: "CANCELLED" };
  }
  const res = await bookingCancel(id);
  return res.data;
};

// ─── BOOKINGS — ADMIN ─────────────────────────────────────────────────────────

export const getAllBookings = async () => {
  if (USE_MOCKS) { await delay(); return [...MOCK_DATA.allBookings]; }
  const res = await adminGetAll();
  return res.data;
};

export const adminUpdateBooking = async (id, data) => {
  if (USE_MOCKS) {
    await delay();
    const b = MOCK_DATA.allBookings.find((b) => b.id === Number(id));
    if (!b) throw mockError(404, "Booking not found");
    return { ...b, ...data };
  }
  const res = await adminSvcUpdate(id, data);
  return res.data;
};

export const adminDeleteBooking = async (id) => {
  if (USE_MOCKS) { await delay(); return { message: "Booking deleted successfully" }; }
  const res = await adminSvcDelete(id);
  return res.data;
};

// ─── ANALYTICS — SUPER_ADMIN ──────────────────────────────────────────────────

export const getRevenue = async () => {
  if (USE_MOCKS) { await delay(); return { ...MOCK_DATA.revenue }; }
  const res = await superGetRevenue();
  return res.data;
};

export const getAnalytics = async () => {
  if (USE_MOCKS) { await delay(); return { ...MOCK_DATA.analytics }; }
  const res = await superGetAnalytics();
  return res.data;
};
