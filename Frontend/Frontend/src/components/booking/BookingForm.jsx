import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { createBooking } from "../../services/apiService";
import { useAuth } from "../../hooks/useAuth";

const today = new Date().toISOString().split("T")[0];

const calcNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  return Math.max(0, Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000));
};

export default function BookingForm({ show, onHide, onSuccess, room, hotelName }) {
  const { isAuthenticated } = useAuth();

  const [fields,  setFields]  = useState({ checkIn: "", checkOut: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show) setFields({ checkIn: "", checkOut: "" });
  }, [show, room?.id]);

  if (!show || !room) return null;

  const nights      = calcNights(fields.checkIn, fields.checkOut);
  const totalAmount = room.price * Math.max(nights, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fields.checkIn || !fields.checkOut) return toast.warning("Please select both dates");
    if (fields.checkOut <= fields.checkIn)   return toast.warning("Check-out must be after check-in");

    setLoading(true);
    try {
      const booking = await createBooking({
        hotelId:  room.hotelId,
        roomId:   room.id,
        checkIn:  fields.checkIn,
        checkOut: fields.checkOut,
      });
      toast.success(`🎉 Booking confirmed at ${booking.hotelName}!`);
      onSuccess(booking);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header border-0 pb-0">
            <h6 className="modal-title fw-bold">Confirm Your Booking</h6>
            <button className="btn-close" onClick={onHide} />
          </div>

          <div className="modal-body">
            {/* Summary */}
            <div className="bg-light rounded p-3 mb-3 small">
              <p className="fw-semibold mb-2">🏨 {hotelName}</p>
              <div className="d-flex justify-content-between"><span className="text-muted">Room Type</span><span className="badge bg-primary">{room.roomType}</span></div>
              <div className="d-flex justify-content-between mt-1"><span className="text-muted">Capacity</span><span>👤 {room.capacity} {room.capacity === 1 ? "guest" : "guests"}</span></div>
              <div className="d-flex justify-content-between mt-1"><span className="text-muted">Price/night</span><span className="fw-semibold text-primary">₹{room.price.toLocaleString("en-IN")}</span></div>
            </div>

            {!isAuthenticated && (
              <div className="alert alert-warning small">You must be <strong>logged in</strong> to book.</div>
            )}

            <form onSubmit={handleSubmit} id="booking-form">
              <div className="row g-3">
                <div className="col-6">
                  <label className="form-label small fw-medium">Check-In</label>
                  <input type="date" className="form-control" min={today}
                    value={fields.checkIn}
                    onChange={e => setFields({ ...fields, checkIn: e.target.value })}
                    disabled={loading || !isAuthenticated} />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-medium">Check-Out</label>
                  <input type="date" className="form-control" min={fields.checkIn || today}
                    value={fields.checkOut}
                    onChange={e => setFields({ ...fields, checkOut: e.target.value })}
                    disabled={loading || !isAuthenticated} />
                </div>
              </div>
            </form>

            {nights > 0 && (
              <div className="mt-3 p-3 border rounded">
                <div className="d-flex justify-content-between small text-muted mb-1">
                  <span>₹{room.price.toLocaleString("en-IN")} × {nights} {nights === 1 ? "night" : "nights"}</span>
                  <span>₹{totalAmount.toLocaleString("en-IN")}</span>
                </div>
                <div className="d-flex justify-content-between fw-bold border-top pt-2">
                  <span>Total</span>
                  <span className="text-primary">₹{totalAmount.toLocaleString("en-IN")}</span>
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer border-0 pt-0">
            <button className="btn btn-outline-secondary btn-sm" onClick={onHide} disabled={loading}>Cancel</button>
            <button type="submit" form="booking-form" className="btn btn-primary btn-sm" disabled={loading || !isAuthenticated}>
              {loading ? "Booking…" : "Confirm Booking"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
