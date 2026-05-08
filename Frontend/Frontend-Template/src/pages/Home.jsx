// Home.jsx — Public landing / hotel listing page (placeholder for Phase 5).
// Phase 3: renders a structural shell so routing can be validated now.
// Phase 5 will replace the placeholder body with real HotelCard components
// fetched from apiService.getHotels().

import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main>
      {/* ── Hero banner ── */}
      <section className="bg-dark text-white py-5">
        <Container className="text-center py-4">
          <h1 className="display-5 fw-bold mb-3">Find Your Perfect Stay</h1>
          <p className="lead text-white-50 mb-4">
            Browse hotels across India — Mumbai, Goa, Hyderabad and more.
          </p>
          <Button as={Link} to="/" variant="primary" size="lg">
            Browse Hotels
          </Button>
        </Container>
      </section>

      {/* ── Hotel listing area (populated in Phase 5) ── */}
      <Container className="py-5">
        <h2 className="mb-4 fw-semibold">Available Hotels</h2>

        {/* Phase 5 placeholder — HotelList component goes here */}
        <Row className="g-4">
          {[1, 2, 3].map((n) => (
            <Col key={n} xs={12} md={6} lg={4}>
              <Card className="h-100 shadow-sm">
                <div
                  className="bg-secondary"
                  style={{ height: "180px" }}
                  aria-label="Hotel image placeholder"
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="placeholder-glow">
                    <span className="placeholder col-8" />
                  </Card.Title>
                  <Card.Text className="placeholder-glow flex-grow-1">
                    <span className="placeholder col-6" />
                  </Card.Text>
                  <Button variant="outline-primary" disabled>
                    View Details
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <p className="text-muted text-center mt-4 small">
          Hotel cards will load here in Phase 5 via <code>apiService.getHotels()</code>.
        </p>
      </Container>
    </main>
  );
}
