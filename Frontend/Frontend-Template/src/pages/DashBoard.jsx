import { useAuth } from "../hooks/useAuth";

const ROLE_BADGE = {
  USER:        "badge bg-primary",
  ADMIN:       "badge bg-warning text-dark",
  SUPER_ADMIN: "badge bg-danger",
};

export default function DashBoard() {
  const { user } = useAuth();

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <div className="card shadow text-center p-5" style={{ maxWidth: "500px", width: "100%" }}>
        <h2 className="mb-3">Welcome back, {user?.name || "Guest"}!</h2>
        <p className="text-muted mb-1"><strong>User ID:</strong> {user?.userId}</p>
        <p className="text-muted mb-3">
          <strong>Role:</strong>{" "}
          <span className={ROLE_BADGE[user?.role] || "badge bg-secondary"}>
            {user?.role}
          </span>
        </p>
        <hr />
        <p className="text-muted small mb-0">
          You are successfully authenticated. Your dashboard content will appear here.
        </p>
      </div>
    </div>
  );
}
