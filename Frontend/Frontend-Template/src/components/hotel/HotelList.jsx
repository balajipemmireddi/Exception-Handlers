import { useState, useEffect } from "react";
import { getHotels, searchHotels } from "../../services/apiService";
import HotelCard from "./HotelCard";

export default function HotelList({ searchParams = null }) {
  const [hotels,  setHotels]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = searchParams ? await searchHotels(searchParams) : await getHotels();
        setHotels(data);
      } catch (err) {
        setError(err?.response?.data?.message || err?.message || "Failed to load hotels");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading hotels…</span>
        </div>
        <p className="text-muted mt-3">{searchParams ? "Searching hotels…" : "Loading hotels…"}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center">
        <h5>Unable to load hotels</h5>
        <p className="mb-0">{error}</p>
      </div>
    );
  }

  if (hotels.length === 0) {
    return (
      <div className="alert alert-warning text-center">
        <h5>No hotels found</h5>
        <p className="mb-0">
          {searchParams
            ? "No hotels match your search. Try a different location or dates."
            : "No hotels available at the moment."}
        </p>
      </div>
    );
  }

  return (
    <>
      {searchParams && (
        <div className="d-flex align-items-center gap-2 mb-3 flex-wrap">
          <span className="text-muted small">Search results</span>
          <span className={`badge ${hotels.length > 0 ? "bg-success" : "bg-secondary"}`}>
            {hotels.length} {hotels.length === 1 ? "hotel" : "hotels"} found
          </span>
        </div>
      )}
      <div className="row g-4">
        {hotels.map(hotel => (
          <div key={hotel.id} className="col-12 col-sm-6 col-lg-4">
            <HotelCard {...hotel} />
          </div>
        ))}
      </div>
    </>
  );
}
