// HotelList.jsx — Phase 6: Hotel listing with search support.
//
// Props:
//   searchParams  { location, checkIn, checkOut } | null
//     null / undefined → calls apiService.getHotels()   (all hotels)
//     object           → calls apiService.searchHotels() (filtered results)
//
// Data shape: HotelSummaryDTO[] (hackothon_context.md §3)
//   [{ id, name, location, imageUrl, starRating, startingPrice }, ...]

import { useState, useEffect } from "react";
import { Row, Col, Spinner, Alert, Badge } from "react-bootstrap";
import { getHotels, searchHotels } from "../../services/apiService";
import HotelCard from "./HotelCard";

export default function HotelList({ searchParams = null }) {
  const [hotels,  setHotels]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  // Re-fetch whenever searchParams changes (null = show all, object = filtered)
  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      setError(null);
      try {
        let data;
        if (searchParams) {
          // Phase 6: filtered call — GET /api/hotels/search?location=&checkIn=&checkOut=
          data = await searchHotels(searchParams);
        } else {
          // Phase 5 default: GET /api/hotels
          data = await getHotels();
        }
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
  }, [searchParams]);

  // ── Loading state ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" role="status">
          <span className="visually-hidden">
            {searchParams ? "Searching hotels…" : "Loading hotels…"}
          </span>
        </Spinner>
        <p className="text-muted mt-3">
          {searchParams ? "Searching hotels…" : "Loading hotels…"}
        </p>
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

  // ── Result header (only shown when a search was performed) ────────────────
  const ResultHeader = () => {
    if (!searchParams) return null;

    const { location, checkIn, checkOut } = searchParams;
    const parts = [];
    if (location) parts.push(`"${location}"`);
    if (checkIn && checkOut) parts.push(`${checkIn} → ${checkOut}`);

    return (
      <div className="d-flex align-items-center gap-2 mb-3 flex-wrap">
        <span className="text-muted small">
          Search results for{" "}
          {parts.map((p, i) => (
            <Badge key={i} bg="light" text="dark" className="border me-1 fw-normal">
              {p}
            </Badge>
          ))}
        </span>
        <Badge bg={hotels.length > 0 ? "success" : "secondary"}>
          {hotels.length} {hotels.length === 1 ? "hotel" : "hotels"} found
        </Badge>
      </div>
    );
  };

  // ── Empty state ───────────────────────────────────────────────────────────
  if (hotels.length === 0) {
    return (
      <>
        <ResultHeader />
        <Alert variant="warning" className="text-center">
          <Alert.Heading>No hotels found</Alert.Heading>
          <p className="mb-0">
            {searchParams
              ? "No hotels match your search criteria. Try a different location or dates."
              : "No hotels available at the moment. Check back soon!"}
          </p>
        </Alert>
      </>
    );
  }

  // ── Success: render hotel cards ───────────────────────────────────────────
  return (
    <>
      <ResultHeader />
      <Row className="g-4">
        {hotels.map((hotel) => (
          <Col key={hotel.id} xs={12} sm={6} lg={4}>
            <HotelCard {...hotel} />
          </Col>
        ))}
      </Row>
    </>
  );
}
