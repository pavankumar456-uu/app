import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Container, Row, Col, Modal, Dropdown } from "react-bootstrap";
import { FaBell } from "react-icons/fa"; // Import a bell icon for notifications
import {jwtDecode} from "jwt-decode"; // Import jwt-decode for decoding JWT token
import "../CSS/PatientDashboard.css";
import backArrow from "../assets/left-chevron.png" ;

const PatientDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Retrieve email from JWT token stored in localStorage
  const token = localStorage.getItem("token");
  const email = token ? (jwtDecode(token) as { sub: string }).sub : null;

  // State for notifications
  const [notifications, setNotifications] = useState<any[]>([]);

  // Fetch notifications for the patient
  const fetchNotifications = async () => {
    if (!email) return;

    try {
      const res = await fetch(`http://localhost:8060/api/hospital/notifications/patient?email=${email}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      } else {
        console.error("Failed to fetch notifications");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Fetch notifications on component mount
  useEffect(() => {
    fetchNotifications();
  }, [email]);

  // Handlers for navigation
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="patient-dashboard">
      <Container>
        {/* Top Navigation Buttons */}
        <div className="top-navigation-buttons d-flex justify-content-between align-items-center">
          <div>
            <Button variant="secondary" onClick={() => navigate(-1)}>
              <img className="arrow" src={backArrow} alt="" />
            </Button>
            <Button variant="primary" onClick={() => navigate("/")} className="ms-2">
              Home
            </Button>
          </div>

          {/* Notification and Logout Buttons */}
          <div className="notification-logout-container">
            <Dropdown className="notification-icon">
              <Dropdown.Toggle variant="light" id="dropdown-basic">
                <FaBell size={24} />
                {notifications.length > 0 && (
                  <span className="notification-badge">{notifications.length}</span>
                )}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {notifications.length > 0 ? (
                  notifications.map((notification, index) => (
                    <Dropdown.Item key={index}>{notification.message}</Dropdown.Item>
                  ))
                ) : (
                  <Dropdown.Item>No notifications</Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>

            <Button variant="danger" onClick={handleLogout} className="logout-button ms-2">
              Logout
            </Button>
          </div>
        </div>

        {/* Dashboard Title */}
        <h1 className="dashboard-title text-center">Welcome to Your Dashboard</h1>
        <p className="dashboard-subtitle text-center">
          Manage your appointments, personal details, and more.
        </p>

        {/* Dashboard Cards */}
        <Row className="cards-container">
          <Col md={3}>
            <Card className="dashboard-card" onClick={() => navigate("/add-patient")}>
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
            <Card className="dashboard-card" onClick={() => navigate(`/viewappointments?email=${email}`)}>
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
            <Card className="dashboard-card" onClick={() => navigate(`/bookappointment?email=${email}`)}>
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
            <Card className="dashboard-card" onClick={() => navigate(`/treatmentdetails?email=${email}`)}>
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
      </Container>
    </div>
  );
};

export default PatientDashboard;