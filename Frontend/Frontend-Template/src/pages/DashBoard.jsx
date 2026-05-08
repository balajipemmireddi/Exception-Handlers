// DashBoard.jsx — Generic user dashboard (protected, USER+ role).
// Reads user state from AuthContext via useAuth hook.

import { Container, Card, Badge } from "react-bootstrap";
import { useAuth } from "../hooks/useAuth";

const roleBadgeVariant = {
  USER:        "primary",
  ADMIN:       "warning",
  SUPER_ADMIN: "danger",
};

export default function DashBoard() {
  const { user } = useAuth();

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <Card className="shadow text-center p-5" style={{ width: "100%", maxWidth: "500px" }}>
        <Card.Body>
          <h2 className="mb-3">Welcome back, {user?.name || "Guest"}!</h2>

          <p className="text-muted mb-1">
            <strong>User ID:</strong> {user?.userId}
          </p>
          <p className="text-muted mb-3">
            <strong>Role:</strong>{" "}
            <Badge bg={roleBadgeVariant[user?.role] || "secondary"}>
              {user?.role}
            </Badge>
          </p>

          <hr />
          <p className="text-muted small mb-0">
            You are successfully authenticated. Your dashboard content will appear here.
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
}
