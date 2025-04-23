import React from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/DoctorScheduleDashboard.css"; // Import the CSS file for styling

const DoctorScheduleDashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleAddScheduleClick = () => {
    navigate("/doctorschedule"); // Redirect to Add Schedule page (absolute path)
  };

  const handleAddMedicalDetailsClick = () => {
    navigate("/addmedicalhistory"); // Redirect to Add Medical Details page
  };

  const handleLogout = () => {
    localStorage.clear(); // Clear localStorage
    navigate("/"); // Redirect to login page
  };

  return (
    <div className="doctor-dashboard-container">
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
      <h1 className="text-center mb-4 text-primary">Doctor Schedule Dashboard</h1>
      <div className="cards-container">
        {/* Add Schedule Card */}
        <div className="card" onClick={handleAddScheduleClick}>
          <h3>Add Schedule</h3>
          <p>Click here to add your schedule.</p>
        </div>

        {/* Add Medical Details Card */}
        <div className="card" onClick={handleAddMedicalDetailsClick}>
          <h3>Add Medical Details</h3>
          <p>Click here to add medical details for a patient.</p>
        </div>
      </div>
    </div>
  );
};

export default DoctorScheduleDashboard;