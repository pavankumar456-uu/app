import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Table, Alert } from "react-bootstrap";
import {jwtDecode} from "jwt-decode"; // Fix: Corrected import statement (removed curly braces)
import "../CSS/BookAppointment.css"; // Import the CSS file for styling

interface TimeSlot {
  timeSlot: string;
  isBlocked: boolean;
}

interface DoctorSchedule {
  doctorId: string;
  doctorName: string;
  specialization: string;
  date: string;
  availableTimeSlots: TimeSlot[];
}

const BookAppointment: React.FC = () => {
  const [doctorSchedules, setDoctorSchedules] = useState<DoctorSchedule[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [response, setResponse] = useState<string>(""); // State for success/error messages
  const [showSuccess, setShowSuccess] = useState<boolean>(false); // State to control success message visibility
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const [patientEmail, setPatientEmail] = useState<string>("");

  // Decode the JWT token to extract the patient email
  useEffect(() => {
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token); // Decode the token
        if (decodedToken && decodedToken.sub) {
          setPatientEmail(decodedToken.sub); // Extract the email from the "sub" field
        } else {
          setResponse("Failed to extract patient email from token.");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        setResponse("Invalid token. Please log in again.");
        localStorage.clear();
        navigate("/login");
      }
    } else {
      setResponse("Token is missing. Please log in again.");
      navigate("/login");
    }
  }, [token, navigate]);

  // Fetch doctor schedules
  const fetchDoctorSchedules = async () => {
    try {
      const res = await fetch("http://localhost:8060/api/hospital/doctors/get", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Include token in the Authorization header
        },
      });
      if (res.ok) {
        const data = await res.json();
        setDoctorSchedules(data);
      } else {
        setResponse("Failed to fetch doctor schedules");
      }
    } catch (error) {
      console.error(error);
      setResponse("Error fetching doctor schedules");
    }
  };

  useEffect(() => {
    fetchDoctorSchedules();
  }, []);

  // Handle booking an appointment
  const handleBookAppointment = async () => {
    if (!selectedDoctorId || !selectedDate || !selectedTimeSlot) {
      setResponse("Please select a doctor, date, and time slot.");
      return;
    }

    const appointmentData = {
      doctor: { doctorId: selectedDoctorId, date: selectedDate },
      appointmentTime: selectedTimeSlot,
      status: "SCHEDULED",
    };

    console.log("Booking Appointment Payload:", appointmentData); // Log the payload for debugging

    try {
      // Step 1: Book the appointment
      const res = await fetch(
        `http://localhost:8060/api/hospital/appointments/book?email=${patientEmail}`, // Include the email in the query parameter
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include token in the Authorization header
          },
          body: JSON.stringify(appointmentData),
        }
      );

      if (res.ok) {
        setResponse("Appointment booked successfully!");
        setShowSuccess(true); // Show success message

        // Step 2: Call the backend to update the time slot as booked
        const updateRes = await fetch(
          `http://localhost:8060/api/hospital/doctors/update-time-slot?doctorId=${selectedDoctorId}&date=${selectedDate}&timeSlot=${selectedTimeSlot}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (updateRes.ok) {
          console.log("Time slot updated successfully in the database.");
          fetchDoctorSchedules(); // Fetch updated schedules to reflect changes
        } else {
          const errorText = await updateRes.text();
          console.error("Error updating time slot:", errorText);
          setResponse("Failed to update time slot in the database.");
        }

        // Hide the success message after 3 seconds
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      } else {
        const errorText = await res.text();
        console.error("Error Response:", errorText);
        setResponse("Failed to book appointment: " + errorText);
      }
    } catch (error) {
      console.error("Error:", error);
      setResponse("Error booking appointment");
    }
  };

  return (
    <div className="book-appointment-page">
      <div className="container my-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="text-center">Book an Appointment</h1>
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

        {/* Success Message */}
        {showSuccess && (
          <Alert variant="success" className="text-center">
            Appointment booked successfully!
          </Alert>
        )}

        {/* Error/Response Message */}
        {response && !showSuccess && (
          <Alert variant={response.includes("successfully") ? "success" : "danger"}>{response}</Alert>
        )}

        {/* Doctor Schedule Table */}
        <h3>Select a Doctor and Time Slot</h3>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Doctor ID</th>
              <th>Doctor Name</th>
              <th>Specialization</th>
              <th>Date</th>
              <th>Available Time Slots</th>
              <th>Select</th>
            </tr>
          </thead>
          <tbody>
            {doctorSchedules.map((schedule) => (
              <tr key={`${schedule.doctorId}-${schedule.date}`}>
                <td>{schedule.doctorId}</td>
                <td>{schedule.doctorName}</td>
                <td>{schedule.specialization}</td>
                <td>{schedule.date}</td>
                <td>
                  {schedule.availableTimeSlots.map((slot, index) => (
                    <div
                      key={index}
                      style={{
                        color: slot.isBlocked ? "red" : "green",
                        fontWeight: slot.isBlocked ? "bold" : "normal",
                      }}
                    >
                      {slot.timeSlot} {slot.isBlocked && "(Booked)"}
                    </div>
                  ))}
                </td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setSelectedDoctorId(schedule.doctorId);
                      setSelectedDate(schedule.date);
                    }}
                    disabled={schedule.availableTimeSlots.every((slot) => slot.isBlocked)}
                  >
                    Select
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Time Slot Selection */}
        {selectedDoctorId && selectedDate && (
          <div className="mt-4">
            <h4>Selected Doctor: {selectedDoctorId}</h4>
            <h4>Selected Date: {selectedDate}</h4>
            <Form.Group>
              <Form.Label>Select Time Slot</Form.Label>
              <Form.Control
                as="select"
                value={selectedTimeSlot}
                onChange={(e) => setSelectedTimeSlot(e.target.value)}
              >
                <option value="">Select a time slot</option>
                {doctorSchedules
                  .find((schedule) => schedule.doctorId === selectedDoctorId && schedule.date === selectedDate)
                  ?.availableTimeSlots.filter((slot) => !slot.isBlocked)
                  .map((slot, index) => (
                    <option key={index} value={slot.timeSlot}>
                      {slot.timeSlot}
                    </option>
                  ))}
              </Form.Control>
            </Form.Group>
            <Button variant="success" className="mt-3" onClick={handleBookAppointment}>
              Book Appointment
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookAppointment;