import React, { useState, useEffect } from "react";
import { Button, Form, Table, Alert, Modal } from "react-bootstrap";
import "../CSS/DoctorSchedule.css";

const DoctorSchedule: React.FC = () => {
  interface TimeSlot {
    timeSlot: string;
    isBlocked: boolean;
  }

  interface Schedule {
    doctorId: string;
    date: string;
    availableTimeSlots: TimeSlot[];
  }

  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [schedule, setSchedule] = useState<Schedule>({
    doctorId: "",
    date: "",
    availableTimeSlots: [{ timeSlot: "", isBlocked: false }],
  });
  const [response, setResponse] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editScheduleId, setEditScheduleId] = useState<number | null>(null);

  // Retrieve the JWT token from localStorage
  const token = localStorage.getItem("token");

  const fetchSchedules = async () => {
    try {
      const res = await fetch("http://localhost:8060/api/hospital/doctors/get", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Include token in the Authorization header
        },
      });
      if (res.ok) {
        const data = await res.json();
        setSchedules(data);
      } else {
        setResponse("Failed to fetch doctor schedules");
      }
    } catch (error) {
      console.error(error);
      setResponse("Error fetching doctor schedules");
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSchedule({ ...schedule, [name]: value });
  };

  // Handle time slot changes
  const handleTimeSlotChange = (index: number, field: string, value: any) => {
    const updatedTimeSlots = [...schedule.availableTimeSlots];
    updatedTimeSlots[index] = { ...updatedTimeSlots[index], [field]: value };
    setSchedule({ ...schedule, availableTimeSlots: updatedTimeSlots });
  };

  // Add a new doctor schedule
  const handleAddSchedule = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8060/api/hospital/doctors/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include token in the Authorization header
        },
        body: JSON.stringify(schedule),
      });
  
      // Check if the response is OK
      if (res.ok) {
        // Attempt to parse the response as JSON
        const data = await res.json().catch(() => null); // Handle empty or invalid JSON
        setResponse(data?.message || "Doctor schedule added successfully");
        fetchSchedules(); // Refresh the schedules list
        setSchedule({
          doctorId: "",
          date: "",
          availableTimeSlots: [{ timeSlot: "", isBlocked: false }],
        }); // Reset the form
      } else {
        const errorData = await res.json().catch(() => null); // Handle empty or invalid JSON
        setResponse(errorData?.message || "Failed to add doctor schedule");
      }
    } catch (error) {
      console.error(error);
      setResponse("Error adding doctor schedule");
    }
  };
  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Doctor Schedule Management</h1>

      {response && <Alert variant={response.includes("successfully") ? "success" : "danger"}>{response}</Alert>}

      {/* Add Doctor Schedule Form */}
      <Form onSubmit={handleAddSchedule} className="mb-4">
        <h3>Add New Doctor Schedule</h3>
        <Form.Group className="mb-3">
          <Form.Label>Doctor ID</Form.Label>
          <Form.Control
            type="text"
            name="doctorId"
            value={schedule.doctorId}
            onChange={handleInputChange}
            placeholder="Enter doctor ID"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Date</Form.Label>
          <Form.Control
            type="date"
            name="date"
            value={schedule.date}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <h5>Available Time Slots</h5>
        {schedule.availableTimeSlots.map((slot, index) => (
          <div key={index} className="mb-3">
            <Form.Group>
              <Form.Label>Time Slot</Form.Label>
              <Form.Control
                type="time"
                value={slot.timeSlot}
                onChange={(e) => handleTimeSlotChange(index, "timeSlot", e.target.value)}
                required
              />
            </Form.Group>
            <Form.Check
              type="checkbox"
              label="Blocked"
              checked={slot.isBlocked}
              onChange={(e) => handleTimeSlotChange(index, "isBlocked", e.target.checked)}
            />
          </div>
        ))}
        <Button
          variant="secondary"
          onClick={() =>
            setSchedule({
              ...schedule,
              availableTimeSlots: [...schedule.availableTimeSlots, { timeSlot: "", isBlocked: false }],
            })
          }
        >
          Add Time Slot
        </Button>
        <Button variant="primary" type="submit" className="ms-3">
          Add Schedule
        </Button>
      </Form>

      {/* Doctor Schedule List */}
      <h3>Doctor Schedules</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Doctor ID</th>
            <th>Date</th>
            <th>Available Time Slots</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((s) => (
            <tr key={`${s.doctorId}-${s.date}`}>
              <td>{s.doctorId}</td>
              <td>{s.date}</td>
              <td>
                {s.availableTimeSlots.map((slot, index) => (
                  <div key={index}>
                    {slot.timeSlot} - {slot.isBlocked ? "Blocked" : "Available"}
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default DoctorSchedule;