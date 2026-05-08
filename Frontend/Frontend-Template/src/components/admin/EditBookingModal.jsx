// EditBookingModal.jsx — Admin: edit a booking.
//
// Sends BookingUpdateDTO to apiService.adminUpdateBooking(id, updateData):
//   { checkIn, checkOut, status }  — all optional, send only changed fields
//
// Returns updated BookingResponseDTO on success.
//
// Props:
//   show            Boolean
//   onHide()
//   onSuccess(updated)   — called with the updated BookingResponseDTO
//   booking              — the BookingResponseDTO being edited

import { useState, useEffect } from "react";
import {
  Modal, Form, Button, Alert, Spinner, Row, Col, Badge,
} from "react-bootstrap";
import { adminUpdateBooking } from "../../services/apiService";

const STATUS_OPTIONS = ["CONFIRMED", "CANCELLED"];

// Today as YYYY-MM-DD
const today = new Date().toISOString().split("T")[0];

export default function EditBookingModal({ show, onHide, onSuccess, booking }) {
  const [fields,   setFields]   = useState({ checkIn: "", checkOut: "", status: "" });
  const [errors,   setErrors]   = useState({});
  const [loading,  setLoading]  = useState(false);
  const [apiError, setApiError] = useState(null);

  // Seed form with current booking values whenever modal opens
  useEffect(() => {
    if (show && booking) {
      setFields({
        checkIn:  booking.checkIn  || "",
        checkOut: booking.checkOut || "",
        status:   booking.status   || "CONFIRMED",
      });
      setErrors({});
      setApiError(null);
    }
  }, [show, booking?.id]);

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
    if (!fields.status) errs.status = "Status is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    if (!validate()) return;

    setLoading(true);
    try {
      // BookingUpdateDTO: { checkIn, checkOut, status }
      const updated = await adminUpdateBooking(booking.id, {
        checkIn:  fields.checkIn,
        checkOut: fields.checkOut,
        status:   fields.status,
      });
      onSuccess(updated);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Update failed. Please try again.";
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!booking) return null;

  return (
    <Modal show={show} onHide={onHide} centered size="md" backdrop="static">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold">Edit Booking #{booking.id}</Modal.Title>
      </Modal.Header>

      <Modal.Body className="pt-2">
        {/* Booking context */}
        <div className="bg-light rounded p-3 mb-4 small">
          <div className="d-flex gap-3 flex-wrap">
            <span><span className="text-muted">User:</span> <strong>{booking.userName}</strong></span>
            <span><span className="text-muted">Hotel:</span> <strong>{booking.hotelName}</strong></span>
            <span>
              <span className="text-muted">Room:</span>{" "}
              <Badge bg="light" text="dark" className="border">{booking.roomType}</Badge>
            </span>
            <span>
              <span className="text-muted">Total:</span>{" "}
              <strong className="text-primary">₹{booking.totalAmount.toLocaleString("en-IN")}</strong>
            </span>
          </div>
        </div>

        {apiError && (
          <Alert variant="danger" dismissible onClose={() => setApiError(null)} className="mb-3">
            {apiError}
          </Alert>
        )}

        <Form noValidate onSubmit={handleSubmit} id="edit-booking-form">
          <Row className="g-3">
            {/* Check-In */}
            <Col xs={12} sm={6}>
              <Form.Group controlId="editCheckIn">
                <Form.Label className="fw-medium small">Check-In Date</Form.Label>
                <Form.Control
                  type="date"
                  name="checkIn"
                  value={fields.checkIn}
                  min={today}
                  onChange={handleChange}
                  isInvalid={!!errors.checkIn}
                  disabled={loading}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.checkIn}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Check-Out */}
            <Col xs={12} sm={6}>
              <Form.Group controlId="editCheckOut">
                <Form.Label className="fw-medium small">Check-Out Date</Form.Label>
                <Form.Control
                  type="date"
                  name="checkOut"
                  value={fields.checkOut}
                  min={fields.checkIn || today}
                  onChange={handleChange}
                  isInvalid={!!errors.checkOut}
                  disabled={loading}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.checkOut}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Status */}
            <Col xs={12}>
              <Form.Group controlId="editStatus">
                <Form.Label className="fw-medium small">Status</Form.Label>
                <Form.Select
                  name="status"
                  value={fields.status}
                  onChange={handleChange}
                  isInvalid={!!errors.status}
                  disabled={loading}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.status}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>

      <Modal.Footer className="border-0 pt-0">
        <Button variant="outline-secondary" onClick={onHide} disabled={loading}>
          Cancel
        </Button>
        <Button
          type="submit"
          form="edit-booking-form"
          variant="warning"
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" role="status" />
              Saving…
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
