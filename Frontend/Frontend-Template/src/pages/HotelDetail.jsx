import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getHotelById } from "../services/apiService";
import RoomCard    from "../components/hotel/RoomCard";
import BookingForm from "../components/booking/BookingForm";

function StarRating({ rating }) {
  return (
    <span aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} style={{ color: i < rating ? "#f5a623" : "#d1d5db", fontSize: "1.25rem" }}>★</span>
      ))}
    </span>
  );
}

export default function HotelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hotel,         setHotel]         = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState(null);
  const [selectedRoom,  setSelectedRoom]  = useState(null);
  const [showModal,     setShowModal]     = useState(false);
  const [bookingResult, setBookingResult] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getHotelById(id);
        setHotel(data);
      } catch (err) {
        setError({
          status:  err?.response?.data?.status,
          message: err?.response?.data?.message || err?.message || "Failed to load hotel",
        });
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleBookRoom = (room) => {
    setBookingResult(null);
    setSelectedRoom(room);
    setShowModal(true);
  };

  const handleBookingSuccess = (booking) => {
    setShowModal(false);
    setSelectedRoom(null);
    setBookingResult(booking);
    toast.success(`🎉 Booking confirmed at ${booking.hotelName}!`);
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading…</span>
        </div>
        <p className="text-muted mt-3">Loading hotel details…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger text-center">
          <h5>{error.status === 404 ? "Hotel Not Found" : "Unable to Load Hotel"}</h5>
          <p className="mb-3">{error.message}</p>
          <button className="btn btn-outline-danger" onClick={() => navigate("/")}>← Back to Hotels</button>
        </div>
      </div>
    );
  }

  const { name, location, description, imageUrl, starRating, rooms } = hotel;

  return (
    <div className="container py-5">

      {/* Back */}
      <div className="mb-4">
        <Link to="/" className="btn btn-outline-secondary btn-sm">← Back to Hotels</Link>
      </div>

      {/* Booking success banner */}
      {bookingResult && (
        <div className="alert alert-success alert-dismissible mb-4" role="alert">
          <h5 className="alert-heading">🎉 Booking Confirmed!</h5>
          <p className="mb-1">
            <strong>Hotel:</strong> {bookingResult.hotelName} &nbsp;|&nbsp;
            <strong>Room:</strong> {bookingResult.roomType} &nbsp;|&nbsp;
            <strong>Check-In:</strong> {bookingResult.checkIn} &nbsp;|&nbsp;
            <strong>Check-Out:</strong> {bookingResult.checkOut}
          </p>
          <p className="mb-1">
            <strong>Total:</strong> ₹{bookingResult.totalAmount.toLocaleString("en-IN")} &nbsp;|&nbsp;
            <strong>Status:</strong> <span className="badge bg-success">{bookingResult.status}</span>
          </p>
          <p className="mb-0 small text-muted">
            Booking ID: #{bookingResult.id} — <Link to="/user/dashboard">View My Bookings</Link>
          </p>
          <button type="button" className="btn-close" onClick={() => setBookingResult(null)} />
        </div>
      )}

      {/* Hotel hero */}
      <div className="card shadow-sm border-0 mb-5">
        <img
          src={imageUrl}
          alt={`${name} — ${location}`}
          className="card-img-top"
          style={{ height: "400px", objectFit: "cover" }}
          onError={e => { e.currentTarget.src = `https://placehold.co/1200x400/6c757d/ffffff?text=${encodeURIComponent(name)}`; }}
        />
        <div className="card-body p-4">
          <h1 className="fw-bold mb-2">{name}</h1>
          <div className="d-flex align-items-center gap-2 flex-wrap mb-3">
            <span className="badge bg-secondary fw-normal px-3 py-2">📍 {location}</span>
            <StarRating rating={starRating} />
            <span className="text-muted small">({starRating}-star hotel)</span>
          </div>
          <p className="text-muted mb-0" style={{ lineHeight: "1.6" }}>{description}</p>
        </div>
      </div>

      {/* Rooms */}
      <h3 className="fw-bold mb-1">Available Rooms</h3>
      <p className="text-muted small mb-4">Select a room to proceed with booking</p>

      {rooms.length === 0 ? (
        <div className="alert alert-info text-center">No rooms listed for this hotel.</div>
      ) : (
        <div className="row g-4">
          {rooms.map(room => (
            <div key={room.id} className="col-12 col-sm-6 col-lg-4">
              <RoomCard {...room} hotelId={hotel.id} onBook={handleBookRoom} />
            </div>
          ))}
        </div>
      )}

      <BookingForm
        show={showModal}
        onHide={() => { setShowModal(false); setSelectedRoom(null); }}
        onSuccess={handleBookingSuccess}
        room={selectedRoom}
        hotelName={name}
      />
    </div>
  );
}
