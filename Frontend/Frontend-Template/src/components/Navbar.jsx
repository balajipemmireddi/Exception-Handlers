import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";

export default function AppNavbar() {
  const { isAuthenticated, user, isAdmin, isSuperAdmin, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const roleBadge = {
    USER:        "badge bg-primary",
    ADMIN:       "badge bg-warning text-dark",
    SUPER_ADMIN: "badge bg-danger",
  };

  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark shadow-sm fixed-top">
      <div className="container-fluid">

        <Link className="navbar-brand fw-bold" to="/">🏨 HotelBook</Link>

        {/* Hamburger */}
        <button
          className="navbar-toggler d-md-none"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasNav"
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* Desktop nav */}
        <div className="collapse navbar-collapse d-none d-md-flex">
          <ul className="navbar-nav me-auto">
            {isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/user/dashboard">My Bookings</Link>
                </li>
                {isAdmin && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin/bookings">Admin</Link>
                  </li>
                )}
                {isSuperAdmin && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/superadmin/analytics">Super Admin</Link>
                  </li>
                )}
              </>
            )}
          </ul>

          {isAuthenticated ? (
            <div className="d-flex align-items-center gap-2">
              <span className="text-white small">
                {user?.name}{" "}
                <span className={roleBadge[user?.role] || "badge bg-secondary"}>
                  {user?.role}
                </span>
              </span>
              <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <>
              <Link className="nav-link text-white" to="/login">Login</Link>
              <Link className="nav-link text-white ms-2" to="/signup">Register</Link>
            </>
          )}
        </div>

        {/* Offcanvas (mobile) */}
        <div className="offcanvas offcanvas-end text-bg-dark d-md-none" tabIndex="-1" id="offcanvasNav">
          <div className="offcanvas-header">
            <h5 className="offcanvas-title">🏨 HotelBook</h5>
            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" />
          </div>
          <div className="offcanvas-body">
            <ul className="navbar-nav mb-3">
              {isAuthenticated && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/user/dashboard" data-bs-dismiss="offcanvas">My Bookings</Link>
                  </li>
                  {isAdmin && (
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin/bookings" data-bs-dismiss="offcanvas">Admin</Link>
                    </li>
                  )}
                  {isSuperAdmin && (
                    <li className="nav-item">
                      <Link className="nav-link" to="/superadmin/analytics" data-bs-dismiss="offcanvas">Super Admin</Link>
                    </li>
                  )}
                </>
              )}
            </ul>

            {isAuthenticated ? (
              <button className="btn btn-danger w-100" onClick={handleLogout} data-bs-dismiss="offcanvas">
                Logout
              </button>
            ) : (
              <>
                <Link className="btn btn-outline-light w-100 mb-2" to="/login" data-bs-dismiss="offcanvas">Login</Link>
                <Link className="btn btn-outline-light w-100" to="/signup" data-bs-dismiss="offcanvas">Register</Link>
              </>
            )}
          </div>
        </div>

      </div>
    </nav>
  );
}
