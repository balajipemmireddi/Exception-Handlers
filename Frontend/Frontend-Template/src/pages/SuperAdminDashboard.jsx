// SuperAdminDashboard.jsx — Phase 10: Super Admin analytics at /superadmin/analytics.
// Protected: SUPER_ADMIN role only.
//
// Fetches both endpoints in parallel with Promise.all:
//   GET /api/superadmin/revenue   → RevenueDTO
//   GET /api/superadmin/analytics → SystemAnalyticsDTO
//
// Passes both DTOs to SuperAdminAnalytics for rendering.
// No data is hardcoded here — all values come from apiService.js.

import { useState, useEffect } from "react";
import { Container, Badge, Spinner, Alert, Button } from "react-bootstrap";
import { getRevenue, getAnalytics } from "../services/apiService";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import SuperAdminAnalytics from "../components/admin/SuperAdminAnalytics";

export default function SuperAdminDashboard() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [revenue,   setRevenue]   = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch both endpoints in parallel — neither depends on the other
      const [revenueData, analyticsData] = await Promise.all([
        getRevenue(),    // → RevenueDTO
        getAnalytics(),  // → SystemAnalyticsDTO
      ]);
      setRevenue(revenueData);
      setAnalytics(analyticsData);
      showToast("Analytics data loaded.", "info");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load analytics data.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Container className="py-5">

      {/* ── Page header ─────────────────────────────────────────────── */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-1">Super Admin — Analytics &amp; Revenue</h2>
          <p className="text-muted mb-0 small">
            Logged in as <strong>{user?.name}</strong>{" "}
            <Badge bg="danger">{user?.role}</Badge>
          </p>
        </div>

        {/* Refresh button — re-runs both fetches */}
        {!loading && (
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={fetchData}
            aria-label="Refresh analytics data"
          >
            ↻ Refresh
          </Button>
        )}
      </div>

      {/* ── Loading ──────────────────────────────────────────────────── */}
      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" variant="danger" role="status">
            <span className="visually-hidden">Loading analytics…</span>
          </Spinner>
          <p className="text-muted mt-3">Loading revenue &amp; analytics data…</p>
        </div>
      )}

      {/* ── Error ────────────────────────────────────────────────────── */}
      {!loading && error && (
        <Alert variant="danger">
          <Alert.Heading>Unable to load analytics</Alert.Heading>
          <p className="mb-3">{error}</p>
          <Button variant="outline-danger" size="sm" onClick={fetchData}>
            Try Again
          </Button>
        </Alert>
      )}

      {/* ── Analytics content ────────────────────────────────────────── */}
      {!loading && !error && revenue && analytics && (
        <SuperAdminAnalytics
          revenue={revenue}
          analytics={analytics}
        />
      )}

    </Container>
  );
}
