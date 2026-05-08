import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getHotelById, getRoomsByHotel, addRoom, updateRoom, deleteRoom } from "../services/apiService";
import { useAuth } from "../hooks/useAuth";

const ROOM_TYPES = ["SINGLE", "DOUBLE", "SUITE"];

export default function AdminRooms() {
  const { user } = useAuth();
  const { hotelId } = useParams();
  const navigate = useNavigate();

  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formData, setFormData] = useState({
    roomType: "SINGLE",
    price: "",
    capacity: 1,
    available: true,
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [hotelId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [hotelData, roomsData] = await Promise.all([
        getHotelById(hotelId),
        getRoomsByHotel(hotelId)
      ]);
      setHotel(hotelData);
      setRooms(roomsData);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load data");
      navigate("/admin/hotels");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      roomType: "SINGLE",
      price: "",
      capacity: 1,
      available: true,
    });
  };

  const openAddModal = () => {
    resetForm();
    setEditTarget(null);
    setShowAddModal(true);
  };

  const openEditModal = (room) => {
    setFormData({
      roomType: room.roomType,
      price: room.price,
      capacity: room.capacity,
      available: room.available,
    });
    setEditTarget(room);
    setShowAddModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : (name === "price" ? Number(value) : name === "capacity" ? Number(value) : value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editTarget) {
        const updated = await updateRoom(hotelId, editTarget.id, formData);
        setRooms(prev => prev.map(r => r.id === updated.id ? updated : r));
        toast.success(`Room #${updated.id} updated successfully`);
      } else {
        const newRoom = await addRoom(hotelId, formData);
        setRooms(prev => [...prev, newRoom]);
        toast.success(`Room added successfully`);
      }
      setShowAddModal(false);
      resetForm();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Operation failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteRoom(hotelId, deleteTarget.id);
      setRooms(prev => prev.filter(r => r.id !== deleteTarget.id));
      toast.success(`Room #${deleteTarget.id} deleted successfully`);
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading…</span>
        </div>
        <p className="text-muted mt-3">Loading rooms…</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="mb-4">
        <Link to="/admin/hotels" className="btn btn-outline-secondary btn-sm mb-3">← Back to Hotels</Link>
        <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
          <div>
            <h2 className="fw-bold mb-1">Manage Rooms — {hotel?.name}</h2>
            <p className="text-muted small mb-1">📍 {hotel?.location}</p>
            <p className="text-muted small mb-0">
              Logged in as <strong>{user?.name}</strong>{" "}
              <span className={`badge ${user?.role === "SUPER_ADMIN" ? "bg-danger" : "bg-warning text-dark"}`}>
                {user?.role}
              </span>
            </p>
          </div>
          <button className="btn btn-primary" onClick={openAddModal}>+ Add Room</button>
        </div>
      </div>

      {rooms.length === 0 && (
        <div className="alert alert-info text-center">
          No rooms added yet. <button className="btn btn-link p-0" onClick={openAddModal}>Add your first room</button>
        </div>
      )}

      {rooms.length > 0 && (
        <div className="card shadow-sm border-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th>Room ID</th>
                  <th>Type</th>
                  <th>Price</th>
                  <th>Capacity</th>
                  <th>Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map(room => (
                  <tr key={room.id}>
                    <td className="text-muted small">#{room.id}</td>
                    <td><span className="badge bg-light text-dark border">{room.roomType}</span></td>
                    <td className="fw-semibold text-primary">₹{room.price.toLocaleString("en-IN")}</td>
                    <td className="small">{room.capacity} {room.capacity === 1 ? "person" : "people"}</td>
                    <td>
                      <span className={`badge ${room.available ? "bg-success" : "bg-secondary"}`}>
                        {room.available ? "Available" : "Unavailable"}
                      </span>
                    </td>
                    <td className="text-center">
                      <button className="btn btn-outline-warning btn-sm me-1" onClick={() => openEditModal(room)}>
                        Edit
                      </button>
                      <button className="btn btn-outline-danger btn-sm" onClick={() => setDeleteTarget(room)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card-footer bg-white text-muted small py-2 px-3">
            {rooms.length} {rooms.length === 1 ? "room" : "rooms"} | Available: {rooms.filter(r => r.available).length}
          </div>
        </div>
      )}

      {/* Add/Edit Room Modal */}
      {showAddModal && (
        <div className="modal show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0 pb-0">
                <h6 className="modal-title fw-bold">{editTarget ? `Edit Room #${editTarget.id}` : "Add New Room"}</h6>
                <button className="btn-close" onClick={() => setShowAddModal(false)} />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small fw-medium">Room Type *</label>
                    <select
                      name="roomType"
                      className="form-select"
                      value={formData.roomType}
                      onChange={handleChange}
                      required
                    >
                      {ROOM_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-medium">Price per Night (₹) *</label>
                    <input
                      type="number"
                      name="price"
                      className="form-control"
                      placeholder="2500"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-medium">Capacity (persons) *</label>
                    <input
                      type="number"
                      name="capacity"
                      className="form-control"
                      placeholder="2"
                      min="1"
                      max="10"
                      value={formData.capacity}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="available"
                      className="form-check-input"
                      id="availableCheck"
                      checked={formData.available}
                      onChange={handleChange}
                    />
                    <label className="form-check-label small" htmlFor="availableCheck">
                      Room is available for booking
                    </label>
                  </div>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setShowAddModal(false)} disabled={saving}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
                    {saving ? "Saving…" : (editTarget ? "Update Room" : "Add Room")}
                  </button>
                </div>
              </form>
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
                <h6 className="modal-title fw-bold text-danger">Delete Room</h6>
                <button className="btn-close" onClick={() => setDeleteTarget(null)} />
              </div>
              <div className="modal-body small">
                Delete room <strong>#{deleteTarget.id}</strong> ({deleteTarget.roomType})?
                <br />
                <span className="text-muted">Price: ₹{deleteTarget.price.toLocaleString("en-IN")} | Capacity: {deleteTarget.capacity}</span>
                <p className="text-danger mt-2 mb-0">⚠ This cannot be undone.</p>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button className="btn btn-outline-secondary btn-sm" onClick={() => setDeleteTarget(null)} disabled={deleting}>
                  Cancel
                </button>
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
