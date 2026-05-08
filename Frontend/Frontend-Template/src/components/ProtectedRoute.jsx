// ProtectedRoute.jsx — Role-based route guard.
// Redirects to /login if not authenticated.
// Shows Access Denied if authenticated but role is insufficient.

import { Navigate } from "react-router-dom";
import { Container, Alert } from "react-bootstrap";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return (
      <Container className="mt-5">
        <Alert variant="danger" className="text-center">
          <Alert.Heading>Access Denied</Alert.Heading>
          <p className="mb-0">
            You don't have permission to view this page.
            Required role: <strong>{allowedRoles.join(" or ")}</strong>.
            Your role: <strong>{role}</strong>.
          </p>
        </Alert>
      </Container>
    );
  }

  return children;
};

export default ProtectedRoute;
