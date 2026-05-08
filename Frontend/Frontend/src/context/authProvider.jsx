// authProvider.jsx — Global authentication state provider.
//
// Wraps the app and exposes:
//   user           — { token, userId, name, role } | null
//   role           — "USER" | "ADMIN" | "SUPER_ADMIN" | null
//   isAuthenticated — boolean
//   login(authResponse) — persists AuthResponseDTO and updates state
//   logout()            — clears localStorage and resets state
//
// Role-gate helpers (hackothon_context.md §7):
//   isUser       — true for USER, ADMIN, SUPER_ADMIN
//   isAdmin      — true for ADMIN, SUPER_ADMIN
//   isSuperAdmin — true for SUPER_ADMIN only

import { useState } from "react";
import { AuthContext } from "./authContext";
import { saveAuthData, getUser, getRole, logout as logoutUtil, isAuthenticated as checkAuth } from "../utils/authUtil";

export const AuthProvider = ({ children }) => {
  // Initialise from localStorage so state survives page refresh
  const [user,            setUser]            = useState(getUser());
  const [role,            setRole]            = useState(getRole());
  const [isAuthenticated, setIsAuthenticated] = useState(checkAuth());

  /**
   * Call after a successful login or register.
   * Accepts the full AuthResponseDTO: { token, userId, name, role }
   */
  const login = (authResponse) => {
    // Persist to localStorage using the pattern from hackothon_context.md §7
    saveAuthData(authResponse);

    // Sync React state
    const stored = getUser();
    setUser(stored);
    setRole(stored.role);
    setIsAuthenticated(true);
  };

  /** Clears all auth state and localStorage */
  const logout = () => {
    logoutUtil();
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
  };

  // ─── Role-gate helpers (hackothon_context.md §7) ──────────────────────────
  // Derived from the live `role` state — always in sync with the context.
  const isUser       = role === "USER"       || role === "ADMIN" || role === "SUPER_ADMIN";
  const isAdmin      = role === "ADMIN"      || role === "SUPER_ADMIN";
  const isSuperAdmin = role === "SUPER_ADMIN";

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        login,
        logout,
        isUser,
        isAdmin,
        isSuperAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
