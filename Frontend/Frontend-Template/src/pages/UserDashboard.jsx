// UserDashboard.jsx — Phase 8: User booking dashboard at /user/dashboard.
// Protected: USER | ADMIN | SUPER_ADMIN.
//
// Fetches BookingResponseDTO[] from apiService.getUserBookings(userId).
// Allows cancellation via apiService.cancelBooking(id).
// Updates local state optimistically on cancel — no full re-fetch needed.
//
// BookingResponseDTO shape (hackothon_context.md §3):
//   { id, userId, userName, hotelName, roomType, checkIn, checkOut,
//     status, totalAmount, createdAt }

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Container, Card, Table, Badge, Button,
  Spinner, Alert, Modal,
} from "react-bootstrap";
import { getUserBookings, cancelBooking } from "../services/apiService";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";

// ── Status badge helper ───────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const variant = status === "CONFIRMED" ? "success" : "secondary";
  return <Badge bg={variant}>{status}</Badge>;
}

export default function UserDashboard() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [bookings,       setBookings]       = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState(null);

  // Cancel confirmation modal state
  const [cancelTarget,   setCancelTarget]   = useState(null);   // booking to cancel
  const [cancelling,     setCancelling]     = useState(false);
  const [cancelError,    setCancelError]    = useState(null);

  // Success toast state
  const [successMsg,     setSuccessMsg]     = useState(null);

  // ── Fetch user's bookings on mount ────────────────────────────────────────
  useEffect(() => {
    if (!user?.userId) return;

    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        // GET /api/bookings/user/:userId → BookingResponseDTO[]
        const data = await getUserBookings(user.userId);
        setBookings(data);
      } catch (err) {
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load bookings.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user?.userId]);

  // ── Cancel flow ───────────────────────────────────────────────────────────
  const handleCancelClick = (booking) => {
    setCancelError(null);
    setCancelTarget(booking);
  };

  const handleCancelConfirm = async () => {
    if (!cancelTarget) return;
    setCancelling(true);
    setCancelError(null);
    try {
      // PUT /api/bookings/:id/cancel → updated BookingResponseDTO { status: "CANCELLED" }
      const updated = await cancelBooking(cancelTarget.id);

      // Update local state — no full re-fetch
      setBookings((prev) =>
        prev.map((b) => (b.id === updated.id ? updated : b))
      );

      setSuccessMsg(`Booking #${updated.id} (${updated.hotelName}) has been cancelled.`);
      showToast(`Booking #${updated.id} cancelled.`, "warning");
      setCancelTarget(null);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Cancellation failed. Please try again.";
      setCancelError(msg);
    } finally {
      setCancelling(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Container className="py-5">

      {/* ── Page header ─────────────────────────────────────────────── */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-1">My Bookings</h2>
          <p className="text-muted mb-0 small">
            Logged in as <strong>{user?.name}</strong>{" "}
            <Badge bg="primary">{user?.role}</Badge>
          </p>
        </div>
        <Button as={Link} to="/" variant="outline-primary" size="sm">
          + Book a Hotel
        </Button>
      </div>

      {/* ── Success banner ───────────────────────────────────────────── */}
      {successMsg && (
        <Alert
          variant="success"
          dismissible
          onClose={() => setSuccessMsg(null)}
          className="mb-4"
        >
          ✓ {successMsg}
        </Alert>
      )}

      {/* ── Loading ──────────────────────────────────────────────────── */}
      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" role="status">
            <span className="visually-hidden">Loading bookings…</span>
          </Spinner>
          <p className="text-muted mt-3">Loading your bookings…</p>
        </div>
      )}

      {/* ── Fetch error ──────────────────────────────────────────────── */}
      {!loading && error && (
        <Alert variant="danger">
          <Alert.Heading>Unable to load bookings</Alert.Heading>
          <p className="mb-0">{error}</p>
        </Alert>
      )}

      {/* ── Empty state ──────────────────────────────────────────────── */}
      {!loading && !error && bookings.length === 0 && (
        <Alert variant="info" className="text-center">
          <Alert.Heading>No bookings yet</Alert.Heading>
          <p className="mb-3">You haven't made any bookings. Start exploring hotels!</p>
          <Button as={Link} to="/" variant="primary">
            Browse Hotels
          </Button>
        </Alert>
      )}

      {/* ── Bookings table ───────────────────────────────────────────── */}
      {!loading && !error && bookings.length > 0 && (
        <Card className="shadow-sm border-0">
          <Card.Body className="p-0">
            <Table responsive hover className="mb-0 align-middle">
              <thead className="table-dark">
                <tr>
                  <th className="ps-3">#</th>
                  <th>Hotel</th>
                  <th>Room</th>
                  <th>Check-In</th>
                  <th>Check-Out</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th className="pe-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="ps-3 text-muted small">#{booking.id}</td>
                    <td className="fw-medium">{booking.hotelName}</td>
                    <td>
                      <Badge bg="light" text="dark" className="border">
                        {booking.roomType}
                      </Badge>
                    </td>
                    <td className="small">{booking.checkIn}</td>
                    <td className="small">{booking.checkOut}</td>
                    <td className="fw-semibold text-primary">
                      ₹{booking.totalAmount.toLocaleString("en-IN")}
                    </td>
                    <td>
                      <StatusBadge status={booking.status} />
                    </td>
                    <td className="pe-3">
                      {booking.status === "CONFIRMED" ? (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleCancelClick(booking)}
                        >
                          Cancel
                        </Button>
                      ) : (
                        <span className="text-muted small">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* ── Cancel confirmation modal ─────────────────────────────────── */}
      <Modal
        show={!!cancelTarget}
        onHide={() => { setCancelTarget(null); setCancelError(null); }}
        centered
        size="sm"
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold fs-6">Cancel Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {cancelError && (
            <Alert variant="danger" className="mb-3 small">
              {cancelError}
            </Alert>
          )}
          <p className="mb-1 small">
            Are you sure you want to cancel your booking at{" "}
            <strong>{cancelTarget?.hotelName}</strong>?
          </p>
          <p className="text-muted small mb-0">
            {cancelTarget?.checkIn} → {cancelTarget?.checkOut} &nbsp;|&nbsp;
            {cancelTarget?.roomType}
          </p>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => { setCancelTarget(null); setCancelError(null); }}
            disabled={cancelling}
          >
            Keep Booking
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleCancelConfirm}
            disabled={cancelling}
          >
            {cancelling ? (
              <>
                <Spinner animation="border" size="sm" className="me-1" />
                Cancelling…
              </>
            ) : (
              "Yes, Cancel"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
}
