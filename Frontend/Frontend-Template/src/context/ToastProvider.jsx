// ToastProvider.jsx — Global toast state provider.
//
// Wraps the app and renders a single Toast component at the top level.
// Any component can trigger a toast via the useToast() hook.
//
// Context value:
//   showToast(message, variant?, delay?)
//     message  String
//     variant  "success" | "danger" | "warning" | "info"  (default: "success")
//     delay    Number ms                                   (default: 4000)

import { useState, useCallback } from "react";
import { ToastContext } from "./ToastContext";
import Toast from "../components/common/Toast";

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    show:    false,
    message: "",
    variant: "success",
    delay:   4000,
  });

  /**
   * Trigger a toast notification.
   * @param {string} message
   * @param {"success"|"danger"|"warning"|"info"} variant
   * @param {number} delay  — auto-hide delay in ms
   */
  const showToast = useCallback((message, variant = "success", delay = 4000) => {
    // Reset first so re-triggering the same message still animates
    setToast({ show: false, message: "", variant, delay });
    // Small tick to allow React to flush the reset before showing
    setTimeout(() => {
      setToast({ show: true, message, variant, delay });
    }, 50);
  }, []);

  const handleClose = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Single global Toast rendered at the provider level */}
      <Toast
        show={toast.show}
        onClose={handleClose}
        message={toast.message}
        variant={toast.variant}
        delay={toast.delay}
      />
    </ToastContext.Provider>
  );
};
