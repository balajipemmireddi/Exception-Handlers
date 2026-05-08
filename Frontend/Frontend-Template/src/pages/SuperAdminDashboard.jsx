import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getRevenue, getAnalytics } from "../services/apiService";
import { useAuth } from "../hooks/useAuth";

export default function SuperAdminDashboard() {
  const { user } = useAuth();

  const [revenue,   setRevenue]   = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading,   setLoading]   = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [rev, ana] = await Promise.all([getRevenue(), getAnalytics()]);
      setRevenue(rev);
      setAnalytics(ana);
      toast.info("Analytics loaded");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const inr = (n) => "₹" + Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-1">Super Admin — Analytics &amp; Revenue</h2>
          <p className="text-muted small mb-0">
            Logged in as <strong>{user?.name}</strong>{" "}
            <span className="badge bg-danger">{user?.role}</span>
          </p>
        </div>
        {!loading && (
          <button className="btn btn-outline-secondary btn-sm" onClick={fetchData}>↻ Refresh</button>
        )}
      </div>

      {loading && <p className="text-center text-muted">Loading analytics…</p>}

      {!loading && revenue && analytics && (
        <>
          {/* Revenue */}
          <h5 className="fw-bold mb-3">💰 Revenue Overview</h5>
          <div className="row g-3 mb-5">
            {[
              { label: "Total Revenue",     value: inr(revenue.totalRevenue),     color: "primary" },
              { label: "Monthly Revenue",   value: inr(revenue.monthlyRevenue),   color: "success" },
              { label: "Daily Revenue",     value: inr(revenue.dailyRevenue),     color: "info"    },
              { label: "Total Bookings",    value: revenue.totalBookings,         color: "warning" },
              { label: "Confirmed",         value: revenue.confirmedBookings,     color: "success" },
              { label: "Cancelled",         value: revenue.cancelledBookings,     color: "danger"  },
            ].map(({ label, value, color }) => (
              <div key={label} className="col-12 col-sm-6 col-xl-4">
                <div className={`card border-0 shadow-sm border-start border-${color} border-4`}>
                  <div className="card-body py-3">
                    <p className="text-muted small mb-1">{label}</p>
                    <h4 className="fw-bold mb-0">{value}</h4>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Analytics */}
          <h5 className="fw-bold mb-3">📊 System Analytics</h5>
          <div className="row g-3 mb-4">
            {[
              { label: "Total Users",       value: analytics.totalUsers },
              { label: "Total Hotels",      value: analytics.totalHotels },
              { label: "Total Rooms",       value: analytics.totalRooms },
              { label: "Total Bookings",    value: analytics.totalBookings },
              { label: "Most Booked Hotel", value: analytics.mostBookedHotel },
              { label: "Top Location",      value: analytics.topLocation },
            ].map(({ label, value }) => (
              <div key={label} className="col-12 col-sm-6 col-xl-4">
                <div className="card border-0 shadow-sm">
                  <div className="card-body py-3">
                    <p className="text-muted small mb-1">{label}</p>
                    <h5 className="fw-bold mb-0">{value}</h5>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Occupancy */}
          <div className="card border-0 shadow-sm text-white"
               style={{ background: "linear-gradient(135deg,#1a1a2e,#0f3460)" }}>
            <div className="card-body py-4 px-4">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                <div>
                  <p className="small text-white-50 mb-1">System Occupancy Rate</p>
                  <h2 className="fw-bold mb-1">{analytics.occupancyRate}%</h2>
                  <p className="text-white-50 small mb-0">Percentage of rooms currently occupied</p>
                </div>
                <div style={{ minWidth: "200px" }}>
                  <div className="progress" style={{ height: "12px", borderRadius: "6px" }}>
                    <div
                      className={`progress-bar ${analytics.occupancyRate >= 70 ? "bg-success" : analytics.occupancyRate >= 40 ? "bg-warning" : "bg-danger"}`}
                      style={{ width: `${analytics.occupancyRate}%` }}
                    />
                  </div>
                  <p className="text-white-50 small mt-2 mb-0 text-end">
                    {analytics.occupancyRate >= 70 ? "🟢 Healthy" : analytics.occupancyRate >= 40 ? "🟡 Moderate" : "🔴 Low"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
