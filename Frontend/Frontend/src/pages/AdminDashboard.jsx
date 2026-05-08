import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getAllBookings, adminDeleteBooking, adminUpdateBooking } from "../services/apiService";
import { useAuth } from "../hooks/useAuth";

const today = new Date().toISOString().split("T")[0];

export default function AdminDashboard() {
  const { user } = useAuth();

  const [bookings,     setBookings]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [editTarget,   setEditTarget]   = useState(null);
  const [editFields,   setEditFields]   = useState({});
  const [saving,       setSaving]       = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting,     setDeleting]     = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getAllBookings();
        setBookings(data);
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const confirmedCount = bookings.filter(b => b.status === "CONFIRMED").length;
  const cancelledCount = bookings.filter(b => b.status === "CANCELLED").length;
  const totalRevenue   = bookings.filter(b => b.status === "CONFIRMED").reduce((s, b) => s + b.totalAmount, 0);

  const openEdit = (b) => {
    setEditTarget(b);
    setEditFields({ checkIn: b.checkIn, checkOut: b.checkOut, status: b.status });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await adminUpdateBooking(editTarget.id, editFields);
      setBookings(prev => prev.map(b => b.id === updated.id ? updated : b));
      toast.success(`Booking #${updated.id} updated`);
      setEditTarget(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminDeleteBooking(deleteTarget.id);
      setBookings(prev => prev.filter(b => b.id !== deleteTarget.id));
      toast.success(`Booking #${deleteTarget.id} deleted`);
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Admin — All Bookings</h2>
        <p className="text-muted small mb-0">
          Logged in as <strong>{user?.name}</strong>{" "}
          <span className="badge bg-warning text-dark">{user?.role}</span>
        </p>
      </div>

      {/* Stat cards */}
      {!loading && (
        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-4">
            <div className="card border-0 shadow-sm border-start border-primary border-4">
              <div className="card-body py-3">
                <p className="text-muted small mb-1">Total Bookings</p>
                <h4 className="fw-bold mb-0">{bookings.length}</h4>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-4">
            <div className="card border-0 shadow-sm border-start border-success border-4">
              <div className="card-body py-3">
                <p className="text-muted small mb-1">Confirmed</p>
                <h4 className="fw-bold mb-0 text-success">{confirmedCount}</h4>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-4">
            <div className="card border-0 shadow-sm border-start border-danger border-4">
              <div className="card-body py-3">
                <p className="text-muted small mb-1">Cancelled</p>
                <h4 className="fw-bold mb-0 text-danger">{cancelledCount}</h4>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading && <p className="text-center text-muted">Loading bookings…</p>}

      {!loading && bookings.length === 0 && (
        <div className="alert alert-info text-center">No bookings in the system yet.</div>
      )}

      {!loading && bookings.length > 0 && (
        <div className="card shadow-sm border-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>User</th>
                  <th>Hotel</th>
                  <th>Room</th>
                  <th>Check-In</th>
                  <th>Check-Out</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b.id}>
                    <td className="text-muted small">#{b.id}</td>
                    <td>
                      <div className="fw-medium small">{b.userName}</div>
                      <div className="text-muted" style={{ fontSize: "0.75rem" }}>ID: {b.userId}</div>
                    </td>
                    <td className="small">{b.hotelName}</td>
                    <td><span className="badge bg-light text-dark border">{b.roomType}</span></td>
                    <td className="small">{b.checkIn}</td>
                    <td className="small">{b.checkOut}</td>
                    <td className="fw-semibold text-primary small">₹{b.totalAmount.toLocaleString("en-IN")}</td>
                    <td>
                      <span className={`badge ${b.status === "CONFIRMED" ? "bg-success" : "bg-secondary"}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="text-center">
                      <button className="btn btn-outline-warning btn-sm me-1" onClick={() => openEdit(b)}>Edit</button>
                      <button className="btn btn-outline-danger btn-sm" onClick={() => setDeleteTarget(b)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card-footer bg-white text-muted small py-2 px-3">
            {bookings.length} bookings | Confirmed revenue:{" "}
            <strong className="text-primary">₹{totalRevenue.toLocaleString("en-IN")}</strong>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editTarget && (
        <div className="modal show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0 pb-0">
                <h6 className="modal-title fw-bold">Edit Booking #{editTarget.id}</h6>
                <button className="btn-close" onClick={() => setEditTarget(null)} />
              </div>
              <div className="modal-body">
                <div className="bg-light rounded p-3 mb-3 small">
                  <strong>{editTarget.userName}</strong> — {editTarget.hotelName} — {editTarget.roomType}
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-medium">Check-In</label>
                  <input type="date" className="form-control" min={today}
                    value={editFields.checkIn}
                    onChange={e => setEditFields({ ...editFields, checkIn: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-medium">Check-Out</label>
                  <input type="date" className="form-control" min={editFields.checkIn || today}
                    value={editFields.checkOut}
                    onChange={e => setEditFields({ ...editFields, checkOut: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-medium">Status</label>
                  <select className="form-select"
                    value={editFields.status}
                    onChange={e => setEditFields({ ...editFields, status: e.target.value })}>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button className="btn btn-outline-secondary btn-sm" onClick={() => setEditTarget(null)} disabled={saving}>Cancel</button>
                <button className="btn btn-warning btn-sm" onClick={handleSave} disabled={saving}>
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="modal show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-sm modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0 pb-0">
                <h6 className="modal-title fw-bold text-danger">Delete Booking</h6>
                <button className="btn-close" onClick={() => setDeleteTarget(null)} />
              </div>
              <div className="modal-body small">
                Delete booking <strong>#{deleteTarget.id}</strong> for <strong>{deleteTarget.userName}</strong>?
                <br />
                <span className="text-muted">{deleteTarget.hotelName} | {deleteTarget.roomType}</span>
                <p className="text-danger mt-2 mb-0">⚠ This cannot be undone.</p>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button className="btn btn-outline-secondary btn-sm" onClick={() => setDeleteTarget(null)} disabled={deleting}>Keep</button>
                <button className="btn btn-danger btn-sm" onClick={handleDelete} disabled={deleting}>
                  {deleting ? "Deleting…" : "Yes, Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
