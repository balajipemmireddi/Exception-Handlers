// AdminBookingTable.jsx — Renders the all-bookings table for the Admin Dashboard.
//
// Displays BookingResponseDTO[] with full user details, hotel, room, dates,
// status, amount, and Edit / Delete action buttons.
//
// Props:
//   bookings          BookingResponseDTO[]
//   onEdit(booking)   — open edit modal for this booking
//   onDelete(booking) — open delete confirmation for this booking

import { Table, Badge, Button } from "react-bootstrap";

// ── Status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  return (
    <Badge bg={status === "CONFIRMED" ? "success" : "secondary"}>
      {status}
    </Badge>
  );
}

export default function AdminBookingTable({ bookings, onEdit, onDelete }) {
  return (
    <Table responsive hover className="mb-0 align-middle">
      <thead className="table-dark">
        <tr>
          <th className="ps-3">#</th>
          <th>User</th>
          <th>Hotel</th>
          <th>Room</th>
          <th>Check-In</th>
          <th>Check-Out</th>
          <th>Total</th>
          <th>Status</th>
          <th className="pe-3 text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {bookings.map((booking) => (
          <tr key={booking.id}>
            <td className="ps-3 text-muted small">#{booking.id}</td>

            {/* userName — included for Admin views per BookingResponseDTO */}
            <td>
              <div className="fw-medium small">{booking.userName}</div>
              <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                ID: {booking.userId}
              </div>
            </td>

            <td className="fw-medium small">{booking.hotelName}</td>

            <td>
              <Badge bg="light" text="dark" className="border fw-normal">
                {booking.roomType}
              </Badge>
            </td>

            <td className="small">{booking.checkIn}</td>
            <td className="small">{booking.checkOut}</td>

            <td className="fw-semibold text-primary small">
              ₹{booking.totalAmount.toLocaleString("en-IN")}
            </td>

            <td>
              <StatusBadge status={booking.status} />
            </td>

            <td className="pe-3 text-center">
              <div className="d-flex gap-2 justify-content-center">
                <Button
                  variant="outline-warning"
                  size="sm"
                  onClick={() => onEdit(booking)}
                  aria-label={`Edit booking #${booking.id}`}
                >
                  Edit
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => onDelete(booking)}
                  aria-label={`Delete booking #${booking.id}`}
                >
                  Delete
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
