import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getUserBookings, cancelBooking } from "../services/apiService";
import { useAuth } from "../hooks/useAuth";

export default function UserDashboard() {
  const { user } = useAuth();

  const [bookings,     setBookings]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling,   setCancelling]   = useState(false);

  useEffect(() => {
    if (!user?.userId) return;
    const fetch = async () => {
      try {
        const data = await getUserBookings(user.userId);
        setBookings(data);
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user?.userId]);

  const handleCancel = async () => {
    if (!cancelTarget) return;
    setCancelling(true);
    try {
      const updated = await cancelBooking(cancelTarget.id);
      setBookings(prev => prev.map(b => b.id === updated.id ? updated : b));
      toast.warning(`Booking #${updated.id} cancelled`);
      setCancelTarget(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Cancellation failed");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-1">My Bookings</h2>
          <p className="text-muted mb-0 small">
            Logged in as <strong>{user?.name}</strong>{" "}
            <span className="badge bg-primary">{user?.role}</span>
          </p>
        </div>
        <Link to="/" className="btn btn-outline-primary btn-sm">+ Book a Hotel</Link>
      </div>

      {loading && <p className="text-center text-muted">Loading bookings…</p>}

      {!loading && bookings.length === 0 && (
        <div className="alert alert-info text-center">
          No bookings yet. <Link to="/">Browse Hotels</Link>
        </div>
      )}

      {!loading && bookings.length > 0 && (
        <div className="card shadow-sm border-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Hotel</th>
                  <th>Room</th>
                  <th>Check-In</th>
                  <th>Check-Out</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b.id}>
                    <td className="text-muted small">#{b.id}</td>
                    <td className="fw-medium">{b.hotelName}</td>
                    <td><span className="badge bg-light text-dark border">{b.roomType}</span></td>
                    <td className="small">{b.checkIn}</td>
                    <td className="small">{b.checkOut}</td>
                    <td className="fw-semibold text-primary">₹{b.totalAmount.toLocaleString("en-IN")}</td>
                    <td>
                      <span className={`badge ${b.status === "CONFIRMED" ? "bg-success" : "bg-secondary"}`}>
                        {b.status}
                      </span>
                    </td>
                    <td>
                      {b.status === "CONFIRMED" ? (
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => setCancelTarget(b)}
                        >
                          Cancel
                        </button>
                      ) : (
                        <span className="text-muted small">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Cancel confirmation modal */}
      {cancelTarget && (
        <div className="modal show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-sm modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0 pb-0">
                <h6 className="modal-title fw-bold">Cancel Booking</h6>
                <button className="btn-close" onClick={() => setCancelTarget(null)} />
              </div>
              <div className="modal-body small">
                Cancel booking at <strong>{cancelTarget.hotelName}</strong>?
                <br />
                <span className="text-muted">{cancelTarget.checkIn} → {cancelTarget.checkOut} | {cancelTarget.roomType}</span>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button className="btn btn-outline-secondary btn-sm" onClick={() => setCancelTarget(null)} disabled={cancelling}>
                  Keep
                </button>
                <button className="btn btn-danger btn-sm" onClick={handleCancel} disabled={cancelling}>
                  {cancelling ? "Cancelling…" : "Yes, Cancel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
