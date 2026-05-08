// HotelDetail.jsx — Hotel detail page at /hotels/:id (placeholder for Phase 7).
// Phase 3: validates the dynamic route resolves correctly.
// Phase 7 will replace the body with real data from apiService.getHotelById(id).

import { useParams, Link } from "react-router-dom";
import { Container, Card, Button, Badge, Row, Col } from "react-bootstrap";

export default function HotelDetail() {
  const { id } = useParams();

  return (
    <Container className="py-5">
      {/* Back link */}
      <div className="mb-4">
        <Button as={Link} to="/" variant="outline-secondary" size="sm">
          ← Back to Hotels
        </Button>
      </div>

      {/* Hotel detail shell */}
      <Card className="shadow-sm mb-4">
        <div
          className="bg-secondary rounded-top"
          style={{ height: "260px" }}
          aria-label="Hotel image placeholder"
        />
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
            <div>
              <Card.Title className="fs-3 fw-bold placeholder-glow">
                <span className="placeholder col-6" />
              </Card.Title>
              <Card.Subtitle className="text-muted placeholder-glow">
                <span className="placeholder col-4" />
              </Card.Subtitle>
            </div>
            <Badge bg="warning" text="dark" className="fs-6 px-3 py-2">
              ★ —
            </Badge>
          </div>

          <p className="mt-3 text-muted placeholder-glow">
            <span className="placeholder col-10" />
            <span className="placeholder col-8" />
          </p>
        </Card.Body>
      </Card>

      {/* Rooms section shell */}
      <h4 className="fw-semibold mb-3">Available Rooms</h4>
      <Row className="g-3">
        {[1, 2, 3].map((n) => (
          <Col key={n} xs={12} md={6} lg={4}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="d-flex flex-column gap-2">
                <Card.Title className="placeholder-glow">
                  <span className="placeholder col-5" />
                </Card.Title>
                <p className="text-muted small placeholder-glow mb-0">
                  <span className="placeholder col-7" />
                </p>
                <Button variant="primary" className="mt-auto" disabled>
                  Book Now
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <p className="text-muted text-center mt-4 small">
        Showing placeholder for hotel ID: <strong>{id}</strong>.
        Real data loads in Phase 7 via <code>apiService.getHotelById({id})</code>.
      </p>
    </Container>
  );
}
