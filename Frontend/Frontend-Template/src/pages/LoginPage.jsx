import { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login as apiLogin } from "../services/apiService";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  if (isAuthenticated) return <Navigate to="/" replace />;

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const authResponse = await apiLogin(formData);
      login(authResponse);
      toast.success(`Welcome back, ${authResponse.name}!`);
      navigate("/");
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "90vh" }}>
      <div className="card p-4 shadow" style={{ width: "400px" }}>
        <h3 className="text-center mb-4">🏨 HotelBook — Sign In</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="mt-3 text-center text-muted small">
          Don't have an account? <Link to="/signup">Register here</Link>
        </p>

        <div className="mt-2 p-2 bg-light rounded border small text-muted">
          <strong>Dev:</strong> Any email + password works with <code>USE_MOCKS = true</code>
        </div>
      </div>
    </div>
  );
}
