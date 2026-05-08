// SuperAdminDashboard.jsx — Super Admin analytics at /superadmin/analytics.
// Protected: SUPER_ADMIN role only.
// Phase 3: structural placeholder — real data loads in Phase 10
// via apiService.getRevenue() and apiService.getAnalytics().

import { Container, Row, Col, Card, Badge } from "react-bootstrap";
import { useAuth } from "../hooks/useAuth";

export default function SuperAdminDashboard() {
  const { user } = useAuth();

  return (
    <Container className="py-5">
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Super Admin — Analytics &amp; Revenue</h2>
        <p className="text-muted mb-0">
          Logged in as <strong>{user?.name}</strong>
          {" "}
          <Badge bg="danger">{user?.role}</Badge>
        </p>
      </div>

      {/* Revenue metrics row */}
      <h5 className="fw-semibold mb-3 text-uppercase text-muted small letter-spacing-1">
        Revenue Overview
      </h5>
      <Row className="g-3 mb-5">
        {[
          { label: "Total Revenue",     color: "primary" },
          { label: "Monthly Revenue",   color: "success" },
          { label: "Daily Revenue",     color: "info"    },
          { label: "Total Bookings",    color: "warning" },
          { label: "Confirmed",         color: "success" },
          { label: "Cancelled",         color: "danger"  },
        ].map(({ label, color }) => (
          <Col key={label} xs={12} sm={6} lg={4}>
            <Card className={`border-0 shadow-sm border-start border-${color} border-4`}>
              <Card.Body>
                <p className="text-muted small mb-1">{label}</p>
                <h4 className="fw-bold placeholder-glow mb-0">
                  <span className="placeholder col-5" />
                </h4>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Analytics metrics row */}
      <h5 className="fw-semibold mb-3 text-uppercase text-muted small">
        System Analytics
      </h5>
      <Row className="g-3">
        {[
          { label: "Total Users"       },
          { label: "Total Hotels"      },
          { label: "Total Rooms"       },
          { label: "Most Booked Hotel" },
          { label: "Top Location"      },
          { label: "Occupancy Rate"    },
        ].map(({ label }) => (
          <Col key={label} xs={12} sm={6} lg={4}>
            <Card className="shadow-sm border-0">
              <Card.Body>
                <p className="text-muted small mb-1">{label}</p>
                <h5 className="fw-bold placeholder-glow mb-0">
                  <span className="placeholder col-6" />
                </h5>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <p className="text-muted text-center mt-5 small">
        Live data loads in Phase 10 via{" "}
        <code>apiService.getRevenue()</code> and{" "}
        <code>apiService.getAnalytics()</code>.
      </p>
    </Container>
  );
}
