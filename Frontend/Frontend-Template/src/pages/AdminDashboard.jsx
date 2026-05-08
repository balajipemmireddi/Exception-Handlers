// AdminDashboard.jsx — Phase 9: Admin booking management at /admin/bookings.
// Protected: ADMIN | SUPER_ADMIN.
//
// Fetches all BookingResponseDTO[] from apiService.getAllBookings().
// Edit  → PUT  /api/admin/bookings/:id  via adminUpdateBooking(id, BookingUpdateDTO)
// Delete → DELETE /api/admin/bookings/:id via adminDeleteBooking(id)
//
// Both operations update local state — no full re-fetch needed.
//
// BookingResponseDTO shape (hackothon_context.md §3):
//   { id, userId, userName, hotelName, roomType, checkIn, checkOut,
//     status, totalAmount, createdAt }

import { useState, useEffect } from "react";
import {
  Container, Card, Badge, Button,
  Spinner, Alert, Modal,
} from "react-bootstrap";
import { getAllBookings, adminDeleteBooking } from "../services/apiService";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import AdminBookingTable from "../components/admin/AdminBookingTable";
import EditBookingModal  from "../components/admin/EditBookingModal";

export default function AdminDashboard() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [bookings,      setBookings]      = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState(null);
  const [successMsg,    setSuccessMsg]    = useState(null);

  // Edit modal state
  const [editTarget,    setEditTarget]    = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Delete confirmation modal state
  const [deleteTarget,  setDeleteTarget]  = useState(null);
  const [deleting,      setDeleting]      = useState(false);
  const [deleteError,   setDeleteError]   = useState(null);

  // ── Fetch all bookings on mount ───────────────────────────────────────────
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        // GET /api/admin/bookings → BookingResponseDTO[]
        const data = await getAllBookings();
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
    fetchAll();
  }, []);

  // ── Summary counts ────────────────────────────────────────────────────────
  const confirmedCount  = bookings.filter((b) => b.status === "CONFIRMED").length;
  const cancelledCount  = bookings.filter((b) => b.status === "CANCELLED").length;
  const totalRevenue    = bookings
    .filter((b) => b.status === "CONFIRMED")
    .reduce((sum, b) => sum + b.totalAmount, 0);

  // ── Edit flow ─────────────────────────────────────────────────────────────
  const handleEditClick = (booking) => {
    setEditTarget(booking);
    setShowEditModal(true);
  };

  const handleEditSuccess = (updated) => {
    // Replace the updated booking in local state
    setBookings((prev) =>
      prev.map((b) => (b.id === updated.id ? updated : b))
    );
    setShowEditModal(false);
    setEditTarget(null);
    setSuccessMsg(`Booking #${updated.id} updated successfully.`);
    showToast(`Booking #${updated.id} updated.`, "success");
  };

  // ── Delete flow ───────────────────────────────────────────────────────────
  const handleDeleteClick = (booking) => {
    setDeleteError(null);
    setDeleteTarget(booking);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      // DELETE /api/admin/bookings/:id → { message: "Booking deleted successfully" }
      await adminDeleteBooking(deleteTarget.id);

      // Remove from local state
      setBookings((prev) => prev.filter((b) => b.id !== deleteTarget.id));
      setSuccessMsg(`Booking #${deleteTarget.id} (${deleteTarget.hotelName}) deleted.`);
      showToast(`Booking #${deleteTarget.id} deleted.`, "danger");
      setDeleteTarget(null);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Delete failed. Please try again.";
      setDeleteError(msg);
    } finally {
      setDeleting(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Container className="py-5">

      {/* ── Page header ─────────────────────────────────────────────── */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-1">Admin — All Bookings</h2>
          <p className="text-muted mb-0 small">
            Logged in as <strong>{user?.name}</strong>{" "}
            <Badge bg="warning" text="dark">{user?.role}</Badge>
          </p>
        </div>
      </div>

      {/* ── Summary stat cards ───────────────────────────────────────── */}
      {!loading && !error && (
        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-4">
            <Card className="border-0 shadow-sm border-start border-primary border-4">
              <Card.Body className="py-3">
                <p className="text-muted small mb-1">Total Bookings</p>
                <h4 className="fw-bold mb-0">{bookings.length}</h4>
              </Card.Body>
            </Card>
          </div>
          <div className="col-12 col-sm-4">
            <Card className="border-0 shadow-sm border-start border-success border-4">
              <Card.Body className="py-3">
                <p className="text-muted small mb-1">Confirmed</p>
                <h4 className="fw-bold mb-0 text-success">{confirmedCount}</h4>
              </Card.Body>
            </Card>
          </div>
          <div className="col-12 col-sm-4">
            <Card className="border-0 shadow-sm border-start border-danger border-4">
              <Card.Body className="py-3">
                <p className="text-muted small mb-1">Cancelled</p>
                <h4 className="fw-bold mb-0 text-danger">{cancelledCount}</h4>
              </Card.Body>
            </Card>
          </div>
        </div>
      )}

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
          <p className="text-muted mt-3">Loading all bookings…</p>
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
          <Alert.Heading>No bookings in the system</Alert.Heading>
          <p className="mb-0">There are no bookings to manage yet.</p>
        </Alert>
      )}

      {/* ── Bookings table ───────────────────────────────────────────── */}
      {!loading && !error && bookings.length > 0 && (
        <Card className="shadow-sm border-0">
          <Card.Body className="p-0">
            <AdminBookingTable
              bookings={bookings}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          </Card.Body>
          <Card.Footer className="bg-white border-top text-muted small py-2 px-3">
            {bookings.length} booking{bookings.length !== 1 ? "s" : ""} &nbsp;|&nbsp;
            Confirmed revenue: <strong className="text-primary">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </strong>
          </Card.Footer>
        </Card>
      )}

      {/* ── Edit modal ───────────────────────────────────────────────── */}
      <EditBookingModal
        show={showEditModal}
        onHide={() => { setShowEditModal(false); setEditTarget(null); }}
        onSuccess={handleEditSuccess}
        booking={editTarget}
      />

      {/* ── Delete confirmation modal ─────────────────────────────────── */}
      <Modal
        show={!!deleteTarget}
        onHide={() => { setDeleteTarget(null); setDeleteError(null); }}
        centered
        size="sm"
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold fs-6 text-danger">Delete Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {deleteError && (
            <Alert variant="danger" className="mb-3 small">
              {deleteError}
            </Alert>
          )}
          <p className="mb-1 small">
            Permanently delete booking{" "}
            <strong>#{deleteTarget?.id}</strong> for{" "}
            <strong>{deleteTarget?.userName}</strong> at{" "}
            <strong>{deleteTarget?.hotelName}</strong>?
          </p>
          <p className="text-muted small mb-0">
            {deleteTarget?.checkIn} → {deleteTarget?.checkOut} &nbsp;|&nbsp;
            {deleteTarget?.roomType} &nbsp;|&nbsp;
            <Badge bg={deleteTarget?.status === "CONFIRMED" ? "success" : "secondary"}>
              {deleteTarget?.status}
            </Badge>
          </p>
          <p className="text-danger small mt-2 mb-0">
            ⚠ This action cannot be undone.
          </p>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => { setDeleteTarget(null); setDeleteError(null); }}
            disabled={deleting}
          >
            Keep
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleDeleteConfirm}
            disabled={deleting}
          >
            {deleting ? (
              <>
                <Spinner animation="border" size="sm" className="me-1" />
                Deleting…
              </>
            ) : (
              "Yes, Delete"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
}
