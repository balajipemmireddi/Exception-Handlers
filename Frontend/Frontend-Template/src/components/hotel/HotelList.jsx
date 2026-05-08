// HotelList.jsx — Fetches and displays all hotels.
//
// Phase 5: Calls apiService.getHotels() (USE_MOCKS = true returns mock HotelSummaryDTO[]).
// Maps each HotelSummaryDTO to a HotelCard component.
//
// Data shape: HotelSummaryDTO[] (hackothon_context.md §3)
//   [{ id, name, location, imageUrl, starRating, startingPrice }, ...]

import { useState, useEffect } from "react";
import { Row, Col, Spinner, Alert } from "react-bootstrap";
import { getHotels } from "../../services/apiService";
import HotelCard from "./HotelCard";

export default function HotelList() {
  const [hotels,  setHotels]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      setError(null);
      try {
        // Returns HotelSummaryDTO[] from apiService (mock or real)
        const data = await getHotels();
        setHotels(data);
      } catch (err) {
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load hotels. Please try again.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  // ── Loading state ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" role="status">
          <span className="visually-hidden">Loading hotels…</span>
        </Spinner>
        <p className="text-muted mt-3">Loading hotels…</p>
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────────────────────
  if (error) {
    return (
      <Alert variant="danger" className="text-center">
        <Alert.Heading>Unable to load hotels</Alert.Heading>
        <p className="mb-0">{error}</p>
      </Alert>
    );
  }

  // ── Empty state ───────────────────────────────────────────────────────────
  if (hotels.length === 0) {
    return (
      <Alert variant="info" className="text-center">
        <p className="mb-0">No hotels available at the moment. Check back soon!</p>
      </Alert>
    );
  }

  // ── Success: render hotel cards ──────────────────────────────────────────
  return (
    <Row className="g-4">
      {hotels.map((hotel) => (
        <Col key={hotel.id} xs={12} sm={6} lg={4}>
          <HotelCard {...hotel} />
        </Col>
      ))}
    </Row>
  );
}
