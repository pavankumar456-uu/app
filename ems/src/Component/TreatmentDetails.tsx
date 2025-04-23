import React, { useEffect, useState } from "react";
import { Table, Alert, Container, Button } from "react-bootstrap";
import {jwtDecode} from "jwt-decode";
import "../CSS/TreatmentDetails.css"; // Import the CSS file for styling
import { useNavigate } from "react-router-dom";

const TreatmentDetails: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const email = token ? (jwtDecode(token) as { sub: string }).sub : null;

  const [medicalHistory, setMedicalHistory] = useState<any[]>([]);
  const [response, setResponse] = useState<string | null>(null);

  // Fetch medical history
  const fetchMedicalHistory = async () => {
    if (!email) return;

    try {
      const res = await fetch(`http://localhost:8060/api/hospital/history/view?email=${email}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        setMedicalHistory(data);
      } else {
        setResponse("Failed to fetch medical history");
      }
    } catch (error) {
      console.error("Error fetching medical history:", error);
      setResponse("Error fetching medical history");
    }
  };

  useEffect(() => {
    fetchMedicalHistory();
  }, [email]);

  return (
    <div className="treatment-details-page">
      <Container>
        {/* Navigation Button */}
        <div className="navigation-buttons">
          <Button variant="secondary" onClick={() => navigate(-1)} className="back-button">
            Back
          </Button>
        </div>

        {/* Page Title */}
        <h1 className="text-center page-title">Treatment Details</h1>

        {/* Alert for Errors */}
        {response && (
          <Alert variant="danger" className="custom-alert">
            {response}
          </Alert>
        )}

        {/* Medical History Table */}
        <div className="table-container">
          <Table striped bordered hover className="custom-table">
            <thead>
              <tr>
                <th>Diagnosis</th>
                <th>Treatment</th>
                <th>Date of Visit</th>
              </tr>
            </thead>
            <tbody>
              {medicalHistory.map((history, index) => (
                <tr key={index}>
                  <td>{history.diagnosis}</td>
                  <td>{history.treatment}</td>
                  <td>{new Date(history.dateOfVisit).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Container>
    </div>
  );
};

export default TreatmentDetails;