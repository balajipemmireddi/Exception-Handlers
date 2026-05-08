// HotelDetail.jsx — Phase 7: Hotel detail page at /hotels/:id
//
// Fetches HotelDetailDTO from apiService.getHotelById(id):
//   { id, name, location, description, imageUrl, starRating, rooms[] }
//
// Renders:
//   • Hotel hero image + metadata (name, location, star rating, description)
//   • List of RoomCard components (one per room in rooms[])
//   • "Book Now" on RoomCard is a placeholder — Phase 8 wires the booking modal

import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Container, Row, Col, Card, Button, Badge, Spinner, Alert,
} from "react-bootstrap";
import { getHotelById } from "../services/apiService";
import RoomCard from "../components/hotel/RoomCard";

// ── Star renderer (reused from HotelCard) ─────────────────────────────────────
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

  const [hotel,   setHotel]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    const fetchHotel = async () => {
      setLoading(true);
      setError(null);
      try {
        // Returns HotelDetailDTO: { id, name, location, description, imageUrl, starRating, rooms[] }
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

  // ── Loading state ─────────────────────────────────────────────────────────
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

  // ── Error state (404 or other) ───────────────────────────────────────────
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

  // ── Success: render hotel detail ─────────────────────────────────────────
  const { name, location, description, imageUrl, starRating, rooms } = hotel;

  // Placeholder for Phase 8 — will open a booking modal
  const handleBookRoom = (room) => {
    console.log("Phase 8: Open booking modal for room", room);
    // Phase 8 will implement the actual booking flow here
  };

  return (
    <Container className="py-5">

      {/* ── Back link ────────────────────────────────────────────────── */}
      <div className="mb-4">
        <Button as={Link} to="/" variant="outline-secondary" size="sm">
          ← Back to Hotels
        </Button>
      </div>

      {/* ── Hotel hero card ─────────────────────────────────────────────── */}
      <Card className="shadow-sm border-0 mb-5">
        {/* Hero image */}
        <div style={{ overflow: "hidden", maxHeight: "400px" }}>
          <Card.Img
            variant="top"
            src={imageUrl}
            alt={`${name} — ${location}`}
            style={{
              width: "100%",
              height: "400px",
              objectFit: "cover",
            }}
            onError={(e) => {
              e.currentTarget.src =
                `https://placehold.co/1200x400/6c757d/ffffff?text=${encodeURIComponent(name)}`;
            }}
          />
        </div>

        <Card.Body className="p-4">
          {/* Header row: name + location + star rating */}
          <Row className="align-items-start mb-3">
            <Col xs={12} md={8}>
              <h1 className="fw-bold mb-2">{name}</h1>
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <Badge bg="secondary" className="fw-normal px-3 py-2">
                  📍 {location}
                </Badge>
                <div className="d-flex align-items-center gap-1">
                  <StarRating rating={starRating} />
                  <span className="text-muted small ms-1">
                    ({starRating}-star hotel)
                  </span>
                </div>
              </div>
            </Col>
          </Row>

          {/* Description */}
          <p className="text-muted mb-0" style={{ lineHeight: "1.6" }}>
            {description}
          </p>
        </Card.Body>
      </Card>

      {/* ── Rooms section ───────────────────────────────────────────────── */}
      <div className="mb-4">
        <h3 className="fw-bold mb-1">Available Rooms</h3>
        <p className="text-muted small mb-3">
          Select a room to proceed with booking
        </p>
      </div>

      {rooms.length === 0 ? (
        <Alert variant="info" className="text-center">
          <p className="mb-0">
            No rooms are currently listed for this hotel. Check back later!
          </p>
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

    </Container>
  );
}
