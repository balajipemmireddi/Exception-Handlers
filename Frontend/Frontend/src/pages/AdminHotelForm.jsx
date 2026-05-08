import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { createHotel, updateHotel, getHotelById } from "../services/apiService";
import { useAuth } from "../hooks/useAuth";

export default function AdminHotelForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
    imageUrl: "",
    starRating: 3,
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      fetchHotel();
    }
  }, [id]);

  const fetchHotel = async () => {
    try {
      const data = await getHotelById(id);
      setFormData({
        name: data.name,
        location: data.location,
        description: data.description || "",
        imageUrl: data.imageUrl || "",
        starRating: data.starRating,
      });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load hotel");
      navigate("/admin/hotels");
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "starRating" ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await updateHotel(id, formData);
        toast.success(`Hotel "${formData.name}" updated successfully`);
      } else {
        await createHotel(formData);
        toast.success(`Hotel "${formData.name}" created successfully`);
      }
      navigate("/admin/hotels");
    } catch (err) {
      toast.error(err?.response?.data?.message || `Failed to ${isEdit ? "update" : "create"} hotel`);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading…</span>
        </div>
        <p className="text-muted mt-3">Loading hotel details…</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          <div className="mb-4">
            <Link to="/admin/hotels" className="btn btn-outline-secondary btn-sm">← Back to Hotels</Link>
          </div>

          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h3 className="fw-bold mb-1">{isEdit ? "Edit Hotel" : "Add New Hotel"}</h3>
              <p className="text-muted small mb-4">
                Logged in as <strong>{user?.name}</strong>{" "}
                <span className={`badge ${user?.role === "SUPER_ADMIN" ? "bg-danger" : "bg-warning text-dark"}`}>
                  {user?.role}
                </span>
              </p>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-medium">Hotel Name *</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Grand Palace Hotel"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-medium">Location *</label>
                  <input
                    type="text"
                    name="location"
                    className="form-control"
                    placeholder="Mumbai, India"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-medium">Description</label>
                  <textarea
                    name="description"
                    className="form-control"
                    rows="3"
                    placeholder="Luxury hotel in the heart of the city..."
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-medium">Image URL</label>
                  <input
                    type="url"
                    name="imageUrl"
                    className="form-control"
                    placeholder="https://example.com/hotel-image.jpg"
                    value={formData.imageUrl}
                    onChange={handleChange}
                  />
                  <small className="text-muted">Leave empty for placeholder image</small>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-medium">Star Rating *</label>
                  <select
                    name="starRating"
                    className="form-select"
                    value={formData.starRating}
                    onChange={handleChange}
                    required
                  >
                    <option value={1}>1 Star</option>
                    <option value={2}>2 Stars</option>
                    <option value={3}>3 Stars</option>
                    <option value={4}>4 Stars</option>
                    <option value={5}>5 Stars</option>
                  </select>
                </div>

                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? (isEdit ? "Updating…" : "Creating…") : (isEdit ? "Update Hotel" : "Create Hotel")}
                  </button>
                  <Link to="/admin/hotels" className="btn btn-outline-secondary">Cancel</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
