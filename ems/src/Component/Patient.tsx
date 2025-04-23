import React, { useState } from "react";
import { Button, Form, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../CSS/Patient.css"; // Import the CSS file for advanced styling

const Patient: React.FC = () => {
  const [response, setResponse] = useState("");
  const [newPatient, setNewPatient] = useState({
    name: "",
    email: "",
    dateOfBirth: "",
    contactDetails: "",
  });
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
          Authorization: `Bearer ${token}`, // Include token in the Authorization header
        },
        body: JSON.stringify(newPatient),
      });
      if (res.ok) {
        setResponse("Patient added successfully");
        setShowSuccessPopup(true); // Show success popup
        setTimeout(() => {
          navigate("/patient"); // Redirect to PatientDashboard after 2 seconds
        }, 2000);
      } else {
        const errorText = await res.text();
        setResponse(`Failed to add patient: ${errorText}`);
      }
    } catch (error) {
      console.error(error);
      setResponse("Error adding patient");
    }
  };

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4 text-primary">Patient Management</h1>

      {response && (
        <Alert variant={response.includes("successfully") ? "success" : "danger"}>
          {response}
        </Alert>
      )}

      {/* Success Popup */}
      {showSuccessPopup && (
        <Alert variant="success" className="text-center">
          Patient Details Added Successfully!
        </Alert>
      )}

      {/* Add Patient Form */}
      <div className="bg-light p-4 rounded shadow-sm mb-4">
        <h3 className="text-secondary mb-3">Add New Patient</h3>
        <Form onSubmit={handleAddPatient}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={newPatient.name}
              onChange={handleInputChange}
              placeholder="Enter patient name"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={newPatient.email}
              onChange={handleInputChange}
              placeholder="Enter patient email"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Date of Birth</Form.Label>
            <Form.Control
              type="date"
              name="dateOfBirth"
              value={newPatient.dateOfBirth}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Contact Details</Form.Label>
            <Form.Control
              type="text"
              name="contactDetails"
              value={newPatient.contactDetails}
              onChange={handleInputChange}
              placeholder="Enter contact details (10 digits)"
              pattern="^\d{10}$"
              title="Contact details must be 10 digits"
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