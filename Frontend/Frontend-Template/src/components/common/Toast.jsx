// Toast.jsx — Global toast notification component.
//
// Renders a fixed-position Bootstrap Toast that auto-dismisses after a delay.
// Controlled by ToastContext — use the useToast() hook to trigger toasts.
//
// Props:
//   show       Boolean
//   onClose()
//   message    String
//   variant    "success" | "danger" | "warning" | "info"
//   delay      Number (ms) — auto-hide delay, default 4000

import { Toast as BSToast, ToastContainer } from "react-bootstrap";

export default function Toast({ show, onClose, message, variant = "success", delay = 4000 }) {
  // Map variant to Bootstrap bg classes
  const bgClass = {
    success: "bg-success",
    danger:  "bg-danger",
    warning: "bg-warning",
    info:    "bg-info",
  }[variant] || "bg-success";

  // Icon per variant
  const icon = {
    success: "✓",
    danger:  "✗",
    warning: "⚠",
    info:    "ℹ",
  }[variant] || "✓";

  return (
    <ToastContainer
      position="top-end"
      className="p-3"
      style={{ position: "fixed", top: 0, right: 0, zIndex: 9999 }}
    >
      <BSToast
        show={show}
        onClose={onClose}
        delay={delay}
        autohide
        className={`${bgClass} text-white border-0 shadow-lg`}
      >
        <BSToast.Header closeButton className={`${bgClass} text-white border-0`}>
          <strong className="me-auto d-flex align-items-center gap-2">
            <span style={{ fontSize: "1.25rem" }} aria-hidden="true">{icon}</span>
            <span>Notification</span>
          </strong>
        </BSToast.Header>
        <BSToast.Body className="fw-medium">
          {message}
        </BSToast.Body>
      </BSToast>
    </ToastContainer>
  );
}
