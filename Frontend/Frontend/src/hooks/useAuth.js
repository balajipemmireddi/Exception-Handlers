// useAuth.js — Convenience hook for consuming AuthContext.
//
// Usage:
//   const { user, role, isAuthenticated, login, logout,
//           isUser, isAdmin, isSuperAdmin } = useAuth();
//
// Throws a clear error if used outside <AuthProvider> so bugs surface fast.

import { useContext } from "react";
import { AuthContext } from "../context/authContext";

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }

  return context;
};
