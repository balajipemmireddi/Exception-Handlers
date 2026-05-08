// App.jsx — Root router.
//
// Route table (Phase 3):
//   PUBLIC
//     /                    → Home          (hotel listing)
//     /login               → LoginPage
//     /signup              → SignupPage
//     /hotels/:id          → HotelDetail
//
//   PROTECTED — any authenticated user (USER | ADMIN | SUPER_ADMIN)
//     /dashboard           → DashBoard     (generic post-login landing)
//     /user/dashboard      → UserDashboard (own bookings)
//
//   PROTECTED — ADMIN | SUPER_ADMIN
//     /admin/bookings      → AdminDashboard
//
//   PROTECTED — SUPER_ADMIN only
//     /superadmin/analytics → SuperAdminDashboard
//
//   CATCH-ALL
//     *                    → NotFound (404)

import { BrowserRouter, Routes, Route } from "react-router-dom";

import AppNavbar          from "./components/Navbar";
import ProtectedRoute     from "./components/ProtectedRoute";

// Pages
import Home                from "./pages/Home";
import LoginPage           from "./pages/LoginPage";
import SignupPage          from "./pages/SignupPage";
import HotelDetail         from "./pages/HotelDetail";
import DashBoard           from "./pages/DashBoard";
import UserDashboard       from "./pages/UserDashboard";
import AdminDashboard      from "./pages/AdminDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";

// Inline 404 — no separate file needed for a one-liner placeholder
function NotFound() {
  return (
    <div className="text-center py-5">
      <h2 className="display-6 fw-bold">404 — Page Not Found</h2>
      <p className="text-muted">The page you're looking for doesn't exist.</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      {/* Persistent top navigation */}
      <AppNavbar />

      <Routes>
        {/* ── PUBLIC ─────────────────────────────────────────────────── */}
        <Route path="/"           element={<Home />} />
        <Route path="/login"      element={<LoginPage />} />
        <Route path="/signup"     element={<SignupPage />} />
        <Route path="/hotels/:id" element={<HotelDetail />} />

        {/* ── PROTECTED: any authenticated user ──────────────────────── */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["USER", "ADMIN", "SUPER_ADMIN"]}>
              <DashBoard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute allowedRoles={["USER", "ADMIN", "SUPER_ADMIN"]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        {/* ── PROTECTED: ADMIN + SUPER_ADMIN ─────────────────────────── */}
        <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* ── PROTECTED: SUPER_ADMIN only ─────────────────────────────── */}
        <Route
          path="/superadmin/analytics"
          element={
            <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
              <SuperAdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* ── CATCH-ALL ───────────────────────────────────────────────── */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
