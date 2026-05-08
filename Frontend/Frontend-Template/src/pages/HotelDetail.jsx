// HotelDetail.jsx — Phase 8: Hotel detail + booking modal wired.
//
// Fetches HotelDetailDTO from apiService.getHotelById(id).
// "Book Now" on each available RoomCard opens BookingForm modal.
// On successful booking shows an inline success alert with booking summary.

import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Container, Row, Col, Card, Button, Badge, Spinner, Alert,
} from "react-bootstrap";
import { getHotelById } from "../services/apiService";
import RoomCard    from "../components/hotel/RoomCard";
import BookingForm from "../components/booking/BookingForm";

// ── Star renderer ─────────────────────────────────────────────────────────────
function StarRating({ rating }) {
  return (
    <span aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          style={{ color: i < rating ? "#f5a623" : "#d1d5db", fontSize: "1.25rem" }}
          aria-hidden="true"
        >
          ★
        </span>
      ))}
    </span>
  );
}

export default function HotelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hotel,          setHotel]          = useState(null);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState(null);

  // Booking modal state
  const [selectedRoom,   setSelectedRoom]   = useState(null);   // room passed to modal
  const [showModal,      setShowModal]      = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);   // BookingResponseDTO | null

  useEffect(() => {
    const fetchHotel = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getHotelById(id);
        setHotel(data);
      } catch (err) {
        const status = err?.response?.data?.status;
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load hotel details.";
        setError({ status, message: msg });
      } finally {
        setLoading(false);
      }
    };
    fetchHotel();
  }, [id]);

  // ── RoomCard "Book Now" handler ───────────────────────────────────────────
  const handleBookRoom = (room) => {
    setBookingSuccess(null);   // clear any previous success banner
    setSelectedRoom(room);
    setShowModal(true);
  };

  // ── BookingForm success callback ─────────────────────────────────────────
  // Receives the full BookingResponseDTO from apiService.createBooking()
  const handleBookingSuccess = (booking) => {
    setShowModal(false);
    setSelectedRoom(null);
    setBookingSuccess(booking);   // show inline confirmation
  };

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" role="status">
          <span className="visually-hidden">Loading hotel details…</span>
        </Spinner>
        <p className="text-muted mt-3">Loading hotel details…</p>
      </Container>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center">
          <Alert.Heading>
            {error.status === 404 ? "Hotel Not Found" : "Unable to Load Hotel"}
          </Alert.Heading>
          <p className="mb-3">{error.message}</p>
          <Button variant="outline-danger" onClick={() => navigate("/")}>
            ← Back to Hotels
          </Button>
        </Alert>
      </Container>
    );
  }

  const { name, location, description, imageUrl, starRating, rooms } = hotel;

  return (
    <Container className="py-5">

      {/* ── Back link ────────────────────────────────────────────────── */}
      <div className="mb-4">
        <Button as={Link} to="/" variant="outline-secondary" size="sm">
          ← Back to Hotels
        </Button>
      </div>

      {/* ── Booking success banner ───────────────────────────────────── */}
      {bookingSuccess && (
        <Alert
          variant="success"
          dismissible
          onClose={() => setBookingSuccess(null)}
          className="mb-4"
        >
          <Alert.Heading>🎉 Booking Confirmed!</Alert.Heading>
          <p className="mb-1">
            <strong>Hotel:</strong> {bookingSuccess.hotelName} &nbsp;|&nbsp;
            <strong>Room:</strong> {bookingSuccess.roomType} &nbsp;|&nbsp;
            <strong>Check-In:</strong> {bookingSuccess.checkIn} &nbsp;|&nbsp;
            <strong>Check-Out:</strong> {bookingSuccess.checkOut}
          </p>
          <p className="mb-1">
            <strong>Total:</strong>{" "}
            ₹{bookingSuccess.totalAmount.toLocaleString("en-IN")} &nbsp;|&nbsp;
            <strong>Status:</strong>{" "}
            <Badge bg="success">{bookingSuccess.status}</Badge>
          </p>
          <p className="mb-0 small text-muted">
            Booking ID: #{bookingSuccess.id} — View all your bookings in{" "}
            <Link to="/user/dashboard">My Bookings</Link>.
          </p>
        </Alert>
      )}

      {/* ── Hotel hero card ──────────────────────────────────────────── */}
      <Card className="shadow-sm border-0 mb-5">
        <div style={{ overflow: "hidden", maxHeight: "400px" }}>
          <Card.Img
            variant="top"
            src={imageUrl}
            alt={`${name} — ${location}`}
            style={{ width: "100%", height: "400px", objectFit: "cover" }}
            onError={(e) => {
              e.currentTarget.src =
                `https://placehold.co/1200x400/6c757d/ffffff?text=${encodeURIComponent(name)}`;
            }}
          />
        </div>

        <Card.Body className="p-4">
          <Row className="align-items-start mb-3">
            <Col xs={12} md={8}>
              <h1 className="fw-bold mb-2">{name}</h1>
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <Badge bg="secondary" className="fw-normal px-3 py-2">
                  📍 {location}
                </Badge>
                <div className="d-flex align-items-center gap-1">
                  <StarRating rating={starRating} />
                  <span className="text-muted small ms-1">({starRating}-star hotel)</span>
                </div>
              </div>
            </Col>
          </Row>
          <p className="text-muted mb-0" style={{ lineHeight: "1.6" }}>
            {description}
          </p>
        </Card.Body>
      </Card>

      {/* ── Rooms section ────────────────────────────────────────────── */}
      <div className="mb-4">
        <h3 className="fw-bold mb-1">Available Rooms</h3>
        <p className="text-muted small mb-3">
          Select a room to proceed with booking
        </p>
      </div>

      {rooms.length === 0 ? (
        <Alert variant="info" className="text-center">
          <p className="mb-0">No rooms are currently listed for this hotel.</p>
        </Alert>
      ) : (
        <Row className="g-4">
          {rooms.map((room) => (
            <Col key={room.id} xs={12} sm={6} lg={4}>
              <RoomCard
                {...room}
                hotelId={hotel.id}
                onBook={handleBookRoom}
              />
            </Col>
          ))}
        </Row>
      )}

      {/* ── Booking modal ─────────────────────────────────────────────── */}
      <BookingForm
        show={showModal}
        onHide={() => { setShowModal(false); setSelectedRoom(null); }}
        onSuccess={handleBookingSuccess}
        room={selectedRoom}
        hotelName={name}
      />

    </Container>
  );
}
