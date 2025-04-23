import React, { useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode"; // Import jwt-decode to decode JWT token
import { useNavigate } from "react-router-dom";
import { Button, Form, Table, Alert } from "react-bootstrap";

interface TimeSlot {
  timeSlot: string;
  isBlocked: boolean;
}

interface DoctorSchedule {
  doctorId: string;
  date: string;
  availableTimeSlots: TimeSlot[];
}

const BookAppointment: React.FC = () => {
  const [doctorSchedules, setDoctorSchedules] = useState<DoctorSchedule[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const navigate = useNavigate();

  // Retrieve the JWT token from localStorage
  const token = localStorage.getItem("token");
  const [email, setEmail] = useState<string | null>(null);

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

    if (!email) {
      setResponse("Email is missing. Please log in again.");
      return;
    }

    const appointmentData = {
      doctor: { doctorId: selectedDoctorId, date: selectedDate },
      appointmentTime: selectedTimeSlot,
      status: "SCHEDULED",
    };

    console.log("Booking Appointment Payload:", appointmentData); // Log the payload for debugging

    try {
      const res = await fetch(`http://localhost:8060/api/hospital/appointments/book?email=${email}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include token in the Authorization header
        },
        body: JSON.stringify(appointmentData),
      });

      if (res.ok) {
        setResponse("Appointment booked successfully!");
        navigate("/patient"); // Redirect to the patient profile page
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
    <div className="container my-5">
      <h1 className="text-center mb-4">Book an Appointment</h1>

      {response && <Alert variant={response.includes("successfully") ? "success" : "danger"}>{response}</Alert>}

      {/* Doctor Schedule Table */}
      <h3>Select a Doctor and Time Slot</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Doctor ID</th>
            <th>Date</th>
            <th>Available Time Slots</th>
            <th>Select</th>
          </tr>
        </thead>
        <tbody>
          {doctorSchedules.map((schedule) => (
            <tr key={`${schedule.doctorId}-${schedule.date}`}>
              <td>{schedule.doctorId}</td>
              <td>{schedule.date}</td>
              <td>
                {schedule.availableTimeSlots
                  .filter((slot) => !slot.isBlocked)
                  .map((slot, index) => (
                    <div key={index}>
                      {slot.timeSlot}
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
  );
};

export default BookAppointment;