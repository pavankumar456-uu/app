import React, { useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode"; // Import jwt-decode to decode JWT token
import { useNavigate } from "react-router-dom";
import { Button, Table, Modal, Form, Alert } from "react-bootstrap";

const ViewAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [response, setResponse] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [email, setEmail] = useState<string | null>(null); // State to store email from JWT
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
    setShowEditModal(true);
  };

  // Handle reschedule appointment
  const handleRescheduleAppointment = async (appointmentId: number, newDate: string, newTime: string) => {
    try {
      const res = await fetch(`http://localhost:8060/api/hospital/appointments/${appointmentId}/reschedule`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newDateTime: `${newDate} ${newTime}` }),
      });
      if (res.ok) {
        setResponse("Appointment rescheduled successfully");
        fetchAppointments();
      } else {
        setResponse("Failed to reschedule appointment");
      }
    } catch (error) {
      console.error(error);
      setResponse("Error rescheduling appointment");
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
    <div className="container my-5">
      <h1 className="text-center mb-4">Appointments for Email: {email}</h1>

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
          <Button
            variant="primary"
            className="me-2"
            onClick={() => handleRescheduleAppointment(appointment.appointmentId, "2023-10-15", "10:00:00")}
          >
            Reschedule
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
              <Form.Control type="date" defaultValue={selectedAppointment?.date || ""} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Time</Form.Label>
              <Form.Control type="time" defaultValue={selectedAppointment?.time || ""} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button variant="primary">Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ViewAppointments;