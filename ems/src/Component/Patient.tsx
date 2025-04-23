import React, { useState } from "react";
import { Button, Form, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../CSS/Patient.css"; // Import the CSS file for advanced styling

const Patient: React.FC = () => {
  const [response, setResponse] = useState(""); // State to store the response message
  const [newPatient, setNewPatient] = useState({
    name: "",
    email: "",
    dateOfBirth: "",
    contactDetails: "",
  }); // State to store the new patient details
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // State for success popup
  const navigate = useNavigate();

  // Retrieve the JWT token from localStorage
  const token = localStorage.getItem("token");

  // Handle input changes for the new patient form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPatient({ ...newPatient, [name]: value });
  };

  // Add a new patient
  const handleAddPatient = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8060/api/hospital/patients/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newPatient),
      });

      if (res.ok) {
        setResponse("Patient added successfully!");
        setShowSuccessPopup(true);
        setNewPatient({
          name: "",
          email: "",
          dateOfBirth: "",
          contactDetails: "",
        });
        setTimeout(() => setShowSuccessPopup(false), 3000); // Hide success popup after 3 seconds
      } else {
        const errorText = await res.text();
        setResponse(`Failed to add patient: ${errorText}`);
      }
    } catch (error) {
      setResponse("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="patient-page">
      <div className="form-container">
        <div className="header-section">
          <h1 className="header-title">Add New Patient</h1>
          <p className="header-subtitle">Fill in the details below to add a new patient.</p>
        </div>
        {response && (
          <Alert
            variant={response.includes("successfully") ? "success" : "danger"}
            className="response-alert"
          >
            {response}
          </Alert>
        )}
        {showSuccessPopup && (
          <div className="success-popup">Patient added successfully!</div>
        )}
        <Form onSubmit={handleAddPatient}>
          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Enter patient's full name"
              value={newPatient.name}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter patient's email"
              value={newPatient.email}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Date of Birth</Form.Label>
            <Form.Control
              type="date"
              name="dateOfBirth"
              value={newPatient.dateOfBirth}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Contact Details</Form.Label>
            <Form.Control
              type="text"
              name="contactDetails"
              placeholder="Enter patient's contact number"
              value={newPatient.contactDetails}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100">
            Add Patient
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Patient;