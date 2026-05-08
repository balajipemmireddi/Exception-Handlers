// authUtil.js — Auth data persistence layer
//
// Stores the AuthResponseDTO fields from the backend (or mock) into localStorage.
// Shape: { token, userId, name, role }  ← matches AuthResponseDTO exactly.
//
// JWT decode + store pattern (hackothon_context.md §7):
//   const decoded = JSON.parse(atob(token.split(".")[1]));
//   localStorage.setItem("token",  token);
//   localStorage.setItem("userId", decoded.userId);
//   localStorage.setItem("role",   decoded.role);
//   localStorage.setItem("name",   decoded.sub ?? "");
//
// When USE_MOCKS = true the token is not a real JWT, so we fall back to the
// raw AuthResponseDTO fields (token, userId, name, role) that apiService.js
// returns directly — no decode needed.

import { getToken, removeToken } from "./tokenHelper";

// ─── SAVE ─────────────────────────────────────────────────────────────────────

/**
 * Persist an AuthResponseDTO to localStorage.
 * Works for both real JWTs (decodes claims) and mock tokens (uses DTO fields).
 *
 * @param {Object} authResponse  - { token, userId, name, role }
 */
export const saveAuthData = (authResponse) => {
  const { token, userId, name, role } = authResponse;

  // Always store the raw token
  localStorage.setItem("token", token);

  // Try to decode the JWT for the remaining claims.
  // If the token is a mock (not a valid JWT), fall back to the DTO fields.
  try {
    const decoded = JSON.parse(atob(token.split(".")[1]));
    localStorage.setItem("userId", String(decoded.userId ?? userId));
    localStorage.setItem("role",   decoded.role  ?? role);
    localStorage.setItem("name",   decoded.sub   ?? name ?? "");
  } catch {
    // Mock token path — use AuthResponseDTO fields directly
    localStorage.setItem("userId", String(userId));
    localStorage.setItem("role",   role);
    localStorage.setItem("name",   name ?? "");
  }
};

// ─── READ ─────────────────────────────────────────────────────────────────────

/** Returns the stored user object or null */
export const getUser = () => {
  const token = getToken();
  if (!token) return null;

  return {
    token:  token,
    userId: localStorage.getItem("userId"),
    name:   localStorage.getItem("name"),
    role:   localStorage.getItem("role"),
  };
};

/** Returns the stored role string or null */
export const getRole = () => localStorage.getItem("role");

/** Returns true if a token exists in localStorage */
export const isAuthenticated = () => !!getToken();

// ─── CLEAR ────────────────────────────────────────────────────────────────────

/** Wipes all auth keys from localStorage */
export const logout = () => {
  removeToken();
  localStorage.removeItem("userId");
  localStorage.removeItem("role");
  localStorage.removeItem("name");
};
