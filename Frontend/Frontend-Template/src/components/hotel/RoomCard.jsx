// RoomCard.jsx — Displays a single room within a hotel detail page.
//
// Props match RoomDTO exactly (hackothon_context.md §3):
//   id         Long
//   roomType   String   — "SINGLE" | "DOUBLE" | "SUITE"
//   price      Double
//   capacity   Integer
//   available  Boolean
//
// Additional props:
//   hotelId    Long     — passed through to onBook so BookingForm knows which hotel
//   onBook(room) — callback fired when "Book Now" is clicked (wired in Phase 8)

import { Card, Badge, Button, ListGroup } from "react-bootstrap";

// ── Room type metadata ────────────────────────────────────────────────────────
const ROOM_META = {
  SINGLE: { icon: "🛏️",  label: "Single Room",  bg: "info"    },
  DOUBLE: { icon: "🛏️🛏️", label: "Double Room",  bg: "primary" },
  SUITE:  { icon: "👑",   label: "Suite",         bg: "warning" },
};

export default function RoomCard({ id, roomType, price, capacity, available, hotelId, onBook }) {
  const meta = ROOM_META[roomType] ?? { icon: "🏠", label: roomType, bg: "secondary" };

  return (
    <Card
      className={`h-100 shadow-sm ${available ? "border-0" : "border-secondary opacity-75"}`}
    >
      {/* Availability ribbon */}
      <div
        className={`text-white text-center py-1 small fw-semibold ${
          available ? "bg-success" : "bg-secondary"
        }`}
        style={{ borderRadius: "0.375rem 0.375rem 0 0" }}
      >
        {available ? "✓ Available" : "✗ Unavailable"}
      </div>

      <Card.Body className="d-flex flex-column p-3">
        {/* Room type badge + icon */}
        <div className="d-flex align-items-center gap-2 mb-3">
          <span style={{ fontSize: "1.5rem" }} aria-hidden="true">
            {meta.icon}
          </span>
          <div>
            <Badge bg={meta.bg} className="fw-semibold px-2 py-1">
              {meta.label}
            </Badge>
          </div>
        </div>

        {/* Room details list */}
        <ListGroup variant="flush" className="mb-3 flex-grow-1">
          <ListGroup.Item className="px-0 py-1 d-flex justify-content-between border-0">
            <span className="text-muted small">Capacity</span>
            <span className="fw-medium small">
              👤 {capacity} {capacity === 1 ? "guest" : "guests"}
            </span>
          </ListGroup.Item>
          <ListGroup.Item className="px-0 py-1 d-flex justify-content-between border-0">
            <span className="text-muted small">Room Type</span>
            <span className="fw-medium small">{roomType}</span>
          </ListGroup.Item>
          <ListGroup.Item className="px-0 py-1 d-flex justify-content-between border-0">
            <span className="text-muted small">Status</span>
            <span className={`fw-medium small ${available ? "text-success" : "text-secondary"}`}>
              {available ? "Available" : "Not Available"}
            </span>
          </ListGroup.Item>
        </ListGroup>

        {/* Price */}
        <div className="mb-3">
          <span className="text-muted small d-block">Price per night</span>
          <span className="fw-bold text-primary fs-5">
            ₹{price.toLocaleString("en-IN")}
          </span>
          <span className="text-muted small"> /night</span>
        </div>

        {/* Book Now — enabled only when available; wired fully in Phase 8 */}
        <Button
          variant={available ? "primary" : "secondary"}
          className="w-100 mt-auto"
          disabled={!available}
          onClick={() => available && onBook && onBook({ id, roomType, price, capacity, hotelId })}
          aria-label={
            available
              ? `Book ${meta.label} at ₹${price.toLocaleString("en-IN")} per night`
              : `${meta.label} is not available`
          }
        >
          {available ? "Book Now" : "Unavailable"}
        </Button>
      </Card.Body>
    </Card>
  );
}
