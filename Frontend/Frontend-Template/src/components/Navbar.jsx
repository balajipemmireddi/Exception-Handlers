// Navbar.jsx — Top navigation bar.
// Dynamically shows/hides links based on auth state and role.
// Uses useAuth hook for role-gate helpers: isAdmin, isSuperAdmin.

import { Navbar, Nav, Container, Button, Badge } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function AppNavbar() {
  const navigate = useNavigate();
  const { isAuthenticated, user, isAdmin, isSuperAdmin, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          🏨 HotelBook
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-nav" />

        <Navbar.Collapse id="main-nav" className="justify-content-end">
          <Nav className="align-items-center gap-1">

            {!isAuthenticated ? (
              /* ── Public links ── */
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/signup">Register</Nav.Link>
              </>
            ) : (
              /* ── Authenticated links ── */
              <>
                <Nav.Link as={Link} to="/user/dashboard">My Bookings</Nav.Link>

                {/* ADMIN + SUPER_ADMIN */}
                {isAdmin && (
                  <Nav.Link as={Link} to="/admin/bookings">Admin</Nav.Link>
                )}

                {/* SUPER_ADMIN only */}
                {isSuperAdmin && (
                  <Nav.Link as={Link} to="/superadmin/analytics">Super Admin</Nav.Link>
                )}

                {/* User identity pill */}
                <span className="navbar-text text-light small me-2">
                  {user?.name}{" "}
                  <Badge bg={user?.role === "SUPER_ADMIN" ? "danger" : user?.role === "ADMIN" ? "warning" : "primary"}>
                    {user?.role}
                  </Badge>
                </span>

                <Button variant="outline-light" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            )}

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
