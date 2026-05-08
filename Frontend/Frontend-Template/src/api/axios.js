// axios.js — Pre-configured Axios instance.
//
// Phase 12: baseURL reads from VITE_API_BASE_URL environment variable.
// Set VITE_API_BASE_URL in .env (see .env.example).
//
// The Authorization interceptor automatically attaches the JWT from
// localStorage to every request — matching the pattern in apiService.js.

import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // 15 s — prevents requests hanging indefinitely
});

// ── Request interceptor: attach Bearer token ──────────────────────────────
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: normalise errors ────────────────────────────────
// Transforms Axios error responses into the standardised shape
// { status, message, timestamp } matching backend §8 and apiService.js.
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status    = error.response?.status ?? 0;
    const message   = error.response?.data?.message
                   ?? error.message
                   ?? "An unexpected error occurred.";
    const timestamp = error.response?.data?.timestamp
                   ?? new Date().toISOString();

    const normalised = new Error(message);
    normalised.response = {
      status,
      data: { status, message, timestamp },
    };

    return Promise.reject(normalised);
  }
);

export default API;
