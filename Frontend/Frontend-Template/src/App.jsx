import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import AppNavbar          from "./components/Navbar";
import ProtectedRoute     from "./components/ProtectedRoute";

import Home                from "./pages/Home";
import LoginPage           from "./pages/LoginPage";
import SignupPage          from "./pages/SignupPage";
import HotelDetail         from "./pages/HotelDetail";
import DashBoard           from "./pages/DashBoard";
import UserDashboard       from "./pages/UserDashboard";
import AdminDashboard      from "./pages/AdminDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";

function NotFound() {
  return (
    <div className="container text-center py-5">
      <h2>404 — Page Not Found</h2>
      <p className="text-muted">The page you're looking for doesn't exist.</p>
    </div>
  );
}

export default function App() {
  return (
    <>
      <AppNavbar />
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        {/* PUBLIC */}
        <Route path="/"           element={<Home />} />
        <Route path="/login"      element={<LoginPage />} />
        <Route path="/signup"     element={<SignupPage />} />
        <Route path="/hotels/:id" element={<HotelDetail />} />

        {/* PROTECTED: any authenticated user */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={["USER", "ADMIN", "SUPER_ADMIN"]}>
            <DashBoard />
          </ProtectedRoute>
        } />
        <Route path="/user/dashboard" element={
          <ProtectedRoute allowedRoles={["USER", "ADMIN", "SUPER_ADMIN"]}>
            <UserDashboard />
          </ProtectedRoute>
        } />

        {/* PROTECTED: ADMIN + SUPER_ADMIN */}
        <Route path="/admin/bookings" element={
          <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        {/* PROTECTED: SUPER_ADMIN only */}
        <Route path="/superadmin/analytics" element={
          <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
            <SuperAdminDashboard />
          </ProtectedRoute>
        } />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
