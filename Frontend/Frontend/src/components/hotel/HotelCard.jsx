import { Link } from "react-router-dom";

function StarRating({ rating }) {
  return (
    <span aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} style={{ color: i < rating ? "#f5a623" : "#d1d5db", fontSize: "1rem" }}>★</span>
      ))}
    </span>
  );
}

export default function HotelCard({ id, name, location, imageUrl, starRating, startingPrice }) {
  return (
    <div className="card h-100 shadow-sm border-0 hotel-card">
      <div style={{ overflow: "hidden", height: "200px" }}>
        <img
          src={imageUrl}
          alt={`${name} — ${location}`}
          className="card-img-top"
          style={{ height: "200px", objectFit: "cover", transition: "transform 0.3s ease" }}
          onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
          onError={e => { e.currentTarget.src = `https://placehold.co/400x200/6c757d/ffffff?text=${encodeURIComponent(name)}`; }}
        />
      </div>

      <div className="card-body d-flex flex-column p-3">
        <div className="mb-2">
          <span className="badge bg-secondary fw-normal">📍 {location}</span>
        </div>

        <h6 className="card-title fw-bold mb-1">{name}</h6>

        <div className="mb-2">
          <StarRating rating={starRating} />
          <span className="text-muted small ms-1">({starRating}-star)</span>
        </div>

        <div className="flex-grow-1" />

        <div className="d-flex justify-content-between align-items-center mt-2">
          <div>
            <span className="text-muted small">From</span>
            <div className="fw-bold text-primary fs-5">
              {startingPrice ? `₹${startingPrice.toLocaleString("en-IN")}` : "Price N/A"}
              <span className="text-muted fw-normal small"> /night</span>
            </div>
          </div>
          <Link to={`/hotels/${id}`} className="btn btn-primary btn-sm px-3">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
