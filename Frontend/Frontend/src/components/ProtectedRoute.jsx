import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role } = useContext(AuthContext);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(role)) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger text-center">
          <h5>Access Denied</h5>
          <p className="mb-0">
            Required: <strong>{allowedRoles.join(" or ")}</strong> | Your role: <strong>{role}</strong>
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
