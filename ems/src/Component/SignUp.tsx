import React, { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../CSS/SignUp.css";

function SignUp() {
  const [user, setUser] = useState({
    email: "",
    password: "",
    role: "ROLE_PATIENT", // Default role
  });
  const [response, setResponse] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const res = await fetch("http://localhost:8060/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (res.ok) {
        const data = await res.json();
        const token = data.token; // Assuming the backend returns a token in the response
        localStorage.setItem("token", token); // Save the token in localStorage
        setResponse("Account created successfully!");
        setTimeout(() => navigate("/"), 2000); // Redirect to login after 2 seconds
      } else {
        const errorData = await res.text(); // Capture error message from backend
        console.error("Error Response:", errorData);
        setResponse("Sign Up failed. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setResponse("Sign Up failed. Please try again later.");
    }
  };

  return (
    <div className="signup-container">
      <h1>Sign Up</h1>
      {response && <Alert variant={response.includes("successfully") ? "success" : "danger"}>{response}</Alert>}
      <Form onSubmit={handleFormSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={user.email}
            onChange={handleInputChange}
            placeholder="Enter email"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={user.password}
            onChange={handleInputChange}
            placeholder="Password"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicRole">
          <Form.Label>Role</Form.Label>
          <Form.Select name="role" value={user.role} onChange={handleInputChange} required>
            <option value="ROLE_PATIENT">Patient</option>
            <option value="ROLE_DOCTOR">Doctor</option>
          </Form.Select>
        </Form.Group>
        <Button variant="primary" type="submit" className="w-100">
          Sign Up
        </Button>
      </Form>
    </div>
  );
}

export default SignUp;