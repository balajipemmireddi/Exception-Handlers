// UserDashboard.jsx — User booking dashboard at /user/dashboard.
// Protected: USER role (and above).
// Phase 3: structural placeholder — real booking data loads in Phase 8
// via apiService.getUserBookings(userId).

import { Container, Card, Table, Badge, Button } from "react-bootstrap";
import { useAuth } from "../hooks/useAuth";

export default function UserDashboard() {
  const { user } = useAuth();

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-1">My Bookings</h2>
          <p className="text-muted mb-0">
            Logged in as <strong>{user?.name}</strong>
            {" "}
            <Badge bg="primary">{user?.role}</Badge>
          </p>
        </div>
      </div>

      <Card className="shadow-sm">
        <Card.Body>
          <Table responsive hover className="mb-0 align-middle">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Hotel</th>
                <th>Room Type</th>
                <th>Check-In</th>
                <th>Check-Out</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Phase 8 will map real bookings from apiService.getUserBookings() here */}
              <tr>
                <td colSpan={8} className="text-center text-muted py-4">
                  Your bookings will appear here in Phase 8.
                </td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
}
