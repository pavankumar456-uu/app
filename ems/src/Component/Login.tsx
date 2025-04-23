import React, { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../CSS/Login.css";

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    role: "ROLE_PATIENT", // Default role
  });
  const [response, setResponse] = useState("");
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setCredentials({ ...credentials, [event.target.name]: event.target.value });
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setResponse("");

    try {
      const res = await fetch("http://localhost:8060/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (res.ok) {
        const data = await res.json();
        const { token, role, patientId, email } = data;

        // Store token, patientId, and email in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("patientId", patientId);
        localStorage.setItem("email", email); // Store email for future use
        console.log("Token:", token);
        console.log("Patient ID:", patientId);
        console.log("Email:", email);
        setResponse(`Welcome, ${role === "ROLE_DOCTOR" ? "Doctor" : "Patient"}! Redirecting...`);

        // Redirect based on role
        setTimeout(() => {
          if (role === "ROLE_DOCTOR") {
            navigate("/doctorscheduledashboard");
          } else {
            navigate("/patient");
          }
        }, 1500);
      } else {
        const errorData = await res.text();
        console.error("Error Response:", errorData);
        setResponse("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Error:", error);
      setResponse("Login failed. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUpRedirect = () => {
    navigate("/signup");
  };

  const alertVariant = response.toLowerCase().includes("welcome") ? "success" : "danger";

  return (
    <div className="login-page-wrapper">
      <div className="background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
        <div className="shape shape-5"></div>
      </div>

      <div className="login-logo">HMS</div>

      <div className="login-card">
        <h2 className="login-title">Welcome Back!</h2>
        <p className="login-subtitle">Login to access your HMS dashboard.</p>

        {response && (
          <Alert variant={alertVariant} className={`login-alert alert-${alertVariant}`}>
            {response}
          </Alert>
        )}

        <Form onSubmit={handleFormSubmit} className="login-form">
          <Form.Group className="mb-3 input-wrapper">
            <span className="input-icon">
              <i className="fas fa-envelope"></i>
            </span>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter your email"
              value={credentials.email}
              onChange={handleInputChange}
              required
              className="login-input"
              aria-label="Email Address"
            />
          </Form.Group>

          <Form.Group className="mb-4 input-wrapper">
            <span className="input-icon">
              <i className="fas fa-lock"></i>
            </span>
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter your password"
              value={credentials.password}
              onChange={handleInputChange}
              required
              className="login-input"
              aria-label="Password"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Role</Form.Label>
            <Form.Select
              name="role"
              value={credentials.role}
              onChange={handleInputChange}
              required
            >
              <option value="ROLE_PATIENT">Patient</option>
              <option value="ROLE_DOCTOR">Doctor</option>
            </Form.Select>
          </Form.Group>

          <div className="d-grid">
            <Button
              variant="primary"
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="login-button"
            >
              {isSubmitting ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Logging In...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </div>

          <div className="mt-4 text-center signup-link-wrapper">
            <Button variant="link" onClick={handleSignUpRedirect} className="signup-link">
              Don't have an account? <span className="fw-semibold">Sign Up</span>
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;