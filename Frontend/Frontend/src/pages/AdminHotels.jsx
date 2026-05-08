import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getHotels, deleteHotel } from "../services/apiService";
import { useAuth } from "../hooks/useAuth";

export default function AdminHotels() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const data = await getHotels();
      setHotels(data);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load hotels");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteHotel(deleteTarget.id);
      setHotels(prev => prev.filter(h => h.id !== deleteTarget.id));
      toast.success(`Hotel "${deleteTarget.name}" deleted successfully`);
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-1">Manage Hotels</h2>
          <p className="text-muted small mb-0">
            Logged in as <strong>{user?.name}</strong>{" "}
            <span className={`badge ${user?.role === "SUPER_ADMIN" ? "bg-danger" : "bg-warning text-dark"}`}>
              {user?.role}
            </span>
          </p>
        </div>
        <Link to="/admin/hotels/new" className="btn btn-primary">+ Add New Hotel</Link>
      </div>

      {loading && <p className="text-center text-muted">Loading hotels…</p>}

      {!loading && hotels.length === 0 && (
        <div className="alert alert-info text-center">
          No hotels in the system yet. <Link to="/admin/hotels/new">Add your first hotel</Link>
        </div>
      )}

      {!loading && hotels.length > 0 && (
        <div className="row g-4">
          {hotels.map(hotel => (
            <div key={hotel.id} className="col-12 col-md-6 col-lg-4">
              <div className="card shadow-sm border-0 h-100">
                <img
                  src={hotel.imageUrl}
                  alt={hotel.name}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover" }}
                  onError={e => { e.currentTarget.src = `https://placehold.co/400x300/6c757d/ffffff?text=${encodeURIComponent(hotel.name)}`; }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title fw-bold mb-2">{hotel.name}</h5>
                  <p className="text-muted small mb-2">📍 {hotel.location}</p>
                  <p className="text-muted small mb-2">
                    {"⭐".repeat(hotel.starRating)} ({hotel.starRating}-star)
                  </p>
                  <p className="text-primary fw-semibold mb-3">
                    Starting from ₹{hotel.startingPrice?.toLocaleString("en-IN") ?? "N/A"}
                  </p>
                  <div className="mt-auto d-flex gap-2">
                    <button
                      className="btn btn-outline-primary btn-sm flex-fill"
                      onClick={() => navigate(`/admin/hotels/${hotel.id}/rooms`)}
                    >
                      Manage Rooms
                    </button>
                    <button
                      className="btn btn-outline-warning btn-sm"
                      onClick={() => navigate(`/admin/hotels/${hotel.id}/edit`)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => setDeleteTarget(hotel)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="modal show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0 pb-0">
                <h6 className="modal-title fw-bold text-danger">Delete Hotel</h6>
                <button className="btn-close" onClick={() => setDeleteTarget(null)} />
              </div>
              <div className="modal-body">
                <p className="mb-2">Are you sure you want to delete <strong>{deleteTarget.name}</strong>?</p>
                <p className="text-muted small mb-2">📍 {deleteTarget.location}</p>
                <div className="alert alert-danger small mb-0">
                  ⚠ This will also delete all rooms associated with this hotel. This action cannot be undone.
                </div>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button className="btn btn-outline-secondary btn-sm" onClick={() => setDeleteTarget(null)} disabled={deleting}>
                  Cancel
                </button>
                <button className="btn btn-danger btn-sm" onClick={handleDelete} disabled={deleting}>
                  {deleting ? "Deleting…" : "Yes, Delete Hotel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
