import React, { useState, useEffect } from "react";
import { Button, Form, Table, Alert, Container, Row, Col } from "react-bootstrap";
import "../CSS/DoctorSchedule.css";

const DoctorSchedule: React.FC = () => {
  interface TimeSlot {
    timeSlot: string;
    isBlocked: boolean;
  }

  interface Schedule {
    doctorId: string;
    doctorName: string;
    specialization: string;
    date: string;
    availableTimeSlots: TimeSlot[];
  }

  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [schedule, setSchedule] = useState<Schedule>({
    doctorId: "",
    doctorName: "",
    specialization: "",
    date: "",
    availableTimeSlots: [{ timeSlot: "", isBlocked: false }],
  });
  const [response, setResponse] = useState("");
  const token = localStorage.getItem("token");

  // Fetch existing schedules
  const fetchSchedules = async () => {
    try {
      const res = await fetch("http://localhost:8060/api/hospital/doctors/get", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
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
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(schedule),
      });

      if (res.ok) {
        setResponse("Doctor schedule added successfully");
        fetchSchedules();
        setSchedule({
          doctorId: "",
          doctorName: "",
          specialization: "",
          date: "",
          availableTimeSlots: [{ timeSlot: "", isBlocked: false }],
        });
      } else {
        setResponse("Failed to add doctor schedule");
      }
    } catch (error) {
      console.error(error);
      setResponse("Error adding doctor schedule");
    }
  };

  return (
    <div className="doctor-schedule-page">
      <Container>
        {/* Header Section */}
        <div className="header-section text-center">
          <h1 className="header-title">Doctor Schedule Management</h1>
          <p className="header-subtitle">
            Manage your availability and schedule appointments with ease.
          </p>
        </div>

        {/* Add Doctor Schedule Form */}
        <Row className="justify-content-center">
          <Col md={8}>
            <div className="form-container">
              {response && (
                <Alert
                  variant={response.includes("successfully") ? "success" : "danger"}
                >
                  {response}
                </Alert>
              )}
              <Form onSubmit={handleAddSchedule}>
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
                  <Form.Label>Doctor Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="doctorName"
                    value={schedule.doctorName}
                    onChange={handleInputChange}
                    placeholder="Enter doctor name"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Specialization</Form.Label>
                  <Form.Control
                    type="text"
                    name="specialization"
                    value={schedule.specialization}
                    onChange={handleInputChange}
                    placeholder="Enter specialization"
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
                        onChange={(e) =>
                          handleTimeSlotChange(index, "timeSlot", e.target.value)
                        }
                        required
                      />
                    </Form.Group>
                    <Form.Check
                      type="checkbox"
                      label="Blocked"
                      checked={slot.isBlocked}
                      onChange={(e) =>
                        handleTimeSlotChange(index, "isBlocked", e.target.checked)
                      }
                    />
                  </div>
                ))}
                <Button
                  variant="secondary"
                  onClick={() =>
                    setSchedule({
                      ...schedule,
                      availableTimeSlots: [
                        ...schedule.availableTimeSlots,
                        { timeSlot: "", isBlocked: false },
                      ],
                    })
                  }
                >
                  Add Time Slot
                </Button>
                <Button variant="primary" type="submit" className="ms-3">
                  Add Schedule
                </Button>
              </Form>
            </div>
          </Col>
        </Row>

        {/* Doctor Schedule List */}
        <Row className="mt-5">
          <Col>
            <h3 className="text-center">Doctor Schedules</h3>
            <Table striped bordered hover className="schedule-table">
              <thead>
                <tr>
                  <th>Doctor ID</th>
                  <th>Doctor Name</th>
                  <th>Specialization</th>
                  <th>Date</th>
                  <th>Available Time Slots</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map((s) => (
                  <tr key={`${s.doctorId}-${s.date}`}>
                    <td>{s.doctorId}</td>
                    <td>{s.doctorName}</td>
                    <td>{s.specialization}</td>
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
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DoctorSchedule;