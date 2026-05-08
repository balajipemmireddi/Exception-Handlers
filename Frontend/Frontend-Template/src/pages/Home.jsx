// Home.jsx — Phase 5: Hotel Listing UI (Home Page)
//
// Renders:
//   1. Hero banner with CTA
//   2. HotelList component — fetches HotelSummaryDTO[] from apiService.getHotels()
//      and renders one HotelCard per hotel
//
// No data is hardcoded here. All hotel data comes from apiService.js.

import { Container } from "react-bootstrap";
import HotelList from "../components/hotel/HotelList";

export default function Home() {
  return (
    <main>
      {/* ── Hero banner ─────────────────────────────────────────────────── */}
      <section
        className="bg-dark text-white py-5"
        style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        }}
      >
        <Container className="text-center py-4">
          <h1 className="display-5 fw-bold mb-3">Find Your Perfect Stay</h1>
          <p className="lead mb-2" style={{ color: "rgba(255,255,255,0.75)" }}>
            Browse premium hotels across India — Mumbai, Goa, Hyderabad and more.
          </p>
          <p className="small mb-0" style={{ color: "rgba(255,255,255,0.5)" }}>
            Best prices guaranteed · Free cancellation on select rooms
          </p>
        </Container>
      </section>

      {/* ── Hotel listing ────────────────────────────────────────────────── */}
      <Container className="py-5">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div>
            <h2 className="fw-bold mb-1">Available Hotels</h2>
            <p className="text-muted mb-0 small">
              Showing all properties — click a card to view rooms and book
            </p>
          </div>
        </div>

        {/* HotelList handles loading / error / empty states internally */}
        <HotelList />
      </Container>
    </main>
  );
}
