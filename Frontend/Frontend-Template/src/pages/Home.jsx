import { useState } from "react";
import HotelSearch from "../components/hotel/HotelSearch";
import HotelList   from "../components/hotel/HotelList";

export default function Home() {
  const [searchParams,  setSearchParams]  = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);

  const handleSearch = (params) => {
    setSearchLoading(true);
    setSearchParams(params);
    setTimeout(() => setSearchLoading(false), 400);
  };

  const handleClear = () => {
    setSearchParams(null);
    setSearchLoading(false);
  };

  return (
    <main>
      {/* Hero */}
      <section
        className="text-white py-5"
        style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" }}
      >
        <div className="container text-center py-3">
          <h1 className="display-5 fw-bold mb-3">Find Your Perfect Stay</h1>
          <p className="lead mb-2" style={{ color: "rgba(255,255,255,0.75)" }}>
            Browse premium hotels across India — Mumbai, Goa, Hyderabad and more.
          </p>
          <p className="small mb-0" style={{ color: "rgba(255,255,255,0.5)" }}>
            Best prices guaranteed · Free cancellation on select rooms
          </p>
        </div>
      </section>

      {/* Search + Listing */}
      <div className="container py-5">
        <HotelSearch onSearch={handleSearch} onClear={handleClear} loading={searchLoading} />

        <div className="mb-4">
          <h2 className="fw-bold mb-1">
            {searchParams ? "Search Results" : "Available Hotels"}
          </h2>
          <p className="text-muted mb-0 small">
            {searchParams
              ? "Showing hotels matching your search — click a card to view rooms and book"
              : "Showing all properties — click a card to view rooms and book"}
          </p>
        </div>

        <HotelList searchParams={searchParams} />
      </div>
    </main>
  );
}
