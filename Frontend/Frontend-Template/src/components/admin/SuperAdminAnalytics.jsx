// SuperAdminAnalytics.jsx — Renders RevenueDTO + SystemAnalyticsDTO metrics.
//
// Props:
//   revenue    RevenueDTO    (hackothon_context.md §3)
//     { totalRevenue, monthlyRevenue, dailyRevenue,
//       totalBookings, confirmedBookings, cancelledBookings }
//
//   analytics  SystemAnalyticsDTO
//     { totalUsers, totalHotels, totalRooms, totalBookings,
//       mostBookedHotel, topLocation, occupancyRate }
//
// No data fetching here — all data is passed in from SuperAdminDashboard.

import { Row, Col, Card, Badge, ProgressBar } from "react-bootstrap";

// ── Reusable metric card ──────────────────────────────────────────────────────
function MetricCard({ label, value, subValue, borderColor, icon, valueClass }) {
  return (
    <Card className={`border-0 shadow-sm h-100 border-start border-4 border-${borderColor}`}>
      <Card.Body className="py-3 px-4">
        <div className="d-flex justify-content-between align-items-start">
          <div className="flex-grow-1">
            <p className="text-muted small text-uppercase fw-semibold mb-1"
               style={{ letterSpacing: "0.05em", fontSize: "0.7rem" }}>
              {label}
            </p>
            <h4 className={`fw-bold mb-0 ${valueClass || ""}`}>{value}</h4>
            {subValue && (
              <p className="text-muted small mb-0 mt-1">{subValue}</p>
            )}
          </div>
          {icon && (
            <span style={{ fontSize: "1.75rem", opacity: 0.6 }} aria-hidden="true">
              {icon}
            </span>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}

// ── Currency formatter ────────────────────────────────────────────────────────
const inr = (n) =>
  "₹" + Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });

export default function SuperAdminAnalytics({ revenue, analytics }) {
  // ── RevenueDTO fields ─────────────────────────────────────────────────────
  const {
    totalRevenue,
    monthlyRevenue,
    dailyRevenue,
    totalBookings,
    confirmedBookings,
    cancelledBookings,
  } = revenue;

  // ── SystemAnalyticsDTO fields ─────────────────────────────────────────────
  const {
    totalUsers,
    totalHotels,
    totalRooms,
    totalBookings: analyticsBookings,
    mostBookedHotel,
    topLocation,
    occupancyRate,
  } = analytics;

  // Booking health ratio for the progress bar
  const confirmRate = totalBookings > 0
    ? Math.round((confirmedBookings / totalBookings) * 100)
    : 0;

  return (
    <>
      {/* ── Section 1: Revenue Overview ─────────────────────────────── */}
      <div className="d-flex align-items-center gap-2 mb-3">
        <h5 className="fw-bold mb-0">💰 Revenue Overview</h5>
        <Badge bg="danger" className="fw-normal">SUPER_ADMIN</Badge>
      </div>

      <Row className="g-3 mb-2">
        <Col xs={12} sm={6} xl={4}>
          <MetricCard
            label="Total Revenue"
            value={inr(totalRevenue)}
            subValue="All-time earnings"
            borderColor="primary"
            icon="💵"
            valueClass="text-primary"
          />
        </Col>
        <Col xs={12} sm={6} xl={4}>
          <MetricCard
            label="Monthly Revenue"
            value={inr(monthlyRevenue)}
            subValue="Current month"
            borderColor="success"
            icon="📅"
            valueClass="text-success"
          />
        </Col>
        <Col xs={12} sm={6} xl={4}>
          <MetricCard
            label="Daily Revenue"
            value={inr(dailyRevenue)}
            subValue="Today"
            borderColor="info"
            icon="📆"
            valueClass="text-info"
          />
        </Col>
        <Col xs={12} sm={6} xl={4}>
          <MetricCard
            label="Total Bookings"
            value={totalBookings.toLocaleString("en-IN")}
            subValue="All-time"
            borderColor="warning"
            icon="🧾"
          />
        </Col>
        <Col xs={12} sm={6} xl={4}>
          <MetricCard
            label="Confirmed Bookings"
            value={confirmedBookings.toLocaleString("en-IN")}
            subValue={`${confirmRate}% of total`}
            borderColor="success"
            icon="✅"
            valueClass="text-success"
          />
        </Col>
        <Col xs={12} sm={6} xl={4}>
          <MetricCard
            label="Cancelled Bookings"
            value={cancelledBookings.toLocaleString("en-IN")}
            subValue={`${100 - confirmRate}% of total`}
            borderColor="danger"
            icon="❌"
            valueClass="text-danger"
          />
        </Col>
      </Row>

      {/* Booking health bar */}
      <Card className="border-0 shadow-sm mb-5">
        <Card.Body className="py-3 px-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="small fw-semibold text-muted">Booking Health</span>
            <span className="small text-muted">
              {confirmedBookings} confirmed / {cancelledBookings} cancelled
            </span>
          </div>
          <ProgressBar style={{ height: "10px" }}>
            <ProgressBar
              variant="success"
              now={confirmRate}
              key={1}
              label={confirmRate > 10 ? `${confirmRate}%` : ""}
            />
            <ProgressBar
              variant="danger"
              now={100 - confirmRate}
              key={2}
            />
          </ProgressBar>
        </Card.Body>
      </Card>

      {/* ── Section 2: System Analytics ─────────────────────────────── */}
      <div className="d-flex align-items-center gap-2 mb-3">
        <h5 className="fw-bold mb-0">📊 System Analytics</h5>
      </div>

      <Row className="g-3 mb-4">
        <Col xs={12} sm={6} xl={4}>
          <MetricCard
            label="Total Users"
            value={totalUsers.toLocaleString("en-IN")}
            subValue="Registered accounts"
            borderColor="primary"
            icon="👥"
          />
        </Col>
        <Col xs={12} sm={6} xl={4}>
          <MetricCard
            label="Total Hotels"
            value={totalHotels.toLocaleString("en-IN")}
            subValue="Listed properties"
            borderColor="warning"
            icon="🏨"
          />
        </Col>
        <Col xs={12} sm={6} xl={4}>
          <MetricCard
            label="Total Rooms"
            value={totalRooms.toLocaleString("en-IN")}
            subValue="Across all hotels"
            borderColor="info"
            icon="🛏️"
          />
        </Col>
        <Col xs={12} sm={6} xl={4}>
          <MetricCard
            label="Total Bookings"
            value={analyticsBookings.toLocaleString("en-IN")}
            subValue="System-wide"
            borderColor="secondary"
            icon="🧾"
          />
        </Col>
        <Col xs={12} sm={6} xl={4}>
          <MetricCard
            label="Most Booked Hotel"
            value={mostBookedHotel}
            subValue="Top performer"
            borderColor="success"
            icon="🏆"
            valueClass="text-success"
          />
        </Col>
        <Col xs={12} sm={6} xl={4}>
          <MetricCard
            label="Top Location"
            value={topLocation}
            subValue="Highest demand city"
            borderColor="warning"
            icon="📍"
          />
        </Col>
      </Row>

      {/* Occupancy rate highlight card */}
      <Card className="border-0 shadow-sm"
            style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)" }}>
        <Card.Body className="py-4 px-4 text-white">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <p className="small text-white-50 text-uppercase fw-semibold mb-1"
                 style={{ letterSpacing: "0.05em", fontSize: "0.7rem" }}>
                System Occupancy Rate
              </p>
              <h2 className="fw-bold mb-1">{occupancyRate}%</h2>
              <p className="text-white-50 small mb-0">
                Percentage of rooms currently occupied
              </p>
            </div>
            <div style={{ minWidth: "200px" }}>
              <ProgressBar
                now={occupancyRate}
                variant={occupancyRate >= 70 ? "success" : occupancyRate >= 40 ? "warning" : "danger"}
                style={{ height: "12px", borderRadius: "6px" }}
                label={`${occupancyRate}%`}
              />
              <p className="text-white-50 small mt-2 mb-0 text-end">
                {occupancyRate >= 70 ? "🟢 Healthy" : occupancyRate >= 40 ? "🟡 Moderate" : "🔴 Low"}
              </p>
            </div>
          </div>
        </Card.Body>
      </Card>
    </>
  );
}
