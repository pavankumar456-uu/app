import React, { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode"; // Import jwt-decode to decode JWT token

const AddMedicalHistory: React.FC = () => {
  const [medicalHistory, setMedicalHistory] = useState({
    email: "",
    diagnosis: "",
    treatment: "",
    dateOfVisit: "",
  });
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Decode JWT token to extract email
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken: { sub: string } = jwtDecode(token); // Decode the JWT token
        setMedicalHistory((prev) => ({ ...prev, email: decodedToken.sub })); // Pre-fill the email field
        console.log("Extracted email from JWT:", decodedToken.sub);
      } catch (err) {
        console.error("Failed to decode JWT token:", err);
        setError("Invalid token. Please log in again.");
        localStorage.clear();
        navigate("/");
      }
    } else {
      setError("Token is missing. Please log in again.");
      navigate("/");
    }
  }, [navigate]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMedicalHistory({ ...medicalHistory, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setResponse(null);
    setError(null);

    try {
      const token = localStorage.getItem("token"); // Retrieve JWT token from localStorage
      const res = await fetch("http://localhost:8060/api/hospital/history/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include token in the Authorization header
        },
        body: JSON.stringify(medicalHistory),
      });

      if (res.ok) {
        setResponse("Medical history added successfully!");
        setTimeout(() => navigate("/doctorscheduledashboard"), 2000); // Redirect after success
      } else {
        const errorText = await res.text();
        setError(`Failed to add medical history: ${errorText}`);
      }
    } catch (err) {
      console.error("Error adding medical history:", err);
      setError("An error occurred while adding medical history. Please try again.");
    }
  };

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Add Medical History</h1>

      {response && <Alert variant="success">{response}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Patient Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={medicalHistory.email}
            onChange={handleInputChange}
            placeholder="Enter patient's email"
            required // Make the email field required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Diagnosis</Form.Label>
          <Form.Control
            as="textarea"
            name="diagnosis"
            value={medicalHistory.diagnosis}
            onChange={handleInputChange}
            placeholder="Enter diagnosis"
            rows={3}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Treatment</Form.Label>
          <Form.Control
            as="textarea"
            name="treatment"
            value={medicalHistory.treatment}
            onChange={handleInputChange}
            placeholder="Enter treatment details"
            rows={3}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Date of Visit</Form.Label>
          <Form.Control
            type="datetime-local"
            name="dateOfVisit"
            value={medicalHistory.dateOfVisit}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100">
          Add Medical History
        </Button>
      </Form>
    </div>
  );
};

export default AddMedicalHistory;