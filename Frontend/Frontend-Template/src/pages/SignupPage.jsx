// SignupPage.jsx — Registration form.
// Calls apiService.register() (USE_MOCKS = true returns mock AuthResponseDTO).
// On success: persists auth via AuthContext.login(), redirects to /dashboard.

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { register as apiRegister } from "../services/apiService";
import { useAuth } from "../hooks/useAuth";

export default function SignupPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error,    setError]    = useState(null);
  const [loading,  setLoading]  = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // apiService.register returns AuthResponseDTO: { token, userId, name, role }
      const authResponse = await apiRegister(formData);

      // Persist token + claims, update global auth state
      login(authResponse);

      navigate("/dashboard");
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Registration failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <Card className="shadow p-4" style={{ width: "100%", maxWidth: "420px" }}>
        <Card.Body>
          <h3 className="text-center mb-4 fw-semibold">Create Account</h3>

          {error && (
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="signupName">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
                autoComplete="name"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="signupEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="signupPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
            </Form.Group>

            <Button
              type="submit"
              variant="success"
              className="w-100"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Creating account…
                </>
              ) : (
                "Register"
              )}
            </Button>
          </Form>

          <hr />
          <p className="text-center mb-0 text-muted small">
            Already have an account?{" "}
            <Link to="/login">Sign in here</Link>
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
}
