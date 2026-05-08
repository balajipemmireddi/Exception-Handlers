// useToast.js — Convenience hook for triggering global toast notifications.
//
// Usage:
//   const { showToast } = useToast();
//   showToast("Booking confirmed!", "success");
//   showToast("Login failed", "danger");
//   showToast("Check your input", "warning");
//   showToast("Loading data…", "info");
//
// Throws a clear error if used outside <ToastProvider>.

import { useContext } from "react";
import { ToastContext } from "../context/ToastContext";

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside <ToastProvider>");
  }

  return context;
};
