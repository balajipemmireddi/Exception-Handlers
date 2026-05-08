const ROOM_META = {
  SINGLE: { icon: "🛏️",   label: "Single Room", badgeClass: "bg-info"    },
  DOUBLE: { icon: "🛏️🛏️", label: "Double Room", badgeClass: "bg-primary" },
  SUITE:  { icon: "👑",    label: "Suite",        badgeClass: "bg-warning text-dark" },
};

export default function RoomCard({ id, roomType, price, capacity, available, hotelId, onBook }) {
  const meta = ROOM_META[roomType] ?? { icon: "🏠", label: roomType, badgeClass: "bg-secondary" };

  return (
    <div className={`card h-100 shadow-sm ${available ? "border-0" : "border-secondary opacity-75"}`}>
      {/* Availability ribbon */}
      <div
        className={`text-white text-center py-1 small fw-semibold ${available ? "bg-success" : "bg-secondary"}`}
        style={{ borderRadius: "0.375rem 0.375rem 0 0" }}
      >
        {available ? "✓ Available" : "✗ Unavailable"}
      </div>

      <div className="card-body d-flex flex-column p-3">
        {/* Room type */}
        <div className="d-flex align-items-center gap-2 mb-3">
          <span style={{ fontSize: "1.5rem" }}>{meta.icon}</span>
          <span className={`badge ${meta.badgeClass} fw-semibold px-2 py-1`}>{meta.label}</span>
        </div>

        {/* Details */}
        <ul className="list-unstyled small mb-3 flex-grow-1">
          <li className="d-flex justify-content-between py-1 border-bottom">
            <span className="text-muted">Capacity</span>
            <span className="fw-medium">👤 {capacity} {capacity === 1 ? "guest" : "guests"}</span>
          </li>
          <li className="d-flex justify-content-between py-1 border-bottom">
            <span className="text-muted">Room Type</span>
            <span className="fw-medium">{roomType}</span>
          </li>
          <li className="d-flex justify-content-between py-1">
            <span className="text-muted">Status</span>
            <span className={`fw-medium ${available ? "text-success" : "text-secondary"}`}>
              {available ? "Available" : "Not Available"}
            </span>
          </li>
        </ul>

        {/* Price */}
        <div className="mb-3">
          <span className="text-muted small d-block">Price per night</span>
          <span className="fw-bold text-primary fs-5">₹{price.toLocaleString("en-IN")}</span>
          <span className="text-muted small"> /night</span>
        </div>

        {/* Book button */}
        <button
          className={`btn w-100 mt-auto ${available ? "btn-primary" : "btn-secondary"}`}
          disabled={!available}
          onClick={() => available && onBook && onBook({ id, roomType, price, capacity, hotelId })}
        >
          {available ? "Book Now" : "Unavailable"}
        </button>
      </div>
    </div>
  );
}
