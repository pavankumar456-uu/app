import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./Component/Login";
import SignUp from "./Component/SignUp";
import DoctorSchedule from "./Component/DoctorSchedule";
import BookAppointment from "./Component/BookAppointment";
import ViewAppointments from "./Component/ViewAppointment";
import PatientDashboard from "./Component/PatientDashboard";
import Patient from "./Component/Patient";
import DoctorScheduleDashboard from "./Component/DoctorScheduleDashboard";
import AddMedicalHistory from "./Component/AddMedicalHistory";
function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Patient Routes */}
          <Route path="/patient" element={<PatientDashboard />} />
          <Route path="/add-patient" element={<Patient />} />
          <Route path="/viewappointments" element={<ViewAppointments />} />
          <Route path="/bookappointment" element={<BookAppointment />} />

          {/* Doctor Routes */}
          <Route path="/doctorscheduledashboard" element={<DoctorScheduleDashboard />} />
          <Route path="/doctorschedule" element={<DoctorSchedule />} />
          <Route path="/addmedicalhistory" element={<AddMedicalHistory />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;