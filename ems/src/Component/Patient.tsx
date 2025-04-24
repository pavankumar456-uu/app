import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import "../CSS/Patient.css";

const Patient: React.FC = () => {
  const navigate = useNavigate();

  const [newPatient, setNewPatient] = useState({
    name: "",
    email: "",
    dateOfBirth: "",
    contactDetails: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    dateOfBirth: "",
    contactDetails: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPatient({ ...newPatient, [name]: value });

    // Clear the error for the field being updated
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: "", email: "", dateOfBirth: "", contactDetails: "" };

    // Name validation
    if (!newPatient.name.trim()) {
      newErrors.name = "Name is required.";
      isValid = false;
    } else if (newPatient.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters long.";
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!newPatient.email.trim()) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!emailRegex.test(newPatient.email)) {
      newErrors.email = "Please enter a valid email address.";
      isValid = false;
    }

    // Date of Birth validation
    if (!newPatient.dateOfBirth) {
      newErrors.dateOfBirth = "Date of Birth is required.";
      isValid = false;
    }

    // Contact Details validation
    const contactRegex = /^[0-9]{10}$/;
    if (!newPatient.contactDetails.trim()) {
      newErrors.contactDetails = "Contact number is required.";
      isValid = false;
    } else if (!contactRegex.test(newPatient.contactDetails)) {
      newErrors.contactDetails = "Contact number must be 10 digits.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleBackClick = () => {
    navigate(-1); // Navigate to the previous page
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      console.log("Patient data submitted:", newPatient);
      // Add logic to submit the form data
    }
  };

  return (
    <Container className="patient-form-container">
      {/* Back Button */}
      <button className="back-button" onClick={handleBackClick}>
        Back
      </button>

      <Row className="justify-content-center">
        <Col md={8}>
          <h1 className="form-title text-center">Enter the Patient Details</h1>
          <Form onSubmit={handleSubmit} className="patient-form">
            {/* Name Field */}
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter patient's name"
                value={newPatient.name}
                onChange={handleInputChange}
                isInvalid={!!errors.name}
                required
              />
              <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
            </Form.Group>

            {/* Email Field */}
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter patient's email"
                value={newPatient.email}
                onChange={handleInputChange}
                isInvalid={!!errors.email}
                required
              />
              <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
            </Form.Group>

            {/* Date of Birth Field */}
            <Form.Group className="mb-3">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                name="dateOfBirth"
                value={newPatient.dateOfBirth}
                onChange={handleInputChange}
                isInvalid={!!errors.dateOfBirth}
                required
              />
              <Form.Control.Feedback type="invalid">{errors.dateOfBirth}</Form.Control.Feedback>
            </Form.Group>

            {/* Contact Details Field */}
            <Form.Group className="mb-3">
              <Form.Label>Contact Details</Form.Label>
              <Form.Control
                type="text"
                name="contactDetails"
                placeholder="Enter patient's contact number"
                value={newPatient.contactDetails}
                onChange={handleInputChange}
                isInvalid={!!errors.contactDetails}
                required
              />
              <Form.Control.Feedback type="invalid">{errors.contactDetails}</Form.Control.Feedback>
            </Form.Group>

            <div className="text-center">
              <Button variant="primary" type="submit" className="submit-button">
                Submit
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Patient;