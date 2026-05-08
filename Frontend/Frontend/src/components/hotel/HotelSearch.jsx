import { useState } from "react";

const today = new Date().toISOString().split("T")[0];
const EMPTY = { location: "", checkIn: "", checkOut: "" };

export default function HotelSearch({ onSearch, onClear, loading = false }) {
  const [fields, setFields] = useState(EMPTY);
  const [error,  setError]  = useState("");

  const handleChange = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (fields.checkIn && fields.checkOut && fields.checkOut <= fields.checkIn) {
      setError("Check-out must be after check-in.");
      return;
    }
    onSearch({ ...fields });
  };

  const handleClear = () => {
    setFields(EMPTY);
    setError("");
    onClear();
  };

  const isDirty = fields.location.trim() || fields.checkIn || fields.checkOut;

  return (
    <div className="bg-white border rounded shadow-sm p-4 mb-4">
      <h5 className="fw-semibold mb-3">🔍 Search Hotels</h5>

      {error && <div className="alert alert-warning py-2 small mb-3">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="row g-3 align-items-end">

          <div className="col-12 col-md-4">
            <label className="form-label small fw-medium mb-1">Destination</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">📍</span>
              <input
                type="text"
                name="location"
                className="form-control border-start-0"
                placeholder="e.g. Mumbai, Goa…"
                value={fields.location}
                onChange={handleChange}
                disabled={loading}
                autoComplete="off"
              />
            </div>
          </div>

          <div className="col-12 col-sm-6 col-md-3">
            <label className="form-label small fw-medium mb-1">Check-In</label>
            <input
              type="date"
              name="checkIn"
              className="form-control"
              value={fields.checkIn}
              min={today}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="col-12 col-sm-6 col-md-3">
            <label className="form-label small fw-medium mb-1">Check-Out</label>
            <input
              type="date"
              name="checkOut"
              className="form-control"
              value={fields.checkOut}
              min={fields.checkIn || today}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="col-12 col-md-2 d-flex gap-2">
            <button type="submit" className="btn btn-primary flex-grow-1" disabled={loading}>
              {loading ? "Searching…" : "Search"}
            </button>
            {isDirty && (
              <button type="button" className="btn btn-outline-secondary" onClick={handleClear} disabled={loading} title="Clear">
                ✕
              </button>
            )}
          </div>

        </div>
      </form>
    </div>
  );
}
