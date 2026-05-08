// LoginPage.jsx — Phase 4: Authentication UI
//
// Behaviour:
//   • Calls apiService.login() — all data through USE_MOCKS toggle
//   • On success  → persists AuthResponseDTO via AuthContext.login()
//                 → redirects to "/" (home page) per Phase 4 exit criteria
//                 → Navbar re-renders with user name, role badge, and role-gated links
//   • On failure  → displays standardised error { status, message } from apiService
//   • Already logged-in users are redirected to "/" immediately
//   • Password show/hide toggle for usability
//   • Bootstrap field-level validation (is-invalid + feedback text)

import { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import {
  Container, Row, Col, Card,
  Form, Button, Alert, Spinner, InputGroup,
} from "react-bootstrap";
import { login as apiLogin } from "../services/apiService";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  // Already authenticated — bounce to home
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error,        setError]        = useState(null);
  const [loading,      setLoading]      = useState(false);
  // Field-level validation errors
  const [fieldErrors,  setFieldErrors]  = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const errors = { email: "", password: "" };
    let valid = true;

    if (!credentials.email) {
      errors.email = "Email address is required.";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      errors.email = "Please enter a valid email address.";
      valid = false;
    }

    if (!credentials.password) {
      errors.password = "Password is required.";
      valid = false;
    }

    setFieldErrors(errors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validate()) return;

    setLoading(true);
    try {
      // Returns AuthResponseDTO: { token, userId, name, role }
      const authResponse = await apiLogin(credentials);

      // Persist to localStorage + update global React state
      login(authResponse);

      showToast(`Welcome back, ${authResponse.name}!`, "success");

      // Phase 4 exit criteria: redirect to home page
      navigate("/");
    } catch (err) {
      // Standardised error shape from apiService: { status, message, timestamp }
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Invalid credentials. Please try again.";
      setError(msg);
      showToast(msg, "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={7} lg={5} xl={4}>

          {/* Page heading */}
          <div className="text-center mb-4">
            <h1 className="h3 fw-bold mb-1">🏨 HotelBook</h1>
            <p className="text-muted">Sign in to your account</p>
          </div>

          <Card className="shadow-sm border-0">
            <Card.Body className="p-4">

              {/* ── API / server error banner ── */}
              {error && (
                <Alert
                  variant="danger"
                  dismissible
                  onClose={() => setError(null)}
                  className="mb-3"
                >
                  <strong>Login failed:</strong> {error}
                </Alert>
              )}

              <Form noValidate onSubmit={handleSubmit}>

                {/* Email */}
                <Form.Group className="mb-3" controlId="loginEmail">
                  <Form.Label className="fw-medium">Email address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="john@example.com"
                    value={credentials.email}
                    onChange={handleChange}
                    isInvalid={!!fieldErrors.email}
                    autoComplete="email"
                    disabled={loading}
                  />
                  <Form.Control.Feedback type="invalid">
                    {fieldErrors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Password with show/hide toggle */}
                <Form.Group className="mb-4" controlId="loginPassword">
                  <Form.Label className="fw-medium">Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="••••••••"
                      value={credentials.password}
                      onChange={handleChange}
                      isInvalid={!!fieldErrors.password}
                      autoComplete="current-password"
                      disabled={loading}
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowPassword((v) => !v)}
                      tabIndex={-1}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                    <Form.Control.Feedback type="invalid">
                      {fieldErrors.password}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                {/* Submit */}
                <Button
                  type="submit"
                  variant="primary"
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" role="status" />
                      Signing in…
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </Form>

              {/* ── Mock credentials hint (dev only) ── */}
              <div className="mt-3 p-2 bg-light rounded border small text-muted">
                <strong>Dev hint:</strong> Any email + password works with{" "}
                <code>USE_MOCKS = true</code>. Use{" "}
                <code>invalid@</code> (bad format) or leave fields empty to
                trigger error states.
              </div>

            </Card.Body>
          </Card>

          {/* Footer link */}
          <p className="text-center mt-3 text-muted small">
            Don't have an account?{" "}
            <Link to="/signup" className="fw-medium">
              Register here
            </Link>
          </p>

        </Col>
      </Row>
    </Container>
  );
}
