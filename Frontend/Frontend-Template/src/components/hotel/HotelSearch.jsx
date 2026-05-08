// HotelSearch.jsx — Phase 6: Search bar for hotel listing page.
//
// Fields map to GET /api/hotels/search query params (hackothon_context.md §5):
//   location  String  — case-insensitive partial match on hotel.location
//   checkIn   String  — "YYYY-MM-DD"
//   checkOut  String  — "YYYY-MM-DD"
//
// Props:
//   onSearch(params)  — called with { location, checkIn, checkOut } on submit
//   onClear()         — called when the user resets the form
//   loading           — disables the button while a search is in flight

import { useState } from "react";
import {
  Form, Button, Row, Col, InputGroup,
} from "react-bootstrap";

// Today's date as YYYY-MM-DD — used as the min value for date pickers
const today = new Date().toISOString().split("T")[0];

const EMPTY = { location: "", checkIn: "", checkOut: "" };

export default function HotelSearch({ onSearch, onClear, loading = false }) {
  const [fields, setFields] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    // Clear inline error on change
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errs = {};

    if (fields.checkIn && fields.checkOut) {
      if (fields.checkOut <= fields.checkIn) {
        errs.checkOut = "Check-out must be after check-in.";
      }
    }
    if (fields.checkOut && !fields.checkIn) {
      errs.checkIn = "Please select a check-in date.";
    }
    if (fields.checkIn && !fields.checkOut) {
      errs.checkOut = "Please select a check-out date.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSearch({ ...fields });
  };

  const handleClear = () => {
    setFields(EMPTY);
    setErrors({});
    onClear();
  };

  const isDirty =
    fields.location.trim() !== "" ||
    fields.checkIn !== "" ||
    fields.checkOut !== "";

  return (
    <div className="bg-white border rounded shadow-sm p-4 mb-4">
      <h5 className="fw-semibold mb-3">🔍 Search Hotels</h5>

      <Form noValidate onSubmit={handleSubmit}>
        <Row className="g-3 align-items-end">

          {/* Location */}
          <Col xs={12} md={4}>
            <Form.Group controlId="searchLocation">
              <Form.Label className="fw-medium small mb-1">Destination</Form.Label>
              <InputGroup>
                <InputGroup.Text className="bg-white border-end-0">
                  📍
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  name="location"
                  placeholder="e.g. Mumbai, Goa…"
                  value={fields.location}
                  onChange={handleChange}
                  className="border-start-0"
                  disabled={loading}
                  autoComplete="off"
                />
              </InputGroup>
            </Form.Group>
          </Col>

          {/* Check-In */}
          <Col xs={12} sm={6} md={3}>
            <Form.Group controlId="searchCheckIn">
              <Form.Label className="fw-medium small mb-1">Check-In</Form.Label>
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
          <Col xs={12} sm={6} md={3}>
            <Form.Group controlId="searchCheckOut">
              <Form.Label className="fw-medium small mb-1">Check-Out</Form.Label>
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

          {/* Actions */}
          <Col xs={12} md={2} className="d-flex gap-2">
            <Button
              type="submit"
              variant="primary"
              className="flex-grow-1"
              disabled={loading}
            >
              {loading ? "Searching…" : "Search"}
            </Button>

            {isDirty && (
              <Button
                type="button"
                variant="outline-secondary"
                onClick={handleClear}
                disabled={loading}
                title="Clear search"
                aria-label="Clear search"
              >
                ✕
              </Button>
            )}
          </Col>

        </Row>
      </Form>
    </div>
  );
}
