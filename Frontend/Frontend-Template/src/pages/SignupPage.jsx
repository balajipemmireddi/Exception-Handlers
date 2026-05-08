// SignupPage.jsx — Phase 4: Authentication UI
//
// Behaviour:
//   • Calls apiService.register() — all data through USE_MOCKS toggle
//   • Request shape matches RegisterRequestDTO: { name, email, password }
//   • On success  → persists AuthResponseDTO via AuthContext.login()
//                 → redirects to "/" (home page) per Phase 4 exit criteria
//                 → Navbar re-renders with user name, role badge, and role-gated links
//   • On failure  → displays standardised error { status, message } from apiService
//                 → 409 "Email already exists" is handled and displayed
//   • Already logged-in users are redirected to "/" immediately
//   • Password show/hide toggle
//   • Password confirmation field with match validation
//   • Bootstrap field-level validation (is-invalid + feedback text)

import { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import {
  Container, Row, Col, Card,
  Form, Button, Alert, Spinner, InputGroup,
} from "react-bootstrap";
import { register as apiRegister } from "../services/apiService";
import { useAuth } from "../hooks/useAuth";

export default function SignupPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  // Already authenticated — bounce to home
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword,        setShowPassword]        = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error,               setError]               = useState(null);
  const [loading,             setLoading]             = useState(false);
  const [fieldErrors,         setFieldErrors]         = useState({
    name: "", email: "", password: "", confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const errors = { name: "", email: "", password: "", confirmPassword: "" };
    let valid = true;

    if (!formData.name.trim()) {
      errors.name = "Full name is required.";
      valid = false;
    }

    if (!formData.email) {
      errors.email = "Email address is required.";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address.";
      valid = false;
    }

    if (!formData.password) {
      errors.password = "Password is required.";
      valid = false;
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
      valid = false;
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password.";
      valid = false;
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
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
      // RegisterRequestDTO shape: { name, email, password }
      // confirmPassword is client-side only — not sent to the API
      const { confirmPassword, ...registerPayload } = formData;

      // Returns AuthResponseDTO: { token, userId, name, role }
      const authResponse = await apiRegister(registerPayload);

      // Persist to localStorage + update global React state
      login(authResponse);

      // Phase 4 exit criteria: redirect to home page
      navigate("/");
    } catch (err) {
      // Standardised error shape from apiService: { status, message, timestamp }
      const status = err?.response?.data?.status;
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Registration failed. Please try again.";

      // Surface email-conflict error directly on the email field
      if (status === 409) {
        setFieldErrors((prev) => ({ ...prev, email: msg }));
      } else {
        setError(msg);
      }
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
            <p className="text-muted">Create your account</p>
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
                  <strong>Registration failed:</strong> {error}
                </Alert>
              )}

              <Form noValidate onSubmit={handleSubmit}>

                {/* Full Name */}
                <Form.Group className="mb-3" controlId="signupName">
                  <Form.Label className="fw-medium">Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    isInvalid={!!fieldErrors.name}
                    autoComplete="name"
                    disabled={loading}
                  />
                  <Form.Control.Feedback type="invalid">
                    {fieldErrors.name}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Email */}
                <Form.Group className="mb-3" controlId="signupEmail">
                  <Form.Label className="fw-medium">Email address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="john@example.com"
                    value={formData.email}
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
                <Form.Group className="mb-3" controlId="signupPassword">
                  <Form.Label className="fw-medium">Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Min. 6 characters"
                      value={formData.password}
                      onChange={handleChange}
                      isInvalid={!!fieldErrors.password}
                      autoComplete="new-password"
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

                {/* Confirm Password */}
                <Form.Group className="mb-4" controlId="signupConfirmPassword">
                  <Form.Label className="fw-medium">Confirm Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Re-enter your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      isInvalid={!!fieldErrors.confirmPassword}
                      autoComplete="new-password"
                      disabled={loading}
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      tabIndex={-1}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </Button>
                    <Form.Control.Feedback type="invalid">
                      {fieldErrors.confirmPassword}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                {/* Submit */}
                <Button
                  type="submit"
                  variant="success"
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" role="status" />
                      Creating account…
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </Form>

              {/* ── Mock error hint (dev only) ── */}
              <div className="mt-3 p-2 bg-light rounded border small text-muted">
                <strong>Dev hint:</strong> Use email{" "}
                <code>taken@example.com</code> to trigger the{" "}
                <em>409 Email already exists</em> mock error.
              </div>

            </Card.Body>
          </Card>

          {/* Footer link */}
          <p className="text-center mt-3 text-muted small">
            Already have an account?{" "}
            <Link to="/login" className="fw-medium">
              Sign in here
            </Link>
          </p>

        </Col>
      </Row>
    </Container>
  );
}
