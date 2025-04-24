import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Container, Row, Col, Modal, Dropdown } from "react-bootstrap";
import { FaBell } from "react-icons/fa"; // Import a bell icon for notifications
import {jwtDecode} from "jwt-decode"; // Import jwt-decode for decoding JWT token
import "../CSS/PatientDashboard.css";

const PatientDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Retrieve email from JWT token stored in localStorage
  const token = localStorage.getItem("token");
  const email = token ? (jwtDecode(token) as { sub: string }).sub : null;
  console.log(email);
  // State for notifications
  const [notifications, setNotifications] = useState<any[]>([]);

  // Fetch notifications for the patient
  const fetchNotifications = async () => {
    if (!email) return;

    try {
      // Use the correct backend endpoint to fetch notifications by patient email
      const res = await fetch(`http://localhost:8060/api/hospital/notifications/patient?email=${email}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Fetched notifications:", data); // Debugging log

        // Filter notifications that start with "Hi"
        const filteredNotifications = data.filter((notification: any) =>
          notification.message?.startsWith("Dear")
        );
        console.log("Filtered notifications:", filteredNotifications); // Debugging log
        setNotifications(filteredNotifications);
      } else {
        const errorText = await res.text();
        console.error("Failed to fetch notifications:", errorText);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Fetch notifications on component mount
  useEffect(() => {
    fetchNotifications();
  }, [email]);

  // State for modal
  const [showModal, setShowModal] = React.useState(false);

  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => setShowModal(true);

  // Handlers for navigation
  const handleHomeClick = () => {
    navigate("/"); // Redirect to homepage
  };

  const handleBackClick = () => {
    navigate(-1); // Navigate to the previous page
  };

  const handlePatientDetailsClick = () => {
    navigate("/add-patient"); // Redirect to Add Patient Details page
  };

  const handleViewAppointmentClick = () => {
    navigate(`/viewappointments?email=${email}`); // Redirect to View Appointments page
  };

  const handleBookAppointmentClick = () => {
    navigate(`/bookappointment?email=${email}`); // Redirect to Book Appointment page
  };

  const handleTreatmentDetailsClick = () => {
    navigate(`/treatmentdetails?email=${email}`); // Redirect to Treatment Details page
  };

  const handleLogout = () => {
    // Clear localStorage and redirect to login page
    localStorage.removeItem("token"); // Remove the token entirely
    navigate("/", { replace: true }); // Redirect to the login page and replace history
  };

  return (
    <div className="patient-dashboard">
      <Container>
        {/* Top Navigation Buttons */}
        <div className="top-navigation-buttons d-flex justify-content-between align-items-center">
          <div>
            <Button variant="secondary" onClick={handleBackClick}>
              Back
            </Button>
            <Button variant="primary" onClick={handleHomeClick} className="ms-2">
              Home
            </Button>
          </div>

          {/* New Notification Icon */}
          <div className="notification-icon">
            <Dropdown>
              <Dropdown.Toggle variant="light" id="dropdown-basic">
                <FaBell size={18} /> {/* Smaller notification icon */}
                {notifications.length > 0 && (
                  <span className="notification-badge">{notifications.length}</span>
                )}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {notifications.length > 0 ? (
                  notifications.map((notification, index) => (
                    <Dropdown.Item key={index}>
                      {notification.message}
                    </Dropdown.Item>
                  ))
                ) : (
                  <Dropdown.Item>No notifications</Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>

        {/* Logout Button */}
        <div className="logout-container text-end">
          <Button variant="danger" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        {/* Dashboard Title */}
        <h1 className="dashboard-title text-center">Welcome to Your Dashboard</h1>
        <p className="dashboard-subtitle text-center">
          Manage your appointments, personal details, and more.
        </p>

        {/* Dashboard Cards */}
        <Row className="cards-container">
          <Col md={3}>
            <Card className="dashboard-card" onClick={handlePatientDetailsClick}>
              <Card.Img
                variant="top"
                src="/images/Patientdetails.png"
                alt="Patient Details"
                className="card-image"
              />
              <Card.Body>
                <Card.Title>Patient Details</Card.Title>
                <Card.Text>View or update your personal details.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="dashboard-card" onClick={handleViewAppointmentClick}>
              <Card.Img
                variant="top"
                src="/images/Viewappointment.jfif"
                alt="View Appointments"
                className="card-image"
              />
              <Card.Body>
                <Card.Title>View Appointments</Card.Title>
                <Card.Text>Check your scheduled appointments.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="dashboard-card" onClick={handleBookAppointmentClick}>
              <Card.Img
                variant="top"
                src="/images/Bookappointment.jfif"
                alt="Book Appointment"
                className="card-image"
              />
              <Card.Body>
                <Card.Title>Book Appointment</Card.Title>
                <Card.Text>Schedule a new appointment with a doctor.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="dashboard-card" onClick={handleTreatmentDetailsClick}>
              <Card.Img
                variant="top"
                src="/images/Treatmentdetails.jpg"
                alt="Treatment Details"
                className="card-image"
              />
              <Card.Body>
                <Card.Title>Treatment Details</Card.Title>
                <Card.Text>View your medical history and treatments.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Help Section */}
        <div className="help-section text-center mt-4">
          <Button variant="info" onClick={handleModalShow}>
            Need Help?
          </Button>
        </div>

        {/* Help Modal */}
        <Modal show={showModal} onHide={handleModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>How Can We Help You?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              If you have any questions or need assistance, please contact our support team at{" "}
              <strong>support@hms.com</strong>.
            </p>
            <p>You can also call us at <strong>+1-800-123-4567</strong>.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleModalClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default PatientDashboard;