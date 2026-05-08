// LoginPage.jsx — Login form.
// Calls apiService.login() (USE_MOCKS = true returns mock AuthResponseDTO).
// On success: persists auth via AuthContext.login(), redirects to /dashboard.

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { login as apiLogin } from "../services/apiService";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error,       setError]       = useState(null);
  const [loading,     setLoading]     = useState(false);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // apiService.login returns AuthResponseDTO: { token, userId, name, role }
      const authResponse = await apiLogin(credentials);

      // Persist token + claims, update global auth state
      login(authResponse);

      navigate("/dashboard");
    } catch (err) {
      // Standardised error shape: { status, message, timestamp }
      const msg = err?.response?.data?.message || err?.message || "Login failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <Card className="shadow p-4" style={{ width: "100%", maxWidth: "420px" }}>
        <Card.Body>
          <h3 className="text-center mb-4 fw-semibold">Sign In</h3>

          {error && (
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="loginEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="john@example.com"
                value={credentials.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="loginPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="••••••••"
                value={credentials.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
            </Form.Group>

            <Button
              type="submit"
              variant="primary"
              className="w-100"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </Form>

          <hr />
          <p className="text-center mb-0 text-muted small">
            Don't have an account?{" "}
            <Link to="/signup">Register here</Link>
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
}
