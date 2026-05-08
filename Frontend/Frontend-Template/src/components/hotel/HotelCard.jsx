// HotelCard.jsx — Displays a single hotel summary.
//
// Props match HotelSummaryDTO exactly (hackothon_context.md §3):
//   id           Long
//   name         String
//   location     String
//   imageUrl     String
//   starRating   Integer  (1–5)
//   startingPrice Double

import { Card, Badge, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

// ── Star renderer ─────────────────────────────────────────────────────────────
function StarRating({ rating }) {
  return (
    <span aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          style={{ color: i < rating ? "#f5a623" : "#d1d5db", fontSize: "1rem" }}
          aria-hidden="true"
        >
          ★
        </span>
      ))}
    </span>
  );
}

// ── HotelCard ─────────────────────────────────────────────────────────────────
export default function HotelCard({ id, name, location, imageUrl, starRating, startingPrice }) {
  return (
    <Card className="h-100 shadow-sm border-0 hotel-card">
      {/* Hotel image */}
      <div style={{ overflow: "hidden", height: "200px" }}>
        <Card.Img
          variant="top"
          src={imageUrl}
          alt={`${name} — ${location}`}
          style={{
            height: "200px",
            objectFit: "cover",
            transition: "transform 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          onError={(e) => {
            // Fallback if image fails to load
            e.currentTarget.src =
              `https://placehold.co/400x200/6c757d/ffffff?text=${encodeURIComponent(name)}`;
          }}
        />
      </div>

      <Card.Body className="d-flex flex-column p-3">
        {/* Location badge */}
        <div className="mb-2">
          <Badge bg="secondary" className="fw-normal">
            📍 {location}
          </Badge>
        </div>

        {/* Hotel name */}
        <Card.Title className="fw-bold mb-1 fs-6" title={name}>
          {name}
        </Card.Title>

        {/* Star rating */}
        <div className="mb-2">
          <StarRating rating={starRating} />
          <span className="text-muted small ms-1">({starRating}-star)</span>
        </div>

        {/* Spacer pushes price + button to bottom */}
        <div className="flex-grow-1" />

        {/* Starting price */}
        <div className="d-flex justify-content-between align-items-center mt-2">
          <div>
            <span className="text-muted small">From</span>
            <div className="fw-bold text-primary fs-5">
              ₹{startingPrice.toLocaleString("en-IN")}
              <span className="text-muted fw-normal small"> /night</span>
            </div>
          </div>

          {/* View Details → /hotels/:id */}
          <Button
            as={Link}
            to={`/hotels/${id}`}
            variant="primary"
            size="sm"
            className="px-3"
          >
            View Details
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
