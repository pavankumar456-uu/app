import React, { useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode"; // Import jwt-decode to decode JWT token
import { useNavigate } from "react-router-dom";
import { Button, Table, Modal, Form, Alert } from "react-bootstrap";
import "../CSS/ViewAppointment.css"; // Import the CSS file for styling

const ViewAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [response, setResponse] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [email, setEmail] = useState<string | null>(null); // State to store email from JWT
  const [updatedDate, setUpdatedDate] = useState<string>(""); // State for updated date
  const [updatedTime, setUpdatedTime] = useState<string>(""); // State for updated time
  const navigate = useNavigate();

  // Retrieve the JWT token from localStorage
  const token = localStorage.getItem("token");

  // Decode JWT token to extract email
  useEffect(() => {
    if (token) {
      try {
        const decodedToken: { sub: string } = jwtDecode(token); // Decode the JWT token
        setEmail(decodedToken.sub); // Extract the email from the "sub" field
        console.log("Extracted email from JWT:", decodedToken.sub);
      } catch (error) {
        console.error("Failed to decode JWT token:", error);
        setResponse("Invalid token. Please log in again.");
        localStorage.clear();
        navigate("/");
      }
    } else {
      setResponse("Token is missing. Please log in again.");
      navigate("/");
    }
  }, [token, navigate]);

  // Fetch appointments for the patient using email
  const fetchAppointments = async () => {
    if (!email) {
      setResponse("Email is missing. Please log in again.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8060/api/hospital/appointments/patient?email=${email}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Include token in the Authorization header
        },
      });
      if (res.ok) {
        const data = await res.json();
        setAppointments(data);
      } else {
        setResponse("Failed to fetch appointments");
      }
    } catch (error) {
      console.error(error);
      setResponse("Error fetching appointments");
    }
  };

  useEffect(() => {
    if (email) {
      fetchAppointments();
    }
  }, [email]);

  // Handle edit appointment
  const handleEditAppointment = (appointment: any) => {
    setSelectedAppointment(appointment);
    setUpdatedDate(appointment.doctor?.date || ""); // Pre-fill the date
    setUpdatedTime(appointment.appointmentTime || ""); // Pre-fill the time
    setShowEditModal(true);
  };

  // Handle save changes for the edited appointment
  const handleSaveChanges = async () => {
    if (!selectedAppointment) return;

    // Combine updatedDate and updatedTime into the required format
    const formattedDateTime = `${updatedDate} ${updatedTime}:00`; // Add seconds to match the format

    try {
      const res = await fetch(
        `http://localhost:8060/api/hospital/appointments/${selectedAppointment.appointmentId}/reschedule`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formattedDateTime), // Send updated date and time
        }
      );

      if (res.ok) {
        setResponse("Appointment updated successfully");
        setShowEditModal(false);
        fetchAppointments(); // Refresh the appointments list
      } else {
        const errorText = await res.text();
        setResponse(`Failed to update appointment: ${errorText}`);
      }
    } catch (error) {
      console.error(error);
      setResponse("Error updating appointment");
    }
  };

  // Handle cancel appointment
  const handleCancelAppointment = async (appointmentId: number) => {
    try {
      const res = await fetch(`http://localhost:8060/api/hospital/appointments/${appointmentId}/cancel`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setResponse("Appointment cancelled successfully");
        fetchAppointments();
      } else {
        setResponse("Failed to cancel appointment");
      }
    } catch (error) {
      console.error(error);
      setResponse("Error cancelling appointment");
    }
  };

  return (
    <div className="view-appointment-page">
      <div className="container my-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="text-center">Appointments Details</h1>
          <div>
            {/* Back Button */}
            <Button variant="secondary" className="me-2" onClick={() => navigate(-1)}>
              Back
            </Button>
            {/* Home Button */}
            <Button variant="primary" onClick={() => navigate("/")}>
              Home
            </Button>
          </div>
        </div>

        {response && <Alert variant={response.includes("successfully") ? "success" : "danger"}>{response}</Alert>}

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Appointment ID</th>
              <th>Doctor ID</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.appointmentId}>
                <td>{appointment.appointmentId}</td>
                <td>{appointment.doctor?.doctorId || "N/A"}</td>
                <td>{appointment.doctor?.date || "N/A"}</td> {/* Ensure date is displayed */}
                <td>{appointment.appointmentTime || "N/A"}</td> {/* Ensure time is displayed */}
                <td>{appointment.status || "N/A"}</td>
                <td>
                  <Button variant="warning" className="me-2" onClick={() => handleEditAppointment(appointment)}>
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => handleCancelAppointment(appointment.appointmentId)}>
                    Cancel
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Edit Appointment Modal */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Appointment</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Doctor ID</Form.Label>
                <Form.Control type="text" value={selectedAppointment?.doctor?.doctorId || ""} readOnly />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  value={updatedDate}
                  onChange={(e) => setUpdatedDate(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Time</Form.Label>
                <Form.Control
                  type="time"
                  value={updatedTime}
                  onChange={(e) => setUpdatedTime(e.target.value)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSaveChanges}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default ViewAppointments;