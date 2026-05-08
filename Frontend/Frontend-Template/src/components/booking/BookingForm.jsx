// BookingForm.jsx — Phase 8: Booking creation modal.
//
// Renders a Bootstrap Modal with check-in / check-out date pickers.
// On submit calls apiService.createBooking() with BookingRequestDTO:
//   { hotelId, roomId, checkIn, checkOut }
//
// Returns BookingResponseDTO on success:
//   { id, userId, userName, hotelName, roomType, checkIn, checkOut,
//     status, totalAmount, createdAt }
//
// Props:
//   show          Boolean          — controls modal visibility
//   onHide()                       — close without booking
//   onSuccess(booking)             — called with the new BookingResponseDTO
//   room          { id, roomType, price, capacity, hotelId }
//   hotelName     String

import { useState, useEffect } from "react";
import {
  Modal, Form, Button, Alert, Spinner, Row, Col, ListGroup, Badge,
} from "react-bootstrap";
import { createBooking } from "../../services/apiService";
import { useAuth } from "../../hooks/useAuth";

// Today as YYYY-MM-DD — minimum selectable date
const today = new Date().toISOString().split("T")[0];

// Calculate nights between two YYYY-MM-DD strings
const calcNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  const diff = new Date(checkOut) - new Date(checkIn);
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

export default function BookingForm({ show, onHide, onSuccess, room, hotelName }) {
  const { isAuthenticated } = useAuth();

  const [fields,  setFields]  = useState({ checkIn: "", checkOut: "" });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Reset form whenever the modal opens for a new room
  useEffect(() => {
    if (show) {
      setFields({ checkIn: "", checkOut: "" });
      setErrors({});
      setApiError(null);
    }
  }, [show, room?.id]);

  const nights      = calcNights(fields.checkIn, fields.checkOut);
  const totalAmount = room ? room.price * Math.max(nights, 0) : 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!fields.checkIn)  errs.checkIn  = "Check-in date is required.";
    if (!fields.checkOut) errs.checkOut = "Check-out date is required.";
    if (fields.checkIn && fields.checkOut && fields.checkOut <= fields.checkIn) {
      errs.checkOut = "Check-out must be after check-in.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    if (!validate()) return;

    setLoading(true);
    try {
      // BookingRequestDTO: { hotelId, roomId, checkIn, checkOut }
      const bookingRequest = {
        hotelId:  room.hotelId,
        roomId:   room.id,
        checkIn:  fields.checkIn,
        checkOut: fields.checkOut,
      };

      // Returns BookingResponseDTO
      const booking = await createBooking(bookingRequest);
      onSuccess(booking);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Booking failed. Please try again.";
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!room) return null;

  return (
    <Modal show={show} onHide={onHide} centered size="md" backdrop="static">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold">Confirm Your Booking</Modal.Title>
      </Modal.Header>

      <Modal.Body className="pt-2">
        {/* ── Booking summary ─────────────────────────────────────────── */}
        <div className="bg-light rounded p-3 mb-4">
          <p className="fw-semibold mb-2">🏨 {hotelName}</p>
          <ListGroup variant="flush" className="small">
            <ListGroup.Item className="bg-transparent px-0 py-1 d-flex justify-content-between border-0">
              <span className="text-muted">Room Type</span>
              <Badge bg="primary">{room.roomType}</Badge>
            </ListGroup.Item>
            <ListGroup.Item className="bg-transparent px-0 py-1 d-flex justify-content-between border-0">
              <span className="text-muted">Capacity</span>
              <span>👤 {room.capacity} {room.capacity === 1 ? "guest" : "guests"}</span>
            </ListGroup.Item>
            <ListGroup.Item className="bg-transparent px-0 py-1 d-flex justify-content-between border-0">
              <span className="text-muted">Price per night</span>
              <span className="fw-semibold text-primary">
                ₹{room.price.toLocaleString("en-IN")}
              </span>
            </ListGroup.Item>
          </ListGroup>
        </div>

        {/* ── API error ───────────────────────────────────────────────── */}
        {apiError && (
          <Alert variant="danger" dismissible onClose={() => setApiError(null)} className="mb-3">
            {apiError}
          </Alert>
        )}

        {/* ── Not logged in warning ───────────────────────────────────── */}
        {!isAuthenticated && (
          <Alert variant="warning" className="mb-3">
            You must be <strong>logged in</strong> to make a booking.
          </Alert>
        )}

        {/* ── Date form ───────────────────────────────────────────────── */}
        <Form noValidate onSubmit={handleSubmit} id="booking-form">
          <Row className="g-3">
            <Col xs={12} sm={6}>
              <Form.Group controlId="bookingCheckIn">
                <Form.Label className="fw-medium small">Check-In Date</Form.Label>
                <Form.Control
                  type="date"
                  name="checkIn"
                  value={fields.checkIn}
                  min={today}
                  onChange={handleChange}
                  isInvalid={!!errors.checkIn}
                  disabled={loading || !isAuthenticated}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.checkIn}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col xs={12} sm={6}>
              <Form.Group controlId="bookingCheckOut">
                <Form.Label className="fw-medium small">Check-Out Date</Form.Label>
                <Form.Control
                  type="date"
                  name="checkOut"
                  value={fields.checkOut}
                  min={fields.checkIn || today}
                  onChange={handleChange}
                  isInvalid={!!errors.checkOut}
                  disabled={loading || !isAuthenticated}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.checkOut}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
        </Form>

        {/* ── Live price summary ──────────────────────────────────────── */}
        {nights > 0 && (
          <div className="mt-4 p-3 border rounded bg-white">
            <div className="d-flex justify-content-between small text-muted mb-1">
              <span>
                ₹{room.price.toLocaleString("en-IN")} × {nights}{" "}
                {nights === 1 ? "night" : "nights"}
              </span>
              <span>₹{totalAmount.toLocaleString("en-IN")}</span>
            </div>
            <div className="d-flex justify-content-between fw-bold border-top pt-2 mt-1">
              <span>Total</span>
              <span className="text-primary fs-5">
                ₹{totalAmount.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer className="border-0 pt-0">
        <Button variant="outline-secondary" onClick={onHide} disabled={loading}>
          Cancel
        </Button>
        <Button
          type="submit"
          form="booking-form"
          variant="primary"
          disabled={loading || !isAuthenticated}
        >
          {loading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" role="status" />
              Booking…
            </>
          ) : (
            "Confirm Booking"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
