import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/PatientDashboard.css"; // Import the CSS file for styling

const PatientDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Retrieve patientId from localStorage
  const email = localStorage.getItem("email");
  console.log("Retrieved patientId from localStorage:", email); // Debugging log

  // Redirect to login if patientId is missing
  useEffect(() => {
    if (!email) {
      alert("Patient ID is missing. Please log in again.");
      navigate("/");
    }
  }, [email, navigate]);

  // Handlers for navigation
  const handlePatientDetailsClick = () => {
    navigate("/add-patient"); // Redirect to Add Patient Details page
  };

  const handleViewAppointmentClick = () => {
    navigate(`/viewappointments?email=${email}`); // Redirect to View Appointments page
  };

  const handleBookAppointmentClick = () => {
    navigate(`/bookappointment?email=${email}`); // Redirect to Book Appointment page
  };

  const handleLogout = () => {
    // Clear localStorage and redirect to login page
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      {/* Logout Button */}
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>

      <h1 className="text-center mb-4 text-primary">Patient Dashboard</h1>
      <div className="cards-container">
        {/* Patient Details Card */}
        <div className="card" onClick={handlePatientDetailsClick}>
          <h3>Patient Details</h3>
          <p>Click here to add or update your patient details.</p>
        </div>

        {/* View Appointment Card */}
        <div className="card" onClick={handleViewAppointmentClick}>
          <h3>View Appointments</h3>
          <p>Click here to view your scheduled appointments.</p>
        </div>

        {/* Book Appointment Card */}
        <div className="card" onClick={handleBookAppointmentClick}>
          <h3>Book Appointment</h3>
          <p>Click here to book a new appointment with a doctor.</p>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;