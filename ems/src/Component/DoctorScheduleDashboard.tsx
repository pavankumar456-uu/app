// import React from "react";
// import { useNavigate } from "react-router-dom";
// import "../CSS/DoctorScheduleDashboard.css"; // Import the CSS file for styling

// const DoctorScheduleDashboard: React.FC = () => {
//   const navigate = useNavigate();

//   const handleAddScheduleClick = () => {
//     navigate("/doctorschedule"); // Redirect to Add Schedule page (absolute path)
//   };

//   const handleAddMedicalDetailsClick = () => {
//     navigate("/addmedicalhistory"); // Redirect to Add Medical Details page
//   };

//   const handleLogout = () => {
//     localStorage.clear(); // Clear localStorage
//     navigate("/"); // Redirect to login page
//   };

//   return (
//     <div className="doctor-dashboard-container">
//       <button className="logout-button" onClick={handleLogout}>
//         Logout
//       </button>
//       <h1 className="text-center mb-4 text-primary">Doctor Schedule Dashboard</h1>
//       <div className="cards-container">
//         {/* Add Schedule Card */}
//         <div className="card" onClick={handleAddScheduleClick}>
//           <h3>Add Schedule</h3>
//           <p>Click here to add your schedule.</p>
//         </div>

//         {/* Add Medical Details Card */}
//         <div className="card" onClick={handleAddMedicalDetailsClick}>
//           <h3>Add Medical Details</h3>
//           <p>Click here to add medical details for a patient.</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DoctorScheduleDashboard;



import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Row, Col, Card } from "react-bootstrap";
import "../CSS/DoctorScheduleDashboard.css";

const DoctorScheduleDashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleAddScheduleClick = () => {
    navigate("/doctorschedule"); // Redirect to Add Schedule page
  };

  const handleAddMedicalDetailsClick = () => {
    navigate("/addmedicalhistory"); // Redirect to Add Medical Details page
  };

  const handleHomeClick = () => {
    navigate("/"); // Redirect to homepage
  };

  const handleBackClick = () => {
    navigate(-1); // Navigate to the previous page
  };

  const handleLogout = () => {
    localStorage.clear(); // Clear localStorage
    navigate("/"); // Redirect to login page
  };

  return (
    <div className="doctor-dashboard">
      <Container>
        {/* Top Navigation Buttons */}
        <div className="top-navigation-buttons">
          <Button variant="secondary" onClick={handleBackClick}>
            Back
          </Button>
          <Button variant="primary" onClick={handleHomeClick}>
            Home
          </Button>
        </div>

        {/* Logout Button */}
        <div className="logout-container text-end">
          <Button variant="danger" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        {/* Dashboard Title */}
        <h1 className="dashboard-title text-center">Doctor Dashboard</h1>
        <p className="dashboard-subtitle text-center">
          Manage your schedules and medical details with ease.
        </p>

        {/* Dashboard Cards */}
        <Row className="cards-container">
          <Col md={6}>
            <Card className="dashboard-card" onClick={handleAddScheduleClick}>
              <Card.Img
                variant="top"
                src="/images/Doctorschedule.png"
                alt="Add Schedule"
                className="card-image"
              />
              <Card.Body>
                <Card.Title>Add Schedule</Card.Title>
                <Card.Text>Manage your availability and schedule appointments.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="dashboard-card" onClick={handleAddMedicalDetailsClick}>
              <Card.Img
                variant="top"
                src="/images/Medicalhistory.jpg"
                alt="Add Medical Details"
                className="card-image"
              />
              <Card.Body>
                <Card.Title>Add Medical Details</Card.Title>
                <Card.Text>Update patient medical history and records.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DoctorScheduleDashboard;