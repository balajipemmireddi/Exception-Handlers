// Home.jsx — Phase 6: Hotel Listing + Search
//
// State owned here:
//   searchParams  { location, checkIn, checkOut } | null
//     null  → HotelList calls apiService.getHotels()    (all hotels)
//     object → HotelList calls apiService.searchHotels() (filtered)
//
// No hotel data is hardcoded here. All data flows through apiService.js.

import { useState } from "react";
import { Container } from "react-bootstrap";
import HotelSearch from "../components/hotel/HotelSearch";
import HotelList   from "../components/hotel/HotelList";

export default function Home() {
  // null = no active search (show all); object = active search params
  const [searchParams,   setSearchParams]   = useState(null);
  const [searchLoading,  setSearchLoading]  = useState(false);

  // Called by HotelSearch on submit
  const handleSearch = (params) => {
    setSearchLoading(true);
    setSearchParams(params);
    // Loading flag is reset by HotelList once its fetch completes;
    // we turn it off after a short tick so the button shows "Searching…"
    setTimeout(() => setSearchLoading(false), 400);
  };

  // Called by HotelSearch "Clear" button
  const handleClear = () => {
    setSearchParams(null);
    setSearchLoading(false);
  };

  const isSearchActive = searchParams !== null;

  return (
    <main>
      {/* ── Hero banner ─────────────────────────────────────────────────── */}
      <section
        className="text-white py-5"
        style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        }}
      >
        <Container className="text-center py-3">
          <h1 className="display-5 fw-bold mb-3">Find Your Perfect Stay</h1>
          <p className="lead mb-2" style={{ color: "rgba(255,255,255,0.75)" }}>
            Browse premium hotels across India — Mumbai, Goa, Hyderabad and more.
          </p>
          <p className="small mb-0" style={{ color: "rgba(255,255,255,0.5)" }}>
            Best prices guaranteed · Free cancellation on select rooms
          </p>
        </Container>
      </section>

      {/* ── Search + Listing ─────────────────────────────────────────────── */}
      <Container className="py-5">

        {/* Search bar — always visible on the home page */}
        <HotelSearch
          onSearch={handleSearch}
          onClear={handleClear}
          loading={searchLoading}
        />

        {/* Section heading */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div>
            <h2 className="fw-bold mb-1">
              {isSearchActive ? "Search Results" : "Available Hotels"}
            </h2>
            <p className="text-muted mb-0 small">
              {isSearchActive
                ? "Showing hotels matching your search — click a card to view rooms and book"
                : "Showing all properties — click a card to view rooms and book"}
            </p>
          </div>
        </div>

        {/* HotelList handles loading / error / empty / result states */}
        <HotelList searchParams={searchParams} />

      </Container>
    </main>
  );
}
